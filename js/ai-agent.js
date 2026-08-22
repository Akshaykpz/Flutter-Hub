/* ==========================================================================
   FlutterHub AI Agent — Production Frontend Engine
   - Real-time SSE Token Streaming
   - Natural Text-to-Speech (🔊 TTS) with Voice Selection & Emoji Cleaning
   - Voice Input (🎤 STT) with Auto-Response Audio Playback
   - Autonomous Tool Calling Payload Renderer
   - Multimodal Screenshot / Image Analysis (Paste & Upload)
   - Multi-turn Context Memory, Retry, and Code Copying
   ========================================================================== */

const FlutterAIAgent = (function () {

  /* ── State ─────────────────────────────────────────────────── */
  const state = {
    isOpen: false,
    history: [],
    messagesMap: new Map(), // Stores msgId -> text for bulletproof TTS playback
    stagedImage: null,      // { data: base64, name: string, mimeType: string }
    isRecording: false,
    recognition: null,
    currentUtterance: null,
    isSpeaking: false,
    isPaused: false,
    activeSpeechMsgId: null,
    selectedVoice: null,
    lastInputWasVoice: false,
    autoVoice: localStorage.getItem('flutterhub_auto_voice') === 'true',
    quota: { used: 0, limit: 15, remaining: 15 },
    isPro: false,
    loading: false,
    abortController: null,
    initialized: false,
    lastUserPrompt: '',
  };

  /* ── Voice & Speech Synthesis Init (Prioritizing Natural Female Voices) ── */
  function loadBestVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritized list of high quality female English voices across all browsers & OS
    const femaleVoicePatterns = [
      'Microsoft Jenny Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Jenny',
      'Microsoft Zira',
      'Google UK English Female',
      'Google US English',
      'Samantha',
      'Karen',
      'Victoria',
      'Moira',
      'Tessa',
      'Ava',
      'Nicky',
      'en-US-Neural2-F',
      'en-US-Wavenet-F',
      'en-US-Standard-C',
      'en-US-Standard-E',
      'en-GB-Neural2-A',
    ];

    // 1. Check priority female voices
    for (const pattern of femaleVoicePatterns) {
      const match = voices.find(v => v.name.toLowerCase().includes(pattern.toLowerCase()));
      if (match) {
        state.selectedVoice = match;
        return;
      }
    }

    // 2. Check any voice with 'female', 'zira', 'samantha', 'jenny' in name
    const femaleMatch = voices.find(v => v.lang.startsWith('en') && (
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('jenny') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('aria')
    ));
    if (femaleMatch) {
      state.selectedVoice = femaleMatch;
      return;
    }

    // 3. Fallback to any English voice
    state.selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadBestVoice;
    loadBestVoice();
  }

  /* ── Helpers ───────────────────────────────────────────────── */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getAuthHeader() {
    if (window.AuthManager && AuthManager.currentUser && AuthManager.currentUser.token) {
      return { 'Authorization': `Bearer ${AuthManager.currentUser.token}` };
    }
    return {};
  }

  function checkUserIsPro() {
    return !!(window.AuthManager && AuthManager.currentUser && AuthManager.currentUser.isPro);
  }

  /* ── Window Toggle / Floating State ────────────────────────── */
  function toggleChatWindow() {
    if (!state.initialized) init();
    state.isOpen = !state.isOpen;
    const win = document.getElementById('ai-floating-widget');

    if (win) {
      if (state.isOpen) {
        win.classList.add('open');
        win.style.display = 'flex';
        setTimeout(() => {
          const input = document.getElementById('ai-user-input');
          if (input) input.focus();
        }, 150);
      } else {
        win.classList.remove('open');
        setTimeout(() => {
          if (!state.isOpen) win.style.display = 'none';
        }, 250);
        stopSpeech();
      }
    }
  }

  function openChatWindow() {
    if (!state.isOpen) toggleChatWindow();
  }

  function closeChatWindow() {
    if (state.isOpen) toggleChatWindow();
  }

  /* ── Markdown & Code Block Formatter ───────────────────────── */
  function formatMarkdown(text = '') {
    // 1. Code blocks: ```dart ... ```
    let formatted = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'dart';
      const cleanCode = code.trim();
      const codeId = 'code_' + Math.random().toString(36).substring(2, 9);
      return `
        <div class="ai-code-wrapper">
          <div class="ai-code-header">
            <span>⚡ ${language}</span>
            <button class="ai-code-copy-btn" onclick="FlutterAIAgent.copyCode('${codeId}')">
              📋 Copy
            </button>
          </div>
          <pre class="ai-code-content" id="${codeId}"><code>${esc(cleanCode)}</code></pre>
        </div>
      `;
    });

    // 2. Inline code: `...`
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;color:#38bdf8;font-size:0.85em;font-family:var(--font-mono);">$1</code>');

    // 3. Headers
    formatted = formatted.replace(/^### (.*$)/gim, '<h3 style="color:#38bdf8;font-size:0.95rem;font-weight:800;margin:0.5rem 0 0.3rem;">$1</h3>');
    formatted = formatted.replace(/^#### (.*$)/gim, '<h4 style="color:#fff;font-size:0.88rem;font-weight:700;margin:0.4rem 0 0.2rem;">$1</h4>');

    // 4. Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;font-weight:700;">$1</strong>');

    // 5. Unordered list
    formatted = formatted.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
    formatted = formatted.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    formatted = formatted.replace(/<\/ul>\s*<ul>/g, '');

    // 6. Numbered list
    formatted = formatted.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li>$2</li>');

    // 7. Paragraphs
    const lines = formatted.split('\n\n');
    formatted = lines.map(l => {
      const trimmed = l.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    return formatted;
  }

  /* ── Interactive Tool Cards Formatter ──────────────────────── */
  function renderToolCards(toolData) {
    if (!toolData) return '';

    if (toolData.type === 'packages' && toolData.packages && toolData.packages.length > 0) {
      return `
        <div class="ai-tool-cards-grid">
          ${toolData.packages.map(pkg => `
            <div class="ai-embedded-card">
              <div class="ai-embedded-card-header">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="font-size:15px;">${pkg.icon || '📦'}</span>
                  <span class="ai-embedded-card-title">${esc(pkg.name)}</span>
                </div>
                <span class="badge ${pkg.isPremium ? 'badge-pro' : 'badge-cyan'}" style="font-size:9px;padding:1px 6px;">
                  ${pkg.isPremium ? 'PRO' : 'FREE'}
                </span>
              </div>
              <p class="ai-embedded-card-desc">${esc(pkg.tagline || '')}</p>
              <div class="ai-embedded-card-meta">
                <span>❤️ ${pkg.likes ? pkg.likes.toLocaleString() : '1k+'}</span>
                <span>⭐ ${pkg.pubPoints || 160}/160</span>
                <span>📈 ${pkg.popularity || 99}%</span>
              </div>
              <button class="btn btn-primary btn-sm" onclick="FlutterAIAgent.openPackage('${esc(pkg.id)}')" style="font-size:0.75rem;padding:3px 8px;justify-content:center;margin-top:2px;">
                View Package ↗
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (toolData.type === 'jobs' && toolData.jobs && toolData.jobs.length > 0) {
      return `
        <div class="ai-tool-cards-grid">
          ${toolData.jobs.map(job => `
            <div class="ai-embedded-card">
              <div class="ai-embedded-card-header">
                <div>
                  <span class="ai-embedded-card-title">${esc(job.title)}</span>
                  <div style="font-size:0.72rem;color:var(--text-muted);">${esc(job.company)} • ${esc(job.location || 'Remote')}</div>
                </div>
                <span class="badge badge-emerald" style="font-size:9px;padding:1px 6px;">
                  ${esc(job.remote_type || 'Active')}
                </span>
              </div>
              <div class="ai-embedded-card-meta">
                <span>⏱ Live Vacancy</span>
                <span style="color:#38bdf8;">${esc(job.source_name || 'Verified')}</span>
              </div>
              <a href="${esc(job.apply_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size:0.75rem;padding:3px 8px;text-align:center;justify-content:center;text-decoration:none;margin-top:2px;">
                Apply on ${esc(job.source_name || 'Careers')} ↗
              </a>
            </div>
          `).join('')}
        </div>
      `;
    }

    return '';
  }

  /* ── Image & Screenshot Upload Handler ─────────────────────── */
  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      if (window.App && App.showToast) App.showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.stagedImage = {
        data: e.target.result,
        name: file.name || 'screenshot.png',
        mimeType: file.type || 'image/png',
      };
      renderImageStagingBar();
      if (window.App && App.showToast) App.showToast('Attached screenshot for AI analysis 🖼️', 'info');
    };
    reader.readAsDataURL(file);
  }

  function removeStagedImage() {
    state.stagedImage = null;
    const bar = document.getElementById('ai-image-staging-bar');
    if (bar) bar.style.display = 'none';
  }

  function renderImageStagingBar() {
    const bar = document.getElementById('ai-image-staging-bar');
    if (!bar) return;
    if (state.stagedImage) {
      bar.style.display = 'flex';
      bar.innerHTML = `
        <img src="${state.stagedImage.data}" class="ai-image-staging-thumb" alt="Staged" />
        <span class="ai-image-staging-label">Attached: ${esc(state.stagedImage.name)}</span>
        <button class="ai-image-staging-remove" onclick="FlutterAIAgent.removeStagedImage()" title="Remove attachment">✕</button>
      `;
    } else {
      bar.style.display = 'none';
    }
  }

  /* ── Speech-To-Text (Voice Input 🎤) ───────────────────────── */
  function initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      state.isRecording = true;
      state.lastInputWasVoice = true;
      stopSpeech();
      updateMicUI(true);
      const input = document.getElementById('ai-user-input');
      if (input) input.placeholder = '🎙️ Listening... speak now...';
    };

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      const input = document.getElementById('ai-user-input');
      if (input && transcript.trim()) {
        input.value = transcript;
      }
    };

    rec.onerror = (event) => {
      state.isRecording = false;
      updateMicUI(false);
      const input = document.getElementById('ai-user-input');
      if (input) input.placeholder = 'Ask anything, or paste a screenshot (Ctrl+V)...';
      if (event.error === 'not-allowed' && window.App && App.showToast) {
        App.showToast('Microphone access denied. Please enable mic permissions in your browser.', 'error');
      }
    };

    rec.onend = () => {
      state.isRecording = false;
      updateMicUI(false);
      const input = document.getElementById('ai-user-input');
      if (input) {
        input.placeholder = 'Ask anything, or paste a screenshot (Ctrl+V)...';
        const spokenText = input.value.trim();
        if (spokenText.length >= 2) {
          sendMessage(spokenText);
        }
      }
    };

    return rec;
  }

  function toggleVoiceInput() {
    if (!state.recognition) {
      state.recognition = initSpeechRecognition();
      if (!state.recognition) {
        if (window.App && App.showToast) App.showToast('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.', 'info');
        return;
      }
    }

    if (state.isRecording) {
      state.recognition.stop();
    } else {
      try {
        state.recognition.start();
      } catch (e) {
        state.recognition.stop();
      }
    }
  }

  function updateMicUI(isRecording) {
    const btn = document.getElementById('ai-mic-btn');
    if (!btn) return;
    if (isRecording) {
      btn.classList.add('ai-mic-btn--listening');
      btn.innerHTML = '🔴';
      btn.title = 'Listening... tap to send';
    } else {
      btn.classList.remove('ai-mic-btn--listening');
      btn.innerHTML = '🎤';
      btn.title = 'Voice Input (Speech to Text)';
    }
  }

  /* ── Text-To-Speech (Voice Output 🔊) ──────────────────────── */
  function cleanTextForSpeech(rawText = '') {
    return rawText
      // 1. Remove code blocks
      .replace(/```[\s\S]*?```/g, 'Code example provided below.')
      // 2. Remove inline code backticks
      .replace(/`([^`]+)`/g, '$1')
      // 3. Remove markdown headers
      .replace(/#{1,6}\s?/g, '')
      // 4. Remove bold & italic markdown
      .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
      .replace(/_{1,3}(.*?)_{1,3}/g, '$1')
      // 5. Remove markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 6. Remove raw URLs
      .replace(/https?:\/\/\S+/g, '')
      // 7. Remove emojis and special non-alphanumeric symbols that sound unnatural
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}\u{2B05}-\u{2B07}\u{2934}-\u{2935}\u{2190}-\u{21FF}]/gu, '')
      // 8. Clean up extra punctuation and whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  function speakMessage(msgId, explicitText) {
    if (!('speechSynthesis' in window)) {
      if (window.App && App.showToast) App.showToast('Text-to-speech is not supported in this browser.', 'info');
      return;
    }

    const cleanId = String(msgId || 'welcome_msg').trim();

    // Toggle Pause / Resume if already speaking the same message
    if (state.isSpeaking && state.activeSpeechMsgId === cleanId) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        state.isPaused = false;
        updateSpeechUI(cleanId, 'playing');
      } else {
        window.speechSynthesis.pause();
        state.isPaused = true;
        updateSpeechUI(cleanId, 'paused');
      }
      return;
    }

    // Stop any ongoing speech
    stopSpeech();

    let rawText = '';

    // If explicitText was passed (e.g. from legacy or direct call)
    if (explicitText && typeof explicitText === 'string') {
      try {
        rawText = decodeURIComponent(explicitText);
      } catch (e) {
        try {
          rawText = unescape(explicitText);
        } catch (e2) {
          rawText = explicitText;
        }
      }
    }

    // Otherwise get from registered map
    if (!rawText || rawText === cleanId) {
      rawText = state.messagesMap.get(cleanId);
    }

    // Fallback: extract text from DOM if not in map
    if (!rawText) {
      const bubbleEl = document.getElementById(`ai-bubble-${cleanId}`) || document.getElementById(cleanId);
      if (bubbleEl) {
        const clone = bubbleEl.cloneNode(true);
        clone.querySelectorAll('.ai-code-wrapper, .ai-msg-actions, .ai-tool-cards-grid, .ai-msg-avatar, .badge, .ai-typing-indicator').forEach(el => el.remove());
        rawText = clone.innerText || clone.textContent || '';
      }
    }

    if (!rawText || cleanId === 'welcome_msg') {
      rawText = "Hey there! I am Flutter Hub AI, a general AI assistant with deep Flutter and Dart expertise. What would you like to do?";
    }

    // Clean any lingering percent-encoding (%20, %21, %27, %0A)
    if (rawText.includes('%')) {
      try {
        rawText = decodeURIComponent(rawText);
      } catch (e) {
        try {
          rawText = unescape(rawText);
        } catch (e2) {}
      }
    }

    const cleanText = cleanTextForSpeech(rawText);
    if (!cleanText) return;

    loadBestVoice();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.15; // Natural clear female pitch
    utterance.lang = 'en-US';
    if (state.selectedVoice) utterance.voice = state.selectedVoice;

    utterance.onstart = () => {
      state.isSpeaking = true;
      state.isPaused = false;
      state.activeSpeechMsgId = cleanId;
      updateSpeechUI(cleanId, 'playing');
    };

    utterance.onend = () => {
      state.isSpeaking = false;
      state.isPaused = false;
      state.activeSpeechMsgId = null;
      updateSpeechUI(cleanId, 'stopped');
    };

    utterance.onerror = () => {
      state.isSpeaking = false;
      state.isPaused = false;
      state.activeSpeechMsgId = null;
      updateSpeechUI(cleanId, 'stopped');
    };

    state.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const currentId = state.activeSpeechMsgId;
    state.isSpeaking = false;
    state.isPaused = false;
    state.activeSpeechMsgId = null;
    if (currentId) updateSpeechUI(currentId, 'stopped');
  }

  function updateSpeechUI(msgId, status) {
    const btn = document.getElementById(`ai-voice-btn-${msgId}`);
    if (!btn) return;

    if (status === 'playing') {
      btn.classList.add('ai-voice-btn--active');
      btn.innerHTML = '⏸️ Pause';
    } else if (status === 'paused') {
      btn.classList.add('ai-voice-btn--active');
      btn.innerHTML = '▶️ Resume';
    } else {
      btn.classList.remove('ai-voice-btn--active');
      btn.innerHTML = '🔊 Listen';
    }
  }

  function toggleAutoVoice() {
    state.autoVoice = !state.autoVoice;
    localStorage.setItem('flutterhub_auto_voice', String(state.autoVoice));
    const btn = document.getElementById('ai-auto-voice-toggle');
    if (btn) {
      btn.innerHTML = state.autoVoice ? '🔊 Voice: ON' : '🔈 Voice: OFF';
      btn.style.color = state.autoVoice ? '#34d399' : 'var(--text-muted)';
    }
    if (window.App && App.showToast) {
      App.showToast(state.autoVoice ? 'Auto-Voice Enabled 🔊' : 'Auto-Voice Disabled 🔈', 'info');
    }
  }

  /* ── SSE Real-Time Streaming Message Sender ─────────────────── */
  async function sendMessage(text) {
    const messageText = (text || '').trim();
    if (!messageText || state.loading) return;

    const attachedImg = state.stagedImage;
    removeStagedImage();
    state.lastUserPrompt = messageText;

    const input = document.getElementById('ai-user-input');
    if (input) input.value = '';

    // 1. Append User Message
    const userMsgId = 'msg_' + Date.now();
    state.history.push({ id: userMsgId, role: 'user', content: messageText, image: attachedImg });
    appendUserMessageToUI({ id: userMsgId, content: messageText, image: attachedImg });

    // 2. Prepare Assistant Bubble for Progressive Streaming
    const assistantMsgId = 'asst_' + Date.now();
    const assistantBubble = appendAssistantPlaceholder(assistantMsgId);

    state.loading = true;
    state.abortController = new AbortController();

    let accumulatedText = '';
    let toolDataPayload = null;

    try {
      const res = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        signal: state.abortController.signal,
        body: JSON.stringify({
          message: messageText,
          image: attachedImg,
          conversation_history: state.history.slice(-8).map(h => ({ role: h.role, content: h.content })),
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          updateAssistantBubble(assistantBubble, {
            id: assistantMsgId,
            content: `🔒 **Daily AI Quota Reached** (15/15 queries used today).\n\nUpgrade to **FlutterHub Pro** for unlimited streaming AI engineering assistance!`,
            isQuotaExceeded: true,
          });
          return;
        }
        throw new Error(`Server returned status ${res.status}`);
      }

      // Read SSE stream progressively
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          try {
            const jsonStr = trimmed.replace(/^data:\s*/, '');
            const event = JSON.parse(jsonStr);

            if (event.type === 'chunk') {
              accumulatedText += event.content;
              updateStreamingBubbleContent(assistantBubble, accumulatedText);
            } else if (event.type === 'tool_start') {
              showToolCallingBadge(assistantBubble, event.tool);
            } else if (event.type === 'tool_done') {
              toolDataPayload = event.tool_data;
              hideToolCallingBadge(assistantBubble);
            } else if (event.type === 'done') {
              if (event.quota) state.quota = event.quota;
              updateQuotaUI();
            } else if (event.type === 'error') {
              throw new Error(event.message || 'Stream error');
            }
          } catch (e) {}
        }
      }

      // Save into message map for clean TTS speech
      state.messagesMap.set(assistantMsgId, accumulatedText);

      state.history.push({
        id: assistantMsgId,
        role: 'assistant',
        content: accumulatedText,
        toolData: toolDataPayload,
      });

      finalizeAssistantBubble(assistantBubble, {
        id: assistantMsgId,
        content: accumulatedText,
        toolData: toolDataPayload,
      });

      // Auto-read aloud if user used voice or Auto-Voice is enabled
      if (state.lastInputWasVoice || state.autoVoice) {
        state.lastInputWasVoice = false;
        setTimeout(() => speakMessage(assistantMsgId), 200);
      }

    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[FlutterAI] Stream error:', err.message);
      updateAssistantBubble(assistantBubble, {
        id: assistantMsgId,
        content: `⚠️ **Connection Notice**: Could not complete AI query (${err.message}). Please retry.`,
        isError: true,
        retryText: messageText,
      });
    } finally {
      state.loading = false;
      state.abortController = null;
    }
  }

  /* ── UI Bubble Helpers ─────────────────────────────────────── */
  function appendUserMessageToUI({ id, content, image }) {
    const container = document.getElementById('ai-messages-list');
    if (!container) return;

    const msgEl = document.createElement('div');
    msgEl.className = 'ai-msg ai-msg--user';
    msgEl.id = `ai-bubble-${id}`;

    const imgHtml = image ? `<img src="${image.data}" class="ai-msg-img-preview" alt="Attachment" />` : '';

    msgEl.innerHTML = `
      <div class="ai-msg-avatar">
        ${(window.AuthManager?.currentUser?.name?.[0] || 'U').toUpperCase()}
      </div>
      <div class="ai-msg-content">
        ${imgHtml}
        <p>${esc(content)}</p>
      </div>
    `;

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
  }

  function appendAssistantPlaceholder(id) {
    const container = document.getElementById('ai-messages-list');
    if (!container) return null;

    const msgEl = document.createElement('div');
    msgEl.className = 'ai-msg ai-msg--assistant';
    msgEl.id = `ai-bubble-${id}`;

    msgEl.innerHTML = `
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-msg-content" id="ai-content-${id}">
        <div class="ai-typing-indicator">
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
        </div>
      </div>
    `;

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
    return msgEl;
  }

  function showToolCallingBadge(bubbleEl, toolName) {
    if (!bubbleEl) return;
    const contentEl = bubbleEl.querySelector('.ai-msg-content');
    if (!contentEl) return;

    let badge = contentEl.querySelector('.ai-tool-loading-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'ai-tool-loading-badge';
      contentEl.prepend(badge);
    }
    badge.innerHTML = `⚙️ Querying ${toolName === 'searchPackages' ? 'Package Directory' : (toolName === 'searchFlutterJobs' ? 'Job Board' : 'FlutterHub')}...`;
  }

  function hideToolCallingBadge(bubbleEl) {
    if (!bubbleEl) return;
    const badge = bubbleEl.querySelector('.ai-tool-loading-badge');
    if (badge) badge.remove();
  }

  function updateStreamingBubbleContent(bubbleEl, currentText) {
    if (!bubbleEl) return;
    const contentEl = bubbleEl.querySelector('.ai-msg-content');
    if (!contentEl) return;

    contentEl.innerHTML = formatMarkdown(currentText) + '<span class="ai-streaming-cursor"></span>';
    const container = document.getElementById('ai-messages-list');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function finalizeAssistantBubble(bubbleEl, { id, content, toolData }) {
    if (!bubbleEl) return;
    const contentEl = bubbleEl.querySelector('.ai-msg-content');
    if (!contentEl) return;

    const formatted = formatMarkdown(content);
    const toolCardsHtml = toolData ? renderToolCards(toolData) : '';
    const actionsHtml = `
      <div class="ai-msg-actions">
        <button id="ai-voice-btn-${id}" class="ai-voice-btn" onclick="FlutterAIAgent.speakMessage('${id}')">
          🔊 Listen
        </button>
        <button class="ai-voice-btn" onclick="FlutterAIAgent.copyResponse('${id}')">
          📋 Copy
        </button>
      </div>
    `;

    contentEl.innerHTML = formatted + toolCardsHtml + actionsHtml;
    const container = document.getElementById('ai-messages-list');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function updateAssistantBubble(bubbleEl, { id, content, isQuotaExceeded, isError, retryText }) {
    if (!bubbleEl) return;
    const contentEl = bubbleEl.querySelector('.ai-msg-content');
    if (!contentEl) return;

    let actions = '';
    if (isQuotaExceeded) {
      actions = `
        <div class="ai-msg-actions">
          <button class="btn btn-premium btn-sm" onclick="PaymentGateway.openCheckout()" style="font-size:0.75rem;padding:3px 10px;">
            ⚡ Get Pro — ₹29/mo
          </button>
        </div>
      `;
    } else if (isError && retryText) {
      actions = `
        <div class="ai-msg-actions">
          <button class="btn btn-secondary btn-sm" onclick="FlutterAIAgent.sendPrompt('${esc(retryText)}')" style="font-size:0.75rem;padding:3px 8px;">
            🔄 Retry
          </button>
        </div>
      `;
    }

    contentEl.innerHTML = formatMarkdown(content) + actions;
  }

  function updateQuotaUI() {
    const el = document.getElementById('ai-quota-counter');
    if (!el) return;
    const userIsPro = state.isPro || checkUserIsPro();
    if (userIsPro) {
      el.innerHTML = `<span class="badge badge-emerald" style="font-size:0.7rem;">💎 PRO UNLIMITED</span>`;
    } else {
      el.innerHTML = `<span>Daily AI Queries: <strong>${state.quota.remaining}/15</strong> remaining</span>`;
    }
  }

  function clearChat() {
    stopSpeech();
    state.history = [];
    state.messagesMap.clear();
    removeStagedImage();

    // Register welcome message
    const welcomeId = 'welcome_msg';
    const welcomeText = "Hey there! I'm FlutterHub AI, a general AI assistant with deep Flutter and Dart expertise. Ask anything, or get help with Flutter code, packages, jobs, screenshots, and debugging.";
    state.messagesMap.set(welcomeId, welcomeText);

    const container = document.getElementById('ai-messages-list');
    if (container) {
      container.innerHTML = `
        <div class="ai-msg ai-msg--assistant" id="ai-bubble-${welcomeId}">
          <div class="ai-msg-avatar">🤖</div>
          <div class="ai-msg-content">
            <h4 style="color:#38bdf8; margin:0 0 4px 0;">Flutter Hub AI</h4>
            <p style="margin:0 0 6px 0; font-size:0.85rem;">${welcomeText}</p>
            <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">💡 Type below, attach a screenshot 📎, or tap <strong>🎤</strong> to speak.</p>
            <div class="ai-msg-actions">
              <button id="ai-voice-btn-${welcomeId}" class="ai-voice-btn" onclick="FlutterAIAgent.speakMessage('${welcomeId}')">
                🔊 Listen
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  /* ── Public API ────────────────────────────────────────────── */
  async function init() {
    if (state.initialized) return;
    state.initialized = true;
    state.isPro = checkUserIsPro();

    // Register welcome message
    const welcomeId = 'welcome_msg';
    const welcomeText = "Hey there! I'm FlutterHub AI, a general AI assistant with deep Flutter and Dart expertise. Ask anything, or get help with Flutter code, packages, jobs, screenshots, and debugging.";
    state.messagesMap.set(welcomeId, welcomeText);

    try {
      const res = await fetch('/api/ai/quota', {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.quota) state.quota = d.quota;
      }
    } catch (e) {}

    updateQuotaUI();

    // Input Enter key binding
    const input = document.getElementById('ai-user-input');
    if (input && !input.hasAttribute('data-bound')) {
      input.setAttribute('data-bound', 'true');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage(input.value);
        }
      });

      // Clipboard Paste Screenshot Listener (Ctrl+V)
      input.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;
        for (const item of items) {
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) handleImageFile(file);
          }
        }
      });
    }

    // Auto-voice badge update
    const autoVoiceBtn = document.getElementById('ai-auto-voice-toggle');
    if (autoVoiceBtn) {
      autoVoiceBtn.innerHTML = state.autoVoice ? '🔊 Voice: ON' : '🔈 Voice: OFF';
      autoVoiceBtn.style.color = state.autoVoice ? '#34d399' : 'var(--text-muted)';
    }
  }

  // Auto initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    toggleChatWindow,
    openChatWindow,
    closeChatWindow,
    sendMessage,
    toggleVoiceInput,
    speakMessage,
    stopSpeech,
    toggleAutoVoice,
    clearChat,
    handleImageFile,
    removeStagedImage,

    stopGeneration() {
      if (state.abortController) {
        state.abortController.abort();
        state.abortController = null;
        state.loading = false;
        if (window.App && App.showToast) App.showToast('Generation stopped.', 'info');
      }
    },

    regenerateLast() {
      if (state.loading || !state.lastUserPrompt) return;
      sendMessage(state.lastUserPrompt);
    },

    rateResponse(msgId, rating) {
      localStorage.setItem(`flutterhub_ai_feedback_${msgId}`, rating);
      if (window.App && App.showToast) App.showToast('Thanks for the feedback.', 'success');
    },

    triggerImagePicker() {
      const fileInput = document.getElementById('ai-file-input');
      if (fileInput) fileInput.click();
    },

    sendPrompt(promptText) {
      const input = document.getElementById('ai-user-input');
      if (input) input.value = promptText;
      sendMessage(promptText);
    },

    copyCode(codeId) {
      const el = document.getElementById(codeId);
      if (!el) return;
      navigator.clipboard.writeText(el.innerText).then(() => {
        if (window.App && App.showToast) App.showToast('Copied Flutter code! 📋', 'success');
      });
    },

    copyResponse(msgId) {
      const text = state.messagesMap.get(msgId) || '';
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        if (window.App && App.showToast) App.showToast('Copied AI response! 📋', 'success');
      });
    },

    openPackage(pkgId) {
      if (window.PackagesView && PackagesView.openDetail) {
        PackagesView.openDetail(pkgId);
      } else if (window.App && App.switchView) {
        App.switchView('projects');
      }
    }
  };

})();

window.FlutterAIAgent = FlutterAIAgent;
