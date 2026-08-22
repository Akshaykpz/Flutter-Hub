/* ==========================================================================
   FlutterHub Package Directory — Frontend View Controller (Upgraded)
   - Uncrowded package cards with equal height & clear hierarchy
   - Clean white sidebar text & responsive mobile dropdown
   - Dedicated Package Detail page with browser back navigation
   - Free (8 max) + Pro (Unlimited) access control & upgrade teaser
   ========================================================================== */

const PackagesView = (function () {

  /* ── State ─────────────────────────────────────────────────── */
  const state = {
    packages: [],
    lockedTeasers: [],
    categories: [],
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'popularity',
    page: 1,
    limit: 8,
    total: 0,
    totalCatalog: 0,
    hasMore: false,
    loading: false,
    error: null,
    isPro: false,
    selectedPkg: null,
    initialized: false,
  };

  /* ── Helpers ───────────────────────────────────────────────── */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getAuthHeader() {
    if (window.AuthManager && AuthManager.currentUser && AuthManager.currentUser.token) {
      return { 'Authorization': `Bearer ${AuthManager.currentUser.token}` };
    }
    return {};
  }

  function checkUserIsPro() {
    return !!(window.AuthManager && AuthManager.currentUser && AuthManager.currentUser.isPro);
  }

  /* ── API Data Fetching ─────────────────────────────────────── */
  async function fetchCategories() {
    try {
      const res = await fetch('/api/packages/categories', {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.categories) {
          state.categories = data.categories;
          return;
        }
      }
    } catch (e) {}

    if (window.PACKAGES_DATA && PACKAGES_DATA.categories) {
      state.categories = PACKAGES_DATA.categories;
    }
  }

  async function fetchPackages(append = false) {
    if (state.loading) return;
    state.loading = true;

    if (!append) {
      state.page = 1;
      state.packages = [];
      state.lockedTeasers = [];
    }

    const userIsPro = checkUserIsPro();
    const limit = userIsPro ? 12 : 8;

    const params = new URLSearchParams({
      page: state.page,
      limit: limit,
      category: state.activeCategory,
      sort: state.sortBy,
    });
    if (state.searchQuery) params.set('q', state.searchQuery);

    try {
      const res = await fetch(`/api/packages?${params}`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
      });

      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'API failed to load packages');

      state.isPro        = data.is_pro || userIsPro;
      state.totalCatalog = data.pagination?.total_catalog || 0;
      state.total        = data.pagination?.total || 0;
      state.hasMore      = data.pagination?.has_more || false;
      state.lockedTeasers = data.locked_teasers || [];

      if (append) {
        state.packages = [...state.packages, ...(data.packages || [])];
      } else {
        state.packages = data.packages || [];
      }

      state.error = null;

    } catch (err) {
      console.warn('[PackagesView] API fetch notice:', err.message);

      if (window.PACKAGES_DATA && PACKAGES_DATA.packages && PACKAGES_DATA.packages.length > 0) {
        let list = [...PACKAGES_DATA.packages];
        if (state.activeCategory !== 'all') {
          list = list.filter(p => p.category === state.activeCategory);
        }
        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          list = list.filter(p => p.name.toLowerCase().includes(q) || (p.tagline && p.tagline.toLowerCase().includes(q)));
        }

        const freeList = userIsPro ? list : list.filter(p => !p.isPremium).slice(0, 8);
        state.packages = freeList;
        state.total = freeList.length;
        state.totalCatalog = list.length;
        state.isPro = userIsPro;
        state.error = null;
      } else {
        state.error = err.message;
      }
    } finally {
      state.loading = false;
    }
  }

  /* ── Renderers ─────────────────────────────────────────────── */
  function renderHeroStats() {
    const el = document.getElementById('pkg-hero-stats');
    if (!el) return;
    const userIsPro = state.isPro || checkUserIsPro();
    const totalCount = state.totalCatalog || 24;

    el.innerHTML = `
      <div class="pkg-hero-stat">
        <span class="pkg-hero-stat-num">${totalCount}+</span>
        <span class="pkg-hero-stat-label">Curated Packages</span>
      </div>
      <div class="pkg-hero-stat">
        <span class="pkg-hero-stat-num">15</span>
        <span class="pkg-hero-stat-label">Categories</span>
      </div>
      <div class="pkg-hero-stat">
        <span class="pkg-hero-stat-num">${userIsPro ? '100%' : '8 Free'}</span>
        <span class="pkg-hero-stat-label">${userIsPro ? 'Pro Unlocked' : 'Instant Access'}</span>
      </div>
    `;
  }

  function renderCategorySidebar() {
    const el = document.getElementById('pkg-category-sidebar');
    const mobileSelect = document.getElementById('pkg-mobile-cat-select');

    const cats = state.categories.length > 0
      ? state.categories
      : (window.PACKAGES_DATA ? PACKAGES_DATA.categories : []);

    const userIsPro = state.isPro || checkUserIsPro();

    // Desktop Sidebar
    if (el) {
      el.innerHTML = `
        <div class="pkg-sidebar-heading">Categories</div>
        <nav class="pkg-cat-nav">
          ${cats.map(cat => {
            const isActive = state.activeCategory === cat.id;
            const count = cat.count !== undefined ? cat.count : (cat.total_in_catalog || '');
            return `
              <button
                class="pkg-cat-btn ${isActive ? 'active' : ''}"
                onclick="PackagesView.selectCategory('${cat.id}')"
                data-cat="${cat.id}">
                <div style="display:flex; align-items:center; min-width:0;">
                  <span class="pkg-cat-btn-icon">${cat.icon || '📦'}</span>
                  <span class="pkg-cat-btn-name">${esc(cat.name)}</span>
                </div>
                <span class="pkg-cat-btn-count">${count}</span>
              </button>
            `;
          }).join('')}
        </nav>
        ${!userIsPro ? `
          <div class="glass-panel" style="margin-top:1.5rem; padding:1.25rem; border-radius:14px; border:1px solid rgba(245,158,11,0.3); text-align:center; background:linear-gradient(180deg, rgba(245,158,11,0.06) 0%, rgba(15,23,42,0.9) 100%);">
            <div style="font-size:22px; margin-bottom:4px;">👑</div>
            <h4 style="font-size:0.9rem; font-weight:800; color:#fff; margin-bottom:4px;">FlutterHub Pro</h4>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">Unlock all 15 categories & 1,000+ packages.</p>
            <button class="btn btn-premium btn-sm" onclick="PaymentGateway.openCheckout()" style="width:100%; font-size:0.75rem; justify-content:center;">Get Pro — ₹29/mo</button>
          </div>
        ` : ''}
      `;
    }

    // Mobile Select Dropdown
    if (mobileSelect) {
      mobileSelect.innerHTML = cats.map(cat => `
        <option value="${cat.id}" ${state.activeCategory === cat.id ? 'selected' : ''}>
          ${cat.icon || '📦'} ${esc(cat.name)} (${cat.count || ''})
        </option>
      `).join('');
    }
  }

  function renderToolbar() {
    const el = document.getElementById('pkg-toolbar');
    if (!el) return;

    const userIsPro = state.isPro || checkUserIsPro();
    const currentCatObj = (state.categories || []).find(c => c.id === state.activeCategory);
    const catName = currentCatObj ? currentCatObj.name : 'All Packages';

    el.innerHTML = `
      <div class="pkg-toolbar-inner">
        <!-- Search bar with proper padding and icon -->
        <div class="pkg-search-wrap">
          <svg class="pkg-search-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            id="pkg-search-input"
            type="text"
            class="pkg-search-input"
            placeholder="${userIsPro ? 'Search Flutter packages (e.g. riverpod, dio, lottie)...' : 'Search 8 free packages (e.g. provider, http, intl)...'}"
            value="${esc(state.searchQuery)}"
            oninput="PackagesView.onSearch(this.value)"
            autocomplete="off"
          />
          ${state.searchQuery ? `
            <button class="pkg-search-clear" onclick="PackagesView.clearSearch()" title="Clear search">✕</button>
          ` : ''}
        </div>

        <!-- Sort By Dropdown -->
        <div class="pkg-sort-wrap">
          <label class="pkg-sort-label" for="pkg-sort-select">Sort by:</label>
          <select id="pkg-sort-select" class="pkg-sort-select" onchange="PackagesView.onSort(this.value)">
            <option value="popularity" ${state.sortBy === 'popularity' ? 'selected' : ''}>🔥 Popularity</option>
            <option value="likes" ${state.sortBy === 'likes' ? 'selected' : ''}>❤️ Most Liked</option>
            <option value="downloads" ${state.sortBy === 'downloads' ? 'selected' : ''}>📥 Most Downloads</option>
            <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>🆕 Latest Version</option>
            <option value="name_asc" ${state.sortBy === 'name_asc' ? 'selected' : ''}>🔤 Name (A-Z)</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Row & Badge Alignment -->
      <div class="pkg-active-filters">
        <div class="pkg-filter-badge">
          Category: <strong>${esc(catName)}</strong>
          ${state.activeCategory !== 'all' ? `<button onclick="PackagesView.selectCategory('all')" title="Reset to All">✕</button>` : ''}
        </div>
        <div>
          ${userIsPro ? `
            <span class="badge badge-emerald" style="font-size:0.75rem; padding:4px 10px;">💎 PRO UNLIMITED ACCESS</span>
          ` : `
            <span class="badge badge-cyan" style="font-size:0.75rem; padding:4px 10px;">🎯 8 FREE PACKAGES ACTIVE</span>
          `}
        </div>
      </div>
    `;
  }

  function renderCard(pkg) {
    const isProUser = state.isPro || checkUserIsPro();
    const isLocked = pkg.isPremium && !isProUser;

    return `
      <div class="pkg-card ${isLocked ? 'pkg-card--locked' : ''}" id="pkgcard-${esc(pkg.id)}" key="${esc(pkg.id)}">
        <!-- Top row: Icon + Category + Badge -->
        <div class="pkg-card-top">
          <div class="pkg-card-icon-area">
            <div class="pkg-card-icon" style="background:${pkg.iconBg || 'var(--bg-tertiary)'}">
              ${pkg.icon || '📦'}
            </div>
            <div class="pkg-card-cat-meta">
              <span class="pkg-badge--cat">${esc((pkg.category || '').replace('_',' '))}</span>
              <span class="pkg-card-version-tag">v${esc(pkg.version)}</span>
            </div>
          </div>
          <div>
            ${isLocked ? `
              <span class="badge badge-pro">🔒 PRO</span>
            ` : `
              <span class="badge ${pkg.isPremium ? 'badge-emerald' : 'badge-cyan'}">
                ${pkg.isPremium ? '✓ PRO' : 'FREE'}
              </span>
            `}
          </div>
        </div>

        <!-- Package Name & Tagline -->
        <div class="pkg-card-body">
          <h3 class="pkg-card-name">${esc(pkg.name)}</h3>
          <p class="pkg-card-tagline">${esc(pkg.tagline || pkg.description)}</p>
        </div>

        <!-- Statistics Row: Likes, Points, Popularity, Downloads -->
        <div class="pkg-card-stats">
          <span class="pkg-stat" title="Likes on pub.dev">
            ❤️ ${pkg.likes ? pkg.likes.toLocaleString() : '1k+'}
          </span>
          <span class="pkg-stat" title="Pub Points">
            ⭐ ${pkg.pubPoints || 160}/160
          </span>
          <span class="pkg-stat" title="Popularity on pub.dev">
            📈 ${pkg.popularity || 99}%
          </span>
          ${pkg.downloads ? `
            <span class="pkg-stat" title="Downloads">
              📥 ${pkg.downloads}
            </span>
          ` : ''}
        </div>

        <!-- Card Footer Action (Equal height aligned) -->
        <div class="pkg-card-footer">
          <button
            class="btn ${isLocked ? 'btn-secondary' : 'btn-primary'} pkg-view-btn"
            onclick="PackagesView.openDetail('${esc(pkg.id)}')">
            ${isLocked ? '🔒 View Package (Pro)' : '⚡ View Package'}
          </button>
        </div>
      </div>
    `;
  }

  function renderProUpgradeSection() {
    const totalCount = state.totalCatalog || 24;
    const lockedCount = Math.max(10, totalCount - 8);

    return `
      <div class="pkg-pro-unlock-container">
        <div class="glass-panel pkg-pro-card">
          <div class="pkg-pro-badge-crown">👑</div>
          <span class="badge badge-pro" style="margin-bottom:0.75rem;">FLUTTERHUB PRO DIRECTORY</span>
          <h2 style="font-size:1.85rem; font-weight:800; color:#fff; margin-bottom:0.5rem;">Unlock More Flutter Packages</h2>
          <p style="color:var(--text-secondary); font-size:1rem; max-width:600px; margin:0 auto 1.5rem; line-height:1.6;">
            Discover thousands of Flutter & Dart packages with <strong>Flutter Hub Pro</strong>. Browse thousands of packages, advanced search, categories, and complete package details.
          </p>
          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:1.75rem; margin-bottom:2rem; font-size:0.9rem; color:var(--text-primary);">
            <span>✓ <strong>${lockedCount}+</strong> Additional Packages</span>
            <span>✓ Full Category Discovery</span>
            <span>✓ 1,000+ UI Components</span>
            <span>✓ Commercial License</span>
          </div>
          <button class="btn btn-premium btn-lg" onclick="PaymentGateway.openCheckout()" style="padding:0.9rem 2.5rem; font-weight:800; border-radius:12px; font-size:1rem;">
            💎 Upgrade to Pro — ₹29/month
          </button>
        </div>
      </div>
    `;
  }

  function renderSkeletons(n = 6) {
    return Array.from({ length: n }, () => `
      <div class="pkg-card" style="opacity:0.6; pointer-events:none;">
        <div class="pkg-card-top">
          <div style="width:46px;height:46px;background:var(--bg-tertiary);border-radius:12px;"></div>
          <div style="width:60px;height:20px;background:var(--bg-tertiary);border-radius:99px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin:1rem 0;">
          <div style="width:50%;height:20px;background:var(--bg-tertiary);border-radius:6px;"></div>
          <div style="width:90%;height:14px;background:var(--bg-tertiary);border-radius:6px;"></div>
        </div>
        <div style="margin-top:auto;width:100%;height:40px;background:var(--bg-tertiary);border-radius:10px;"></div>
      </div>
    `).join('');
  }

  function renderEmpty(type, query = '') {
    if (type === 'error') {
      return `
        <div class="pkg-empty-state" style="grid-column:1/-1; padding:4rem 2rem; text-align:center;">
          <div style="font-size:3rem; margin-bottom:1rem;">⚠️</div>
          <h3 style="font-size:1.3rem; font-weight:800; color:#fff; margin-bottom:0.5rem;">Something went wrong</h3>
          <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem; max-width:400px; margin-left:auto; margin-right:auto;">
            Package data could not be loaded from the server. Please verify your connection or click Retry.
          </p>
          <button class="btn btn-primary btn-md" onclick="PackagesView.render()" style="border-radius:10px; padding:0.65rem 1.8rem;">
            🔄 Retry Loading Packages
          </button>
        </div>
      `;
    }

    return `
      <div class="pkg-empty-state" style="grid-column:1/-1; padding:4rem 2rem; text-align:center;">
        <div style="font-size:3rem; margin-bottom:1rem;">🔍</div>
        <h3 style="font-size:1.3rem; font-weight:800; color:#fff; margin-bottom:0.5rem;">No packages found</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem;">
          No matching Flutter packages found for "<strong>${esc(query)}</strong>".
        </p>
        <button class="btn btn-secondary btn-sm" onclick="PackagesView.clearSearch()">
          Clear Search & Show All
        </button>
      </div>
    `;
  }

  function renderGrid(append = false) {
    const grid = document.getElementById('pkg-grid');
    const pag  = document.getElementById('pkg-pagination');
    if (!grid) return;

    if (state.error && state.packages.length === 0) {
      grid.innerHTML = renderEmpty('error');
      if (pag) pag.innerHTML = '';
      return;
    }

    if (state.packages.length === 0 && !state.loading) {
      grid.innerHTML = renderEmpty('empty', state.searchQuery);
      if (pag) pag.innerHTML = '';
      return;
    }

    const userIsPro = state.isPro || checkUserIsPro();

    if (append) {
      state.packages.slice(-state.limit).forEach(pkg => {
        grid.insertAdjacentHTML('beforeend', renderCard(pkg));
      });
    } else {
      let cardsHtml = state.packages.map(renderCard).join('');

      // If Free User: append Pro Upgrade Section
      if (!userIsPro) {
        cardsHtml += renderProUpgradeSection();
      }

      grid.innerHTML = cardsHtml;
    }

    if (pag) {
      if (userIsPro && state.hasMore) {
        pag.innerHTML = `
          <button class="btn btn-secondary pkg-load-more-btn" onclick="PackagesView.loadMore()" style="padding:0.75rem 2rem; border-radius:10px; font-weight:700;">
            Load More Packages
          </button>
        `;
      } else if (userIsPro && state.packages.length > 0) {
        pag.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem; padding:1.5rem;">All packages loaded.</p>`;
      } else {
        pag.innerHTML = '';
      }
    }
  }

  /* ── Dedicated Package Details Page ─────────────────────────── */
  function findPackage(id) {
    const fromLoaded = state.packages.find(p => p.id === id || p.name === id);
    if (fromLoaded) return fromLoaded;
    if (state.lockedTeasers) {
      const fromTeasers = state.lockedTeasers.find(p => p.id === id || p.name === id);
      if (fromTeasers) return fromTeasers;
    }
    if (window.PACKAGES_DATA && PACKAGES_DATA.packages) {
      return PACKAGES_DATA.packages.find(p => p.id === id || p.name === id);
    }
    return null;
  }

  function openDetail(pkgId) {
    const pkg = findPackage(pkgId);
    if (!pkg) return;

    state.selectedPkg = pkg;
    const isProUser = state.isPro || checkUserIsPro();
    const isLocked = pkg.isPremium && !isProUser;

    // Push hash to history for browser back navigation
    if (window.location.hash !== `#/packages/${pkg.id}`) {
      window.history.pushState({ view: 'package-detail', pkgId: pkg.id }, '', `#/packages/${pkg.id}`);
    }

    const container = document.getElementById('pkg-detail-page-container');
    if (!container) return;

    const platforms = pkg.platforms || ['android', 'ios', 'web', 'macos', 'windows', 'linux'];

    container.innerHTML = `
      <!-- Back Navigation Button -->
      <a href="#" class="pkg-detail-back-btn" onclick="event.preventDefault(); PackagesView.backToDirectory();">
        ← Back to Package Directory
      </a>

      <!-- Hero Header -->
      <div class="pkg-detail-hero">
        <div class="pkg-detail-hero-icon" style="background:${pkg.iconBg || 'var(--bg-tertiary)'};">
          ${pkg.icon || '📦'}
        </div>
        <div class="pkg-detail-hero-info">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.4rem; flex-wrap:wrap;">
            <span class="badge badge-cyan" style="font-size:0.75rem; text-transform:uppercase;">
              ${esc((pkg.category || '').replace('_',' '))}
            </span>
            <span class="badge ${isLocked ? 'badge-pro' : (pkg.isPremium ? 'badge-emerald' : 'badge-cyan')}" style="font-size:0.75rem;">
              ${isLocked ? '🔒 PRO' : (pkg.isPremium ? '✓ PRO' : 'FREE')}
            </span>
            <span style="font-family:var(--font-mono); font-size:0.85rem; color:var(--text-muted);">
              v${esc(pkg.version)}
            </span>
          </div>
          <h1>${esc(pkg.name)}</h1>
          <p class="pkg-detail-hero-desc">${esc(pkg.tagline || pkg.description)}</p>
          <div style="display:flex; align-items:center; gap:1.25rem; font-size:0.85rem; color:var(--text-muted); flex-wrap:wrap;">
            <span>Publisher: <strong style="color:#ffffff;">${esc(pkg.publisher || 'flutter.dev')}</strong></span>
            <span>License: <strong style="color:#ffffff;">${esc(pkg.license || 'BSD-3-Clause / MIT')}</strong></span>
          </div>
        </div>
      </div>

      <!-- Installation CLI Command Box -->
      <div class="glass-panel" style="padding:1.5rem; border-radius:16px; margin-bottom:2rem;">
        <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff; margin:0 0 0.75rem 0;">Installation</h3>
        <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:0.75rem;">Add this package to your Flutter project dependencies:</p>
        <div class="pkg-install-box">
          <span class="pkg-install-code" id="pkg-install-text">${esc(pkg.installCmd || `flutter pub add ${pkg.name}`)}</span>
          <button class="btn btn-primary btn-sm" onclick="PackagesView.copyInstallCommand('${esc(pkg.installCmd || `flutter pub add ${pkg.name}`)}')">
            📋 Copy
          </button>
        </div>
      </div>

      <!-- Metrics Grid -->
      <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff; margin:0 0 0.85rem 0;">Package Metrics</h3>
      <div class="pkg-metrics-grid">
        <div class="pkg-metric-box">
          <div class="pkg-metric-val">❤️ ${pkg.likes ? pkg.likes.toLocaleString() : '1,000+'}</div>
          <div class="pkg-metric-lbl">Pub Likes</div>
        </div>
        <div class="pkg-metric-box">
          <div class="pkg-metric-val">⭐ ${pkg.pubPoints || 160}/160</div>
          <div class="pkg-metric-lbl">Pub Points</div>
        </div>
        <div class="pkg-metric-box">
          <div class="pkg-metric-val">📈 ${pkg.popularity || 99}%</div>
          <div class="pkg-metric-lbl">Popularity</div>
        </div>
        <div class="pkg-metric-box">
          <div class="pkg-metric-val">📥 ${pkg.downloads || '1M+'}</div>
          <div class="pkg-metric-lbl">Downloads</div>
        </div>
      </div>

      <!-- Supported Platforms -->
      <div class="glass-panel" style="padding:1.5rem; border-radius:16px; margin-bottom:2rem;">
        <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff; margin:0 0 0.5rem 0;">Supported Platforms</h3>
        <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:0.85rem;">Verified cross-platform target compilation:</p>
        <div class="pkg-platforms-row">
          ${platforms.map(p => `<span class="pkg-platform-tag">✓ ${p.toUpperCase()}</span>`).join('')}
        </div>
      </div>

      <!-- Key Features / Capabilities -->
      ${pkg.features && pkg.features.length > 0 ? `
        <div class="glass-panel" style="padding:1.5rem; border-radius:16px; margin-bottom:2rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:#ffffff; margin:0 0 0.85rem 0;">Key Capabilities</h3>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px;">
            ${pkg.features.map(f => `
              <li style="display:flex; align-items:center; gap:8px; font-size:0.9rem; color:var(--text-secondary);">
                <span style="color:#38bdf8; font-weight:bold;">✓</span> ${esc(f)}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- External Links Action Bar -->
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:2rem;">
        <a href="${esc(pkg.pubDevUrl || `https://pub.dev/packages/${pkg.name}`)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-md">
          📦 View on pub.dev ↗
        </a>
        ${pkg.githubUrl ? `
          <a href="${esc(pkg.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-md">
            🐙 GitHub Repository ↗
          </a>
        ` : ''}
        ${pkg.docsUrl ? `
          <a href="${esc(pkg.docsUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-md">
            📖 API Documentation ↗
          </a>
        ` : ''}
        ${isLocked ? `
          <button class="btn btn-premium btn-md" onclick="PaymentGateway.openCheckout()" style="margin-left:auto;">
            💎 Upgrade to Pro — ₹29/mo
          </button>
        ` : ''}
      </div>
    `;

    // Switch view to package-detail
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.style.display = 'none');
    const target = document.getElementById('view-package-detail');
    if (target) target.style.display = 'block';
    window.scrollTo(0, 0);
  }

  function backToDirectory() {
    if (window.App && App.switchView) {
      App.switchView('projects');
    }
  }

  function copyInstallCommand(cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
      if (window.App && App.showToast) {
        App.showToast('Copied installation command to clipboard! 📋', 'success');
      }
    });
  }

  /* ── Public Methods ────────────────────────────────────────── */
  let _searchTimer = null;

  async function render() {
    state.initialized = true;

    const grid = document.getElementById('pkg-grid');
    if (grid) grid.innerHTML = renderSkeletons(6);

    renderHeroStats();
    renderToolbar();

    await Promise.all([
      fetchCategories(),
      fetchPackages(false),
    ]);

    renderHeroStats();
    renderCategorySidebar();
    renderToolbar();
    renderGrid(false);
  }

  function selectCategory(catId) {
    state.activeCategory = catId;
    state.page = 1;
    renderToolbar();
    renderCategorySidebar();
    const grid = document.getElementById('pkg-grid');
    if (grid) grid.innerHTML = renderSkeletons(6);
    fetchPackages(false).then(() => {
      renderHeroStats();
      renderGrid(false);
    });
  }

  function onSearch(query) {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
      state.searchQuery = query.trim();
      state.page = 1;
      fetchPackages(false).then(() => renderGrid(false));
    }, 280);
  }

  function clearSearch() {
    state.searchQuery = '';
    const input = document.getElementById('pkg-search-input');
    if (input) input.value = '';
    renderToolbar();
    const grid = document.getElementById('pkg-grid');
    if (grid) grid.innerHTML = renderSkeletons(6);
    fetchPackages(false).then(() => renderGrid(false));
  }

  function onSort(sortVal) {
    state.sortBy = sortVal;
    state.page = 1;
    const grid = document.getElementById('pkg-grid');
    if (grid) grid.innerHTML = renderSkeletons(6);
    fetchPackages(false).then(() => renderGrid(false));
  }

  function loadMore() {
    state.page += 1;
    fetchPackages(true).then(() => renderGrid(true));
  }

  // Handle browser back / hash changes
  window.addEventListener('popstate', (e) => {
    if (window.location.hash.startsWith('#/packages/')) {
      const pkgId = window.location.hash.replace('#/packages/', '');
      openDetail(pkgId);
    }
  });

  return {
    render,
    selectCategory,
    onSearch,
    clearSearch,
    onSort,
    loadMore,
    openDetail,
    backToDirectory,
    copyInstallCommand,
  };

})();

window.PackagesView = PackagesView;
