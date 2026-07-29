/* ==========================================================================
   Scratch Coupon Reward System Controller
   Handles Welcome Scratch Coupons, Coupon Scratching, Server Validation,
   Checkout Discount Application, and Admin Coupon Management
   ========================================================================== */

const supabase = require('../config/supabase');
const crypto = require('crypto');

// In-memory data store backup for non-blocking persistence
let memoryCoupons = [];

// Helper to generate unique coupon code
const generateCouponCode = (prefix = 'WELCOME10') => {
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${randomChars}`;
};

// Helper to format coupon record for client
const formatCoupon = (c) => {
  const now = new Date();
  const expiry = new Date(c.expiry_date || c.expiryDate);
  const isExpired = expiry < now;

  let status = 'Active';
  if (c.is_used || c.isUsed) status = 'Used';
  else if (c.is_disabled || c.isDisabled) status = 'Disabled';
  else if (isExpired) status = 'Expired';
  else if (c.is_scratched || c.isScratched) status = 'Scratched';
  else status = 'Unscratched';

  return {
    id: c.id,
    user_id: c.user_id || c.userId,
    user_email: c.user_email || c.userEmail || '',
    user_name: c.user_name || c.userName || 'Developer',
    coupon_code: c.coupon_code || c.couponCode,
    discount_percentage: c.discount_percentage || c.discountPercentage || 10,
    expiry_date: c.expiry_date || c.expiryDate,
    is_scratched: !!(c.is_scratched || c.isScratched),
    is_used: !!(c.is_used || c.isUsed),
    is_disabled: !!(c.is_disabled || c.isDisabled),
    created_at: c.created_at || c.createdAt || new Date().toISOString(),
    used_at: c.used_at || c.usedAt || null,
    status
  };
};

// @desc Create or assign welcome coupon for user if not already assigned
const assignWelcomeCoupon = async (userId, userEmail, userName = 'Developer') => {
  try {
    if (!userId) return null;

    // Check if user already has a welcome coupon
    const { data: existing } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      return formatCoupon(existing);
    }

    const code = generateCouponCode('WELCOME10');
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 Year Validity

    const couponRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      user_email: userEmail || '',
      user_name: userName || 'Developer',
      coupon_code: code,
      discount_percentage: 10,
      expiry_date: expiryDate.toISOString(),
      is_scratched: false,
      is_used: false,
      is_disabled: false,
      created_at: new Date().toISOString()
    };

    // Store in Supabase
    const { data: inserted, error } = await supabase
      .from('user_coupons')
      .insert([couponRecord])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Notice syncing coupon to Supabase table user_coupons:', error.message);
    }

    const finalRecord = inserted || couponRecord;
    memoryCoupons.push(finalRecord);
    return formatCoupon(finalRecord);
  } catch (err) {
    console.error('Error assigning welcome coupon:', err.message);
    return null;
  }
};

// @desc GET /api/coupons/my-coupons
// Returns all coupons assigned to logged-in user
const getMyCoupons = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId;
    const userEmail = req.headers['x-user-email'] || req.query.userEmail;

    if (!userId && !userEmail) {
      return res.status(400).json({ success: false, message: 'User identifier required.' });
    }

    // Try fetching from Supabase
    let coupons = [];
    if (userId) {
      const { data } = await supabase
        .from('user_coupons')
        .select('*')
        .eq('user_id', userId);
      if (Array.isArray(data) && data.length > 0) {
        coupons = data;
      }
    }

    // If no coupon found in Supabase, ensure welcome coupon exists
    if (coupons.length === 0) {
      const welcome = await assignWelcomeCoupon(userId, userEmail);
      if (welcome) coupons = [welcome];
    }

    // Combine with memory fallback
    const memoryMatches = memoryCoupons.filter(c => c.user_id === userId || (userEmail && c.user_email === userEmail));
    memoryMatches.forEach(mc => {
      if (!coupons.some(c => c.coupon_code === mc.coupon_code)) {
        coupons.push(mc);
      }
    });

    const formatted = coupons.map(formatCoupon);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons', error: err.message });
  }
};

// @desc POST /api/coupons/scratch
// Marks coupon as scratched after user completes scratch animation
const scratchCoupon = async (req, res) => {
  try {
    const { coupon_code, userId } = req.body;
    if (!coupon_code) {
      return res.status(400).json({ success: false, message: 'Coupon code required.' });
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from('user_coupons')
      .update({ is_scratched: true })
      .eq('coupon_code', coupon_code.trim().toUpperCase())
      .select()
      .maybeSingle();

    // Update in memory backup
    const memItem = memoryCoupons.find(c => c.coupon_code === coupon_code.trim().toUpperCase());
    if (memItem) memItem.is_scratched = true;

    const updated = data || memItem || { coupon_code, is_scratched: true };
    res.json({
      success: true,
      message: '🎉 Scratch reward unlocked successfully!',
      data: formatCoupon(updated)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to scratch coupon', error: err.message });
  }
};

// @desc POST /api/coupons/validate
// Strictly validates coupon during checkout (Yearly plan only)
const validateCoupon = async (req, res) => {
  try {
    const { coupon_code, plan, userId, userEmail } = req.body;
    const cleanCode = (coupon_code || '').trim().toUpperCase();

    if (!cleanCode) {
      return res.status(400).json({ success: false, message: 'Please enter a valid coupon code.' });
    }

    if (plan && plan.toLowerCase() !== 'yearly') {
      return res.status(400).json({
        success: false,
        message: '10% Welcome Coupon is valid exclusively for the Yearly Premium Plan.'
      });
    }

    // Fetch coupon from DB or memory
    let coupon = null;
    const { data } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('coupon_code', cleanCode)
      .maybeSingle();

    coupon = data || memoryCoupons.find(c => c.coupon_code === cleanCode);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code. Please check and try again.' });
    }

    // Security Checks
    if (coupon.is_disabled || coupon.isDisabled) {
      return res.status(400).json({ success: false, message: 'This coupon code has been disabled.' });
    }

    if (coupon.is_used || coupon.isUsed) {
      return res.status(400).json({ success: false, message: 'This coupon code has already been used.' });
    }

    const now = new Date();
    const expiry = new Date(coupon.expiry_date || coupon.expiryDate);
    if (expiry < now) {
      return res.status(400).json({ success: false, message: 'This coupon code has expired.' });
    }

    // Check ownership if user_id or email provided
    if (userId && coupon.user_id && coupon.user_id !== userId && userEmail && coupon.user_email && coupon.user_email.toLowerCase() !== userEmail.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'This coupon belongs to another user account.' });
    }

    const originalPrice = 300;
    const discountPercentage = coupon.discount_percentage || 10;
    const discountAmount = Math.round((originalPrice * discountPercentage) / 100);
    const finalPrice = originalPrice - discountAmount;

    res.json({
      success: true,
      message: `🎉 Coupon ${cleanCode} applied! You save ₹${discountAmount} (10% OFF)!`,
      data: {
        coupon_code: cleanCode,
        originalPrice,
        discountPercentage,
        discountAmount,
        finalPrice,
        coupon: formatCoupon(coupon)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Coupon validation failed', error: err.message });
  }
};

// @desc POST /api/coupons/apply
// Marks coupon as used upon successful Razorpay payment
const applyCouponAfterPayment = async (req, res) => {
  try {
    const { coupon_code, payment_id } = req.body;
    const cleanCode = (coupon_code || '').trim().toUpperCase();

    if (!cleanCode) {
      return res.status(400).json({ success: false, message: 'Coupon code required.' });
    }

    const usedAt = new Date().toISOString();

    // Update DB
    await supabase
      .from('user_coupons')
      .update({ is_used: true, used_at: usedAt })
      .eq('coupon_code', cleanCode);

    // Update memory
    const mem = memoryCoupons.find(c => c.coupon_code === cleanCode);
    if (mem) {
      mem.is_used = true;
      mem.used_at = usedAt;
    }

    res.json({ success: true, message: `Coupon ${cleanCode} marked as used.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to complete coupon application', error: err.message });
  }
};

