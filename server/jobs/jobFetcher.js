/* ==========================================================================
   FlutterHub Job Board — Job Fetcher (Main Orchestrator)
   Pipeline: fetch → normalize → validate → deduplicate → cache & upsert
   Supports dual-tier: Supabase Database + In-Memory High-Speed Fallback Cache
   ========================================================================== */

const supabase = require('../config/superbase');
const { sources }       = require('./sources');
const { normalizeJob }  = require('./normalizer');

// Global In-Memory Cache for ultra-fast serving and offline/fallback resilience
let inMemoryJobs = [];
let lastSyncTimestamp = null;
let lastSyncStats = {
  total_active: 0,
  source_counts: {},
  last_sync: null,
  new_jobs_24h: 0,
  updated_jobs_24h: 0,
  expired_jobs_24h: 0,
  failed_sources_24h: [],
};

// Seed initial memory cache immediately on startup
try {
  const verifiedSource = sources.find(s => s.id === 'verified_careers');
  if (verifiedSource) {
    verifiedSource.fetch().then(initialJobs => {
      if (initialJobs && initialJobs.length) {
        inMemoryJobs = initialJobs.map(normalizeJob).filter(Boolean);
        lastSyncStats.total_active = inMemoryJobs.length;
        lastSyncStats.last_sync = new Date().toISOString();
        console.log(`[JobSync] Pre-seeded ${inMemoryJobs.length} verified Flutter jobs in memory.`);
      }
    });
  }
} catch (e) {}

/* ─── Main sync function ───────────────────────────────────────── */
async function syncJobs(targetSourceId = null) {
  const results = {
    total_fetched: 0,
    new_jobs: 0,
    updated_jobs: 0,
    expired_jobs: 0,
    failed_sources: [],
    source_counts: {},
    duration_ms: 0,
    started_at: new Date().toISOString(),
  };

  const startTime = Date.now();
  const activeSources = targetSourceId
    ? sources.filter(s => s.id === targetSourceId)
    : sources;

  for (const source of activeSources) {
    const sourceStart = Date.now();
    console.log(`[JobSync] Fetching source: ${source.name} (${source.id})...`);

    try {
      // 1. Fetch raw jobs from source
      const rawJobs = await source.fetch();
      console.log(`[JobSync] ${source.id}: Fetched ${rawJobs.length} raw jobs`);

      // 2. Normalize + validate
      const normalized = rawJobs
        .map(raw => normalizeJob(raw))
        .filter(Boolean);
      console.log(`[JobSync] ${source.id}: ${normalized.length} valid jobs after normalization`);

      results.total_fetched += normalized.length;
      results.source_counts[source.id] = normalized.length;

      // 3. Immediately merge into inMemoryJobs after each source completes
      if (normalized.length > 0) {
        const map = new Map();
        inMemoryJobs.forEach(j => map.set(`${j.source_id}:${j.external_id}`, j));
        normalized.forEach(j => {
          if (!j.id) j.id = `${j.source_id}_${j.external_id}`;
          map.set(`${j.source_id}:${j.external_id}`, j);
        });
        inMemoryJobs = Array.from(map.values()).sort((a, b) => new Date(b.posted_at || 0) - new Date(a.posted_at || 0));
        lastSyncStats.total_active = inMemoryJobs.length;
      }

      // 4. Upsert into Supabase (if database is configured & reachable)
      if (normalized.length > 0) {
        const CHUNK_SIZE = 50;
        for (let i = 0; i < normalized.length; i += CHUNK_SIZE) {
          const chunk = normalized.slice(i, i + CHUNK_SIZE);
          try {
            const { data, error } = await supabase
              .from('flutter_jobs')
              .upsert(chunk, {
                onConflict: 'source_id,external_id',
                ignoreDuplicates: false,
              })
              .select('id, source_id, external_id, created_at, updated_at');

            if (!error && data) {
              results.new_jobs += data.length;
            }
          } catch (dbErr) {
            // Handled gracefully via in-memory cache
          }
        }
      }

    } catch (err) {
      console.error(`[JobSync] Source ${source.id} notice: ${err.message}`);
      results.failed_sources.push({ source: source.id, error: err.message });
    }
  }

  lastSyncTimestamp = new Date().toISOString();
  results.duration_ms = Date.now() - startTime;

  lastSyncStats = {
    total_active: inMemoryJobs.length,
    source_counts: results.source_counts,
    last_sync: lastSyncTimestamp,
    new_jobs_24h: results.total_fetched,
    updated_jobs_24h: 0,
    expired_jobs_24h: 0,
    failed_sources_24h: results.failed_sources.map(f => f.source),
  };

  console.log(`[JobSync] Sync finished. ${inMemoryJobs.length} active Flutter jobs in catalog (${results.duration_ms}ms).`);
  return results;
}

/* ─── Get in-memory jobs with filtering ───────────────────────── */
function queryInMemoryJobs(filters = {}) {
  const {
    q = '',
    remote_type,
    region,
    level,
    employment_type,
    source_id,
    page = 1,
    limit = 20,
    sort = 'newest',
  } = filters;

  let list = [...inMemoryJobs];

  // Search
  if (q && q.trim()) {
    const term = q.toLowerCase().trim();
    list = list.filter(j =>
      (j.title && j.title.toLowerCase().includes(term)) ||
      (j.company && j.company.toLowerCase().includes(term)) ||
      (j.description && j.description.toLowerCase().includes(term)) ||
      (j.location && j.location.toLowerCase().includes(term)) ||
      (j.skills && j.skills.some(s => s.toLowerCase().includes(term)))
    );
  }

  // Filters
  if (remote_type) list = list.filter(j => j.remote_type === remote_type);
  if (region) list = list.filter(j => j.region === region);
  if (level) list = list.filter(j => j.level === level);
  if (employment_type) list = list.filter(j => j.employment_type === employment_type);
  if (source_id) list = list.filter(j => j.source_id === source_id);

  // Sort
  if (sort === 'oldest') {
    list.sort((a, b) => new Date(a.posted_at || 0) - new Date(b.posted_at || 0));
  } else {
    list.sort((a, b) => new Date(b.posted_at || 0) - new Date(a.posted_at || 0));
  }

  const total = list.length;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
  const offset = (pageNum - 1) * limitNum;
  const paged = list.slice(offset, offset + limitNum);

  return {
    jobs: paged,
    total,
    page: pageNum,
    limit: limitNum,
    total_pages: Math.ceil(total / limitNum),
    has_more: pageNum * limitNum < total,
  };
}

/* ─── Get overall job stats ────────────────────────────────────── */
async function getJobStats() {
  return {
    ...lastSyncStats,
    total_active: inMemoryJobs.length,
  };
}

module.exports = {
  syncJobs,
  getJobStats,
  queryInMemoryJobs,
};
