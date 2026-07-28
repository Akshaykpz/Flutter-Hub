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


    this.renderCategoriesSidebar();
    this.renderComponentGrid();
    this.renderUIScreens();
    this.renderAnimations();
    this.renderStateManagement();
    this.renderProjects();
    this.renderBlogs();


    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
      }
      if (e.key === 'Escape') {
        this.closeSearchModal();
        PaymentGateway.closeCheckout();
      }
    });

    // 5. Initial Sim Render
    FlutterSim.renderWidget('glass_button', 'hero-widget-sim');

    console.log("🚀 FlutterHub Engine Initialized!");
  },

  // View Navigation Router
  switchView: function (viewId) {
    this.currentView = viewId;
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.style.display = 'none');

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Nav Active States
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('onclick')?.includes(viewId)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (viewId === 'user-dashboard') {
      Dashboards.renderUserDashboard();
    } else if (viewId === 'admin-dashboard') {
      Dashboards.renderAdminDashboard();
    }
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

  // Category Sidebar Renderer
  renderCategoriesSidebar: function () {
    const container = document.getElementById('category-sidebar-list');
    if (!container) return;

    let html = `
      <button class="cat-btn ${this.activeCategory === 'all' ? 'active' : ''}" onclick="App.filterCategory('all')">
        <span>All Components</span>
        <span class="cat-count">${FLUTTER_DATA.components.length}</span>
      </button>
    `;

    FLUTTER_DATA.categories.forEach(cat => {
      html += `
        <button class="cat-btn ${this.activeCategory === cat.id ? 'active' : ''}" onclick="App.filterCategory('${cat.id}')">
          <span>${cat.name}</span>
          <span class="cat-count">${cat.count}</span>
        </button>
      `;
    });

    container.innerHTML = html;
  },

  filterCategory: function (catId) {
    this.activeCategory = catId;
    this.renderCategoriesSidebar();
    this.renderComponentGrid();
  },

  // Component Grid Renderer
  renderComponentGrid: function () {
    const container = document.getElementById('component-grid-container');
    if (!container) return;

    let list = FLUTTER_DATA.components;
    if (this.activeCategory !== 'all') {
      list = list.filter(c => c.category === this.activeCategory);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; padding:4rem; text-align:center; color:var(--text-muted);" class="glass-panel">
          <h3>No components found in this category</h3>
          <p style="margin-top:8px;">Try selecting 'All Components' to view available snippets.</p>
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
    const isLocked = c.isPremium && (!AuthManager.currentUser || !AuthManager.currentUser.isPro);
    const isBookmarked = AuthManager.currentUser && AuthManager.currentUser.bookmarks.includes(c.id);

    return `
      <div class="component-card">
        <div class="card-header">
          <div class="card-title-group">
            <h3>${c.title}</h3>
            <p>${c.description}</p>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button onclick="AuthManager.toggleBookmark('${c.id}')" style="background:none; border:none; color:${isBookmarked ? '#f43f5e' : 'var(--text-muted)'}; cursor:pointer; font-size:18px;">
              ${isBookmarked ? '❤️' : '🤍'}
            </button>
            <span class="badge ${c.isPremium ? 'badge-pro' : 'badge-cyan'}">${c.badge}</span>
          </div>
        </div>

        <div class="tab-bar">
          <button class="tab-btn active" onclick="App.switchCardTab('${c.id}', 'preview', this)">Preview</button>
          <button class="tab-btn" onclick="App.switchCardTab('${c.id}', 'code', this)">Flutter Code</button>
        </div>

        <div class="card-body">
          <div id="tab-preview-${c.id}" class="preview-container">
            <div id="sim-${c.id}"></div>
          </div>

          <div id="tab-code-${c.id}" class="code-viewer-container" style="display:none;">
            ${isLocked ? `
              <div style="padding:3rem 1.5rem; text-align:center; background:rgba(9,13,22,0.95); position:absolute; inset:0; z-index:10; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;">
                <svg width="36" height="36" fill="none" stroke="#f59e0b" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h4 style="color:#fff; font-size:1.1rem; font-weight:700;">Premium Flutter Code Locked</h4>
                <p style="color:var(--text-secondary); font-size:0.85rem; max-width:320px;">Subscribe for ₹29/month to unlock instant source code copy, download, and commercial license!</p>
                <button class="btn btn-premium btn-sm" onclick="PaymentGateway.openCheckout()">Unlock Pro ₹29/mo</button>
              </div>
            ` : ''}
            <button class="btn btn-secondary btn-sm copy-code-btn" onclick="App.copyCode(\`${escape(c.code)}\`)">Copy Code</button>
            <pre><code>${this.escapeHTML(c.code)}</code></pre>
          </div>
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

    container.innerHTML = FLUTTER_DATA.screens.map(s => `
      <div class="component-card">
        <div class="card-header">
          <div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
          </div>
          <span class="badge ${s.isPremium ? 'badge-pro' : 'badge-cyan'}">${s.badge}</span>
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
              <button class="btn btn-primary btn-sm" style="width:100%; margin-top:auto;" onclick="App.copyCode(\`${escape(s.code)}\`)">Download Screen (.dart)</button>
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
  renderProjects: function () {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = FLUTTER_DATA.projects.map(p => `
      <div class="pricing-card">
        <span class="badge badge-pro" style="width:fit-content; margin-bottom:1rem;">${p.badge}</span>
        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-bright);">${p.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin:0.75rem 0 1.5rem;">${p.description}</p>
        <div class="code-viewer-container" style="max-height:160px; margin-bottom:1.5rem;">
          <pre><code>${this.escapeHTML(p.pubspec)}</code></pre>
        </div>
        <button class="btn btn-primary" onclick="PaymentGateway.openCheckout()">Download Full Source Code (.zip)</button>
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
