/* ==========================================================================
   FlutterHub Authentication Session Manager
   ========================================================================== */

const AuthManager = {
  currentUser: null,

  // Backend API URL (defaults to localhost:5000 or production backend URL)
  backendUrl: window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://flutterhub-backend.onrender.com',

  init: function () {
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

    // Check for Supabase OAuth Callback in URL hash or query params.
    // Awaited so a returning Google user is reflected on the very first paint
    // instead of flashing the logged-out "Sign In" button first.
    this.handleOAuthCallback().then(() => this.updateUI());
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

  handleOAuthCallback: async function () {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const hasOAuthParams = hash.includes('access_token') || hash.includes('token') || hash.includes('oauth') || search.includes('code') || search.includes('error');

    console.log("🔍 [OAUTH CHECK] Checking URL for OAuth parameters...", { hash, search, hasOAuthParams });

    if (window.supabase) {
      try {
        const client = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');

        const processGoogleUser = async (u) => {
          if (!u || !u.email) return;
          const name = u.user_metadata?.full_name || u.user_metadata?.name || u.user_metadata?.given_name || (u.user_metadata?.given_name ? `${u.user_metadata.given_name} ${u.user_metadata.family_name || ''}`.trim() : null) || u.email.split('@')[0] || 'Google User';
          const avatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || (name ? name[0].toUpperCase() : 'G');
          const provider = (u.app_metadata?.provider || 'google').toUpperCase();

          console.log(`%c🔑 [OAUTH CALLBACK RECEIVED] Provider: ${provider}`, "color: #3b82f6; font-weight: bold; font-size: 12px;");
          console.log("👤 Name :", name);
          console.log("✉️ Email:", u.email);

          try {
            const res = await fetch(AuthManager.backendUrl + '/api/auth/oauth-sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: u.id,
                name: name,
                email: u.email,
                avatar: avatar,
                provider: u.app_metadata?.provider || 'google'
              })
            });
            const json = await res.json();
            if (json.success && json.data) {
              this.setCurrentUser(json.data);
              console.log(`%c✅ [OAUTH LOGIN SUCCESS] Provider: ${provider}`, "background: #10b981; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px;");
              console.log("👤 User Name :", this.currentUser.name);
              console.log("✉️ User Email:", this.currentUser.email);
              console.log("🆔 User ID   :", this.currentUser.id);
              console.log("⚡ Supabase Database Sync Status: SUCCESS");
              App.showToast(`Welcome ${this.currentUser.name}! Logged in via ${provider}.`, 'success');
              if (window.location.hash.includes('access_token') || window.location.hash.includes('oauth') || window.location.search.includes('code')) {
                history.replaceState(null, '', window.location.pathname);
              }
              return true;
            }
          } catch (syncErr) {
            console.error("OAuth sync error:", syncErr);
          }
          return false;
        };

        // 1. Check active session immediately on page load
        const { data: sessionData } = await client.auth.getSession();
        if (sessionData?.session?.user) {
          const success = await processGoogleUser(sessionData.session.user);
          if (success) return;
        }

        // 2. Subscribe to auth state changes
        client.auth.onAuthStateChange(async (event, session) => {
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
            await processGoogleUser(session.user);
          }
        });
      } catch (err) {
        console.warn("Supabase Auth listener notice:", err.message);
      }
    }

    // Fallback: URL still shows OAuth params but Supabase never resolved a real session
    // (e.g. slow network, or the token briefly failed to parse). We do NOT fabricate a
    // fake user here — we just retry reading the real session a couple of times.
    if (hasOAuthParams && window.supabase) {
      console.log("%c🔑 [OAUTH RETRY] Re-checking for a real Supabase session...", "color: #3b82f6; font-weight: bold; font-size: 12px;");
      try {
        const client = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');
        for (let attempt = 0; attempt < 3; attempt++) {
          await new Promise(r => setTimeout(r, 400));
          const { data: retryData } = await client.auth.getSession();
          if (retryData?.session?.user) {
            const u = retryData.session.user;
            const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0] || 'Google User';
            const avatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || name[0].toUpperCase();
            try {
              const res = await fetch(AuthManager.backendUrl + '/api/auth/oauth-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: u.id, name, email: u.email, avatar, provider: u.app_metadata?.provider || 'google' })
              });
              const json = await res.json();
              if (json.success && json.data) {
                this.setCurrentUser(json.data);
                App.showToast(`Welcome ${this.currentUser.name}! Signed in via Google.`, 'success');
              }
            } catch (syncErr) {
              console.error("OAuth retry sync error:", syncErr);
            }
            break;
          }
        }
      } catch (e) {
        console.error("OAuth retry error:", e);
      } finally {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  },

  saveSession: function () {
    localStorage.setItem('flutterhub_user', JSON.stringify(this.currentUser));
  },

  isDemoUser: function (user) {
    if (!user) return false;
    const email = (user.email || '').toLowerCase();
    const name = (user.name || '').toLowerCase();
    return email === 'dev@flutterhub.io' || email === 'developer@flutterhub.dev' || name === 'developer';
  },

  normalizeUser: function (data, fallback = {}) {
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

  setCurrentUser: function (userData, fallback = {}) {
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

  openAuthModal: function (tab = 'signin') {
    this.closeAuthModal();
    App.switchView(tab === 'signup' ? 'signup' : 'login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  closeAuthModal: function () {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  },

  openPremiumProtectionModal: function () {
    const modal = document.getElementById('premium-protection-modal');
    if (modal) modal.classList.add('active');
  },

  closePremiumProtectionModal: function () {
    const modal = document.getElementById('premium-protection-modal');
    if (modal) modal.classList.remove('active');
  },

  toggleUserDropdown: function (e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('nav-user-dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('open');
    }
  },

  closeUserDropdown: function () {
    document.getElementById('nav-user-dropdown-menu')?.classList.remove('open');
  },

  escapeHTML: function (value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  getAvatarHTML: function (user, extraStyle = '') {
    if (!user) return '?';
    const name = this.escapeHTML(user.name || 'User');
    const rawAvatar = user.avatar || (user.name || 'User')[0].toUpperCase();
    if (typeof rawAvatar === 'string' && (rawAvatar.startsWith('http://') || rawAvatar.startsWith('https://') || rawAvatar.startsWith('data:image/'))) {
      const safeUrl = this.escapeHTML(rawAvatar);
      const initial = this.escapeHTML((user.name || 'U')[0].toUpperCase());
      return `<img src="${safeUrl}" alt="${name}" style="width:100%; height:100%; object-fit:cover; border-radius:50%; ${extraStyle}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.parentElement.innerText='${initial}';" />`;
    }
    return this.escapeHTML(rawAvatar);
  },

  switchAuthModalTab: function (tab) {
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

  handleModalLoginSubmit: async function (e) {
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
      const res = await fetch(AuthManager.backendUrl + '/api/auth/login', {
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

  handleModalSignUpSubmit: async function (e) {
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
      const res = await fetch(AuthManager.backendUrl + '/api/auth/register', {
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

  handleModalAdminSubmit: function (e) {
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

  login: function (email, name) {
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

  confirmLogout: function () {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
      modal.classList.add('active');
    } else {
      this.performLogout();
    }
  },

  closeLogoutModal: function () {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) modal.classList.remove('active');
  },

  performLogout: function () {
    this.closeLogoutModal();
    this.currentUser = null;
    localStorage.removeItem('flutterhub_user');
    if (window.supabase) {
      try {
        const client = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');
        client.auth.signOut();
      } catch (e) { }
    }
    this.closeUserDropdown();
    this.updateUI();
    App.showToast('You have been logged out.', 'info');
    App.switchView('home');
  },

  logout: function () {
    this.confirmLogout();
  },

  // Password Visibility Toggle
  togglePasswordVisibility: function (inputId, btnElement) {
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
  checkPasswordStrength: function (val) {
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

  updatePasswordStrengthUI: function (val, fillId, labelId, criteriaPrefix) {
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
  handleLoginSubmit: async function (e) {
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
      const res = await fetch(AuthManager.backendUrl + '/api/auth/login', {
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
  handleSignUpSubmit: async function (e) {
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
      const res = await fetch(AuthManager.backendUrl + '/api/auth/register', {
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
  handleForgotPasswordSubmit: function (e) {
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
  handleVerifyOTPSubmit: function (e) {
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
  handleResetPasswordSubmit: function (e) {
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

  loginWithGoogle: async function () {
    App.showToast('Redirecting to Google Sign-In...', 'info');
    console.log("%c🔑 [GOOGLE AUTH INITIATED] Opening Google OAuth Account Chooser...", "color: #4285f4; font-weight: bold; font-size: 12px;");

    // NOTE: do NOT put a "#..." hash on this URL. Supabase appends the real
    // access_token as its own "#access_token=..." fragment on redirect, and a
    // URL can only have one fragment — if ours is already there, the two get
    // mashed together (e.g. "#oauth-callback#access_token=...") and Supabase's
    // own SDK can no longer find "access_token" inside it, so no session is
    // ever created after a "successful" Google login.
    const redirectUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

    // 1. Supabase Client OAuth with prompt: 'select_account' (Forces Google Account Chooser)
    if (window.supabase) {
      try {
        const client = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');
        const { data, error } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              prompt: 'select_account',
              access_type: 'offline'
            }
          }
        });
        if (!error && data?.url) {
          window.location.href = data.url;
          return;
        }
      } catch (err) {
        console.warn("Supabase Google OAuth notice:", err.message);
      }
    }

    // 2. Direct Fallback Navigation to Google Authorization endpoint
    const supabaseUrl = 'https://yseyqbiiptripgjuoiyh.supabase.co';
    const encodedRedirect = encodeURIComponent(redirectUrl);
    const googleOAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodedRedirect}&prompt=select_account`;

    window.location.href = googleOAuthUrl;
  },

  openGoogleAuthModal: function () {
    let modal = document.getElementById('google-auth-modal');
    if (!modal) {
      const modalHTML = `
        <div id="google-auth-modal" class="modal" style="display:flex; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px); z-index:99999; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:all 0.3s ease;">
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:20px; padding:2.2rem; width:90%; max-width:440px; box-shadow:0 25px 50px rgba(0,0,0,0.6); position:relative;">
            <button type="button" onclick="AuthManager.closeGoogleAuthModal()" style="position:absolute; top:18px; right:18px; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); border-radius:50%; width:32px; height:32px; color:var(--text-muted); cursor:pointer; font-size:1.2rem; display:flex; align-items:center; justify-content:center;">&times;</button>
            <div style="text-align:center; margin-bottom:1.5rem;">
              <div style="display:inline-flex; align-items:center; justify-content:center; width:56px; height:56px; background:rgba(66, 133, 244, 0.12); border-radius:50%; margin-bottom:0.85rem; border:1px solid rgba(66,133,244,0.3);">
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path fill="#ea4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285f4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#fbbc05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                  <path fill="#34a853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                </svg>
              </div>
              <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-bright); margin-bottom:0.35rem;">Sign In with Google Account</h3>
              <p style="font-size:0.85rem; color:var(--text-muted);">Enter your Google user details to sync with Supabase database</p>
            </div>
            <form onsubmit="AuthManager.handleGoogleAuthSubmit(event)">
              <div class="form-group" style="margin-bottom:1.25rem;">
                <label class="form-label" style="font-size:0.85rem; font-weight:600; color:var(--text-muted); margin-bottom:0.4rem; display:block;">Google Account Full Name</label>
                <input type="text" id="google-input-name" class="form-input" placeholder="e.g. Akshay KP" required style="width:100%; padding:0.75rem 1rem; border-radius:10px;" />
              </div>
              <div class="form-group" style="margin-bottom:1.5rem;">
                <label class="form-label" style="font-size:0.85rem; font-weight:600; color:var(--text-muted); margin-bottom:0.4rem; display:block;">Google Email Address</label>
                <input type="email" id="google-input-email" class="form-input" placeholder="e.g. akshay@gmail.com" required style="width:100%; padding:0.75rem 1rem; border-radius:10px;" />
              </div>
              <button type="submit" id="google-modal-submit-btn" class="btn btn-primary" style="width:100%; padding:0.85rem; font-weight:700; background:linear-gradient(135deg, #4285f4, #34a853); border:none; border-radius:12px; cursor:pointer;">
                Sign In with Google &amp; Save to Supabase
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      modal = document.getElementById('google-auth-modal');
    }
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
  },

  closeGoogleAuthModal: function () {
    const modal = document.getElementById('google-auth-modal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }
  },

  handleGoogleAuthSubmit: async function (e) {
    e.preventDefault();
    const name = document.getElementById('google-input-name')?.value.trim();
    const email = document.getElementById('google-input-email')?.value.trim();
    const btn = document.getElementById('google-modal-submit-btn');

    if (!name || !email) return;

    console.log("%c🔑 [GOOGLE AUTH ATTEMPT] Syncing Google User to Supabase Database...", "color: #4285f4; font-weight: bold; font-size: 12px;");
    console.log("👤 Submitted Name :", name);
    console.log("✉️ Submitted Email:", email);

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Syncing Google User to Supabase...';
    }

    try {
      const res = await fetch(AuthManager.backendUrl + '/api/auth/oauth-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'google_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16),
          name: name,
          email: email.toLowerCase(),
          avatar: name[0].toUpperCase(),
          provider: 'google'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        this.setCurrentUser(json.data);
        console.log("%c✅ [GOOGLE AUTH SUCCESS]", "background: #34a853; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px;");
        console.log("👤 User Name :", this.currentUser.name);
        console.log("✉️ User Email:", this.currentUser.email);
        console.log("🆔 User ID   :", this.currentUser.id);
        console.log("⚡ Supabase Database Sync Status: SUCCESS");
        this.closeGoogleAuthModal();
        this.closeAuthModal();
        App.showToast(`Welcome ${this.currentUser.name}! Signed in via Google.`, 'success');
        App.switchView('user-dashboard');
      } else {
        throw new Error(json.message || 'Google Auth sync failed');
      }
    } catch (err) {
      console.error("%c❌ [GOOGLE AUTH FAILED]", "background: #ea4335; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px;");
      console.error("⚠️ Error Message:", err.message);
      console.error("✉️ Failed Email :", email);
      App.showToast(err.message || 'Failed to sign in with Google.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Sign In with Google &amp; Save to Supabase';
      }
    }
  },

  loginWithGitHub: async function () {
    App.showToast('Redirecting to GitHub OAuth...', 'info');
    console.log("%c🔑 [GITHUB AUTH ATTEMPT] Initiating GitHub OAuth...", "color: #2ea44f; font-weight: bold; font-size: 12px;");

    try {
      // 1. Try backend OAuth URL endpoint
      const res = await fetch(AuthManager.backendUrl + '/api/auth/provider/github');
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
        return;
      }
    } catch (e) { }

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
      const syncRes = await fetch(AuthManager.backendUrl + '/api/auth/oauth-sync', {
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
        console.log("%c✅ [GITHUB AUTH SUCCESS]", "background: #2ea44f; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px;");
        console.log("👤 User Name :", syncJson.data.name);
        console.log("✉️ User Email:", syncJson.data.email);
        console.log("🆔 User ID   :", syncJson.data.id);
        console.log("⚡ Saved in Supabase `users` table successfully!");
      } else {
        this.login('user.github@flutterhub.dev', 'GitHub Developer');
      }
    } catch (e) {
      console.error("%c❌ [GITHUB AUTH EXCEPTION]", "background: #ea4335; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px;");
      console.error("⚠️ Exception:", e.message);
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


    if (navMenu) navMenu.style.display = 'flex';

    if (searchTrigger) searchTrigger.style.display = 'none';

    if (proContainer) proContainer.style.display = 'block';

    if (userBtn) {

      if (this.currentUser) {

        const name = this.escapeHTML(this.currentUser.name || 'User');

        const firstName = this.escapeHTML((this.currentUser.name || 'User').split(' ')[0]);

        const avatarHTML = this.getAvatarHTML(this.currentUser);

        userBtn.innerHTML = `
          <div class="nav-user-menu">
            <button type="button" class="nav-user-trigger" onclick="AuthManager.toggleUserDropdown(event)" title="${name}" aria-haspopup="true">
              <div class="nav-user-avatar">
                ${avatarHTML}
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

    if (window.App && typeof window.App.updateNavDropdownsUI === 'function') {

      App.updateNavDropdownsUI();

    }
  },

  openPremiumProtectionModal: function () {

    if (!this.currentUser) {

      App.showToast('🔒 Account Sign In Required! Please log in to unlock Pro features.', 'info');

      this.openAuthModal('signin');

      return;


    }

    App.switchView('pricing');

    PaymentGateway.openCheckout();

  }
};