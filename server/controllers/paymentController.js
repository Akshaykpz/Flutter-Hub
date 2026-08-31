/* ==========================================================================
   Razorpay Payment Gateway Controller (Supabase Integration)
   ─────────────────────────────────────────────────────────────────────────
   Security model:
   • Secret keys stay on server (never sent to frontend)
   • Subscription unlocked ONLY after HMAC SHA-256 signature verified
   • Idempotency: duplicate verify on same order returns success without
     re-processing (prevents double-unlock)
   • Webhook handler catches payments that lost connectivity after Razorpay
     returned but before the browser could call /verify
   ========================================================================== */

const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const supabase = require('../config/superbase');

/* ─────────────────────────────────────────────────────────────────────────
   HELPER — Activate subscription in Supabase after verified payment
   ───────────────────────────────────────────────────────────────────────── */
async function activateSubscription({ userId, plan, razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentMethod }) {
  const isYearly    = plan === 'yearly';
  const amount      = isYearly ? 299 : 29;
  const durationDays = isYearly ? 365 : 30;
  const startDate   = new Date();
  const expiryDate  = new Date();
  expiryDate.setDate(expiryDate.getDate() + durationDays);

  // 1. Update user subscription status
  if (userId) {
    try {
      await supabase
        .from('users')
        .update({
          subscription:            'pro',
          is_subscribed:           true,
          subscription_expiry:     expiryDate,
          subscription_expires_at: expiryDate,
          updated_at:              new Date(),
        })
        .eq('id', userId);
    } catch (e) {
      console.warn('[Payment] User subscription update notice:', e.message);
    }

    // 2. Insert subscription record
    try {
      await supabase.from('subscriptions').insert([{
        user_id:    userId,
        plan_name:  isYearly ? 'Pro Yearly Pass (₹299/year)' : 'Pro Monthly Pass (₹29/month)',
        amount,
        start_date: startDate,
        end_date:   expiryDate,
        status:     'active',
        created_at: new Date(),
      }]);
    } catch (e) {
      console.warn('[Payment] Subscription insert notice:', e.message);
    }
  }

  // 3. Update payment record to 'paid'
  try {
    await supabase
      .from('payments')
      .update({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature:  razorpaySignature,
        payment_method:      paymentMethod || 'razorpay',
        status:              'paid',
        verified_at:         new Date(),
      })
      .eq('razorpay_order_id', razorpayOrderId);
  } catch (e) {
    console.warn('[Payment] Payment record update notice:', e.message);
  }

  return { expiryDate, durationDays, amount, isYearly };
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/payment/create-order
   Creates a Razorpay order and stores the initial record in Supabase.
   ───────────────────────────────────────────────────────────────────────── */
const createOrder = async (req, res) => {
  try {
    const { plan, coupon_discount } = req.body; // plan: 'monthly' | 'yearly'

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Must be monthly or yearly.' });
    }

    const userId = req.user ? req.user._id : null;

    // Check if user already has an active subscription (idempotent entry point)
    if (userId) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('is_subscribed, subscription_expires_at')
        .eq('id', userId)
        .maybeSingle();

      if (existingUser?.is_subscribed) {
        const expiry = existingUser.subscription_expires_at;
        const isActive = expiry ? new Date(expiry) > new Date() : true;
        if (isActive) {
          return res.status(200).json({
            success:           true,
            already_subscribed: true,
            message:           'You already have an active Pro subscription.',
            expires_at:        expiry,
          });
        }
      }
    }

    // Calculate amount — allow a server-validated coupon discount (10% only)
    const isYearly       = plan === 'yearly';
    let baseAmount       = isYearly ? 299 : 29; // INR
    let finalAmount      = baseAmount;

    // Server-side coupon discount validation (10% max, yearly only)
    if (isYearly && coupon_discount && typeof coupon_discount === 'number') {
      const maxDiscount = Math.floor(baseAmount * 0.10);
      const appliedDiscount = Math.min(Math.abs(coupon_discount), maxDiscount);
      finalAmount = baseAmount - appliedDiscount;
    }

    const amountInPaise = finalAmount * 100;

    const orderOptions = {
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  `rcpt_flhub_${Date.now()}`,
      notes: {
        plan:     isYearly ? 'Pro Yearly (₹299/yr)' : 'Pro Monthly (₹29/mo)',
        platform: 'FlutterHub Production',
        user_id:  userId ? String(userId) : 'guest',
      },
    };

    // Create Razorpay Order via backend SDK (secret never leaves server)
    const order = await razorpayInstance.orders.create(orderOptions);

    // Persist initial payment record in Supabase
    try {
      await supabase.from('payments').insert([{
        user_id:          userId,
        razorpay_order_id: order.id,
        amount:           finalAmount,
        currency:         'INR',
        plan:             plan,
        status:           'created',
        created_at:       new Date(),
      }]);
    } catch (dbErr) {
      // Non-fatal — log and continue (order was created in Razorpay)
      console.warn('[Payment] Supabase insert notice:', dbErr.message);
    }

    return res.status(200).json({
      success:    true,
      order_id:   order.id,
      amount:     order.amount,
      currency:   order.currency,
      plan,
      key_id:     process.env.RAZORPAY_KEY_ID, // Only Key ID exposed (not secret)
    });
  } catch (error) {
    console.error('[Payment] Create Order Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order. Please try again.',
      error:   error.message,
    });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/payment/verify
   Verifies Razorpay HMAC SHA-256 signature and activates subscription.
   Idempotent: duplicate verify on same order_id returns success immediately.
   ───────────────────────────────────────────────────────────────────────── */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields (order_id, payment_id, signature).',
      });
    }

    // ── IDEMPOTENCY CHECK ──────────────────────────────────────────────────
    // If this order was already verified and paid, return success immediately
    // without re-running verification or re-activating the subscription.
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('status, plan')
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (existingPayment && existingPayment.status === 'paid') {
      console.log(`[Payment] Duplicate verify for order ${razorpay_order_id} — returning cached success.`);
      return res.status(200).json({
        success:          true,
        idempotent:       true,
        message:          'Payment already verified. Your Pro subscription is active.',
        data: {
          paymentId:    razorpay_payment_id,
          orderId:      razorpay_order_id,
          subscription: 'pro',
          isSubscribed: true,
          plan:         existingPayment.plan || plan,
        },
      });
    }

    // ── HMAC SHA-256 SIGNATURE VERIFICATION ───────────────────────────────
    // Razorpay signs: razorpay_order_id + "|" + razorpay_payment_id
    const body             = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpay_signature,  'hex')
    );

    if (!isAuthentic) {
      // Mark payment as failed in DB
      try {
        await supabase
          .from('payments')
          .update({ status: 'failed', updated_at: new Date() })
          .eq('razorpay_order_id', razorpay_order_id);
      } catch (_) {}

      console.warn(`[Payment] ⚠️ Signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Please contact support.',
      });
    }

    // ── FETCH PAYMENT METHOD FROM RAZORPAY API ─────────────────────────────
    let paymentMethod = 'razorpay';
    try {
      const rzpPayment = await razorpayInstance.payments.fetch(razorpay_payment_id);
      paymentMethod = rzpPayment.method || 'razorpay'; // 'upi', 'card', 'netbanking', etc.
    } catch (_) {}

    // ── ACTIVATE SUBSCRIPTION ──────────────────────────────────────────────
    const resolvedPlan = plan || existingPayment?.plan || 'yearly';
    const userId       = req.user ? req.user._id : null;

    const { expiryDate, durationDays, isYearly } = await activateSubscription({
      userId,
      plan:               resolvedPlan,
      razorpayOrderId:    razorpay_order_id,
      razorpayPaymentId:  razorpay_payment_id,
      razorpaySignature:  razorpay_signature,
      paymentMethod,
    });

    console.log(`[Payment] ✅ Verified & activated: order=${razorpay_order_id}, user=${userId}, plan=${resolvedPlan}, method=${paymentMethod}`);

    return res.status(200).json({
      success: true,
      message: `🎉 Payment Verified! Pro subscription activated for ${durationDays} days.`,
      data: {
        paymentId:    razorpay_payment_id,
        orderId:      razorpay_order_id,
        subscription: 'pro',
        isSubscribed: true,
        plan:         resolvedPlan,
        expiresAt:    expiryDate,
        paymentMethod,
      },
    });
  } catch (error) {
    console.error('[Payment] Verify Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed due to a server error. Please contact support.',
      error:   error.message,
    });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   GET /api/payment/status
   Returns whether the current user already has an active subscription.
   Used by the frontend to show an "Already subscribed" state before
   opening checkout (prevents duplicate purchase attempts).
   ───────────────────────────────────────────────────────────────────────── */
const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(200).json({ success: true, is_subscribed: false });
    }

    const { data: user } = await supabase
      .from('users')
      .select('is_subscribed, subscription_expires_at, subscription')
      .eq('id', userId)
      .maybeSingle();

    if (!user) {
      return res.status(200).json({ success: true, is_subscribed: false });
    }

    const expiry   = user.subscription_expires_at;
    const isActive = user.is_subscribed && (expiry ? new Date(expiry) > new Date() : true);

    return res.status(200).json({
      success:       true,
      is_subscribed: isActive,
      expires_at:    expiry || null,
      subscription:  user.subscription || null,
    });
  } catch (error) {
    console.error('[Payment] Status check error:', error);
    return res.status(500).json({ success: false, is_subscribed: false, error: error.message });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/payment/webhook
   Razorpay webhook — catches payments that were completed in the Razorpay
   app but the browser lost connectivity before /verify was called.
   
   ⚠️  This route is mounted in server.js BEFORE express.json() using
       express.raw({ type: 'application/json' }) so that the raw Buffer
       body is available for HMAC verification.
   
   Configure in Razorpay Dashboard:
     Settings → Webhooks → Add New Webhook
     URL:    https://your-domain.com/api/payment/webhook
     Secret: value of RAZORPAY_WEBHOOK_SECRET in .env
     Events: payment.captured, payment.failed, order.paid
   ───────────────────────────────────────────────────────────────────────── */
const handleWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('[Webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification.');
    return res.status(200).json({ received: true, warning: 'Webhook secret not configured.' });
  }

  // ── VERIFY WEBHOOK SIGNATURE ───────────────────────────────────────────
  const razorpaySignature = req.headers['x-razorpay-signature'];
  if (!razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Missing X-Razorpay-Signature header.' });
  }

  // req.body is a Buffer (raw body) at this point — required for HMAC
  const rawBody = req.body;
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  let isSigValid = false;
  try {
    isSigValid = crypto.timingSafeEqual(
      Buffer.from(expectedSig,       'hex'),
      Buffer.from(razorpaySignature, 'hex')
    );
  } catch (_) {
    isSigValid = false;
  }

  if (!isSigValid) {
    console.warn('[Webhook] ⚠️ Invalid webhook signature — request rejected.');
    return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
  }

  // ── PARSE EVENT ────────────────────────────────────────────────────────
  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }

  const eventType = event.event;
  console.log(`[Webhook] Received event: ${eventType}`);

  // ── HANDLE payment.captured / order.paid ──────────────────────────────
  // These fire when a UPI / card / netbanking payment is successfully captured.
  if (eventType === 'payment.captured' || eventType === 'order.paid') {
    const payment = event.payload?.payment?.entity || event.payload?.order?.entity;

    if (!payment) {
      return res.status(200).json({ received: true, message: 'No payment entity in payload.' });
    }

    const orderId   = payment.order_id;
    const paymentId = payment.id;
    const method    = payment.method || 'razorpay';

    // Check if already processed (idempotency for webhooks too)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('status, plan, user_id')
      .eq('razorpay_order_id', orderId)
      .maybeSingle();

    if (existingPayment && existingPayment.status === 'paid') {
      console.log(`[Webhook] Order ${orderId} already paid — skipping.`);
      return res.status(200).json({ received: true, idempotent: true });
    }

    const userId = existingPayment?.user_id || null;
    const plan   = existingPayment?.plan || 'yearly';

    // Razorpay webhook doesn't carry a signature pair for HMAC like the checkout handler.
    // The event-level signature (verified above) is sufficient for webhooks.
    // We derive a synthetic signature string to satisfy the helper function signature.
    await activateSubscription({
      userId,
      plan,
      razorpayOrderId:   orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: 'webhook_verified',
      paymentMethod:     method,
    });

    console.log(`[Webhook] ✅ Activated subscription for order ${orderId}, user ${userId}, method ${method}`);
    return res.status(200).json({ received: true, processed: true });
  }

  // ── HANDLE payment.failed ──────────────────────────────────────────────
  if (eventType === 'payment.failed') {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id) {
      try {
        await supabase
          .from('payments')
          .update({ status: 'failed', updated_at: new Date() })
          .eq('razorpay_order_id', payment.order_id);
        console.log(`[Webhook] Marked order ${payment.order_id} as failed.`);
      } catch (e) {
        console.warn('[Webhook] Failed to mark payment failed:', e.message);
      }
    }
    return res.status(200).json({ received: true });
  }

  // Acknowledge other events without processing
  return res.status(200).json({ received: true, event: eventType });
};

module.exports = { createOrder, verifyPayment, getPaymentStatus, handleWebhook };
