/* ==========================================================================
   FlutterHub AI Agent - Local Fallback Provider
   Used only when no production LLM API key is configured.
   ========================================================================== */

const BaseProvider = require('./BaseProvider');

class SmartFallbackProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'smart-fallback';
  }

  isConfigured() {
    return true;
  }

  getLastUserMessage(messages = []) {
    return [...messages].reverse().find(m => m.role === 'user')?.content || '';
  }

  detectToolCall(userQuery = '') {
    const q = userQuery.toLowerCase().trim();

    if (/\b(time|current time|what time)\b/.test(q)) {
      return { name: 'getCurrentTime', args: { location: this.extractLocation(userQuery) } };
    }

    if (/\b(today'?s date|current date|what date|which date|day is it)\b/.test(q)) {
      return { name: 'getCurrentDate', args: { location: this.extractLocation(userQuery) } };
    }

    const isJobQuery = /\b(job|jobs|hiring|vacancy|vacancies|career|salary|position|positions)\b/.test(q)
      && /\bflutter|dart|developer|engineer|mobile\b/.test(q);

    if (isJobQuery) {
      return {
        name: 'searchFlutterJobs',
        args: {
          query: q.includes('flutter') ? 'Flutter Developer' : userQuery,
          location: this.extractLocation(userQuery),
          remote_type: q.includes('remote') ? 'remote' : 'all',
        },
      };
    }

    const asksToFind = /\b(find|show|list|search|recommend|suggest|best|available|packages?|libraries|plugins?|pub\.dev)\b/.test(q);
    const isPackageTopic = /\b(package|packages|library|libraries|plugin|plugins|pub\.dev|image compression|charts?|state management|riverpod|bloc|provider|dio|lottie|firebase|storage|sqlite|hive)\b/.test(q);
    const isPackageQuery = asksToFind && isPackageTopic;

    if (isPackageQuery && !isJobQuery) {
      return {
        name: 'searchPackages',
        args: {
          query: this.cleanPackageQuery(q),
          category: this.detectPackageCategory(q),
        },
      };
    }

    if (/\b(pro|pricing|subscription|plan|plans|upgrade)\b/.test(q)) {
      return { name: 'getProFeatures', args: {} };
    }

    return null;
  }

  extractLocation(text = '') {
    const q = text.toLowerCase();
    if (q.includes('bengaluru') || q.includes('bangalore')) return 'Bengaluru, India';
    if (q.includes('india')) return 'India';
    if (q.includes('remote')) return 'Remote';
    if (q.includes('usa') || q.includes('united states')) return 'USA';
    if (q.includes('london') || q.includes('uk')) return 'London, UK';
    if (q.includes('dubai') || q.includes('uae')) return 'Dubai, UAE';
    return '';
  }

  detectPackageCategory(q = '') {
    if (q.includes('state') || q.includes('riverpod') || q.includes('bloc') || q.includes('provider')) return 'state_management';
    if (q.includes('animation') || q.includes('lottie')) return 'animation';
    if (q.includes('chart') || q.includes('graph')) return 'charts';
    if (q.includes('storage') || q.includes('database') || q.includes('sqlite') || q.includes('hive')) return 'storage';
    if (q.includes('network') || q.includes('http') || q.includes('dio') || q.includes('api')) return 'networking';
    if (q.includes('map') || q.includes('location')) return 'maps';
    if (q.includes('firebase')) return 'firebase';
    if (q.includes('auth') || q.includes('login')) return 'auth';
    return 'all';
  }

  cleanPackageQuery(q = '') {
    return q
      .replace(/\b(find|show|me|what|are|the|best|good|recommend|recommendations|packages?|library|libraries|plugins?|for|on|flutter|hub|which|should|i|use|please)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  generateDirectResponse(userQuery = '', messages = []) {
    const q = userQuery.toLowerCase().trim();

    if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q)) {
      return "Hi! I'm Flutter Hub AI. You can ask me general questions, writing tasks, coding help, or Flutter/Dart questions.";
    }

    if (/^how are you\??$/.test(q)) {
      return "I'm doing well and ready to help. What would you like to work on?";
    }

    if (/\bjoke\b/.test(q)) {
      return "Why do programmers prefer dark mode? Because light attracts bugs.";
    }

    if (/\bcapital of france\b/.test(q)) {
      return "The capital of France is Paris.";
    }

    if (/\bwhat is ai\b|\bexplain artificial intelligence\b|\bartificial intelligence\b/.test(q)) {
      return "Artificial intelligence is software designed to perform tasks that usually require human intelligence, such as understanding language, recognizing patterns, reasoning, generating text or images, and making predictions.";
    }

    if (/\bblockchain\b/.test(q)) {
      return "Blockchain is a shared digital ledger where records are grouped into blocks and linked cryptographically. It is useful when multiple parties need a tamper-resistant history without relying on one central database owner.";
    }

    if (/\blearn english\b/.test(q)) {
      return "A practical way to learn English is to practice a little every day: read simple articles, listen to clear spoken English, write short paragraphs, and speak out loud for 10-15 minutes. Focus on useful phrases first, then grammar patterns.";
    }

    if (/\btranslate\b/.test(q) && /\bmalayalam\b/.test(q)) {
      return "I can help translate to Malayalam. Please send the exact sentence or paragraph you want translated.";
    }

    if (/\bwrite an email\b|\bemail for me\b/.test(q)) {
      return "Sure. Tell me the purpose, recipient, tone, and any key details, and I can draft the email.";
    }

    if (/\bsummarize\b/.test(q)) {
      return "Paste the text you want summarized, and I will condense it into the length and style you prefer.";
    }

    if (/\bbusiness ideas?\b/.test(q)) {
      return "Here are a few business ideas: a niche local delivery service, AI-assisted resume writing, mobile app maintenance for small businesses, online tutoring, and a subscription template marketplace. The best choice depends on your skills, budget, and target customers.";
    }

    if (/\bonam\b/.test(q)) {
      return "Onam is the official harvest festival of Kerala, celebrated with Pookalam (floral carpets), grand Onasadya feasts, and Vallamkali (boat races). In 2026, Thiruvonam falls on **Wednesday, August 26, 2026** (during the Malayalam month of Chingam).";
    }

    if (/\bwhat is flutter\b|\bexplain flutter\b/.test(q)) {
      return "Flutter is Google's open-source UI toolkit for building apps for Android, iOS, web, desktop, and embedded devices from a single Dart codebase. It is known for fast development, hot reload, expressive widgets, and high-performance custom rendering.";
    }

    if (/\bwhat is riverpod\b|\bexplain riverpod\b/.test(q)) {
      return "Riverpod is a state-management and dependency-injection library for Dart and Flutter. It helps you keep app state outside widgets, handle async data cleanly, test logic more easily, and avoid depending on BuildContext to read state.";
    }

    if (/\brenderflex\b|\boverflowed by\b/.test(q)) {
      return `A RenderFlex overflow usually means a Row or Column has children that need more space than the screen allows.

Common fixes:
- Wrap long text in Expanded or Flexible.
- Put tall Column content inside SingleChildScrollView or ListView.
- Add constraints with SizedBox or ConstrainedBox.
- Use TextOverflow.ellipsis for long single-line text.`;
    }

    if (/\blogin screen\b|\bcreate .*login\b/.test(q) && /\bflutter\b/.test(q)) {
      return `Here is a simple Flutter login screen:

\`\`\`dart
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final password = TextEditingController();

  @override
  void dispose() {
    email.dispose();
    password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(controller: email, decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 12),
            TextField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
            const SizedBox(height: 20),
            FilledButton(onPressed: () {}, child: const Text('Sign in')),
          ],
        ),
      ),
    );
  }
}
\`\`\``;
    }

    const hasPriorFlutterContext = messages.slice(-6).some(m => /\bflutter|dart|riverpod|bloc|widget|app\b/i.test(m.content || ''));
    if (hasPriorFlutterContext && /\b(which|that|it|continue|first one|second one|easier|better)\b/.test(q)) {
      return "From the previous Flutter context, I can continue, but I need one more detail to avoid guessing. Which option or code snippet are you referring to?";
    }

    return "I can help with that. Could you share a little more detail about what you want to know?";
  }

  async chat({ messages = [] }) {
    const lastUserMsg = this.getLastUserMessage(messages);

    if (lastUserMsg.includes('Tool results are available below')) {
      return { text: this.summarizeToolResults(lastUserMsg), toolCalls: [] };
    }

    const toolCall = this.detectToolCall(lastUserMsg);

    if (toolCall) {
      return {
        text: '',
        toolCalls: [{
          id: `call_${Date.now()}`,
          type: 'function',
          function: {
            name: toolCall.name,
            arguments: JSON.stringify(toolCall.args),
          },
        }],
      };
    }

    return { text: this.generateDirectResponse(lastUserMsg, messages), toolCalls: [] };
  }

  async chatStream({ messages = [], onChunk, onToolCall }) {
    const lastUserMsg = this.getLastUserMessage(messages);

    const toolResultMessage = lastUserMsg.includes('Tool results are available below') ? lastUserMsg : '';
    if (toolResultMessage) {
      const text = this.summarizeToolResults(toolResultMessage);
      await this.streamText(text, onChunk);
      return { text, toolCalls: [] };
    }

    const toolCall = this.detectToolCall(lastUserMsg);
    if (toolCall) {
      const tc = {
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: toolCall.name,
          arguments: JSON.stringify(toolCall.args),
        },
      };
      if (onToolCall) onToolCall(tc);
      return { text: '', toolCalls: [tc] };
    }

    const text = this.generateDirectResponse(lastUserMsg, messages);
    await this.streamText(text, onChunk);
    return { text, toolCalls: [] };
  }

  summarizeToolResults(message = '') {
    const jsonStart = message.indexOf('[');
    if (jsonStart === -1) return 'I found the requested information.';

    try {
      const parsed = JSON.parse(message.slice(jsonStart));
      const first = parsed[0]?.result;

      if (first?.type === 'time') {
        return `The current time is ${first.time} (${first.timeZone}).`;
      }

      if (first?.type === 'date') {
        return `Today's date is ${first.date} (${first.timeZone}).`;
      }

      if (first?.type === 'packages') {
        const names = (first.packages || []).slice(0, 4).map(p => `**${p.name}**`).join(', ');
        return names
          ? `I found these Flutter packages: ${names}. Open the package cards below for details, install commands, and pub.dev links.`
          : 'I could not find matching packages in the Flutter Hub directory.';
      }

      if (first?.type === 'jobs') {
        const names = (first.jobs || []).slice(0, 3).map(j => `**${j.title}** at ${j.company}`).join(', ');
        return names
          ? `I found these active Flutter job listings: ${names}. Use the job cards below to open the original application links.`
          : 'I could not find matching active Flutter jobs right now.';
      }

      if (first?.type === 'pro_features') {
        return 'Flutter Hub Pro includes higher AI usage, the full package directory, the complete job board, UI component source code, interview resources, and a commercial license. See the plan details below.';
      }
    } catch (e) {}

    return 'I found the requested information.';
  }

  async streamText(text, onChunk) {
    const words = String(text || '').split(' ');
    for (let i = 0; i < words.length; i += 1) {
      if (onChunk) onChunk((i === 0 ? '' : ' ') + words[i]);
      await new Promise(resolve => setTimeout(resolve, 8));
    }
  }

  async analyzeImage() {
    return {
      text: 'Image analysis requires a configured vision-capable production model. Add OPENAI_API_KEY or GEMINI_API_KEY on the backend to analyze uploaded screenshots and images.',
      toolCalls: [],
    };
  }
}

module.exports = SmartFallbackProvider;
