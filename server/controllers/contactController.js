/* ==========================================================================
   FlutterHub Contact / Inquiry Controller (Supabase)
   ─────────────────────────────────────────────────────────────────────────
   Public endpoint — no auth required. Saves user inquiries to Supabase so
   the team can follow up. NEVER exposes secrets.
   ========================================================================== */

const supabase = require('../config/superbase');

// Lightweight field validation
function cleanString(value, maxLen) {
  return String(value || '').trim().slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/contact
   Body: { name, email, purpose, company_name, phone, message? }
   ───────────────────────────────────────────────────────────────────────── */
const submitInquiry = async (req, res) => {
  try {
    const name         = cleanString(req.body?.name, 120);
    const email        = cleanString(req.body?.email, 200).toLowerCase();
    const purpose      = cleanString(req.body?.purpose, 150);
    const companyName  = cleanString(req.body?.company_name, 200);
    const phone        = cleanString(req.body?.phone, 30);
    const message      = cleanString(req.body?.message, 4000);

    // ── Validate required fields ───────────────────────────────────────
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }
    if (!purpose) {
      return res.status(400).json({ success: false, message: 'Please select the purpose of your inquiry.' });
    }

    // ── Insert into Supabase ───────────────────────────────────────────
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        purpose,
        company_name: companyName || null,
        phone:        phone || null,
        message:      message || null,
        created_at:   new Date(),
      }])
      .select('id')
      .single();

    if (error) {
      console.error('[Contact] Supabase insert error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'We could not save your inquiry right now. Please try again.',
      });
    }

    console.log(`[Contact] New inquiry saved: ${email} (${purpose}) id=${data?.id}`);

    return res.status(200).json({
      success: true,
      message: "Thanks for reaching out — we've received your inquiry and will respond within one business day.",
      data: { id: data?.id || null },
    });
  } catch (err) {
    console.error('[Contact] Endpoint error:', err);
    return res.status(500).json({
      success: false,
      message: "We couldn't save your inquiry right now. Please try again.",
    });
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   GET /api/contact
   Admin status — returns the count of stored inquiries.
   (Simple convenience; extend with auth-protection if exposed publicly.)
   ───────────────────────────────────────────────────────────────────────── */
const getInquiries = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({ success: false, count: 0, error: error.message });
    }

    return res.status(200).json({ success: true, count: count || 0 });
  } catch (err) {
    return res.status(500).json({ success: false, count: 0 });
  }
};

module.exports = { submitInquiry, getInquiries };
