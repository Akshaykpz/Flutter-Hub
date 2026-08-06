/* ==========================================================================
   FlutterHub Dashboards Manager (User & Admin Analytics + Master CRUD Engine)
   ========================================================================== */

const Dashboards = {
  currentAdminTab: 'users',
  adminUsersCache: [],

  dedupeComponents: function (arr) {
    if (!Array.isArray(arr)) return [];
    const seenIds = new Set();
    const seenTitleCats = new Set();
    const result = [];
    arr.forEach(c => {
      if (!c || !c.title) return;
      const idKey = c.id ? c.id.trim() : '';
      const titleKey = c.title.trim().toLowerCase();
      const catKey = (c.category || '').trim().toLowerCase();
      const titleCatKey = `${titleKey}||${catKey}`;

      if (!seenIds.has(idKey) && !seenTitleCats.has(titleCatKey)) {
        seenIds.add(idKey);
        seenTitleCats.add(titleCatKey);
        result.push(c);
      }
    });
    return result;
  },

  // Initialize & Load Saved Admin Overrides from LocalStorage
  initAdminOverrides: function () {
    try {
      const saved = localStorage.getItem('flutterhub_admin_overrides');
      if (saved) {
        const overrides = JSON.parse(saved);
        if (overrides.components && Array.isArray(overrides.components) && overrides.components.length > 0) {
          const validIds = new Set((FLUTTER_DATA.components || []).map(c => c.id));
          const hasLegacy = overrides.components.some(c => !c.id || !validIds.has(c.id));
          if (hasLegacy) {
            delete overrides.components;
            localStorage.setItem('flutterhub_admin_overrides', JSON.stringify(overrides));
          } else {
            FLUTTER_DATA.components = this.dedupeComponents(overrides.components);
          }
        }
        if (overrides.documentation && Array.isArray(overrides.documentation) && overrides.documentation.length > 0) FLUTTER_DATA.documentation = overrides.documentation;
        if (overrides.aiTools && Array.isArray(overrides.aiTools) && overrides.aiTools.length > 0) FLUTTER_DATA.aiTools = overrides.aiTools;
        if (overrides.projects && Array.isArray(overrides.projects) && overrides.projects.length > 0) FLUTTER_DATA.projects = overrides.projects;
        if (overrides.jobs && Array.isArray(overrides.jobs) && overrides.jobs.length > 0) FLUTTER_DATA.jobs = overrides.jobs;
        if (overrides.downloads && Array.isArray(overrides.downloads) && overrides.downloads.length > 0) FLUTTER_DATA.downloads = overrides.downloads;
        if (overrides.roadmaps && overrides.roadmaps.free && overrides.roadmaps.free.length > 0) FLUTTER_DATA.roadmaps = overrides.roadmaps;
      } else {
        FLUTTER_DATA.components = this.dedupeComponents(FLUTTER_DATA.components);
      }
    } catch (e) {
      console.warn("Failed to parse admin overrides from localStorage:", e);
    }
  },

  saveAdminOverrides: function () {
    const overrides = {
      components: FLUTTER_DATA.components,
      documentation: FLUTTER_DATA.documentation,
      aiTools: FLUTTER_DATA.aiTools || [],
      projects: FLUTTER_DATA.projects,
      jobs: FLUTTER_DATA.jobs,
      downloads: FLUTTER_DATA.downloads,
      roadmaps: FLUTTER_DATA.roadmaps
    };
    localStorage.setItem('flutterhub_admin_overrides', JSON.stringify(overrides));
    this.refreshAppViews();
  },

  refreshAppViews: function () {
    if (window.App) {
      if (typeof App.renderComponentGrid === 'function') App.renderComponentGrid();
      if (typeof App.renderRoadmaps === 'function') App.renderRoadmaps();
      if (typeof App.renderDocumentation === 'function') App.renderDocumentation();
      if (typeof App.renderProjects === 'function') App.renderProjects();
      if (typeof App.renderJobs === 'function') App.renderJobs();
      if (typeof App.renderDownloads === 'function') App.renderDownloads();
    }
    if (window.AITools && typeof AITools.init === 'function') {
      AITools.init();
    }
  },

  // ------------------------------------------------------------------------
  // USER DASHBOARD
  // ------------------------------------------------------------------------
  renderUserDashboard: function () {
    const user = AuthManager.currentUser;
    const container = document.getElementById('user-dashboard-content');
    if (!container) return;

    if (!user) {
      container.innerHTML = `
        <div class="glass-panel" style="padding:2.5rem; text-align:center; max-width:560px; margin:3rem auto;">
          <h2 style="font-size:1.6rem; font-weight:800; color:var(--text-bright); margin-bottom:0.75rem;">Sign in to view your dashboard</h2>
          <p style="color:var(--text-secondary); margin-bottom:1.5rem;">Your saved components, downloads, and plan details will appear here after login.</p>
          <button class="btn btn-primary" onclick="AuthManager.openAuthModal('signin')">Sign In</button>
        </div>
      `;
      return;
    }

    const favoriteIds = AuthManager.normalizeFavorites(AuthManager.getFavorites());

    container.innerHTML = `
      <div class="glass-panel" style="padding:2rem; margin-bottom:2rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1.25rem;">
            <div class="avatar-large">${AuthManager.getAvatarHTML ? AuthManager.getAvatarHTML(user) : (user.avatar || '👤')}</div>
            <div>
              <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-bright);">${user.name}</h2>
              <p style="color:var(--text-secondary); font-size:0.9rem;">${user.email} • Member since ${user.joinedDate}</p>
            </div>
          </div>
          <div>
            ${user.isPro
        ? `<span class="badge badge-pro" style="padding:0.5rem 1rem; font-size:0.85rem;">✨ PRO SUBSCRIBER (₹29/mo ACTIVE)</span>`
        : `<button class="btn btn-premium" onclick="PaymentGateway.openCheckout()">Upgrade to Pro ₹29/mo</button>`
      }
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-title">Saved Bookmarks</span>
          <span class="kpi-value">${favoriteIds.length}</span>
          <span class="kpi-trend positive">Saved components</span>
        </div>
        <div class="kpi-card purple">
          <span class="kpi-title">Total Snippets Downloaded</span>
          <span class="kpi-value">${user.downloadsCount}</span>
          <span class="kpi-trend positive">Flutter Dart files</span>
        </div>
        <div class="kpi-card emerald">
          <span class="kpi-title">Plan Status</span>
          <span class="kpi-value">${user.isPro ? 'Pro' : 'Free'}</span>
          <span class="kpi-trend positive">${user.isPro ? 'Unlimited Access' : 'Upgrade available'}</span>
        </div>
        <div class="kpi-card amber">
          <span class="kpi-title">API Keys</span>
          <span class="kpi-value">Active</span>
          <span class="kpi-trend positive">v2.0 Developer SDK</span>
        </div>
      </div>

      <!-- Reward Coupons Section -->
      <div style="margin-bottom:2.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
          <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-bright);">🎟️ My Reward Coupons</h3>
          <button class="btn btn-primary btn-sm" style="font-size:0.8rem;" onclick="CouponManager.openScratchCardModal()">🎁 Open Scratch Card</button>
        </div>
        <div id="user-dashboard-coupons-container">
          ${window.CouponManager ? CouponManager.renderUserCouponsHTML() : ''}
        </div>
      </div>

      <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:1rem; color:var(--text-bright);">Your Bookmarked Components</h3>
      <div class="component-grid">
        ${favoriteIds.length === 0
        ? `<div style="grid-column:1/-1; padding:3rem; text-align:center; color:var(--text-muted); background:var(--bg-card); border-radius:16px;">No bookmarked components yet! Click the heart icon on any component to save it here.</div>`
        : FLUTTER_DATA.components
          .filter(c => favoriteIds.includes(AuthManager.normalizeFavoriteId(c.id)))
          .map(c => App.createComponentCardHTML(c))
          .join('')
      }
      </div>
    `;

    if (window.CouponManager) {
      CouponManager.fetchMyCoupons().then(() => {
        const couponsEl = document.getElementById('user-dashboard-coupons-container');
        if (couponsEl) couponsEl.innerHTML = CouponManager.renderUserCouponsHTML();
      });
    }

    if (favoriteIds.length > 0) {
      FLUTTER_DATA.components
        .filter(c => favoriteIds.includes(AuthManager.normalizeFavoriteId(c.id)))
        .forEach(c => {
          if (c.simType) FlutterSim.renderWidget(c.simType, `sim-${c.id}`);
        });
    }
  },

  // ------------------------------------------------------------------------
  // ADMIN DASHBOARD MASTER RENDERER
  // ------------------------------------------------------------------------
  renderAdminDashboard: async function () {
    this.initAdminOverrides();
    const container = document.getElementById('admin-dashboard-content');
    if (!container) return;

    let users = [];
    let usersError = '';

    try {
      const res = await fetch('/api/auth/users');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        users = json.data;
      } else {
        usersError = json.message || 'Unable to load Supabase users.';
      }
    } catch (e) {
      usersError = e.message;
      console.warn("Supabase users fetch notice:", e.message);
    }

    this.adminUsersCache = users;

    const totalUsers = users.length;
    const proUsers = users.filter(u => u.isSubscribed || u.subscription === 'pro').length;
    const adminUsers = users.filter(u => u.isAdmin || u.role === 'admin' || (u.email && u.email.toLowerCase() === 'admin@admin.com')).length;

    // Render Master Layout with Sidebar + Active Content View
    container.innerHTML = `
      <div class="dashboard-header" style="margin-bottom:2rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <span class="badge badge-cyan" style="font-size:0.75rem; padding:0.3rem 0.65rem;">ADMINISTRATOR CONTROL PANEL</span>
            <span class="badge" style="background:rgba(245, 158, 11, 0.15); color:#fbbf24; border:1px solid rgba(245, 158, 11, 0.3); font-weight:800; font-size:0.75rem;">👑 MASTER MODE</span>
          </div>
          <h1 style="font-size:2rem; font-weight:800; color:var(--text-bright);">FlutterHub Platform Management System</h1>
          <p style="color:var(--text-secondary);">Manage users, components, roadmaps, documentation, AI tools, projects, jobs, and downloads in real time.</p>
        </div>
        <div style="display:flex; gap:0.75rem; align-items:center;">
          <button class="btn btn-primary btn-sm" onclick="Dashboards.renderAdminDashboard(); App.showToast('Admin data synced successfully!', 'success');">⚡ Sync All Data</button>
        </div>
      </div>

      <!-- KPI Metrics Row -->
      <div class="kpi-grid" style="margin-bottom:2rem;">
        <div class="kpi-card emerald">
          <span class="kpi-title">Registered Users</span>
          <span class="kpi-value">${totalUsers}</span>
          <span class="kpi-trend positive">▲ Live Accounts</span>
        </div>
        <div class="kpi-card purple">
          <span class="kpi-title">Components</span>
          <span class="kpi-value">${FLUTTER_DATA.components.length}</span>
          <span class="kpi-trend positive">🧩 Widget Library</span>
        </div>
        <div class="kpi-card amber">
          <span class="kpi-title">Widget Docs</span>
          <span class="kpi-value">${FLUTTER_DATA.documentation.length}</span>
          <span class="kpi-trend positive">📖 Official Docs</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Full Projects & Jobs</span>
          <span class="kpi-value">${FLUTTER_DATA.projects.length + FLUTTER_DATA.jobs.length}</span>
          <span class="kpi-trend positive">🚀 Code & Careers</span>
        </div>
      </div>

      <!-- Main Admin 2-Column Sidebar & Content Layout -->
      <div class="admin-layout">
        <!-- Sidebar Navigation Menu -->
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">Resource Management</div>
          <button class="admin-nav-item ${this.currentAdminTab === 'users' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('users')">
            <span>👥</span> Users Database
            <span class="admin-nav-badge">${totalUsers}</span>
          </button>
          <button class="admin-nav-item ${this.currentAdminTab === 'components' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('components')">
            <span>🧩</span> Components
            <span class="admin-nav-badge">${FLUTTER_DATA.components.length}</span>
          </button>
          <button class="admin-nav-item ${this.currentAdminTab === 'roadmaps' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('roadmaps')">
            <span>🗺️</span> Roadmaps
            <span class="admin-nav-badge">${(FLUTTER_DATA.roadmaps.free || []).length + (FLUTTER_DATA.roadmaps.pro || []).length}</span>
          </button>
          <button class="admin-nav-item ${this.currentAdminTab === 'documentation' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('documentation')">
            <span>📖</span> Widget Docs
            <span class="admin-nav-badge">${FLUTTER_DATA.documentation.length}</span>
          </button>
          <button class="admin-nav-item ${this.currentAdminTab === 'aiTools' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('aiTools')">
            <span>🤖</span> AI Utilities
            <span class="admin-nav-badge">${(FLUTTER_DATA.aiTools || []).length}</span>
          </button>
          <button class="admin-nav-item ${this.currentAdminTab === 'projects' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('projects')">
            <span>🚀</span> Full Projects
            <span class="admin-nav-badge">${FLUTTER_DATA.projects.length}</span>
          </button>
          <button class="admin-nav-item ${this.currentAdminTab === 'jobs' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('jobs')">
            <span>💼</span> Job Board
            <span class="admin-nav-badge">${FLUTTER_DATA.jobs.length}</span>
          </button>
          <button class="admin-nav-item ${this.currentAdminTab === 'downloads' ? 'active' : ''}" onclick="Dashboards.switchAdminTab('downloads')">
            <span>📥</span> Downloads
            <span class="admin-nav-badge">${FLUTTER_DATA.downloads.length}</span>
          </button>
        </aside>

        <!-- Right Content Container -->
        <main id="admin-tab-content">
          ${this.renderAdminTabContent(this.currentAdminTab, users, usersError)}
        </main>
      </div>
    `;
  },

  switchAdminTab: function (tabKey) {
    this.currentAdminTab = tabKey;
    const items = document.querySelectorAll('.admin-nav-item');
    items.forEach(el => {
      if (el.getAttribute('onclick')?.includes(`'${tabKey}'`)) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const contentArea = document.getElementById('admin-tab-content');
    if (contentArea) {
      contentArea.innerHTML = this.renderAdminTabContent(tabKey, this.adminUsersCache, '');
    }
  },

  renderAdminTabContent: function (tabKey, users = [], usersError = '') {
    switch (tabKey) {
      case 'users':
        return this.renderUsersTabHTML(users, usersError);
      case 'components':
        return this.renderComponentsTabHTML();
      case 'roadmaps':
        return this.renderRoadmapsTabHTML();
      case 'documentation':
        return this.renderDocsTabHTML();
      case 'aiTools':
        return this.renderAIToolsTabHTML();
      case 'projects':
        return this.renderProjectsTabHTML();
      case 'jobs':
        return this.renderJobsTabHTML();
      case 'downloads':
        return this.renderDownloadsTabHTML();
      default:
        return this.renderUsersTabHTML(users, usersError);
    }
  },

  // ------------------------------------------------------------------------
  // TAB 1: USERS DATABASE MANAGEMENT
  // ------------------------------------------------------------------------
  renderUsersTabHTML: function (users = [], usersError = '') {
    const list = users.length > 0 ? users : this.adminUsersCache;
    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>👥 Registered & Logged-In Users</span>
              <span class="badge badge-cyan">${list.length} Users</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Real-time database user accounts synced with Supabase Backend</div>
          </div>
          <div>
            <input type="text" placeholder="🔍 Search name, email, or role..." class="form-input" style="width:240px; padding:0.45rem 0.85rem; font-size:0.85rem; border-radius:8px;" oninput="Dashboards.filterAdminUserList(this.value)" />
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>User Name & ID</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Subscription</th>
              <th>Registered Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="admin-users-tbody">
            ${usersError ? `<tr><td colspan="6" style="padding:2rem; color:var(--accent-rose); text-align:center;">⚠️ ${usersError}</td></tr>`
        : list.length === 0 ? `<tr><td colspan="6" style="padding:2rem; color:var(--text-muted); text-align:center;">No user records found in Supabase database.</td></tr>`
          : list.map(u => this.generateUserRowHTML(u)).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  filterAdminUserList: function (query) {
    const q = (query || '').toLowerCase().trim();
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody || !this.adminUsersCache) return;

    const filtered = this.adminUsersCache.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="padding:1.5rem; color:var(--text-muted); text-align:center;">No matching user records found for "${q}".</td></tr>`;
      return;
    }
    tbody.innerHTML = filtered.map(u => this.generateUserRowHTML(u)).join('');
  },

  generateUserRowHTML: function (u) {
    const isAdmin = u.isAdmin || u.role === 'admin' || (u.email && u.email.toLowerCase() === 'admin@admin.com');
    const isPro = u.isSubscribed || u.subscription === 'pro' || isAdmin;
    const initial = (u.name || u.email || 'U')[0].toUpperCase();

    return `
      <tr style="${isAdmin ? 'background: rgba(6, 182, 212, 0.05);' : ''}">
        <td style="font-weight:700; color:var(--text-bright); display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:50%; background:${isAdmin ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : 'var(--grad-flutter)'}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800;">
            ${isAdmin ? '👑' : initial}
          </div>
          <div>
            <div style="font-weight:700; color:${isAdmin ? '#38bdf8' : 'var(--text-bright)'};">${u.name || 'Developer User'}</div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${u.id || 'N/A'}</div>
          </div>
        </td>
        <td style="color:var(--text-secondary); font-family:monospace; font-size:0.875rem;">${u.email}</td>
        <td>
          <span class="badge" style="background:${isAdmin ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)'}; color:${isAdmin ? '#fbbf24' : '#60a5fa'}; border:1px solid ${isAdmin ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'}; font-weight:700;">
            ${isAdmin ? '👑 ADMIN' : '👤 USER'}
          </span>
        </td>
        <td>
          <span class="badge ${isPro ? 'badge-pro' : 'badge-cyan'}">
            ${isPro ? '✨ PRO ACTIVE' : 'FREE TIER'}
          </span>
        </td>
        <td style="color:var(--text-secondary); font-size:0.85rem;">
          ${u.createdAt ? u.createdAt.replace('T', ' ').split('.')[0] : 'July 2026'}
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" style="padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="App.showToast('User: ${u.name} (${u.email})', 'info')">Details</button>
        </td>
      </tr>
    `;
  },

  // ------------------------------------------------------------------------
  // TAB 2: COMPONENTS MANAGEMENT (CRUD)
  // ------------------------------------------------------------------------
  renderComponentsTabHTML: function () {
    const list = FLUTTER_DATA.components;
    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>🧩 Flutter Components Library</span>
              <span class="badge badge-cyan">${list.length} Items</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Manage UI widgets, buttons, dialogs, cards & code snippets</div>
          </div>
          <button class="btn btn-primary btn-sm" style="font-weight:700;" onclick="Dashboards.openAdminItemModal('components')">
            + Add New Component
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Title & ID</th>
              <th>Category</th>
              <th>Access Tier</th>
              <th>Description</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(c => `
              <tr>
                <td style="font-weight:700; color:var(--text-bright);">
                  <div>${c.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${c.id}</div>
                </td>
                <td><span class="badge badge-cyan">${c.category}</span></td>
                <td><span class="badge ${c.isPremium ? 'badge-pro' : 'badge-cyan'}">${c.isPremium ? 'PRO' : 'FREE'}</span></td>
                <td style="color:var(--text-secondary); font-size:0.85rem; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${c.description}</td>
                <td style="text-align:right;">
                  <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="Dashboards.openAdminItemModal('components', '${c.id}')">✏️ Edit</button>
                    <button class="btn btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);" onclick="Dashboards.deleteAdminItem('components', '${c.id}')">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // TAB 3: ROADMAPS MANAGEMENT (CRUD)
  // ------------------------------------------------------------------------
  renderRoadmapsTabHTML: function () {
    const freeSteps = FLUTTER_DATA.roadmaps.free || [];
    const proSteps = FLUTTER_DATA.roadmaps.pro || [];
    const allSteps = [
      ...freeSteps.map(s => ({ ...s, isPremium: false, id: `free_${s.step}` })),
      ...proSteps.map(s => ({ ...s, isPremium: true, id: `pro_${s.step}` }))
    ];

    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>🗺️ Flutter Learning Roadmaps</span>
              <span class="badge badge-cyan">${allSteps.length} Steps</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Manage Free & Pro developer learning modules</div>
          </div>
          <button class="btn btn-primary btn-sm" style="font-weight:700;" onclick="Dashboards.openAdminItemModal('roadmaps')">
            + Add Roadmap Step
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Step & Title</th>
              <th>Level</th>
              <th>Duration</th>
              <th>Tier</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${allSteps.map(s => `
              <tr>
                <td style="font-weight:700; color:var(--text-bright);">
                  <div>Step ${s.step}: ${s.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${(s.topics || []).slice(0, 3).join(', ')}</div>
                </td>
                <td><span class="badge badge-cyan">${s.level}</span></td>
                <td style="color:var(--text-secondary); font-size:0.85rem;">${s.duration}</td>
                <td><span class="badge ${s.isPremium ? 'badge-pro' : 'badge-cyan'}">${s.isPremium ? 'PRO' : 'FREE'}</span></td>
                <td style="text-align:right;">
                  <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="Dashboards.openAdminItemModal('roadmaps', '${s.id}')">✏️ Edit</button>
                    <button class="btn btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);" onclick="Dashboards.deleteAdminItem('roadmaps', '${s.id}')">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // TAB 4: WIDGET DOCUMENTATION MANAGEMENT (CRUD)
  // ------------------------------------------------------------------------
  renderDocsTabHTML: function () {
    const list = FLUTTER_DATA.documentation || [];
    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>📖 Widget Documentation Guides</span>
              <span class="badge badge-cyan">${list.length} Guides</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Manage official Flutter widget docs and performance guides</div>
          </div>
          <button class="btn btn-primary btn-sm" style="font-weight:700;" onclick="Dashboards.openAdminItemModal('documentation')">
            + Add Widget Doc
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Widget Name</th>
              <th>Category</th>
              <th>Access Tier</th>
              <th>Description</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(d => `
              <tr>
                <td style="font-weight:700; color:var(--text-bright);">
                  <div>${d.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${d.id}</div>
                </td>
                <td><span class="badge badge-cyan">${d.category}</span></td>
                <td><span class="badge ${d.isPremium ? 'badge-pro' : 'badge-cyan'}">${d.isPremium ? 'PRO' : 'FREE'}</span></td>
                <td style="color:var(--text-secondary); font-size:0.85rem; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${d.description}</td>
                <td style="text-align:right;">
                  <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="Dashboards.openAdminItemModal('documentation', '${d.id}')">✏️ Edit</button>
                    <button class="btn btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);" onclick="Dashboards.deleteAdminItem('documentation', '${d.id}')">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // TAB 5: AI UTILITIES MANAGEMENT (CRUD)
  // ------------------------------------------------------------------------
  renderAIToolsTabHTML: function () {
    const list = FLUTTER_DATA.aiTools || [
      { id: 'ai_01', name: 'JSON to Freezed Model Generator', category: 'Code Generation', isPremium: false, description: 'Paste raw JSON to output Dart 3 Freezed models.' },
      { id: 'ai_02', name: 'UI Prompt to Flutter Widget Generator', category: 'AI Assistant', isPremium: true, description: 'Natural language prompt to production Flutter UI code.' }
    ];
    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>🤖 AI Utilities & Code Generators</span>
              <span class="badge badge-cyan">${list.length} Tools</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Manage AI prompts, Freezed generators, and Flutter assistant tools</div>
          </div>
          <button class="btn btn-primary btn-sm" style="font-weight:700;" onclick="Dashboards.openAdminItemModal('aiTools')">
            + Add AI Utility
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Tool Name</th>
              <th>Category</th>
              <th>Tier</th>
              <th>Description</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(t => `
              <tr>
                <td style="font-weight:700; color:var(--text-bright);">
                  <div>${t.name || t.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${t.id}</div>
                </td>
                <td><span class="badge badge-cyan">${t.category}</span></td>
                <td><span class="badge ${t.isPremium ? 'badge-pro' : 'badge-cyan'}">${t.isPremium ? 'PRO' : 'FREE'}</span></td>
                <td style="color:var(--text-secondary); font-size:0.85rem; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${t.description}</td>
                <td style="text-align:right;">
                  <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="Dashboards.openAdminItemModal('aiTools', '${t.id}')">✏️ Edit</button>
                    <button class="btn btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);" onclick="Dashboards.deleteAdminItem('aiTools', '${t.id}')">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // TAB 6: FULL PROJECTS MANAGEMENT (CRUD)
  // ------------------------------------------------------------------------
  renderProjectsTabHTML: function () {
    const list = FLUTTER_DATA.projects || [];
    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>🚀 Full Code Projects</span>
              <span class="badge badge-cyan">${list.length} Projects</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Manage full-stack Flutter app templates and architecture repositories</div>
          </div>
          <button class="btn btn-primary btn-sm" style="font-weight:700;" onclick="Dashboards.openAdminItemModal('projects')">
            + Add Full Project
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Access Tier</th>
              <th>Description</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(p => `
              <tr>
                <td style="font-weight:700; color:var(--text-bright);">
                  <div>${p.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${p.id}</div>
                </td>
                <td><span class="badge badge-cyan">${p.category}</span></td>
                <td><span class="badge ${p.isPremium ? 'badge-pro' : 'badge-cyan'}">${p.isPremium ? 'PRO' : 'FREE'}</span></td>
                <td style="color:var(--text-secondary); font-size:0.85rem; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.description}</td>
                <td style="text-align:right;">
                  <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="Dashboards.openAdminItemModal('projects', '${p.id}')">✏️ Edit</button>
                    <button class="btn btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);" onclick="Dashboards.deleteAdminItem('projects', '${p.id}')">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // TAB 7: JOB BOARD MANAGEMENT (CRUD)
  // ------------------------------------------------------------------------
  renderJobsTabHTML: function () {
    const list = FLUTTER_DATA.jobs || [];
    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>💼 Flutter Job Board Listings</span>
              <span class="badge badge-cyan">${list.length} Jobs</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Manage career openings, salaries, and remote developer listings</div>
          </div>
          <button class="btn btn-primary btn-sm" style="font-weight:700;" onclick="Dashboards.openAdminItemModal('jobs')">
            + Add Job Listing
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Role & Company</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Experience</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(j => `
              <tr>
                <td style="font-weight:700; color:var(--text-bright);">
                  <div>${j.title}</div>
                  <div style="font-size:0.75rem; color:#38bdf8;">${j.company}</div>
                </td>
                <td style="color:var(--text-secondary); font-size:0.85rem;">${j.location}</td>
                <td style="color:#10b981; font-weight:700; font-size:0.85rem;">${j.salary}</td>
                <td><span class="badge badge-cyan">${j.experience}</span></td>
                <td style="text-align:right;">
                  <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="Dashboards.openAdminItemModal('jobs', '${j.id}')">✏️ Edit</button>
                    <button class="btn btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);" onclick="Dashboards.deleteAdminItem('jobs', '${j.id}')">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // TAB 8: DOWNLOADS & CHEAT SHEETS MANAGEMENT (CRUD)
  // ------------------------------------------------------------------------
  renderDownloadsTabHTML: function () {
    const list = FLUTTER_DATA.downloads || [];
    return `
      <div class="data-table-wrapper">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:rgba(15, 23, 42, 0.6);">
          <div>
            <div style="font-weight:800; font-size:1.1rem; color:var(--text-bright); display:flex; align-items:center; gap:8px;">
              <span>📥 Downloads & Cheat Sheets</span>
              <span class="badge badge-cyan">${list.length} Files</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Manage downloadable Flutter PDFs, contracts, and cheat sheets</div>
          </div>
          <button class="btn btn-primary btn-sm" style="font-weight:700;" onclick="Dashboards.openAdminItemModal('downloads')">
            + Add Download Item
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Title & ID</th>
              <th>Category</th>
              <th>Format</th>
              <th>Tier</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(dl => `
              <tr>
                <td style="font-weight:700; color:var(--text-bright);">
                  <div>${dl.title}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${dl.id}</div>
                </td>
                <td><span class="badge badge-cyan">${dl.category}</span></td>
                <td style="color:var(--text-secondary); font-size:0.85rem;">${dl.format}</td>
                <td><span class="badge ${dl.isPremium ? 'badge-pro' : 'badge-cyan'}">${dl.isPremium ? 'PRO' : 'FREE'}</span></td>
                <td style="text-align:right;">
                  <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="Dashboards.openAdminItemModal('downloads', '${dl.id}')">✏️ Edit</button>
                    <button class="btn btn-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:rgba(244,63,94,0.15); color:#f43f5e; border:1px solid rgba(244,63,94,0.3);" onclick="Dashboards.deleteAdminItem('downloads', '${dl.id}')">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // ADMIN MODAL & CRUD HANDLERS
  // ------------------------------------------------------------------------
  openAdminItemModal: function (sectionKey, itemId = null) {
    const modal = document.getElementById('admin-item-modal');
    if (!modal) return;

    document.getElementById('admin-form-section-key').value = sectionKey;
    document.getElementById('admin-form-item-id').value = itemId || '';

    const titleEl = document.getElementById('admin-modal-title');
    const subtitleEl = document.getElementById('admin-modal-subtitle');
    const titleInput = document.getElementById('admin-form-title');
    const tierInput = document.getElementById('admin-form-tier');
    const catInput = document.getElementById('admin-form-category');
    const descInput = document.getElementById('admin-form-description');
    const contentInput = document.getElementById('admin-form-content');

    const isEdit = !!itemId;
    titleEl.innerText = isEdit ? `Edit Item (${itemId})` : `Add New ${sectionKey.toUpperCase()} Item`;
    subtitleEl.innerText = `Manage details for ${sectionKey} section`;

    // Clear form defaults
    titleInput.value = '';
    tierInput.value = 'free';
    catInput.value = '';
    descInput.value = '';
    contentInput.value = '';

    if (isEdit) {
      let existing = null;
      if (sectionKey === 'components') existing = FLUTTER_DATA.components.find(c => c.id === itemId);
      if (sectionKey === 'documentation') existing = FLUTTER_DATA.documentation.find(d => d.id === itemId);
      if (sectionKey === 'aiTools') existing = (FLUTTER_DATA.aiTools || []).find(t => t.id === itemId);
      if (sectionKey === 'projects') existing = FLUTTER_DATA.projects.find(p => p.id === itemId);
      if (sectionKey === 'jobs') existing = FLUTTER_DATA.jobs.find(j => j.id === itemId);
      if (sectionKey === 'downloads') existing = FLUTTER_DATA.downloads.find(dl => dl.id === itemId);
      if (sectionKey === 'roadmaps') {
        existing = [...(FLUTTER_DATA.roadmaps.free || []), ...(FLUTTER_DATA.roadmaps.pro || [])].find(s => s.id === itemId || `free_${s.step}` === itemId || `pro_${s.step}` === itemId);
      }

      if (existing) {
        titleInput.value = existing.title || existing.name || '';
        tierInput.value = existing.isPremium ? 'pro' : 'free';
        catInput.value = existing.category || existing.company || existing.level || '';
        descInput.value = existing.description || existing.topics?.join(', ') || '';
        contentInput.value = existing.code || existing.exampleCode || existing.pubspec || existing.content || existing.applyUrl || '';
      }
    }

    modal.classList.add('active');
  },

  closeAdminItemModal: function () {
    const modal = document.getElementById('admin-item-modal');
    if (modal) modal.classList.remove('active');
  },

  handleAdminItemSubmit: function (e) {
    e.preventDefault();
    const sectionKey = document.getElementById('admin-form-section-key').value;
    const itemId = document.getElementById('admin-form-item-id').value;

    const title = document.getElementById('admin-form-title').value.trim();
    const isPremium = document.getElementById('admin-form-tier').value === 'pro';
    const category = document.getElementById('admin-form-category').value.trim();
    const description = document.getElementById('admin-form-description').value.trim();
    const content = document.getElementById('admin-form-content').value.trim();

    if (!title || !category || !description) {
      App.showToast('Please fill in all required fields.', 'error');
      return;
    }

    const newId = itemId || `${sectionKey}_${Date.now()}`;

    if (sectionKey === 'components') {
      const newItem = {
        id: newId,
        title,
        category: category.toLowerCase(),
        isPremium,
        badge: isPremium ? 'PRO' : 'FREE',
        description,
        dependencies: ['flutter/material.dart'],
        simType: 'glass_button',
        code: content || `// ${title}\nclass ${title.replace(/\s+/g, '')} extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) => Container();\n}`
      };
      const idx = FLUTTER_DATA.components.findIndex(c => c.id === itemId);
      if (idx !== -1) FLUTTER_DATA.components[idx] = newItem;
      else FLUTTER_DATA.components.unshift(newItem);
    }

    else if (sectionKey === 'documentation') {
      const newItem = {
        id: newId,
        title,
        category,
        isPremium,
        description,
        exampleCode: content || `// ${title} Example`,
        performanceTips: 'Always use const constructors.'
      };
      const idx = FLUTTER_DATA.documentation.findIndex(d => d.id === itemId);
      if (idx !== -1) FLUTTER_DATA.documentation[idx] = newItem;
      else FLUTTER_DATA.documentation.unshift(newItem);
    }

    else if (sectionKey === 'aiTools') {
      if (!FLUTTER_DATA.aiTools) FLUTTER_DATA.aiTools = [];
      const newItem = { id: newId, name: title, category, isPremium, description, promptTemplate: content };
      const idx = FLUTTER_DATA.aiTools.findIndex(t => t.id === itemId);
      if (idx !== -1) FLUTTER_DATA.aiTools[idx] = newItem;
      else FLUTTER_DATA.aiTools.unshift(newItem);
    }

    else if (sectionKey === 'projects') {
      const newItem = {
        id: newId,
        title,
        category,
        isPremium,
        badge: isPremium ? 'Pro Project (₹29/mo)' : 'Free Template',
        description,
        pubspec: content || `name: ${title.toLowerCase().replace(/\s+/g, '_')}\ndependencies:\n  flutter:\n    sdk: flutter`
      };
      const idx = FLUTTER_DATA.projects.findIndex(p => p.id === itemId);
      if (idx !== -1) FLUTTER_DATA.projects[idx] = newItem;
      else FLUTTER_DATA.projects.unshift(newItem);
    }

    else if (sectionKey === 'jobs') {
      const newItem = {
        id: newId,
        title,
        company: category,
        location: 'Remote / India',
        region: 'Remote',
        salary: '₹18,00,000 - ₹28,00,000 / year',
        type: 'Full-time',
        experience: '3+ Years',
        tags: ['Flutter', 'Dart 3'],
        logoBg: '#38bdf8',
        applyUrl: content || 'https://linkedin.com'
      };
      const idx = FLUTTER_DATA.jobs.findIndex(j => j.id === itemId);
      if (idx !== -1) FLUTTER_DATA.jobs[idx] = newItem;
      else FLUTTER_DATA.jobs.unshift(newItem);
    }

    else if (sectionKey === 'downloads') {
      const newItem = { id: newId, title, category, format: 'PDF / Markdown', isPremium };
      const idx = FLUTTER_DATA.downloads.findIndex(dl => dl.id === itemId);
      if (idx !== -1) FLUTTER_DATA.downloads[idx] = newItem;
      else FLUTTER_DATA.downloads.unshift(newItem);
    }

    else if (sectionKey === 'roadmaps') {
      const stepItem = {
        step: '09',
        title,
        level: category,
        duration: '1 Week',
        topics: description.split(',').map(t => t.trim())
      };
      if (isPremium) {
        if (!FLUTTER_DATA.roadmaps.pro) FLUTTER_DATA.roadmaps.pro = [];
        FLUTTER_DATA.roadmaps.pro.unshift(stepItem);
      } else {
        if (!FLUTTER_DATA.roadmaps.free) FLUTTER_DATA.roadmaps.free = [];
        FLUTTER_DATA.roadmaps.free.unshift(stepItem);
      }
    }

    this.saveAdminOverrides();
    this.closeAdminItemModal();
    App.showToast(`👑 Saved ${title} to ${sectionKey}!`, 'success');
    this.switchAdminTab(sectionKey);
  },

  deleteAdminItem: function (sectionKey, itemId) {
    if (!confirm(`Are you sure you want to delete this ${sectionKey} item?`)) return;

    if (sectionKey === 'components') {
      FLUTTER_DATA.components = FLUTTER_DATA.components.filter(c => c.id !== itemId);
    } else if (sectionKey === 'documentation') {
      FLUTTER_DATA.documentation = FLUTTER_DATA.documentation.filter(d => d.id !== itemId);
    } else if (sectionKey === 'aiTools') {
      if (FLUTTER_DATA.aiTools) FLUTTER_DATA.aiTools = FLUTTER_DATA.aiTools.filter(t => t.id !== itemId);
    } else if (sectionKey === 'projects') {
      FLUTTER_DATA.projects = FLUTTER_DATA.projects.filter(p => p.id !== itemId);
    } else if (sectionKey === 'jobs') {
      FLUTTER_DATA.jobs = FLUTTER_DATA.jobs.filter(j => j.id !== itemId);
    } else if (sectionKey === 'downloads') {
      FLUTTER_DATA.downloads = FLUTTER_DATA.downloads.filter(dl => dl.id !== itemId);
    } else if (sectionKey === 'roadmaps') {
      if (FLUTTER_DATA.roadmaps.free) FLUTTER_DATA.roadmaps.free = FLUTTER_DATA.roadmaps.free.filter(s => s.id !== itemId && `free_${s.step}` !== itemId);
      if (FLUTTER_DATA.roadmaps.pro) FLUTTER_DATA.roadmaps.pro = FLUTTER_DATA.roadmaps.pro.filter(s => s.id !== itemId && `pro_${s.step}` !== itemId);
    }

    this.saveAdminOverrides();
    App.showToast(`🗑️ Item deleted successfully.`, 'info');
    this.switchAdminTab(sectionKey);
  }
};
