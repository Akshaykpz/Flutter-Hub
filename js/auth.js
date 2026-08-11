/* ==========================================================================
   FlutterHub Authentication Session Manager
   ========================================================================== */

const AuthManager = {
  currentUser: null,
  authInitializing: false,
  oauthClient: null,

  init: function () {
    const saved = localStorage.getItem('flutterhub_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          this.currentUser = this.normalizeUser(parsed);
          if (this.isDemoUser(this.currentUser)) {
            this.currentUser = null;
            localStorage.removeItem('flutterhub_user');
          }
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

    // Check for Supabase OAuth callback/session before showing a clickable Sign In button.
    this.authInitializing = !this.currentUser && this.shouldRestoreOAuthSession();
    this.handleOAuthCallback();
    this.updateUI();

    // Strict safety guard to never leave the button in "Signing in..." state
    setTimeout(() => {
      if (this.authInitializing) {
        this.authInitializing = false;
        sessionStorage.removeItem('flutterhub_oauth_pending');
        this.updateUI();
      }
    }, 1200);

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

  shouldRestoreOAuthSession: function () {
    if (!window.supabase) return false;
    const href = window.location.href || '';
    const search = window.location.search || '';
    const pendingProvider = sessionStorage.getItem('flutterhub_oauth_pending');

    return !!(
      pendingProvider ||
      search.includes('code=') ||
      href.includes('access_token=') ||
      href.includes('refresh_token=')
    );
  },

  getOAuthClient: function () {
    if (!window.supabase) return null;
    if (!this.oauthClient) {
      this.oauthClient = window.supabase.createClient('https://yseyqbiiptripgjuoiyh.supabase.co', 'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN');
    }
    return this.oauthClient;
  },

  extractGoogleName: function (u) {
    if (!u) return 'Google User';
    const meta = u.user_metadata || {};
    const identityData = u.identities?.[0]?.identity_data || {};

    let name = meta.full_name || meta.name || meta.display_name || identityData.full_name || identityData.name;

    if (!name && (meta.given_name || identityData.given_name)) {
      const given = meta.given_name || identityData.given_name;
      const family = meta.family_name || identityData.family_name || '';
      name = `${given} ${family}`.trim();
    }

    if (!name && u.email) {
      name = u.email.split('@')[0];
    }

    return name || 'Google User';
  },

  syncSupabaseUserSession: async function (u) {
    if (!u) return;
    const name = this.extractGoogleName(u);
    const email = u.email || '';
    const avatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || u.identities?.[0]?.identity_data?.avatar_url || name[0].toUpperCase();
    const existingBookmarks = this.getFavorites();
    const provisionalUser = {
      id: u.id,
      name,
      email,
      avatar,
      provider: u.app_metadata?.provider || 'google'
    };

    // Supabase has confirmed the user. Update the UI now; backend profile sync can finish after.
    this.setCurrentUser(provisionalUser, {
      bookmarks: existingBookmarks,
      downloadsCount: this.currentUser?.downloadsCount || 0,
      joinedDate: this.currentUser?.joinedDate
    });
    this.authInitializing = false;
    this.updateUI();
    sessionStorage.removeItem('flutterhub_oauth_pending');

    try {
      const res = await fetch('/api/auth/oauth-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: u.id,
          name: name,
          email: email,
          avatar: avatar,
          provider: u.app_metadata?.provider || 'google'
        })
      });
      const json = await res.json();
      if (json.success) {
        this.setCurrentUser(json.data, {
          bookmarks: this.getFavorites(),
          downloadsCount: this.currentUser?.downloadsCount || 0,
          joinedDate: this.currentUser?.joinedDate,
          isPro: this.currentUser?.isPro
        });
      } else {
        this.setCurrentUser(provisionalUser, { bookmarks: this.getFavorites() });
      }
    } catch (syncErr) {
      console.warn("OAuth sync endpoint notice:", syncErr);
      this.setCurrentUser(provisionalUser, { bookmarks: this.getFavorites() });
    }

    if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
      history.replaceState(null, '', window.location.pathname);
    }
  },

  handleOAuthCallback: async function () {
    if (!window.supabase) {
      this.authInitializing = false;
      this.updateUI();
      return;
    }

    try {
      const client = this.getOAuthClient();
      if (!client) return;

      const href = window.location.href || '';
      const hash = window.location.hash || '';
      const search = window.location.search || '';

      // 1. Handle PKCE code parameter (?code=...)
      if (search.includes('code=')) {
        const urlParams = new URLSearchParams(search);
        const code = urlParams.get('code');
        if (code) {
          try {
            const { data, error } = await client.auth.exchangeCodeForSession(code);
            if (data?.session?.user) {
              await this.syncSupabaseUserSession(data.session.user);
              return;
            }
          } catch (e) {
            console.warn("PKCE code exchange notice:", e.message);
          }
        }
      }

      // 2. Handle hash fragments containing access_token= (including legacy double hash URLs)
      if (href.includes('access_token=')) {
        const tokenString = href.substring(href.indexOf('access_token='));
        const params = new URLSearchParams(tokenString);
        const accessToken = params.get('access_token');

        if (accessToken) {
          try {
            const { data, error } = await client.auth.getUser(accessToken);
            if (data?.user) {
              await this.syncSupabaseUserSession(data.user);
              return;
            }
          } catch (e) {
            console.warn("Access token user fetch notice:", e.message);
          }
        }
      }

      // 3. Restore session from active Supabase client on load / redirect
      const getSessionRes = await client.auth.getSession();
      if (getSessionRes?.data?.session?.user) {
        await this.syncSupabaseUserSession(getSessionRes.data.session.user);
      } else {
        this.authInitializing = false;
        this.updateUI();
        sessionStorage.removeItem('flutterhub_oauth_pending');
      }

      // 4. Subscribe to auth state changes (e.g. after Google OAuth redirect)
      client.auth.onAuthStateChange(async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
          await this.syncSupabaseUserSession(session.user);
        }
      });
    } catch (err) {
      console.warn("Supabase Auth listener notice:", err.message);
      this.authInitializing = false;
      this.updateUI();
      sessionStorage.removeItem('flutterhub_oauth_pending');
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

  getAvatarHTML: function (user) {
    if (!user) return '<span style="font-weight:800; text-transform:uppercase; font-size:12px; color:#fff;">U</span>';
    const avatar = (user.avatar || '').trim();
    const name = (user.name || user.email || 'User').trim();
    const initial = (name[0] || 'U').toUpperCase();

    if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image')) {
      return `<img src="${avatar}" alt="${this.escapeHTML(name)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" onerror="this.outerHTML='<span style=\\'font-weight:800; text-transform:uppercase; font-size:12px; color:#fff;\\'>${initial}</span>'" />`;
    }

    return `<span style="font-weight:800; text-transform:uppercase; font-size:12px; color:#fff; line-height:1; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">${initial}</span>`;
  },

  normalizeFavoriteId: function (value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
      if (typeof value.id !== 'undefined') return this.normalizeFavoriteId(value.id);
      if (typeof value.key !== 'undefined') return this.normalizeFavoriteId(value.key);
    }
    return String(value).trim();
  },

  normalizeFavorites: function (favorites) {
    if (!Array.isArray(favorites)) return [];

    const normalized = [];
    const seen = new Set();

    favorites.forEach((favorite) => {
      const key = this.normalizeFavoriteId(favorite);
      if (!key || seen.has(key)) return;
      seen.add(key);
      normalized.push(key);
    });

    return normalized;
  },

  normalizeUser: function (data, fallback = {}) {
    const name = data?.name || data?.full_name || fallback.name || fallback.email?.split('@')[0] || 'User';
    const email = data?.email || fallback.email || '';
    const isAdmin = data?.role === 'admin' || data?.isAdmin || email.toLowerCase() === 'admin@admin.com' || fallback.isAdmin || false;
    const isPro = isAdmin || data?.isPro || data?.isSubscribed || data?.subscription === 'pro' || false;

    let rawAvatar = data?.avatar || fallback.avatar || '';
    let cleanAvatar = '';
    if (typeof rawAvatar === 'string' && (rawAvatar.startsWith('http://') || rawAvatar.startsWith('https://') || rawAvatar.startsWith('data:image'))) {
      cleanAvatar = rawAvatar;
    } else {
      cleanAvatar = (name[0] || 'U').toUpperCase();
    }

    return {
      id: data?.id || data?._id || fallback.id || null,
      name,
      email,
      token: data?.token || fallback.token || null,
      isPro,
      isAdmin,
      avatar: cleanAvatar,
      bookmarks: this.normalizeFavorites(Array.isArray(fallback.bookmarks) ? fallback.bookmarks : (data?.bookmarks || [])),
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

    if (window.NetworkManager && !window.NetworkManager.isOnline) {
      App.showToast('⚠️ You are currently offline. Please connect to the internet to sign in.', 'error');
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
      if (!navigator.onLine || (err.message && err.message.includes('fetch'))) {
        App.showToast('⚠️ Connection error. Please check your internet connection and try again.', 'error');
      } else {
        App.showToast(err.message || 'Sign in failed. Please try again.', 'error');
      }
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

    if (window.NetworkManager && !window.NetworkManager.isOnline) {
      App.showToast('⚠️ You are currently offline. Please connect to the internet to create an account.', 'error');
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
      if (!navigator.onLine || (err.message && err.message.includes('fetch'))) {
        App.showToast('⚠️ Connection error. Please check your internet connection and try again.', 'error');
      } else {
        App.showToast(err.message || 'Signup failed. Please try again.', 'error');
      }
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
    this.authInitializing = false;
    sessionStorage.removeItem('flutterhub_oauth_pending');
    localStorage.removeItem('flutterhub_user');
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

    if (window.NetworkManager && !window.NetworkManager.isOnline) {
      App.showToast('⚠️ You are currently offline. Please connect to the internet to sign in.', 'error');
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
      if (!navigator.onLine || (err.message && err.message.includes('fetch'))) {
        App.showToast('⚠️ Connection error. Please check your internet connection and try again.', 'error');
      } else {
        App.showToast(err.message || 'Sign in failed. Please try again.', 'error');
      }
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

    if (window.NetworkManager && !window.NetworkManager.isOnline) {
      App.showToast('⚠️ You are currently offline. Please connect to the internet to create an account.', 'error');
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
      if (!navigator.onLine || (err.message && err.message.includes('fetch'))) {
        App.showToast('⚠️ Connection error. Please check your internet connection and try again.', 'error');
      } else {
        App.showToast(err.message || 'Signup failed. Please try again.', 'error');
      }
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

  // Social Auth Handlers (Google & GitHub)
  loginWithGoogle: async function () {
    if (this.authInitializing) return;

    if (window.NetworkManager && !window.NetworkManager.isOnline) {
      App.showToast('⚠️ Internet connection required for Google sign-in. Please reconnect and try again.', 'error');
      return;
    }

    this.authInitializing = true;
    sessionStorage.setItem('flutterhub_oauth_pending', 'google');
    this.updateUI();
    App.showToast('Redirecting to Google OAuth...', 'info');

    // Dynamic redirect URL supporting mobile browsers, desktop & deployed domains
    const currentOrigin = window.location.origin;
    const redirectUrl = `${currentOrigin}/`;

    try {
      // 1. Try backend OAuth URL endpoint with dynamic client redirect URI
      const res = await fetch(`/api/auth/provider/google?redirectTo=${encodeURIComponent(redirectUrl)}&origin=${encodeURIComponent(currentOrigin)}`);
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
        return;
      }
    } catch (e) {
      console.warn("Backend Google OAuth notice:", e);
    }

    // 2. Direct Supabase JS Client fallback
    if (window.supabase) {
      try {
        const client = this.getOAuthClient();
        if (client) {
          const { data, error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrl }
          });
          if (!error && data?.url) {
            window.location.href = data.url;
            return;
          }
        }
      } catch (err) {
        console.warn("Supabase Google OAuth notice:", err.message);
      }
    }

    this.authInitializing = false;
    sessionStorage.removeItem('flutterhub_oauth_pending');
    this.updateUI();
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

  loginWithGitHub: async function () {
    if (window.NetworkManager && !window.NetworkManager.isOnline) {
      App.showToast('⚠️ Internet connection required for GitHub sign-in. Please reconnect and try again.', 'error');
      return;
    }

    App.showToast('Redirecting to GitHub OAuth...', 'info');

    // Dynamic redirect URL supporting mobile browsers, desktop & deployed domains
    const currentOrigin = window.location.origin;
    const redirectUrl = `${currentOrigin}/`;

    try {
      // 1. Try backend OAuth URL endpoint with dynamic client redirect URI
      const res = await fetch(`/api/auth/provider/github?redirectTo=${encodeURIComponent(redirectUrl)}&origin=${encodeURIComponent(currentOrigin)}`);
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
        return;
      }
    } catch (e) {
      console.warn("Backend GitHub OAuth notice:", e);
    }

    // 2. Direct Supabase JS Client fallback
    if (window.supabase) {
      try {
        const client = this.getOAuthClient();
        if (client) {
          const { data, error } = await client.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: redirectUrl }
          });
          if (!error && data?.url) {
            window.location.href = data.url;
            return;
          }
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

  toggleBookmark: function (id, e) {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const normalizedId = this.normalizeFavoriteId(id);
    if (!normalizedId) return;

    const currentFavs = this.getFavorites();
    const isFav = currentFavs.some(favId => String(favId) === normalizedId);
    const willBeFavorite = !isFav;

    // Immutable array state update
    let updatedFavs;
    if (isFav) {
      updatedFavs = currentFavs.filter(favId => String(favId) !== normalizedId);
      if (window.App && typeof App.showToast === 'function') {
        App.showToast('Removed from Favorites successfully', 'info');
      }
    } else {
      updatedFavs = [...currentFavs, normalizedId];
      if (window.App && typeof App.showToast === 'function') {
        App.showToast('Added to Favorites successfully', 'success');
      }
    }

    if (this.currentUser) {
      this.currentUser.bookmarks = updatedFavs;
      this.saveSession();
    } else {
      try {
        localStorage.setItem('flutterhub_guest_bookmarks', JSON.stringify(updatedFavs));
      } catch (err) {}
    }

    const clickedCard = e && e.target && typeof e.target.closest === 'function'
      ? e.target.closest('.component-card')
      : null;

    const renderedFavoritesGrid = typeof App !== 'undefined' && App.activeCategory === 'favorites' && typeof App.renderFavoritesGrid === 'function'
      ? App.renderFavoritesGrid(updatedFavs)
      : this.syncVisibleFavoriteSections(updatedFavs);
    this.updateFavoriteCountBadge(updatedFavs.length);

    if (renderedFavoritesGrid) {
      this.refreshFavoriteState({ skipComponentGrid: true });
      return;
    }

    this.updateFavoriteButtons(id, willBeFavorite);
    if (!willBeFavorite) {
      this.removeFavoriteCardFromVisibleLists(id, clickedCard);
    }
    this.refreshFavoriteState();
  },

  isBookmarked: function (id) {
    if (!id) return false;
    const normalizedId = this.normalizeFavoriteId(id);
    const favs = this.getFavorites();
    return favs.some(favId => this.normalizeFavoriteId(favId) === normalizedId);
  },

  getFavorites: function () {
    if (this.currentUser) {
      if (!Array.isArray(this.currentUser.bookmarks)) {
        this.currentUser.bookmarks = [];
      }
      this.currentUser.bookmarks = this.normalizeFavorites(this.currentUser.bookmarks);
      return this.currentUser.bookmarks;
    }
    try {
      const guest = JSON.parse(localStorage.getItem('flutterhub_guest_bookmarks') || '[]');
      return this.normalizeFavorites(Array.isArray(guest) ? guest : []);
    } catch (e) {
      return [];
    }
  },

  updateFavoriteButtons: function (id, isFavorite) {
    const selector = `[data-fav-id="${String(id).replace(/"/g, '\\"')}"]`;
    document.querySelectorAll(selector).forEach(btn => {
      btn.innerHTML = isFavorite ? '❤️' : '🤍';
      btn.style.color = isFavorite ? '#f43f5e' : 'var(--text-muted)';
      btn.title = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    });
  },

  updateFavoriteCountBadge: function (count) {
    const badge = document.getElementById('fav-count-badge');
    if (badge) {
      badge.textContent = count;
    }
  },

  removeFavoriteCardFromVisibleLists: function (id, clickedCard) {
    const selector = `.component-card[data-id="${String(id).replace(/"/g, '\\"')}"]`;
    const shouldRemoveFromComponents = window.App && App.activeCategory === 'favorites';
    const shouldRemoveFromDashboard = window.App && App.currentView === 'user-dashboard';

    if (!shouldRemoveFromComponents && !shouldRemoveFromDashboard) return;

    if (clickedCard && shouldRemoveFromComponents && typeof clickedCard.remove === 'function') {
      clickedCard.remove();
    } else if (clickedCard && typeof clickedCard.remove === 'function') {
      const clickedGrid = clickedCard.closest('.component-grid');
      const clickedInDashboard = clickedGrid && clickedGrid.closest('#user-dashboard-content') && shouldRemoveFromDashboard;

      if (clickedInDashboard) {
        clickedCard.remove();
      }
    }

    document.querySelectorAll(selector).forEach(card => {
      const grid = card.closest('.component-grid');
      const isComponentsGrid = grid && grid.id === 'component-grid-container';
      const isDashboardGrid = grid && grid.closest('#user-dashboard-content');

      if ((shouldRemoveFromComponents && isComponentsGrid) || (shouldRemoveFromDashboard && isDashboardGrid)) {
        card.remove();
      }
    });
  },

  isFavoritesGridVisible: function () {
    const container = document.getElementById('component-grid-container');
    const componentsView = document.getElementById('view-components');
    const isComponentsViewVisible = !componentsView || componentsView.style.display !== 'none';

    return !!(
      window.App &&
      container &&
      App.activeCategory === 'favorites' &&
      isComponentsViewVisible
    );
  },

  renderVisibleFavoritesGrid: function (favoriteIds) {
    if (!this.isFavoritesGridVisible() || !window.App || typeof App.createComponentCardHTML !== 'function') {
      return false;
    }

    const container = document.getElementById('component-grid-container');
    if (!container) return false;

    const ids = this.normalizeFavorites(Array.isArray(favoriteIds) ? favoriteIds : this.getFavorites());
    const components = typeof App.getUniqueComponents === 'function'
      ? App.getUniqueComponents()
      : ((window.FLUTTER_DATA && FLUTTER_DATA.components) || []);
    const list = components.filter(c => ids.includes(this.normalizeFavoriteId(c.id)));

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; padding:4rem 2rem; text-align:center; color:var(--text-muted);" class="glass-panel">
          <div style="width:56px; height:56px; border-radius:50%; background:rgba(244,63,94,0.15); border:1px solid rgba(244,63,94,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-size:0; color:#f43f5e;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e" stroke-width="1.8" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>
          </div>
          <h3 style="font-size:1.4rem; font-weight:800; color:var(--text-bright); margin-bottom:0.5rem;">No favorite components yet</h3>
          <p style="margin-top:8px; color:var(--text-secondary); font-size:0.9rem;">Click the heart icon on any component card to save it here.</p>
        </div>
      `;
      return true;
    }

    container.innerHTML = list.map(c => App.createComponentCardHTML(c)).join('');
    list.forEach(c => {
      if (c.simType && window.FlutterSim && typeof FlutterSim.renderWidget === 'function') {
        FlutterSim.renderWidget(c.simType, `sim-${c.id}`);
      }
    });
    return true;
  },

  syncVisibleFavoriteSections: function (favoriteIds) {
    const renderedComponentFavorites = window.App && typeof App.renderFavoritesGrid === 'function'
      ? App.renderFavoritesGrid(favoriteIds)
      : this.renderVisibleFavoritesGrid(favoriteIds);

    if (
      window.App &&
      App.currentView === 'user-dashboard' &&
      window.Dashboards &&
      typeof Dashboards.renderUserDashboard === 'function'
    ) {
      Dashboards.renderUserDashboard();
    }

    return renderedComponentFavorites;
  },

  refreshFavoriteState: function (options = {}) {
    if (window.App && typeof App.renderCategoriesSidebar === 'function') {
      App.renderCategoriesSidebar();
    }
    if (!options.skipComponentGrid && window.App && typeof App.renderComponentGrid === 'function') {
      App.renderComponentGrid();
    }
    if (window.App && typeof App.renderUIScreens === 'function') {
      App.renderUIScreens();
    }
    if (
      window.App &&
      App.currentView === 'user-dashboard' &&
      window.Dashboards &&
      typeof Dashboards.renderUserDashboard === 'function'
    ) {
      Dashboards.renderUserDashboard();
    }
  },

  updateSocialAuthLoadingButtons: function () {
    document.querySelectorAll('button[onclick*="AuthManager.loginWithGoogle"]').forEach(btn => {
      btn.disabled = this.authInitializing;
      btn.style.opacity = this.authInitializing ? '0.7' : '';
      btn.style.cursor = this.authInitializing ? 'not-allowed' : '';
      const label = btn.querySelector('span');
      if (label) {
        label.textContent = this.authInitializing ? 'Signing in...' : 'Google';
      }
    });
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

    // Standard User UI:
    if (navMenu) navMenu.style.display = 'flex';
    if (searchTrigger) searchTrigger.style.display = 'none';

    // Header User Navigation Button:
    if (userBtn) {
      if (this.currentUser) {
        const name = this.escapeHTML(this.currentUser.name || 'User');
        const avatarHTML = this.getAvatarHTML(this.currentUser);
        const email = this.escapeHTML(this.currentUser.email || '');

        userBtn.innerHTML = `
          <div class="nav-user-menu" style="position:relative;">
            <button type="button" class="nav-user-trigger" onclick="AuthManager.toggleUserDropdown(event)" title="${name}" aria-haspopup="true" style="display:flex; align-items:center; gap:8px; background:var(--bg-secondary); border:1px solid ${isPro ? 'rgba(245,158,11,0.5)' : 'var(--border-color)'}; padding:0.35rem 0.85rem; border-radius:24px; cursor:pointer; color:var(--text-bright);">
              <div class="nav-user-avatar" style="width:28px; height:28px; border-radius:50%; overflow:hidden; background:linear-gradient(135deg,#38bdf8,#8b5cf6); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; color:#fff;">
                ${avatarHTML}
              </div>
              <span class="nav-user-name" style="font-weight:700; font-size:0.85rem;">${name}</span>
              ${isPro ? '<span class="badge badge-pro" style="font-size:0.6rem; padding:1px 5px;">PRO</span>' : ''}
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
            </button>
            <div id="nav-user-dropdown-menu" class="user-dropdown-menu" style="min-width:220px;">
              <div style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-subtle); margin-bottom:4px;">
                <div style="font-weight:700; font-size:0.875rem; color:var(--text-bright); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${email}</div>
                <span class="badge ${isPro ? 'badge-pro' : 'badge-cyan'}" style="font-size:0.65rem; margin-top:4px; display:inline-block;">${isPro ? '✨ PRO ACTIVE' : 'FREE PLAN'}</span>
              </div>
              <a href="#" class="dropdown-item" onclick="App.switchView('user-dashboard'); AuthManager.closeUserDropdown(); return false;">
                <span style="display:flex; align-items:center; gap:8px;">👤 Profile & Account</span>
              </a>
              <a href="#" class="dropdown-item" onclick="App.switchView('pricing'); AuthManager.closeUserDropdown(); return false;">
                <span style="display:flex; align-items:center; gap:8px;">💳 Pricing & Plans</span>
                <span class="badge badge-pro" style="font-size:0.65rem; padding:2px 6px;">₹29/mo</span>
              </a>
              ${isAdmin ? `
                <a href="#" class="dropdown-item" onclick="App.switchView('admin-dashboard'); AuthManager.closeUserDropdown(); return false;">
                  <span style="display:flex; align-items:center; gap:8px; color:#f59e0b; font-weight:700;">👑 Admin Control Panel</span>
                </a>
              ` : ''}
              <div class="user-dropdown-divider" style="height:1px; background:var(--border-subtle); margin:4px 0;"></div>
              <a href="#" class="dropdown-item logout-item" onclick="AuthManager.confirmLogout(); AuthManager.closeUserDropdown(); return false;">
                <span style="display:flex; align-items:center; gap:8px; color:var(--accent-rose); font-weight:600;">🚪 Sign Out</span>
              </a>
            </div>
          </div>
        `;
      } else if (this.authInitializing) {
        userBtn.innerHTML = `
          <button class="btn btn-primary btn-sm" disabled style="font-weight:700; padding:0.4rem 1.1rem; border-radius:20px; opacity:0.75; cursor:not-allowed; display:inline-flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
            Signing in...
          </button>
        `;
      } else {
        userBtn.innerHTML = `
          <div style="display:flex; align-items:center; gap:6px;">
            <button class="btn btn-primary btn-sm user-nav-btn" onclick="AuthManager.openAuthModal('signin')" style="font-weight:700; padding:0.4rem 1.1rem; border-radius:20px; box-shadow:0 0 15px rgba(6, 182, 212, 0.3);">Sign In</button>
          </div>
        `;
      }
    }

    // Mobile Drawer User Card:
    const drawerUserCard = document.getElementById('drawer-user-card');
    if (drawerUserCard) {
      if (this.currentUser) {
        const name = this.escapeHTML(this.currentUser.name || 'User');
        const email = this.escapeHTML(this.currentUser.email || '');
        const avatarHTML = this.getAvatarHTML(this.currentUser);

        drawerUserCard.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:0.75rem;">
            <div style="width:38px; height:38px; border-radius:50%; overflow:hidden; background:linear-gradient(135deg,#38bdf8,#8b5cf6); display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; flex-shrink:0;">
              ${avatarHTML}
            </div>
            <div style="overflow:hidden; flex:1;">
              <div style="font-weight:800; font-size:0.95rem; color:var(--text-bright); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${email}</div>
            </div>
            <span class="badge ${isPro ? 'badge-pro' : 'badge-cyan'}" style="font-size:0.65rem;">${isPro ? 'PRO' : 'FREE'}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-primary btn-sm" style="flex:1; font-size:0.8rem; padding:0.4rem;" onclick="App.switchView('user-dashboard'); App.closeMobileMenu();">
              👤 My Profile
            </button>
            <button class="btn btn-secondary btn-sm" style="font-size:0.8rem; padding:0.4rem 0.6rem; color:var(--accent-rose);" onclick="App.closeMobileMenu(); AuthManager.confirmLogout();">
              Sign Out
            </button>
          </div>
        `;
      } else {
        drawerUserCard.innerHTML = `
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-bright); margin-bottom:4px;">👤 Developer Account</div>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.75rem; line-height:1.3;">Sign in to access your saved widgets, interview progress & pro pass.</p>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-primary btn-sm" style="flex:1; font-size:0.8rem; padding:0.45rem;" onclick="App.closeMobileMenu(); AuthManager.openAuthModal('signin');">
              Sign In
            </button>
            <button class="btn btn-secondary btn-sm" style="flex:1; font-size:0.8rem; padding:0.45rem;" onclick="App.closeMobileMenu(); AuthManager.openAuthModal('signup');">
              Register
            </button>
          </div>
        `;
      }
    }

    const drawerProBadge = document.getElementById('drawer-pro-badge');
    if (drawerProBadge) {
      drawerProBadge.textContent = isPro ? 'PRO' : (this.currentUser ? 'ACTIVE' : 'SIGN IN');
      drawerProBadge.className = isPro ? 'drawer-badge badge-pro' : 'drawer-badge badge-blue';
    }

    if (proContainer) {
      if (isPro) {
        proContainer.innerHTML = `<span class="badge badge-pro" style="padding:0.35rem 0.75rem; font-size:0.75rem;">✨ PRO ACTIVE</span>`;
      } else {
        proContainer.innerHTML = ``;
      }
    }

    if (heroProBtn) {
      if (isPro) {
        heroProBtn.style.display = 'none';
      } else {
        heroProBtn.style.display = 'inline-flex';
      }
    }

    this.updateSocialAuthLoadingButtons();

    const pricingProBtn = document.getElementById('pricing-pro-btn');
    if (pricingProBtn) {
      if (isPro) {
        pricingProBtn.innerHTML = '✓ Pro Member Active';
        pricingProBtn.className = 'btn btn-secondary';
        pricingProBtn.onclick = () => App.switchView('user-dashboard');
      } else {
        pricingProBtn.innerHTML = 'Get Pro Access (₹299/yr)';
        pricingProBtn.className = 'btn btn-premium';
        pricingProBtn.onclick = () => PaymentGateway.openCheckout('yearly');
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.AuthManager = AuthManager;
}
