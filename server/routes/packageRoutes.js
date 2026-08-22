/* ==========================================================================
   FlutterHub Backend — Package Directory API Routes
   GET /api/packages            → Paginated & Filtered Package Directory
   GET /api/packages/categories → Categories List with counts
   GET /api/packages/:id        → Individual Package Details
   ========================================================================== */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/superbase');
const { queryPackages, getCategories, getPackageById } = require('../packages/packageService');

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

/* ─── GET /api/packages ───────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const isPro = await checkIsProUser(req);
    const {
      q = '',
      category = 'all',
      sort = 'popularity',
      page = 1,
      limit = 8,
    } = req.query;

    const result = queryPackages({
      q,
      category,
      sort,
      page,
      limit,
    }, isPro);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error('[PackageAPI] Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch packages', error: err.message });
  }
});

/* ─── GET /api/packages/categories ────────────────────────────── */
router.get('/categories', async (req, res) => {
  try {
    const isPro = await checkIsProUser(req);
    const categories = getCategories(isPro);
    res.json({
      success: true,
      is_pro: isPro,
      categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ─── GET /api/packages/:id ───────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const isPro = await checkIsProUser(req);
    const pkg = getPackageById(req.params.id, isPro);

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.json({
      success: true,
      is_pro: isPro,
      package: pkg,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