// @desc GET /api/coupons/admin/all
// Admin route: View all coupons in system
const getAllCouponsAdmin = async (req, res) => {
  try {
    let coupons = [];
    const { data, error } = await supabase
      .from('user_coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (Array.isArray(data)) coupons = data;

    // Merge memory coupons
    memoryCoupons.forEach(mc => {
      if (!coupons.some(c => c.coupon_code === mc.coupon_code)) {
        coupons.push(mc);
      }
    });

    const formatted = coupons.map(formatCoupon);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin coupons', error: err.message });
  }
};

// @desc POST /api/coupons/admin/create
// Admin route: Create custom promotional coupon
const createPromoCouponAdmin = async (req, res) => {
  try {
    const { prefix, discount_percentage, user_id, user_email, expiry_days } = req.body;

    const code = generateCouponCode(prefix ? prefix.trim().toUpperCase() : 'PROMO10');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (parseInt(expiry_days) || 365));

    const couponRecord = {
      id: crypto.randomUUID(),
      user_id: user_id || 'ALL',
      user_email: user_email || 'all_users',
      user_name: 'Promotional User',
      coupon_code: code,
      discount_percentage: parseInt(discount_percentage) || 10,
      expiry_date: expiryDate.toISOString(),
      is_scratched: true, // Custom admin promo codes are pre-scratched
      is_used: false,
      is_disabled: false,
      created_at: new Date().toISOString()
    };

    await supabase.from('user_coupons').insert([couponRecord]);
    memoryCoupons.push(couponRecord);

    res.json({
      success: true,
      message: `Created promotional coupon ${code}!`,
      data: formatCoupon(couponRecord)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create promo coupon', error: err.message });
  }
};

// @desc POST /api/coupons/admin/toggle
// Admin route: Enable or Disable a coupon
const toggleCouponAdmin = async (req, res) => {
  try {
    const { coupon_code, is_disabled } = req.body;
    const cleanCode = (coupon_code || '').trim().toUpperCase();

    await supabase
      .from('user_coupons')
      .update({ is_disabled: !!is_disabled })
      .eq('coupon_code', cleanCode);

    const mem = memoryCoupons.find(c => c.coupon_code === cleanCode);
    if (mem) mem.is_disabled = !!is_disabled;

    res.json({
      success: true,
      message: `Coupon ${cleanCode} ${is_disabled ? 'disabled' : 'enabled'} successfully.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle coupon status', error: err.message });
  }
};

module.exports = {
  assignWelcomeCoupon,
  getMyCoupons,
  scratchCoupon,
  validateCoupon,
  applyCouponAfterPayment,
  getAllCouponsAdmin,
  createPromoCouponAdmin,
  toggleCouponAdmin
};
