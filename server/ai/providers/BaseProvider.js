/* ==========================================================================
   FlutterHub AI Agent — Base Provider Interface
   ========================================================================== */

class BaseProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'base';
  }

  /**
   * Execute chat completion without streaming
   * @param {Object} options - { systemPrompt, messages, tools, image, isPro }
   * @returns {Promise<{ text: string, toolCalls?: Array, usage?: Object }>}
   */
  async chat(options) {
    throw new Error('chat() must be implemented by provider');
  }

  /**
   * Execute streaming chat completion
   * @param {Object} options - { systemPrompt, messages, tools, image, isPro, onChunk, onToolCall }
   * @returns {Promise<{ text: string, toolCalls?: Array }>}
   */
  async chatStream(options) {
    throw new Error('chatStream() must be implemented by provider');
  }

  /**
   * Analyze image / screenshot
   * @param {Object} options - { imageBase64, mimeType, prompt, isPro }
   * @returns {Promise<{ text: string }>}
   */
  async analyzeImage(options) {
    throw new Error('analyzeImage() must be implemented by provider');
  }
}

module.exports = BaseProvider;
