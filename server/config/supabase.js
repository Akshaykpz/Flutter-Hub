/* ==========================================================================
   Supabase Database & Auth Client Connection Helper
   Configures backend client with SUPABASE_SECRET_KEY from environment variables
   ========================================================================== */

const { createClient } = require('@supabase/supabase-js');

let supabaseUrl = process.env.SUPABASE_URL || 'https://yseyqbiiptripgjuoiyh.supabase.co';
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, secretKey || 'missing_key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

if (!supabaseUrl || !secretKey) {

  console.warn('⚠️ Supabase credentials missing in environment variables!');

} else {

  console.log(`⚡ Supabase Client Connected to: ${supabaseUrl}`);

}

module.exports = supabase;
