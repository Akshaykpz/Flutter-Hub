/* ==========================================================================
   FlutterHub AI Agent — Master Agent Core Orchestrator
   Handles autonomous reasoning, tool-calling execution loop, and streaming
   ========================================================================== */

const { getAIProvider } = require('./providers/providerFactory');
const SmartFallbackProvider = require('./providers/SmartFallbackProvider');
const { OPENAI_TOOLS } = require('./tools/toolDefinitions');
const { executeToolCall } = require('./tools/toolExecutor');

const SYSTEM_PROMPT = `You are Flutter Hub AI, a highly capable general-purpose conversational AI assistant with deep expertise in Flutter and Dart development. You behave like ChatGPT or Gemini — a real, helpful assistant, not a narrow FAQ bot.

GUIDING PRINCIPLES:
- Give a direct, useful answer to every message. NEVER reply with "please provide more details" for short, normal, or general questions such as greetings ("hi", "hey", "hello", "how are you") or simple "what is X" questions — answer them fully and naturally right away.
- Match your response depth to the question. A greeting gets a short friendly reply; a one-liner gets a concise answer; a complex how-to gets a structured, detailed explanation with code.
- Understand the user's intent before responding. Do not force unrelated Flutter content into general answers. Flutter/Dart is your primary specialization, but not a restriction — you handle programming, writing, reasoning, learning, translation, summaries, brainstorming, and everyday questions across all domains.
- Be honest. If you don't know something, or if real-time data (e.g. live weather, exact current news) isn't available through your tools, say so clearly and offer what you can do instead. Never fabricate package versions, job listings, statistics, URLs, or subscription info.
- For time/weather/other current info, use tools when available. When a tool is absent, explain the limitation honestly rather than guessing.
- Maintain conversation context across turns and handle topic switches naturally. Follow up appropriately.

CODE & FORMAT:
- When the user asks for code, respond with a working solution using clear markdown code blocks (\`\`\`dart, \`\`\`yaml, etc.), with short explanations.
- Offer Flutter/Dart expertise at every level: from beginner concepts (widgets, state, layout) to advanced (isolates, Riverpod/Bloc, Clean Architecture, performance).

TOOL USAGE:
Use tools only when current information or Flutter Hub data is required, such as current time/date, package directory searches, job searches, package/job details, or Pro/subscription information. Never invent live package info, job listings, statistics, URLs, or subscription information.

ERRORS/ASSUMPTIONS:
Ask a clarifying question only when the request is genuinely ambiguous or essential information is truly missing — never as a default reply. Otherwise, give your best direct answer.`;


function getToolName(toolCall) {
  return toolCall?.function?.name;
}

function getToolArgs(toolCall) {
  try {
    return JSON.parse(toolCall?.function?.arguments || '{}');
  } catch (e) {
    return {};
  }
}

function buildToolResultPrompt(toolResults) {
  return `Tool results are available below. Use them to answer the user's latest question naturally. Do not mention internal tool mechanics unless it helps the user.\n\n${JSON.stringify(toolResults, null, 2)}`;
}

// A resilient fallback provider used whenever a configured real LLM provider
// throws (wrong/expired key, network failure, quota, etc.). This guarantees the
// agent always returns something useful instead of a broken or empty reply.
const FALLBACK = new SmartFallbackProvider();

async function safeProviderChat(provider, options) {
  try {
    return await provider.chat(options);
  } catch (err) {
    console.warn(`[AI] Provider "${provider.name}" failed (${err.message}) — falling back to smart-fallback.`);
    return FALLBACK.chat(options);
  }
}

async function safeProviderChatStream(provider, options) {
  try {
    return await provider.chatStream(options);
  } catch (err) {
    console.warn(`[AI] Streaming provider "${provider.name}" failed (${err.message}) — falling back to smart-fallback.`);
    return FALLBACK.chatStream(options);
  }
}

/**
 * Execute non-streaming AI response with autonomous tool calling loop
 */
