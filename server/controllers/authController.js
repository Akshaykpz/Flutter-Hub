/* ==========================================================================
   User Authentication & Supabase Database Sync Controller
   ─────────────────────────────────────────────────────────────────────────
   When Supabase is unreachable (paused project, DNS failure, network outage)
   the controller automatically falls back to LocalUserStore — a local JSON
   file at server/data/local_users.json — so registration and login keep
   working. Once Supabase is restored, new users can be migrated.
   ========================================================================== */

const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const couponController = require('./couponController');
const LocalUserStore = require('../utils/localUserStore');

// Logger helper for formatted terminal / debug console output
const logTime = () => new Date().toISOString();
const logAuth = (action, message) => {
  console.log(`\x1b[36m[${logTime()}] 🔑 [AUTH ${action}]:\x1b[0m ${message}`);
};
const logDb = (action, message) => {
  console.log(`\x1b[32m[${logTime()}] ⚡ [SUPABASE DB ${action}]:\x1b[0m ${message}`);
};

// Map raw fetch/DNS errors to user-friendly messages
const friendlyError = (error) => {
  const msg = (error.message || error.name || '').toLowerCase();
  if (
    msg.includes('fetch failed') ||
    msg.includes('enotfound') ||
    msg.includes('econnrefused') ||
    msg.includes('network') ||
    msg.includes('getaddrinfo') ||
    msg.includes('dns') ||
    msg.includes('timeout')
  ) {
    return 'Database service is temporarily unavailable. Please try again in a moment.';
  }
  return error.message || 'An unexpected error occurred.';
};

// Helper to convert DB user record to standardized client user object
const toClientUser = (user) => {
  const name = user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'admin@admin.com';
  const isPro = isAdmin || user?.subscription === 'pro' || !!user?.is_subscribed;

  return {
    _id: user?.id,
    id: user?.id,
    full_name: name,
    name,
    email: user?.email,
    avatar: user?.avatar || (isAdmin ? '👑' : name[0].toUpperCase()),
    role: isAdmin ? 'admin' : (user?.role || 'user'),
    isAdmin,
    subscription: isPro ? 'pro' : 'free',
    isSubscribed: isPro,
    token: user?.id ? generateToken(user.id) : null,
    createdAt: user?.created_at || new Date().toISOString(),
  };
};

