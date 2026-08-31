/* ==========================================================================
   FlutterHub Job Board — Frontend View Controller (Flutter Developer Jobs)
   JobsView singleton: Free (10 max) & Pro (Unlimited), search, filter, sort
   ========================================================================== */

const JobsView = (function () {

  /* ── State ─────────────────────────────────────────────────── */
  const state = {
    jobs: [],
    total: 0,
    totalCatalog: 0,
    page: 1,
    limit: 10,
    hasMore: false,
    loading: false,
    error: null,
    isPro: false,
    proGate: null,
    syncStatus: null,
    lastSyncFetch: null,

    // Active filters
    q: '',
    remote_type: '',
    region: '',
    level: '',
    employment_type: '',
    sort: 'newest',

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
    if (window.AuthManager && AuthManager.currentUser) {
      const token = AuthManager.currentUser.token;
      if (token) return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  }

  function checkUserIsPro() {
    return !!(window.AuthManager && AuthManager.currentUser && AuthManager.currentUser.isPro);
  }

  function timeAgo(dateStr) {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  function formatSalary(job) {
    if (!job.salary_min) return null;
    const cur = job.salary_currency || 'USD';
    const sym = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[cur] || cur + ' ';
    const fmtNum = n => {
      if (cur === 'INR' && n >= 100000) return `${(n / 100000).toFixed(1)}L`;
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return n;
    };
    if (job.salary_max) return `${sym}${fmtNum(job.salary_min)} – ${sym}${fmtNum(job.salary_max)} / yr`;
    return `${sym}${fmtNum(job.salary_min)}+ / yr`;
  }

  function getLogoHtml(job) {
    if (job.company_logo) {
      return `<img src="${esc(job.company_logo)}" alt="${esc(job.company)}" 
               onerror="this.parentNode.innerHTML='<span class=\\'job-company-logo-letter\\'>${esc((job.company || '?')[0].toUpperCase())}</span>'"
               loading="lazy" style="width:100%;height:100%;object-fit:contain;border-radius:8px;">`;
    }
    const colors = ['#38bdf8','#8b5cf6','#34d399','#f59e0b','#ec4899','#06b6d4'];
    const color = colors[(job.company || '').charCodeAt(0) % colors.length];
    return `<span class="job-company-logo-letter" style="color:${color}">${(job.company || '?')[0].toUpperCase()}</span>`;
  }

  function remoteTypeBadge(t) {
    const map = {
      remote:  { cls: 'job-badge--remote',  icon: '🌍', label: 'Remote' },
      hybrid:  { cls: 'job-badge--hybrid',  icon: '🔀', label: 'Hybrid' },
      onsite:  { cls: 'job-badge--onsite',  icon: '🏢', label: 'On-site' },
    };
    const b = map[t] || map.onsite;
    return `<span class="job-badge ${b.cls}">${b.icon} ${b.label}</span>`;
  }

  function empTypeBadge(t) {
    const cls = t === 'contract' ? 'job-badge--contract' : 'job-badge--fulltime';
    const label = { 'full-time': 'Full-time', contract: 'Contract', 'part-time': 'Part-time', internship: 'Internship' }[t] || t;
    return `<span class="job-badge ${cls}">${label}</span>`;
  }

  function levelBadge(l) {
    if (!l) return '';
    const label = { junior: '🟢 Junior', mid: '🔵 Mid-level', senior: '🟠 Senior', lead: '🔴 Lead' }[l] || l;
    return `<span class="job-badge job-badge--level">${label}</span>`;
  }

  /* ── Fallback Pre-Seeded Flutter Jobs Catalog ─────────────── */
  const FALLBACK_FLUTTER_JOBS = [
    {
      id: 'job-canonical-1',
      company: 'Canonical (Ubuntu)',
      company_logo: 'https://logo.clearbit.com/canonical.com',
      title: 'Senior Flutter Engineer — Ubuntu Desktop UI',
      location: 'Remote (Worldwide)',
      remote_type: 'remote',
      region: 'worldwide',
      level: 'senior',
      salary_min: 110000,
      salary_max: 155000,
      salary_currency: 'USD',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Linux Desktop', 'C++', 'Clean Architecture'],
      apply_url: 'https://canonical.com/careers/all',
      source_name: 'Canonical Careers',
      posted_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'job-google-2',
      company: 'Google',
      company_logo: 'https://logo.clearbit.com/google.com',
      title: 'Flutter Developer Relations Engineer',
      location: 'Mountain View, CA / Remote',
      remote_type: 'hybrid',
      region: 'usa',
      level: 'lead',
      salary_min: 160000,
      salary_max: 220000,
      salary_currency: 'USD',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Impeller', 'Shaders', 'Architecture'],
      apply_url: 'https://careers.google.com/',
      source_name: 'Google Careers',
      posted_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'job-bmw-3',
      company: 'BMW Group',
      company_logo: 'https://logo.clearbit.com/bmwgroup.com',
      title: 'Flutter Mobile App Specialist (My BMW App)',
      location: 'Munich, Germany / Hybrid',
      remote_type: 'hybrid',
      region: 'europe',
      level: 'mid',
      salary_min: 75000,
      salary_max: 95000,
      salary_currency: 'EUR',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'BLoC', 'Bluetooth LE', 'Clean Code'],
      apply_url: 'https://www.bmwgroup.jobs/',
      source_name: 'BMW Group Careers',
      posted_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'job-nubank-4',
      company: 'Nubank',
      company_logo: 'https://logo.clearbit.com/nubank.com.br',
      title: 'Staff Flutter Architect — Global Banking Systems',
      location: 'São Paulo / Remote Worldwide',
      remote_type: 'remote',
      region: 'worldwide',
      level: 'lead',
      salary_min: 130000,
      salary_max: 180000,
      salary_currency: 'USD',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Fintech', 'State Management', 'Security'],
      apply_url: 'https://nubank.com.br/careers',
      source_name: 'Nubank Careers',
      posted_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'job-bytedance-5',
      company: 'ByteDance (TikTok)',
      company_logo: 'https://logo.clearbit.com/bytedance.com',
      title: 'Senior Mobile Engineer (Flutter & Cross-Platform)',
      location: 'Singapore / Remote Asia',
      remote_type: 'remote',
      region: 'worldwide',
      level: 'senior',
      salary_min: 120000,
      salary_max: 160000,
      salary_currency: 'USD',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Performance Tuning', 'FFI', 'Video Engine'],
      apply_url: 'https://jobs.bytedance.com/',
      source_name: 'ByteDance Careers',
      posted_at: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'job-cred-6',
      company: 'CRED',
      company_logo: 'https://logo.clearbit.com/cred.club',
      title: 'Senior Flutter Developer — Premium UI & Animations',
      location: 'Bengaluru, India / Hybrid',
      remote_type: 'hybrid',
      region: 'india',
      level: 'senior',
      salary_min: 2800000,
      salary_max: 4200000,
      salary_currency: 'INR',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Custom Painters', 'Physics Animations', 'Riverpod'],
      apply_url: 'https://cred.club/careers',
      source_name: 'CRED Careers',
      posted_at: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'job-swiggy-7',
      company: 'Swiggy',
      company_logo: 'https://logo.clearbit.com/swiggy.com',
      title: 'Lead Mobile Engineer (Flutter Architecture)',
      location: 'Bengaluru, India / Remote India',
      remote_type: 'remote',
      region: 'india',
      level: 'lead',
      salary_min: 3200000,
      salary_max: 5000000,
      salary_currency: 'INR',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Micro-Apps', 'BLoC', 'CI/CD Pipelines'],
      apply_url: 'https://careers.swiggy.com/',
      source_name: 'Swiggy Careers',
      posted_at: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'job-supercell-8',
      company: 'Supercell',
      company_logo: 'https://logo.clearbit.com/supercell.com',
      title: 'Mobile UI Developer (Flutter & Dart)',
      location: 'Helsinki, Finland / Hybrid',
      remote_type: 'hybrid',
      region: 'europe',
      level: 'mid',
      salary_min: 80000,
      salary_max: 110000,
      salary_currency: 'EUR',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Flame Engine', 'UI Design', 'Game Tools'],
      apply_url: 'https://supercell.com/en/careers/',
      source_name: 'Supercell Careers',
      posted_at: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: 'job-razorpay-9',
      company: 'Razorpay',
      company_logo: 'https://logo.clearbit.com/razorpay.com',
      title: 'Senior Mobile Engineer — Flutter SDK & Payments',
      location: 'Bengaluru, India / Hybrid',
      remote_type: 'hybrid',
      region: 'india',
      level: 'senior',
      salary_min: 2600000,
      salary_max: 3800000,
      salary_currency: 'INR',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'Platform Channels', 'Security', 'Payment SDKs'],
      apply_url: 'https://razorpay.com/jobs/',
      source_name: 'Razorpay Careers',
      posted_at: new Date(Date.now() - 9 * 86400000).toISOString()
    },
    {
      id: 'job-wolt-10',
      company: 'Wolt',
      company_logo: 'https://logo.clearbit.com/wolt.com',
      title: 'Flutter Application Engineer — Merchant Apps',
      location: 'Helsinki, Finland / Remote EU',
      remote_type: 'remote',
      region: 'europe',
      level: 'mid',
      salary_min: 70000,
      salary_max: 95000,
      salary_currency: 'EUR',
      employment_type: 'full-time',
      skills: ['Flutter', 'Dart', 'State Management', 'REST APIs', 'GraphQL'],
      apply_url: 'https://wolt.com/en/jobs',
      source_name: 'Wolt Careers',
      posted_at: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ];

  /* ── API calls ─────────────────────────────────────────────── */
  async function fetchJobs(append = false) {
    if (state.loading) return;
    state.loading = true;

    if (!append) {
      state.page = 1;
      state.jobs = [];
    }

    const userIsPro = checkUserIsPro();
    const limit = userIsPro ? 15 : 10;

    const params = new URLSearchParams({
      page: state.page,
      limit: limit,
      sort: state.sort,
    });
    if (state.q)               params.set('q', state.q);
    if (state.remote_type)     params.set('remote_type', state.remote_type);
    if (state.region)          params.set('region', state.region);
    if (state.level)           params.set('level', state.level);
    if (state.employment_type) params.set('employment_type', state.employment_type);

    // Build candidate endpoint URLs for relative path + local backend ports
    const candidates = [
      `/api/jobs?${params}`,
      `http://localhost:5000/api/jobs?${params}`,
      `http://localhost:5001/api/jobs?${params}`
    ];

    let fetchedData = null;

    for (const url of candidates) {
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.jobs)) {
            fetchedData = data;
            break;
          }
        }
      } catch (_) {}
    }

    if (fetchedData) {
      state.isPro        = fetchedData.is_pro || userIsPro;
      state.proGate      = fetchedData.pro_gate || {};
      state.totalCatalog = fetchedData.pagination?.total_catalog || fetchedData.pagination?.total || fetchedData.jobs.length;
      state.total        = fetchedData.pagination?.total || fetchedData.jobs.length;
      state.hasMore      = fetchedData.pagination?.has_more || false;

      if (append) {
        state.jobs = [...state.jobs, ...fetchedData.jobs];
      } else {
        state.jobs = fetchedData.jobs;
      }
      state.error = null;
    } else {
      // Offline / API Fallback — Filter pre-seeded catalog
      let list = [...FALLBACK_FLUTTER_JOBS];
      if (state.q) {
        const query = state.q.toLowerCase();
        list = list.filter(j => 
          j.title.toLowerCase().includes(query) || 
          j.company.toLowerCase().includes(query) || 
          j.skills.some(s => s.toLowerCase().includes(query))
        );
      }
      if (state.remote_type)     list = list.filter(j => j.remote_type === state.remote_type);
      if (state.region)          list = list.filter(j => j.region === state.region);
      if (state.level)           list = list.filter(j => j.level === state.level);
      if (state.employment_type) list = list.filter(j => j.employment_type === state.employment_type);

      state.isPro = userIsPro;
      state.totalCatalog = list.length;
      state.total = list.length;
      state.hasMore = false;
      state.jobs = userIsPro ? list : list.slice(0, 10);
      state.error = null;
    }

    state.loading = false;
  }

  async function fetchSyncStatus() {
    if (state.syncStatus && state.lastSyncFetch && Date.now() - state.lastSyncFetch < 60000) return;
    try {
      const res = await fetch('/api/jobs/sync/status');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        state.syncStatus = data;
        state.lastSyncFetch = Date.now();
      }
    } catch (e) {}
  }

  /* ── Renderers ─────────────────────────────────────────────── */
  function renderHeroBadges() {
    const userIsPro = state.isPro || checkUserIsPro();
    const badgeRow = document.getElementById('job-hero-badge-row');
    if (!badgeRow) return;

    if (userIsPro) {
      badgeRow.innerHTML = `
        <div class="job-hero-badge" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4);color:#34d399;">
          💎 PRO UNLOCKED • ALL FLUTTER JOBS
        </div>
        <span class="badge badge-emerald" style="font-size:0.75rem;">Unrestricted Access</span>
      `;
    } else {
      badgeRow.innerHTML = `
        <div class="job-hero-badge">
          🎯 10 FREE FLUTTER JOBS
        </div>
        <span class="badge badge-cyan" style="font-size:0.72rem;">Curated Flutter & Dart Feed</span>
      `;
    }
  }

  function renderSyncBar() {
    const el = document.getElementById('job-sync-bar');
    if (!el) return;

    const s = state.syncStatus;
    const lastSync = s?.stats?.last_sync ? timeAgo(s.stats.last_sync) : 'Today';
    const total = state.totalCatalog || s?.stats?.total_active || state.jobs.length;

    el.innerHTML = `
      <span class="job-sync-dot"></span>
      Synced ${lastSync}
      &nbsp;•&nbsp;
      <strong style="color:var(--text-secondary)">${total} active Flutter developer jobs</strong>
      &nbsp;•&nbsp;
      <span style="color:#38bdf8">100% Flutter & Dart Verified</span>
    `;
  }

  function renderToolbar() {
    const el = document.getElementById('job-toolbar');
    if (!el) return;

    const hasFilter = state.q || state.remote_type || state.region || state.level || state.employment_type;

    el.innerHTML = `
      <!-- Search & Sort -->
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
        <div class="job-search-wrap" style="flex:1;min-width:220px;">
          <svg class="job-search-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            id="job-search-input"
            type="text"
            class="job-search-input"
            placeholder="Search Flutter Developer, Senior, BLoC, Riverpod, company…"
            value="${esc(state.q)}"
            oninput="JobsView.onSearch(this.value)"
            autocomplete="off"
          />
          ${state.q ? `<button class="job-search-clear" onclick="JobsView.clearSearch()" title="Clear">✕</button>` : ''}
        </div>
        <div class="job-sort-wrap">
          <span style="font-size:0.75rem;color:var(--text-muted);">Sort:</span>
          <select class="job-sort-select" onchange="JobsView.onSort(this.value)">
            <option value="newest" ${state.sort === 'newest' ? 'selected' : ''}>Latest Added</option>
            <option value="oldest" ${state.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Filter chips -->
      <div class="job-filter-row">
        <span class="job-filter-label">Mode:</span>
        ${['remote','hybrid','onsite'].map(v => `
          <button class="job-filter-chip ${state.remote_type === v ? 'job-filter-chip--active' : ''}"
                  onclick="JobsView.toggleFilter('remote_type','${v}')">
            ${{ remote:'🌍', hybrid:'🔀', onsite:'🏢' }[v]} ${v.charAt(0).toUpperCase()+v.slice(1)}
          </button>
        `).join('')}

        <span style="color:var(--border-color);font-size:0.8rem;">|</span>
        <span class="job-filter-label">Region:</span>
        ${[['india','🇮🇳 India'],['usa','🇺🇸 USA'],['europe','🇪🇺 Europe'],['worldwide','🌐 Worldwide']].map(([v,l]) => `
          <button class="job-filter-chip ${state.region === v ? 'job-filter-chip--active' : ''}"
                  onclick="JobsView.toggleFilter('region','${v}')">${l}</button>
        `).join('')}

        <span style="color:var(--border-color);font-size:0.8rem;">|</span>
        <span class="job-filter-label">Level:</span>
        ${[['junior','Junior'],['mid','Mid-level'],['senior','Senior'],['lead','Lead']].map(([v,l]) => `
          <button class="job-filter-chip ${state.level === v ? 'job-filter-chip--active' : ''}"
                  onclick="JobsView.toggleFilter('level','${v}')">${l}</button>
        `).join('')}

        <span style="color:var(--border-color);font-size:0.8rem;">|</span>
        <span class="job-filter-label">Type:</span>
        ${[['full-time','Full-time'],['contract','Contract']].map(([v,l]) => `
          <button class="job-filter-chip ${state.employment_type === v ? 'job-filter-chip--active' : ''}"
                  onclick="JobsView.toggleFilter('employment_type','${v}')">${l}</button>
        `).join('')}

        ${hasFilter ? `
          <button class="job-filter-chip job-filter-chip--clear" onclick="JobsView.clearAllFilters()">
            ✕ Reset
          </button>
        ` : ''}
      </div>
    `;
  }

  function renderCard(job) {
    const salary = formatSalary(job);
    const skills = (job.skills || []).slice(0, 5);
    const applyLabel = `Apply on ${esc(job.source_name || 'Official Careers')}`;

    return `
      <div class="job-card" id="jobcard-${esc(job.id)}">
        <!-- Company row -->
        <div class="job-card-company">
          <div class="job-company-logo">${getLogoHtml(job)}</div>
          <div class="job-company-info">
            <div class="job-company-name">${esc(job.company)}</div>
            <div class="job-location">
              <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${esc(job.location || 'Location not specified')}
            </div>
          </div>
          <span class="job-source-badge">${esc(job.source_name || 'Verified')}</span>
        </div>

        <!-- Job title -->
        <h3 class="job-title">${esc(job.title)}</h3>

        <!-- Salary (only if explicitly provided by source) -->
        ${salary ? `<div class="job-salary">💰 ${salary}</div>` : ''}

        <!-- Badges -->
        <div class="job-badges">
          ${remoteTypeBadge(job.remote_type)}
          ${empTypeBadge(job.employment_type)}
          ${levelBadge(job.level)}
        </div>

        <!-- Skills -->
        ${skills.length ? `
          <div class="job-skills">
            ${skills.map(s => {
              const isFlutterCore = ['flutter','dart'].includes(s.toLowerCase());
              return `<span class="job-skill-tag ${isFlutterCore ? 'job-skill-tag--flutter' : ''}">${esc(s)}</span>`;
            }).join('')}
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="job-card-footer">
          <span class="job-posted-time">⏱ ${timeAgo(job.posted_at)}</span>
          <a href="${esc(job.apply_url)}"
             target="_blank"
             rel="noopener noreferrer"
             class="job-apply-btn"
             onclick="JobsView.trackApply('${esc(job.id)}','${esc(job.source_name || '')}')"
             title="${applyLabel}">
            ${applyLabel} ↗
          </a>
        </div>
      </div>
    `;
  }

  function renderProUnlockBox() {
    const lockedCount = Math.max(10, state.totalCatalog - 10);
    return `
      <div class="job-pro-unlock-container" style="grid-column:1/-1;">
        <div class="job-pro-unlock-card glass-panel">
          <div class="job-pro-unlock-icon">🔒</div>
          <div class="job-pro-unlock-content">
            <span class="badge badge-pro" style="margin-bottom:0.5rem;">FLUTTERHUB PRO PASS</span>
            <h3>Want access to all Flutter developer jobs?</h3>
            <p>
              You've viewed your 10 free Flutter jobs. Unlock the complete <strong>Flutter Developer Job Directory</strong> with Pro to access <strong>${lockedCount}+ senior, remote, and high-paying Flutter roles</strong> worldwide.
            </p>
            <ul class="job-pro-features-list">
              <li><span>✓</span> All ${state.totalCatalog || '50+'} Active Flutter/Dart Vacancies</li>
              <li><span>✓</span> Full Search & Multi-Location Filtering</li>
              <li><span>✓</span> Direct Greenhouse & Lever Portals</li>
              <li><span>✓</span> 1,000+ Flutter Component Source Codes</li>
            </ul>
          </div>
          <button class="btn btn-premium btn-lg" onclick="JobsView.openUpgrade()" style="border-radius:12px; font-weight:800; padding:0.85rem 2rem;">
            ⚡ Unlock Full Job Board — ₹29/mo
          </button>
        </div>
      </div>
    `;
  }

  function renderSkeletons(n = 6) {
    return Array.from({ length: n }, () => `
      <div class="job-card job-skeleton">
        <div class="job-card-company">
          <div class="skel-icon" style="width:42px;height:42px;border-radius:10px;"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <div class="skel-line" style="width:55%;"></div>
            <div class="skel-line" style="width:40%;height:10px;"></div>
          </div>
        </div>
        <div class="skel-line" style="width:85%;height:16px;margin-top:4px;"></div>
        <div class="skel-line" style="width:60%;height:12px;"></div>
        <div style="display:flex;gap:6px;">
          <div class="skel-line" style="width:70px;height:22px;border-radius:99px;"></div>
          <div class="skel-line" style="width:80px;height:22px;border-radius:99px;"></div>
        </div>
      </div>
    `).join('');
  }

  function renderEmpty(type, q) {
    const msgs = {
      search: { icon: '🔍', title: `No Flutter jobs matching "${esc(q||'')}"`, sub: 'Try searching for Remote, BLoC, Senior, or reset your filters.' },
      nojobs: { icon: '📭', title: 'No active Flutter vacancies found', sub: 'The job sync runs daily. Check back soon for new Flutter opportunities.' },
      error:  { icon: '⚠️', title: 'Could not load jobs feed', sub: 'Please check your connection and retry.' },
    };
    const m = msgs[type] || msgs.error;
    return `
      <div class="job-empty-state">
        <div class="job-empty-icon">${m.icon}</div>
        <h3>${m.title}</h3>
        <p>${m.sub}</p>
        ${type === 'error' ? `<button class="btn btn-secondary btn-sm" onclick="JobsView.render()">Retry</button>` : ''}
        ${type === 'search' ? `<button class="btn btn-secondary btn-sm" onclick="JobsView.clearAllFilters()">Clear Filters</button>` : ''}
      </div>
    `;
  }

  function renderResultMeta() {
    const el = document.getElementById('job-result-meta');
    if (!el) return;
    const userIsPro = state.isPro || checkUserIsPro();
    const hasFilter = state.q || state.remote_type || state.region || state.level || state.employment_type;

    if (userIsPro) {
      el.innerHTML = `
        <span class="job-result-count">
          Showing <strong>${state.jobs.length}</strong> of <strong>${state.totalCatalog || state.total}</strong> Flutter & Dart positions
          ${hasFilter ? '(filtered)' : ''}
        </span>
        <span class="badge badge-emerald" style="font-size:0.75rem;">💎 Pro Unlimited</span>
      `;
    } else {
      el.innerHTML = `
        <span class="job-result-count">
          Showing <strong>${state.jobs.length}</strong> of <strong>10 Free Flutter Jobs</strong> (Total Catalog: ${state.totalCatalog || '50+'})
        </span>
        <button class="btn btn-premium btn-sm" onclick="JobsView.openUpgrade()" style="font-size:0.75rem; padding:4px 10px;">
          🔒 Unlock All (${Math.max(0, state.totalCatalog - 10)}+ More)
        </button>
      `;
    }
  }

  function renderGrid(append = false) {
    const grid = document.getElementById('job-grid');
    const pag  = document.getElementById('job-pagination');
    if (!grid) return;

    if (state.error && state.jobs.length === 0) {
      grid.innerHTML = renderEmpty('error');
      if (pag) pag.innerHTML = '';
      return;
    }

    if (state.jobs.length === 0 && !state.loading) {
      const type = (state.q || state.remote_type || state.region || state.level || state.employment_type) ? 'search' : 'nojobs';
      grid.innerHTML = renderEmpty(type, state.q);
      if (pag) pag.innerHTML = '';
      return;
    }

    if (append) {
      state.jobs.slice(-state.limit).forEach(job => {
        grid.insertAdjacentHTML('beforeend', renderCard(job));
      });
    } else {
      grid.innerHTML = state.jobs.map(renderCard).join('');
    }

    // Free user Pro Lock Banner after the 10th job
    const userIsPro = state.isPro || checkUserIsPro();
    if (!userIsPro && state.jobs.length > 0) {
      grid.insertAdjacentHTML('beforeend', renderProUnlockBox());
    }

    renderResultMeta();

    if (pag) {
      if (userIsPro && state.hasMore) {
        const remaining = (state.totalCatalog || state.total) - state.jobs.length;
        pag.innerHTML = `
          <button class="btn btn-secondary job-load-more" onclick="JobsView.loadMore()">
            Load More Flutter Jobs <span style="color:var(--text-muted);font-size:0.8rem;">(${remaining} more)</span>
          </button>
        `;
      } else if (userIsPro && state.jobs.length > 0) {
        pag.innerHTML = `<p class="job-end-label">All ${state.jobs.length} active Flutter positions loaded.</p>`;
      } else {
        pag.innerHTML = '';
      }
    }
  }

  function renderAdminPanel() {
    const el = document.getElementById('job-admin-panel');
    if (!el) return;

    const s = state.syncStatus?.stats;
    if (!s) {
      el.style.display = 'none';
      return;
    }

    el.style.display = 'block';
    el.innerHTML = `
      <div class="job-admin-title">🔧 Flutter Job Sync Admin Panel</div>
      <div class="job-admin-grid">
        <div class="job-admin-stat">
          <span class="job-admin-stat-val">${(state.totalCatalog || s.total_active || 0).toLocaleString()}</span>
          <span class="job-admin-stat-lbl">Active Flutter Jobs</span>
        </div>
        <div class="job-admin-stat">
          <span class="job-admin-stat-val">${s.new_jobs_24h || 0}</span>
          <span class="job-admin-stat-lbl">New (24h)</span>
        </div>
        <div class="job-admin-stat">
          <span class="job-admin-stat-val">10 / Free</span>
          <span class="job-admin-stat-lbl">Free Access Limit</span>
        </div>
        <div class="job-admin-stat">
          <span class="job-admin-stat-val" style="color:#34d399;">Active</span>
          <span class="job-admin-stat-lbl">Backend Gating</span>
        </div>
      </div>
    `;
  }

  /* ── Public API ────────────────────────────────────────────── */
  async function render() {
    state.initialized = true;

    // Show skeletons immediately
    const grid = document.getElementById('job-grid');
    if (grid) grid.innerHTML = renderSkeletons(10);

    renderHeroBadges();
    renderToolbar();

    await Promise.all([
      fetchSyncStatus(),
      fetchJobs(false),
    ]);

    renderHeroBadges();
    renderSyncBar();
    renderToolbar();
    renderGrid(false);

    // Show admin panel if ?admin=1 in URL
    const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
    const adminEl = document.getElementById('job-admin-panel');
    if (adminEl) adminEl.style.display = isAdmin ? 'block' : 'none';
    if (isAdmin) renderAdminPanel();
  }

  let _searchTimer = null;

  return {
    render,

    onSearch(q) {
      state.q = q;
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(async () => {
        const grid = document.getElementById('job-grid');
        if (grid) grid.innerHTML = renderSkeletons(6);
        renderToolbar();
        await fetchJobs(false);
        renderGrid(false);
      }, 350);
    },

    clearSearch() {
      state.q = '';
      const inp = document.getElementById('job-search-input');
      if (inp) inp.value = '';
      this.onSearch('');
    },

    async toggleFilter(key, value) {
      if (state[key] === value) {
        state[key] = '';
      } else {
        state[key] = value;
      }
      state.page = 1;
      const grid = document.getElementById('job-grid');
      if (grid) grid.innerHTML = renderSkeletons(6);
      renderToolbar();
      await fetchJobs(false);
      renderGrid(false);
    },

    async clearAllFilters() {
      state.q = '';
      state.remote_type = '';
      state.region = '';
      state.level = '';
      state.employment_type = '';
      state.page = 1;
      const inp = document.getElementById('job-search-input');
      if (inp) inp.value = '';
      const grid = document.getElementById('job-grid');
      if (grid) grid.innerHTML = renderSkeletons(6);
      renderToolbar();
      await fetchJobs(false);
      renderGrid(false);
    },

    async onSort(val) {
      state.sort = val;
      state.page = 1;
      await fetchJobs(false);
      renderGrid(false);
    },

    async loadMore() {
      state.page++;
      await fetchJobs(true);
      renderGrid(true);
    },

    openUpgrade() {
      if (window.PaymentGateway && PaymentGateway.openCheckout) {
        PaymentGateway.openCheckout();
      } else if (window.App) {
        App.switchView('pricing');
      }
    },

    trackApply(jobId, sourceName) {
      console.log(`[Jobs] Applying to Flutter job: ${jobId} on ${sourceName}`);
    },

    refresh() {
      if (state.initialized) render();
    },
  };

})();

window.JobsView = JobsView;
