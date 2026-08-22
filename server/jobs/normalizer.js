/* ==========================================================================
   FlutterHub Job Board — Raw Job Normalizer
   Converts each source's raw payload into a consistent flutter_jobs schema.
   ========================================================================== */

const { isMobileRelevant } = require('./sources');

/* ── Skill extraction ────────────────────────────────────────────── */
const SKILL_PATTERNS = [
  'Flutter','Dart','BLoC','Riverpod','Provider','GetX','MobX',
  'REST API','GraphQL','Firebase','Supabase','SQLite','Hive',
  'Android','iOS','Swift','Kotlin','React Native','TypeScript',
  'Node.js','Python','AWS','GCP','Azure','Docker','CI/CD',
  'Unit Testing','Widget Testing','Integration Testing',
  'Clean Architecture','MVVM','MVC','MVP',
  'Git','GitHub','GitLab','Agile','Scrum',
];

function extractSkills(texts = []) {
  const combined = texts.filter(Boolean).join(' ');
  return SKILL_PATTERNS.filter(s => combined.toLowerCase().includes(s.toLowerCase()));
}

/* ── Location / remote type parser ──────────────────────────────── */
function parseRemoteType(locationStr = '', tags = [], remoteFlag = false) {
  const loc = (locationStr || '').toLowerCase();
  const tagStr = tags.join(' ').toLowerCase();
  if (remoteFlag) return 'remote';
  if (loc.includes('remote') || tagStr.includes('remote')) return 'remote';
  if (loc.includes('hybrid') || tagStr.includes('hybrid')) return 'hybrid';
  if (loc === 'worldwide' || loc === '' || loc === 'anywhere') return 'remote';
  return 'onsite';
}

/* ── Salary parser ───────────────────────────────────────────────── */
function parseSalary(salaryStr = '') {
  if (!salaryStr || salaryStr.trim() === '') return { min: null, max: null, currency: null };
  const s = salaryStr.replace(/,/g, '').replace(/\s+/g, ' ').trim();
  const currencyMatch = s.match(/[₹$€£]/);
  const currency = currencyMatch
    ? ({ '₹': 'INR', '$': 'USD', '€': 'EUR', '£': 'GBP' }[currencyMatch[0]] || 'USD')
    : 'USD';
  const nums = s.match(/\d+(?:\.\d+)?(?:k|K|L|lakh)?/g);
  if (!nums || nums.length === 0) return { min: null, max: null, currency };

  function parseNum(n) {
    const val = parseFloat(n);
    if (/[Ll]akh/.test(n) || n.toUpperCase().endsWith('L')) return Math.round(val * 100000);
    if (/[Kk]/.test(n)) return Math.round(val * 1000);
    return Math.round(val);
  }

  const values = nums.map(parseNum).filter(v => v > 0 && v < 100000000);
  if (values.length === 0) return { min: null, max: null, currency };
  if (values.length === 1) return { min: values[0], max: null, currency };
  return { min: Math.min(...values), max: Math.max(...values), currency };
}

/* ── Employment type ─────────────────────────────────────────────── */
function parseEmploymentType(str = '') {
  const s = (str || '').toLowerCase();
  if (s.includes('contract') || s.includes('freelance')) return 'contract';
  if (s.includes('part')) return 'part-time';
  if (s.includes('intern')) return 'internship';
  return 'full-time';
}

/* ── Level detection ─────────────────────────────────────────────── */
function detectLevel(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('senior') || text.includes('sr.') || text.includes('staff') || text.includes('principal')) return 'senior';
  if (text.includes('lead') || text.includes('architect')) return 'lead';
  if (text.includes('junior') || text.includes('jr.') || text.includes('entry') || text.includes('associate')) return 'junior';
  if (text.includes('mid-') || text.includes('mid ') || text.includes('intermediate')) return 'mid';
  return 'mid';
}

/* ── Region detection ────────────────────────────────────────────── */
function detectRegion(location = '') {
  const loc = location.toLowerCase();
  if (loc.includes('india') || loc.includes('bangalore') || loc.includes('bengaluru') || loc.includes('mumbai') || loc.includes('pune') || loc.includes('hyderabad') || loc.includes('delhi')) return 'india';
  if (loc.includes('usa') || loc.includes('united states') || loc.includes('san francisco') || loc.includes('new york') || loc.includes('austin') || loc.includes('seattle') || loc.includes(', ca') || loc.includes(', ny')) return 'usa';
  if (loc.includes('europe') || loc.includes('london') || loc.includes('berlin') || loc.includes('amsterdam') || loc.includes('paris') || loc.includes('stockholm') || loc.includes('helsinki') || loc.includes('warsaw')) return 'europe';
  if (loc.includes('canada') || loc.includes('toronto') || loc.includes('vancouver')) return 'usa';
  if (loc.includes('australia') || loc.includes('sydney') || loc.includes('melbourne')) return 'apac';
  if (loc === 'worldwide' || loc === '' || loc === 'anywhere' || loc.includes('remote')) return 'worldwide';
  return 'worldwide';
}

/* ── Strip HTML from description ─────────────────────────────────── */
function stripHtml(html = '') {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .substring(0, 2000);
}

/* ─── Main normalize functions per source ─────────────────────── */