// @desc    Register a new user in Supabase Auth & Users database table
//          Falls back to LocalUserStore when Supabase is unreachable.
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const requestTime = logTime();
  try {
    const { name, email, password } = req.body;
    logAuth('SIGN-UP REQUEST', `Initiated at ${requestTime} | Email: ${email} | Name: ${name}`);

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // ── Try Supabase first ────────────────────────────────────────────────
    let supabaseAvailable = false;
    try {
      const fetchStartTime = Date.now();
      logDb('FETCH CHECK', `Checking if "${cleanEmail}" exists in Supabase...`);

      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', cleanEmail)
        .maybeSingle();

      logDb('FETCH CHECK DONE', `Completed in ${Date.now() - fetchStartTime}ms`);
      supabaseAvailable = true;

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      // Register in Supabase Auth
      let authUser = null;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { name: name.trim() } },
      });

      if (authError) {
        // If it's a connectivity error (signUp returned 'fetch failed'), fall back to local store
        if (LocalUserStore.isConnectionError(authError)) {
          throw authError; // caught below
        }
        logAuth('SIGN-UP NOTICE', `signUp notice: ${authError.message}. Trying admin fallback...`);
        const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password,
          email_confirm: true,
          user_metadata: { name: name.trim() }
        });
        if (adminError) {
          // If admin call also fails with connectivity error, fall to local
          if (LocalUserStore.isConnectionError(adminError)) {
            throw adminError;
          }
          logAuth('SIGN-UP ERROR', `Supabase Auth error: ${adminError.message}`);
          return res.status(400).json({ success: false, message: adminError.message || authError.message });
        }
        authUser = adminData?.user;
      } else {
        authUser = authData?.user;
      }

      const userId = authUser ? authUser.id : crypto.randomUUID();
      const newUserRecord = {
        id:         userId,
        name:       name.trim(),
        email:      cleanEmail,
        created_at: new Date().toISOString(),
      };

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .upsert([newUserRecord], { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (insertError) {
        logDb('INSERT NOTICE', `RLS notice: ${insertError.message}`);
      }

      try { await couponController.assignWelcomeCoupon(userId, cleanEmail, name.trim()); } catch (_) {}

      logAuth('SIGN-UP SUCCESS', `User "${cleanEmail}" registered in Supabase.`);
      return res.status(201).json({
        success: true,
        message: 'Account created & saved successfully.',
        data: toClientUser(newUser || newUserRecord),
      });

    } catch (supabaseError) {
      if (!LocalUserStore.isConnectionError(supabaseError)) {
        // Not a connectivity error — rethrow
        throw supabaseError;
      }
      console.warn(`[Auth] ⚠️ Supabase unreachable (${supabaseError.message}) — falling back to LocalUserStore.`);
    }

    // ── Supabase unreachable: use local fallback ──────────────────────────
    // Check local store for duplicate
    const existingLocal = LocalUserStore.findByEmail(cleanEmail);
    if (existingLocal) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const localResult = LocalUserStore.register({ name, email: cleanEmail, password });
    if (!localResult.success) {
      return res.status(400).json({ success: false, message: localResult.message });
    }

    logAuth('SIGN-UP LOCAL', `User "${cleanEmail}" registered in LocalUserStore (Supabase offline).`);
    return res.status(201).json({
      success: true,
      message: 'Account created successfully! (Sync pending — database will be updated when service restores.)',
      data: toClientUser(localResult.user),
      _local: true,
    });

  } catch (error) {
    console.error(`[${logTime()}] ❌ Registration Exception:`, error);
    return res.status(500).json({ success: false, message: friendlyError(error) });
  }
};