async function runAgent({ messages = [], image = null, isPro = false }) {
  const provider = getAIProvider();

  // First LLM invocation (falls back automatically if the real provider fails)
  const initialResult = await safeProviderChat(provider, {
    systemPrompt: SYSTEM_PROMPT,
    messages,
    tools: OPENAI_TOOLS,
    image,
  });

  // If no tool call was generated, return direct answer
  if (!initialResult.toolCalls || initialResult.toolCalls.length === 0) {
    return {
      text: initialResult.text,
      toolsExecuted: [],
      toolData: null,
      provider: provider.name,
    };
  }

  // Execute Tool Calls
  const toolsExecuted = [];
  let toolData = null;
  const toolMessages = [...messages];

  for (const tc of initialResult.toolCalls) {
    const fnName = getToolName(tc);
    if (!fnName) continue;
    toolsExecuted.push(fnName);

    const fnArgs = getToolArgs(tc);

    const result = await executeToolCall(fnName, fnArgs, isPro);
    toolData = result;

    toolMessages.push({
      role: 'assistant',
      content: null,
      tool_calls: [tc],
    });

    toolMessages.push({
      role: 'tool',
      tool_call_id: tc.id,
      name: fnName,
      content: JSON.stringify(result),
    });
  }

  try {
    const secondMessages = provider.name === 'smart-fallback'
      ? [...messages, { role: 'user', content: buildToolResultPrompt([{ tool: toolsExecuted[toolsExecuted.length - 1], result: toolData }]) }]
      : toolMessages;

    const secondResult = await safeProviderChat(provider, {
      systemPrompt: SYSTEM_PROMPT,
      messages: secondMessages,
      tools: provider.name === 'smart-fallback' ? [] : OPENAI_TOOLS,
    });

    return {
      text: secondResult.text || initialResult.text,
      toolsExecuted,
      toolData,
      provider: provider.name,
    };
  } catch (e) {
    return {
      text: initialResult.text,
      toolsExecuted,
      toolData,
      provider: provider.name,
    };
  }
}

/**
 * Execute streaming AI response with autonomous tool calling loop and SSE
 */
async function streamAgent({ messages = [], image = null, isPro = false, onChunk, onToolStart, onToolDone }) {
  const provider = getAIProvider();
  const toolsExecuted = [];
  let toolData = null;

  let streamToolCalls = [];

  const streamResult = await safeProviderChatStream(provider, {
    systemPrompt: SYSTEM_PROMPT,
    messages,
    tools: OPENAI_TOOLS,
    image,
    onChunk: (chunk) => {
      if (onChunk) onChunk(chunk);
    },
    onToolCall: (tc) => {
      streamToolCalls.push(tc);
    },
  });

  const toolCallsToExecute = streamResult.toolCalls || streamToolCalls;

  // If a real provider failed and the fallback produced no tool call and no
  // text, run the fallback synchronously so the user still receives a reply.
  if (!toolCallsToExecute || toolCallsToExecute.length === 0) {
    if (!streamResult.text || !String(streamResult.text).trim()) {
      const fallback = await FALLBACK.generateDirectResponse(
        [...messages].reverse().find(m => m.role === 'user')?.content || '',
        messages
      );
      await FALLBACK.streamText(fallback, onChunk);
      return { text: fallback, toolsExecuted: [], toolData: null, provider: FALLBACK.name };
    }
    return {
      text: streamResult.text,
      toolsExecuted,
      toolData,
      provider: provider.name,
    };
  }
    const toolResults = [];

    for (const tc of toolCallsToExecute) {
      const fnName = getToolName(tc);
      if (!fnName) continue;
      toolsExecuted.push(fnName);
      if (onToolStart) onToolStart(fnName);

      const fnArgs = getToolArgs(tc);

      const result = await executeToolCall(fnName, fnArgs, isPro);
      toolData = result;
      toolResults.push({ tool: fnName, result });

      if (onToolDone) onToolDone(fnName, result);
    }

    const synthesisMessages = [
      ...messages,
      { role: 'assistant', content: streamResult.text || '' },
      { role: 'user', content: buildToolResultPrompt(toolResults) },
    ];

    const secondResult = await safeProviderChatStream(provider, {
      systemPrompt: SYSTEM_PROMPT,
      messages: synthesisMessages,
      tools: [],
      onChunk,
    });

    return {
      text: secondResult.text,
      toolsExecuted,
      toolData,
      provider: provider.name,
    };

  return {
    text: streamResult.text,
    toolsExecuted,
    toolData,
    provider: provider.name,
  };
}
/**
 * Execute screenshot / image vision analysis
 */
async function analyzeScreenshot({ imageBase64, mimeType = 'image/png', prompt = 'Analyze this Flutter screenshot/layout in detail.', isPro = false }) {
  const provider = getAIProvider();
  return provider.analyzeImage({ imageBase64, mimeType, prompt, isPro });
}

module.exports = {
  runAgent,
  streamAgent,
  analyzeScreenshot,
  SYSTEM_PROMPT,
};
