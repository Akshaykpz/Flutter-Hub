/* ==========================================================================
   FlutterHub Interactive Widget Simulator Engine
   Renders real-time interactive JavaScript/CSS simulations of Flutter widgets
   ========================================================================== */

const FlutterSim = {
  renderWidget: function(simType, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    switch (simType) {
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
