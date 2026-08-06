/* ==========================================================================
   FlutterHub Interactive Widget Simulator Engine
   Renders real-time interactive JavaScript/CSS simulations of Flutter widgets
   ========================================================================== */

if (typeof document !== 'undefined' && !document.getElementById('flutter-sim-styles')) {
  const style = document.createElement('style');
  style.id = 'flutter-sim-styles';
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .sim-btn-hover:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }
    .sim-btn-hover:active {
      transform: translateY(1px);
    }
    .sim-card-surface {
      width: 100%;
      max-width: 340px;
      background: var(--bg-tertiary, #0f172a);
      border: 1px solid var(--border-color, rgba(255,255,255,0.1));
      border-radius: 16px;
      padding: 16px;
      box-sizing: border-box;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
    }
  `;
  document.head.appendChild(style);
}

const FlutterSim = {
  renderWidget: function (simType, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    switch (simType) {
      // ======================================================================
      // 1. BUTTONS & ACTION
      // ======================================================================
      case 'sim_btn_01':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <button class="sim-btn-hover" onclick="App.showToast('⚡ Aceternity Glassmorphism Neo Button Pressed!', 'success')"
              style="background:rgba(255,255,255,0.08); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:12px 26px; border-radius:16px; font-weight:800; font-size:13px; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 20px rgba(56,189,248,0.2);">
              ⚡ Aceternity Neo Button
            </button>
            <span style="font-size:0.75rem; color:var(--text-muted);">Click to test interaction</span>
          </div>
        `;
        break;

      case 'sim_btn_02':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <button class="sim-btn-hover" onclick="App.showToast('🚀 CTA Button Clicked! Access Unlocked.', 'info')"
              style="background:linear-gradient(135deg,#38bdf8,#8b5cf6); border:none; color:#fff; padding:14px 28px; border-radius:30px; font-weight:900; font-size:14px; cursor:pointer; box-shadow:0 6px 20px rgba(139,92,246,0.4); transition:all 0.2s ease;">
              Unlock Access 🚀
            </button>
            <span style="font-size:0.75rem; color:var(--text-muted);">Gradient Pulse CTA Button</span>
          </div>
        `;
        break;

      case 'sim_btn_03':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <button class="sim-btn-hover" onclick="
              const pressed = this.getAttribute('data-pressed') === 'true';
              this.setAttribute('data-pressed', !pressed);
              this.style.boxShadow = !pressed ? 'inset 3px 3px 6px #020617, inset -3px -3px 6px #1e293b' : '4px 4px 10px #020617, -4px -4px 10px #1e293b';
              this.style.color = !pressed ? '#10b981' : '#38bdf8';
              App.showToast(!pressed ? 'Tactile Button: Inset Pressed' : 'Tactile Button: Raised State', 'info');
            "
            style="background:#0f172a; border:none; color:#38bdf8; padding:12px 24px; border-radius:14px; font-weight:800; font-size:13px; cursor:pointer; box-shadow:4px 4px 10px #020617, -4px -4px 10px #1e293b; transition:all 0.15s ease;">
              🖲️ Tactile Neumorphic Button
            </button>
            <span style="font-size:0.75rem; color:var(--text-muted);">Tap to toggle dual tactile state</span>
          </div>
        `;
        break;

      case 'sim_btn_04':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <button class="sim-btn-hover" id="btn-loading-${containerId}" onclick="
              const btn = document.getElementById('btn-loading-${containerId}');
              btn.innerHTML = '⏱️ Processing...';
              setTimeout(() => {
                btn.innerHTML = '✓ Completed!';
                setTimeout(() => { btn.innerHTML = '⚡ Start Action'; }, 1500);
              }, 1200);
            "
            style="background:#10b981; border:none; color:#fff; padding:12px 24px; border-radius:12px; font-weight:800; font-size:13px; cursor:pointer; display:flex; align-items:center; transition:all 0.2s ease;">
              ⚡ Start Action
            </button>
            <span style="font-size:0.75rem; color:var(--text-muted);">Click to trigger loading state</span>
          </div>
        `;
        break;

      case 'sim_btn_05':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <button class="sim-btn-hover" onclick="App.showToast('iOS Cupertino Spring Action Executed', 'info')"
              style="background:#0284c7; border:none; color:#fff; padding:12px 24px; border-radius:20px; font-weight:700; font-size:13px; cursor:pointer; transition:transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);">
              Cupertino Action
            </button>
            <span style="font-size:0.75rem; color:var(--text-muted);">iOS Spring Tactile Button</span>
          </div>
        `;
        break;

      // ======================================================================
      // 2. TEXTFIELDS & FORMS
      // ======================================================================
      case 'sim_txt_01':
        el.innerHTML = `
          <div class="sim-card-surface">
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#38bdf8; margin-bottom:6px;">Glass Email Input</label>
            <div style="position:relative;">
              <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-muted);">✉️</span>
              <input type="email" placeholder="alex@flutterhub.dev" 
                style="width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; padding:10px 12px 10px 36px; border-radius:12px; font-size:0.85rem; box-sizing:border-box; outline:none;"
                onfocus="this.style.borderColor='#38bdf8'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'" />
            </div>
          </div>
        `;
        break;

      case 'sim_txt_02':
        el.innerHTML = `
          <div class="sim-card-surface" style="text-align:center;">
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#38bdf8; margin-bottom:10px;">6-Digit Verification PIN</label>
            <div style="display:flex; justify-content:center; gap:6px;">
              ${[1, 2, 3, 4, 5, 6].map(i => `
                <input type="text" maxlength="1" value="${i <= 3 ? i * 2 : ''}"
                  style="width:34px; height:42px; text-align:center; background:#1e293b; border:1px solid ${i <= 3 ? '#38bdf8' : 'rgba(255,255,255,0.15)'}; color:#fff; border-radius:8px; font-size:1.1rem; font-weight:800; outline:none;"
                  onkeyup="if(this.value.length >= 1 && this.nextElementSibling) this.nextElementSibling.focus()" />
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 'sim_txt_03':
        el.innerHTML = `
          <div class="sim-card-surface">
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#38bdf8; margin-bottom:6px;">Password with Eye Toggle</label>
            <div style="position:relative;">
              <input type="password" id="pass-inp-${containerId}" value="FlutterSecret2026" 
                style="width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; padding:10px 36px 10px 12px; border-radius:12px; font-size:0.85rem; box-sizing:border-box; outline:none;" />
              <button onclick="
                const inp = document.getElementById('pass-inp-${containerId}');
                const isPass = inp.type === 'password';
                inp.type = isPass ? 'text' : 'password';
                this.textContent = isPass ? '👁️' : '🙈';
              " style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:14px;">🙈</button>
            </div>
          </div>
        `;
        break;

      case 'sim_txt_04':
        el.innerHTML = `
          <div class="sim-card-surface">
            <div style="position:relative;">
              <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%);">🔍</span>
              <input type="text" id="srch-inp-${containerId}" value="Glassmorphism" placeholder="Search widgets..." 
                style="width:100%; background:#1e293b; border:1px solid #38bdf8; color:#fff; padding:10px 32px 10px 36px; border-radius:24px; font-size:0.85rem; box-sizing:border-box; outline:none;" />
              <button onclick="document.getElementById('srch-inp-${containerId}').value=''; App.showToast('Search input cleared', 'info');"
                style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); cursor:pointer;">✕</button>
            </div>
          </div>
        `;
        break;

      case 'sim_txt_05':
        el.innerHTML = `
          <div class="sim-card-surface">
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#38bdf8; margin-bottom:6px;">Credit Card Number</label>
            <div style="position:relative;">
              <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%);">💳</span>
              <input type="text" value="4532 •••• •••• 8921" 
                style="width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; padding:10px 12px 10px 36px; border-radius:12px; font-size:0.85rem; box-sizing:border-box; outline:none; font-family:monospace;" />
            </div>
          </div>
        `;
        break;

      case 'sim_txt_06':
        el.innerHTML = `
          <div class="sim-card-surface">
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#38bdf8; margin-bottom:6px;">Expandable Comment</label>
            <textarea placeholder="Write a comment..." rows="2"
              style="width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; padding:10px; border-radius:12px; font-size:0.85rem; box-sizing:border-box; outline:none; resize:vertical;"></textarea>
          </div>
        `;
        break;

      // ======================================================================
      // 3. CARDS & SURFACES
      // ======================================================================
      case 'sim_card_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="background:linear-gradient(145deg, #0f172a, #1e293b); border-color:#38bdf8;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:0.8rem; font-weight:800; color:#38bdf8;">⚡ Telemetry Insight</span>
              <span style="background:rgba(56,189,248,0.2); color:#38bdf8; font-size:0.65rem; padding:2px 8px; border-radius:10px; font-weight:800;">LIVE</span>
            </div>
            <div style="font-size:1.4rem; font-weight:900; color:#fff; margin-bottom:4px;">$48,290.00</div>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin:0;">+24.8% growth this month</p>
          </div>
        `;
        break;

      case 'sim_card_02':
        el.innerHTML = `
          <div class="sim-card-surface">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; margin-bottom:8px; font-size:0.8rem;">
              <span>Subtotal (Pro Pass)</span>
              <span style="font-weight:700;">₹1,499.00</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:800; color:#38bdf8; font-size:0.95rem;">
              <span>Total Payable</span>
              <span>₹1,499.00</span>
            </div>
          </div>
        `;
        break;

      case 'sim_card_03':
        el.innerHTML = `
          <div class="sim-card-surface" style="background:rgba(255,255,255,0.06); backdrop-filter:blur(10px); display:flex; align-items:center; gap:12px;">
            <div style="width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,#38bdf8,#8b5cf6); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px;">AR</div>
            <div>
              <div style="font-weight:800; font-size:0.9rem; color:#fff;">Alex Rivera</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">Senior Flutter Architect</div>
            </div>
          </div>
        `;
        break;

      case 'sim_card_04':
        el.innerHTML = `
          <div class="sim-card-surface" style="background:linear-gradient(135deg,#6366f1,#a855f7); border:none; box-shadow:0 8px 24px rgba(168,85,247,0.3);">
            <div style="font-size:0.75rem; opacity:0.8; margin-bottom:4px;">Crypto Balance</div>
            <div style="font-size:1.3rem; font-weight:900;">3.482 ETH</div>
            <div style="font-size:0.8rem; opacity:0.9; margin-top:2px;">≈ $11,492.20 USD</div>
          </div>
        `;
        break;

      case 'sim_card_05':
        el.innerHTML = `
          <div class="sim-card-surface" style="text-align:center; cursor:pointer;" onclick="
            const isFlipped = this.getAttribute('data-flipped') === 'true';
            this.setAttribute('data-flipped', !isFlipped);
            this.querySelector('.flip-content').innerHTML = !isFlipped ? '<strong>Back Surface:</strong><br/>Secret Code: <code>FLUTTER2026</code>' : '<strong>Front Surface:</strong><br/>Tap card to flip 🔄';
          ">
            <div class="flip-content" style="font-size:0.85rem; color:#38bdf8;"><strong>Front Surface:</strong><br/>Tap card to flip 🔄</div>
          </div>
        `;
        break;

      // ======================================================================
      // 4. LISTS & LISTTILE
      // ======================================================================
      case 'sim_list_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="position:relative; overflow:hidden; padding:0;">
            <div id="slidable-item-${containerId}" style="padding:14px; background:#1e293b; transition:transform 0.2s ease; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; font-size:0.85rem;">Inbox Notification</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Swipe actions demo</div>
              </div>
              <button onclick="
                const item = document.getElementById('slidable-item-${containerId}');
                item.style.transform = item.style.transform === 'translateX(-60px)' ? 'translateX(0)' : 'translateX(-60px)';
              " style="background:rgba(255,255,255,0.1); border:none; color:#38bdf8; border-radius:6px; padding:4px 8px; font-size:11px; cursor:pointer;">Swipe Action ↔</button>
            </div>
          </div>
        `;
        break;

      case 'sim_list_02':
        el.innerHTML = `
          <div class="sim-card-surface" style="display:flex; align-items:center; gap:12px;">
            <div style="position:relative;">
              <div style="width:36px; height:36px; border-radius:50%; background:#38bdf8; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px;">FH</div>
              <div style="width:10px; height:10px; border-radius:50%; background:#10b981; position:absolute; bottom:0; right:0; border:2px solid #0f172a;"></div>
            </div>
            <div style="flex:1;">
              <div style="font-weight:700; font-size:0.85rem;">FlutterHub Team</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">Online • New widget released</div>
            </div>
          </div>
        `;
        break;

      case 'sim_list_03':
        el.innerHTML = `
          <div class="sim-card-surface" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; font-size:0.85rem;">Push Notifications</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">Receive instant release alerts</div>
            </div>
            <input type="checkbox" checked style="accent-color:#38bdf8; transform:scale(1.3); cursor:pointer;"
              onchange="App.showToast(this.checked ? 'Notifications Enabled' : 'Notifications Muted', 'info')" />
          </div>
        `;
        break;

      case 'sim_list_04':
        el.innerHTML = `
          <div class="sim-card-surface" style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:32px; height:32px; border-radius:50%; background:rgba(16,185,129,0.2); display:flex; align-items:center; justify-content:center; color:#10b981;">↓</div>
              <div>
                <div style="font-weight:700; font-size:0.85rem;">Payment Received</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Aug 06, 2026</div>
              </div>
            </div>
            <div style="font-weight:800; color:#10b981; font-size:0.9rem;">+ ₹1,499.00</div>
          </div>
        `;
        break;

      // ======================================================================
      // 5. DIALOGS & MODALS (3 Distinct Implementations)
      // ======================================================================
      case 'sim_dlg_01':
        // Basic Alert Dialog
        el.innerHTML = `
          <div class="sim-card-surface" style="background:#1e293b; border-color:#38bdf8;">
            <div style="font-size:0.95rem; font-weight:800; color:#fff; margin-bottom:6px;">Simple Alert</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.4;">This is a standard Material alert dialog notification message.</div>
            <div style="display:flex; justify-content:flex-end;">
              <button onclick="App.showToast('Alert Acknowledged (OK clicked)', 'info')"
                style="background:#38bdf8; border:none; color:#0f172a; font-weight:800; padding:6px 16px; border-radius:8px; cursor:pointer; font-size:0.8rem;">
                OK
              </button>
            </div>
          </div>
        `;
        break;

      case 'sim_dlg_02':
        // Confirmation Action Dialog with Warning Icon & Delete Action
        el.innerHTML = `
          <div class="sim-card-surface" style="background:#0f172a; border-color:#f59e0b; text-align:center;">
            <div style="font-size:1.6rem; margin-bottom:4px;">⚠️</div>
            <div style="font-size:0.95rem; font-weight:800; color:#fff; margin-bottom:4px;">Delete Resource?</div>
            <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:14px;">This action is permanent and cannot be undone.</div>
            <div style="display:flex; gap:8px; justify-content:center;">
              <button onclick="App.showToast('Delete Action Cancelled', 'info')"
                style="background:rgba(255,255,255,0.1); border:1px solid var(--border-color); color:#fff; font-weight:700; padding:6px 14px; border-radius:8px; cursor:pointer; font-size:0.75rem;">
                Cancel
              </button>
              <button onclick="App.showToast('Resource Permanently Deleted', 'error')"
                style="background:#ef4444; border:none; color:#fff; font-weight:800; padding:6px 14px; border-radius:8px; cursor:pointer; font-size:0.75rem;">
                Delete
              </button>
            </div>
          </div>
        `;
        break;

      case 'sim_dlg_03':
        // Custom Rounded Success Dialog
        el.innerHTML = `
          <div class="sim-card-surface" style="background:linear-gradient(135deg,#064e3b,#0f172a); border-color:#10b981; border-radius:24px; text-align:center; padding:18px;">
            <div style="width:44px; height:44px; border-radius:50%; background:#10b981; color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 10px; font-weight:900;">✓</div>
            <div style="font-size:1rem; font-weight:900; color:#fff; margin-bottom:4px;">Payment Confirmed!</div>
            <div style="font-size:0.75rem; color:#a7f3d0; margin-bottom:12px;">Transaction #89210 completed successfully.</div>
            <button onclick="App.showToast('Success Modal Closed', 'success')"
              style="background:#10b981; border:none; color:#fff; font-weight:800; padding:8px 22px; border-radius:20px; cursor:pointer; font-size:0.8rem; box-shadow:0 4px 12px rgba(16,185,129,0.3);">
              Done
            </button>
          </div>
        `;
        break;

      // ======================================================================
      // 6. BOTTOM SHEETS (2 Distinct Implementations)
      // ======================================================================
      case 'sim_sheet_01':
        // Standard Modal Bottom Sheet
        el.innerHTML = `
          <div class="sim-card-surface" style="background:#0f172a; border-radius:20px 20px 12px 12px; border-color:#38bdf8; padding:12px;">
            <div style="width:36px; height:4px; background:rgba(255,255,255,0.3); border-radius:2px; margin:0 auto 10px;"></div>
            <div style="font-size:0.8rem; font-weight:800; color:#38bdf8; margin-bottom:8px;">Standard Modal Sheet</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <button onclick="App.showToast('Share Link selected', 'info')" style="background:rgba(255,255,255,0.06); border:none; color:#fff; padding:8px 12px; border-radius:8px; text-align:left; font-size:0.75rem; cursor:pointer;">📤 Share Link</button>
              <button onclick="App.showToast('Copied to Clipboard', 'success')" style="background:rgba(255,255,255,0.06); border:none; color:#fff; padding:8px 12px; border-radius:8px; text-align:left; font-size:0.75rem; cursor:pointer;">📋 Copy to Clipboard</button>
            </div>
          </div>
        `;
        break;

      case 'sim_sheet_02':
        // Draggable Scrollable Bottom Sheet
        el.innerHTML = `
          <div class="sim-card-surface" style="background:#1e293b; border-radius:20px 20px 12px 12px; border-color:#8b5cf6; padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px; margin-bottom:8px;">
              <span style="font-size:0.8rem; font-weight:800; color:#8b5cf6;">Draggable Scrollable Sheet</span>
              <span style="font-size:0.65rem; background:rgba(139,92,246,0.2); color:#8b5cf6; padding:2px 6px; border-radius:6px;">Height: 40% ↕</span>
            </div>
            <div style="max-height:85px; overflow-y:auto; display:flex; flex-direction:column; gap:4px; padding-right:4px;">
              <label style="display:flex; align-items:center; gap:8px; font-size:0.75rem; padding:4px 8px; background:rgba(255,255,255,0.04); border-radius:6px; cursor:pointer;">
                <input type="radio" name="pay-opt-${containerId}" checked style="accent-color:#8b5cf6;" /> 💳 Credit / Debit Card
              </label>
              <label style="display:flex; align-items:center; gap:8px; font-size:0.75rem; padding:4px 8px; background:rgba(255,255,255,0.04); border-radius:6px; cursor:pointer;">
                <input type="radio" name="pay-opt-${containerId}" style="accent-color:#8b5cf6;" /> 📱 UPI Instant Transfer
              </label>
              <label style="display:flex; align-items:center; gap:8px; font-size:0.75rem; padding:4px 8px; background:rgba(255,255,255,0.04); border-radius:6px; cursor:pointer;">
                <input type="radio" name="pay-opt-${containerId}" style="accent-color:#8b5cf6;" />  Apple Pay
              </label>
            </div>
          </div>
        `;
        break;

      // ======================================================================
      // 7. SNACKBARS & TOAST (2 Distinct Implementations)
      // ======================================================================
      case 'sim_snack_01':
        // Basic Text SnackBar
        el.innerHTML = `
          <div style="width:100%; max-width:320px; display:flex; flex-direction:column; align-items:center; gap:10px; position:relative; min-height:80px;">
            <button class="sim-btn-hover" onclick="
              const bar = document.getElementById('snack-bar-1-${containerId}');
              bar.style.display = 'block';
              setTimeout(() => bar.style.display = 'none', 2200);
            " style="background:#1e293b; border:1px solid #38bdf8; color:#fff; padding:8px 18px; border-radius:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
              ▶ Trigger Simple SnackBar
            </button>
            <div id="snack-bar-1-${containerId}" style="display:none; width:100%; background:#0284c7; color:#fff; padding:8px 14px; border-radius:10px; font-size:0.75rem; font-weight:700; box-shadow:0 4px 14px rgba(0,0,0,0.4); animation:slideUp 0.2s ease;">
              ✓ Changes saved successfully.
            </div>
          </div>
        `;
        break;

      case 'sim_snack_02':
        // Action SnackBar with Undo
        el.innerHTML = `
          <div style="width:100%; max-width:320px; display:flex; flex-direction:column; align-items:center; gap:10px; position:relative; min-height:80px;">
            <button class="sim-btn-hover" onclick="
              const bar = document.getElementById('snack-bar-2-${containerId}');
              bar.style.display = 'flex';
            " style="background:#1e293b; border:1px solid #f59e0b; color:#fff; padding:8px 18px; border-radius:10px; font-size:0.75rem; font-weight:800; cursor:pointer;">
              ▶ Trigger Action SnackBar (Delete)
            </button>
            <div id="snack-bar-2-${containerId}" style="display:none; width:100%; background:#0f172a; border:1px solid #f59e0b; color:#fff; padding:8px 14px; border-radius:10px; font-size:0.75rem; font-weight:700; justify-content:space-between; align-items:center; box-shadow:0 4px 14px rgba(0,0,0,0.4); animation:slideUp 0.2s ease;">
              <span>🗑️ Item deleted from library</span>
              <button onclick="
                App.showToast('Deletion Undone! Item restored.', 'success');
                document.getElementById('snack-bar-2-${containerId}').style.display = 'none';
              " style="background:none; border:none; color:#f59e0b; font-weight:900; cursor:pointer; font-size:0.75rem;">UNDO</button>
            </div>
          </div>
        `;
        break;

      // ======================================================================
      // 8. APPBAR & SLIVERAPPBAR (2 Distinct Implementations)
      // ======================================================================
      case 'sim_appbar_01':
        // Standard Material AppBar
        el.innerHTML = `
          <div class="sim-card-surface" style="padding:0; overflow:hidden;">
            <div style="background:#0284c7; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; color:#fff;">
              <div style="display:flex; align-items:center; gap:10px;">
                <button onclick="App.showToast('Drawer Menu Clicked', 'info')" style="background:none; border:none; color:#fff; cursor:pointer; font-size:14px;">☰</button>
                <span style="font-weight:800; font-size:0.85rem;">Dashboard</span>
              </div>
              <div style="display:flex; gap:10px;">
                <button onclick="App.showToast('Search Clicked', 'info')" style="background:none; border:none; color:#fff; cursor:pointer; font-size:14px;">🔍</button>
                <button onclick="App.showToast('Overflow Menu Clicked', 'info')" style="background:none; border:none; color:#fff; cursor:pointer; font-size:14px;">⋮</button>
              </div>
            </div>
            <div style="padding:14px; font-size:0.75rem; color:var(--text-muted);">Standard Material 3 AppBar Layout</div>
          </div>
        `;
        break;

      case 'sim_appbar_02':
        // Collapsible SliverAppBar with Scroll Container
        el.innerHTML = `
          <div class="sim-card-surface" style="padding:0; overflow:hidden; max-height:150px; overflow-y:auto;" onscroll="
            const header = this.querySelector('.sliver-header');
            if (this.scrollTop > 30) {
              header.style.height = '36px';
              header.querySelector('.sliver-title').style.fontSize = '0.75rem';
            } else {
              header.style.height = '80px';
              header.querySelector('.sliver-title').style.fontSize = '1.05rem';
            }
          ">
            <div class="sliver-header" style="position:sticky; top:0; height:80px; background:linear-gradient(135deg,#38bdf8,#8b5cf6); padding:10px 14px; display:flex; align-items:flex-end; color:#fff; transition:all 0.2s ease; z-index:5;">
              <span class="sliver-title" style="font-weight:900; font-size:1.05rem; transition:all 0.2s ease;">Collapsible Sliver Header</span>
            </div>
            <div style="padding:14px; font-size:0.75rem; color:var(--text-secondary); line-height:1.6;">
              <p style="margin:0 0 10px;">Scroll down inside this box to test live collapsible SliverAppBar scaling! ↕</p>
              <p style="margin:0 0 10px;">Item line #1 - Flutter architecture</p>
              <p style="margin:0 0 10px;">Item line #2 - CustomScrollView</p>
              <p style="margin:0;">Item line #3 - FlexibleSpaceBar</p>
            </div>
          </div>
        `;
        break;

      // ======================================================================
      // 9. BOTTOM NAVIGATION (2 Distinct Implementations)
      // ======================================================================
      case 'sim_nav_01':
        // Material BottomNavigationBar
        el.innerHTML = `
          <div class="sim-card-surface" style="padding:0; overflow:hidden;">
            <div id="nav-screen-txt-${containerId}" style="padding:16px; font-size:0.8rem; font-weight:700; color:#38bdf8; text-align:center; min-height:45px; display:flex; align-items:center; justify-content:center;">
              Active Tab: 🏠 Home Page
            </div>
            <div style="background:#0f172a; border-top:1px solid rgba(255,255,255,0.1); padding:8px 0; display:flex; justify-content:space-around;">
              <button id="mat-nav-1-${containerId}" onclick="
                document.getElementById('nav-screen-txt-${containerId}').textContent = 'Active Tab: 🏠 Home Page';
                this.style.color = '#38bdf8';
                document.getElementById('mat-nav-2-${containerId}').style.color = 'var(--text-muted)';
                document.getElementById('mat-nav-3-${containerId}').style.color = 'var(--text-muted)';
              " style="background:none; border:none; color:#38bdf8; cursor:pointer; display:flex; flex-direction:column; align-items:center; font-size:10px; font-weight:700;">
                <span style="font-size:14px;">🏠</span> Home
              </button>

              <button id="mat-nav-2-${containerId}" onclick="
                document.getElementById('nav-screen-txt-${containerId}').textContent = 'Active Tab: 🔍 Search Page';
                this.style.color = '#38bdf8';
                document.getElementById('mat-nav-1-${containerId}').style.color = 'var(--text-muted)';
                document.getElementById('mat-nav-3-${containerId}').style.color = 'var(--text-muted)';
              " style="background:none; border:none; color:var(--text-muted); cursor:pointer; display:flex; flex-direction:column; align-items:center; font-size:10px; font-weight:700;">
                <span style="font-size:14px;">🔍</span> Search
              </button>

              <button id="mat-nav-3-${containerId}" onclick="
                document.getElementById('nav-screen-txt-${containerId}').textContent = 'Active Tab: 👤 User Profile';
                this.style.color = '#38bdf8';
                document.getElementById('mat-nav-1-${containerId}').style.color = 'var(--text-muted)';
                document.getElementById('mat-nav-2-${containerId}').style.color = 'var(--text-muted)';
              " style="background:none; border:none; color:var(--text-muted); cursor:pointer; display:flex; flex-direction:column; align-items:center; font-size:10px; font-weight:700;">
                <span style="font-size:14px;">👤</span> Profile
              </button>
            </div>
          </div>
        `;
        break;

      case 'sim_nav_02':
        // Floating Glassmorphism Navigation Dock
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <div style="background:rgba(255,255,255,0.08); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.2); padding:6px 14px; border-radius:30px; display:flex; gap:16px; box-shadow:0 8px 24px rgba(0,0,0,0.3);">
              ${['🏠', '⚡', '❤️', '⚙️'].map((ic, i) => `
                <button onclick="
                  App.showToast('Floating Dock Option ${i+1} Selected', 'info');
                  this.parentElement.querySelectorAll('button').forEach(b => b.style.background = 'transparent');
                  this.style.background = 'rgba(56,189,248,0.3)';
                " style="background:${i === 0 ? 'rgba(56,189,248,0.3)' : 'transparent'}; border:none; color:#fff; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:16px; cursor:pointer; transition:all 0.2s ease;">${ic}</button>
              `).join('')}
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Floating Glass Dock Bar</span>
          </div>
        `;
        break;

      // ======================================================================
      // 10. DRAWERS
      // ======================================================================
      case 'sim_drawer_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="padding:12px;">
            <div style="font-size:0.8rem; font-weight:800; color:#38bdf8; margin-bottom:8px;">Side Navigation Drawer</div>
            <div style="display:flex; flex-direction:column; gap:6px; font-size:0.75rem;">
              <div style="padding:6px; background:rgba(255,255,255,0.08); border-radius:6px; color:#fff;">📁 All Components</div>
              <div style="padding:6px; color:var(--text-muted);">⭐ Favorites</div>
            </div>
          </div>
        `;
        break;

      // ======================================================================
      // 11. TABS & TABBAR (2 Completely Distinct Implementations)
      // ======================================================================
      case 'sim_tab_01':
        // Component 1: Segmented Pill Tab Controller (SOLID FILLED PILL)
        el.innerHTML = `
          <div class="sim-card-surface" style="padding:12px; background:#0f172a;">
            <div style="display:flex; background:#1e293b; border-radius:24px; padding:4px; margin-bottom:12px;">
              <button id="pill-btn-1-${containerId}" onclick="
                this.style.background = '#38bdf8'; this.style.color = '#fff';
                document.getElementById('pill-btn-2-${containerId}').style.background = 'transparent';
                document.getElementById('pill-btn-2-${containerId}').style.color = 'var(--text-muted)';
                document.getElementById('pill-panel-${containerId}').textContent = 'Active Panel: [Overview] (Filled Pill Style)';
              " style="flex:1; background:#38bdf8; color:#fff; border:none; border-radius:20px; padding:8px 12px; font-weight:800; font-size:0.75rem; cursor:pointer; transition:all 0.2s ease;">Overview</button>

              <button id="pill-btn-2-${containerId}" onclick="
                this.style.background = '#38bdf8'; this.style.color = '#fff';
                document.getElementById('pill-btn-1-${containerId}').style.background = 'transparent';
                document.getElementById('pill-btn-1-${containerId}').style.color = 'var(--text-muted)';
                document.getElementById('pill-panel-${containerId}').textContent = 'Active Panel: [Dart Code] (Filled Pill Style)';
              " style="flex:1; background:transparent; color:var(--text-muted); border:none; border-radius:20px; padding:8px 12px; font-weight:800; font-size:0.75rem; cursor:pointer; transition:all 0.2s ease;">Dart Code</button>
            </div>
            <div id="pill-panel-${containerId}" style="font-size:0.75rem; color:var(--text-secondary); text-align:center; padding:8px; background:rgba(255,255,255,0.03); border-radius:10px;">
              Active Panel: [Overview] (Filled Pill Style)
            </div>
          </div>
        `;
        break;

      case 'sim_tab_02':
        // Component 2: Animated Underline Material TabBar (NO PILL! ANIMATED UNDERLINE INDICATOR LINE)
        el.innerHTML = `
          <div class="sim-card-surface" style="padding:12px; background:#0f172a;">
            <div style="position:relative; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:12px; display:flex; justify-content:space-around;">
              <button id="und-btn-1-${containerId}" onclick="
                document.getElementById('und-line-${containerId}').style.left = '8%';
                document.getElementById('und-panel-${containerId}').textContent = 'Active Content: Overview (Material Underline Indicator)';
              " style="background:none; border:none; color:#38bdf8; font-weight:800; font-size:0.8rem; padding:8px 12px; cursor:pointer;">Overview</button>

              <button id="und-btn-2-${containerId}" onclick="
                document.getElementById('und-line-${containerId}').style.left = '40%';
                document.getElementById('und-panel-${containerId}').textContent = 'Active Content: Preview (Material Underline Indicator)';
              " style="background:none; border:none; color:var(--text-muted); font-weight:800; font-size:0.8rem; padding:8px 12px; cursor:pointer;">Preview</button>

              <button id="und-btn-3-${containerId}" onclick="
                document.getElementById('und-line-${containerId}').style.left = '72%';
                document.getElementById('und-panel-${containerId}').textContent = 'Active Content: Code (Material Underline Indicator)';
              " style="background:none; border:none; color:var(--text-muted); font-weight:800; font-size:0.8rem; padding:8px 12px; cursor:pointer;">Code</button>

              <div id="und-line-${containerId}" style="position:absolute; bottom:0; left:8%; width:22%; height:3px; background:#38bdf8; border-radius:2px; transition:left 0.25s cubic-bezier(0.4, 0, 0.2, 1);"></div>
            </div>
            <div id="und-panel-${containerId}" style="font-size:0.75rem; color:var(--text-secondary); text-align:center; padding:8px; background:rgba(255,255,255,0.03); border-radius:10px;">
              Active Content: Overview (Material Underline Indicator)
            </div>
          </div>
        `;
        break;

      // ======================================================================
      // 12. DROPDOWNS
      // ======================================================================
      case 'sim_drop_01':
        el.innerHTML = `
          <div class="sim-card-surface">
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#38bdf8; margin-bottom:6px;">Select Flutter SDK</label>
            <select onchange="App.showToast('SDK Version Selected: ' + this.value, 'info')"
              style="width:100%; background:#1e293b; border:1px solid #38bdf8; color:#fff; padding:10px; border-radius:10px; font-size:0.85rem; outline:none; cursor:pointer;">
              <option value="Flutter 3.24 (Latest)">Flutter 3.24 (Latest)</option>
              <option value="Flutter 3.22 Stable">Flutter 3.22 Stable</option>
              <option value="Dart 3.5 Compiler">Dart 3.5 Compiler</option>
            </select>
          </div>
        `;
        break;

      // ======================================================================
      // 13. CHECKBOXES & SWITCHES
      // ======================================================================
      case 'sim_chk_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; font-size:0.85rem; color:#fff;">Interactive Switch Toggle</span>
            <label style="position:relative; display:inline-block; width:44px; height:24px;">
              <input type="checkbox" checked style="opacity:0; width:0; height:0;" onchange="
                const slider = this.nextElementSibling;
                slider.style.background = this.checked ? '#38bdf8' : '#334155';
                slider.querySelector('.thumb').style.transform = this.checked ? 'translateX(20px)' : 'translateX(0)';
                App.showToast(this.checked ? 'Switch Turned ON' : 'Switch Turned OFF', 'info');
              " />
              <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:#38bdf8; border-radius:24px; transition:0.2s;">
                <span class="thumb" style="position:absolute; content:''; height:18px; width:18px; left:3px; bottom:3px; background:white; border-radius:50%; transition:0.2s; transform:translateX(20px);"></span>
              </span>
            </label>
          </div>
        `;
        break;

      case 'sim_chk_02':
        el.innerHTML = `
          <div class="sim-card-surface" style="display:flex; align-items:center; gap:10px;">
            <input type="checkbox" checked style="accent-color:#38bdf8; transform:scale(1.4); cursor:pointer;"
              onchange="App.showToast(this.checked ? 'Task Completed' : 'Task Unchecked', 'info')" />
            <span style="font-weight:700; font-size:0.85rem;">Enable Auto Update</span>
          </div>
        `;
        break;

      // ======================================================================
      // 14. RADIO BUTTONS & CHOICE
      // ======================================================================
      case 'sim_rad_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="display:flex; gap:10px; justify-content:center;">
            <label style="background:rgba(56,189,248,0.2); border:1px solid #38bdf8; color:#38bdf8; padding:8px 16px; border-radius:20px; font-size:0.8rem; font-weight:800; cursor:pointer;">
              <input type="radio" name="plan-${containerId}" checked style="display:none;" /> Monthly (₹29)
            </label>
            <label style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:8px 16px; border-radius:20px; font-size:0.8rem; font-weight:800; cursor:pointer;">
              <input type="radio" name="plan-${containerId}" style="display:none;" /> Yearly (₹299)
            </label>
          </div>
        `;
        break;

      // ======================================================================
      // 15. SLIDERS & RANGESLIDERS
      // ======================================================================
      case 'sim_sld_01':
        el.innerHTML = `
          <div class="sim-card-surface">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; color:#38bdf8; margin-bottom:6px;">
              <span>Dual Price Range</span>
              <span>₹20 - ₹80</span>
            </div>
            <input type="range" min="0" max="100" value="50" style="width:100%; accent-color:#38bdf8; cursor:pointer;" />
          </div>
        `;
        break;

      case 'sim_sld_02':
        el.innerHTML = `
          <div class="sim-card-surface">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; color:#8b5cf6; margin-bottom:6px;">
              <span>Volume Output</span>
              <span id="sld-val-${containerId}">75%</span>
            </div>
            <input type="range" min="0" max="100" value="75" style="width:100%; accent-color:#8b5cf6; cursor:pointer;"
              oninput="document.getElementById('sld-val-${containerId}').textContent = this.value + '%';" />
          </div>
        `;
        break;

      // ======================================================================
      // 16. PROGRESS & LOADING
      // ======================================================================
      case 'sim_prg_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="animation:pulse 1.2s infinite alternate;">
            <div style="height:14px; background:rgba(255,255,255,0.15); border-radius:8px; width:70%; margin-bottom:8px;"></div>
            <div style="height:10px; background:rgba(255,255,255,0.08); border-radius:6px; width:40%;"></div>
          </div>
        `;
        break;

      case 'sim_prg_02':
        el.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <div style="width:48px; height:48px; border:4px solid rgba(56,189,248,0.2); border-top-color:#38bdf8; border-radius:50%; animation:spin 1s linear infinite;"></div>
            <span style="font-size:0.75rem; color:#38bdf8; font-weight:800;">75% Loaded</span>
          </div>
        `;
        break;

      // ======================================================================
      // 17-29. OTHER COMPONENT TYPES
      // ======================================================================
      case 'sim_grid_01':
      case 'sim_lvw_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; font-size:0.75rem;">Tile #1</div>
            <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; font-size:0.75rem;">Tile #2</div>
          </div>
        `;
        break;

      case 'sim_exp_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="cursor:pointer;" onclick="
            const desc = this.querySelector('.exp-desc');
            const icon = this.querySelector('.exp-icon');
            const isExpanded = desc.style.display === 'block';
            desc.style.display = isExpanded ? 'none' : 'block';
            icon.textContent = isExpanded ? '▼' : '▲';
          ">
            <div style="display:flex; justify-content:space-between; font-weight:800; font-size:0.85rem; color:#38bdf8;">
              <span>ExpansionTile FAQ Item</span>
              <span class="exp-icon">▼</span>
            </div>
            <div class="exp-desc" style="display:none; font-size:0.75rem; color:var(--text-secondary); margin-top:8px;">
              This is the expanded collapsible content area of the Flutter ExpansionTile widget.
            </div>
          </div>
        `;
        break;

      case 'sim_page_01':
        el.innerHTML = `
          <div class="sim-card-surface" style="text-align:center;">
            <div id="slide-txt-${containerId}" style="font-size:0.85rem; font-weight:800; color:#fff; min-height:36px; display:flex; align-items:center; justify-content:center;">Slide 1: High Performance</div>
            <div style="display:flex; justify-content:center; gap:6px; margin-top:8px;">
              <button onclick="document.getElementById('slide-txt-${containerId}').textContent = 'Slide 1: High Performance';" style="width:8px; height:8px; border-radius:50%; border:none; background:#38bdf8; cursor:pointer;"></button>
              <button onclick="document.getElementById('slide-txt-${containerId}').textContent = 'Slide 2: Production Ready';" style="width:8px; height:8px; border-radius:50%; border:none; background:rgba(255,255,255,0.3); cursor:pointer;"></button>
            </div>
          </div>
        `;
        break;

      case 'sim_fab_01':
        el.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center;">
            <button class="sim-btn-hover" onclick="App.showToast('FAB Clicked! Speed dial options opened.', 'info')"
              style="width:48px; height:48px; border-radius:50%; background:#38bdf8; border:none; color:#fff; font-size:20px; cursor:pointer; box-shadow:0 4px 14px rgba(56,189,248,0.4);">
              +
            </button>
          </div>
        `;
        break;

      case 'sim_bdg_01':
        el.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="position:relative; cursor:pointer;" onclick="
              const bdg = this.querySelector('.cnt-bdg');
              let val = parseInt(bdg.textContent, 10);
              bdg.textContent = val + 1;
              App.showToast('Notification Badge Incremented: ' + (val + 1), 'info');
            ">
              <span style="font-size:28px;">🔔</span>
              <span class="cnt-bdg" style="position:absolute; top:-4px; right:-6px; background:#ef4444; color:#fff; border-radius:10px; font-size:10px; font-weight:900; padding:1px 6px;">3</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Tap bell to increment badge</span>
          </div>
        `;
        break;

      case 'sim_chip_01':
        el.innerHTML = `
          <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center;">
            <span style="background:rgba(56,189,248,0.2); border:1px solid #38bdf8; color:#38bdf8; padding:4px 12px; border-radius:16px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:6px;">
              Flutter 3.x <button onclick="this.parentElement.remove(); App.showToast('Tag chip removed', 'info');" style="background:none; border:none; color:#38bdf8; cursor:pointer; padding:0; font-size:10px;">✕</button>
            </span>
            <span style="background:rgba(139,92,246,0.2); border:1px solid #8b5cf6; color:#8b5cf6; padding:4px 12px; border-radius:16px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:6px;">
              Dart 3.5 <button onclick="this.parentElement.remove(); App.showToast('Tag chip removed', 'info');" style="background:none; border:none; color:#8b5cf6; cursor:pointer; padding:0; font-size:10px;">✕</button>
            </span>
          </div>
        `;
        break;

      default:
        el.innerHTML = `
          <div class="sim-card-surface" style="text-align:center;">
            <button class="sim-btn-hover" onclick="App.showToast('⚡ Interactive Preview Action Executed', 'info')"
              style="background:linear-gradient(135deg,#38bdf8,#8b5cf6); border:none; color:#fff; padding:10px 20px; border-radius:12px; font-weight:800; font-size:12px; cursor:pointer;">
              ⚡ Test Interactive Widget
            </button>
          </div>
        `;
        break;
    }
  }
};

if (typeof window !== 'undefined') {
  window.FlutterSim = FlutterSim;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlutterSim;
}
