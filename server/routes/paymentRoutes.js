/* ==========================================================================
   Razorpay Payment Express Routes
   - POST /api/payment/create-order  → Create Razorpay order (protected)
   - POST /api/payment/verify        → Verify HMAC signature & activate subscription (protected)
   - GET  /api/payment/status        → Check if user already has active subscription (protected)
   - POST /api/payment/webhook       → Razorpay webhook (raw body, mounted in server.js before express.json)
   ========================================================================== */

const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Order creation & HMAC signature verification (JWT required)
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

// Check active subscription status before showing checkout (JWT required)
router.get('/status', protect, getPaymentStatus);

// NOTE: /api/payment/webhook is mounted directly in server.js BEFORE express.json()
// to preserve the raw body required for Razorpay HMAC signature verification.

module.exports = router;
