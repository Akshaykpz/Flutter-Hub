/* ==========================================================================
   FlutterHub Master Application Orchestrator & Router
   ========================================================================== */

const App = {
  currentView: 'home',
  activeCategory: 'all',

  init: function () {
    // 1. Initialize Theme
    const savedTheme = localStorage.getItem('flutterhub_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggleIcon(savedTheme);


    AuthManager.init();
    if (window.Dashboards && typeof window.Dashboards.initAdminOverrides === 'function') {
      Dashboards.initAdminOverrides();
    }


    this.renderCategoriesSidebar();
    this.renderComponentGrid();
    this.renderUIScreens();
    this.renderAnimations();
    this.renderStateManagement();
    this.renderProjects();
    this.renderBlogs();
    this.renderRoadmaps();
    this.renderDocumentation();
    this.renderJobs();
    this.renderInterview();
    this.renderCommunity();
    this.renderDownloads();


    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
      }
      if (e.key === 'Escape') {
        AuthManager.closeAuthModal();
        AuthManager.closeLogoutModal();
        this.closeSearchModal();
        PaymentGateway.closeCheckout();
      }
    });

    // 4. Activate initial view based on user authentication state
    const isAdmin = AuthManager.currentUser && (AuthManager.currentUser.isAdmin || AuthManager.currentUser.role === 'admin' || (AuthManager.currentUser.email && AuthManager.currentUser.email.toLowerCase() === 'admin@admin.com'));
    if (isAdmin) {
      this.switchView('admin-dashboard');
    } else {
      this.switchView('home');
    }

    this.updateNavDropdownsUI();
    console.log("🚀 FlutterHub Engine Initialized!");
  },

  handleNavClick: function (e, viewId, isProRequired) {
    if (e) e.preventDefault();
    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;

    if (isProRequired && !isPro) {
      if (!AuthManager.currentUser) {
        App.showToast('🔒 Account Sign In Required! Please log in first to access Pro features.', 'info');
        AuthManager.openAuthModal('signin');
      } else {
        App.showToast('🔒 Pro Subscription Required! Opening Pro Purchase...', 'info');
        this.switchView('pricing');
        PaymentGateway.openCheckout();
      }
      return;
    }

    this.switchView(viewId);
  },

  updateNavDropdownsUI: function () {
    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;
    const badges = document.querySelectorAll('.nav-pro-badge');
    badges.forEach(b => {
      if (isPro) {
        b.textContent = '✓ UNLOCKED';
        b.className = 'badge badge-emerald nav-pro-badge';
        b.style.background = 'rgba(16, 185, 129, 0.2)';
        b.style.color = '#34d399';
        b.style.border = '1px solid rgba(52, 211, 153, 0.4)';
      } else {
        b.textContent = '🔒 PRO';
        b.className = 'badge badge-pro nav-pro-badge';
        b.style.background = 'rgba(245, 158, 11, 0.15)';
        b.style.color = '#fbbf24';
        b.style.border = '1px solid rgba(245, 158, 11, 0.35)';
      }
    });
  },

  // Simple & Spacious UI Design System Switcher
  activeSimpleSystem: 'bento',

  switchSimpleDesignSystem: function (systemId) {
    this.activeSimpleSystem = systemId;
    const system = FLUTTER_DATA.designSystems ? FLUTTER_DATA.designSystems[systemId] : null;
    if (!system) return;

    // Update Tab Buttons Active State
    document.querySelectorAll('.ds-tab').forEach(btn => {
      if (btn.getAttribute('onclick')?.includes(systemId)) {
        btn.classList.add('active');
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
      } else {
        btn.classList.remove('active');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
      }
    });

    const card = document.getElementById('ds-simple-card');
    if (!card) return;

    const comp = system.components[0]; // Featured component of this design system

    card.style.opacity = '0';
    card.style.transform = 'scale(0.98)';
    card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    setTimeout(() => {
      card.className = systemId === 'bento' ? 'bento-card' : systemId === 'neumorphism' ? 'neu-card' : systemId === 'claymorphism' ? 'clay-card' : systemId === 'glassmorphism' ? 'glass-showcase-card' : 'aurora-card';
      
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <span class="badge ${comp.isPremium ? 'badge-pro' : 'badge-cyan'}">${comp.badge}</span>
          <span style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">${system.name} Paradigm</span>
        </div>

        <!-- Live Simulation Box -->
        <div id="ds-simple-sim-box" style="min-height:220px; padding:2rem; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.3); border-radius:20px; border:1px solid rgba(255,255,255,0.08); margin-bottom:1.5rem;"></div>

        <h3 style="font-size:1.5rem; font-weight:800; color:var(--text-bright); margin-bottom:0.5rem;">${comp.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.95rem; max-width:540px; margin:0 auto 1.5rem;">${comp.description}</p>

        <div style="display:flex; gap:12px; justify-content:center; max-width:420px; margin:0 auto;">
          <button class="btn btn-secondary" style="flex:1;" onclick="FlutterSim.renderWidget('${comp.simType}', 'ds-simple-sim-box')">
            ⚡ Interactive Test
          </button>
          <button class="btn btn-primary" style="flex:1;" onclick="App.openCodeViewerModal('${comp.title.replace(/'/g, "\\'")}', \`${comp.code.replace(/`/g, '\\`')}\`)">
            💻 View Flutter Code
          </button>
        </div>
      `;

      FlutterSim.renderWidget(comp.simType, 'ds-simple-sim-box');

      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 120);
  },

  // Modal Code Viewer for Design System Components
  openCodeViewerModal: function (title, code) {
    let modal = document.getElementById('code-viewer-modal');
    if (!modal) {
      const div = document.createElement('div');
      div.id = 'code-viewer-modal';
      div.className = 'modal-overlay';
      div.innerHTML = `
        <div class="modal-container" style="max-width:720px;">
          <button class="modal-close" onclick="document.getElementById('code-viewer-modal').classList.remove('active')">✕</button>
          <h3 id="code-modal-title" style="font-size:1.25rem; font-weight:700; color:var(--text-bright); margin-bottom:1rem;">Flutter Widget Code</h3>
          <div style="background:#090d16; border:1px solid var(--border-color); border-radius:12px; padding:1.25rem; max-height:420px; overflow-y:auto; position:relative;">
            <pre><code id="code-modal-content" style="color:#38bdf8; font-family:var(--font-mono); font-size:0.85rem; line-height:1.6; white-space:pre-wrap;"></code></pre>
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:1rem;">
            <button class="btn btn-primary btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('code-modal-content').innerText); App.showToast('Code copied to clipboard!', 'success');">Copy Code</button>
          </div>
        </div>
      `;
      document.body.appendChild(div);
      modal = div;
    }
    document.getElementById('code-modal-title').innerText = title;
    document.getElementById('code-modal-content').innerText = code;
    modal.classList.add('active');
  },

  handleBrandClick: function (e) {
    if (e) e.preventDefault();
    const isAdmin = AuthManager.currentUser && (AuthManager.currentUser.isAdmin || AuthManager.currentUser.role === 'admin' || (AuthManager.currentUser.email && AuthManager.currentUser.email.toLowerCase() === 'admin@admin.com'));
    if (isAdmin) {
      this.switchView('admin-dashboard');
    } else {
      this.switchView('home');
    }
  },

  // View Navigation Router
  switchView: function (viewId) {
    const isAdmin = AuthManager.currentUser && (AuthManager.currentUser.isAdmin || AuthManager.currentUser.role === 'admin' || (AuthManager.currentUser.email && AuthManager.currentUser.email.toLowerCase() === 'admin@admin.com'));
    if (isAdmin && viewId !== 'admin-dashboard') {
      viewId = 'admin-dashboard';
    }

    this.currentView = viewId;
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.style.display = 'none');

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Trigger module renderers on view switch
    if (viewId === 'home') this.animateCounters();
    if (viewId === 'roadmaps') this.renderRoadmaps();
    if (viewId === 'documentation') this.renderDocumentation();
    if (viewId === 'jobs') this.renderJobs();
    if (viewId === 'interview') this.renderInterview();
    if (viewId === 'community') this.renderCommunity();
    if (viewId === 'downloads') this.renderDownloads();
    if (viewId === 'components') this.renderComponentGrid();
    if (viewId === 'ui-screens') this.renderUIScreens();
    if (viewId === 'projects') this.renderProjects();
    if (viewId === 'user-dashboard') Dashboards.renderUserDashboard();
    if (viewId === 'admin-dashboard') Dashboards.renderAdminDashboard();

    // Update Nav Active States & Close Mobile Drawer
    const mobileMenu = document.querySelector('.nav-menu');
    if (mobileMenu) mobileMenu.classList.remove('mobile-open');

    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('onclick')?.includes(viewId)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  toggleMobileMenu: function () {
    const menu = document.querySelector('.nav-menu');
    if (menu) {
      menu.classList.toggle('mobile-open');
    }
  },

  // Animated Numbers Counter (0 -> 1,000+, 500+, 200+, 100+, 5,000+)
  animateCounters: function () {
    const counterElements = document.querySelectorAll('.counter-num');
    if (!counterElements.length) return;

    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '+';
      if (isNaN(target)) return;

      let startTime = null;
      const duration = 1600; // 1.6 seconds animation duration

      function updateNumber(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing cubic curve for smooth counter effect
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        el.innerText = currentVal.toLocaleString('en-US') + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.innerText = target.toLocaleString('en-US') + suffix;
        }
      }

      el.innerText = '0' + suffix;
      requestAnimationFrame(updateNumber);
    });
  },


  toggleTheme: function () {

    const current = document.documentElement.getAttribute('data-theme');

    const next = current === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', next);

    localStorage.setItem('flutterhub_theme', next);

    this.updateThemeToggleIcon(next);

    this.showToast(`Switched to ${next} theme mode`, 'info');

  },

  updateThemeToggleIcon: function (theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark'
        ? `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  },

  componentSearchQuery: '',

  // Category Sidebar Renderer
  renderCategoriesSidebar: function () {
    const container = document.getElementById('category-sidebar-list');
    if (!container) return;

    let html = `
      <div style="padding:0.25rem 0.25rem 0.85rem 0.25rem; margin-bottom:0.85rem; border-bottom:1px solid var(--border-color);">
        <div style="position:relative;">
          <input type="text" id="sidebar-component-search" placeholder="🔍 Search components..." 
            value="${this.escapeHTML(this.componentSearchQuery || '')}"
            oninput="App.handleComponentSearch(this.value)" 
            style="width:100%; background:var(--bg-primary); border:1px solid var(--border-color); color:var(--text-bright); padding:0.55rem 0.85rem 0.55rem 2.2rem; border-radius:10px; font-size:0.85rem;" />
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--text-muted);">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
      </div>

      <button class="cat-btn ${this.activeCategory === 'all' ? 'active' : ''}" onclick="App.filterCategory('all')">
        <span>All Components</span>
        <span class="cat-count">${FLUTTER_DATA.components.length}</span>
      </button>
    `;

    FLUTTER_DATA.categories.forEach(cat => {
      const realCount = FLUTTER_DATA.components.filter(c => c.category === cat.id).length;
      html += `
        <button class="cat-btn ${this.activeCategory === cat.id ? 'active' : ''}" onclick="App.filterCategory('${cat.id}')">
          <span>${cat.name}</span>
          <span class="cat-count">${realCount}</span>
        </button>
      `;
    });

    container.innerHTML = html;
  },

  handleComponentSearch: function (query) {
    this.componentSearchQuery = query;
    this.renderComponentGrid();
  },

  filterCategory: function (catId) {
    this.activeCategory = catId;
    this.renderCategoriesSidebar();
    this.renderComponentGrid();

    // Smoothly scroll component view to top when category changes
    const container = document.getElementById('component-grid-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 110;
      window.scrollTo({ top: targetY > 0 ? targetY : 0, behavior: 'smooth' });
    }
  },

  // Component Grid Renderer
  renderComponentGrid: function () {
    const container = document.getElementById('component-grid-container');
    if (!container) return;

    let list = FLUTTER_DATA.components;
    if (this.activeCategory !== 'all') {
      list = list.filter(c => c.category === this.activeCategory);
    }

    if (this.componentSearchQuery) {
      const q = this.componentSearchQuery.toLowerCase().trim();
      list = list.filter(c =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; padding:4rem; text-align:center; color:var(--text-muted);" class="glass-panel">
          <h3>No components matching "${this.escapeHTML(this.componentSearchQuery || '')}"</h3>
          <p style="margin-top:8px;">Try clearing the search box or selecting 'All Components'.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => this.createComponentCardHTML(c)).join('');

    // Trigger widget simulations
    list.forEach(c => {
      if (c.simType) {
        FlutterSim.renderWidget(c.simType, `sim-${c.id}`);
      }
    });
  },

  createComponentCardHTML: function (c) {
    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;
    const isLocked = c.isPremium && !isPro;
    const isBookmarked = AuthManager.currentUser && AuthManager.currentUser.bookmarks.includes(c.id);

    return `
      <div class="component-card" style="border-radius:20px; overflow:hidden; border:1px solid ${isLocked ? 'rgba(245,158,11,0.3)' : 'var(--border-color)'}; background:var(--bg-secondary); box-shadow:var(--shadow-md);">
        <!-- Top Card Header -->
        <div class="card-header" style="background:var(--bg-secondary); padding:0.85rem 1.25rem; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-subtle);">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-cyan" style="font-size:0.68rem; padding:3px 10px; border-radius:12px; background:rgba(56,189,248,0.12); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);">Component</span>
            <span class="badge ${c.isPremium ? (isPro ? 'badge-emerald' : 'badge-pro') : 'badge-cyan'}" style="font-size:0.65rem; padding:2px 8px;">
              ${c.isPremium ? (isPro ? '✓ UNLOCKED' : c.badge) : 'FREE'}
            </span>
          </div>
          <button onclick="AuthManager.toggleBookmark('${c.id}')" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-color); border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:${isBookmarked ? '#f43f5e' : 'var(--text-muted)'}; cursor:pointer; font-size:14px; transition:all 0.2s ease;" title="Save to Bookmarks">
            ${isBookmarked ? '❤️' : '🤍'}
          </button>
        </div>

        <!-- Tab Switcher Bar -->
        <div class="tab-bar" style="background:var(--bg-tertiary); padding:4px 10px; border-bottom:1px solid var(--border-subtle); display:flex; gap:6px;">
          <button class="tab-btn active" onclick="App.switchCardTab('${c.id}', 'preview', this)">⚡ Interactive Live Preview</button>
          <button class="tab-btn" onclick="App.switchCardTab('${c.id}', 'code', this)">
            💻 Flutter Code ${isLocked ? '🔒' : ''}
          </button>
        </div>

        <!-- Main Card Body Container -->
        <div class="card-body" style="position:relative; background:var(--bg-primary);">
          <!-- Live Preview Tab (Always Interactive for ALL components!) -->
          <div id="tab-preview-${c.id}" class="preview-container" style="min-height:230px; padding:1.5rem; display:flex; align-items:center; justify-content:center; position:relative;">
            <div id="sim-${c.id}" style="width:100%; display:flex; justify-content:center; transition:opacity 0.2s ease;"></div>
          </div>

          <!-- Flutter Code Tab (Locked with PRO Paywall Card for PRO components) -->
          <div id="tab-code-${c.id}" class="code-viewer-container" style="display:none; position:relative; min-height:230px;">
            ${isLocked ? `
              <div style="padding:2.5rem 1.5rem; text-align:center; background:var(--bg-secondary); border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; min-height:230px;">
                <div style="width:48px; height:48px; border-radius:50%; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); display:flex; align-items:center; justify-content:center;">
                  <svg width="24" height="24" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h4 style="color:#fff; font-size:1.1rem; font-weight:800; margin:0;">🔒 Premium Flutter Source Code Locked</h4>
                <p style="color:var(--text-secondary); font-size:0.85rem; max-width:340px; margin:0;">Subscribe to Pro Pass for ₹29/month to copy full Dart source code, widgets & commercial license.</p>
                <button class="btn btn-premium btn-sm" onclick="AuthManager.openPremiumProtectionModal()" style="margin-top:6px;">Unlock Pro Access — ₹29/mo</button>
              </div>
            ` : `
              <button class="btn btn-secondary btn-sm copy-code-btn" onclick="App.copyCode(\`${escape(c.code)}\`)">Copy Code</button>
              <pre><code>${this.escapeHTML(c.code)}</code></pre>
            `}
          </div>
        </div>

        <!-- Bottom Footer -->
        <div style="background:var(--bg-secondary); border-top:1px solid var(--border-color); padding:0.85rem 1.25rem; display:flex; align-items:center; justify-content:space-between;">
          <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-bright); margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:250px;" title="${this.escapeHTML(c.title)}">
            ${this.escapeHTML(c.title)}
          </h4>
          <span style="font-size:0.75rem; font-weight:700; color:var(--accent-cyan-light); background:rgba(56,189,248,0.1); padding:3px 10px; border-radius:12px; border:1px solid rgba(56,189,248,0.2);">
            ⚡ Live Interactive
          </span>
        </div>
      </div>
    `;
  },

  switchCardTab: function (cardId, tab, btn) {
    const prev = document.getElementById(`tab-preview-${cardId}`);
    const code = document.getElementById(`tab-code-${cardId}`);

    if (tab === 'preview') {
      prev.style.display = 'flex';
      code.style.display = 'none';
    } else {
      prev.style.display = 'none';
      code.style.display = 'block';
    }

    const parent = btn.parentElement;
    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  // UI Screens Renderer
  renderUIScreens: function () {
    const container = document.getElementById('ui-screens-grid');
    if (!container) return;

    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;

    container.innerHTML = FLUTTER_DATA.screens.map(s => `
      <div class="component-card">
        <div class="card-header">
          <div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
          </div>
          <span class="badge ${s.isPremium ? (isPro ? 'badge-emerald' : 'badge-pro') : 'badge-cyan'}">
            ${s.isPremium ? (isPro ? '✓ UNLOCKED' : s.badge) : s.badge}
          </span>
        </div>
        <div class="card-body" style="padding:1.5rem;">
          <div class="phone-frame-mockup">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--accent-cyan-light); margin-bottom:8px;">Flutter Mobile Render</div>
              <div style="color:#fff; font-weight:700; font-size:16px; margin-bottom:12px;">${s.title}</div>
              <div style="background:var(--bg-tertiary); padding:12px; border-radius:12px; font-size:12px; color:var(--text-secondary); margin-bottom:12px;">
                Includes full folder architecture, state management & clean controllers.
              </div>
              <button class="btn btn-primary btn-sm" style="width:100%; margin-top:auto;" onclick="${s.isPremium && !isPro ? 'AuthManager.openPremiumProtectionModal()' : `App.copyCode(\`${escape(s.code)}\`)`}">
                ${s.isPremium && !isPro ? 'Unlock Screen Pro ₹29/mo' : 'Download Screen (.dart)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  // Animations Renderer
  renderAnimations: function () {
    const container = document.getElementById('animations-grid');
    if (!container) return;

    container.innerHTML = FLUTTER_DATA.animations.map(a => `
      <div class="glass-panel" style="padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-bright);">${a.title}</h3>
          <span class="badge badge-purple">${a.category}</span>
        </div>
        <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1rem;">${a.description}</p>
        <div class="code-viewer-container" style="max-height:200px;">
          <button class="btn btn-secondary btn-sm copy-code-btn" onclick="App.copyCode(\`${escape(a.code)}\`)">Copy</button>
          <pre><code>${this.escapeHTML(a.code)}</code></pre>
        </div>
      </div>
    `).join('');
  },

  // State Management Renderer
  renderStateManagement: function () {
    const container = document.getElementById('state-management-grid');
    if (!container) return;

    container.innerHTML = FLUTTER_DATA.stateManagement.map(sm => `
      <div class="glass-panel" style="padding:1.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-bright);">${sm.title}</h3>
          <span class="badge badge-cyan">${sm.framework}</span>
        </div>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.25rem;">${sm.description}</p>
        <div class="code-viewer-container">
          <button class="btn btn-secondary btn-sm copy-code-btn" onclick="App.copyCode(\`${escape(sm.code)}\`)">Copy Blueprint</button>
          <pre><code>${this.escapeHTML(sm.code)}</code></pre>
        </div>
      </div>
    `).join('');
  },

  // Projects Renderer
  renderProjects: function (searchQuery = '') {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;
    const q = (searchQuery || '').toLowerCase().trim();
    let list = FLUTTER_DATA.projects;
    if (q) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; padding:3.5rem; text-align:center; color:var(--text-muted);" class="glass-panel">
          <h3>No full projects matching "${this.escapeHTML(searchQuery)}"</h3>
          <p style="margin-top:8px;">Try searching for another app template.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(p => `
      <div class="pricing-card">
        <span class="badge ${p.isPremium ? (isPro ? 'badge-emerald' : 'badge-pro') : 'badge-cyan'}" style="width:fit-content; margin-bottom:1rem;">
          ${p.isPremium ? (isPro ? '✓ UNLOCKED' : p.badge) : 'FREE'}
        </span>
        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-bright);">${p.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin:0.75rem 0 1.5rem;">${p.description}</p>
        <div class="code-viewer-container" style="max-height:160px; margin-bottom:1.5rem;">
          <pre><code>${this.escapeHTML(p.pubspec)}</code></pre>
        </div>
        <button class="btn btn-primary" onclick="${p.isPremium && !isPro ? 'AuthManager.openPremiumProtectionModal()' : `App.showToast('Downloading ${p.title} source code .zip...', 'success')`}">
          ${p.isPremium && !isPro ? 'Unlock Pro Access (.zip)' : '✓ Download Full Project (.zip)'}
        </button>
      </div>
    `).join('');
  },

  // Blog Renderer
  renderBlogs: function () {
    const container = document.getElementById('blogs-grid');
    if (!container) return;

    container.innerHTML = FLUTTER_DATA.blogs.map(b => `
      <div class="glass-panel" style="padding:1.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="badge badge-cyan">${b.tag}</span>
          <span style="font-size:0.8rem; color:var(--text-muted);">${b.readTime}</span>
        </div>
        <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-bright); margin-bottom:0.5rem;">${b.title}</h3>
        <p style="font-size:0.825rem; color:var(--text-muted); margin-bottom:1rem;">By ${b.author} • ${b.date}</p>
        <p style="color:var(--text-secondary); font-size:0.9rem;">${b.content}</p>
      </div>
    `).join('');
  },

  // Roadmaps & 50 Interview Questions Renderer
  renderRoadmaps: function (searchQuery = '') {
    const container = document.getElementById('roadmaps-container');
    if (!container) return;

    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;
    const q = (searchQuery || '').toLowerCase().trim();

    // 1. Filter Questions
    const allQuestions = FLUTTER_DATA.interviewQuestions || [];
    
    // Split questions into unlocked vs locked for non-Pro users
    let displayQuestions = allQuestions;
    if (!isPro) {
      // Free users see Questions 1 - 20 (Beginner & Intermediate Part 1)
      displayQuestions = allQuestions.filter(item => !item.isPremium);
    }

    if (q) {
      displayQuestions = displayQuestions.filter(item =>
        item.question.toLowerCase().includes(q) ||
        item.level.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        `q${item.number}`.includes(q)
      );
    }

    const freeCount = allQuestions.filter(item => !item.isPremium).length;
    const proCount = allQuestions.filter(item => item.isPremium).length;

    // Build Questions List HTML
    const questionsHTML = displayQuestions.map(item => `
      <div class="glass-panel" style="padding:1.35rem; margin-bottom:1rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.6rem;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-cyan" style="font-weight:800; font-size:11px;">Q${item.number}</span>
            <span class="badge ${item.level === 'Beginner' ? 'badge-emerald' : item.level === 'Intermediate' ? 'badge-purple' : 'badge-pro'}" style="font-size:10px;">
              ${item.level} Level
            </span>
          </div>
          <span class="badge badge-emerald" style="font-size:10px;">✓ UNLOCKED</span>
        </div>

        <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-bright); margin-bottom:0.75rem;">
          ${item.number}. ${this.escapeHTML(item.question)}
        </h4>

        <details style="background:var(--bg-tertiary); border:1px solid var(--border-subtle); border-radius:10px; padding:0.85rem 1rem;">
          <summary style="cursor:pointer; font-weight:700; color:var(--accent-cyan-light); font-size:0.875rem;">
            View Concise Answer & Interview Script
          </summary>
          <div style="margin-top:0.75rem; font-size:0.875rem; color:var(--text-secondary); line-height:1.5;">
            <p style="margin-bottom:0.5rem;">${this.escapeHTML(item.answer)}</p>
            ${item.interviewAnswer ? `
              <div style="background:rgba(56,189,248,0.1); border-left:3px solid #38bdf8; padding:8px 12px; border-radius:6px; margin-top:8px; font-weight:600; color:#38bdf8;">
                💡 <strong>Interview script:</strong> "${this.escapeHTML(item.interviewAnswer)}"
              </div>
            ` : ''}
          </div>
        </details>
      </div>
    `).join('');

    // 2. PRO Lock Boxes at the bottom of the list (when user is NOT Pro)
    let proBoxesHTML = '';
    if (!isPro) {
      proBoxesHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-top:1.5rem; margin-bottom:2rem;">
          <!-- Box 1: Intermediate Part 2 (Q21 - Q30) -->
          <div class="glass-panel" style="padding:1.75rem; border-color:rgba(245,158,11,0.4); background:linear-gradient(180deg, rgba(245,158,11,0.06), rgba(15,23,42,0.9)); text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px;">
            <div style="width:48px; height:48px; border-radius:50%; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); display:flex; align-items:center; justify-content:center; font-size:20px;">
              🔒
            </div>
            <span class="badge badge-pro">PRO UNLOCK • QUESTIONS 21 - 30</span>
            <h3 style="font-size:1.2rem; font-weight:800; color:#fff; margin:0;">
              Intermediate Level Part 2 (10 Questions)
            </h3>
            <p style="color:var(--text-secondary); font-size:0.85rem; margin:0; line-height:1.4; max-width:340px;">
              Unlock Navigator 2.0, InheritedWidget, Local Storage (Hive vs SQLite), Dependency Injection, Push Notifications & Performance Optimization Q&A.
            </p>
            <button class="btn btn-premium btn-sm" onclick="AuthManager.openPremiumProtectionModal()" style="margin-top:6px; width:100%;">
              Unlock Intermediate Part 2 — ₹29/mo
            </button>
          </div>

          <!-- Box 2: Advanced Level Masterclass (Q31 - Q50) -->
          <div class="glass-panel" style="padding:1.75rem; border-color:rgba(168,85,247,0.4); background:linear-gradient(180deg, rgba(168,85,247,0.06), rgba(15,23,42,0.9)); text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px;">
            <div style="width:48px; height:48px; border-radius:50%; background:rgba(168,85,247,0.15); border:1px solid rgba(168,85,247,0.4); display:flex; align-items:center; justify-content:center; font-size:20px;">
              ⚡
            </div>
            <span class="badge badge-purple">PRO UNLOCK • QUESTIONS 31 - 50</span>
            <h3 style="font-size:1.2rem; font-weight:800; color:#fff; margin:0;">
              Advanced Architecture Masterclass (20 Questions)
            </h3>
            <p style="color:var(--text-secondary); font-size:0.85rem; margin:0; line-height:1.4; max-width:340px;">
              Unlock Impeller Rendering Engine, Skia, Platform Channels & Pigeon, Dart Isolates, CustomPainter, SSL Pinning & Clean Architecture Q&A.
            </p>
            <button class="btn btn-premium btn-sm" onclick="AuthManager.openPremiumProtectionModal()" style="margin-top:6px; width:100%;">
              Unlock Advanced Masterclass — ₹29/mo
            </button>
          </div>
        </div>
      `;
    }

    // 3. Filter Roadmaps (Step 1 - 4)
    const freeList = (FLUTTER_DATA.roadmaps ? FLUTTER_DATA.roadmaps.free : []).filter(r =>
      !q || r.title.toLowerCase().includes(q) || r.topics.some(t => t.toLowerCase().includes(q))
    );
    const proList = (FLUTTER_DATA.roadmaps ? FLUTTER_DATA.roadmaps.pro : []).filter(r =>
      !q || r.title.toLowerCase().includes(q) || r.topics.some(t => t.toLowerCase().includes(q))
    );

    const roadmapsHTML = `
      <div style="grid-column: 1 / -1; margin-top:2.5rem; margin-bottom:1rem;">
        <h3 style="font-size:1.4rem; font-weight:800; color:var(--text-bright); margin-bottom:0.25rem;">
          🗺️ Zero to Hero Developer Learning Roadmaps
        </h3>
        <p style="color:var(--text-secondary); font-size:0.9rem;">
          Structured 8-week daily learning path from Flutter basics to advanced Clean Architecture.
        </p>
      </div>

      <div>
        <h4 style="font-size:1.15rem; font-weight:700; color:#38bdf8; margin-bottom:1rem;">Free Starter Roadmaps (${freeList.length})</h4>
        ${freeList.map(r => `
          <div class="glass-panel" style="padding:1.5rem; margin-bottom:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="badge badge-cyan">STEP ${r.step} • ${r.duration}</span>
              <span style="font-size:0.8rem; color:var(--text-muted);">${r.level}</span>
            </div>
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-bright); margin-bottom:0.75rem;">${r.title}</h3>
            <ul style="list-style:disc; padding-left:1.2rem; color:var(--text-secondary); font-size:0.85rem;">
              ${r.topics.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div>
        <h4 style="font-size:1.15rem; font-weight:700; color:#f59e0b; margin-bottom:1rem;">Pro Developer Path (${proList.length})</h4>
        ${proList.map(r => `
          <div class="glass-panel" style="padding:1.5rem; margin-bottom:1rem; border-color:rgba(245,158,11,0.3);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="badge badge-pro">PRO STEP ${r.step} • ${r.duration}</span>
              <span style="font-size:0.8rem; color:#f59e0b; font-weight:700;">${r.level}</span>
            </div>
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-bright); margin-bottom:0.75rem;">${r.title}</h3>
            <ul style="list-style:disc; padding-left:1.2rem; color:var(--text-secondary); font-size:0.85rem;">
              ${r.topics.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = `
      <div style="grid-column: 1 / -1; margin-bottom:1rem;">
        <div style="background:linear-gradient(135deg, rgba(56,189,248,0.1), rgba(168,85,247,0.1)); border:1px solid rgba(56,189,248,0.3); border-radius:16px; padding:1.5rem; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem;">
          <div>
            <h3 style="font-size:1.3rem; font-weight:800; color:#fff; margin:0 0 4px;">
              📖 50 Flutter Interview Questions & Answers Guide
            </h3>
            <p style="color:var(--text-secondary); font-size:0.875rem; margin:0;">
              ${isPro ? '<strong>✓ PRO UNLOCKED</strong>: All 50 Questions & Answers fully available!' : '<strong>Beginner (1-10) & Intermediate (11-20)</strong>: 100% FREE • Scroll to bottom for <strong>Intermediate Part 2 & Advanced PRO Boxes</strong>'}
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <span class="badge badge-emerald" style="font-size:11px; padding:6px 12px;">${isPro ? '50 / 50 Unlocked' : `${freeCount} Free Questions`}</span>
            ${!isPro ? `<span class="badge badge-pro" style="font-size:11px; padding:6px 12px;">${proCount} Pro Questions</span>` : ''}
          </div>
        </div>
      </div>

      <div style="grid-column: 1 / -1;">
        ${questionsHTML || '<p style="color:var(--text-muted); padding:2rem; text-align:center;">No interview questions match your search query.</p>'}
        ${proBoxesHTML}
      </div>

      ${roadmapsHTML}
    `;
  },

  // Documentation Renderer
  renderDocumentation: function (searchQuery = '') {
    const container = document.getElementById('documentation-container');
    if (!container) return;

    const q = (searchQuery || '').toLowerCase().trim();
    let list = FLUTTER_DATA.documentation;
    if (q) {
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        (d.bestPractices && d.bestPractices.toLowerCase().includes(q)) ||
        (d.performanceTips && d.performanceTips.toLowerCase().includes(q)) ||
        (d.exampleCode && d.exampleCode.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; padding:3.5rem; text-align:center; color:var(--text-muted);" class="glass-panel">
          <h3>No widget docs matching "${this.escapeHTML(searchQuery)}"</h3>
          <p style="margin-top:8px;">Try searching for another widget (e.g. ListView, CustomPainter, StreamBuilder).</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(d => `
      <div class="glass-panel" style="padding:1.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-bright);">${d.title}</h3>
          <span class="badge ${d.isPremium ? 'badge-pro' : 'badge-cyan'}">${d.isPremium ? 'PRO GUIDE' : d.category}</span>
        </div>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1rem;">${d.description}</p>
        <div style="background:var(--bg-tertiary); padding:1rem; border-radius:10px; font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
          <strong style="color:var(--text-bright);">Best Practice:</strong> ${d.bestPractices}<br/>
          <strong style="color:#f43f5e; display:inline-block; margin-top:4px;">Performance Tip:</strong> ${d.performanceTips}
        </div>
        <div class="code-viewer-container" style="max-height:180px;">
          <button class="btn btn-secondary btn-sm copy-code-btn" onclick="App.copyCode(\`${escape(d.exampleCode)}\`)">Copy</button>
          <pre><code>${this.escapeHTML(d.exampleCode)}</code></pre>
        </div>
      </div>
    `).join('');
  },

  // Jobs Board Renderer
  renderJobs: function (searchQuery = '') {
    const container = document.getElementById('jobs-container');
    if (!container) return;

    const q = (searchQuery || '').toLowerCase().trim();
    let list = FLUTTER_DATA.jobs;
    if (q) {
      list = list.filter(j =>
        (j.company && j.company.toLowerCase().includes(q)) ||
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.location && j.location.toLowerCase().includes(q)) ||
        (j.salary && j.salary.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; padding:3.5rem; text-align:center; color:var(--text-muted);" class="glass-panel">
          <h3>No job openings matching "${this.escapeHTML(searchQuery)}"</h3>
          <p style="margin-top:8px;">Try searching for Remote, Senior, or India.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(j => `
      <div class="pricing-card" style="padding:1.5rem;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:1rem;">
          <div style="width:40px; height:40px; border-radius:10px; background:${j.logoBg}; color:#000; font-weight:800; display:flex; align-items:center; justify-content:center;">
            ${j.company[0]}
          </div>
          <div>
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-bright);">${j.company}</h4>
            <span style="font-size:0.8rem; color:var(--text-muted);">${j.location}</span>
          </div>
        </div>
        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-bright); margin-bottom:0.5rem;">${j.title}</h3>
        <p style="color:var(--accent-cyan-light); font-weight:700; font-size:0.9rem; margin-bottom:1rem;">${j.salary}</p>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:1.25rem;">
          ${(j.tags || []).map(t => `<span class="badge badge-purple" style="font-size:10px;">${t}</span>`).join('')}
        </div>
        <a href="${j.applyUrl}" target="_blank" class="btn btn-primary btn-sm" style="width:100%; text-align:center;">Apply Now</a>
      </div>
    `).join('');
  },

  // Interview Hub Renderer
  renderInterview: function () {
    const mcqsContainer = document.getElementById('interview-mcqs-container');
    const companyContainer = document.getElementById('interview-company-container');

    if (mcqsContainer) mcqsContainer.innerHTML = InterviewHub.renderMCQsHTML();
    if (companyContainer) companyContainer.innerHTML = InterviewHub.renderCompanyQuestionsHTML();
  },

  // Community Renderer
  renderCommunity: function () {
    const groupsContainer = document.getElementById('community-groups-list');
    if (groupsContainer) {
      groupsContainer.innerHTML = FLUTTER_DATA.communityGroups.map(g => `
        <button class="cat-btn ${CommunityManager.activeGroup === g.name ? 'active' : ''}" style="text-align:left; display:flex; justify-content:space-between; width:100%;" onclick="CommunityManager.activeGroup = '${g.name}'; CommunityManager.renderFeed();">
          <span>${g.name}</span>
          <span class="cat-count">${g.members}</span>
        </button>
      `).join('');
    }
    CommunityManager.renderFeed();
  },

  // Downloads Renderer
  renderDownloads: function () {
    const container = document.getElementById('downloads-container');
    if (!container) return;

    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;
    const list = FLUTTER_DATA.downloads || [];

    container.innerHTML = list.map(d => `
      <div class="glass-panel" style="padding:1.5rem; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1rem;">
        <div>
          <span class="badge ${d.isPremium ? (isPro ? 'badge-emerald' : 'badge-pro') : 'badge-cyan'}" style="margin-bottom:6px;">
            ${d.isPremium ? (isPro ? '✓ UNLOCKED' : 'PRO PASS (₹29/MO)') : 'FREE'}
          </span>
          <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-bright); margin-bottom:4px;">${this.escapeHTML(d.title)}</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 6px;">${this.escapeHTML(d.description || '')}</p>
          <span style="font-size:0.8rem; color:var(--text-muted);">${d.fileSize ? `File Size: ${d.fileSize}` : ''}</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="${d.isPremium && !isPro ? 'AuthManager.openPremiumProtectionModal()' : `App.showToast('Downloading ${this.escapeHTML(d.title)}...', 'success')`}">
          ${d.isPremium && !isPro ? 'Unlock Pro Access' : 'Download Resource'}
        </button>
      </div>
    `).join('');
  },

  // Search Modal Handler
  openSearchModal: function () {
    const modal = document.getElementById('search-modal');
    if (modal) {
      modal.classList.add('active');
      document.getElementById('global-search-input')?.focus();
    }
  },

  closeSearchModal: function () {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.remove('active');
  },

  handleSearchInput: function (query) {
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    if (!query.trim()) {
      resultsContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted);">Type to search across 1,000+ Flutter resources...</div>`;
      return;
    }

    const q = query.toLowerCase();
    const matchedComps = FLUTTER_DATA.components.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));

    if (matchedComps.length === 0) {
      resultsContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted);">No matching Flutter components found for "${query}"</div>`;
      return;
    }

    resultsContainer.innerHTML = matchedComps.map(c => `
      <div style="padding:0.85rem; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="App.closeSearchModal(); App.switchView('components'); App.filterCategory('${c.category}');">
        <div>
          <div style="font-weight:700; color:var(--text-bright);">${c.title}</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">${c.description}</div>
        </div>
        <span class="badge badge-cyan">${c.category}</span>
      </div>
    `).join('');
  },

  // Utility Copy Code Handler
  copyCode: function (escapedCode) {
    const unescaped = unescape(escapedCode);
    navigator.clipboard.writeText(unescaped).then(() => {
      this.showToast('Copied Flutter code to clipboard! 📋', 'success');
    });
  },

  escapeHTML: function (str) {
    return str.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  // Toast System
  showToast: function (message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Bootstrap App when DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
