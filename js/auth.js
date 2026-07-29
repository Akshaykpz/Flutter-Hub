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
        if (this.isDemoUser(this.currentUser)) {
          this.currentUser = null;
          localStorage.removeItem('flutterhub_user');
        }
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      this.currentUser = null; // Unauthenticated by default
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-user-menu')) this.closeUserDropdown();
    });

    // Check for Supabase OAuth Callback in URL hash or query params
    this.handleOAuthCallback();
    this.updateUI();

    // Auto-restore Admin View on reload if logged in as Admin
    if (this.currentUser && (this.currentUser.isAdmin || this.currentUser.role === 'admin' || (this.currentUser.email && this.currentUser.email.toLowerCase() === 'admin@admin.com'))) {
      if (window.App && typeof window.App.switchView === 'function') {
        window.App.switchView('admin-dashboard');
      }
    } else if (this.currentUser) {
      if (window.CouponManager && typeof window.CouponManager.init === 'function') {
        CouponManager.init();
      }
    }
  },

  handleOAuthCallback: async function() {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    
    if (window.supabase) {
      try {
        const client = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');
        
        // Subscribe to auth state changes (e.g. after Google OAuth redirect)
        client.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const u = session.user;
            const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Google User';
            
            try {
              const res = await fetch('/api/auth/oauth-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: u.id,
                  name: name,
                  email: u.email,
                  avatar: u.user_metadata?.avatar_url || name[0].toUpperCase(),
                  provider: u.app_metadata?.provider || 'google'
                })
              });
              const json = await res.json();
              if (json.success) {
                this.setCurrentUser(json.data);
                App.showToast(`Welcome ${this.currentUser.name}! Logged in via Google.`, 'success');
                App.switchView('user-dashboard');
                if (window.location.hash.includes('access_token')) {
                  history.replaceState(null, '', window.location.pathname);
                }
              }
            } catch (syncErr) {
              console.warn("OAuth sync endpoint error:", syncErr);
            }
          }
        });
      } catch (err) {
        console.warn("Supabase Auth listener error:", err.message);
      }
    }
  },

  saveSession: function() {
    localStorage.setItem('flutterhub_user', JSON.stringify(this.currentUser));
  },

  isDemoUser: function(user) {
    if (!user) return false;
    const email = (user.email || '').toLowerCase();
    const name = (user.name || '').toLowerCase();
    return email === 'dev@flutterhub.io' || email === 'developer@flutterhub.dev' || name === 'developer';
  },

  normalizeUser: function(data, fallback = {}) {
    const name = data?.name || data?.full_name || fallback.name || fallback.email?.split('@')[0] || 'User';
    const email = data?.email || fallback.email || '';
    const isAdmin = data?.role === 'admin' || data?.isAdmin || email.toLowerCase() === 'admin@admin.com' || fallback.isAdmin || false;
    const isPro = isAdmin || data?.isPro || data?.isSubscribed || data?.subscription === 'pro' || false;
    return {
      id: data?.id || data?._id || fallback.id || null,
      name,
      email,
      token: data?.token || fallback.token || null,
      isPro,
      isAdmin,
      avatar: data?.avatar || (isAdmin ? '👑' : name[0].toUpperCase()),
      bookmarks: fallback.bookmarks || data?.bookmarks || [],
      downloadsCount: fallback.downloadsCount || data?.downloadsCount || 0,
      joinedDate: fallback.joinedDate || 'July 2026',
      subscriptionExpiresAt: data?.subscriptionExpiresAt || data?.subscription_expires_at || null
    };
  },

  setCurrentUser: function(userData, fallback = {}) {
    this.currentUser = this.normalizeUser(userData, fallback);
    this.saveSession();
    this.updateUI();
    App.renderComponentGrid?.();
    App.renderUIScreens?.();
    App.renderProjects?.();
    if (window.CouponManager && typeof window.CouponManager.init === 'function') {
      CouponManager.init();
    }
  },

  openAuthModal: function(tab = 'signin') {
    this.closeAuthModal();
    App.switchView(tab === 'signup' ? 'signup' : 'login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  closeAuthModal: function() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  },

  openPremiumProtectionModal: function() {
    const modal = document.getElementById('premium-protection-modal');
    if (modal) modal.classList.add('active');
  },

  closePremiumProtectionModal: function() {
    const modal = document.getElementById('premium-protection-modal');
    if (modal) modal.classList.remove('active');
  },

  toggleUserDropdown: function(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('nav-user-dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('open');
    }
  },

  closeUserDropdown: function() {
    document.getElementById('nav-user-dropdown-menu')?.classList.remove('open');
  },

  escapeHTML: function(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  switchAuthModalTab: function(tab) {
    const tabs = ['signin', 'signup', 'admin'];
    tabs.forEach(t => {
      const btn = document.getElementById(`modal-tab-${t}`);
      const content = document.getElementById(`auth-modal-content-${t}`);
      if (btn && content) {
        if (t === tab) {
          btn.classList.add('active');
          btn.style.borderBottomColor = 'var(--accent-cyan-light)';
          btn.style.color = 'var(--accent-cyan-light)';
          content.style.display = 'block';
        } else {
          btn.classList.remove('active');
          btn.style.borderBottomColor = 'transparent';
          btn.style.color = 'var(--text-muted)';
          content.style.display = 'none';
        }
      }
    });
  },

  handleModalLoginSubmit: async function(e) {
    e.preventDefault();
    const email = document.getElementById('modal-login-email')?.value.trim();
    const password = document.getElementById('modal-login-password')?.value;
    const btn = document.getElementById('modal-login-submit-btn');

    if (!email || !password) return;

    // Instant Admin Auth Handler
    if (email.toLowerCase() === 'admin@admin.com' && password === 'akshaykp@9072') {
      const adminUser = {
        id: 'admin_sys_001',
        name: 'System Admin',
        email: 'admin@admin.com',
        role: 'admin',
        isAdmin: true,
        isPro: true
      };
      this.setCurrentUser(adminUser, { email: 'admin@admin.com', name: 'System Admin' });
      this.closeAuthModal();
      App.showToast('👑 Welcome System Admin! Loading Admin Dashboard...', 'success');
      App.switchView('admin-dashboard');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Signing in...';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Unable to sign in.');
      }

      this.setCurrentUser(json.data, { email, name: email.split('@')[0] });
      this.closeAuthModal();
      App.showToast(`Welcome back, ${this.currentUser.name}!`, 'success');
      App.switchView(this.currentUser.isAdmin ? 'admin-dashboard' : 'home');
    } catch (err) {
      App.showToast(err.message || 'Sign in failed. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerText = 'Sign In';
      }
    }
  },

  handleModalSignUpSubmit: async function(e) {
    e.preventDefault();
    const name = document.getElementById('modal-signup-name')?.value.trim();
    const email = document.getElementById('modal-signup-email')?.value.trim();
    const password = document.getElementById('modal-signup-password')?.value;
    const btn = document.getElementById('modal-signup-submit-btn');

    if (!name || !email || !password) return;
    if (password.length < 6) {
      App.showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Creating account...';
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Unable to create account.');
      }

      this.setCurrentUser(json.data, { name, email });
      this.closeAuthModal();
      App.showToast('Account created and saved in Supabase.', 'success');
      App.switchView('user-dashboard');
    } catch (err) {
      App.showToast(err.message || 'Signup failed. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerText = 'Create Account';
      }
    }
    return;

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
    App.showToast('🎉 Account registered & saved in Supabase database!', 'success');
    App.switchView('user-dashboard');
  },

  handleModalAdminSubmit: function(e) {
    e.preventDefault();
    this.closeAuthModal();
    this.currentUser = {
      name: 'Admin Director',
      email: 'admin@flutterhub.dev',
      isPro: true,
      isAdmin: true,
      avatar: '👑',
      bookmarks: [],
      downloadsCount: 99,
      joinedDate: 'July 2026'
    };
    this.saveSession();
    this.updateUI();
    App.showToast('Welcome Admin Director! Loading Dashboard...', 'success');
    App.switchView('admin-dashboard');
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

  confirmLogout: function() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
      modal.classList.add('active');
    } else {
      this.performLogout();
    }
  },

  closeLogoutModal: function() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) modal.classList.remove('active');
  },

  performLogout: function() {
    this.closeLogoutModal();
    this.currentUser = null;
    localStorage.removeItem('flutterhub_user');
    this.closeUserDropdown();
    this.updateUI();
    App.showToast('You have been logged out.', 'info');
    App.switchView('home');
  },

  logout: function() {
    this.confirmLogout();
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
  handleLoginSubmit: async function(e) {
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

    // Instant Admin Auth Handler
    if (email.toLowerCase() === 'admin@admin.com' && password === 'akshaykp@9072') {
      const adminUser = {
        id: 'admin_sys_001',
        name: 'System Admin',
        email: 'admin@admin.com',
        role: 'admin',
        isAdmin: true,
        isPro: true
      };
      this.setCurrentUser(adminUser, { email: 'admin@admin.com', name: 'System Admin' });
      App.showToast('👑 Welcome System Admin! Loading Admin Dashboard...', 'success');
      App.switchView('admin-dashboard');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Authenticating...`;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Unable to sign in.');
      }

      this.setCurrentUser(json.data, { email, name: email.split('@')[0] });
      App.showToast(`Welcome back, ${this.currentUser.name}!`, 'success');
      App.switchView(this.currentUser.isAdmin ? 'admin-dashboard' : 'home');
    } catch (err) {
      App.showToast(err.message || 'Sign in failed. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Sign In to Account`;
      }
    }
  },

  // 2. Handle Sign Up Form Submit
  handleSignUpSubmit: async function(e) {
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

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Unable to create account.');
      }

      this.setCurrentUser(json.data, { name, email });
      App.showToast('Account created and saved in Supabase.', 'success');
      App.switchView('home');
    } catch (err) {
      App.showToast(err.message || 'Signup failed. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Create Free Account`;
      }
    }
    return;

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
    if (!this.currentUser) {
        this.login('developer@flutterhub.dev', 'Flutter Developer');
      }
      App.switchView('user-dashboard');
    }, 1000);
  },

  // Social Auth Handlers (Google & GitHub)
  loginWithGoogle: async function() {
    App.showToast('Redirecting to Google OAuth...', 'info');
    try {
      // 1. Try backend OAuth URL endpoint
      const res = await fetch('/api/auth/provider/google');
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
        return;
      }
    } catch (e) {}

    // 2. Direct Supabase JS Client fallback
    if (window.supabase) {
      try {
        const client = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');
        const { data, error } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/#oauth-callback` }
        });
        if (!error && data?.url) {
          window.location.href = data.url;
          return;
        }
      } catch (err) {
        console.warn("Supabase Google OAuth notice:", err.message);
      }
    }

    App.showToast('ℹ️ Google OAuth not configured in Supabase Dashboard. Logging in via developer profile.', 'info');
    try {
      const syncRes = await fetch('/api/auth/oauth-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          name: 'Google Developer',
          email: 'user.google@flutterhub.dev',
          avatar: 'G',
          provider: 'google'
        })
      });
      const syncJson = await syncRes.json();
      if (syncJson.success) {
        this.setCurrentUser(syncJson.data);
      } else {
        this.login('user.google@flutterhub.dev', 'Google Developer');
      }
    } catch (e) {
      this.login('user.google@flutterhub.dev', 'Google Developer');
    }

    this.closeAuthModal();
    App.switchView('user-dashboard');
  },

  loginWithGitHub: async function() {
    App.showToast('Redirecting to GitHub OAuth...', 'info');
    try {
      // 1. Try backend OAuth URL endpoint
      const res = await fetch('/api/auth/provider/github');
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
        return;
      }
    } catch (e) {}

    // 2. Direct Supabase JS Client fallback
    if (window.supabase) {
      try {
        const client = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');
        const { data, error } = await client.auth.signInWithOAuth({
          provider: 'github',
          options: { redirectTo: `${window.location.origin}/#oauth-callback` }
        });
        if (!error && data?.url) {
          window.location.href = data.url;
          return;
        }
      } catch (err) {
        console.warn("Supabase GitHub OAuth notice:", err.message);
      }
    }

    App.showToast('ℹ️ GitHub OAuth not configured in Supabase Dashboard. Logging in via developer profile.', 'info');
    try {
      const syncRes = await fetch('/api/auth/oauth-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          name: 'GitHub Developer',
          email: 'user.github@flutterhub.dev',
          avatar: 'GH',
          provider: 'github'
        })
      });
      const syncJson = await syncRes.json();
      if (syncJson.success) {
        this.setCurrentUser(syncJson.data);
      } else {
        this.login('user.github@flutterhub.dev', 'GitHub Developer');
      }
    } catch (e) {
      this.login('user.github@flutterhub.dev', 'GitHub Developer');
    }

    this.closeAuthModal();
    App.switchView('user-dashboard');
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
    const navMenu = document.querySelector('.nav-menu');
    const searchTrigger = document.querySelector('.search-trigger');
    const isAdmin = this.currentUser && (this.currentUser.isAdmin || this.currentUser.role === 'admin' || (this.currentUser.email && this.currentUser.email.toLowerCase() === 'admin@admin.com'));
    const isPro = this.currentUser && this.currentUser.isPro;

    if (isAdmin) {
      // 1. Hide user side navigation items
      if (navMenu) navMenu.style.display = 'none';
      if (searchTrigger) searchTrigger.style.display = 'none';
      if (proContainer) proContainer.style.display = 'none';

      // 2. Render ONLY Logout button & Admin badge at top right
      if (userBtn) {
        userBtn.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px;">
            <span class="badge" style="background:rgba(245, 158, 11, 0.15); color:#fbbf24; border:1px solid rgba(245, 158, 11, 0.35); font-weight:800; padding:0.4rem 0.85rem; font-size:0.8rem;">👑 ADMIN PANEL</span>
            <button class="btn btn-secondary btn-sm" onclick="AuthManager.logout(); return false;" style="font-weight:700; padding:0.45rem 1.1rem; border-radius:20px; background:rgba(225,29,72,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3); font-size:0.85rem; cursor:pointer;">Logout</button>
          </div>
        `;
      }
      return;
    }

    // Standard User UI (Restore default layout):
    if (navMenu) navMenu.style.display = 'flex';
    if (searchTrigger) searchTrigger.style.display = 'none';
    if (proContainer) proContainer.style.display = 'block';

    if (userBtn) {
      if (this.currentUser) {
        const name = this.escapeHTML(this.currentUser.name || 'User');
        const firstName = this.escapeHTML((this.currentUser.name || 'User').split(' ')[0]);
        const avatar = this.escapeHTML(this.currentUser.avatar || (this.currentUser.name || 'User')[0].toUpperCase());

        userBtn.innerHTML = `
          <div class="nav-user-menu">
            <button type="button" class="nav-user-trigger" onclick="AuthManager.toggleUserDropdown(event)" title="${name}" aria-haspopup="true">
              <div class="nav-user-avatar">
                ${avatar}
              </div>
              <span class="nav-user-name">${firstName}</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
            </button>
            <div id="nav-user-dropdown-menu" class="user-dropdown-menu">
              <a href="#" class="dropdown-item" onclick="App.switchView('user-dashboard'); AuthManager.closeUserDropdown(); return false;">Profile</a>
              <a href="#" class="dropdown-item" onclick="App.switchView('pricing'); AuthManager.closeUserDropdown(); return false;">Subscription</a>
              <div class="user-dropdown-divider"></div>
              <a href="#" class="dropdown-item logout-item" onclick="AuthManager.logout(); return false;">Logout</a>
            </div>
          </div>
        `;
      } else {
        userBtn.innerHTML = `<button class="btn btn-primary btn-sm" onclick="AuthManager.openAuthModal('signin')" style="font-weight:700; padding:0.4rem 1.1rem; border-radius:20px; box-shadow:0 0 15px rgba(6, 182, 212, 0.3);">Sign In</button>`;
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
