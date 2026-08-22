/* ==========================================================================
   FlutterHub AI Agent — OpenAI Provider Implementation
   Supports function calling, streaming SSE, and vision multimodal analysis
   Compatible with standard OpenAI, DeepSeek, Groq, OpenRouter
   ========================================================================== */

const fetch = require('node-fetch');
const BaseProvider = require('./BaseProvider');

class OpenAIProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'openai';
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    this.baseUrl = (config.baseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    this.model = config.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  formatMessages(systemPrompt, messages, image) {
    const formatted = [];

    if (systemPrompt) {
      formatted.push({ role: 'system', content: systemPrompt });
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLastUser = (i === messages.length - 1 && msg.role === 'user');

      if (isLastUser && image && image.data) {
        const imageUrl = image.data.startsWith('data:')
          ? image.data
          : `data:${image.mimeType || 'image/png'};base64,${image.data}`;

        formatted.push({
          role: 'user',
          content: [
            { type: 'text', text: msg.content || 'Please analyze this Flutter screenshot/image.' },
            { type: 'image_url', image_url: { url: imageUrl, detail: 'auto' } }
          ]
        });
      } else {
        if (msg.role === 'tool') {
          formatted.push({
            role: 'tool',
            tool_call_id: msg.tool_call_id,
            name: msg.name,
            content: msg.content || '',
          });
          continue;
        }

        formatted.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content || '',
          ...(msg.tool_calls ? { tool_calls: msg.tool_calls } : {}),
          ...(msg.tool_call_id ? { tool_call_id: msg.tool_call_id } : {}),
          ...(msg.name ? { name: msg.name } : {}),
        });
      }
    }

    return formatted;
  }

  async chat({ systemPrompt, messages = [], tools, image }) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API Key is not configured in server environment.');
    }

    const payload = {
      model: this.model,
      messages: this.formatMessages(systemPrompt, messages, image),
      temperature: 0.7,
      max_tokens: 2500,
    };

    if (tools && tools.length > 0) {
      payload.tools = tools;
      payload.tool_choice = 'auto';
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const choice = data.choices?.[0]?.message || {};

    return {
      text: choice.content || '',
      toolCalls: choice.tool_calls || [],
      rawMessage: choice,
      usage: data.usage,
    };
  }

  async chatStream({ systemPrompt, messages = [], tools, image, onChunk, onToolCall }) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API Key is not configured in server environment.');
    }

    const payload = {
      model: this.model,
      messages: this.formatMessages(systemPrompt, messages, image),
      temperature: 0.7,
      max_tokens: 2500,
      stream: true,
    };

    if (tools && tools.length > 0) {
      payload.tools = tools;
      payload.tool_choice = 'auto';
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI streaming error (${res.status}): ${errText}`);
    }

    let fullText = '';
    const pendingToolCalls = [];

    // Parse SSE stream
    return new Promise((resolve, reject) => {
      let buffer = '';

      res.body.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep partial line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          if (trimmed === 'data: [DONE]') continue;

          try {
            const jsonStr = trimmed.replace(/^data:\s*/, '');
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta;

            if (!delta) continue;

            if (delta.content) {
              fullText += delta.content;
              if (onChunk) onChunk(delta.content);
            }

            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index || 0;
                if (!pendingToolCalls[idx]) {
                  pendingToolCalls[idx] = {
                    id: tc.id || `call_${Date.now()}_${idx}`,
                    type: 'function',
                    function: { name: '', arguments: '' },
                  };
                }
                if (tc.function?.name) {
                  pendingToolCalls[idx].function.name += tc.function.name;
                }
                if (tc.function?.arguments) {
                  pendingToolCalls[idx].function.arguments += tc.function.arguments;
                }
              }
            }
          } catch (e) {
            // Ignore parse errors on partial stream lines
          }
        }
      });

      res.body.on('end', () => {
        const validToolCalls = pendingToolCalls.filter(Boolean);
        if (validToolCalls.length > 0 && onToolCall) {
          validToolCalls.forEach(tc => onToolCall(tc));
        }
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

  async analyzeImage({ imageBase64, mimeType = 'image/png', prompt = 'Analyze this Flutter screenshot/diagram in detail and explain any bugs, layout issues, or UI structure.' }) {
    return this.chat({
      systemPrompt: 'You are FlutterHub AI, an expert in Flutter UI/UX, widget layouts, and error diagnostics.',
      messages: [{ role: 'user', content: prompt }],
      image: { data: imageBase64, mimeType }
    });
  }
}

module.exports = OpenAIProvider;