// @desc    Authenticate user & sync with Supabase Users database table
//          Falls back to LocalUserStore when Supabase is unreachable.
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const requestTime = logTime();
  try {
    const { email, password } = req.body;
    logAuth('LOGIN REQUEST', `Initiated at ${requestTime} | Email: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 0. Special Admin Verification
    if (cleanEmail === 'admin@admin.com' && password === 'akshaykp@9072') {
      logAuth('ADMIN LOGIN VERIFIED', `Admin credentials matched for ${cleanEmail}`);

      let adminUser = null;
      try {
        const { data } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle();
        adminUser = data;
      } catch (_) {}

      if (!adminUser) {
        const adminRecord = {
          id: 'admin_sys_' + crypto.randomUUID(),
          name: 'System Admin',
          email: 'admin@admin.com',
          role: 'admin',
          created_at: new Date().toISOString(),
        };
        try {
          const { data } = await supabase.from('users').upsert([adminRecord], { onConflict: 'id' }).select().maybeSingle();
          adminUser = data || adminRecord;
        } catch (_) {
          adminUser = adminRecord;
        }
      }

      adminUser.role = 'admin';
      return res.json({
        success: true,
        message: '👑 Admin Sign in Successful!',
        data: toClientUser(adminUser),
      });
    }

    // ── Try Supabase Auth first ───────────────────────────────────────────
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        // If it's a credentials error (not a network error), return it directly
        if (!LocalUserStore.isConnectionError(authError)) {
          logAuth('LOGIN FAILED', `Invalid credentials for ${cleanEmail}: ${authError.message}`);
          return res.status(401).json({ success: false, message: authError.message || 'Invalid email or password.' });
        }
        // Network error — fall through to local store
        throw authError;
      }

      // Supabase auth succeeded
      const authUser = authData?.user;
      logAuth('LOGIN VERIFIED', `Supabase Auth verified | User ID: ${authUser?.id}`);

      let { data: user } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle();

      if (!user && authUser) {
        const newUserRecord = {
          id:         authUser.id,
          name:       authUser.user_metadata?.name || cleanEmail.split('@')[0],
          email:      cleanEmail,
          created_at: new Date().toISOString(),
        };
        try {
          const { data } = await supabase.from('users').upsert([newUserRecord], { onConflict: 'id' }).select().maybeSingle();
          user = data || newUserRecord;
        } catch (_) {
          user = newUserRecord;
        }
      }

      try { await couponController.assignWelcomeCoupon(user.id, user.email, user.name); } catch (_) {}

      logAuth('LOGIN SUCCESS', `User "${user?.name}" (${user?.email}) logged in via Supabase.`);
      return res.json({ success: true, message: 'Sign in successful.', data: toClientUser(user) });

    } catch (supabaseError) {
      if (!LocalUserStore.isConnectionError(supabaseError)) {
        throw supabaseError;
      }
      console.warn(`[Auth] ⚠️ Supabase unreachable (${supabaseError.message}) — falling back to LocalUserStore.`);
    }

    // ── Supabase unreachable: check local store ───────────────────────────
    const localResult = LocalUserStore.login({ email: cleanEmail, password });
    if (!localResult.success) {
      return res.status(401).json({ success: false, message: localResult.message });
    }

    logAuth('LOGIN LOCAL', `User "${cleanEmail}" authenticated via LocalUserStore (Supabase offline).`);
    return res.json({
      success: true,
      message: 'Sign in successful.',
      data: toClientUser(localResult.user),
      _local: true,
    });

  } catch (error) {
    console.error(`[${logTime()}] ❌ Login Exception:`, error);
    return res.status(500).json({ success: false, message: friendlyError(error) });
  }
};

// @desc    Get Supabase OAuth Redirect URL for Google / GitHub
// @route   GET /api/auth/provider/:provider
// @access  Public
const getOAuthUrl = async (req, res) => {
  const provider = req.params.provider;
  console.log(`\n=============================================================`);
  console.log(`🔑 [OAUTH REDIRECT INIT] Provider: ${provider.toUpperCase()} | Time: ${logTime()}`);
  console.log(`=============================================================\n`);
  try {
    if (!['google', 'github'].includes(provider)) {
      return res.status(400).json({ success: false, message: 'Unsupported OAuth provider.' });
    }

    // Resolve dynamic redirect URL for both mobile & desktop devices (and deployed environments)
    const normalizeOrigin = (value) => {
      if (!value) return null;
      try {
        const parsed = new URL(value);
        if (!['http:', 'https:'].includes(parsed.protocol)) return null;
        return parsed.origin;
      } catch (e) {
        return null;
      }
    };
    const isLocalOrigin = (value) => {
      const origin = normalizeOrigin(value);
      if (!origin) return false;
      const parsed = new URL(origin);
      return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    };
    const firstValidOrigin = (...values) => values.map(normalizeOrigin).find(Boolean) || null;
    const requestOrigin = firstValidOrigin(
      req.get('origin'),
      `${req.get('x-forwarded-proto') || req.protocol || 'https'}://${req.get('x-forwarded-host') || req.get('host') || ''}`
    );
    // VERCEL_URL is automatically injected by Vercel on every deployment (no trailing slash, no protocol)
    const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
    const runningOnVercel = !!process.env.VERCEL || !!process.env.VERCEL_URL;
    // Priority: SITE_URL → APP_URL → FRONTEND_URL → Vercel auto-injected URL
    const configuredOrigin = firstValidOrigin(
      process.env.SITE_URL,
      process.env.APP_URL,
      process.env.FRONTEND_URL,
      vercelOrigin
    );
    // If configuredOrigin is a localhost value but we are on Vercel, use VERCEL_URL or request origin
    const productionOrigin = (runningOnVercel && isLocalOrigin(configuredOrigin))
      ? firstValidOrigin(vercelOrigin, requestOrigin)
      : (configuredOrigin || requestOrigin);

    let redirectTo = req.query.redirectTo || req.query.redirect_uri || req.query.origin;

    if (redirectTo) {
      try {
        const requestedUrl = new URL(redirectTo);
        const isLocalRedirect = requestedUrl.hostname === 'localhost' || requestedUrl.hostname === '127.0.0.1';
        if (isLocalRedirect && runningOnVercel) {
          redirectTo = productionOrigin;
        } else {
          redirectTo = requestedUrl.origin;
        }
      } catch (e) {
        redirectTo = productionOrigin || requestOrigin;
      }
    }

    if (!redirectTo) {
      // Final fallback: productionOrigin (from env) → requestOrigin → vercelOrigin
      redirectTo = productionOrigin
        || requestOrigin
        || firstValidOrigin(vercelOrigin, process.env.SITE_URL);
    }

    // Hard safety: block any remaining localhost URL from being sent on Vercel
    if (runningOnVercel && redirectTo && isLocalOrigin(redirectTo)) {
      const safe = firstValidOrigin(vercelOrigin, process.env.SITE_URL, requestOrigin);
      if (safe) {
        console.warn(`⚠️ [OAUTH] Blocked localhost redirect on Vercel — overriding with: ${safe}`);
        redirectTo = safe;
      }
    }

    if (redirectTo && !redirectTo.endsWith('/')) {
      redirectTo = `${redirectTo}/`;
    }

    console.log(`🔗 [OAUTH REDIRECT TARGET]: ${redirectTo}`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account',  // Always show Google account chooser; never silently re-use last session
          access_type: 'offline',
        },
      },
    });

    if (error) {
      console.error(`❌ [OAUTH REDIRECT ERROR] Provider: ${provider.toUpperCase()} | Error: ${error.message}`);
      return res.status(400).json({ success: false, message: error.message });
    }

    console.log(`✅ [OAUTH REDIRECT URL READY] Provider: ${provider.toUpperCase()}`);
    console.log(`🔗 URL: ${data?.url || 'Generated'}\n`);

    if (req.query.redirect === 'true' && data?.url) {
      return res.redirect(data.url);
    }

    return res.json({
      success: true,
      provider,
      url: data?.url,
    });
  } catch (error) {
    console.error(`❌ [OAUTH REDIRECT EXCEPTION] Error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sync OAuth User (Google / GitHub) to Supabase Users database table
// @route   POST /api/auth/oauth-sync
// @access  Public
const syncOAuthUser = async (req, res) => {
  const syncStartTime = Date.now();
  const requestTime = logTime();
  try {
    const { id, name, email, avatar, provider } = req.body;
    const providerName = (provider || 'google').toUpperCase();

    console.log(`\n=============================================================`);
    console.log(`🔑 [OAUTH LOGIN ATTEMPT] Provider: ${providerName} | Time: ${requestTime}`);
    console.log(`👤 Name : ${name || 'N/A'}`);
    console.log(`✉️ Email: ${email || 'NONE'}`);
    console.log(`=============================================================\n`);

    if (!email) {
      console.error(`\n❌ [OAUTH LOGIN FAILED] Provider: ${providerName}`);
      console.error(`⚠️ Cause: Email is missing in OAuth request body\n`);
      return res.status(400).json({ success: false, message: 'Email required for OAuth database sync.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user with this email already exists in Supabase users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    const userName = name || existingUser?.name || cleanEmail.split('@')[0];
    const userId = existingUser?.id || id || crypto.randomUUID();
    const createdAt = existingUser?.created_at || new Date().toISOString();

    const userPayload = {
      id: userId,
      name: userName,
      email: cleanEmail,
      created_at: createdAt,
    };

    logDb('OAUTH UPSERT DATA', `Saving ${providerName} user to Supabase users table | ID: ${userId} | Name: ${userName} | Email: ${cleanEmail}`);

    const { data: syncedUser, error: upsertError } = await supabase
      .from('users')
      .upsert([userPayload], { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (upsertError) {
      console.error(`\n=============================================================`);
      console.error(`❌ [OAUTH DB SYNC FAILED] Provider: ${providerName}`);
      console.error(`👤 Name : ${userName}`);
      console.error(`✉️ Email: ${cleanEmail}`);
      console.error(`🆔 ID   : ${userId}`);
      console.error(`⚠️ Error: ${upsertError.message}`);
      console.error(`=============================================================\n`);
      return res.status(500).json({
        success: false,
        message: `OAuth profile could not be saved to database: ${upsertError.message}`,
      });
    }

    const finalUser = syncedUser || userPayload;
    if (avatar) finalUser.avatar = avatar;

    console.log(`\n=============================================================`);
    console.log(`✅ [OAUTH LOGIN SUCCESS] Provider: ${providerName}`);
    console.log(`👤 User Name : ${finalUser.name}`);
    console.log(`✉️ User Email: ${finalUser.email}`);
    console.log(`🆔 User ID   : ${userId}`);
    console.log(`⚡ Supabase DB Status: Synced & Saved (${Date.now() - syncStartTime}ms)`);
    console.log(`=============================================================\n`);

    return res.json({
      success: true,
      message: `⚡ ${providerName} user details saved in Supabase database.`,
      data: toClientUser(finalUser),
    });
  } catch (error) {
    console.error(`\n=============================================================`);
    console.error(`❌ [OAUTH LOGIN EXCEPTION]`);
    console.error(`⚠️ Message: ${error.message}`);
    console.error(`=============================================================\n`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send password reset link via Supabase Auth
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    logAuth('FORGOT PASSWORD', `Reset link requested for ${email} at ${logTime()}`);
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }

    const host = req.get('host');
    const protocol = req.protocol;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${protocol}://${host}/#reset-password`,
    });

    if (error) {
      logAuth('RESET LINK ERROR', `Supabase reset error: ${error.message}`);
    } else {
      logAuth('RESET LINK SENT', `Password reset email dispatched for ${email}`);
    }

    return res.json({
      success: true,
      message: 'Password reset link sent to your email address.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile from Supabase users database table
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const fetchStartTime = Date.now();
  try {
    const userId = req.user ? req.user._id : null;
    logAuth('FETCH ME PROFILE', `Fetching current user profile for ID: ${userId} at ${logTime()}`);
    let userData = null;

    if (userId) {
      const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
      userData = data;
      logDb('FETCH ME DONE', `User profile fetched from Supabase users table in ${Date.now() - fetchStartTime}ms`);
    }

    return res.json({
      success: true,
      data: userData ? toClientUser(userData) : {
        _id: userId || 'demo_id',
        full_name: 'Developer User',
        name: 'Developer User',
        email: 'dev@flutterhub.io',
        role: 'user',
        subscription: 'free',
        isSubscribed: false,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered users from Supabase users database table
// @route   GET /api/auth/users
// @access  Public / Admin
const getAllUsers = async (req, res) => {
  const fetchStartTime = Date.now();
  try {
    logDb('FETCH ALL USERS', `Querying all users from Supabase users table at ${logTime()}`);
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logDb('FETCH USERS ERROR', `Query error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: `Unable to read Supabase users table: ${error.message}`,
      });
    }

    const userList = (users || []).map((u) => toClientUser(u));
    logDb('FETCH ALL USERS DONE', `Retrieved ${userList.length} users in ${Date.now() - fetchStartTime}ms`);

    return res.json({ success: true, count: userList.length, data: userList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getOAuthUrl,
  syncOAuthUser,
  forgotPassword,
  getMe,
  getAllUsers,
};
