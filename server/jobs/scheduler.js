/* ==========================================================================
   FlutterHub Job Board — 24-Hour Sync Scheduler
   Uses node-cron to run job sync at 2:00 AM every day.
   Also performs an initial sync 30 seconds after server start.
   ========================================================================== */

const cron = require('node-cron');
const { syncJobs } = require('./jobFetcher');

let nextSyncTime = null;
let isSyncing = false;
let lastSyncResult = null;

async function runSync(reason = 'scheduled') {
  if (isSyncing) {
    console.log(`[Scheduler] Sync already in progress, skipping (${reason})`);
    return null;
  }

  isSyncing = true;
  console.log(`[Scheduler] Starting job sync (${reason}) at ${new Date().toISOString()}`);

  try {
    const result = await syncJobs();
    lastSyncResult = { ...result, completed_at: new Date().toISOString(), reason };
    console.log(`[Scheduler] Sync complete (${reason}): ${result.new_jobs} new, ${result.updated_jobs} updated, ${result.expired_jobs} expired`);
    return lastSyncResult;
  } catch (err) {
    console.error(`[Scheduler] Sync failed (${reason}): ${err.message}`);
    lastSyncResult = { error: err.message, failed: true, completed_at: new Date().toISOString() };
    return lastSyncResult;
  } finally {
    isSyncing = false;
  }
}

function getNextSyncTime() {
  return nextSyncTime;
}

function getLastSyncResult() {
  return lastSyncResult;
}

function isSyncRunning() {
  return isSyncing;
}

// Schedule: every day at 2:00 AM
const task = cron.schedule('0 2 * * *', () => {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(2, 0, 0, 0);
  nextSyncTime = next.toISOString();
  runSync('daily-cron');
}, {
  scheduled: true,
  timezone: 'UTC',
});

// Calculate next sync time on startup
const now = new Date();
const nextSync = new Date();
nextSync.setUTCHours(2, 0, 0, 0);
if (nextSync <= now) nextSync.setDate(nextSync.getDate() + 1);
nextSyncTime = nextSync.toISOString();

// Run initial sync 1.5 seconds after server start so jobs are immediately available
console.log('[Scheduler] Job sync scheduler active. Initial sync starting in 1.5s...');
console.log(`[Scheduler] Next scheduled daily sync: ${nextSyncTime}`);

setTimeout(() => {
  runSync('startup');
}, 1500);

module.exports = {
  runSync,
  getNextSyncTime,
  getLastSyncResult,
  isSyncRunning,
  stop: () => task.stop(),
};
