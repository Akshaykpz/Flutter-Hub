/* ==========================================================================
   Protected Content Express Routes
   ========================================================================== */

const express = require('express');
const router = express.Router();
const { downloadPremiumContent } = require('../controllers/contentController');
const { protect, requireSubscription } = require('../middleware/authMiddleware');

router.get('/download/:id', protect, requireSubscription, downloadPremiumContent);

module.exports = router;
