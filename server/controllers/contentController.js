/* ==========================================================================
   Protected Content Controller
   Ensures only active ₹29 Pro subscribers can access premium downloads
   ========================================================================== */

// @desc    Download Premium Flutter Source Code / Project Zips
// @route   GET /api/content/download/:id
// @access  Protected + Require Subscription
const downloadPremiumContent = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify User Pro Subscription status
    if (!req.user || !req.user.isSubscribed) {
      return res.status(403).json({
        success: false,
        message: 'Subscription Required! Please upgrade to Pro for ₹29/month to download this item.',
        code: 'SUBSCRIPTION_REQUIRED',
      });
    }

    res.json({
      success: true,
      message: `Downloading premium Flutter item ${id}`,
      downloadUrl: `https://flutterhub.dev/downloads/premium_${id}.zip`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { downloadPremiumContent };
