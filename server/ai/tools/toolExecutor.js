/* ==========================================================================
   FlutterHub AI Agent — Tool Execution Layer
   Executes validated tool calls against live services safely
   ========================================================================== */

const { queryPackages, getPackageById } = require('../../packages/packageService');
const { queryInMemoryJobs, getJobById } = require('../../jobs/jobFetcher');

function getTimeZoneForLocation(location = '') {
  const loc = String(location || '').toLowerCase();
  if (loc.includes('india') || loc.includes('bengaluru') || loc.includes('bangalore') || loc.includes('mumbai') || loc.includes('delhi')) {
    return 'Asia/Kolkata';
  }
  if (loc.includes('new york') || loc.includes('usa') || loc.includes('united states')) return 'America/New_York';
  if (loc.includes('los angeles') || loc.includes('california')) return 'America/Los_Angeles';
  if (loc.includes('london') || loc.includes('uk')) return 'Europe/London';
  if (loc.includes('dubai') || loc.includes('uae')) return 'Asia/Dubai';
  return process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata';
}

async function executeToolCall(toolName, rawArgs = {}, isPro = false) {
  let args = rawArgs;
  if (typeof rawArgs === 'string') {
    try {
      args = JSON.parse(rawArgs);
    } catch (e) {
      args = {};
    }
  }

  switch (toolName) {
    case 'getCurrentTime': {
      const location = args.location || '';
      const timeZone = getTimeZoneForLocation(location);
      const now = new Date();
      return {
        type: 'time',
        location: location || 'current server timezone',
        timeZone,
        iso: now.toISOString(),
        time: new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone,
        }).format(now),
      };
    }

    case 'getCurrentDate': {
      const location = args.location || '';
      const timeZone = getTimeZoneForLocation(location);
      const now = new Date();
      return {
        type: 'date',
        location: location || 'current server timezone',
        timeZone,
        iso: now.toISOString(),
        date: new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone,
        }).format(now),
      };
    }

    case 'searchPackages': {
      const q = (args.query || args.q || '').trim();
      const cat = args.category || 'all';
      const limit = isPro ? 8 : 4;

      let res = queryPackages({ q, category: cat, limit }, isPro);

      if ((!res.packages || res.packages.length === 0) && cat !== 'all') {
        res = queryPackages({ q: '', category: cat, limit }, isPro);
      }
      if ((!res.packages || res.packages.length === 0) && !q) {
        res = queryPackages({ q: '', category: 'all', limit }, isPro);
      }

      const formattedPkgs = (res.packages || []).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        tagline: p.tagline,
        version: p.version,
        likes: p.likes,
        popularity: p.popularity,
        downloads: p.downloads,
        pubPoints: p.pubPoints || 160,
        icon: p.icon || '📦',
        iconBg: p.iconBg,
        isPremium: p.isPremium,
        installCmd: p.installCmd || `flutter pub add ${p.name}`,
        pubDevUrl: p.pubDevUrl,
      }));

      return {
        type: 'packages',
        query: q || cat,
        total_found: res.pagination?.total_catalog || formattedPkgs.length,
        packages: formattedPkgs,
      };
    }

    case 'getPackageDetails': {
      const pkgId = args.packageId || args.name || args.id;
      const pkg = getPackageById(pkgId, isPro);
      if (!pkg) {
        return { type: 'package_detail', found: false, packageId: pkgId };
      }
      return {
        type: 'package_detail',
        found: true,
        package: pkg,
      };
    }

    case 'searchFlutterJobs': {
      const q = (args.query || '').trim();
      const location = (args.location || '').trim();
      const remoteType = args.remote_type || '';
      const limit = isPro ? 6 : 3;

      let region = '';
      const locLower = location.toLowerCase();
      if (locLower.includes('india') || locLower.includes('bangalore') || locLower.includes('bengaluru')) region = 'india';
      else if (locLower.includes('europe') || locLower.includes('germany') || locLower.includes('uk')) region = 'europe';
      else if (locLower.includes('usa') || locLower.includes('united states')) region = 'usa';

      let res = queryInMemoryJobs({ q, region, remote_type: remoteType, limit });

      if ((!res.jobs || res.jobs.length === 0) && region) {
        res = queryInMemoryJobs({ q: '', region, remote_type: remoteType, limit });
      }
      if (!res.jobs || res.jobs.length === 0) {
        res = queryInMemoryJobs({ q: '', limit });
      }

      const formattedJobs = (res.jobs || []).map(j => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        remote_type: j.remote_type,
        level: j.level,
        salary_min: j.salary_min,
        salary_max: j.salary_max,
        salary_currency: j.salary_currency,
        skills: j.skills,
        source_name: j.source_name,
        apply_url: j.apply_url,
        posted_at: j.posted_at,
      }));

      return {
        type: 'jobs',
        query: q || location || 'Flutter Developers',
        total_found: res.total,
        jobs: formattedJobs,
      };
    }

    case 'getJobDetails': {
      const job = getJobById(args.jobId);
      if (!job) {
        return { type: 'job_detail', found: false, jobId: args.jobId };
      }
      return {
        type: 'job_detail',
        found: true,
        job,
      };
    }

    case 'getProFeatures': {
      return {
        type: 'pro_features',
        plans: [
          { name: 'Monthly Pass', price: '₹29 / month', period: 'monthly' },
          { name: 'Yearly Pass', price: '₹299 / year', period: 'yearly', discount: 'Save 14%' },
        ],
        benefits: [
          'Access to 1,000+ Flutter UI Component Source Codes',
          'Full Flutter & Dart Package Directory (15 Categories)',
          'Complete Flutter Developer Job Board with direct application links',
          'Unlimited Flutter AI Agent engineering assistance & code generation',
          'Interactive Flutter MCQs & Top Company Interview Solutions',
          'Commercial license for client and production mobile apps',
        ],
      };
    }

    default:
      return { type: 'unknown_tool', error: `Tool ${toolName} is not recognized` };
  }
}

module.exports = {
  executeToolCall,
};
