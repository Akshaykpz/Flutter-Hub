/* ==========================================================================
   FlutterHub AI Agent — Safe Tool Schemas (OpenAI & Gemini format)
   ========================================================================== */

const OPENAI_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'getCurrentTime',
      description: 'Get the current local time for the user or a requested location. Use when the user asks what time it is now or asks for current time.',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'Optional city, country, or timezone label supplied by the user.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getCurrentDate',
      description: 'Get today\'s current date for the user or a requested location. Use when the user asks for today\'s date, day, or current date.',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'Optional city, country, or timezone label supplied by the user.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchPackages',
      description: 'Search the curated Flutter Hub package directory for Flutter/Dart packages, libraries, and plugins from pub.dev. Returns package name, version, likes, popularity score, downloads, category, and installation command. Use this when the user asks to find, browse, or list packages on Flutter Hub.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search keyword (e.g., "image compression", "riverpod", "lottie", "charts", "sqlite").',
          },
          category: {
            type: 'string',
            enum: ['all', 'state_management', 'ui', 'networking', 'storage', 'animation', 'firebase', 'auth', 'maps', 'charts', 'media', 'localization', 'dev_tools'],
            description: 'Optional package category filter.',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getPackageDetails',
      description: 'Fetch detailed information, publisher, metrics, supported platforms, features, and pub.dev / GitHub links for a specific Flutter package by name or ID.',
      parameters: {
        type: 'object',
        properties: {
          packageId: {
            type: 'string',
            description: 'The package identifier or exact name (e.g., "provider", "flutter_riverpod", "dio", "shared_preferences").',
          },
        },
        required: ['packageId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchFlutterJobs',
      description: 'Search the Flutter Hub Job Board for verified, active Flutter and Dart developer job vacancies worldwide. Returns job title, company, location, remote status, salary estimate, and direct application URL. Use this when the user asks for Flutter job openings or developer hiring.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Job search keyword or company (e.g., "Senior Flutter Developer", "Lead Engineer", "Google", "CRED").',
          },
          location: {
            type: 'string',
            description: 'City or country (e.g., "Bengaluru", "India", "Remote", "Europe", "USA").',
          },
          remote_type: {
            type: 'string',
            enum: ['all', 'remote', 'hybrid', 'onsite'],
            description: 'Workplace model filter.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getJobDetails',
      description: 'Retrieve full job description and requirements for a specific Flutter vacancy by job ID.',
      parameters: {
        type: 'object',
        properties: {
          jobId: {
            type: 'string',
            description: 'The unique job vacancy ID.',
          },
        },
        required: ['jobId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getProFeatures',
      description: 'Retrieve Flutter Hub Pro subscription pricing, plans (₹29/month or ₹199/year), and benefits list (1,000+ UI components, full package directory, unlimited AI, commercial license). Use when the user asks what Pro includes or subscription details.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

const GEMINI_FUNCTION_DECLARATIONS = OPENAI_TOOLS.map(t => ({
  name: t.function.name,
  description: t.function.description,
  parameters: t.function.parameters,
}));

module.exports = {
  OPENAI_TOOLS,
  GEMINI_FUNCTION_DECLARATIONS,
};
