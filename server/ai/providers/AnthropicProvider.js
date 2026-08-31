/* ==========================================================================
   FlutterHub AI Agent — Anthropic Provider Implementation
   Native Anthropic Messages API (works with Anthropic + Anthropic-compatible
   routers such as the co.agentrouter.org proxy configured via ANTHROPIC_BASE_URL).
   Supports function calling, streaming SSE, and vision (image) input.
   ========================================================================== */

const fetch = require('node-fetch');
const BaseProvider = require('./BaseProvider');

class AnthropicProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'anthropic';
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY
      || process.env.ANTHROPIC_AUTH_TOKEN || process.env.AI_API_KEY;
    this.baseUrl = (config.baseUrl || process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com')
      .replace(/\/$/, '');
    this.model = config.model || process.env.ANTHROPIC_MODEL || process.env.AI_MODEL || 'claude-3-5-sonnet-latest';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  // Translate OpenAI-shaped custom message envelope (systemPrompt, messages,
  // tools, image) into the Anthropic Messages API payload.
  buildPayload({ systemPrompt, messages = [], tools, image }) {
    const system = systemPrompt || 'You are Flutter Hub AI, a helpful assistant.';
    const anthropicMessages = this.toAnthropicMessages(messages, image);

    const payload = {
      model: this.model,
      max_tokens: 2500,
      system,
      messages: anthropicMessages,
    };

    if (tools && tools.length > 0) {
      payload.tools = tools.map((t) => ({
        name: t?.function?.name || t?.name,
        description: t?.function?.description || '',
        input_schema: this.toAnthropicSchema(t?.function?.parameters),
      }));
    }

    return payload;
  }

  toAnthropicSchema(parameters) {
    if (parameters && typeof parameters === 'object' && parameters.type === 'object') {
      return {
        type: 'object',
        properties: parameters.properties || {},
        required: parameters.required || [],
      };
    }
    return { type: 'object', properties: {}, required: [] };
  }

  toAnthropicMessages(messages = [], image) {
    const out = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLastUser = (i === messages.length - 1 && msg.role === 'user');

      // OpenAI tool result messages -> Anthropic user message with tool_result
      if (msg.role === 'tool') {
        out.push({
          role: 'user',
          content: [{
            type: 'tool_result',
            tool_use_id: msg.tool_call_id || msg.id || '',
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content || ''),
          }],
        });
        continue;
      }

      // Assistant message that carried tool calls -> Anthropic tool_use blocks
      if (msg.role === 'assistant' && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
        const blocks = [];
        if (msg.content) blocks.push({ type: 'text', text: msg.content });
        for (const tc of msg.tool_calls) {
          let input = {};
          try { input = JSON.parse(tc?.function?.arguments || '{}'); } catch (_) {}
          blocks.push({
            type: 'tool_use',
            id: tc.id || `toolu_${Date.now()}`,
            name: tc?.function?.name || '',
            input,
          });
        }
        out.push({ role: 'assistant', content: blocks });
        continue;
      }

      // Build a content block list for any message.
      const role = msg.role === 'assistant' ? 'assistant' : 'user';
      const blocks = [];

      // Attach image to the last user turn when provided.
      if (isLastUser && image && image.data) {
        const cleanBase64 = image.data.replace(/^data:[^;]+;base64,/, '');
        blocks.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: image.mimeType || 'image/png',
            data: cleanBase64,
          },
        });
      }

      const text = msg.content;
      if (text) {
        blocks.push(typeof text === 'string' ? { type: 'text', text } : text);
      }

      if (blocks.length > 0) {
        out.push({ role, content: blocks });
      }
    }
    return out;
  }

  async chat({ systemPrompt, messages = [], tools, image }) {
    if (!this.isConfigured()) {
      throw new Error('Anthropic API Key is not configured in server environment.');
    }

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(this.buildPayload({ systemPrompt, messages, tools, image })),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${errText}`);
    }

    const data = await res.json();

    let text = '';
    const toolCalls = [];
    const content = data.content || [];

    for (const block of content) {
      if (block?.type === 'text' && block.text) text += block.text;
      if (block?.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          type: 'function',
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input || {}),
          },
        });
      }
    }

    return {
      text,
      toolCalls,
      rawMessage: content,
      usage: data.usage,
    };
  }

  async chatStream({ systemPrompt, messages = [], tools, image, onChunk, onToolCall }) {
    if (!this.isConfigured()) {
      throw new Error('Anthropic API Key is not configured in server environment.');
    }

    const payload = this.buildPayload({ systemPrompt, messages, tools, image });
    payload.stream = true;

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic streaming error (${res.status}): ${errText}`);
    }

    let fullText = '';
    const pendingToolCalls = [];

    return new Promise((resolve, reject) => {
      let buffer = '';

      res.body.on('data', (chunk) => {
        buffer += chunk.toString();
        // SSE events are separated by blank lines.
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop();

        for (const rawEvent of events) {
          const textDelta = this.handleSseEvent(rawEvent, { onChunk, pendingToolCalls });
          if (textDelta) fullText += textDelta;
        }
      });

      res.body.on('end', () => {
        const validToolCalls = pendingToolCalls.filter(Boolean);
        validToolCalls.forEach((tc) => {
          if (onToolCall) onToolCall(tc);
        });
        resolve({
          text: fullText,
          toolCalls: validToolCalls,
        });
      });

      res.body.on('error', (err) => {
        reject(err);
      });
    });
  }

  // Parses one SSE event block and returns the incremental text produced
  // (empty string if none). Accumulates tool-use arguments into pendingToolCalls.
  handleSseEvent(rawEvent, { onChunk, pendingToolCalls }) {
    const eventLine = rawEvent.split('\n').find((l) => l.startsWith('event: '));
    const dataLines = rawEvent.split('\n').filter((l) => l.startsWith('data: '));
    if (dataLines.length === 0) return '';
    const event = eventLine ? eventLine.slice('event: '.length).trim() : '';
    let deltaText = '';

    for (const dl of dataLines) {
      const jsonStr = dl.slice('data: '.length).trim();
      if (!jsonStr) continue;
      let parsed;
      try { parsed = JSON.parse(jsonStr); } catch (_) { continue; }

      // content_block_start: text start or tool_use declaration
      if (event === 'content_block_start') {
        const block = parsed?.content_block;
        if (block?.type === 'tool_use') {
          pendingToolCalls[parsed.index || 0] = {
            id: block.id || `toolu_${Date.now()}_${parsed.index || 0}`,
            type: 'function',
            function: { name: block.name || '', arguments: '' },
          };
        }
        continue;
      }

      // content_block_delta: incremental text or tool input JSON
      if (event === 'content_block_delta') {
        const delta = parsed?.delta;
        if (!delta) continue;
        if (delta.type === 'text_delta' && delta.text) {
          deltaText += delta.text;
          if (onChunk) onChunk(delta.text);
        } else if (delta.type === 'input_json_delta' && delta.partial_json) {
          const idx = parsed?.index || 0;
          if (pendingToolCalls[idx]) {
            pendingToolCalls[idx].function.arguments += delta.partial_json;
          }
        }
        continue;
      }
    }

    return deltaText;
  }

  headers() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'anthropic-version': '2023-06-01',
    };
  }

  async analyzeImage({ imageBase64, mimeType = 'image/png', prompt = 'Analyze this Flutter screenshot/diagram in detail and explain any bugs, layout issues, or UI structure.' }) {
    return this.chat({
      systemPrompt: 'You are FlutterHub AI, an expert in Flutter UI/UX, widget layouts, and error diagnostics.',
      messages: [{ role: 'user', content: prompt }],
      image: { data: imageBase64, mimeType },
    });
  }
}

module.exports = AnthropicProvider;
