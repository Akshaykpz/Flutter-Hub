/* ==========================================================================
   Authentication & Premium Subscription Protection Middleware (Supabase)
   ========================================================================== */

const jwt = require('jsonwebtoken');
const supabase = require('../config/superbase');

// Verify JWT Bearer Token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flutterhub_secret');

      const { data: user } = await supabase
        .from('users')
        .select('id, name, email, is_subscribed, subscription_expires_at')
        .eq('id', decoded.id)
        .maybeSingle();

      req.user = user ? {
        _id: user.id,
        name: user.name,
        email: user.email,
        isSubscribed: user.is_subscribed,
        subscriptionExpiresAt: user.subscription_expires_at,
      } : { _id: decoded.id, name: 'Developer', isSubscribed: false };

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  req.user = null;
  next();
};

// Require Active ₹29 Pro Subscription
const requireSubscription = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to access premium Flutter resources.',
    });
  }

  const isExpired = req.user.subscriptionExpiresAt && new Date(req.user.subscriptionExpiresAt) < new Date();

  if (!req.user.isSubscribed || isExpired) {
    return res.status(403).json({
      success: false,
      message: 'Subscription Required! Upgrade to FlutterHub Pro for ₹29/month to download this item.',
      code: 'SUBSCRIPTION_REQUIRED',
    });
  }

  next();
};

module.exports = { protect, requireSubscription };
