/* ==========================================================================
   FlutterHub Job Board — Backend API Routes (Secure Free/Pro Gating)
   GET  /api/jobs              → Secure Free (10 max) / Pro (Unlimited) Flutter jobs
   GET  /api/jobs/sync/status  → sync stats
   POST /api/jobs/sync/trigger → manual sync trigger (admin token required)
   ========================================================================== */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/superbase');
const { getJobStats, queryInMemoryJobs } = require('../jobs/jobFetcher');
const scheduler = require('../jobs/scheduler');

// Helper to determine if incoming request belongs to an authenticated Pro user
async function checkIsProUser(req) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.auth_token) {
      token = req.query.auth_token;
    }

    if (!token || token === 'null' || token === 'undefined') {
      return false;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flutterhub_super_secret_jwt_key_2026_prod');
    if (!decoded) return false;

    if (decoded.isPro === true || decoded.isAdmin === true || decoded.role === 'admin' || decoded.isSubscribed === true) {
      return true;
    }

    // Verify against Supabase users table
    if (decoded.id || decoded.email) {
      const query = supabase
        .from('users')
        .select('is_subscribed, subscription_expires_at, role');

      if (decoded.id) query.eq('id', decoded.id);
      else query.eq('email', decoded.email);

      const { data: user } = await query.maybeSingle();

      if (user) {
        if (user.role === 'admin' || user.is_subscribed === true) {
          const expired = user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date();
          if (!expired) return true;
        }
      }
    }

    return false;
  } catch (err) {
    return false;
  }
}

/* ─── GET /api/jobs ─────────────────────────────────────────────
   Securely serves ONLY Flutter & Dart jobs.
   - Free user: max 10 active Flutter jobs (backend enforced).
   - Pro user: full active Flutter job catalogue with pagination.
   ---------------------------------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const isPro = await checkIsProUser(req);

    const {
      q = '',
      remote_type,
      region,
      level,
      employment_type,
      source_id,
      page = 1,
      limit = 10,
      sort = 'newest',
    } = req.query;

    const requestedPage = Math.max(1, parseInt(page) || 1);
    // Free users are hard-capped at 10 jobs on page 1
    const pageNum = isPro ? requestedPage : 1;
    const limitNum = isPro ? Math.min(50, Math.max(1, parseInt(limit) || 15)) : 10;
    const offset = (pageNum - 1) * limitNum;

    // 1. Try querying Supabase
    let dbSuccess = false;
    let dbData = null;
    let totalInCatalog = 0;

    try {
      let query = supabase
        .from('flutter_jobs')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      if (sort === 'oldest') {
        query = query.order('posted_at', { ascending: true });
      } else {
        query = query.order('posted_at', { ascending: false });
      }

      if (q && q.trim()) {
        query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`);
      }
      if (remote_type) query = query.eq('remote_type', remote_type);
      if (region) query = query.eq('region', region);
      if (level) query = query.eq('level', level);
      if (employment_type) query = query.eq('employment_type', employment_type);
      if (source_id) query = query.eq('source_id', source_id);

      query = query.range(offset, offset + limitNum - 1);

      const { data, error, count } = await query;
      if (!error && data && data.length > 0) {
        dbSuccess = true;
        dbData = data;
        totalInCatalog = count || data.length;
      }
    } catch (e) {}

    if (dbSuccess && dbData) {
      // Backend security: If free user, slice max 10
      const jobsToReturn = isPro ? dbData : dbData.slice(0, 10);
      const totalAccessible = isPro ? totalInCatalog : Math.min(10, totalInCatalog);
      const totalPages = isPro ? Math.ceil(totalInCatalog / limitNum) : 1;
      const hasMore = isPro ? (pageNum < totalPages) : false;

      return res.json({
        success: true,
        is_pro: isPro,
        source: 'database',
        jobs: jobsToReturn,
        pagination: {
          total: totalAccessible,
          total_catalog: totalInCatalog,
          page: pageNum,
          limit: limitNum,
          total_pages: totalPages,
          has_more: hasMore,
        },
        pro_gate: {
          is_locked: !isPro,
          locked_count: Math.max(0, totalInCatalog - 10),
          message: isPro
            ? 'Pro access verified. Viewing full Flutter Developer Job Board.'
            : 'Want access to more Flutter jobs? Unlock the complete Flutter Developer Job Board with Pro.',
        },
      });
    }

    // 2. High-speed In-Memory fallback (strictly filtered to Flutter/Dart)
    const memResult = queryInMemoryJobs({
      q,
      remote_type,
      region,
      level,
      employment_type,
      source_id,
      page: pageNum,
      limit: limitNum,
      sort,
    });

    const totalCatalogMem = memResult.total;
    const jobsMem = isPro ? memResult.jobs : memResult.jobs.slice(0, 10);
    const totalAccessibleMem = isPro ? totalCatalogMem : Math.min(10, totalCatalogMem);
    const totalPagesMem = isPro ? memResult.total_pages : 1;
    const hasMoreMem = isPro ? memResult.has_more : false;

    return res.json({
      success: true,
      is_pro: isPro,
      source: 'live_feed',
      jobs: jobsMem,
      pagination: {
        total: totalAccessibleMem,
        total_catalog: totalCatalogMem,
        page: pageNum,
        limit: limitNum,
        total_pages: totalPagesMem,
        has_more: hasMoreMem,
      },
      pro_gate: {
        is_locked: !isPro,
        locked_count: Math.max(0, totalCatalogMem - 10),
        message: isPro
          ? 'Pro access verified. Viewing full Flutter Developer Job Board.'
          : 'Want access to more Flutter jobs? Unlock the complete Flutter Developer Job Board with Pro.',
      },
    });

  } catch (err) {
    console.error('[JobsAPI] Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
});

/* ─── GET /api/jobs/sync/status ─────────────────────────────── */
router.get('/sync/status', async (req, res) => {
  try {
    const stats = await getJobStats();
    const nextSync = scheduler.getNextSyncTime();
    const lastResult = scheduler.getLastSyncResult();
    const isSyncing = scheduler.isSyncRunning();

    res.json({
      success: true,
      is_syncing: isSyncing,
      next_sync: nextSync,
      last_sync_result: lastResult,
      stats: stats || {},
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ─── POST /api/jobs/sync/trigger ──────────────────────────── */
router.post('/sync/trigger', async (req, res) => {
  const token = req.headers['x-admin-token'];
  const expectedToken = process.env.ADMIN_SYNC_TOKEN || 'flutterhub_admin_sync_2026';

  if (token !== expectedToken) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Provide x-admin-token header.' });
  }

  if (scheduler.isSyncRunning()) {
    return res.json({ success: false, message: 'Sync already running. Check /api/jobs/sync/status.' });
  }

  res.json({ success: true, message: 'Sync triggered. Check /api/jobs/sync/status for progress.' });
  scheduler.runSync('manual-trigger');
});

module.exports = router;
