/* ==========================================================================
   FlutterHub AI Agent — Google Gemini Provider Implementation
   Supports Gemini 1.5 Flash/Pro with Function Calling, Streaming & Vision
   ========================================================================== */

const fetch = require('node-fetch');
const BaseProvider = require('./BaseProvider');
const { GEMINI_FUNCTION_DECLARATIONS } = require('../tools/toolDefinitions');

class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'gemini';
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.model = config.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  formatContents(messages = [], image) {
    const contents = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLastUser = (i === messages.length - 1 && msg.role === 'user');
      const role = msg.role === 'assistant' ? 'model' : 'user';

      const parts = [];

      if (isLastUser && image && image.data) {
        const cleanBase64 = image.data.replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: image.mimeType || 'image/png',
            data: cleanBase64,
          },
        });
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      if (parts.length > 0) {
        contents.push({ role, parts });
      }
    }

    return contents;
  }

  async chat({ systemPrompt, messages = [], tools, image }) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API Key is not configured in server environment.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const payload = {
      contents: this.formatContents(messages, image),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
      },
    };

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }],
      };
    }

    if (tools && tools.length > 0) {
      payload.tools = [{
        functionDeclarations: GEMINI_FUNCTION_DECLARATIONS,
      }];
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts || [];

    let text = '';
    const toolCalls = [];

    for (const part of candidate) {
      if (part.text) text += part.text;
      if (part.functionCall) {
        toolCalls.push({
          id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          type: 'function',
          function: {
            name: part.functionCall.name,
            arguments: JSON.stringify(part.functionCall.args || {}),
          },
        });
      }
    }

    return {
      text,
      toolCalls,
      usage: data.usageMetadata,
    };
  }

  async chatStream({ systemPrompt, messages = [], tools, image, onChunk, onToolCall }) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API Key is not configured in server environment.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`;

    const payload = {
      contents: this.formatContents(messages, image),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
      },
    };

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }],
      };
    }

    if (tools && tools.length > 0) {
      payload.tools = [{
        functionDeclarations: GEMINI_FUNCTION_DECLARATIONS,
      }];
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini streaming error (${res.status}): ${errText}`);
    }

    let fullText = '';
    const toolCalls = [];

    return new Promise((resolve, reject) => {
      let buffer = '';

      res.body.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          try {
            const jsonStr = trimmed.replace(/^data:\s*/, '');
            const parsed = JSON.parse(jsonStr);
            const parts = parsed.candidates?.[0]?.content?.parts || [];

            for (const part of parts) {
              if (part.text) {
                fullText += part.text;
                if (onChunk) onChunk(part.text);
              }
              if (part.functionCall) {
                const tc = {
                  id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                  type: 'function',
                  function: {
                    name: part.functionCall.name,
                    arguments: JSON.stringify(part.functionCall.args || {}),
                  },
                };
                toolCalls.push(tc);
                if (onToolCall) onToolCall(tc);
              }
            }
          } catch (e) {}
        }
      });

      res.body.on('end', () => {
        resolve({
          text: fullText,
          toolCalls,
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

module.exports = GeminiProvider;
