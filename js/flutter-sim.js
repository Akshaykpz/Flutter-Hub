/* ==========================================================================
   FlutterHub Interactive Widget Simulator Engine
   Renders real-time interactive JavaScript/CSS simulations of Flutter widgets
   ========================================================================== */

const FlutterSim = {
  renderWidget: function(simType, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    switch (simType) {
      case 'voice_memo':
        const audioId = `vm-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="width:100%; max-width:340px; background:#ffffff; border-radius:24px; padding:18px 20px; color:#0f172a; box-shadow:0 16px 36px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:space-between; gap:14px; transition:all 0.3s ease;">
            <!-- Play/Pause Button -->
            <button id="play-btn-${audioId}" style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, #a855f7, #6366f1); border:none; color:#ffffff; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 8px 20px rgba(168,85,247,0.4); flex-shrink:0; transition:transform 0.15s ease;">
              <svg id="play-icon-${audioId}" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>

            <!-- Waveform Bars -->
            <div style="flex:1; display:flex; align-items:center; gap:3px; height:32px; overflow:hidden;">
              ${[14, 22, 32, 26, 18, 28, 34, 20, 12, 24, 30, 16, 22, 28, 14, 20, 32, 24, 16, 10].map((h, i) => `
                <div id="bar-${audioId}-${i}" style="flex:1; height:${h}px; border-radius:3px; background:${i < 5 ? '#3b82f6' : '#e2e8f0'}; transition:height 0.15s ease, background 0.15s ease;"></div>
              `).join('')}
            </div>

            <!-- Time Display -->
            <div style="display:flex; flex-direction:column; align-items:flex-end; font-family:var(--font-mono); flex-shrink:0;">
              <span id="time-cur-${audioId}" style="font-weight:800; font-size:13px; color:#8b5cf6;">00:04</span>
              <span style="font-size:10px; color:#94a3b8; font-weight:600;">00:30</span>
            </div>
          </div>
        `;

        (function() {
          let isPlaying = false;
          let seconds = 4;
          let timer = null;
          let audioCtx = null;
          let osc = null;

          setTimeout(() => {
            const playBtn = document.getElementById(`play-btn-${audioId}`);
            const playIcon = document.getElementById(`play-icon-${audioId}`);
            const timeCur = document.getElementById(`time-cur-${audioId}`);

            if (!playBtn) return;

            playBtn.addEventListener('click', () => {
              isPlaying = !isPlaying;
              if (isPlaying) {
                try {
                  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                  osc = audioCtx.createOscillator();
                  const gain = audioCtx.createGain();
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                  osc.connect(gain);
                  gain.connect(audioCtx.destination);
                  osc.start();
                } catch(e){}

                if (playIcon) playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>`;
                playBtn.style.transform = 'scale(1.08)';

                timer = setInterval(() => {
                  seconds = (seconds + 1) % 31;
                  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
                  const secs = String(seconds % 60).padStart(2, '0');
                  if (timeCur) timeCur.innerText = `${mins}:${secs}`;

                  const playedCount = Math.floor((seconds / 30) * 20);
                  for (let i = 0; i < 20; i++) {
                    const bar = document.getElementById(`bar-${audioId}-${i}`);
                    if (bar) {
                      const randomH = Math.floor(Math.random() * 24) + 8;
                      bar.style.height = `${randomH}px`;
                      bar.style.background = i <= playedCount ? '#3b82f6' : '#e2e8f0';
                    }
                  }
                }, 200);
              } else {
                if (osc) { try { osc.stop(); } catch(e){} }
                if (audioCtx) { try { audioCtx.close(); } catch(e){} }
                clearInterval(timer);
                if (playIcon) playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
                playBtn.style.transform = 'scale(1)';
              }
            });
          }, 50);
        })();
        break;
      case 'glass_button':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
            <button id="sim-glass-btn-${containerId}" style="
              background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(139,92,246,0.2));
              border: 1px solid rgba(255,255,255,0.25);
              backdrop-filter: blur(12px);
              color: white;
              padding: 12px 24px;
              border-radius: 16px;
              font-family: var(--font-sans);
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              box-shadow: 0 8px 32px rgba(56,189,248,0.25);
              transition: all 0.25s ease;
              display: flex; align-items: center; gap: 8px;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>Aceternity Neo Button (<span id="sim-count-${containerId}">0</span>)</span>
            </button>
            <span style="font-size: 11px; color: var(--text-muted);">✨ Click to test interactive state!</span>
          </div>
        `;
        let count = 0;
        const btn = document.getElementById(`sim-glass-btn-${containerId}`);
        if (btn) {
          btn.addEventListener('click', () => {
            count++;
            const counter = document.getElementById(`sim-count-${containerId}`);
            if (counter) counter.innerText = count;
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);
          });
        }
        break;

      case 'shimmer_card':
        el.innerHTML = `
          <div style="width: 100%; max-width: 320px; background: var(--bg-tertiary); padding: 16px; border-radius: 16px; border: 1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
              <div class="shimmer-box" style="width: 44px; height: 44px; border-radius: 50%;"></div>
              <div style="display:flex; flex-direction:column; gap:6px; flex:1;">
                <div class="shimmer-box" style="width: 60%; height: 14px;"></div>
                <div class="shimmer-box" style="width: 40%; height: 10px;"></div>
              </div>
            </div>
            <div class="shimmer-box" style="width: 100%; height: 100px; border-radius: 12px;"></div>
          </div>
        `;
        break;

      case 'checkout_preview':
        el.innerHTML = `
          <div style="width:100%; max-width:320px; background:#0f172a; padding:16px; border-radius:18px; border:1px solid rgba(56,189,248,0.3); color:#fff; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; font-size:14px; color:#38bdf8;">💳 Modern Checkout</span>
              <span style="font-size:11px; background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:12px; font-weight:700;">PRO</span>
            </div>
            <div style="background:#1e293b; padding:10px; border-radius:10px; font-size:12px;">
              <div style="color:#94a3b8; font-size:10px;">Item Total</div>
              <div style="font-weight:800; font-size:16px;">₹1,499.00</div>
            </div>
            <button style="background:linear-gradient(135deg, #0284c7, #8b5cf6); border:none; color:#fff; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
              Pay Now (Instant)
            </button>
          </div>
        `;
        break;

      case 'dock_menu':
        el.innerHTML = `
          <div style="
            background: rgba(30, 41, 59, 0.85);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.15);
            padding: 8px 16px;
            border-radius: 32px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          ">
            <div class="dock-item active" style="padding:10px; border-radius:50%; background:#38bdf8; color:#000; cursor:pointer;"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>
            <div class="dock-item" style="padding:10px; border-radius:50%; background:transparent; color:#fff; cursor:pointer;"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg></div>
            <div class="dock-item" style="padding:10px; border-radius:50%; background:transparent; color:#fff; cursor:pointer;"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg></div>
          </div>
        `;
        break;

      case 'otp_input':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
            <div style="display:flex; gap:8px;">
              <input type="text" maxlength="1" value="5" style="width:40px; height:48px; text-align:center; background:#1e293b; border:2px solid #38bdf8; color:#fff; font-size:18px; font-weight:700; border-radius:10px;" />
              <input type="text" maxlength="1" value="8" style="width:40px; height:48px; text-align:center; background:#1e293b; border:2px solid #38bdf8; color:#fff; font-size:18px; font-weight:700; border-radius:10px;" />
              <input type="text" maxlength="1" value="2" style="width:40px; height:48px; text-align:center; background:#1e293b; border:2px solid #38bdf8; color:#fff; font-size:18px; font-weight:700; border-radius:10px;" />
              <input type="text" maxlength="1" value="9" style="width:40px; height:48px; text-align:center; background:#1e293b; border:2px solid #10b981; color:#10b981; font-size:18px; font-weight:700; border-radius:10px;" />
            </div>
            <span style="color:#10b981; font-size:12px; font-weight:600;">✓ OTP Verified</span>
          </div>
        `;
        break;

      case 'dialog_preview':
        el.innerHTML = `
          <div style="background:var(--bg-tertiary); padding:16px; border-radius:16px; border:1px solid var(--border-color); text-align:center; max-width:280px;">
            <div style="font-weight:700; color:#fff; margin-bottom:6px;">Glassmorphism Alert</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Are you sure you want to proceed?</div>
            <div style="display:flex; gap:8px; justify-content:center;">
              <button style="background:none; border:1px solid var(--border-color); color:#fff; padding:6px 12px; border-radius:8px; font-size:12px; cursor:pointer;">Cancel</button>
              <button style="background:var(--grad-flutter); border:none; color:#fff; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">Confirm</button>
            </div>
          </div>
        `;
        break;

      case 'chart_preview':
        el.innerHTML = `
          <div style="background:var(--bg-tertiary); padding:16px; border-radius:16px; border:1px solid var(--border-color); width:100%; max-width:300px;">
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px; font-weight:600;">FL Chart Analytics</div>
            <div style="display:flex; align-items:flex-end; gap:8px; height:80px; padding-top:12px;">
              <div style="flex:1; background:#0284c7; height:40%; border-radius:4px 4px 0 0;"></div>
              <div style="flex:1; background:#38bdf8; height:70%; border-radius:4px 4px 0 0;"></div>
              <div style="flex:1; background:#8b5cf6; height:100%; border-radius:4px 4px 0 0;"></div>
              <div style="flex:1; background:#10b981; height:60%; border-radius:4px 4px 0 0;"></div>
            </div>
          </div>
        `;
        break;

      case 'timeline_preview':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:12px; max-width:280px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:24px; height:24px; border-radius:50%; background:#10b981; color:#000; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px;">✓</div>
              <div style="font-size:13px; color:#fff; font-weight:600;">Order Placed (10:30 AM)</div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:24px; height:24px; border-radius:50%; background:#38bdf8; color:#000; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px;">🚚</div>
              <div style="font-size:13px; color:#38bdf8; font-weight:600;">Out for Delivery</div>
            </div>
          </div>
        `;
        break;

      case 'fab_menu':
        const fabId = `fab-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:10px; position:relative;">
            <div id="menu-fab-${fabId}" style="display:none; flex-direction:column; gap:8px; align-items:center; transform:scale(0.8); transition:all 0.2s ease;">
              <button style="width:36px; height:36px; border-radius:50%; background:#10b981; border:none; color:#000; font-weight:800; cursor:pointer;" title="Share">🔗</button>
              <button style="width:36px; height:36px; border-radius:50%; background:#a855f7; border:none; color:#fff; font-weight:800; cursor:pointer;" title="Bookmark">❤️</button>
            </div>
            <button id="trig-fab-${fabId}" style="background:#38bdf8; color:#000; width:52px; height:52px; border-radius:50%; border:none; font-weight:800; font-size:24px; box-shadow:0 0 20px rgba(56,189,248,0.5); cursor:pointer; transition:transform 0.25s ease;">+</button>
            <span style="font-size:11px; color:#94a3b8;">Click FAB to unfold actions</span>
          </div>
        `;
        (function() {
          let isOpen = false;
          setTimeout(() => {
            const trig = document.getElementById(`trig-fab-${fabId}`);
            const menu = document.getElementById(`menu-fab-${fabId}`);
            if (!trig || !menu) return;

            trig.addEventListener('click', () => {
              isOpen = !isOpen;
              menu.style.display = isOpen ? 'flex' : 'none';
              trig.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)';
            });
          }, 50);
        })();
        break;

      case 'form_input':
        const formId = `fi-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="width:100%; max-width:280px; display:flex; flex-direction:column; gap:8px;">
            <div style="background:#1e293b; border:1px solid #38bdf8; padding:10px 14px; border-radius:14px; display:flex; align-items:center; gap:10px;">
              <span style="color:#38bdf8; font-size:16px;">✉️</span>
              <input type="text" id="input-${formId}" value="dev@flutterhub.dev" style="background:none; border:none; color:#fff; font-size:13px; font-weight:600; width:100%; outline:none;" />
            </div>
            <span id="valid-${formId}" style="font-size:11px; color:#10b981; font-weight:600;">✓ Valid Email Address</span>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const input = document.getElementById(`input-${formId}`);
            const valid = document.getElementById(`valid-${formId}`);
            if (input && valid) {
              input.addEventListener('input', () => {
                const isOk = input.value.includes('@') && input.value.includes('.');
                valid.innerText = isOk ? '✓ Valid Email Address' : '⚠️ Invalid Email Format';
                valid.style.color = isOk ? '#10b981' : '#f43f5e';
              });
            }
          }, 50);
        })();
        break;

      case 'password_input':
        const pwdId = `pwd-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="width:100%; max-width:280px; display:flex; flex-direction:column; gap:8px;">
            <div style="background:#1e293b; border:1px solid #a855f7; padding:10px 14px; border-radius:14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
              <div style="display:flex; align-items:center; gap:8px; flex:1;">
                <span style="color:#a855f7; font-size:16px;">🔒</span>
                <input type="password" id="input-${pwdId}" value="supersecret123" style="background:none; border:none; color:#fff; font-size:13px; font-weight:600; width:100%; outline:none;" />
              </div>
              <button id="btn-${pwdId}" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:14px;">👁️</button>
            </div>
            <span style="font-size:11px; color:#a855f7; font-weight:600;">🔒 Password Security Strength: High</span>
          </div>
        `;
        (function() {
          let isShow = false;
          setTimeout(() => {
            const input = document.getElementById(`input-${pwdId}`);
            const btn = document.getElementById(`btn-${pwdId}`);
            if (input && btn) {
              btn.addEventListener('click', () => {
                isShow = !isShow;
                input.type = isShow ? 'text' : 'password';
                btn.innerText = isShow ? '🙈' : '👁️';
              });
            }
          }, 50);
        })();
        break;

      case 'search_input':
        const srchId = `srch-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="width:100%; max-width:280px; background:#1e293b; border:1px solid #38bdf8; padding:10px 14px; border-radius:30px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px; flex:1;">
              <span style="color:#38bdf8; font-size:15px;">🔍</span>
              <input type="text" id="input-${srchId}" value="Flutter 3.x Widgets" style="background:none; border:none; color:#fff; font-size:13px; font-weight:600; width:100%; outline:none;" />
            </div>
            <button id="btn-${srchId}" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:14px;">✕</button>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const input = document.getElementById(`input-${srchId}`);
            const btn = document.getElementById(`btn-${srchId}`);
            if (input && btn) {
              btn.addEventListener('click', () => input.value = '');
            }
          }, 50);
        })();
        break;

      case 'card_input':
        el.innerHTML = `
          <div style="width:100%; max-width:280px; background:#1e293b; border:1px solid #0284c7; padding:10px 14px; border-radius:14px; display:flex; align-items:center; gap:10px;">
            <span style="font-size:16px;">💳</span>
            <input type="text" value="4532 - 8829 - 1049 - 8821" style="background:none; border:none; color:#38bdf8; font-size:13px; font-weight:700; width:100%; outline:none; font-family:var(--font-mono);" />
          </div>
        `;
        break;

      case 'phone_input':
        el.innerHTML = `
          <div style="width:100%; max-width:280px; display:flex; gap:8px;">
            <div style="background:#1e293b; border:1px solid var(--border-color); padding:10px 12px; border-radius:12px; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; gap:4px;">
              🇮🇳 +91
            </div>
            <div style="flex:1; background:#1e293b; border:1px solid #38bdf8; padding:10px 14px; border-radius:12px; display:flex; align-items:center;">
              <input type="text" value="98765 43210" style="background:none; border:none; color:#fff; font-size:13px; font-weight:600; width:100%; outline:none;" />
            </div>
          </div>
        `;
        break;

      case 'comment_input':
        el.innerHTML = `
          <div style="width:100%; max-width:280px; background:#1e293b; border:1px solid var(--border-color); padding:10px 14px; border-radius:14px; display:flex; flex-direction:column; gap:6px;">
            <span style="font-size:10px; color:#94a3b8; font-weight:700;">Multiline Comment Box</span>
            <textarea style="background:none; border:none; color:#fff; font-size:12px; font-weight:500; width:100%; height:45px; outline:none; resize:none;">Great component library! Build Flutter web apps 10x faster.</textarea>
          </div>
        `;
        break;

      case 'currency_input':
        el.innerHTML = `
          <div style="width:100%; max-width:280px; background:#1e293b; border:1px solid #10b981; padding:10px 14px; border-radius:14px; display:flex; align-items:center; gap:8px;">
            <span style="color:#10b981; font-weight:800; font-size:16px;">₹</span>
            <input type="text" value="1,499.00" style="background:none; border:none; color:#10b981; font-size:15px; font-weight:800; width:100%; outline:none;" />
          </div>
        `;
        break;

      case 'slidable_list':
        const slideId = `sld-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div id="box-${slideId}" style="width:100%; max-width:300px; background:#1e293b; border-radius:14px; overflow:hidden; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; padding:12px 16px; transition:all 0.3s ease;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:36px; height:36px; border-radius:50%; background:#38bdf8; color:#000; font-weight:800; display:flex; align-items:center; justify-content:center;">A</div>
              <div>
                <div style="color:#fff; font-weight:700; font-size:13px;">Alex Rivera</div>
                <div id="txt-${slideId}" style="color:#94a3b8; font-size:11px;">Active Flutter Developer</div>
              </div>
            </div>
            <div style="display:flex; gap:8px;">
              <button id="arch-${slideId}" style="background:none; border:none; cursor:pointer; font-size:16px;" title="Archive">📦</button>
              <button id="del-${slideId}" style="background:none; border:none; cursor:pointer; font-size:16px;" title="Delete">🗑️</button>
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const box = document.getElementById(`box-${slideId}`);
            const txt = document.getElementById(`txt-${slideId}`);
            const arch = document.getElementById(`arch-${slideId}`);
            const del = document.getElementById(`del-${slideId}`);
            if (!box) return;

            if (arch) {
              arch.addEventListener('click', () => {
                box.style.background = 'rgba(16,185,129,0.2)';
                if (txt) txt.innerText = '📦 Item Archived';
              });
            }
            if (del) {
              del.addEventListener('click', () => {
                box.style.opacity = '0';
                setTimeout(() => {
                  box.style.opacity = '1';
                  box.style.background = '#1e293b';
                  if (txt) txt.innerText = 'Active Flutter Developer';
                }, 1200);
              });
            }
          }, 50);
        })();
        break;

      case 'bottom_sheet_preview':
        const bsId = `bs-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="position:relative; width:100%; max-width:300px; height:180px; background:#0f172a; border-radius:16px; border:1px solid var(--border-color); overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <button id="trig-bs-${bsId}" style="background:linear-gradient(135deg, #10b981, #0284c7); border:none; color:#fff; font-weight:800; padding:10px 18px; border-radius:12px; cursor:pointer; font-size:12px;">
              📊 Trigger Bottom Sheet
            </button>

            <div id="modal-bs-${bsId}" style="position:absolute; bottom:0; left:0; right:0; background:#1e293b; border-radius:20px 20px 0 0; padding:16px; transform:translateY(100%); transition:transform 0.3s ease; border-top:1px solid #38bdf8; z-index:30;">
              <div style="width:32px; height:4px; background:rgba(255,255,255,0.3); border-radius:2px; margin:0 auto 10px;"></div>
              <div style="color:#fff; font-weight:800; font-size:12px; margin-bottom:8px; text-align:center;">Select Payment Option</div>
              <div style="font-size:11px; color:#38bdf8; padding:6px; background:rgba(255,255,255,0.05); border-radius:8px; margin-bottom:4px; cursor:pointer;">💳 Razorpay UPI</div>
              <button id="close-bs-${bsId}" style="width:100%; margin-top:8px; background:none; border:none; color:#f43f5e; font-size:11px; font-weight:700; cursor:pointer;">Close</button>
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const trig = document.getElementById(`trig-bs-${bsId}`);
            const modal = document.getElementById(`modal-bs-${bsId}`);
            const close = document.getElementById(`close-bs-${bsId}`);

            if (trig && modal) {
              trig.addEventListener('click', () => modal.style.transform = 'translateY(0%)');
            }
            if (close && modal) {
              close.addEventListener('click', () => modal.style.transform = 'translateY(100%)');
            }
          }, 50);
        })();
        break;

      case 'snackbar_preview':
        const sbId = `sb-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; max-width:300px;">
            <button id="trig-sb-${sbId}" style="background:var(--grad-flutter); border:none; color:#fff; font-weight:800; padding:10px 18px; border-radius:12px; cursor:pointer; font-size:12px;">
              ✨ Trigger Toast SnackBar
            </button>
            <div id="toast-sb-${sbId}" style="opacity:0; transform:translateY(10px); transition:all 0.3s ease; background:#1e293b; border:1px solid #10b981; color:#fff; padding:10px 16px; border-radius:14px; font-size:12px; font-weight:700; display:flex; align-items:center; gap:8px;">
              <span style="color:#10b981;">✓</span> Code copied to clipboard!
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const trig = document.getElementById(`trig-sb-${sbId}`);
            const toast = document.getElementById(`toast-sb-${sbId}`);
            if (!trig || !toast) return;

            trig.addEventListener('click', () => {
              toast.style.opacity = '1';
              toast.style.transform = 'translateY(0px)';
              setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
              }, 2500);
            });
          }, 50);
        })();
        break;

      case 'sliver_appbar':
        const slvId = `slv-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div id="box-slv-${slvId}" style="width:100%; max-width:300px; height:180px; background:#0f172a; border-radius:16px; border:1px solid var(--border-color); overflow-y:auto; position:relative;">
            <div id="hdr-slv-${slvId}" style="position:sticky; top:0; background:linear-gradient(135deg, #0284c7, #8b5cf6); padding:16px; color:#fff; text-align:center; font-weight:800; font-size:13px; z-index:10; transition:all 0.2s ease;">
              Collapsing Parallax Header
            </div>
            <div style="padding:16px; display:flex; flex-direction:column; gap:8px;">
              ${[1,2,3,4,5,6].map(i => `<div style="padding:8px; background:rgba(255,255,255,0.05); border-radius:8px; color:#fff; font-size:11px;">Sliver List Item #${i}</div>`).join('')}
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const box = document.getElementById(`box-slv-${slvId}`);
            const hdr = document.getElementById(`hdr-slv-${slvId}`);
            if (box && hdr) {
              box.addEventListener('scroll', () => {
                if (box.scrollTop > 30) {
                  hdr.style.padding = '8px 16px';
                  hdr.style.fontSize = '11px';
                } else {
                  hdr.style.padding = '16px';
                  hdr.style.fontSize = '13px';
                }
              });
            }
          }, 50);
        })();
        break;

      case 'nav_bar_preview':
        const navId = `nav-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="background:#0f172a; border:1px solid var(--border-color); padding:8px 12px; border-radius:24px; display:flex; gap:8px; align-items:center; width:100%; max-width:300px; justify-content:space-around;">
            <button id="nitem-${navId}-0" style="background:rgba(56,189,248,0.2); color:#38bdf8; border:none; padding:8px 14px; border-radius:16px; font-weight:800; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">🏠 <span>Home</span></button>
            <button id="nitem-${navId}-1" style="background:transparent; color:#94a3b8; border:none; padding:8px 14px; border-radius:16px; font-weight:700; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">🔍 <span>Search</span></button>
            <button id="nitem-${navId}-2" style="background:transparent; color:#94a3b8; border:none; padding:8px 14px; border-radius:16px; font-weight:700; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">👤 <span>Profile</span></button>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const items = [0,1,2].map(i => document.getElementById(`nitem-${navId}-${i}`));
            const colors = ['#38bdf8', '#a855f7', '#10b981'];
            items.forEach((item, idx) => {
              if (!item) return;
              item.addEventListener('click', () => {
                items.forEach((it, i) => {
                  if (!it) return;
                  if (i === idx) {
                    it.style.background = `${colors[idx]}33`;
                    it.style.color = colors[idx];
                    it.style.fontWeight = '800';
                  } else {
                    it.style.background = 'transparent';
                    it.style.color = '#94a3b8';
                    it.style.fontWeight = '700';
                  }
                });
              });
            });
          }, 50);
        })();
        break;

      case 'drawer_preview':
        const drawerId = `drw-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="position:relative; width:100%; max-width:300px; height:180px; background:#0f172a; border-radius:16px; border:1px solid var(--border-color); overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <button id="toggle-drw-${drawerId}" style="background:linear-gradient(135deg, #38bdf8, #8b5cf6); border:none; color:#fff; font-weight:800; padding:10px 18px; border-radius:12px; cursor:pointer; font-size:12px; display:flex; align-items:center; gap:8px;">
              <span>☰ Toggle Glass Drawer</span>
            </button>
            <span style="font-size:11px; color:#94a3b8; margin-top:8px;">Click to slide out drawer menu</span>

            <div id="panel-drw-${drawerId}" style="position:absolute; inset:0; background:rgba(15,23,42,0.95); backdrop-filter:blur(12px); transform:translateX(-100%); transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding:16px; display:flex; flex-direction:column; gap:10px; z-index:30;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
                <span style="font-size:12px; font-weight:800; color:#38bdf8;">👤 Navigation Drawer</span>
                <button id="close-drw-${drawerId}" style="background:none; border:none; color:#fff; font-weight:800; cursor:pointer; font-size:14px;">✕</button>
              </div>
              <div style="font-size:11px; color:#fff; padding:6px; background:rgba(255,255,255,0.05); border-radius:8px; cursor:pointer;">🏠 Dashboard View</div>
              <div style="font-size:11px; color:#fff; padding:6px; background:rgba(255,255,255,0.05); border-radius:8px; cursor:pointer;">⚙️ Account Settings</div>
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const toggleBtn = document.getElementById(`toggle-drw-${drawerId}`);
            const closeBtn = document.getElementById(`close-drw-${drawerId}`);
            const panel = document.getElementById(`panel-drw-${drawerId}`);
            if (toggleBtn && panel) {
              toggleBtn.addEventListener('click', () => panel.style.transform = 'translateX(0%)');
            }
            if (closeBtn && panel) {
              closeBtn.addEventListener('click', () => panel.style.transform = 'translateX(-100%)');
            }
          }, 50);
        })();
        break;

      case 'tab_bar_preview':
        const tabId = `tab-sim-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; max-width:320px;">
            <div style="background:#1e293b; padding:4px; border-radius:16px; display:flex; gap:4px; width:100%; border:1px solid rgba(255,255,255,0.1);">
              <button id="tbtn-${tabId}-0" style="flex:1; background:#38bdf8; color:#0f172a; font-weight:800; padding:8px 12px; border-radius:12px; text-align:center; font-size:12px; border:none; cursor:pointer; transition:all 0.2s ease;">Overview</button>
              <button id="tbtn-${tabId}-1" style="flex:1; background:transparent; color:#94a3b8; font-weight:700; padding:8px 12px; border-radius:12px; text-align:center; font-size:12px; border:none; cursor:pointer; transition:all 0.2s ease;">Analytics</button>
              <button id="tbtn-${tabId}-2" style="flex:1; background:transparent; color:#94a3b8; font-weight:700; padding:8px 12px; border-radius:12px; text-align:center; font-size:12px; border:none; cursor:pointer; transition:all 0.2s ease;">Reports</button>
            </div>
            <div id="tbody-${tabId}" style="background:#0f172a; border:1px solid rgba(56,189,248,0.2); padding:12px; border-radius:12px; width:100%; text-align:center; font-size:12px; color:#38bdf8; font-weight:700;">
              📊 Active Tab: Overview Dashboard View
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const btn0 = document.getElementById(`tbtn-${tabId}-0`);
            const btn1 = document.getElementById(`tbtn-${tabId}-1`);
            const btn2 = document.getElementById(`tbtn-${tabId}-2`);
            const body = document.getElementById(`tbody-${tabId}`);
            if (!btn0 || !btn1 || !btn2) return;

            function selectTab(idx, title) {
              [btn0, btn1, btn2].forEach((b, i) => {
                if (i === idx) {
                  b.style.background = '#38bdf8';
                  b.style.color = '#0f172a';
                  b.style.fontWeight = '800';
                } else {
                  b.style.background = 'transparent';
                  b.style.color = '#94a3b8';
                  b.style.fontWeight = '700';
                }
              });
              if (body) body.innerHTML = `📊 Active Tab: ${title} View`;
            }

            btn0.addEventListener('click', () => selectTab(0, 'Overview Dashboard'));
            btn1.addEventListener('click', () => selectTab(1, 'Live Analytics Chart'));
            btn2.addEventListener('click', () => selectTab(2, 'Exported Reports PDF'));
          }, 50);
        })();
        break;

      case 'dropdown_preview':
        const dropId = `drop-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="position:relative; width:100%; max-width:280px;">
            <button id="drop-btn-${dropId}" style="width:100%; background:#1e293b; border:1px solid #38bdf8; padding:10px 14px; border-radius:12px; color:#fff; display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:700; cursor:pointer;">
              <span id="drop-val-${dropId}">Riverpod 2.x</span>
              <span style="color:#38bdf8;">▼</span>
            </button>
            <div id="drop-menu-${dropId}" style="display:none; position:absolute; top:110%; left:0; right:0; background:#0f172a; border:1px solid #38bdf8; border-radius:12px; overflow:hidden; z-index:20; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
              ${['Riverpod 2.x', 'BLoC 8.x', 'Provider State', 'GetX Architecture'].map(opt => `
                <div class="drop-opt-${dropId}" style="padding:10px 14px; color:#fff; font-size:12px; font-weight:600; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.05);" data-val="${opt}">${opt}</div>
              `).join('')}
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const btn = document.getElementById(`drop-btn-${dropId}`);
            const menu = document.getElementById(`drop-menu-${dropId}`);
            const valSpan = document.getElementById(`drop-val-${dropId}`);
            if (!btn || !menu) return;

            btn.addEventListener('click', () => {
              menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            });

            document.querySelectorAll(`.drop-opt-${dropId}`).forEach(opt => {
              opt.addEventListener('click', (e) => {
                const val = e.target.getAttribute('data-val');
                if (valSpan) valSpan.innerText = val;
                menu.style.display = 'none';
              });
            });
          }, 50);
        })();
        break;

      case 'switch_preview':
        const swId = `sw-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; align-items:center; gap:14px; cursor:pointer;" id="sw-wrap-${swId}">
            <div id="sw-bg-${swId}" style="width:56px; height:30px; background:#10b981; border-radius:16px; padding:3px; display:flex; align-items:center; transition:all 0.25s ease;">
              <div id="sw-knob-${swId}" style="width:24px; height:24px; background:#fff; border-radius:50%; transform:translateX(26px); transition:transform 0.25s ease; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
            </div>
            <span id="sw-txt-${swId}" style="color:#10b981; font-weight:800; font-size:13px;">ON</span>
          </div>
        `;
        (function() {
          let isOn = true;
          setTimeout(() => {
            const wrap = document.getElementById(`sw-wrap-${swId}`);
            const bg = document.getElementById(`sw-bg-${swId}`);
            const knob = document.getElementById(`sw-knob-${swId}`);
            const txt = document.getElementById(`sw-txt-${swId}`);
            if (!wrap) return;

            wrap.addEventListener('click', () => {
              isOn = !isOn;
              if (bg) bg.style.background = isOn ? '#10b981' : '#334155';
              if (knob) knob.style.transform = isOn ? 'translateX(26px)' : 'translateX(0px)';
              if (txt) {
                txt.innerText = isOn ? 'ON' : 'OFF';
                txt.style.color = isOn ? '#10b981' : '#94a3b8';
              }
            });
          }, 50);
        })();
        break;

      case 'radio_card':
        const rcId = `rc-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; gap:12px; width:100%; max-width:300px;">
            <div id="rc-opt-${rcId}-0" style="flex:1; background:#1e293b; border:2px solid #38bdf8; padding:12px; border-radius:14px; text-align:center; color:#fff; font-size:12px; font-weight:800; cursor:pointer; transition:all 0.2s ease;">
              <div>⚡ Monthly</div>
              <div style="font-size:10px; color:#38bdf8; margin-top:2px;">₹29 / mo</div>
            </div>
            <div id="rc-opt-${rcId}-1" style="flex:1; background:#1e293b; border:1px solid var(--border-color); padding:12px; border-radius:14px; text-align:center; color:#94a3b8; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s ease;">
              <div>👑 Yearly</div>
              <div style="font-size:10px; color:#94a3b8; margin-top:2px;">₹300 / yr</div>
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const card0 = document.getElementById(`rc-opt-${rcId}-0`);
            const card1 = document.getElementById(`rc-opt-${rcId}-1`);
            if (!card0 || !card1) return;

            card0.addEventListener('click', () => {
              card0.style.borderColor = '#38bdf8';
              card0.style.borderWidth = '2px';
              card0.style.color = '#fff';

              card1.style.borderColor = 'var(--border-color)';
              card1.style.borderWidth = '1px';
              card1.style.color = '#94a3b8';
            });

            card1.addEventListener('click', () => {
              card1.style.borderColor = '#8b5cf6';
              card1.style.borderWidth = '2px';
              card1.style.color = '#fff';

              card0.style.borderColor = 'var(--border-color)';
              card0.style.borderWidth = '1px';
              card0.style.color = '#94a3b8';
            });
          }, 50);
        })();
        break;

      case 'range_slider':
        const rsId = `rs-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="width:100%; max-width:280px; display:flex; flex-direction:column; gap:8px; align-items:center;">
            <div style="font-size:12px; font-weight:800; color:#38bdf8;">Range: <span id="rs-val-${rsId}">40%</span></div>
            <input type="range" min="0" max="100" value="40" id="rs-input-${rsId}" style="width:100%; accent-color:#38bdf8; cursor:pointer;" />
          </div>
        `;
        (function() {
          setTimeout(() => {
            const input = document.getElementById(`rs-input-${rsId}`);
            const val = document.getElementById(`rs-val-${rsId}`);
            if (input && val) {
              input.addEventListener('input', () => {
                val.innerText = `${input.value}%`;
              });
            }
          }, 50);
        })();
        break;

      case 'chip_group':
        const cgId = `cg-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; max-width:300px;">
            ${['Widgets', 'Animations', 'State', 'Pro'].map((tag, idx) => `
              <button id="chip-${cgId}-${idx}" class="chip-item-${cgId}" data-idx="${idx}" style="background:${idx === 0 ? '#38bdf8' : '#1e293b'}; color:${idx === 0 ? '#0f172a' : '#fff'}; border:1px solid ${idx === 0 ? '#38bdf8' : 'var(--border-color)'}; padding:6px 14px; border-radius:16px; font-size:12px; font-weight:800; cursor:pointer; transition:all 0.2s ease;">
                ${tag}
              </button>
            `).join('')}
          </div>
        `;
        (function() {
          setTimeout(() => {
            const chips = document.querySelectorAll(`.chip-item-${cgId}`);
            chips.forEach(chip => {
              chip.addEventListener('click', () => {
                chips.forEach(c => {
                  c.style.background = '#1e293b';
                  c.style.color = '#fff';
                  c.style.borderColor = 'var(--border-color)';
                });
                chip.style.background = '#38bdf8';
                chip.style.color = '#0f172a';
                chip.style.borderColor = '#38bdf8';
              });
            });
          }, 50);
        })();
        break;

      case 'tooltip_preview':
        const tipId = `tip-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
            <button id="trig-tip-${tipId}" style="background:#1e293b; border:1px solid #38bdf8; color:#38bdf8; padding:8px 16px; border-radius:12px; font-weight:800; font-size:12px; cursor:pointer;">
              ℹ️ Hover or Click Tooltip
            </button>
            <div id="pop-tip-${tipId}" style="display:none; position:absolute; bottom:120%; background:#0f172a; border:1px solid #38bdf8; color:#fff; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:700; white-space:nowrap; box-shadow:0 0 12px rgba(56,189,248,0.4);">
              ⚡ Copy Flutter Code to Clipboard
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const trig = document.getElementById(`trig-tip-${tipId}`);
            const pop = document.getElementById(`pop-tip-${tipId}`);
            if (!trig || !pop) return;

            trig.addEventListener('mouseenter', () => pop.style.display = 'block');
            trig.addEventListener('mouseleave', () => pop.style.display = 'none');
            trig.addEventListener('click', () => {
              pop.style.display = pop.style.display === 'none' ? 'block' : 'none';
            });
          }, 50);
        })();
        break;

      case 'picker_preview':
        const pkId = `pk-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <input type="date" id="input-pk-${pkId}" value="2026-08-04" style="background:#1e293b; border:1px solid #38bdf8; color:#38bdf8; padding:8px 14px; border-radius:12px; font-weight:800; font-size:12px; cursor:pointer;" />
            <span id="txt-pk-${pkId}" style="font-size:11px; color:#10b981; font-weight:700;">Selected Date: Aug 04, 2026</span>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const input = document.getElementById(`input-pk-${pkId}`);
            const txt = document.getElementById(`txt-pk-${pkId}`);
            if (input && txt) {
              input.addEventListener('change', () => {
                txt.innerText = `Selected Date: ${input.value}`;
              });
            }
          }, 50);
        })();
        break;

      case 'avatar_preview':
        const avId = `av-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer;" id="wrap-av-${avId}">
            <div style="position:relative; width:52px; height:52px;">
              <div style="width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg, #0284c7, #8b5cf6); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px;">FH</div>
              <div id="dot-av-${avId}" style="position:absolute; bottom:0; right:0; width:14px; height:14px; border-radius:50%; background:#10b981; border:2px solid #0f172a;"></div>
            </div>
            <span id="txt-av-${avId}" style="font-size:11px; color:#10b981; font-weight:800;">🟢 Online (Click toggle)</span>
          </div>
        `;
        (function() {
          let state = 0;
          const states = [
            { color: '#10b981', label: '🟢 Online' },
            { color: '#f59e0b', label: '🟡 Away' },
            { color: '#f43f5e', label: '🔴 Busy' }
          ];
          setTimeout(() => {
            const wrap = document.getElementById(`wrap-av-${avId}`);
            const dot = document.getElementById(`dot-av-${avId}`);
            const txt = document.getElementById(`txt-av-${avId}`);
            if (!wrap) return;

            wrap.addEventListener('click', () => {
              state = (state + 1) % states.length;
              const s = states[state];
              if (dot) dot.style.background = s.color;
              if (txt) {
                txt.innerText = `${s.label} (Click toggle)`;
                txt.style.color = s.color;
              }
            });
          }, 50);
        })();
        break;

      case 'masonry_grid':
        el.innerHTML = `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; max-width:280px;">
            <div style="background:#1e293b; border:1px solid rgba(255,255,255,0.1); height:80px; border-radius:12px; padding:10px; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="this.style.background='#38bdf8'; this.style.color='#0f172a';">Masonry 1</div>
            <div style="background:#1e293b; border:1px solid rgba(255,255,255,0.1); height:110px; border-radius:12px; padding:10px; color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="this.style.background='#a855f7'; this.style.color='#fff';">Masonry 2</div>
          </div>
        `;
        break;

      case 'carousel_preview':
        const carId = `car-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; max-width:300px;">
            <div id="slide-car-${carId}" style="width:100%; height:95px; background:linear-gradient(135deg, #38bdf8, #8b5cf6); border-radius:16px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:14px; box-shadow:0 8px 20px rgba(0,0,0,0.3); transition:all 0.3s ease;">
              Hero Banner Slide #1
            </div>
            <div style="display:flex; gap:8px;">
              <button id="cprev-${carId}" style="background:#1e293b; border:none; color:#fff; width:28px; height:28px; border-radius:50%; font-weight:800; cursor:pointer;">◄</button>
              <button id="cnext-${carId}" style="background:#1e293b; border:none; color:#fff; width:28px; height:28px; border-radius:50%; font-weight:800; cursor:pointer;">►</button>
            </div>
          </div>
        `;
        (function() {
          let curr = 1;
          const slides = [
            { bg: 'linear-gradient(135deg, #38bdf8, #8b5cf6)', txt: 'Hero Banner Slide #1' },
            { bg: 'linear-gradient(135deg, #10b981, #0284c7)', txt: 'Feature Banner Slide #2' },
            { bg: 'linear-gradient(135deg, #f43f5e, #a855f7)', txt: 'PRO Pass Offer Slide #3' }
          ];
          setTimeout(() => {
            const slide = document.getElementById(`slide-car-${carId}`);
            const prev = document.getElementById(`cprev-${carId}`);
            const next = document.getElementById(`cnext-${carId}`);
            if (!slide) return;

            function updateSlide() {
              const s = slides[curr - 1];
              slide.style.background = s.bg;
              slide.innerText = s.txt;
            }

            if (prev) prev.addEventListener('click', () => { curr = curr === 1 ? 3 : curr - 1; updateSlide(); });
            if (next) next.addEventListener('click', () => { curr = curr === 3 ? 1 : curr + 1; updateSlide(); });
          }, 50);
        })();
        break;

      case 'expansion_preview':
        const expId = `exp-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="width:100%; max-width:300px; background:#1e293b; border:1px solid var(--border-color); border-radius:14px; overflow:hidden;">
            <div id="exp-head-${expId}" style="padding:12px 16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; font-weight:800; color:#fff; font-size:13px;">
              <span>Accordion FAQ Details</span>
              <span id="exp-arr-${expId}" style="color:#38bdf8; transition:transform 0.25s ease;">▼</span>
            </div>
            <div id="exp-body-${expId}" style="display:none; padding:12px 16px; background:#0f172a; border-top:1px solid rgba(255,255,255,0.05); font-size:12px; color:#94a3b8;">
              ⚡ Smooth animated expansion tile with custom Flutter duration and rotation physics.
            </div>
          </div>
        `;
        (function() {
          let isExpanded = false;
          setTimeout(() => {
            const head = document.getElementById(`exp-head-${expId}`);
            const body = document.getElementById(`exp-body-${expId}`);
            const arr = document.getElementById(`exp-arr-${expId}`);
            if (!head || !body) return;

            head.addEventListener('click', () => {
              isExpanded = !isExpanded;
              body.style.display = isExpanded ? 'block' : 'none';
              if (arr) arr.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            });
          }, 50);
        })();
        break;

      case 'cupertino_sheet':
        const cupId = `cup-${containerId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; max-width:280px;">
            <button id="trig-cup-${cupId}" style="background:#1e293b; border:1px solid #38bdf8; color:#38bdf8; font-weight:800; padding:10px 18px; border-radius:14px; cursor:pointer; font-size:12px;">
              🍎 Open iOS Cupertino Sheet
            </button>
            <div id="pop-cup-${cupId}" style="display:none; background:#0f172a; border:1px solid var(--border-color); border-radius:14px; padding:12px; width:100%; text-align:center;">
              <div style="font-size:12px; font-weight:800; color:#fff; margin-bottom:6px;">Cupertino Sheet Active</div>
              <div style="font-size:11px; color:#38bdf8; padding:6px; background:rgba(255,255,255,0.05); border-radius:8px; cursor:pointer;" onclick="document.getElementById('pop-cup-${cupId}').style.display='none'; App.showToast('Downloaded .dart widget!', 'success');">Download Widget</div>
            </div>
          </div>
        `;
        (function() {
          setTimeout(() => {
            const trig = document.getElementById(`trig-cup-${cupId}`);
            const pop = document.getElementById(`pop-cup-${cupId}`);
            if (trig && pop) {
              trig.addEventListener('click', () => {
                pop.style.display = pop.style.display === 'none' ? 'block' : 'none';
              });
            }
          }, 50);
        })();
        break;

      // ----------------------------------------------------------------------
      // DESIGN SYSTEMS SHOWCASE SIMULATION CASES
      // ----------------------------------------------------------------------
      case 'bento_card':
      case 'bento_stats':
      case 'bento_grid':
      case 'bento_analytics':
      case 'bento_pricing':
        el.innerHTML = `
          <div class="bento-card" style="width:100%; max-width:320px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:12px; font-weight:700; color:#818cf8; text-transform:uppercase;">🍱 Bento UI System</span>
              <span style="background:rgba(99,102,241,0.2); color:#818cf8; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">HIGH DENSITY</span>
            </div>
            <div style="font-size:16px; font-weight:800; color:#fff; margin-bottom:6px;">Modular Telemetry Card</div>
            <div style="font-size:12px; color:#94a3b8; margin-bottom:14px;">Asymmetric 4-span layout block with live ARR telemetry trends.</div>
            <div style="display:flex; align-items:baseline; gap:8px; background:#1e1b4b; padding:10px; border-radius:12px;">
              <span style="font-size:20px; font-weight:800; color:#fff;">₹4,85,000</span>
              <span style="color:#34d399; font-size:12px; font-weight:700;">+28.4% ↑</span>
            </div>
          </div>
        `;
        break;

      case 'neu_button':
      case 'neu_login':
      case 'neu_player':
      case 'neu_toggle':
      case 'neu_card':
        el.innerHTML = `
          <div class="neu-card" style="width:100%; max-width:320px; text-align:center;">
            <div style="font-size:12px; font-weight:700; color:#38bdf8; margin-bottom:8px;">🔘 Neumorphism Tactile</div>
            <div style="font-size:14px; font-weight:700; color:#fff; margin-bottom:16px;">Soft Extruded Surface</div>
            <div style="display:flex; justify-content:center; gap:12px; margin-bottom:14px;">
              <button class="neu-button">◀</button>
              <button class="neu-button" style="background:#38bdf8; color:#0f172a; box-shadow:none;">▶ PLAY</button>
              <button class="neu-button">▶</button>
            </div>
            <span style="font-size:11px; color:#64748b;">Dual light-source soft plastic depth</span>
          </div>
        `;
        break;

      case 'clay_button':
      case 'clay_profile':
      case 'clay_dashboard':
      case 'clay_pricing':
      case 'clay_card':
        el.innerHTML = `
          <div class="clay-card" style="width:100%; max-width:320px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:12px; font-weight:800; color:#fff;">🎨 Claymorphism 3D</span>
              <span style="background:rgba(255,255,255,0.25); color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px;">PUFFY 3D</span>
            </div>
            <div style="font-size:18px; font-weight:800; margin-bottom:6px;">Inflated 3D Surface</div>
            <div style="font-size:12px; opacity:0.9; margin-bottom:16px;">Vibrant rounded shapes with inner highlight light sources.</div>
            <button style="width:100%; background:#ffffff; color:#ec4899; border:none; padding:10px; border-radius:16px; font-weight:800; font-size:13px; cursor:pointer; box-shadow:0 8px 16px rgba(0,0,0,0.2);">
              Interactive 3D Clay Action
            </button>
          </div>
        `;
        break;

      case 'glass_login':
      case 'glass_sidebar':
      case 'glass_navbar':
      case 'glass_profile':
        el.innerHTML = `
          <div class="glass-showcase-card" style="width:100%; max-width:320px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:12px; font-weight:700; color:#10b981;">💎 Glassmorphism System</span>
              <span style="background:rgba(16,185,129,0.2); color:#10b981; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">FROSTED</span>
            </div>
            <div style="font-size:16px; font-weight:800; color:#fff; margin-bottom:6px;">Frosted Glass Card</div>
            <div style="font-size:12px; color:#94a3b8; margin-bottom:14px;">Backdrop blur filter (16px) with semi-transparent neon glow border.</div>
            <input type="text" value="dev@flutterhub.dev" readonly style="width:100%; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:8px 12px; border-radius:10px; font-size:12px;" />
          </div>
        `;
        break;

      case 'aurora_hero':
      case 'aurora_cta':
      case 'aurora_pricing':
      case 'aurora_dashboard':
      case 'aurora_pill':
        el.innerHTML = `
          <div class="aurora-card" style="width:100%; max-width:320px;">
            <div style="position:relative; z-index:2;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:12px; font-weight:700; color:#a855f7;">🌌 Aurora UI Engine</span>
                <span style="background:rgba(168,85,247,0.25); color:#a855f7; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">MESH GLOW</span>
              </div>
              <div style="font-size:16px; font-weight:800; color:#fff; margin-bottom:6px;">Ambient Mesh Glow</div>
              <div style="font-size:12px; color:#94a3b8; margin-bottom:14px;">Multi-color animated radial light aura with floating particle illumination.</div>
              <div style="background:rgba(168,85,247,0.2); border:1px solid rgba(168,85,247,0.5); padding:8px; border-radius:12px; text-align:center; color:#fff; font-weight:700; font-size:12px;">
                Explore Aurora Glow
              </div>
            </div>
          </div>
        `;
        break;

      default:
        el.innerHTML = `
          <div style="background:var(--bg-tertiary); padding:20px 28px; border-radius:16px; border:1px solid var(--border-color); display:flex; align-items:center; gap:12px;">
            <div style="width:10px; height:10px; border-radius:50%; background:var(--accent-cyan-light);"></div>
            <span style="font-size:13px; font-weight:600; color:var(--text-primary);">Production Flutter Widget Interactive Render</span>
          </div>
        `;
    }
  }
};
