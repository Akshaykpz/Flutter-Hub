/* ==========================================================================
   Contact / Inquiry Express Routes
   - POST /api/contact  → Save a user inquiry (public, no auth)
   - GET  /api/contact  → Inquiry count (admin convenience)
   ========================================================================== */

const express = require('express');
const router = express.Router();
const { submitInquiry, getInquiries } = require('../controllers/contactController');

router.post('/', submitInquiry);
router.get('/', getInquiries);

module.exports = router;
