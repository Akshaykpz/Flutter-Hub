/* ==========================================================================
   User Authentication & Supabase Database Sync Controller
   Includes detailed terminal & debug console timestamps for logs, inserts, and fetches
   ========================================================================== */

const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

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
  const isPro = user?.subscription === 'pro' || !!user?.is_subscribed;

  return {
    _id: user?.id,
    id: user?.id,
    full_name: name,
    name,
    email: user?.email,
    avatar: user?.avatar || name[0].toUpperCase(),
    role: user?.role || 'user',
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

    // 1. Check if user already exists in Supabase users database table
    const fetchStartTime = Date.now();
    logDb('FETCH CHECK', `Checking if email "${email}" exists in Supabase users table at ${logTime()}`);
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    logDb('FETCH CHECK DONE', `Check completed in ${Date.now() - fetchStartTime}ms. User exists: ${!!existingUser}`);

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // 2. Register user in Supabase Auth service
    logAuth('SUPABASE AUTH SIGN-UP', `Creating Supabase Auth credentials for ${email}...`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError) {
      logAuth('SIGN-UP ERROR', `Supabase Auth error: ${authError.message}`);
      return res.status(400).json({
        success: false,
        message: authError.message || 'Unable to create account in Supabase Auth.',
      });
    }

    const authUser = authData?.user;
    const userId = authUser ? authUser.id : crypto.randomUUID();

    // 3. Save user profile into Supabase `users` database table
    const insertStartTime = Date.now();
    const newUserRecord = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'user',
      subscription: 'free',
      created_at: new Date().toISOString(),
    };

    logDb('INSERT DATA', `Adding user record to Supabase users table at ${newUserRecord.created_at} | ID: ${userId} | Email: ${email}`);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .upsert([newUserRecord], { onConflict: 'email' })
      .select()
      .maybeSingle();

    if (insertError) {
      logDb('INSERT WARNING', `Supabase users table insert warning: ${insertError.message}`);
    } else {
      logDb('INSERT SUCCESS', `User record successfully saved in Supabase database in ${Date.now() - insertStartTime}ms! ID: ${userId}`);
    }

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

    // 1. Authenticate credentials with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      logAuth('LOGIN FAILED', `Invalid credentials for ${email}: ${authError.message}`);
      return res.status(401).json({
        success: false,
        message: authError.message || 'Invalid email or password.',
      });
    }

    const authUser = authData?.user;
    const cleanEmail = email.trim().toLowerCase();
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
        role: 'user',
        subscription: 'free',
        created_at: new Date().toISOString(),
      };

      logDb('AUTO-INSERT PROFILE', `Creating missing user profile in Supabase users table at ${newUserRecord.created_at} for ID: ${newUserRecord.id}`);

      const { data: insertedUser } = await supabase
        .from('users')
        .upsert([newUserRecord], { onConflict: 'email' })
        .select()
        .maybeSingle();

      user = insertedUser || newUserRecord;
      logDb('AUTO-INSERT SUCCESS', `Profile created in ${Date.now() - insertStartTime}ms.`);
    }

    logAuth('LOGIN SUCCESS', `User "${user.name}" (${user.email}) logged in successfully at ${logTime()}`);

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
  logAuth('OAUTH INIT', `Generating OAuth redirect URL for provider: ${provider} at ${logTime()}`);
  try {
    if (!['google', 'github'].includes(provider)) {
      return res.status(400).json({ success: false, message: 'Unsupported OAuth provider.' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const redirectTo = `${protocol}://${host}/#oauth-callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      logAuth('OAUTH INIT ERROR', `Supabase OAuth URL error: ${error.message}`);
      return res.status(400).json({ success: false, message: error.message });
    }

    if (req.query.redirect === 'true' && data?.url) {
      logAuth('OAUTH REDIRECT', `Redirecting browser to OAuth provider URL at ${logTime()}`);
      return res.redirect(data.url);
    }

    return res.json({
      success: true,
      provider,
      url: data?.url,
    });
  } catch (error) {
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
    logAuth('OAUTH SYNC REQUEST', `Initiated at ${requestTime} | Provider: ${provider || 'google'} | Email: ${email}`);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required for OAuth database sync.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userId = id || crypto.randomUUID();
    const userName = name || cleanEmail.split('@')[0];

    // Upsert into Supabase `users` database table
    const userPayload = {
      id: userId,
      name: userName,
      email: cleanEmail,
      role: 'user',
      subscription: 'free',
      created_at: new Date().toISOString(),
    };

    logDb('OAUTH UPSERT DATA', `Adding/updating Google user in Supabase users table at ${userPayload.created_at} | ID: ${userId} | Name: ${userName} | Email: ${cleanEmail}`);

    const { data: syncedUser, error: upsertError } = await supabase
      .from('users')
      .upsert([userPayload], { onConflict: 'email' })
      .select()
      .maybeSingle();

    if (upsertError) {
      logDb('OAUTH UPSERT WARNING', `Supabase upsert warning: ${upsertError.message}`);
    } else {
      logDb('OAUTH UPSERT SUCCESS', `Google user details saved in Supabase database in ${Date.now() - syncStartTime}ms! ID: ${userId}`);
    }

    const finalUser = syncedUser || userPayload;
    if (avatar) finalUser.avatar = avatar;

    return res.json({
      success: true,
      message: '⚡ Google/OAuth user details saved in Supabase database.',
      data: toClientUser(finalUser),
    });
  } catch (error) {
    console.error(`[${logTime()}] ❌ OAuth Sync Exception:`, error);
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
