/* ==========================================================================
   Razorpay Payment Express Routes
   ========================================================================== */

const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Order creation & HMAC signature verification
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
