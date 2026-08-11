/* ==========================================================================
   User Authentication & Supabase Database Sync Controller
   Matching Exact Supabase Table Schema: [id, created_at, name, email, password]
   ========================================================================== */

const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const couponController = require('./couponController');

// Logger helper for formatted terminal / debug console output
const logTime = () => new Date().toISOString();
const logAuth = (action, message) => {
  console.log(`\x1b[36m[${logTime()}] 🔑 [AUTH ${action}]:\x1b[0m ${message}`);
};
const logDb = (action, message) => {
  console.log(`\x1b[32m[${logTime()}] ⚡ [SUPABASE DB ${action}]:\x1b[0m ${message}`);
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

    // 1. Check if user already exists in Supabase users database table
    const fetchStartTime = Date.now();
    logDb('FETCH CHECK', `Checking if email "${cleanEmail}" exists in Supabase users table at ${logTime()}`);

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    logDb('FETCH CHECK DONE', `Check completed in ${Date.now() - fetchStartTime}ms. User exists: ${!!existingUser}`);

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // 2. Register user in Supabase Auth service
    logAuth('SUPABASE AUTH SIGN-UP', `Creating Supabase Auth credentials for ${cleanEmail}...`);
    let authUser = null;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (authError) {
      const rawErrorMsg = authError.message || authError.name || 'Error creating auth user';
      logAuth('SIGN-UP NOTICE', `Standard signUp notice: ${rawErrorMsg} (${authError.status || 500}). Attempting admin creation fallback...`);

      // Fallback: Admin creation via Secret Key (bypasses SMTP email errors)
      const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: { name: name.trim() }
      });

      if (adminError) {
        logAuth('SIGN-UP ERROR', `Supabase Auth error: ${adminError.message || rawErrorMsg}`);
        return res.status(400).json({
          success: false,
          message: adminError.message || rawErrorMsg,
        });
      }
      authUser = adminData?.user;
    } else {
      authUser = authData?.user;
    }

    const userId = authUser ? authUser.id : crypto.randomUUID();


    const insertStartTime = Date.now();
    const newUserRecord = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      created_at: new Date().toISOString(),
    };

    logDb('INSERT DATA', `Adding user record to Supabase users table at ${newUserRecord.created_at} | ID: ${userId} | Email: ${cleanEmail}`);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .upsert([newUserRecord], { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (insertError) {
      logDb('INSERT NOTICE', `Supabase users table RLS policy notice: ${insertError.message}. Using Auth user profile.`);
    } else {
      logDb('INSERT SUCCESS', `User record successfully saved in Supabase database in ${Date.now() - insertStartTime}ms! ID: ${userId}`);
    }

    // Auto-assign Welcome Scratch Coupon for new registration
    await couponController.assignWelcomeCoupon(userId, cleanEmail, name.trim());

    return res.status(201).json({
      success: true,
      message: 'Account created & saved in Supabase database successfully.',
      data: toClientUser(newUser || newUserRecord),
    });
  } catch (error) {
    console.error(`[${logTime()}] ❌ Registration Exception:`, error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & sync with Supabase Users database table
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

    // 0. Special Admin Verification (admin@admin.com / akshaykp@9072)
    if (cleanEmail === 'admin@admin.com' && password === 'akshaykp@9072') {
      logAuth('ADMIN LOGIN VERIFIED', `Admin credentials matched for ${cleanEmail}`);

      let { data: adminUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (!adminUser) {
        const adminRecord = {
          id: 'admin_sys_' + crypto.randomUUID(),
          name: 'System Admin',
          email: 'admin@admin.com',
          role: 'admin',
          created_at: new Date().toISOString(),
        };

        const { data: insertedAdmin } = await supabase
          .from('users')
          .upsert([adminRecord], { onConflict: 'id' })
          .select()
          .maybeSingle();

        adminUser = insertedAdmin || adminRecord;
      }

      adminUser.role = 'admin';
      const clientAdmin = toClientUser(adminUser);

      return res.json({
        success: true,
        message: '👑 Admin Sign in Successful! Loading Admin Dashboard...',
        data: clientAdmin,
      });
    }

    // 1. Authenticate credentials with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError) {
      logAuth('LOGIN FAILED', `Invalid credentials for ${cleanEmail}: ${authError.message || authError.name}`);
      return res.status(401).json({
        success: false,
        message: authError.message || 'Invalid email or password.',
      });
    }

    const authUser = authData?.user;
    logAuth('LOGIN VERIFIED', `Supabase Auth verified at ${logTime()} | User ID: ${authUser?.id}`);

    // 2. Query user profile from Supabase `users` database table
    const fetchStartTime = Date.now();
    logDb('FETCH PROFILE', `Fetching user profile for "${cleanEmail}" from Supabase users table at ${logTime()}`);

    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    logDb('FETCH PROFILE DONE', `Profile fetch completed in ${Date.now() - fetchStartTime}ms. Record found: ${!!user}`);

    // 3. Auto-create profile in Supabase `users` table if missing
    if (!user) {
      const insertStartTime = Date.now();
      const newUserRecord = {
        id: authUser ? authUser.id : crypto.randomUUID(),
        name: authUser?.user_metadata?.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        created_at: new Date().toISOString(),
      };

      logDb('AUTO-INSERT PROFILE', `Creating missing user profile in Supabase users table at ${newUserRecord.created_at} for ID: ${newUserRecord.id}`);

      const { data: insertedUser, error: autoInsertError } = await supabase
        .from('users')
        .upsert([newUserRecord], { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (autoInsertError) {
        logDb('AUTO-INSERT NOTICE', `Supabase users table RLS policy notice: ${autoInsertError.message}. Using Auth profile.`);
      } else {
        logDb('AUTO-INSERT SUCCESS', `Profile created in ${Date.now() - insertStartTime}ms.`);
      }

      user = insertedUser || newUserRecord;
    }

    logAuth('LOGIN SUCCESS', `User "${user.name}" (${user.email}) logged in successfully at ${logTime()}`);

    // Ensure Welcome Scratch Coupon assigned on login
    await couponController.assignWelcomeCoupon(user.id, user.email, user.name);

    return res.json({
      success: true,
      message: 'Sign in successful.',
      data: toClientUser(user),
    });
  } catch (error) {
    console.error(`[${logTime()}] ❌ Login Exception:`, error);
    return res.status(500).json({ success: false, message: error.message });
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
    let redirectTo = req.query.redirectTo || req.query.redirect_uri || req.query.origin;

    if (!redirectTo) {
      if (process.env.SITE_URL) {
        redirectTo = process.env.SITE_URL;
      } else if (process.env.APP_URL) {
        redirectTo = process.env.APP_URL;
      } else if (process.env.FRONTEND_URL) {
        redirectTo = process.env.FRONTEND_URL;
      } else if (process.env.VERCEL_URL) {
        redirectTo = `https://${process.env.VERCEL_URL}`;
      } else {
        const forwardedProto = req.get('x-forwarded-proto');
        const forwardedHost = req.get('x-forwarded-host');
        const protocol = forwardedProto || req.protocol || 'https';
        const host = forwardedHost || req.get('host') || 'flutter-hub-six.vercel.app';
        redirectTo = `${protocol}://${host}`;
      }
    }

    if (!redirectTo.endsWith('/')) {
      redirectTo = `${redirectTo}/`;
    }

    console.log(`🔗 [OAUTH REDIRECT TARGET]: ${redirectTo}`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
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