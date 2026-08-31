/* ==========================================================================
   FlutterHub — Contact / Inquiry Form
   ─────────────────────────────────────────────────────────────────────────
   Collects name, email, purpose, company, phone (and optional message),
   saves it to the backend (Supabase), then shows a confirmation message.
   ========================================================================== */

const ContactManager = {
  backendUrl: ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : window.location.origin,

  openContactModal() {
    this.resetForm();
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.add('active');
    const nameEl = document.getElementById('contact-name');
    if (nameEl) setTimeout(() => nameEl.focus(), 120);
  },

  closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.remove('active');
  },

  _esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  resetForm() {
    const form = document.getElementById('contact-form-view');
    const success = document.getElementById('contact-success-view');
    if (form) form.style.display = '';
    if (success) success.style.display = 'none';

    const err = document.getElementById('contact-form-error');
    if (err) { err.style.display = 'none'; err.innerHTML = ''; }

    const btn = document.getElementById('contact-submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = 'Send Message ↗';
    }

    ['contact-name', 'contact-email', 'contact-purpose',
     'contact-company', 'contact-phone', 'contact-message'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  },

  _showError(message) {
    const err = document.getElementById('contact-form-error');
    if (!err) return;
    err.innerHTML = '⚠️ ' + this._esc(message);
    err.style.display = 'block';
  },

  _setLoading(loading) {
    const btn = document.getElementById('contact-submit-btn');
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
      ? '<span style="display:inline-flex;align-items:center;gap:6px;">Sending…</span>'
      : 'Send Message ↗';
  },

  async submitContact(event) {
    if (event) event.preventDefault();

    const name    = (document.getElementById('contact-name') || {}).value || '';
    const email   = (document.getElementById('contact-email') || {}).value || '';
    const purpose = (document.getElementById('contact-purpose') || {}).value || '';
    const company = (document.getElementById('contact-company') || {}).value || '';
    const phone   = (document.getElementById('contact-phone') || {}).value || '';
    const message = (document.getElementById('contact-message') || {}).value || '';

    // Client-side validation
    if (!name.trim()) { this._showError('Please enter your name.'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      this._showError('Please enter a valid email address.');
      return;
    }
    if (!purpose) { this._showError('Please select the purpose of your inquiry.'); return; }

    this._setLoading(true);

    try {
      const res = await fetch(`${this.backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          purpose,
          company_name: company.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Show success view with the server-confirmed message
        const successMsg = document.getElementById('contact-success-message');
        if (successMsg) successMsg.textContent = data.message ||
          "Thanks for reaching out — we've received your inquiry and will respond within one business day.";
        const form = document.getElementById('contact-form-view');
        const success = document.getElementById('contact-success-view');
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'block';

        if (window.App && App.showToast) {
          App.showToast('✅ Inquiry sent successfully!', 'success');
        }
      } else {
        this._showError(data.message || 'Something went wrong. Please try again.');
        if (window.App && App.showToast) {
          App.showToast('❌ ' + (data.message || 'Could not send your inquiry.'), 'error');
        }
      }
    } catch (err) {
      console.error('[Contact] Error:', err);
      this._showError("We couldn't reach the server right now. Please check your connection and try again.");
      if (window.App && App.showToast) {
        App.showToast('⚠️ Network error. Please try again.', 'error');
      }
    } finally {
      this._setLoading(false);
    }
  },
};
