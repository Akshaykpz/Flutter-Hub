/* ==========================================================================
   FlutterHub AI Agent — Provider Factory
   Dynamically instantiates OpenAI, Gemini, or Smart Fallback provider
   ========================================================================== */

const OpenAIProvider = require('./OpenAIProvider');
const GeminiProvider = require('./GeminiProvider');
const AnthropicProvider = require('./AnthropicProvider');
const SmartFallbackProvider = require('./SmartFallbackProvider');

function getAIProvider() {
  const preferred = (process.env.AI_PROVIDER || '').toLowerCase();

  // 1. If explicitly OpenAI or key is present
  if (preferred === 'openai' || process.env.OPENAI_API_KEY || process.env.AI_API_KEY) {
    const openai = new OpenAIProvider();
    if (openai.isConfigured()) return openai;
  }

  // 2. If explicitly Gemini or key is present
  if (preferred === 'gemini' || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    const gemini = new GeminiProvider();
    if (gemini.isConfigured()) return gemini;
  }

  // 3. If explicitly Anthropic (or AI_API_KEY) and ANTHROPIC_API_KEY is present.
  //    Works with Anthropic directly or an Anthropic-compatible router via
  //    ANTHROPIC_BASE_URL (e.g. the co.agentrouter.org proxy).
  if (preferred === 'anthropic' || process.env.ANTHROPIC_API_KEY) {
    const anthropic = new AnthropicProvider();
    if (anthropic.isConfigured()) return anthropic;
  }

  // 4. Resilient fallback provider (offline Flutter/Dart knowledge base)
  return new SmartFallbackProvider();
}

module.exports = {
  getAIProvider,
};
