/* ==========================================================================
   FlutterHub AI Agent — Master Agent Core Orchestrator
   Handles autonomous reasoning, tool-calling execution loop, and streaming
   ========================================================================== */

const { getAIProvider } = require('./providers/providerFactory');
const { OPENAI_TOOLS } = require('./tools/toolDefinitions');
const { executeToolCall } = require('./tools/toolExecutor');

const SYSTEM_PROMPT = `You are Flutter Hub AI, a highly capable general-purpose conversational AI assistant with deep expertise in Flutter and Dart development.

You can answer general questions naturally and help users with programming, writing, reasoning, learning, translation, summaries, brainstorming, everyday questions, and Flutter/Dart development. Flutter is your primary specialization, but it is not a restriction.

Understand the user's intent before responding. Do not force unrelated Flutter content into general answers. If the user asks a simple general question, answer it simply. If the user asks for code, use clear markdown code blocks. If the user asks about Flutter, Dart, packages, jobs, Pro features, screenshots, or project architecture, provide high-quality specialist help.

Use tools only when current information or Flutter Hub data is required, such as current time/date, package directory searches, job searches, package/job details, or Pro/subscription information. Never invent live package information, job listings, statistics, URLs, or subscription information. Maintain conversation context and handle topic switches naturally. Ask clarifying questions when important information is missing.`;

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

/**
 * Execute non-streaming AI response with autonomous tool calling loop
 */
async function runAgent({ messages = [], image = null, isPro = false }) {
  const provider = getAIProvider();

  // First LLM invocation
  const initialResult = await provider.chat({
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

    const secondResult = await provider.chat({
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

  const streamResult = await provider.chatStream({
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

  if (toolCallsToExecute && toolCallsToExecute.length > 0) {
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

    const secondResult = await provider.chatStream({
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
  }

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
