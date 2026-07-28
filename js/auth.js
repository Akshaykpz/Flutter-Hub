/* ==========================================================================
   FlutterHub Authentication Session Manager
   ========================================================================== */

const AuthManager = {
  currentUser: null,

  init: function() {
    const saved = localStorage.getItem('flutterhub_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      // Default initial user session for seamless UX
      this.currentUser = {
        name: 'Akshat Sharma',
        email: 'akshat@flutterhub.dev',
        isPro: false, // Default Free tier, upgradable via Razorpay modal to true!
        avatar: 'A',
        bookmarks: ['comp_01'],
        downloadsCount: 14,
        joinedDate: 'July 2026'
      };
      this.saveSession();
    }
    this.updateUI();
  },

  saveSession: function() {
    localStorage.setItem('flutterhub_user', JSON.stringify(this.currentUser));
  },

  login: function(email, name) {
    this.currentUser = {
      name: name || email.split('@')[0],
      email: email,
      isPro: false,
      avatar: (name || (email.split('@')[0]))[0].toUpperCase(),
      bookmarks: ['comp_btn_01'],
      downloadsCount: 5,
      joinedDate: 'July 2026'
    };
    this.saveSession();
    this.updateUI();
    App.showToast(`Welcome back, ${this.currentUser.name}!`, 'success');
  },

  logout: function() {
    this.currentUser = null;
    localStorage.removeItem('flutterhub_user');
    this.updateUI();
    App.showToast('You have been logged out.', 'info');
    App.switchView('login');
  },

  // Password Visibility Toggle
  togglePasswordVisibility: function(inputId, btnElement) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    if (btnElement) {
      btnElement.innerHTML = isPass
        ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
  },

  // Password Strength Meter Algorithm
  checkPasswordStrength: function(val) {
    let score = 0;
    if (!val) return { score: 0, label: '', color: 'transparent', criteria: { len: false, num: false, upper: false, spec: false } };

    const criteria = {
      len: val.length >= 8,
      num: /\d/.test(val),
      upper: /[A-Z]/.test(val),
      spec: /[^A-Za-z0-9]/.test(val)
    };

    if (criteria.len) score += 25;
    if (criteria.num) score += 25;
    if (criteria.upper) score += 25;
    if (criteria.spec) score += 25;

    let label = 'Weak';
    let color = '#f43f5e';
    if (score >= 75) {
      label = 'Strong';
      color = '#10b981';
    } else if (score >= 50) {
      label = 'Medium';
      color = '#f59e0b';
    }

    return { score, label, color, criteria };
  },

  updatePasswordStrengthUI: function(val, fillId, labelId, criteriaPrefix) {
    const fill = document.getElementById(fillId);
    const label = document.getElementById(labelId);
    if (!fill || !label) return;

    const res = this.checkPasswordStrength(val);
    fill.style.width = res.score + '%';
    fill.style.backgroundColor = res.color;
    label.innerText = val ? res.label : '';
    label.style.color = res.color;

    if (criteriaPrefix) {
      const lenEl = document.getElementById(`${criteriaPrefix}-len`);
      const numEl = document.getElementById(`${criteriaPrefix}-num`);
      const upperEl = document.getElementById(`${criteriaPrefix}-upper`);
      const specEl = document.getElementById(`${criteriaPrefix}-spec`);

      if (lenEl) lenEl.className = `strength-criteria-item ${res.criteria.len ? 'valid' : ''}`;
      if (numEl) numEl.className = `strength-criteria-item ${res.criteria.num ? 'valid' : ''}`;
      if (upperEl) upperEl.className = `strength-criteria-item ${res.criteria.upper ? 'valid' : ''}`;
      if (specEl) specEl.className = `strength-criteria-item ${res.criteria.spec ? 'valid' : ''}`;
    }
  },

  // 1. Handle Login Form Submit
  handleLoginSubmit: function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    const btn = document.getElementById('login-submit-btn');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      App.showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!password || password.length < 6) {
      App.showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Authenticating...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Sign In to Account`;
      }
      this.login(email, email.split('@')[0]);
      App.switchView('user-dashboard');
    }, 1000);
  },

  // 2. Handle Sign Up Form Submit
  handleSignUpSubmit: function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const password = document.getElementById('signup-password')?.value;
    const confirm = document.getElementById('signup-confirm')?.value;
    const btn = document.getElementById('signup-submit-btn');

    if (!name) {
      App.showToast('Please enter your full name.', 'error');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      App.showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!password || password.length < 6) {
      App.showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      App.showToast('Passwords do not match.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Creating Account...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Create Free Account`;
      }
      this.currentUser = {
        name: name,
        email: email,
        isPro: false,
        avatar: name[0].toUpperCase(),
        bookmarks: [],
        downloadsCount: 0,
        joinedDate: 'July 2026'
      };
      this.saveSession();
      this.updateUI();
      App.showToast('Verification code sent to your email!', 'info');
      App.switchView('email-verification');
    }, 1200);
  },

  // 3. Handle Forgot Password Form Submit
  handleForgotPasswordSubmit: function(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email')?.value.trim();
    const btn = document.getElementById('forgot-submit-btn');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      App.showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Sending Reset Link...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Send Reset Code`;
      }
      App.showToast(`Reset code sent to ${email}`, 'success');
      App.switchView('email-verification');
    }, 1000);
  },

  // 4. Handle OTP Code Verification
  handleVerifyOTPSubmit: function(e) {
    e.preventDefault();
    const boxes = document.querySelectorAll('.otp-box');
    let code = '';
    boxes.forEach(b => code += b.value);

    if (code.length < 4) {
      App.showToast('Please enter complete 4-digit verification code.', 'error');
      return;
    }

    const btn = document.getElementById('otp-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Verifying...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Verify & Continue`;
      }
      App.showToast('Email verified successfully! 🎉', 'success');
      App.switchView('user-dashboard');
    }, 1000);
  },

  // 5. Handle Reset Password Form Submit
  handleResetPasswordSubmit: function(e) {
    e.preventDefault();
    const password = document.getElementById('reset-password')?.value;
    const confirm = document.getElementById('reset-confirm')?.value;

    if (!password || password.length < 6) {
      App.showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      App.showToast('Passwords do not match.', 'error');
      return;
    }

    const btn = document.getElementById('reset-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Resetting Password...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Set New Password`;
      }
      App.showToast('Password reset successful! Welcome to Dashboard.', 'success');
      if (!this.currentUser) {
        this.login('developer@flutterhub.dev', 'Flutter Developer');
      }
      App.switchView('user-dashboard');
    }, 1000);
  },

  // Social Auth Handlers
  loginWithGoogle: function() {
    App.showToast('Connecting to Google OAuth...', 'info');
    setTimeout(() => {
      this.login('akshat.google@flutterhub.dev', 'Akshat Google');
      App.switchView('user-dashboard');
    }, 800);
  },

  loginWithGitHub: function() {
    App.showToast('Connecting to GitHub OAuth...', 'info');
    setTimeout(() => {
      this.login('akshat.github@flutterhub.dev', 'Akshat GitHub');
      App.switchView('user-dashboard');
    }, 800);
  },

  upgradeToPro: function () {
    if (!this.currentUser) {
      this.login('user@flutterhub.dev', 'Flutter Developer');
    }
    this.currentUser.isPro = true;
    this.saveSession();
    this.updateUI();
    App.renderComponentGrid();
    App.renderUIScreens();
    App.renderProjects();
    App.showToast('🎉 Congratulations! You are now a FlutterHub Pro member!', 'success');
  },

  toggleBookmark: function (id) {
    if (!this.currentUser) return;
    const idx = this.currentUser.bookmarks.indexOf(id);
    if (idx > -1) {
      this.currentUser.bookmarks.splice(idx, 1);
      App.showToast('Removed from Bookmarks', 'info');
    } else {
      this.currentUser.bookmarks.push(id);
      App.showToast('Saved to Bookmarks! ❤️', 'success');
    }
    this.saveSession();
  },

  updateUI: function () {
    const userBtn = document.getElementById('nav-user-btn');
    const proContainer = document.getElementById('nav-pro-container');
    const heroProBtn = document.getElementById('hero-get-pro-btn');
    const isPro = this.currentUser && this.currentUser.isPro;

    if (userBtn) {
      if (this.currentUser) {
        userBtn.innerHTML = `
          <div style="display:flex; align-items:center; gap:6px; background:var(--bg-tertiary); padding:3px 8px 3px 4px; border-radius:20px; border:1px solid var(--border-color);" title="${this.currentUser.name}">
            <div style="width:28px; height:28px; border-radius:50%; background:var(--grad-flutter); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">
              ${this.currentUser.avatar}
            </div>
            <span style="font-size:0.8rem; font-weight:600; color:var(--text-bright);">${this.currentUser.name.split(' ')[0]}</span>
          </div>
        `;
      } else {
        userBtn.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="App.switchView('login')">Sign In</button>`;
      }
    }

    if (proContainer) {
      if (isPro) {
        proContainer.innerHTML = `<span class="badge badge-pro" style="padding:0.35rem 0.75rem; font-size:0.75rem;">✨ PRO ACTIVE</span>`;
      } else {
        proContainer.innerHTML = `<button id="nav-get-pro-btn" class="btn btn-premium btn-sm" onclick="PaymentGateway.openCheckout()">Get Premium ₹29/mo</button>`;
      }
    }

    if (heroProBtn) {
      if (isPro) {
        heroProBtn.style.display = 'none';
      } else {
        heroProBtn.style.display = 'inline-flex';
      }
    }

    const pricingProBtn = document.getElementById('pricing-pro-btn');
    if (pricingProBtn) {
      if (isPro) {
        pricingProBtn.innerHTML = '✓ Pro Member Active';
        pricingProBtn.className = 'btn btn-secondary';
        pricingProBtn.onclick = () => App.switchView('user-dashboard');
      } else {
        pricingProBtn.innerHTML = 'Get Pro Access (₹29/mo)';
        pricingProBtn.className = 'btn btn-premium';
        pricingProBtn.onclick = () => PaymentGateway.openCheckout();
      }
    }
  }
};

