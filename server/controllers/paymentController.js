/* ==========================================================================
   Razorpay Payment Gateway Controller (Supabase Integration)
   Creates Orders securely from Backend for Monthly (₹29) or Yearly (₹300) Plans
   ========================================================================== */

const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const supabase = require('../config/superbase');

// @desc    Create Razorpay Order for ₹29/month or ₹300/year Pro Plan
// @route   POST /api/payment/create-order
// @access  Public (or Protected)
const createOrder = async (req, res) => {
  try {
    const { plan } = req.body; // 'monthly' or 'yearly'
    const amount = plan === 'yearly' ? 300 : 29; // ₹300/year or ₹29/month
    const amountInPaise = amount * 100; // 30000 or 2900 paise

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_flutterhub_${Date.now()}`,
      notes: {
        plan: plan === 'yearly' ? 'Pro Yearly (₹300/yr)' : 'Pro Monthly (₹29/mo)',
        platform: 'FlutterHub Production',
      },
    };

    // Create Razorpay Order via Backend SDK Instance
    const order = await razorpayInstance.orders.create(options);

    // Save initial payment record in Supabase table
    try {
      await supabase.from('payments').insert([
        {
          user_id: req.user ? req.user._id : null,
          razorpay_order_id: order.id,
          amount: amount,
          currency: 'INR',
          status: 'created',
          created_at: new Date(),
        },
      ]);
    } catch (dbErr) {
      console.log('Payment Supabase log notice:', dbErr.message);
    }

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: plan === 'yearly' ? 'yearly' : 'monthly',
      key_id: process.env.RAZORPAY_KEY_ID, // Expose Key ID only
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay Order',
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay HMAC SHA256 Signature & Activate Pro Subscription
// @route   POST /api/payment/verify
// @access  Public (or Protected)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay signature fields',
      });
    }

    // Generate expected signature using Razorpay Key Secret
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature verification failed!',
      });
    }

    // Calculate Subscription Expiry Date (365 days for yearly ₹300, 30 days for monthly ₹29)
    const isYearly = plan === 'yearly';
    const durationDays = isYearly ? 365 : 30;
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    // Update User Subscription in Supabase users table
    const targetUserId = userId || (req.user ? req.user._id : null);
    if (targetUserId) {
      try {
        await supabase
          .from('users')
          .update({
            subscription: 'pro',
            is_subscribed: true,
            subscription_expiry: expiryDate,
            subscription_expires_at: expiryDate,
            updated_at: new Date(),
          })
          .eq('id', targetUserId);

        // Log Subscription record in Supabase
        await supabase.from('subscriptions').insert([
          {
            user_id: targetUserId,
            plan_name: isYearly ? 'Pro Yearly Pass (₹300/year)' : 'Pro Monthly Pass (₹29/month)',
            amount: isYearly ? 300 : 29,
            start_date: startDate,
            end_date: expiryDate,
            status: 'active',
            created_at: new Date(),
          },
        ]);
      } catch (userDbErr) {
        console.log('User Supabase update notice:', userDbErr.message);
      }
    }

    // Update Payment record in Supabase
    try {
      await supabase
        .from('payments')
        .update({
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          status: 'paid',
        })
        .eq('razorpay_order_id', razorpay_order_id);
    } catch (payDbErr) {
      console.log('Payment update Supabase notice:', payDbErr.message);
    }

    res.status(200).json({
      success: true,
      message: `🎉 Payment Verified Successfully! Pro Subscription Activated for ${durationDays} Days.`,
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        subscription: 'pro',
        isSubscribed: true,
        plan: isYearly ? 'yearly' : 'monthly',
        expiresAt: expiryDate,
      },
    });
  } catch (error) {
    console.error('Razorpay Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

module.exports = { createOrder, verifyPayment };
