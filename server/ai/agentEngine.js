/* ==========================================================================
   FlutterHub AI Agent - Legacy Compatibility Wrapper
   The production implementation lives in agentCore.js.
   ========================================================================== */

const { runAgent } = require('./agentCore');
const { executeToolCall } = require('./tools/toolExecutor');

async function processUserMessage(userMessage, conversationHistory = [], isPro = false) {
  const messages = [
    ...conversationHistory
      .filter(m => m && ['user', 'assistant'].includes(m.role))
      .map(m => ({ role: m.role, content: String(m.content || '') })),
    { role: 'user', content: String(userMessage || '') },
  ];

  return runAgent({ messages, isPro });
}

function isFlutterRelevant() {
  return true;
}

module.exports = {
  processUserMessage,
  isFlutterRelevant,
  executeTool: executeToolCall,
};
