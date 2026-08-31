/* ==========================================================================
   FlutterHub Backend — Production AI Agent API Routes
   POST /api/ai/chat/stream   → Real-time SSE Token Streaming + Tool Calling
   POST /api/ai/chat          → Standard JSON AI query processing
   POST /api/ai/analyze-image → Screenshot & Layout Multimodal Vision
   GET  /api/ai/quota         → Daily rate limits & quota status
   ========================================================================== */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/superbase');
const { runAgent, streamAgent, analyzeScreenshot } = require('../ai/agentCore');

// In-Memory Daily Rate Limiting per IP / User
const dailyUsageMap = new Map();
const MAX_MESSAGE_CHARS = 12000;
const MAX_HISTORY_MESSAGES = 16;

function normalizeMessageText(text = '') {
  return String(text || '').slice(0, MAX_MESSAGE_CHARS).trim();
}

function normalizeConversationHistory(history = []) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .slice(-MAX_HISTORY_MESSAGES)
    .map(m => ({
      role: m.role,
      content: normalizeMessageText(m.content),
    }))
    .filter(m => m.content.length > 0);
}

function getDailyUsageKey(req, userId) {
  const today = new Date().toISOString().slice(0, 10);
  const identifier = userId || req.ip || req.headers['x-forwarded-for'] || 'anon';
  return `${today}:${identifier}`;
}

async function checkIsProUser(req) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.body?.token || req.query?.auth_token) {
      token = req.body?.token || req.query?.auth_token;
    }

    if (!token || token === 'null' || token === 'undefined') {
      return { isPro: false, userId: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flutterhub_super_secret_jwt_key_2026_prod');
    if (!decoded) return { isPro: false, userId: null };

    if (decoded.isPro === true || decoded.isAdmin === true || decoded.role === 'admin' || decoded.isSubscribed === true) {
      return { isPro: true, userId: decoded.id || decoded.email };
    }

    if (decoded.id || decoded.email) {
      const query = supabase
        .from('users')
        .select('id, is_subscribed, subscription_expires_at, role');

      if (decoded.id) query.eq('id', decoded.id);
      else query.eq('email', decoded.email);

      const { data: user } = await query.maybeSingle();

      if (user) {
        if (user.role === 'admin' || user.is_subscribed === true) {
          const expired = user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date();
          if (!expired) return { isPro: true, userId: user.id };
        }
        return { isPro: false, userId: user.id };
      }
    }

    return { isPro: false, userId: decoded.id || null };
  } catch (err) {
    return { isPro: false, userId: null };
  }
}

/* ─── POST /api/ai/chat/stream (SSE Streaming) ────────────────── */
router.post('/chat/stream', async (req, res) => {
  try {
    const { message = '', conversation_history = [], image = null } = req.body;
    const cleanMessage = normalizeMessageText(message);

    if (!cleanMessage) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const { isPro, userId } = await checkIsProUser(req);
    const usageKey = getDailyUsageKey(req, userId);
    const currentUsage = dailyUsageMap.get(usageKey) || 0;
    const FREE_DAILY_LIMIT = 15;

    if (!isPro && currentUsage >= FREE_DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        code: 'QUOTA_EXCEEDED',
        is_pro: false,
        message: 'Daily Free AI Quota Reached (15/15). Upgrade to FlutterHub Pro for unlimited AI engineering assistance.',
      });
    }

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering (Nginx/Vercel)
    res.flushHeaders?.();

    // Format message array for agent
    const messages = [
      ...normalizeConversationHistory(conversation_history),
      { role: 'user', content: cleanMessage },
    ];

    let toolDataPayload = null;

    const result = await streamAgent({
      messages,
      image,
      isPro,
      onChunk: (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      },
      onToolStart: (toolName) => {
        res.write(`data: ${JSON.stringify({ type: 'tool_start', tool: toolName })}\n\n`);
      },
      onToolDone: (toolName, data) => {
        toolDataPayload = data;
        res.write(`data: ${JSON.stringify({ type: 'tool_done', tool: toolName, tool_data: data })}\n\n`);
      },
    });

    // Increment usage
    dailyUsageMap.set(usageKey, currentUsage + 1);

    // Send final completion packet
    res.write(`data: ${JSON.stringify({
      type: 'done',
      success: true,
      is_pro: isPro,
      provider: result.provider,
      tools_executed: result.toolsExecuted,
      tool_data: toolDataPayload,
      quota: {
        used: currentUsage + 1,
        limit: isPro ? 'Unlimited (Pro)' : FREE_DAILY_LIMIT,
        remaining: isPro ? 999 : Math.max(0, FREE_DAILY_LIMIT - (currentUsage + 1)),
      },
    })}\n\n`);

    res.end();

  } catch (err) {
    console.error('[AIChatStream] Error:', err);
    const friendly = 'I couldn\u2019t process that request right now. Please try again.';
    try {
      res.write(`data: ${JSON.stringify({ type: 'error', message: friendly })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'done', success: false })}\n\n`);
      res.end();
    } catch (_) { /* headers already gone — nothing else to do */ }
  }
});

