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

  // A lightweight knowledge base used to give accurate, structured, and useful
  // answers when no production LLM API key is configured. Each rule is matched
  // against the lowercased user query; the first match wins. All code examples
  // are valid Dart and are returned inside markdown code fences so the
  // frontend can render and copy them cleanly.
  getKnowledgeBase() {
    return [
      {
        test: /^(hi|hello|hey|good morning|good afternoon|good evening)\b/,
        reply: "Hi! I'm **Flutter Hub AI**, your Flutter & Dart expert. I can help with:\n- Flutter/Dart code, debugging, and architecture\n- Package recommendations and job listings on Flutter Hub\n- General questions, writing, and ideas\n\nWhat would you like to work on?",
      },
      {
        test: /^(how are you|how's it going|what can you do|help me|who are you)\??$/,
        reply: "I'm doing well and ready to help! I'm **Flutter Hub AI**, a general assistant with deep Flutter and Dart expertise.\n\nYou can ask me to:\n- Explain Flutter/Dart concepts with code examples\n- Debug errors (RenderFlex overflow, build failures, SDK issues)\n- Recommend packages from the Flutter Hub directory\n- Find live Flutter job openings\n- Write, summarize, translate, or brainstorm\n\nJust type your question — or paste a screenshot for visual analysis.",
      },
      {
        test: /\bjoke\b/,
        reply: "Sure! Why do Flutter developers prefer dark mode? Because it's easier on the eyes when you stare at `RenderFlex overflowed` errors all night. 😄\n\nWant a serious answer instead? Just ask!",
      },
      {
        test: /\b(what is flutter|explain flutter|flutter framework)\b/,
        reply: `**What is Flutter?**\n\nFlutter is Google's open-source UI toolkit for building fast, beautiful apps for **Android, iOS, web, desktop, and embedded devices** from a single Dart codebase.\n\n**Key strengths:**\n- **Hot reload** — see changes almost instantly during development\n- **Expressive widgets** — everything is a widget, composed freely\n- **Single codebase** — write once, run everywhere\n- **High performance** — compiles to native machine code (AOT)\n\n**Quick start:**\n\`\`\`bash\nflutter create my_app\ncd my_app\nflutter run\n\`\`\`\n\n**Hello world:**\n\`\`\`dart\nimport 'package:flutter/material.dart';\n\nvoid main() => runApp(const MaterialApp(home: Text('Hello Flutter!')));\n\`\`\`\n\nWant me to go deeper on widgets, state management, or project structure?`,
      },
      {
        test: /\b(what is dart|explain dart|dart language)\b/,
        reply: `**What is Dart?**\n\nDart is the programming language used by **Flutter**. It's an object-oriented, garbage-collected language with **sound null safety** and **AOT/JIT** compilation.\n\n- **JIT** (during dev) enables hot reload.\n- **AOT** (for release) compiles to fast native machine code.\n\n\`\`\`dart\nvoid main() {\n  final name = 'Flutter';\n  print('Hello, $name!');\n}\n\`\`\`\n\n**Key features:** classes & mixins, async/await (Futures & Streams), collections, pattern matching, and rich type system.`,
      },
      {
        test: /\b(what is a widget|what are widgets|explain widgets|widget tree|what is widget)\b/,
        reply: `**What is a Widget in Flutter?**\n\nIn Flutter **everything is a widget** — buttons, text, layout, even the whole app. A widget is a lightweight description of part of the UI. Flutter rebuilds only what changes.\n\n**Two core types:**\n- **StatelessWidget** — static UI with no mutable state.\n- **StatefulWidget** — UI with state that can change over time.\n\n\`\`\`dart\n// Stateless example\nclass Greeting extends StatelessWidget {\n  const Greeting({super.key});\n  @override\n  Widget build(BuildContext context) => const Text('Hello!');\n}\n\`\`\`\n\nWidgets are composed into a **widget tree** — for example \`MaterialApp\` → \`Scaffold\` → \`Column\` → \`Text\`. Use smaller, reusable widgets to keep code clean and performant.`,
      },
      {
        test: /\b(buildcontext|what is buildcontext)\b/,
        reply: `**What is BuildContext?**\n\n\`BuildContext\` is a handle to a **location in the widget tree**. It gives widgets access to their parent elements and inherited data (themes, media queries, navigation, and providers).\n\nIt's used for:\n- \`Navigator.push(context, ...)\`, \`ScaffoldMessenger.of(context)\`, \`Theme.of(context)\`\n- Reading \`MediaQuery\` and inherited widgets (Provider/Riverpod)\n\n\`\`\`dart\nclass MyWidget extends StatelessWidget {\n  const MyWidget({super.key});\n  @override\n  Widget build(BuildContext context) {\n    final theme = Theme.of(context);\n    return Text('Colored', style: TextStyle(color: theme.colorScheme.primary));\n  }\n}\n\`\`\`\n\nDon't use a \`BuildContext\` across an \`async\` gap before checking if it's still mounted (check context.mounted in Flutter 3.7+).`,
      },
      {
        test: /\b(isolate|concurrency|parallel|background thread|compute)\b/,
        reply: `**What is an Isolate in Dart?**\n\nAn **isolate** is an independent worker that runs its **own event loop and memory** — the Dart/Flutter equivalent of a thread but without shared memory. Isolates communicate only by passing messages.\n\n**Why?** To keep the UI smooth, heavy work (encryption, large JSON/parsing, image processing) should run off the main isolate. You can't block the UI thread, or frames drop.\n\n\`\`\`dart\nimport 'dart:isolate';\n\nint heavyWork(int n) {\n  var sum = 0;\n  for (var i = 0; i < n; i++) { sum += i; }\n  return sum;\n}\n\nvoid main() async {\n  // Easy way: Isolate.run\n  final result = await Isolate.run(() => heavyWork(1000000));\n  print(result);\n}\n\`\`\`\n\nFor Flutter, \`compute()\` (from \`package:flutter/foundation.dart\`) wraps isolates conveniently for a single function call.`,
      },
      {
        test: /\b(clean architecture|layered architecture|why clean architecture|mvvm)\b/,
        reply: `**Clean Architecture in Flutter**\n\nOrganize code into concentric layers with **dependencies pointing inward** (the core doesn't know about UI/Framework):\n\n1. **Domain (innermost)** — entities & use cases, no Flutter imports.\n2. **Data** — repositories that fetch from API/DB and map to domain models.\n3. **Presentation (outer)** — UI (widgets), state management (Bloc/Riverpod), and DI wiring.\n\n**Typical folder layout:**\n\`\`\`\nlib/\n  core/          # themes, errors, DI, utils\n  features/\n    auth/\n      data/       # datasources, repositories, models\n      domain/     # entities, usecases, repository interfaces\n      presentation/  # screens, widgets, blocs/providers\n  app.dart\n  main.dart\n\`\`\`\n\n**Benefits:** testability, separation of concerns, maintainability. **Trade-off:** more boilerplate — for small apps a simpler single-folder or feature-first structure may be enough.`,
      },
      {
        test: /\b(create a project|create new project|start a project|project structure|flutter create)\b/,
        reply: `**Starting a new Flutter project**\n\n\`\`\`bash\nflutter create my_app\ncd my_app\nflutter run\n\`\`\`\n\n**Typical project structure:**\n- \`lib/main.dart\` — app entry point; a \`MaterialApp\` that sets theme + routes\n- lib/ models/, data/, services/, screens/, widgets/ — keep code in folders by responsibility\n- \`pubspec.yaml\` — dependencies + assets\n\n**Minimal entry point:**\n\`\`\`dart\nimport 'package:flutter/material.dart';\n\nvoid main() {\n  runApp(const MyApp());\n}\n\nclass MyApp extends StatelessWidget {\n  const MyApp({super.key});\n  @override\n  Widget build(BuildContext context) {\n    return const MaterialApp(home: HomeScreen());\n  }\n}\n\`\`\`\n\nWant me to scaffold a folder layout or wire up navigation and state management next?`,
      },
      {
        test: /\b(navigate to another screen|go to another screen|push a new screen|open a new screen|navigation in flutter|navigator\.push)\b/,
        reply: `**Navigating to another screen in Flutter**\n\n**1. Simple push (no arguments):**\n\`\`\`dart\nNavigator.push(\n  context,\n  MaterialPageRoute(builder: (_) => const SecondScreen()),\n);\n\`\`\`\n\n**2. With arguments:**\n\`\`\`dart\nNavigator.push(\n  context,\n  MaterialPageRoute(builder: (_) => SecondScreen(id: 42)),\n);\n\`\`\`\n\n**3. Named routes (cleaner for larger apps):** register in \`MaterialApp\`:\n\`\`\`dart\nMaterialApp(\n  routes: {\n    '/second': (context) => const SecondScreen(),\n  },\n  home: const HomeScreen(),\n)\n\`\`\`\nThen navigate with \`Navigator.pushNamed(context, '/second');\`.\n\n**4. Go back:** \`Navigator.pop(context);\`. To replace the current screen (no back), use \`Navigator.pushReplacement\`; to clear the whole stack, use \`Navigator.pushAndRemoveUntil\`.`,
      },
      {
        test: /\b(statefulwidget|statelesswidget|difference between stateful and stateless)\b/,
        reply: `**StatelessWidget vs StatefulWidget**\n\n- **StatelessWidget**: static UI. It is rebuilt when its parent rebuilds or its own state/config changes. It never manages mutable state itself.\n- **StatefulWidget**: manages **mutable state** over time (e.g. input, animations, timers, network data). It keeps a separate \`State\` object that lives across rebuilds, using \`setState()\` to trigger a rebuild.\n\n\`\`\`dart\n// Stateless: no internal mutable state\nclass Greeting extends StatelessWidget {\n  const Greeting({super.key, required this.name});\n  final String name;\n  @override\n  Widget build(BuildContext context) => Text('Hi \$name!');\n}\n\n// Stateful: tracks a counter\nclass Counter extends StatefulWidget {\n  const Counter({super.key});\n  @override\n  State<Counter> createState() => _CounterState();\n}\n\nclass _CounterState extends State<Counter> {\n  int \u005fcount = 0;\n  @override\n  Widget build(BuildContext context) {\n    return Column(\n      children: [\n        Text('\$count'),\n        FilledButton(onPressed: () => setState(() => \u005fcount++), child: const Text('Increment')),\n      ],\n    );\n  }\n}\n\`\`\`\n\n**Rule of thumb:** if the widget's UI can change over time, use \`StatefulWidget\`; otherwise prefer \`StatelessWidget\`.`,
      },
      {
        test: /\b(hot reload|hot restart|what is hot reload)\b/,
        reply: `**Hot reload vs Hot restart (Flutter)**\n\n- **Hot reload (r)** — preserves the current app state and rebuilds the widget tree. Great for quick UI tweaks. State is kept.\n- **Hot restart (R)** — rebuilds the whole app from scratch, resetting state. Use it when you change code that runs at startup (e.g. \`main()\`, global/static variables, state initializers).\n\n**Workflow tip:** Use hot reload most of the time; switch to hot restart if state-based bugs don't go away, or if you changed \`pubspec.yaml\` (then run a full \`flutter run\` with \`flutter pub get\`).`,
      },
      {
        test: /\b(column|row|stack|container|expanded|flexible|layout widget)\b/,
        reply: `**Core Flutter layout widgets**\n\n- \`Container\` — box with padding, margin, decoration, size constraints\n- \`Row\` — lays children out **horizontally**\n- \`Column\` — lays children out **vertically**\n- \`Stack\` — overlays children (with \`Positioned\` for precise placement)\n- \`Expanded\` / \`Flexible\` — distributes empty space inside a \`Row\`/\`Column\`\n- \`Padding\` — wraps a child with padding\n- \`SizedBox\` — fixed width/height or spacing\n\n\`\`\`dart\nColumn(\n  mainAxisAlignment: MainAxisAlignment.center,\n  crossAxisAlignment: CrossAxisAlignment.stretch,\n  children: [\n    Expanded(child: Container(color: Colors.blue, child: const Text('Top'))),\n    const SizedBox(height: 16),\n    Row(\n      children: [\n        Expanded(child: Container(color: Colors.green, height: 80)),\n        const SizedBox(width: 16),\n        Expanded(child: Container(color: Colors.orange, height: 80)),\n      ],\n    ),\n  ],\n)\n\`\`\`\n\n**Reminder:** a \`Row\`/\`Column\` with too-wide/tall children causes *RenderFlex overflow*. Wrap them in \`Expanded\`/\`Flexible\` or a \`ScrollView\`.`,
      },
      {
        test: /\b(center a widget|center the text|center my widget|how do i center|center something)\b/,
        reply: `**Centering a widget in Flutter**\n\nWrap it in a \`Center\` widget:\n\n\`\`\`dart\nCenter(child: Text('Hello'))\n\`\`\`\n\nFor a \`Column\`/\`Row\`, control alignment directly instead of nesting \`Center\`:\n\n\`\`\`dart\nColumn(\n  mainAxisAlignment: MainAxisAlignment.center, // vertical\n  crossAxisAlignment: CrossAxisAlignment.center, // horizontal\n  children: [\n    const Text('Centered'),\n    ElevatedButton(onPressed: () {}, child: const Text('Go')),\n  ],\n)\n\`\`\`\n\nFor one child that should fill and center, use \`Align\` or \`Center\` inside an \`Expanded\`; if it still won't center, the parent may have \`MainAxisSize.max\`/stretch — check the parent's \`crossAxisAlignment\`.`,
      },
      {
        test: /\b(renderflex|overflowed by)\b/,
        reply: `**RenderFlex overflow** means a \`Row\` or \`Column\` has children that need more space than is available.\n\n**Common fixes:**\n1. Wrap long text in \`Expanded\` or \`Flexible\`.\n2. Wrap vertical content in \`SingleChildScrollView\` or \`ListView\`.\n3. Constrain children with \`SizedBox\` / \`ConstrainedBox\`.\n4. For a single line of text, use \`TextOverflow.ellipsis\`:\n\n\`\`\`dart\nRow(children: [\n  Expanded(\n    child: Text(longText, overflow: TextOverflow.ellipsis, maxLines: 1),\n  ),\n  const Icon(Icons.share),\n])\n\`\`\`\n\n5. Check fixed \`height: 100\` containers on small screens — use \`Flexible\` instead.\n\nThe yellow/black zebra stripes in debug show exactly where it overflows, which tells you which child to fix.`,
      },
      {
        test: (q) => /(login screen|signin screen|sign up screen|login page)/.test(q) && /\bflutter\b|\bapp\b/.test(q),
        reply: `**A clean Flutter login screen (form + validation):**

\`\`\`dart
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: LoginScreen()));

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final \u005femail = TextEditingController();
  final \u005fpassword = TextEditingController();
  final \u005fkey = GlobalKey<FormState>();
  bool \u005fobscure = true;

  @override
  void dispose() {
    \u005femail.dispose();
    \u005fpassword.dispose();
    super.dispose();
  }

  void \u005fsubmit() {
    if (\u005fkey.currentState!.validate()) {
      // TODO: call your auth API with \u005femail.text and \u005fpassword.text
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Signing in...')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: \u005fkey,
          child: Column(
            children: [
              TextFormField(
                controller: \u005femail,
                decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
                keyboardType: TextInputType.emailAddress,
                validator: (v) => RegExp(r'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$').hasMatch(v ?? '')
                    ? null : 'Enter a valid email',
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: \u005fpassword,
                obscureText: \u005fobscure,
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: const OutlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: Icon(\u005fobscure ? Icons.visibility : Icons.visibility_off),
                    onPressed: () => setState(() => \u005fobscure = !\u005fobscure),
                  ),
                ),
                validator: (v) => (v ?? '').length >= 6 ? null : 'Min 6 characters',
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton(onPressed: \u005fsubmit, child: const Text('Sign in')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
\`\`\`

Want me to add a loading spinner, "forgot password" link, or Google sign-in button to this?`,
      },
      {
        test: /\b(stat[e]?\s?management|riverpod|bloc|provider|setstate|inheritwidget)\b/,
        reply: `**Flutter state management options**\n\n| Approach | Best for | Notes |\n|---|---|---|\n| \`setState\` | Small, local state | Built-in, simple, refactor-friendly |\n| \`Provider\` | Medium apps | Popular, less boilerplate than older patterns |\n| **Riverpod** | Medium-large, testable | Compile-safe, no \`BuildContext\` dependency |\n| **Bloc** | Large teams/events | Predictable event→state flow, more code |\n\n**Simple setState example:**\n\`\`\`dart\nclass \u005fCounterState extends State<Counter> {\n  int \u005fcount = 0;\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      floatingActionButton: FloatingActionButton(\n        onPressed: () => setState(() => \u005fcount++),\n        child: const Icon(Icons.add),\n      ),\n      body: Center(child: Text('\$count', style: const TextStyle(fontSize: 40))),\n    );\n  }\n}\n\`\`\`\n\n**Recommendation:** For a new app, \`Riverpod\` gives the best mix of safety and simplicity. Tell me your app's size/complexity and I can sketch an architecture.`,
      },
      {
        test: /\b(async|await|future|futurebuilder|stream|async\*|asynchronous)\b/,
        reply: `**Async/await in Dart & Flutter**\n\n\`Future\` represents a value that will be available later. Use \`async\`/\`await\` to work with them simply:\n\n\`\`\`dart\nFuture<String> fetchData() async {\n  await Future.delayed(const Duration(seconds: 1)); // simulate network\n  return 'Data loaded';\n}\n\n// In a widget, show a loader until the Future resolves:\nFutureBuilder<String>(\n  future: fetchData(),\n  builder: (context, snapshot) {\n    if (snapshot.hasError) return Text('Error: \${snapshot.error}');\n    if (!snapshot.hasData) return const CircularProgressIndicator();\n    return Text(snapshot.data!);\n  },\n)\n\`\`\`\n\n**Key points:**\n- \`await\` can only be used inside an \`async\` function.\n- Wrap risky calls in \`try/catch\` to handle errors.\n- Use \`FutureBuilder\` for Future-driven UI; \`StreamBuilder\` for streams.\n\nWant an example with error handling and retries?`,
      },
      {
        test: (q) => /(http|dio|api call|\bcall\b|\bapi\b|\brest|network request|fetch).*?(flutter|dart|app|endpoint|server)/.test(q) || /\b(how do i call an api|make an api call|api call)\b/.test(q),
        reply: `**Making HTTP/API calls in Flutter**\n\nUsing the \`http\` package (add with \`flutter pub add http\`):\n\n\`\`\`dart\nimport 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<List<dynamic>> fetchPosts() async {\n  final res = await http\n      .get(Uri.parse('https://jsonplaceholder.typicode.com/posts'))\n      .timeout(const Duration(seconds: 10)); // avoid hanging\n\n  if (res.statusCode != 200) {\n    throw Exception('Request failed with status: \${res.statusCode}');\n  }\n  return jsonDecode(res.body) as List<dynamic>;\n}\n\`\`\`\n\n**Important on Android emulator / real device:**\n- Emulator: use \`http://10.0.2.2:8000\` instead of \`localhost\`.\n- Real device: use your computer's LAN IP, not \`localhost\`.\n- Add \`<uses-permission android:name="android.permission.INTERNET" />\` in \`AndroidManifest.xml\`.\n- For plain \`http://\`: add \`android:usesCleartextTraffic="true"\` (dev only) or a network security config.\n\nWant an example with POST + JSON body + a loading/error UI?`,
      },
      {
        test: /\b(json|parse json|jsondecode|jsonencode|fromjson)\b/,
        reply: `**Parsing JSON in Dart/Flutter**\n\n\`\`\`dart\nimport 'dart:convert';\n\nclass User {\n  final int id;\n  final String name;\n  const User({required this.id, required this.name});\n\n  factory User.fromJson(Map<String, dynamic> json) =>\n      User(id: json['id'] as int, name: json['name'] as String);\n\n  Map<String, dynamic> toJson() => {'id': id, 'name': name};\n}\n\nvoid main() {\n  final raw = '{\"id\":1,\"name\":\"Akshay\"}';\n  final user = User.fromJson(jsonDecode(raw) as Map<String, dynamic>);\n  print(user.name); // Akshay\n  print(jsonEncode(user.toJson()));\n}\n\`\`\`\n\n**Tips:**\n- Use \`jsonDecode\` → cast to \`Map\`/\`List\`.\n- Handle missing keys gracefully (\`json['x'] ?? ''\`).\n- For large models, use \`build_runner\` with code generation packages for less boilerplate.`,
      },
      {
        test: /\b(navigat|route|push|go to another screen|page)\b/,
        reply: `**Navigation in Flutter**\n\n\`\`\`dart\n// Push a new screen (gets a back button automatically):\nNavigator.push(\n  context,\n  MaterialPageRoute(builder: (_) => const DetailScreen(itemId: 1)),\n);\n\n// Pop back:\nNavigator.pop(context);\n\`\`\`\n\n**Passing data back (return a result):**\n\`\`\`dart\nfinal result = await Navigator.push<bool>(\n  context,\n  MaterialPageRoute(builder: (_) => const PickScreen()),\n);\n// In PickScreen: Navigator.pop(context, true);\n\`\`\`\n\n**Named routes (recommended for larger apps):**\n\`\`\`dart\nMaterialApp(\n  initialRoute: '/',\n  routes: {\n    '/': (_) => const HomeScreen(),\n    '/detail': (_) => const DetailScreen(),\n  },\n)\n// Navigate: Navigator.pushNamed(context, '/detail', arguments: 5);\n\`\`\`\n\nFor deep links and robust routing, consider the \`go_router\` package.`,
      },
      {
        test: /\b(textfield|form|validator|validate input|password field)\b/,
        reply: `**Text field with validation in Flutter**\n\nUse a \`Form\` + \`TextFormField\` with validators:\n\n\`\`\`dart\nfinal \u005fformKey = GlobalKey<FormState>();\n\nForm(\n  key: \u005fformKey,\n  child: Column(\n    children: [\n      TextFormField(\n        decoration: const InputDecoration(labelText: 'Email'),\n        validator: (v) {\n          final val = v?.trim() ?? '';\n          if (val.isEmpty) return 'Email is required';\n          final re = RegExp(r'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$');\n          if (!re.hasMatch(val)) return 'Enter a valid email';\n          return null;\n        },\n      ),\n      TextFormField(\n        obscureText: true,\n        decoration: const InputDecoration(labelText: 'Password'),\n        validator: (v) => (v ?? '').length < 6 ? 'Min 6 characters' : null,\n      ),\n      FilledButton(\n        onPressed: () {\n          if (\u005fformKey.currentState!.validate()) {\n            // form is valid — proceed\n          }\n        },\n        child: const Text('Submit'),\n      ),\n    ],\n  ),\n)\n\`\`\`\n\nUse \`TextEditingController\` + \`dispose()\` when reading values imperatively.`,
      },
      {
        test: /\b(listview|builder|infinite list|scroll)\b/,
        reply: `**Efficient lists with ListView.builder**\n\n\`\`\`dart\nfinal items = List.generate(1000, (i) => 'Item \$i');\n\nListView.builder(\n  itemCount: items.length,\n  itemBuilder: (context, index) => ListTile(\n    leading: const Icon(Icons.folder),\n    title: Text(items[index]),\n    trailing: const Icon(Icons.chevron_right),\n  ),\n)\n\`\`\`\n\n**Why \`.builder\`?** It lazily builds only the visible items, so large or infinite lists stay fast. Use \`ListView\` (non-builder) only for small, fixed lists.`,
      },
      {
        test: /\b(theme|dark mode|theming|colors|typography)\b/,
        reply: `**Theming & dark mode in Flutter**\n\n\`\`\`dart\nMaterialApp(\n  theme: ThemeData(\n    brightness: Brightness.light,\n    colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),\n  ),\n  darkTheme: ThemeData(\n    brightness: Brightness.dark,\n    colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal, brightness: Brightness.dark),\n  ),\n  themeMode: ThemeMode.system, // follows device setting\n  home: const HomeScreen(),\n)\n\`\`\`\n\n- \`ThemeMode.system\` auto-switches with the device.\n- Access colors anywhere with \`Theme.of(context).colorScheme.primary\`.\n- Keep shared styles in a \`ThemeData\` object to stay consistent.`,
      },
      {
        test: /\b(build fail|build error|cannot find|undefined name|pub get|dependencies|sdk version)\b/,
        reply: `**Common Flutter build / dependency errors**\n\n1. **"Cannot find symbol" / "undefined name"** → the import or dependency is missing. Run \`flutter pub get\` and check imports.\n2. **Pub version conflict** (e.g. SDK constraint): run \`flutter pub outdated\`, then align versions in \`pubspec.yaml\`.\n3. **"The method isn't defined for the class"** → upgrade the package or read its changelog — APIs change between major versions.\n4. **Building on a specific platform fails** → run \`flutter doctor\` to verify Android/iOS toolchains.\n5. **Cache issues** → \`flutter clean\` then \`flutter pub get\` then rebuild.\n\nShare the **full error text** and I'll point out the exact cause.`,
      },
      {
        test: (q) => /(no internet|cleartext|8\.0|http:\/\/|internet permission|network security)/.test(q) && /\b(android|flutter|app|device)\b/.test(q),
        reply: `**Fix: Flutter app can't reach the internet (Android)**\n\n1. **INTERNET permission** must be in \`android/app/src/main/AndroidManifest.xml\`:\n\n\`\`\`xml\n<uses-permission android:name="android.permission.INTERNET" />\n\`\`\`\n\n2. **Emulator:** use \`http://10.0.2.2:8000\` instead of \`localhost\`. **Real device:** use your computer's LAN IP.\n\n3. **Cleartext HTTP (not https) is blocked by default on Android 9+ (API 28).** For local dev, add to the manifest:\n\n\`\`\`xml\n<application android:usesCleartextTraffic="true" ...>\n\`\`\`\n\n4. For production, use \`https://\` URLs and/or a \`network_security_config\` that only allows cleartext for specific dev hosts.\n\n5. Test with \`flutter doctor\` and check that your device isn't in airplane/offline mode.\n\nIf the error is **outside** Flutter (it only happens in a specific app), tell me the exact message — internet can be fine on the device while a backend is down, so we shouldn't blame the network automatically.`,
      },
      {
        test: (q) => /(handle errors|error handling|catch (the )?error|catch exception|handle failure|try.catch|on exception|check.*response.*status)/.test(q)
          && /(api|http|request|call|fetch|future|async|await|network|dio|backend|server|flutter|dart)/.test(q),
        reply: `**Handling errors on a Flutter HTTP/API call**\n\nWrap the call in a try/catch and inspect the status code and body:\n\n\`\`\`dart\nimport 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<List<dynamic>?> fetchPosts() async {\n  try {\n    final res = await http\n        .get(Uri.parse('https://jsonplaceholder.typicode.com/posts'))\n        .timeout(const Duration(seconds: 10));\n    if (res.statusCode == 200) {\n      return jsonDecode(res.body) as List<dynamic>;\n    }\n    // Non-200: surface a useful message\n    throw Exception('Request failed with status \${res.statusCode}');\n  } on TimeoutException {\n    // Request hung\n    throw Exception('Request timed out. Check your connection.');\n  } on SocketException {\n    // No network\n    throw Exception('No internet connection.');\n  } catch (e) {\n    // Parsing or any other error\n    throw Exception('Something went wrong: \${e}');\n  }\n}\n\`\`\`\n\n**In the UI**, catch at the call site and show a friendly message:\n\n\`\`\`dart\ntry {\n  final posts = await fetchPosts();\n  setState(() => _posts = posts!);\n} catch (e) {\n  setState(() => _error = e.toString().replaceFirst('Exception: ', ''));\n  // show SnackBar / error widget using _error\n}\n\`\`\`\n\nKey ideas: never let raw exceptions bubble up to crash the app, distinguish timeout/no-network/server errors, and always give the user a clear retry option.`,
      },
    ];
  }

  generateDirectResponse(userQuery = '', messages = []) {
    const q = userQuery.toLowerCase().trim();
    if (!q) {
      return "Please type a question so I can help. For example: *'How do I center a widget?'* or *'What is Riverpod?'*.";
    }

    // 1. Greetings / pleasantries — respond naturally, never with a
    //    "give me more details" prompt.
    const greeting = this.detectGreeting(q);
    if (greeting) return greeting;

    // 2. General & "what is X" knowledge questions (non-Flutter basics).
    const general = this.respondToGeneralKnowledge(q);
    if (general) return general;

    // 3. Knowledge base rules (most specific / most frequently asked first).
    // A rule's `test` can be a RegExp or a predicate function (for compound
    // conditions that need multiple regexes on the same query).
    for (const rule of this.getKnowledgeBase()) {
      const matched = typeof rule.test === 'function' ? rule.test(q) : rule.test.test(q);
      if (matched) {
        return rule.reply;
      }
    }

    // A few standalone general intents.
    if (/\bcapital of france\b/.test(q)) return 'The capital of France is **Paris**.';
    if (/\b(what is ai|explain artificial intelligence|artificial intelligence)\b/.test(q)) {
      return 'Artificial intelligence is software designed to perform tasks that usually require human intelligence — such as understanding language, recognizing patterns, reasoning, generating text or images, and making predictions.';
    }
    if (/\bblockchain\b/.test(q)) {
      return 'Blockchain is a shared digital ledger where records are grouped into blocks and linked cryptographically. It is useful when multiple parties need a tamper-resistant history without relying on one central database owner.';
    }
    if (/\blearn english\b/.test(q)) {
      return 'A practical way to learn English is to practice a little every day: read simple articles, listen to clear spoken English, write short paragraphs, and speak out loud for 10–15 minutes. Focus on useful phrases first, then grammar patterns.';
    }
    if (/\b(translate)\b/.test(q)) {
      return 'I can help with translation. Please send the exact sentence or paragraph you want translated, and specify the target language.';
    }
    if (/\b(write an email|email for me|compose an email)\b/.test(q)) {
      return 'Sure — tell me the **purpose**, **recipient**, **tone** (formal/friendly), and any **key details**, and I will draft a clean email for you.';
    }
    if (/\bsummarize\b/.test(q)) {
      return 'Paste the text you want summarized, and tell me the target length or style, and I will condense it for you.';
    }
    if (/\bbusiness ideas?\b/.test(q)) {
      return 'Here are a few business ideas to consider: a niche local delivery service, AI-assisted resume writing, app maintenance for small businesses, online tutoring, and a subscription template marketplace. The best choice depends on your skills, budget, and customers — tell me more and I’ll refine the list.';
    }

    // Follow-up / short ambiguous contextual question — ask for the specific
    // option ONLY when there is genuine ambiguity, never for ordinary questions.
    const hasPriorContext = messages.slice(-6).some(m => (m.content || '').trim().length > 0);
    if (hasPriorContext && /\b(which one|first one|second one|what do you mean)\b/.test(q)) {
      return "Could you tell me **which option or which part** you mean? Share the snippet or name the choice and I'll continue from there.";
    }

    // General-purpose, helpful default. Avoids demanding extra details for
    // normal questions. Only genuinely ambiguous/complex asks get clarifications.
    return "I can help with that. Here's a starting point: tell me a bit more about **the exact problem or goal** (paste the error message, code snippet, or the topic you want), and I'll give you a precise, useful answer — whether it's Flutter/Dart, programming, or a general question.";
  }

  detectGreeting(q) {
    if (/\b(hi+|hey+|hello|hai+|howdy|yo)\b/.test(q) && !/\bhow (are|do|to|can)|what is|what are|how does|explain|why\b/.test(q)) {
      if (/\bhow are you\b/.test(q)) {
        return "I'm doing great, thanks for asking! 😊 I'm ready to help with Flutter, Dart, programming, or any general question. What would you like to explore?";
      }
      const timeGreeting = new Date().getHours();
      const period = timeGreeting < 12 ? 'Good morning' : (timeGreeting < 18 ? 'Good afternoon' : 'Good evening');
      return `${period}! 👋 I'm **Flutter Hub AI**. You can ask me about Flutter, Dart, programming, debugging, or just chat about anything. How can I help you today?`;
    }
    return null;
  }

  respondToGeneralKnowledge(q) {
    const map = {
      api: 'An **API (Application Programming Interface)** is a set of rules that lets one piece of software talk to another. It defines how you request data or actions and what the other system returns. For example, a mobile app calls a weather API with *"get weather for Bangalore"* and receives structured JSON back. In Flutter you call REST APIs with the `http` or `dio` package.',
      database: 'A **database** is an organized collection of data you can store, query, and update efficiently. Common types are **relational (SQL)** — like PostgreSQL, MySQL — and **NoSQL** — like MongoDB, Firestore, Hive. Flutter apps often store local data in SQLite or Hive, and remote data in Firestore/PostgreSQL.',
      git: '**Git** is a version-control system that tracks changes to your code over time, so you can save snapshots (commits), branch, merge, and roll back. Teamed with **GitHub** it hosts repos and enables collaboration. Core workflow: `git add`, `git commit`, `git push`, `git pull`.',
      'http': '**HTTP (HyperText Transfer Protocol)** is the protocol used to transfer web data between a client (browser/app) and a server. Requests use methods like **GET** (fetch), **POST** (create), **PUT/PATCH** (update), **DELETE** (remove), and responses carry status codes such as 200 OK, 404 Not Found, and 500 Server Error.',
      ai: '**AI (Artificial Intelligence)** is software that can perform tasks that usually need human intelligence — understanding language, recognizing patterns/images, reasoning, and generating text. Large Language Models (LLMs) like ChatGPT power modern AI assistants.',
      'cloud': '**Cloud computing** means running servers, storage, and software over the internet instead of on your own hardware. Providers offer on-demand, scalable services — e.g. AWS, Google Cloud, Azure — and services like Firebase/Supabase for apps.',
      'javascript': '**JavaScript** is the programming language of the web, running in browsers to make pages interactive. It\'s also used on servers via **Node.js**. It\'s dynamically typed and single-threaded with an event-driven, non-blocking model.',
      'node':
        '**Node.js** is a JavaScript runtime for building fast, scalable server-side apps. It runs JavaScript outside the browser and is well suited to APIs, real-time apps, and tooling thanks to its non-blocking, event-driven architecture.',
      'sql': '**SQL (Structured Query Language)** is the standard language for querying and managing relational databases. Core commands: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, plus `JOIN` to combine tables.',
      'rest': '**REST (Representational State Transfer)** is an architecture style for building web APIs around resources addressed by URLs, using standard HTTP methods (GET/POST/PUT/DELETE) and usually returning JSON.',
    };

    const isWhatIs = /\b(what is|what are|what\s+[']?s|define|explain|tell me about|meaning of)\b/.test(q);

    for (const [key, answer] of Object.entries(map)) {
      if (isWhatIs && new RegExp(`\\b${key}\\b`, 'i').test(q)) {
        return answer;
      }
    }

    return null;
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
