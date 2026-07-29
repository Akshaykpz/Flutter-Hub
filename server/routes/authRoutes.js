/* ==========================================================================
   User Auth Express Routes (Supabase Auth & Database Sync)
   ========================================================================== */

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getOAuthUrl,
  syncOAuthUser,
  forgotPassword,
  getMe,
  getAllUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/provider/:provider', getOAuthUrl);
router.get('/google', (req, res, next) => { req.params.provider = 'google'; req.query.redirect = 'true'; getOAuthUrl(req, res, next); });
router.get('/github', (req, res, next) => { req.params.provider = 'github'; req.query.redirect = 'true'; getOAuthUrl(req, res, next); });
router.post('/oauth-sync', syncOAuthUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);
router.get('/users', getAllUsers);

module.exports = router;
