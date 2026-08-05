/* ==========================================================================
   FlutterHub Scratch Coupon Reward System & Interactive Canvas Engine
   Handles Welcome Scratch Cards, HTML5 Scratch Canvas Animation,
   Confetti Reveal Effects, My Coupons Management, and Checkout Validation
   ========================================================================== */

const CouponManager = {
  myCoupons: [],
  activeScratchCoupon: null,
  isScratching: false,
  scratchedPercentage: 0,

  init: async function () {
    const user = AuthManager.currentUser;
    if (user && !user.isAdmin) {
      await this.fetchMyCoupons();
      if (!Array.isArray(this.myCoupons) || this.myCoupons.length === 0) {
        this.myCoupons = this.getFallbackCoupons(user);
      }
      this.checkUnscratchedWelcome();
    }
  },

  fetchMyCoupons: async function () {
    const user = AuthManager.currentUser;
    if (!user) return [];

    try {
      const res = await fetch(`/api/coupons/my-coupons?userId=${encodeURIComponent(user.id || user._id)}&userEmail=${encodeURIComponent(user.email || '')}`, {
        headers: {
          'x-user-id': user.id || user._id || '',
          'x-user-email': user.email || ''
        }
      });
      const json = await res.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        this.myCoupons = json.data;
      } else {
        this.myCoupons = this.getFallbackCoupons(user);
      }
    } catch (e) {
      console.warn("Notice fetching coupons from server:", e.message);
      this.myCoupons = this.getFallbackCoupons(user);
    }
    return this.myCoupons;
  },

  getFallbackCoupons: function (user) {
    const code = 'WELCOME10-' + (user && user.email ? user.email.slice(0, 4).toUpperCase() : 'USER') + '7890';
    const exp = new Date();
    exp.setFullYear(exp.getFullYear() + 1);

    return [{
      id: 'coupon_welcome_01',
      user_id: user ? (user.id || user._id) : 'user_01',
      user_email: user ? user.email : '',
      coupon_code: code,
      discount_percentage: 10,
      expiry_date: exp.toISOString(),
      is_scratched: false,
      is_used: false,
      status: 'Unscratched'
    }];
  },

  checkUnscratchedWelcome: function () {
    const user = AuthManager.currentUser;
    if (!user || user.isAdmin) return;

    if (!Array.isArray(this.myCoupons) || this.myCoupons.length === 0) {
      this.myCoupons = this.getFallbackCoupons(user);
    }

    const widget = document.getElementById('floating-reward-widget');
    if (widget) {
      // 2 Seconds delay after login to pop up blinking reward coupon card
      setTimeout(() => {
        widget.style.display = 'block';
        widget.classList.add('animate-pop-in');
      }, 2000);
    }
  },

  // ------------------------------------------------------------------------
  // INTERACTIVE CANVAS SCRATCH CARD MODAL & ENGINE
  // ------------------------------------------------------------------------
  openScratchCardModal: function (coupon) {
    const modal = document.getElementById('scratch-card-modal');
    if (!modal) return;

    const widget = document.getElementById('floating-reward-widget');
    if (widget) widget.style.display = 'none';

    this.activeScratchCoupon = coupon || this.myCoupons[0];
    this.scratchedPercentage = 0;

    // Set hidden coupon code text under canvas
    const codeEl = document.getElementById('scratch-hidden-code');
    const expiryEl = document.getElementById('scratch-hidden-expiry');
    if (codeEl) codeEl.innerText = this.activeScratchCoupon.coupon_code;
    if (expiryEl) {
      const expDate = new Date(this.activeScratchCoupon.expiry_date || Date.now());
      expiryEl.innerText = `Valid until ${expDate.toLocaleDateString()}`;
    }

    // Hide revealed state container initially
    const revealedBox = document.getElementById('scratch-revealed-box');
    const canvasContainer = document.getElementById('scratch-canvas-container');
    if (revealedBox) revealedBox.style.display = 'none';
    if (canvasContainer) canvasContainer.style.display = 'block';

    modal.classList.add('active');

    // Initialize Canvas Scratch Layer
    setTimeout(() => this.setupScratchCanvas(), 100);
  },

  closeScratchCardModal: function () {
    const modal = document.getElementById('scratch-card-modal');
    if (modal) modal.classList.remove('active');
  },

  setupScratchCanvas: function () {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 340;
    const height = canvas.height = 180;

    // Fill Silver Foil Gradient Top Layer
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#64748b');
    grad.addColorStop(0.3, '#94a3b8');
    grad.addColorStop(0.5, '#e2e8f0');
    grad.addColorStop(0.7, '#94a3b8');
    grad.addColorStop(1, '#475569');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add metallic texture & pattern text
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎁 SCRATCH HERE TO REVEAL', width / 2, height / 2 - 12);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('10% OFF Welcome Coupon Reward', width / 2, height / 2 + 16);

    let isDrawing = false;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (width / rect.width),
        y: (clientY - rect.top) * (height / rect.height)
      };
    };

    const scratch = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
      ctx.fill();

      this.checkScratchPercentage(ctx, width, height);
    };

    canvas.onmousedown = (e) => { isDrawing = true; scratch(e); };
    canvas.onmousemove = scratch;
    canvas.onmouseup = () => { isDrawing = false; };

    canvas.ontouchstart = (e) => { isDrawing = true; scratch(e); };
    canvas.ontouchmove = scratch;
    canvas.ontouchend = () => { isDrawing = false; };
  },

  checkScratchPercentage: function (ctx, width, height) {
    if (this.scratchedPercentage >= 45) return;

    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let clearCount = 0;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) clearCount++;
      }

      const pct = Math.round((clearCount / (pixels.length / 16)) * 100);
      this.scratchedPercentage = pct;

      if (pct >= 40) {
        this.completeScratch();
      }
    } catch (e) {
      console.warn("Canvas ImageData calculation notice:", e);
    }
  },

  completeScratch: async function () {
    if (!this.activeScratchCoupon) return;

    const couponCode = this.activeScratchCoupon.coupon_code;
    this.activeScratchCoupon.is_scratched = true;
    this.activeScratchCoupon.status = 'Scratched';

    // Call backend endpoint
    try {
      await fetch('/api/coupons/scratch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon_code: couponCode, userId: AuthManager.currentUser?.id })
      });
    } catch (e) {
      console.warn("Notice updating scratch status on backend:", e);
    }

    // Trigger confetti animation & reveal state
    this.triggerConfetti();

    const canvasContainer = document.getElementById('scratch-canvas-container');
    const revealedBox = document.getElementById('scratch-revealed-box');

    if (canvasContainer) canvasContainer.style.display = 'none';
    if (revealedBox) {
      revealedBox.style.display = 'block';
      revealedBox.classList.add('animate-pop-in');
    }

    App.showToast('🎉 Congratulations! You unlocked 10% OFF Welcome Coupon!', 'success');
  },

  triggerConfetti: function () {
    const container = document.getElementById('scratch-card-modal');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.backgroundColor = ['#38bdf8', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'][Math.floor(Math.random() * 5)];
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(particle);

      setTimeout(() => particle.remove(), 2500);
    }
  },

  copyCouponCode: function (code) {
    const text = code || (this.activeScratchCoupon ? this.activeScratchCoupon.coupon_code : '');
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      App.showToast(`Copied coupon code "${text}" to clipboard! 📋`, 'success');
    });
  },

  // ------------------------------------------------------------------------
  // MY COUPONS USER DASHBOARD RENDERER
  // ------------------------------------------------------------------------
  renderUserCouponsHTML: function () {
    if (this.myCoupons.length === 0) {
      return `
        <div class="glass-panel" style="padding:2rem; text-align:center; color:var(--text-muted);">
          No coupons claimed yet. Complete registration or check back for seasonal promotions!
        </div>
      `;
    }

    return `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:1.25rem; margin-top:1rem;">
        ${this.myCoupons.map(c => {
      const isUnscratched = !c.is_scratched && !c.is_used && c.status !== 'Expired';
      const isUsed = c.is_used;
      const isExpired = c.status === 'Expired';
      const expDate = new Date(c.expiry_date || Date.now()).toLocaleDateString();

      return `
            <div class="glass-panel" style="padding:1.25rem; position:relative; overflow:hidden; border:${isUnscratched ? '1px solid #38bdf8' : '1px solid var(--border-color)'};">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                <span class="badge ${isUsed ? 'badge-cyan' : isUnscratched ? 'badge-pro' : 'badge-cyan'}" style="font-size:0.75rem;">
                  ${isUsed ? '✓ USED' : isUnscratched ? '🎁 UNSCRATCHED' : isExpired ? 'EXPIRED' : '✨ ACTIVE'}
                </span>
                <span style="font-size:0.75rem; color:var(--text-muted);">Expires: ${expDate}</span>
              </div>

              <div style="font-size:1.5rem; font-weight:800; color:${isUsed ? 'var(--text-muted)' : '#38bdf8'}; margin-bottom:0.25rem;">
                ${c.discount_percentage || 10}% OFF
              </div>
              <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
                Exclusively for Yearly Premium Plan (Save ₹30)
              </div>

              ${isUnscratched ? `
                <button class="btn btn-primary btn-sm" style="width:100%; font-weight:700;" onclick="CouponManager.openScratchCardModal(CouponManager.myCoupons.find(cp => cp.id === '${c.id}'))">
                  🎁 Scratch Card Now
                </button>
              ` : `
                <div style="background:var(--bg-tertiary); padding:0.6rem 0.85rem; border-radius:8px; display:flex; align-items:center; justify-content:space-between; border:1px dashed var(--border-color);">
                  <span style="font-family:var(--font-mono); font-weight:800; color:var(--text-bright); font-size:0.95rem;">${c.coupon_code}</span>
                  <button class="btn btn-secondary btn-sm" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="CouponManager.copyCouponCode('${c.coupon_code}')">Copy</button>
                </div>
              `}
            </div>
          `;
    }).join('')}
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // CHECKOUT COUPON VALIDATOR
  // ------------------------------------------------------------------------
  validateCheckoutCoupon: async function (code, plan) {
    const user = AuthManager.currentUser;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupon_code: code,
          plan: plan || 'yearly',
          userId: user?.id || user?._id,
          userEmail: user?.email
        })
      });

      const json = await res.json();
      return json;
    } catch (e) {
      return { success: false, message: 'Server validation error. Please try again.' };
    }
  }
};
