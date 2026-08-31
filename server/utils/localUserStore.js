/* ==========================================================================
   Local Fallback User Store
   ─────────────────────────────────────────────────────────────────────────
   Used automatically when Supabase is unreachable (DNS failure, paused
   project, network outage). Stores users in a local JSON file so that
   registration and login continue working offline.

   Data is written to: server/data/local_users.json
   Format: [{ id, name, email, passwordHash, isPro, created_at }]

   When Supabase comes back online, all locally-created users can be
   migrated by running: node server/utils/migrateLocalUsers.js
   ========================================================================== */

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR  = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'local_users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')) || [];
  } catch (_) {
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.warn('[LocalStore] Write error:', e.message);
    return false;
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_flutterhub_salt').digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

const LocalUserStore = {
  /** Check if this error is a Supabase connectivity failure */
  isConnectionError(error) {
    const msg = (error?.message || error?.name || '').toLowerCase();
    return (
      msg.includes('fetch failed') ||
      msg.includes('enotfound') ||
      msg.includes('econnrefused') ||
      msg.includes('getaddrinfo') ||
      msg.includes('dns') ||
      msg.includes('network') ||
      msg.includes('timeout') ||
      msg.includes('socket')
    );
  },

  /** Find user by email */
  findByEmail(email) {
    const users = readUsers();
    return users.find(u => u.email === email.toLowerCase().trim()) || null;
  },

  /** Find user by id */
  findById(id) {
    const users = readUsers();
    return users.find(u => u.id === id) || null;
  },

  /** Register a new user */
  register({ id, name, email, password }) {
    const users = readUsers();
    const cleanEmail = email.toLowerCase().trim();

    const existing = users.find(u => u.email === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id:           id || crypto.randomUUID(),
      name:         name.trim(),
      email:        cleanEmail,
      passwordHash: hashPassword(password),
      isPro:        false,
      is_subscribed: false,
      subscription: 'free',
      role:         'user',
      created_at:   new Date().toISOString(),
      source:       'local_fallback',
    };

    users.push(newUser);
    writeUsers(users);
    console.log(`[LocalStore] ✅ User registered locally: ${cleanEmail}`);
    return { success: true, user: newUser };
  },

  /** Authenticate user */
  login({ email, password }) {
    const cleanEmail = email.toLowerCase().trim();
    const user = this.findByEmail(cleanEmail);

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return { success: false, message: 'Invalid email or password.' };
    }

    console.log(`[LocalStore] ✅ User logged in locally: ${cleanEmail}`);
    return { success: true, user };
  },

  /** Update user pro status */
  upgradeToPro({ userId, plan }) {
    const users = readUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;

    const durationDays = plan === 'yearly' ? 365 : 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);

    users[idx].isPro         = true;
    users[idx].is_subscribed = true;
    users[idx].subscription  = 'pro';
    users[idx].subscription_expires_at = expiry.toISOString();
    writeUsers(users);
    return true;
  },

  /** Count local users */
  count() {
    return readUsers().length;
  },
};

module.exports = LocalUserStore;
