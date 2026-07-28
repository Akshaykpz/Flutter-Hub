/* ==========================================================================
   FlutterHub Master Data Repository (Expanded Platform Datasets)
   ========================================================================== */

const FLUTTER_DATA = {
  // ------------------------------------------------------------------------
  // COMPONENTS CATEGORIES
  // ------------------------------------------------------------------------
  categories: [
    { id: 'buttons', name: 'Buttons & Action Dock', count: 18 },
    { id: 'cards', name: 'Cards & Widgets', count: 22 },
    { id: 'dialogs', name: 'Dialogs & Modals', count: 14 },
    { id: 'bottom_sheets', name: 'Bottom Sheets', count: 12 },
    { id: 'nav_bars', name: 'Navigation & Drawers', count: 16 },
    { id: 'textfields', name: 'TextFields & OTP Fields', count: 20 },
    { id: 'search_bars', name: 'Search Bars & Filters', count: 10 },
    { id: 'charts', name: 'Charts & Analytics', count: 15 },
    { id: 'progress', name: 'Progress & Shimmer', count: 14 },
    { id: 'timelines', name: 'Timelines & Steppers', count: 12 },
  ],

  // ------------------------------------------------------------------------
  // COMPONENTS SNIPPETS
  // ------------------------------------------------------------------------
  components: [
    {
      id: 'comp_btn_01',
      title: 'Aceternity Glassmorphism Neo Button',
      category: 'buttons',
      isPremium: false,
      badge: 'Free',
      description: 'Frosted glass button with dynamic HSL gradient borders and hover particle glow.',
      dependencies: ['flutter/material.dart', 'dart:ui'],
      simType: 'glass_button',
      code: `import 'dart:ui';
import 'package:flutter/material.dart';

class AceternityGlassButton extends StatefulWidget {
  final String label;
  final VoidCallback onPressed;
  final IconData? icon;

  const AceternityGlassButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.icon,
  }) : super(key: key);

  @override
  State<AceternityGlassButton> createState() => _AceternityGlassButtonState();
}

class _AceternityGlassButtonState extends State<AceternityGlassButton> {
  bool _isHovered = false;
  int _clickCount = 0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() => _clickCount++);
        widget.onPressed();
      },
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovered = true),
        onExit: (_) => setState(() => _isHovered = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          transform: Matrix4.identity()..scale(_isHovered ? 1.04 : 1.0),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              colors: _isHovered
                  ? [const Color(0xFF38BDF8), const Color(0xFF8B5CF6)]
                  : [Colors.white.withOpacity(0.15), Colors.white.withOpacity(0.05)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          padding: const EdgeInsets.all(1.5),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                color: const Color(0xFF0F172A).withOpacity(0.7),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (widget.icon != null) ...[
                      Icon(widget.icon, color: Colors.cyanAccent, size: 20),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      "\${widget.label} (\$_clickCount)",
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }`
    },

    {
      id: 'comp_btn_02',
      title: 'Magic UI Floating Action Dock',
      category: 'buttons',
      isPremium: true,
      badge: 'Pro (₹29/mo)',
      description: 'Mac OS Dock inspired floating navigation bar with spring physics magnification.',
      dependencies: ['flutter/material.dart'],
      simType: 'dock_menu',
      code: `import 'package:flutter/material.dart';

class FloatingActionDock extends StatefulWidget {
  const FloatingActionDock({Key? key}) : super(key: key);

  @override
  State<FloatingActionDock> createState() => _FloatingActionDockState();
}

class _FloatingActionDockState extends State<FloatingActionDock> {
  int _selectedIndex = 0;
  final List<IconData> _icons = [Icons.home_rounded, Icons.search_rounded, Icons.widgets_rounded, Icons.bookmark_rounded, Icons.person_rounded];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withOpacity(0.9),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white24),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(_icons.length, (index) {
          final isSelected = _selectedIndex == index;
          return GestureDetector(
            onTap: () => setState(() => _selectedIndex = index),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 6),
              padding: EdgeInsets.all(isSelected ? 14 : 10),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected ? const Color(0xFF38BDF8) : Colors.transparent,
              ),
              child: Icon(_icons[index], color: isSelected ? Colors.black : Colors.white70, size: isSelected ? 24 : 20),
            ),
          );
        }),
      ),
    );
  }`
    },

    {
      id: 'comp_card_01',
      title: '3D Flip Credit Card Widget',
      category: 'cards',
      isPremium: true,
      badge: 'Pro (₹29/mo)',
      description: 'Interactive 3D credit card widget with front/back card flip state.',
      dependencies: ['flutter/material.dart'],
      simType: 'glass_button',
      code: `import 'package:flutter/material.dart';

class FlipCreditCardWidget extends StatefulWidget {
  const FlipCreditCardWidget({Key? key}) : super(key: key);

  @override
  State<FlipCreditCardWidget> createState() => _FlipCreditCardWidgetState();
}

class _FlipCreditCardWidgetState extends State<FlipCreditCardWidget> {
  bool _showBack = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _showBack = !_showBack),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 500),
        child: _showBack ? _buildBack() : _buildFront(),
      ),
    );
  }

  Widget _buildFront() {
    return Container(
      key: const ValueKey(1),
      width: 300, height: 180,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF0284C7), Color(0xFF8B5CF6)]),
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('FlutterHub Visa', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          Text('4532  ••••  ••••  8912', style: TextStyle(color: Colors.white, fontSize: 18, letterSpacing: 2)),
          Text('AKSHAT SHARMA', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildBack() {
    return Container(
      key: const ValueKey(2),
      width: 300, height: 180,
      decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(20)),
      child: const Center(child: Text('CVV 784', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
    );
  }
}`
    },

    {
      id: 'comp_diag_01',
      title: 'Glassmorphic Blur Alert Dialog',
      category: 'dialogs',
      isPremium: false,
      badge: 'Free',
      description: 'Modal alert dialog with frosted glass background blur and gradient buttons.',
      dependencies: ['dart:ui', 'flutter/material.dart'],
      simType: 'dialog_preview',
      code: `import 'dart:ui';
import 'package:flutter/material.dart';

void showGlassDialog(BuildContext context) {
  showDialog(
    context: context,
    builder: (context) => BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
      child: AlertDialog(
        backgroundColor: const Color(0xFF0F172A).withOpacity(0.8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24), side: const BorderSide(color: Colors.white24)),
        title: const Text('Confirm Action', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: const Text('Are you sure you want to proceed with this operation?', style: TextStyle(color: Colors.white70)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel', style: TextStyle(color: Colors.white54))),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF38BDF8)),
            child: const Text('Proceed', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    ),
  );
}`
    },

    {
      id: 'comp_chart_01',
      title: 'FL Chart Financial Analytics Bar Chart',
      category: 'charts',
      isPremium: true,
      badge: 'Pro (₹29/mo)',
      description: 'Interactive financial bar chart with smooth gradient fills and tooltips.',
      dependencies: ['fl_chart: ^0.65.0'],
      simType: 'chart_preview',
      code: `import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class FinancialBarChart extends StatelessWidget {
  const FinancialBarChart({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.7,
      child: BarChart(
        BarChartData(
          borderData: FlBorderData(show: false),
          barGroups: [
            BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 8, color: const Color(0xFF38BDF8))]),
            BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 14, color: const Color(0xFF8B5CF6))]),
            BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 10, color: const Color(0xFF10B981))]),
          ],
        ),
      ),
    );
  }
}`
    }
  ],

  // ------------------------------------------------------------------------
  // PRODUCTION UI SCREENS
  // ------------------------------------------------------------------------
  screens: [
    {
      id: 'screen_01',
      title: 'Modern Ecommerce Checkout & Payment',
      category: 'Ecommerce',
      isPremium: true,
      badge: 'Pro (₹29/mo)',
      description: 'Multi-step order checkout workflow with address cards, summary, and Razorpay.',
      simType: 'glass_button',
      code: `import 'package:flutter/material.dart';

class ModernCheckoutPage extends StatelessWidget {
  const ModernCheckoutPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      appBar: AppBar(title: const Text('Checkout')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)), child: const Text('Sector 62, Noida', style: TextStyle(color: Colors.white))),
            const SizedBox(height: 20),
            ElevatedButton(onPressed: () {}, child: const Text('Confirm Order ₹1,499')),
          ],
        ),
      ),
    );
  }
}`
    },

    {
      id: 'screen_02',
      title: 'Crypto Wallet & Asset Dashboard',
      category: 'Banking',
      isPremium: false,
      badge: 'Free',
      description: 'Dark-mode financial asset dashboard featuring total balance display & coin list.',
      simType: 'glass_button',
      code: `import 'package:flutter/material.dart';

class CryptoDashboardScreen extends StatelessWidget {
  const CryptoDashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('Total Balance', style: TextStyle(color: Colors.white54)),
              Text('\$98,420.50', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}`
    }
  ],

  // ------------------------------------------------------------------------
  // ANIMATIONS LIBRARY
  // ------------------------------------------------------------------------
  animations: [
    {
      id: 'anim_01',
      title: 'Physics Spring Bottom Sheet',
      category: 'Bottom Sheet Animation',
      description: 'Elastic damping popup sheet with backdrop blur and drag physics.',
      code: `showModalBottomSheet(
  context: context,
  backgroundColor: Colors.transparent,
  builder: (context) => TweenAnimationBuilder<double>(
    duration: const Duration(milliseconds: 400),
    curve: Curves.elasticOut,
    tween: Tween(begin: 0.0, end: 1.0),
    builder: (context, value, child) => Transform.scale(scale: value, child: child),
    child: Container(height: 350, color: const Color(0xFF0F172A)),
  ),
);`
    },
    {
      id: 'anim_02',
      title: 'Shared Element Hero Page Transition',
      category: 'Hero Transition',
      description: 'Smooth 60FPS Hero card expansion transition between screens.',
      code: `Hero(
  tag: 'card_hero_tag',
  child: Material(
    color: Colors.transparent,
    child: Container(
      decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(20)),
    ),
  ),
);`
    }
  ],

  // ------------------------------------------------------------------------
  // STATE MANAGEMENT BLUEPRINTS
  // ------------------------------------------------------------------------
  stateManagement: [
    {
      id: 'sm_riverpod',
      framework: 'Riverpod 2.x',
      title: 'AsyncNotifier Auth & Token Flow',
      description: 'Production setup using AsyncNotifier, StateProvider, and immutable updates.',
      code: `import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthState {
  final bool isAuthenticated;
  AuthState({required this.isAuthenticated});
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState(isAuthenticated: false));
  void login() => state = AuthState(isAuthenticated: true);
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) => AuthNotifier());`
    },
    {
      id: 'sm_bloc',
      framework: 'BLoC 8.x',
      title: 'Hydrated BLoC Shopping Cart',
      description: 'Cart management with event-driven state streams and persistent storage.',
      code: `import 'package:flutter_bloc/flutter_bloc.dart';

abstract class CartEvent {}
class AddItemEvent extends CartEvent { final String item; AddItemEvent(this.item); }

class CartState {
  final List<String> items;
  CartState(this.items);
}

class CartBloc extends Bloc<CartEvent, CartState> {
  CartBloc() : super(CartState([])) {
    on<AddItemEvent>((event, emit) => emit(CartState([...state.items, event.item])));
  }
}`
    }
  ],

  // ------------------------------------------------------------------------
  // FULL PROJECTS
  // ------------------------------------------------------------------------
  projects: [
    {
      id: 'proj_01',
      title: 'FoodieExpress - Food Delivery Full App',
      category: 'Food Delivery',
      isPremium: true,
      badge: 'Pro Project (₹29/mo)',
      description: 'Full food ordering app with Google Maps live tracking & Razorpay.',
      pubspec: `name: foodie_express
dependencies:
  google_maps_flutter: ^2.5.0
  razorpay_flutter: ^1.3.5
  flutter_bloc: ^8.1.3`
    },
    {
      id: 'proj_02',
      title: 'ExpenseTracker Pro - SQLite & Charts',
      category: 'Finance',
      isPremium: true,
      badge: 'Pro Project (₹29/mo)',
      description: 'Personal expense tracking app with Hive DB and FL Charts analytics.',
      pubspec: `name: expense_tracker_pro
dependencies:
  flutter_riverpod: ^2.4.0
  hive_flutter: ^1.1.0
  fl_chart: ^0.65.0`
    }
  ],
  roadmaps: {
    free: [
      { step: '01', title: 'Dart Fundamentals', level: 'Beginner', duration: 'Week 1', topics: ['Variables & Data Types', 'Functions & Arrow Syntax', 'Control Flow', 'Object-Oriented Programming (Classes, Mixins)'] },
      { step: '02', title: 'Flutter Core Widgets', level: 'Beginner', duration: 'Week 2', topics: ['Stateless vs StatefulWidget', 'Row, Column, Stack Layouts', 'ListView & GridView', 'Container & BoxDecoration'] },
      { step: '03', title: 'Navigation & State', level: 'Intermediate', duration: 'Week 3', topics: ['Navigator 2.0 / GoRouter', 'Provider State Management', 'Form Validation', 'Async Dart & Futures'] },
      { step: '04', title: 'Networking & APIs', level: 'Intermediate', duration: 'Week 4', topics: ['HTTP & Dio Package', 'JSON Serialization', 'REST API Integration', 'Error Handling & Interceptors'] },
    ],
    pro: [
      { step: '01', title: 'Mastering Dart 3 & Architecture', level: 'Pro Mastery', duration: 'Days 1-7', topics: ['Pattern Matching & Records', 'Sealed Classes', 'Clean Architecture Layering', 'Dependency Injection with GetIt'] },
      { step: '02', title: 'Riverpod 2.x & BLoC 8.x Deep Dive', level: 'Pro Mastery', duration: 'Days 8-15', topics: ['AsyncNotifier & Family Providers', 'HydratedBloc & Event Transformation', 'Stream Controllers & RxDart', 'Unit Testing Providers & Blocs'] },
      { step: '03', title: 'Custom Painting & 60FPS Animations', level: 'Pro Mastery', duration: 'Days 16-22', topics: ['CustomPainter & Path Canvas', 'Physics Spring Simulation', 'Implicit vs Explicit Animations', 'Rive & Lottie Integration'] },
      { step: '04', title: 'Production CI/CD & App Store Release', level: 'Pro Mastery', duration: 'Days 23-30', topics: ['Fastlane Automation', 'GitHub Actions Workflows', 'App Store Connect & Play Console', 'Obfuscation & Security Best Practices'] },
    ]
  },

  // ------------------------------------------------------------------------
  // FLUTTER DOCUMENTATION GUIDES
  // ------------------------------------------------------------------------
  documentation: [
    {
      id: 'doc_container',
      title: 'Container Widget',
      category: 'Layout Widgets',
      isPremium: false,
      description: 'A convenience widget that combines common painting, positioning, and sizing widgets.',
      parameters: ['alignment', 'padding', 'margin', 'color', 'decoration', 'width', 'height', 'constraints'],
      exampleCode: `Container(
  width: 200, height: 100,
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.blueAccent,
    borderRadius: BorderRadius.circular(12),
    boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 8)],
  ),
  child: const Text('Container Example', style: TextStyle(color: Colors.white)),
)`,
      bestPractices: 'Use const constructors and avoid heavy nested containers when SizedBox or Padding suffices.',
      commonMistakes: 'Overusing Container for simple padding or fixed sizing when SizedBox is faster.',
      performanceTips: 'Replace Container with SizedBox when only width/height constraints are needed.'
    },

    {
      id: 'doc_animated_container',
      title: 'AnimatedContainer Widget',
      category: 'Animation Widgets',
      isPremium: true,
      description: 'Animated version of Container that gradually changes its values over a period of time.',
      parameters: ['duration', 'curve', 'onEnd', 'decoration', 'width', 'height'],
      exampleCode: `AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeOutCubic,
  width: _isExpanded ? 300 : 150,
  height: _isExpanded ? 200 : 80,
  decoration: BoxDecoration(
    color: _isExpanded ? Colors.purple : Colors.blue,
    borderRadius: BorderRadius.circular(_isExpanded ? 24 : 12),
  ),
  child: const Center(child: Text('Tap to Animate')),
)`,
      bestPractices: 'Choose appropriate Easing curves like easeOutCubic for natural UI feel.',
      commonMistakes: 'Changing non-animatable properties causing sudden jumps.',
      performanceTips: 'Keep duration under 350ms for swift micro-interactions.'
    }
  ],

  // ------------------------------------------------------------------------
  // FLUTTER JOB BOARD
  // ------------------------------------------------------------------------
  jobs: [
    {
      id: 'job_01',
      title: 'Senior Flutter Engineer (Clean Architecture)',
      company: 'Cred',
      location: 'Bengaluru / Hybrid',
      region: 'India',
      salary: '₹28,00,00,000 - ₹38,00,000 / year',
      type: 'Full-time',
      experience: '4+ Years',
      tags: ['Flutter', 'Dart 3', 'Riverpod', 'Clean Architecture'],
      logoBg: '#10b981',
      applyUrl: 'https://cred.club/careers'
    },
    {
      id: 'job_02',
      title: 'Lead Flutter Mobile Architect (Remote)',
      company: 'StreamDev Inc.',
      location: 'Remote (Worldwide)',
      region: 'Remote',
      salary: '\$90,000 - \$120,000 / year',
      type: 'Full-time',
      experience: '5+ Years',
      tags: ['Flutter Web', 'BLoC', 'GraphQL', 'CI/CD'],
      logoBg: '#38bdf8',
      applyUrl: 'https://remote.co'
    },
    {
      id: 'job_03',
      title: 'Flutter Developer (Fintech App)',
      company: 'PayTech Europe',
      location: 'Berlin, Germany',
      region: 'Europe',
      salary: '€70,000 - €85,000 / year',
      type: 'Full-time',
      experience: '3+ Years',
      tags: ['Flutter', 'State Management', 'Hive DB'],
      logoBg: '#8b5cf6',
      applyUrl: 'https://linkedin.com'
    }
  ],

  // ------------------------------------------------------------------------
  // INTERVIEW HUB (MCQs & COMPANY QUESTIONS)
  // ------------------------------------------------------------------------
  interview: {
    mcqs: [
      {
        id: 'mcq_01',
        question: 'Which method is called immediately after initState() in a StatefulWidget lifecycle?',
        options: ['build()', 'didChangeDependencies()', 'dispose()', 'setState()'],
        correctIndex: 1,
        explanation: 'didChangeDependencies() is invoked immediately after initState() and when inherited widgets change.'
      },
      {
        id: 'mcq_02',
        question: 'What keyword in Dart 3 creates an immutable class hierarchy that cannot be extended outside its library?',
        options: ['sealed', 'final', 'interface', 'abstract'],
        correctIndex: 0,
        explanation: 'The "sealed" modifier in Dart 3 creates an exhaustively matchable class tree.'
      }
    ],
    companyQuestions: [
      {
        company: 'Google',
        role: 'Senior Flutter Software Engineer',
        question: 'How does the Flutter RenderObject tree differ from the Element tree and Widget tree?',
        answer: 'The Widget tree is immutable configuration. The Element tree manages lifecycle and connects Widgets to RenderObjects. The RenderObject tree handles layout, sizing, and painting on screen.'
      },
      {
        company: 'BMW Group',
        role: 'Flutter Automotive UI Engineer',
        question: 'Explain how Flutter handles 60FPS/120FPS rendering via Skia / Impeller.',
        answer: 'Impeller pre-compiles shaders during build time, avoiding runtime shader compilation jank on iOS and Android.'
      }
    ]
  },

  // ------------------------------------------------------------------------
  // COMMUNITY GROUPS & DISCUSSIONS
  // ------------------------------------------------------------------------
  communityGroups: [
    { id: 'grp_beginners', name: 'Flutter Beginners', members: '14.2k', topic: 'Installation, Basic Widgets & Dart 101' },
    { id: 'grp_advanced', name: 'Flutter Advanced', members: '9.8k', topic: 'Clean Architecture, Impeller Engine & Native Plugins' },
    { id: 'grp_riverpod', name: 'Riverpod 2.x', members: '8.4k', topic: 'AsyncNotifier, Code Generation & State Management' },
    { id: 'grp_bloc', name: 'BLoC 8.x', members: '7.6k', topic: 'Event Streams, HydratedBloc & Unit Testing' },
    { id: 'grp_jobs', name: 'Flutter Jobs & Hiring', members: '18.1k', topic: 'Remote Job Posts, Resume Reviews & Interview Advice' }
  ],

  // ------------------------------------------------------------------------
  // DOWNLOADS (TEMPLATES & CHEAT SHEETS)
  // ------------------------------------------------------------------------
  downloads: [
    { id: 'dl_01', title: 'Senior Flutter Developer Resume Template', category: 'Resumes', format: 'PDF / Figma', isPremium: false },
    { id: 'dl_02', title: 'Dart 3 Patterns & Control Flow Cheat Sheet', category: 'Cheat Sheets', format: 'PDF (HD)', isPremium: false },
    { id: 'dl_03', title: 'Flutter Clean Architecture Proposal Template', category: 'Proposals', format: 'DOCX / PDF', isPremium: true },
    { id: 'dl_04', title: 'Full-Stack Flutter App Client Contract Template', category: 'Contracts', format: 'PDF / Markdown', isPremium: true }
  ],

  // ------------------------------------------------------------------------
  // DEVELOPER BLOG POSTS
  // ------------------------------------------------------------------------
  blogs: [
    {
      id: 'blog_01',
      title: 'Mastering Flutter 3.x Performance: 10 Instant Speed Hacks',
      author: 'Antigravity DeepMind Team',
      date: 'July 28, 2026',
      readTime: '6 min read',
      tag: 'Performance',
      content: `Flutter applications running on web and mobile demand zero jank. Always use const constructors and RepaintBoundary for heavy subtrees.`
    },
    {
      id: 'blog_02',
      title: 'Dart 3 Patterns & Record Types in Clean Architecture',
      author: 'Flutter Engineering',
      date: 'July 22, 2026',
      readTime: '8 min read',
      tag: 'Dart',
    }
  ],

  // ------------------------------------------------------------------------
  // UI DESIGN SYSTEMS SHOWCASE DATASET
  // ------------------------------------------------------------------------
  designSystems: {
    bento: {
      name: 'Bento UI',
      icon: '🍱',
      tagline: 'High-density modular grids inspired by Apple & Next.js dashboard layouts.',
      accentColor: '#6366f1',
      components: [
        {
          id: 'bento_01',
          title: 'Bento Grid Dashboard Cards',
          badge: 'FREE',
          isPremium: false,
          description: 'Compact multi-span dashboard card layout with live telemetry stats.',
          simType: 'bento_card',
          code: `// Bento Grid Dashboard Card
Container(
  decoration: BoxDecoration(
    color: const Color(0xFF0F172A),
    borderRadius: BorderRadius.circular(24),
    border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.3)),
    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.4), blurRadius: 20)],
  ),
  child: const Padding(
    padding: EdgeInsets.all(20),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.grid_view_rounded, color: Color(0xFF818CF8)),
        SizedBox(height: 12),
        Text('Revenue Telemetry', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ],
    ),
  ),
)`
        },
        {
          id: 'bento_02',
          title: 'Bento Statistics Cards',
          badge: 'PRO',
          isPremium: true,
          description: 'High-contrast stat metrics box with sparkline trend chart indicators.',
          simType: 'bento_stats',
          code: `// Bento Statistics Sparkline Card
Container(
  padding: const EdgeInsets.all(20),
  decoration: BoxDecoration(
    color: const Color(0xFF1E1B4B),
    borderRadius: BorderRadius.circular(20),
    border: Border.all(color: const Color(0xFF818CF8).withOpacity(0.4)),
  ),
  child: Column(
    children: [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: const [
          Text('Monthly ARR', style: TextStyle(color: Colors.white70)),
          Icon(Icons.trending_up, color: Color(0xFF34D399)),
        ],
      ),
      const SizedBox(height: 12),
      const Text('₹4,85,000', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
    ],
  ),
)`
        },
        {
          id: 'bento_03',
          title: 'Bento Feature Grid Layout',
          badge: 'FREE',
          isPremium: false,
          description: 'Asymmetric 3-column feature showcase grid with hover borders.',
          simType: 'bento_grid',
          code: `// Bento Feature Grid Layout
StaggeredGrid.count(
  crossAxisCount: 4,
  mainAxisSpacing: 12,
  crossAxisSpacing: 12,
  children: [
    StaggeredGridTile.count(crossAxisCellCount: 2, mainAxisCellCount: 2, child: BentoTile(title: 'Impeller 60FPS')),
    StaggeredGridTile.count(crossAxisCellCount: 2, mainAxisCellCount: 1, child: BentoTile(title: 'State Management')),
  ],
)`
        },
        {
          id: 'bento_04',
          title: 'Bento Analytics Widgets',
          badge: 'PRO',
          isPremium: true,
          description: 'Real-time server CPU & RAM usage monitor card with live radial progress.',
          simType: 'bento_analytics',
          code: `// Bento Server Monitor Widget
Container(
  decoration: BoxDecoration(
    color: const Color(0xFF020617),
    borderRadius: BorderRadius.circular(24),
    border: Border.all(color: const Color(0xFF6366F1)),
  ),
  child: const CircularProgressIndicator(value: 0.82, color: Color(0xFF818CF8)),
)`
        },
        {
          id: 'bento_05',
          title: 'Bento Pricing Cards',
          badge: 'PRO',
          isPremium: true,
          description: 'Modular pricing tier card with badge highlight tag.',
          simType: 'bento_pricing',
          code: `// Bento Pricing Card
Container(
  padding: const EdgeInsets.all(24),
  decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(24)),
  child: const Text('Pro Pass ₹29/mo', style: TextStyle(color: Colors.white)),
)`
        }
      ]
    },

    neumorphism: {
      name: 'Neumorphism',
      icon: '🔘',
      tagline: 'Soft plastic tactile light & dark dual extruded shadow interfaces.',
      accentColor: '#38bdf8',
      components: [
        {
          id: 'neu_01',
          title: 'Soft Extruded Buttons',
          badge: 'FREE',
          isPremium: false,
          description: 'Tactile dual-shadow pressed & unpressed physical button effects.',
          simType: 'neu_button',
          code: `// Neumorphic Soft Button
Container(
  decoration: BoxDecoration(
    color: const Color(0xFF141B2D),
    borderRadius: BorderRadius.circular(16),
    boxShadow: const [
      BoxShadow(color: Color(0xFF0C101B), offset: Offset(6, 6), blurRadius: 16),
      BoxShadow(color: Color(0xFF1C263F), offset: Offset(-6, -6), blurRadius: 16),
    ],
  ),
  child: const FlatButton(child: Text('Soft Tactile')),
)`
        },
        {
          id: 'neu_02',
          title: 'Soft Login Form',
          badge: 'PRO',
          isPremium: true,
          description: 'Inset neumorphic textfields with dual shadow input fields.',
          simType: 'neu_login',
          code: `// Neumorphic Inset Input
Container(
  decoration: BoxDecoration(
    color: const Color(0xFF141B2D),
    borderRadius: BorderRadius.circular(12),
    boxShadow: const [
      BoxShadow(color: Color(0xFF0C101B), offset: Offset(4, 4), blurRadius: 10, inset: true),
    ],
  ),
)`
        },
        {
          id: 'neu_03',
          title: 'Neumorphic Music Player UI',
          badge: 'PRO',
          isPremium: true,
          description: 'Tactile audio player control surface with smooth inset dial slider.',
          simType: 'neu_player',
          code: `// Neumorphic Music Control Surface
Container(
  width: 280,
  padding: const EdgeInsets.all(20),
  decoration: BoxDecoration(color: const Color(0xFF141B2D), borderRadius: BorderRadius.circular(30)),
  child: const Icon(Icons.play_arrow_rounded, color: Color(0xFF38BDF8), size: 36),
)`
        },
        {
          id: 'neu_04',
          title: 'Tactile Toggle Switches',
          badge: 'FREE',
          isPremium: false,
          description: 'Physical toggle switch widget with active neumorphic shadow well.',
          simType: 'neu_toggle',
          code: `// Neumorphic Toggle Switch
NeumorphicSwitch(
  style: const NeumorphicSwitchStyle(activeTrackColor: Color(0xFF38BDF8)),
  value: true,
  onChanged: (val) {},
)`
        },
        {
          id: 'neu_05',
          title: 'Neumorphic Inset Cards',
          badge: 'FREE',
          isPremium: false,
          description: 'Sunken inset card container for embedded content.',
          simType: 'neu_card',
          code: `// Neumorphic Inset Container
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(color: const Color(0xFF141B2D), borderRadius: BorderRadius.circular(20)),
)`
        }
      ]
    },

    claymorphism: {
      name: 'Claymorphism',
      icon: '🎨',
      tagline: 'Vibrant 3D puffy clay surfaces with inner highlight depth & inflated shapes.',
      accentColor: '#ec4899',
      components: [
        {
          id: 'clay_01',
          title: '3D Clay Buttons',
          badge: 'FREE',
          isPremium: false,
          description: 'Puffy rounded 3D clay button with outer shadow & top inner light highlight.',
          simType: 'clay_button',
          code: `// Claymorphic Puffy 3D Button
Container(
  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
  decoration: BoxDecoration(
    gradient: const LinearGradient(colors: [Color(0xFFEC4899), Color(0xFF8B5CF6)]),
    borderRadius: BorderRadius.circular(30),
    boxShadow: [
      BoxShadow(color: const Color(0xFFEC4899).withOpacity(0.4), blurRadius: 20, offset: const Offset(8, 12)),
    ],
  ),
  child: const Text('Clay 3D Launch', style: TextStyle(color: Colors.white, fontWeight: FontWeight.extrabold)),
)`
        },
        {
          id: 'clay_02',
          title: '3D Soft Profile Cards',
          badge: 'PRO',
          isPremium: true,
          description: 'Inflated clay profile card with 3D avatar bubble container.',
          simType: 'clay_profile',
          code: `// Claymorphic Inflated Profile Card
Container(
  decoration: BoxDecoration(
    color: const Color(0xFF8B5CF6),
    borderRadius: BorderRadius.circular(32),
  ),
  child: const CircleAvatar(radius: 40, backgroundColor: Colors.white24),
)`
        },
        {
          id: 'clay_03',
          title: 'Clay Dashboard Widgets',
          badge: 'PRO',
          isPremium: true,
          description: 'Puffy colorful metric tile with 3D inset drop shadows.',
          simType: 'clay_dashboard',
          code: `// Clay Dashboard Metric Container
Container(
  padding: const EdgeInsets.all(20),
  decoration: BoxDecoration(
    gradient: const LinearGradient(colors: [Color(0xFF3B82F6), Color(0xFF06B6D4)]),
    borderRadius: BorderRadius.circular(28),
  ),
)`
        },
        {
          id: 'clay_04',
          title: 'Clay Pricing Cards',
          badge: 'PRO',
          isPremium: true,
          description: 'Vibrant 3D pricing tier card with inflated CTA button.',
          simType: 'clay_pricing',
          code: `// Clay Pricing Tier Container
Container(
  decoration: BoxDecoration(color: const Color(0xFFF43F5E), borderRadius: BorderRadius.circular(32)),
)`
        },
        {
          id: 'clay_05',
          title: 'Floating 3D Cards',
          badge: 'FREE',
          isPremium: false,
          description: 'Playful floating clay bubble card with spring physics bounce.',
          simType: 'clay_card',
          code: `// Clay Floating Container
Container(
  decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(24)),
)`
        }
      ]
    },

    glassmorphism: {
      name: 'Glassmorphism',
      icon: '💎',
      tagline: 'Modern frosted glass, backdrop blur filters & neon border highlights.',
      accentColor: '#10b981',
      components: [
        {
          id: 'glass_01',
          title: 'Glass Login Screen',
          badge: 'PRO',
          isPremium: true,
          description: 'Full frosted glass backdrop modal with login form controls.',
          simType: 'glass_login',
          code: `// Glassmorphism Login Container
ClipRRect(
  borderRadius: BorderRadius.circular(28),
  child: BackdropFilter(
    filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
    child: Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: const Text('Sign In to FlutterHub'),
    ),
  ),
)`
        },
        {
          id: 'glass_02',
          title: 'Glass Sidebar Navigation',
          badge: 'PRO',
          isPremium: true,
          description: 'Semi-transparent navigation drawer with blurred backdrop.',
          simType: 'glass_sidebar',
          code: `// Glass Navigation Drawer
BackdropFilter(
  filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
  child: Container(width: 260, color: Colors.black.withOpacity(0.3)),
)`
        },
        {
          id: 'glass_03',
          title: 'Frosted Navigation Bar',
          badge: 'FREE',
          isPremium: false,
          description: 'Sticky top header navbar with backdrop blur filter.',
          simType: 'glass_navbar',
          code: `// Glass Sticky Header Navbar
Container(
  height: 64,
  decoration: BoxDecoration(color: const Color(0xFF090D16).withOpacity(0.7)),
)`
        },
        {
          id: 'glass_04',
          title: 'Glass Profile Card',
          badge: 'FREE',
          isPremium: false,
          description: 'Glass user badge card with gradient ring avatar container.',
          simType: 'glass_profile',
          code: `// Glass Profile Card Container
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(20)),
)`
        },
        {
          id: 'glass_05',
          title: 'Glass Modal Dialog',
          badge: 'PRO',
          isPremium: true,
          description: 'Center alert popup with frosted glass backdrop blur overlay.',
          simType: 'dialog_preview',
          code: `// Glass Alert Dialog Container
Dialog(
  backgroundColor: Colors.transparent,
  child: BackdropFilter(filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12), child: Container()),
)`
        }
      ]
    },

    aurora: {
      name: 'Aurora UI',
      icon: '🌌',
      tagline: 'Vibrant ambient mesh gradient light glows & floating aura illumination.',
      accentColor: '#a855f7',
      components: [
        {
          id: 'aurora_01',
          title: 'Vibrant Aurora Hero Section',
          badge: 'PRO',
          isPremium: true,
          description: 'Dynamic animated mesh gradient background container for hero sections.',
          simType: 'aurora_hero',
          code: `// Aurora Mesh Gradient Container
Container(
  decoration: BoxDecoration(
    gradient: RadialGradient(
      center: Alignment.topRight,
      radius: 1.2,
      colors: [
        const Color(0xFFA855F7).withOpacity(0.4),
        const Color(0xFFEC4899).withOpacity(0.3),
        const Color(0xFF090D16),
      ],
    ),
  ),
  child: const Text('Build 10x Faster', style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
)`
        },
        {
          id: 'aurora_02',
          title: 'Glow CTA Cards',
          badge: 'FREE',
          isPremium: false,
          description: 'Hover glow CTA box with multi-color radial gradient halo.',
          simType: 'aurora_cta',
          code: `// Aurora Glowing CTA Container
Container(
  padding: const EdgeInsets.all(24),
  decoration: BoxDecoration(
    color: const Color(0xFF090D16),
    borderRadius: BorderRadius.circular(24),
    border: Border.all(color: const Color(0xFFA855F7).withOpacity(0.5)),
    boxShadow: [BoxShadow(color: const Color(0xFFA855F7).withOpacity(0.3), blurRadius: 30)],
  ),
)`
        },
        {
          id: 'aurora_03',
          title: 'Glowing Aurora Pricing Section',
          badge: 'PRO',
          isPremium: true,
          description: 'Featured pricing card with ambient animated color aura.',
          simType: 'aurora_pricing',
          code: `// Aurora Pricing Card
Container(
  decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(28)),
)`
        },
        {
          id: 'aurora_04',
          title: 'Mesh Gradient Dashboard',
          badge: 'PRO',
          isPremium: true,
          description: 'Dark SaaS analytics dashboard layout with multi-point aurora light sources.',
          simType: 'aurora_dashboard',
          code: `// Aurora Mesh Analytics Dashboard
Container(
  decoration: const BoxDecoration(color: Color(0xFF030712)),
)`
        },
        {
          id: 'aurora_05',
          title: 'Aurora Landing Page Components',
          badge: 'FREE',
          isPremium: false,
          description: 'Hero feature pill container with glowing neon border pulse.',
          simType: 'aurora_pill',
          code: `// Aurora Pill Container
Container(
  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  decoration: BoxDecoration(color: const Color(0xFFA855F7).withOpacity(0.15), borderRadius: BorderRadius.circular(30)),
)`
        }
      ]
    }
  }
};
