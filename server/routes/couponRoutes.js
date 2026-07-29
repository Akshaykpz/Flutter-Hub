/* ==========================================================================
   Scratch Coupon Reward System Express API Router
   Routes: /api/coupons/*
   ========================================================================== */

const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// User Coupon Routes
router.get('/my-coupons', couponController.getMyCoupons);
router.post('/scratch', couponController.scratchCoupon);
router.post('/validate', couponController.validateCoupon);
router.post('/apply', couponController.applyCouponAfterPayment);

// Admin Coupon Routes
router.get('/admin/all', couponController.getAllCouponsAdmin);
router.post('/admin/create', couponController.createPromoCouponAdmin);
router.post('/admin/toggle', couponController.toggleCouponAdmin);

module.exports = router;
