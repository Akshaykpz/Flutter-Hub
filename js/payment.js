/* ==========================================================================
   FlutterHub — Razorpay Checkout Integration (UPI + Cards + Netbanking)
   ─────────────────────────────────────────────────────────────────────────
   Security model:
   • JWT Bearer token sent with every API call — backend identifies the user
   • Course/product ONLY unlocked after backend returns success:true
   • No fallback upgrades on error or network failure
   • Idempotent: checks active subscription before opening checkout
   ─────────────────────────────────────────────────────────────────────────
   UPI support:
   • Razorpay Checkout natively shows Google Pay, PhonePe, Paytm & all UPI
     apps — no per-app integration needed.
   • method config explicitly enables upi, card, netbanking, wallet.
   • UPI QR and UPI intent (app-to-app) both handled by Razorpay SDK.
   ========================================================================== */

const PaymentGateway = {
  // Backend API URL: local dev → Express server; production → same-origin
  backendUrl: ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : window.location.origin,

  // Live Razorpay Key ID (only the key ID, never the secret)
  razorpayKeyId: 'rzp_live_TIu357i7kCLnHd',

  selectedPlan: 'yearly',      // 'monthly' (₹29) or 'yearly' (₹299)
  isOpeningCheckout: false,
  appliedCoupon: null,

  /* ── Auth helper ────────────────────────────────────────────────────── */
  _getAuthHeaders: function () {
    const token = AuthManager.currentUser && AuthManager.currentUser.token;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  /* ── Open the checkout modal ─────────────────────────────────────────── */
  openCheckout: function (plan = 'yearly') {
    if (!AuthManager.currentUser) {
      App.showToast('🔒 Please sign in to purchase FlutterHub Pro.', 'error');
      AuthManager.openAuthModal('signin');
      return;
    }
    this.selectedPlan = plan;
    this.appliedCoupon = null;

    // Reset coupon UI
    const couponInput = document.getElementById('checkout-coupon-input');
    const breakdownEl = document.getElementById('coupon-applied-breakdown');
    if (couponInput) { couponInput.value = ''; couponInput.style.borderColor = ''; }
    if (breakdownEl) { breakdownEl.style.display = 'none'; breakdownEl.innerHTML = ''; }

    const modal = document.getElementById('razorpay-modal');
    if (modal) modal.classList.add('active');
    this.updateModalPlanUI();
  },

  closeCheckout: function () {
    const modal = document.getElementById('razorpay-modal');
    if (modal) modal.classList.remove('active');
  },

  selectPlan: function (plan) {
    this.selectedPlan = plan;
    this.appliedCoupon = null;
    this.updateModalPlanUI();
  },

  /* ── Coupon handling ─────────────────────────────────────────────────── */
  handleApplyCouponClick: async function () {
    const input      = document.getElementById('checkout-coupon-input');
    const breakdownEl = document.getElementById('coupon-applied-breakdown');
    const code       = input ? input.value.trim() : '';

    if (!code) {
      if (input) input.style.borderColor = '#f43f5e';
      if (breakdownEl) {
        breakdownEl.style.display = 'block';
        breakdownEl.style.color   = '#f43f5e';
        breakdownEl.innerHTML     = '⚠️ Please enter a coupon code before applying.';
      }
      App.showToast('Please enter a coupon code.', 'error');
      return;
    }

    App.showToast(`Validating coupon ${code}…`, 'info');
    const result = await CouponManager.validateCheckoutCoupon(code, this.selectedPlan);

    if (result && result.success && result.data) {
      const data = result.data;
      this.appliedCoupon = data;
      if (input) input.style.borderColor = '#10b981';
      if (breakdownEl) {
        breakdownEl.style.display = 'block';
        breakdownEl.style.color   = '#10b981';
        breakdownEl.innerHTML     = `
          ✅ <strong>${data.coupon_code} Applied!</strong><br>
          Original: ₹${data.originalPrice} | Discount: −₹${data.discountAmount}<br>
          <span style="font-size:0.95rem;color:#38bdf8;font-weight:800;">
            Final: ₹${data.finalPrice}
          </span>`;
      }
      this.updateModalPlanUI();
      App.showToast(result.message || 'Coupon applied!', 'success');
    } else {
      this.appliedCoupon = null;
      if (input) input.style.borderColor = '#f43f5e';
      const errMsg = result?.message || 'Invalid coupon code.';
      if (breakdownEl) {
        breakdownEl.style.display = 'block';
        breakdownEl.style.color   = '#f43f5e';
        breakdownEl.innerHTML     = `❌ <strong>Invalid Coupon:</strong> ${errMsg}`;
      }
      this.updateModalPlanUI();
      App.showToast(errMsg, 'error');
    }
  },

  /* ── Update modal price display ──────────────────────────────────────── */
  updateModalPlanUI: function () {
    const isYearly = this.selectedPlan === 'yearly';
    let btnText    = isYearly ? 'Pay with Razorpay (₹299/yr)' : 'Pay with Razorpay (₹29/mo)';

    if (isYearly && this.appliedCoupon) {
      btnText = `Pay with Razorpay (₹${this.appliedCoupon.finalPrice}/yr)`;
    }

    const priceEl = document.getElementById('modal-price-display');
    if (priceEl) {
      priceEl.innerText = isYearly
        ? (this.appliedCoupon ? `₹${this.appliedCoupon.finalPrice} / year (10% OFF)` : '₹299 / year')
        : '₹29 / month';
    }

    const payBtn = document.getElementById('rzp-pay-confirm-btn');
    if (payBtn) payBtn.innerText = btnText;

    const monthlyCard = document.getElementById('plan-select-monthly');
    const yearlyCard  = document.getElementById('plan-select-yearly');
    if (monthlyCard && yearlyCard) {
      if (isYearly) {
        yearlyCard.classList.add('active');
        monthlyCard.classList.remove('active');
      } else {
        monthlyCard.classList.add('active');
        yearlyCard.classList.remove('active');
      }
    }
  },

  /* ── Main checkout launcher ──────────────────────────────────────────── */
  openRealRazorpayPopup: async function () {
    const self = this;

    // Prevent duplicate rapid clicks
    if (self.isOpeningCheckout) return;

    // Network guard
    if (window.NetworkManager && !window.NetworkManager.isOnline) {
      App.showToast('⚠️ No internet connection. Please reconnect and try again.', 'error');
      return;
    }

    // Auth guard
    if (!AuthManager.currentUser) {
      App.showToast('🔒 Please sign in first.', 'error');
      AuthManager.openAuthModal('signin');
      return;
    }

    self.isOpeningCheckout = true;
    self._setButtonLoading('Checking subscription…');

    // ── Pre-check: is user already subscribed? ─────────────────────────
    try {
      const statusRes = await fetch(`${self.backendUrl}/api/payment/status`, {
        headers: self._getAuthHeaders(),
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.is_subscribed) {
          self.closeCheckout();
          self.resetButtonState();
          App.showToast('✅ You already have an active Pro subscription!', 'success');
          return;
        }
      }
    } catch (_) {
      // Non-fatal — continue to checkout
    }

    const isYearly    = self.selectedPlan === 'yearly';
    let planAmountPaise = isYearly ? 29900 : 2900;
    let couponDiscount  = 0;

    if (isYearly && self.appliedCoupon) {
      planAmountPaise = self.appliedCoupon.finalPrice * 100;
      couponDiscount  = self.appliedCoupon.discountAmount || 0;
    }

    const planLabel = isYearly
      ? (self.appliedCoupon
          ? `Pro Yearly (₹${self.appliedCoupon.finalPrice}/yr)`
          : 'Pro Yearly (₹299/yr)')
      : 'Pro Monthly (₹29/mo)';

    self._setButtonLoading('Creating order…');
    App.showToast(`Preparing Razorpay checkout…`, 'info');

    // ── Create order on backend ────────────────────────────────────────
    let orderId = null;
    let keyId   = self.razorpayKeyId;

    try {
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 8000);

      const orderRes = await fetch(`${self.backendUrl}/api/payment/create-order`, {
        method:  'POST',
        headers: self._getAuthHeaders(),
        signal:  controller.signal,
        body:    JSON.stringify({
          plan:            self.selectedPlan,
          coupon_discount: couponDiscount,
        }),
      });

      clearTimeout(timeoutId);

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        if (errData.already_subscribed) {
          self.closeCheckout();
          self.resetButtonState();
          App.showToast('✅ You already have an active Pro subscription!', 'success');
          return;
        }
        throw new Error(errData.message || `Server error ${orderRes.status}`);
      }

      const orderData = await orderRes.json();
      if (orderData && orderData.order_id) {
        orderId = orderData.order_id;
        if (orderData.key_id) keyId = orderData.key_id;
      } else {
        throw new Error('Invalid order response from server.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        App.showToast('⏱️ Request timed out. Please check your connection and try again.', 'error');
      } else {
        App.showToast(`❌ Could not create order: ${err.message}`, 'error');
      }
      self.resetButtonState();
      return;
    }

    self._setButtonLoading('Opening Razorpay…');

    // ── Apply coupon usage record (non-blocking) ───────────────────────
    if (self.appliedCoupon) {
      fetch(`${self.backendUrl}/api/coupons/apply`, {
        method:  'POST',
        headers: self._getAuthHeaders(),
        body:    JSON.stringify({
          coupon_code: self.appliedCoupon.coupon_code,
          order_id:    orderId,
        }),
      }).catch(() => {});
    }

    // ── Razorpay Checkout Options ──────────────────────────────────────
    // UPI (Google Pay, PhonePe, Paytm, BHIM, etc.) is natively supported
    // by Razorpay Checkout. Setting method.upi = true and providing a
    // upi_link ensures the UPI section appears prominently.
    const user = AuthManager.currentUser;
    const options = {
      key:         keyId,
      amount:      planAmountPaise,
      currency:    'INR',
      order_id:    orderId,                          // Required for signature verification
      name:        'FlutterHub Pro',
      description: planLabel,
      image:       'assets/images/flutterhub-logo.png',

      // Pre-fill user details
      prefill: {
        name:    user ? user.name  : '',
        email:   user ? user.email : '',
        contact: '',                                 // Left blank; user fills in Razorpay UI
      },

      // ── Method configuration ────────────────────────────────────────
      // Explicitly enable UPI so Google Pay / PhonePe / Paytm /
      // any UPI VPA appears in the Razorpay checkout screen.
      // Razorpay handles app-to-app (UPI Intent) and UPI Collect flows.
      method: {
        upi:        true,   // Google Pay, PhonePe, Paytm, BHIM, all UPI apps
        card:       true,   // Debit & credit cards
        netbanking: true,   // All major banks
        wallet:     true,   // Paytm wallet, Mobikwik, etc.
        emi:        false,  // EMI can be enabled on higher amounts if needed
      },

      // ── Display preferences ─────────────────────────────────────────
      config: {
        display: {
          // Show UPI as the default/first payment block
          blocks: {
            utib: {                                  // UTIB = UPI block
              name: 'UPI Payment',
              instruments: [
                { method: 'upi', flows: ['intent', 'collect', 'qr'] },
              ],
            },
            other: {
              name: 'Other Payment Methods',
              instruments: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' },
              ],
            },
          },
          sequence: ['block.utib', 'block.other'],
          preferences: { show_default_blocks: false },
        },
      },

      theme: { color: isYearly ? '#8b5cf6' : '#0284c7' },

      // ── Success handler ─────────────────────────────────────────────
      // Called when Razorpay reports payment success in the browser.
      // We do NOT unlock the course here — we send the response to the
      // backend for HMAC verification first.
      handler: async function (paymentResponse) {
        await self.verifyPaymentOnBackend(paymentResponse);
      },

      // ── Modal events ────────────────────────────────────────────────
      modal: {
        // User explicitly closed the Razorpay popup
        ondismiss: function () {
          self.resetButtonState();
          App.showToast('Payment cancelled. Razorpay window was closed.', 'info');
        },
        // Escape key or backdrop click
        escape:     true,
        backdropclose: false,
      },
    };

    // ── Launch Razorpay ──────────────────────────────────────────────
    if (typeof Razorpay === 'undefined') {
      App.showToast('❌ Razorpay SDK failed to load. Please refresh and try again.', 'error');
      self.resetButtonState();
      return;
    }

    try {
      const rzp = new Razorpay(options);

      // ── Payment failure event (within Razorpay popup) ──────────────
      // Fired when the user's bank/UPI returns a failure
      rzp.on('payment.failed', function (response) {
        const errorDesc  = response.error?.description || 'Payment failed.';
        const errorCode  = response.error?.code        || '';
        const reason     = response.error?.reason      || '';
        console.warn('[Razorpay] Payment failed:', response.error);

        App.showToast(`❌ Payment failed: ${errorDesc}`, 'error');

        // Log failure to backend (non-blocking, best-effort)
        fetch(`${self.backendUrl}/api/payment/verify`, {
          method:  'POST',
          headers: self._getAuthHeaders(),
          body:    JSON.stringify({
            razorpay_order_id:    response.error?.metadata?.order_id   || orderId,
            razorpay_payment_id:  response.error?.metadata?.payment_id || '',
            razorpay_signature:   'FAILED',
            plan:                 self.selectedPlan,
            failed:               true,
            failure_reason:       reason || errorCode,
          }),
        }).catch(() => {});

        self.resetButtonState();
      });

      rzp.open();
      // Reset the button state after the popup opens (the popup itself takes over)
      setTimeout(() => { self.resetButtonState(); }, 1500);
    } catch (err) {
      console.error('[Razorpay] SDK error:', err);
      App.showToast('❌ Failed to open Razorpay. Please refresh and try again.', 'error');
      self.resetButtonState();
    }
  },

  /* ── Backend payment verification ───────────────────────────────────── */
  // ⚠️  SECURITY: This is the ONLY place where AuthManager.upgradeToPro()
  //   is called. It only fires when the backend confirms success:true.
  //   Any error, network failure, or false from the backend → no upgrade.
  verifyPaymentOnBackend: async function (paymentResponse) {
    const self = this;
    App.showToast('🔐 Verifying payment with server…', 'info');

    try {
      const response = await fetch(`${self.backendUrl}/api/payment/verify`, {
        method:  'POST',
        headers: self._getAuthHeaders(),
        body:    JSON.stringify({
          plan:                 self.selectedPlan,
          razorpay_order_id:    paymentResponse.razorpay_order_id,
          razorpay_payment_id:  paymentResponse.razorpay_payment_id,
          razorpay_signature:   paymentResponse.razorpay_signature,
        }),
      });

      const data = await response.json();

      if (data && data.success) {
        // ✅ Backend confirmed payment — safe to unlock
        self.closeCheckout();
        AuthManager.upgradeToPro();

        const method = data.data?.paymentMethod || '';
        const methodLabel = method === 'upi'        ? ' via UPI'
                          : method === 'card'       ? ' via Card'
                          : method === 'netbanking' ? ' via Net Banking'
                          : '';

        App.showToast(
          `🎉 Payment Verified${methodLabel}! Pro activated. ID: ${paymentResponse.razorpay_payment_id}`,
          'success'
        );

        // Sync updated subscription state from backend
        try {
          const meRes = await fetch(`${self.backendUrl}/api/auth/me`, {
            headers: self._getAuthHeaders(),
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.data) AuthManager.setCurrentUser(meData.data, AuthManager.currentUser);
          }
        } catch (_) {}

      } else {
        // ❌ Backend explicitly returned success:false — do NOT unlock
        self.closeCheckout();
        const message = data?.message || 'Payment verification failed. Please contact support.';
        App.showToast(`❌ ${message}`, 'error');
        console.error('[Payment] Backend verify returned failure:', data);
      }
    } catch (networkError) {
      // ❌ Network error during verify — do NOT unlock
      self.closeCheckout();
      App.showToast(
        '⚠️ Network error during payment verification. Your payment may have been received — please contact support with your payment ID: ' +
        paymentResponse.razorpay_payment_id,
        'error'
      );
      console.error('[Payment] Verify network error:', networkError);
    } finally {
      self.resetButtonState();
    }
  },

  /* ── UI helpers ──────────────────────────────────────────────────────── */
  _setButtonLoading: function (label) {
    const payBtn = document.getElementById('rzp-pay-confirm-btn');
    if (!payBtn) return;
    payBtn.disabled   = true;
    payBtn.innerHTML  = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
           style="animation:spin 0.9s linear infinite;vertical-align:middle;margin-right:6px;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>${label}`;
  },

  resetButtonState: function () {
    this.isOpeningCheckout = false;
    const payBtn = document.getElementById('rzp-pay-confirm-btn');
    if (!payBtn) return;
    payBtn.disabled = false;
    const isYearly = this.selectedPlan === 'yearly';
    let btnText = isYearly ? 'Pay with Razorpay (₹299/yr)' : 'Pay with Razorpay (₹29/mo)';
    if (isYearly && this.appliedCoupon) {
      btnText = `Pay with Razorpay (₹${this.appliedCoupon.finalPrice}/yr)`;
    }
    payBtn.innerText = btnText;
  },

  /* ── Developer key override (admin console utility) ─────────────────── */
  setRazorpayKey: function (key) {
    this.razorpayKeyId = key;
    App.showToast('Razorpay Key ID updated for this session.', 'success');
  },
};