function normalizeGreenhouse(raw) {
  const salary = parseSalary('');
  const skills = extractSkills([raw.title, raw.content]);
  const remoteType = parseRemoteType(raw.location, [], false);
  const description = stripHtml(raw.content);
  const depts = raw.departments || [];
  const metaMap = {};
  (raw.metadata || []).forEach(m => { if (m.name && m.value) metaMap[m.name.toLowerCase()] = m.value; });
  const salaryMeta = parseSalary(metaMap['salary'] || metaMap['compensation'] || '');

  return {
    source_id: 'greenhouse',
    external_id: raw.id,
    company: raw._companyName,
    company_logo: `https://logo.clearbit.com/${raw._companySlug}.com`,
    title: raw.title,
    location: raw.location || null,
    remote_type: remoteType,
    region: detectRegion(raw.location || ''),
    level: detectLevel(raw.title, description),
    salary_min: salaryMeta.min,
    salary_max: salaryMeta.max,
    salary_currency: salaryMeta.currency,
    employment_type: 'full-time',
    skills: skills.slice(0, 10),
    description: description.substring(0, 1500),
    apply_url: raw.apply_url,
    source_name: 'Greenhouse',
    posted_at: raw.posted_at ? new Date(raw.posted_at).toISOString() : new Date().toISOString(),
    is_active: true,
  };
}

function normalizeLever(raw) {
  const allText = [raw.title, raw.description, ...(raw.lists || []).map(l => l.content || '')].join(' ');
  const skills = extractSkills([allText]);
  const remoteType = parseRemoteType(raw.location, [], false);
  const empType = parseEmploymentType(raw.commitment || '');
  const description = stripHtml(raw.description);

  return {
    source_id: 'lever',
    external_id: raw.id,
    company: raw._companyName,
    company_logo: `https://logo.clearbit.com/${raw._companySlug}.com`,
    title: raw.title,
    location: raw.location || null,
    remote_type: remoteType,
    region: detectRegion(raw.location || ''),
    level: detectLevel(raw.title, description),
    salary_min: null,
    salary_max: null,
    salary_currency: null,
    employment_type: empType,
    skills: skills.slice(0, 10),
    description: description.substring(0, 1500),
    apply_url: raw.apply_url || raw.apply_url_direct,
    source_name: 'Lever',
    posted_at: raw.posted_at || new Date().toISOString(),
    is_active: true,
  };
}

function normalizeRemotive(raw) {
  const allText = [raw.title, raw.description, ...(raw.tags || [])].join(' ');
  const skills = extractSkills([allText]);
  const salary = parseSalary(raw.salary || '');
  const description = stripHtml(raw.description);

  return {
    source_id: 'remotive',
    external_id: raw.id,
    company: raw._companyName,
    company_logo: raw._companyLogo || null,
    title: raw.title,
    location: raw.location || 'Worldwide',
    remote_type: 'remote',
    region: 'worldwide',
    level: detectLevel(raw.title, description),
    salary_min: salary.min,
    salary_max: salary.max,
    salary_currency: salary.currency,
    employment_type: parseEmploymentType(raw.job_type || ''),
    skills: skills.slice(0, 10),
    description: description.substring(0, 1500),
    apply_url: raw.apply_url,
    source_name: 'Remotive',
    posted_at: raw.posted_at ? new Date(raw.posted_at).toISOString() : new Date().toISOString(),
    is_active: true,
  };
}

function normalizeArbeitnow(raw) {
  const allText = [raw.title, raw.description, ...(raw.tags || [])].join(' ');
  const skills = extractSkills([allText]);
  const description = stripHtml(raw.description);

  return {
    source_id: 'arbeitnow',
    external_id: raw.id,
    company: raw._companyName,
    company_logo: raw._companyLogo || null,
    title: raw.title,
    location: raw.location || 'Europe',
    remote_type: parseRemoteType(raw.location || '', raw.tags || [], raw.remote || false),
    region: detectRegion(raw.location || ''),
    level: detectLevel(raw.title, description),
    salary_min: null,
    salary_max: null,
    salary_currency: null,
    employment_type: parseEmploymentType((raw.job_types || []).join(' ')),
    skills: skills.slice(0, 10),
    description: description.substring(0, 1500),
    apply_url: raw.apply_url,
    source_name: 'Arbeitnow',
    posted_at: raw.posted_at || new Date().toISOString(),
    is_active: true,
  };
}

/* ─── Router ─────────────────────────────────────────────────── */
const NORMALIZERS = {
  greenhouse: normalizeGreenhouse,
  lever:      normalizeLever,
  remotive:   normalizeRemotive,
  arbeitnow:  normalizeArbeitnow,
  verified_careers: (raw) => raw,
};

function normalizeJob(raw) {
  if (raw.source_id === 'verified_careers') {
    return raw;
  }
  const fn = NORMALIZERS[raw._source];
  if (!fn) {
    console.warn(`[Normalizer] No normalizer for source: ${raw._source}`);
    return null;
  }
  try {
    const normalized = fn(raw);
    // Validate required fields
    if (!normalized.title || !normalized.company || !normalized.apply_url) return null;
    if (!normalized.apply_url.startsWith('http')) return null;
    return normalized;
  } catch (err) {
    console.warn(`[Normalizer] Error normalizing job ${raw.id} from ${raw._source}: ${err.message}`);
    return null;
  }
}

module.exports = { normalizeJob, extractSkills, parseRemoteType, parseSalary };
