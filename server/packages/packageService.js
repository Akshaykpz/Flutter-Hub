/* ==========================================================================
   FlutterHub Backend — Package Directory Service
   Handles filtering, search, sorting, pagination, and Free (8 max) / Pro gating
   ========================================================================== */

const { PACKAGE_CATEGORIES, PACKAGES } = require('./packageData');

function getCategories(isPro = false) {
  return PACKAGE_CATEGORIES.map(cat => {
    let count = 0;
    if (cat.id === 'all') {
      count = isPro ? PACKAGES.length : PACKAGES.filter(p => !p.isPremium).length;
    } else {
      const inCat = PACKAGES.filter(p => p.category === cat.id);
      count = isPro ? inCat.length : inCat.filter(p => !p.isPremium).length;
    }
    return {
      ...cat,
      count,
      total_in_catalog: cat.id === 'all' ? PACKAGES.length : PACKAGES.filter(p => p.category === cat.id).length,
    };
  });
}

function parseDownloadCount(dStr = '') {
  if (!dStr) return 0;
  const num = parseFloat(dStr);
  if (dStr.toUpperCase().includes('M')) return num * 1000000;
  if (dStr.toUpperCase().includes('K')) return num * 1000;
  return num || 0;
}

function queryPackages(filters = {}, isPro = false) {
  const {
    q = '',
    category = 'all',
    sort = 'popularity',
    page = 1,
    limit = 8,
  } = filters;

  let list = [...PACKAGES];

  // 1. Category filter
  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }

  // 2. Search filter
  if (q && q.trim()) {
    const term = q.toLowerCase().trim();
    list = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.tagline && p.tagline.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.publisher && p.publisher.toLowerCase().includes(term)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
    );
  }

  // 3. Sorting
  switch (sort) {
    case 'likes':
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      break;
    case 'downloads':
      list.sort((a, b) => parseDownloadCount(b.downloads) - parseDownloadCount(a.downloads));
      break;
    case 'name_asc':
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'name_desc':
      list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      break;
    case 'newest':
      list.sort((a, b) => (b.version || '').localeCompare(a.version || ''));
      break;
    case 'popularity':
    default:
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
  }

  const totalCatalog = list.length;

  // 4. Free vs Pro Gating
  if (!isPro) {
    // Free user receives exactly the first 8 accessible packages
    // Prioritize free packages, max 8 items
    const freeOnlyList = list.filter(p => !p.isPremium);
    const resultList = (freeOnlyList.length >= 8 ? freeOnlyList : list).slice(0, 8);

    // Provide teaser preview of locked packages (without full proprietary content)
    const lockedTeasers = list
      .filter(p => p.isPremium)
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        icon: p.icon,
        iconBg: p.iconBg,
        tagline: p.tagline,
        version: p.version,
        isPremium: true,
      }));

    return {
      is_pro: false,
      packages: resultList,
      locked_teasers: lockedTeasers,
      pagination: {
        total: resultList.length,
        total_catalog: totalCatalog,
        page: 1,
        limit: 8,
        total_pages: 1,
        has_more: false,
      },
      pro_gate: {
        is_locked: true,
        locked_count: Math.max(0, totalCatalog - resultList.length),
        message: 'Discover thousands of Flutter & Dart packages with Flutter Hub Pro.',
      },
    };
  }

  // Pro user receives full paginated dataset
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
  const offset = (pageNum - 1) * limitNum;
  const paged = list.slice(offset, offset + limitNum);
  const totalPages = Math.ceil(totalCatalog / limitNum);

  return {
    is_pro: true,
    packages: paged,
    locked_teasers: [],
    pagination: {
      total: totalCatalog,
      total_catalog: totalCatalog,
      page: pageNum,
      limit: limitNum,
      total_pages: totalPages,
      has_more: pageNum < totalPages,
    },
    pro_gate: {
      is_locked: false,
      locked_count: 0,
      message: 'Pro access active. All Flutter & Dart packages unlocked.',
    },
  };
}

function getPackageById(id, isPro = false) {
  const pkg = PACKAGES.find(p => p.id === id || p.name === id);
  if (!pkg) return null;

  if (pkg.isPremium && !isPro) {
    return {
      ...pkg,
      is_locked: true,
      installCmd: null,
      docsUrl: null,
      githubUrl: null,
    };
  }

  return {
    ...pkg,
    is_locked: false,
  };
}

module.exports = {
  getCategories,
  queryPackages,
  getPackageById,
};
