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
        this.closeSearchModal();
        PaymentGateway.closeCheckout();
      }
    });

    console.log("🚀 FlutterHub Engine Initialized!");
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

    // Trigger module renderers on view switch
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

    // Update Nav Active States
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('onclick')?.includes(viewId)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
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
    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;
    const isLocked = c.isPremium && !isPro;
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
            <span class="badge ${c.isPremium ? (isPro ? 'badge-emerald' : 'badge-pro') : 'badge-cyan'}">
              ${c.isPremium ? (isPro ? '✓ UNLOCKED' : c.badge) : c.badge}
            </span>
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
              <button class="btn btn-primary btn-sm" style="width:100%; margin-top:auto;" onclick="${s.isPremium && !isPro ? 'PaymentGateway.openCheckout()' : `App.copyCode(\`${escape(s.code)}\`)`}">
                ${s.isPremium && !isPro ? 'Unlock Screen ₹29/mo' : 'Download Screen (.dart)'}
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
  renderProjects: function () {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    const isPro = AuthManager.currentUser && AuthManager.currentUser.isPro;

    container.innerHTML = FLUTTER_DATA.projects.map(p => `
      <div class="pricing-card">
        <span class="badge ${p.isPremium ? (isPro ? 'badge-emerald' : 'badge-pro') : 'badge-cyan'}" style="width:fit-content; margin-bottom:1rem;">
          ${p.isPremium ? (isPro ? '✓ UNLOCKED' : p.badge) : 'FREE'}
        </span>
        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-bright);">${p.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin:0.75rem 0 1.5rem;">${p.description}</p>
        <div class="code-viewer-container" style="max-height:160px; margin-bottom:1.5rem;">
          <pre><code>${this.escapeHTML(p.pubspec)}</code></pre>
        </div>
        <button class="btn btn-primary" onclick="${p.isPremium && !isPro ? 'PaymentGateway.openCheckout()' : `App.showToast('Downloading ${p.title} source code .zip...', 'success')`}">
          ${p.isPremium && !isPro ? 'Get Pro Access to Download (.zip)' : '✓ Download Full Project (.zip)'}
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

  // Roadmaps Renderer
  renderRoadmaps: function () {
    const container = document.getElementById('roadmaps-container');
    if (!container) return;

    const freeHtml = FLUTTER_DATA.roadmaps.free.map(r => `
      <div class="glass-panel" style="padding:1.5rem; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span class="badge badge-cyan">STEP ${r.step} • ${r.duration}</span>
          <span style="font-size:0.8rem; color:var(--text-muted);">${r.level}</span>
        </div>
        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-bright); margin-bottom:0.75rem;">${r.title}</h3>
        <ul style="list-style:disc; padding-left:1.2rem; color:var(--text-secondary); font-size:0.85rem;">
          ${r.topics.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const proHtml = FLUTTER_DATA.roadmaps.pro.map(r => `
      <div class="glass-panel" style="padding:1.5rem; margin-bottom:1rem; border-color:rgba(245,158,11,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span class="badge badge-pro">PRO STEP ${r.step} • ${r.duration}</span>
          <span style="font-size:0.8rem; color:#f59e0b; font-weight:700;">${r.level}</span>
        </div>
        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-bright); margin-bottom:0.75rem;">${r.title}</h3>
        <ul style="list-style:disc; padding-left:1.2rem; color:var(--text-secondary); font-size:0.85rem;">
          ${r.topics.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    container.innerHTML = `
      <div>
        <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-bright); margin-bottom:1rem;">Free Basic Roadmap</h3>
        ${freeHtml}
      </div>
      <div>
        <h3 style="font-size:1.2rem; font-weight:700; color:#f59e0b; margin-bottom:1rem;">Pro 30-Day Calendar Path (₹29/mo)</h3>
        ${proHtml}
      </div>
    `;
  },

  // Documentation Renderer
  renderDocumentation: function () {
    const container = document.getElementById('documentation-container');
    if (!container) return;

    container.innerHTML = FLUTTER_DATA.documentation.map(d => `
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
  renderJobs: function () {
    const container = document.getElementById('jobs-container');
    if (!container) return;

    container.innerHTML = FLUTTER_DATA.jobs.map(j => `
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
          ${j.tags.map(t => `<span class="badge badge-purple" style="font-size:10px;">${t}</span>`).join('')}
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

    container.innerHTML = FLUTTER_DATA.downloads.map(d => `
      <div class="glass-panel" style="padding:1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span class="badge ${d.isPremium ? (isPro ? 'badge-emerald' : 'badge-pro') : 'badge-cyan'}" style="margin-bottom:6px;">
            ${d.isPremium ? (isPro ? '✓ UNLOCKED' : 'PRO (₹29/MO)') : 'FREE'}
          </span>
          <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-bright); margin-bottom:4px;">${d.title}</h4>
          <span style="font-size:0.8rem; color:var(--text-muted);">${d.category} • Format: ${d.format}</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="${d.isPremium && !isPro ? 'PaymentGateway.openCheckout()' : `App.showToast('Downloading ${d.title}...', 'success')`}">
          ${d.isPremium && !isPro ? 'Unlock ₹29' : 'Download'}
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
