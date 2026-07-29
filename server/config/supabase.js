/* ==========================================================================
   Supabase Database & Auth Client Connection Helper
   ========================================================================== */

const { createClient } = require('@supabase/supabase-js');

let supabaseUrl = process.env.SUPABASE_URL || 'https://yseyqbiiptripgjuoiyh.supabase.co';
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_KEY ||
  'sb_publishable_lT3PX7OyROE90OK-wn8cIA_nTtOn8wN';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing in environment variables!');
} else {
  console.log(`⚡ Supabase Client Connected to: ${supabaseUrl}`);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