/* ─── POST /api/ai/chat (Standard Non-streaming JSON) ─────────── */
router.post('/chat', async (req, res) => {
  try {
    const { message = '', conversation_history = [], image = null } = req.body;
    const cleanMessage = normalizeMessageText(message);

    if (!cleanMessage) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const { isPro, userId } = await checkIsProUser(req);
    const usageKey = getDailyUsageKey(req, userId);
    const currentUsage = dailyUsageMap.get(usageKey) || 0;
    const FREE_DAILY_LIMIT = 15;

    if (!isPro && currentUsage >= FREE_DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        code: 'QUOTA_EXCEEDED',
        is_pro: false,
        message: 'Daily Free AI Quota Reached (15/15). Upgrade to FlutterHub Pro for unlimited AI engineering assistance.',
        quota: { used: currentUsage, limit: FREE_DAILY_LIMIT, remaining: 0 },
      });
    }

    const messages = [
      ...normalizeConversationHistory(conversation_history),
      { role: 'user', content: cleanMessage },
    ];

    const result = await runAgent({ messages, image, isPro });

    dailyUsageMap.set(usageKey, currentUsage + 1);

    res.json({
      success: true,
      is_pro: isPro,
      reply: result.text,
      tools_executed: result.toolsExecuted,
      tool_data: result.toolData,
      provider: result.provider,
      quota: {
        used: currentUsage + 1,
        limit: isPro ? 'Unlimited (Pro)' : FREE_DAILY_LIMIT,
        remaining: isPro ? 999 : Math.max(0, FREE_DAILY_LIMIT - (currentUsage + 1)),
      },
    });

  } catch (err) {
    console.error('[AIChatJSON] Error:', err);
    res.status(500).json({
      success: false,
      message: 'I couldn\u2019t process that request right now. Please try again.',
    });
  }
});

/* ─── POST /api/ai/analyze-image (Screenshot Vision) ──────────── */
router.post('/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', prompt = 'Analyze this Flutter screenshot/layout in detail.' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Image base64 data required' });
    }

    const { isPro, userId } = await checkIsProUser(req);
    const result = await analyzeScreenshot({ imageBase64, mimeType, prompt, isPro });

    res.json({
      success: true,
      is_pro: isPro,
      analysis: result.text,
    });

  } catch (err) {
    console.error('[AIAnalyzeImage] Error:', err);
    res.status(500).json({
      success: false,
      message: 'Image analysis is unavailable right now. Please try again later.',
    });
  }
});

/* ─── GET /api/ai/quota ───────────────────────────────────────── */
router.get('/quota', async (req, res) => {
  try {
    const { isPro, userId } = await checkIsProUser(req);
    const usageKey = getDailyUsageKey(req, userId);
    const currentUsage = dailyUsageMap.get(usageKey) || 0;
    const FREE_DAILY_LIMIT = 15;

    res.json({
      success: true,
      is_pro: isPro,
      quota: {
        used: currentUsage,
        limit: isPro ? 'Unlimited (Pro)' : FREE_DAILY_LIMIT,
        remaining: isPro ? 999 : Math.max(0, FREE_DAILY_LIMIT - currentUsage),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
