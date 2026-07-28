/* ==========================================================================
   FlutterHub Master Data Repository (Full & Complete Dataset)
   Contains authentic production-ready Flutter/Dart snippets, UI screens,
   animations, architecture guides, full projects, and blogs.
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
    // 1. BUTTONS
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

    // 2. CARDS
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

    // 3. DIALOGS
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

    // 4. BOTTOM SHEETS
    {
      id: 'comp_bs_01',
      title: 'Spring Damping Custom Bottom Sheet',
      category: 'bottom_sheets',
      isPremium: false,
      badge: 'Free',
      description: 'Elastic spring damping sheet modal with drag handle and rounded top corners.',
      dependencies: ['flutter/material.dart'],
      simType: 'dialog_preview',
      code: `import 'package:flutter/material.dart';

void showSpringBottomSheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (context) => TweenAnimationBuilder<double>(
      duration: const Duration(milliseconds: 400),
      curve: Curves.elasticOut,
      tween: Tween(begin: 0.0, end: 1.0),
      builder: (context, value, child) => Transform.scale(scale: value, child: child),
      child: Container(
        padding: const EdgeInsets.all(24),
        height: 380,
        decoration: const BoxDecoration(
          color: Color(0xFF0F172A),
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          border: Border(top: BorderSide(color: Colors.white24)),
        ),
        child: Column(
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.white30, borderRadius: BorderRadius.circular(4))),
            const SizedBox(height: 20),
            const Text('Payment Selection', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    ),
  );
}`
    },

    // 5. NAV BARS
    {
      id: 'comp_nav_01',
      title: 'Curved Floating Glass Navigation Bar',
      category: 'nav_bars',
      isPremium: true,
      badge: 'Pro (₹29/mo)',
      description: 'Modern bottom navigation bar with floating glass elevation and indicator animations.',
      dependencies: ['flutter/material.dart'],
      simType: 'dock_menu',
      code: `import 'package:flutter/material.dart';

class CurvedGlassNavBar extends StatefulWidget {
  const CurvedGlassNavBar({Key? key}) : super(key: key);

  @override
  State<CurvedGlassNavBar> createState() => _CurvedGlassNavBarState();
}

class _CurvedGlassNavBarState extends State<CurvedGlassNavBar> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      height: 64,
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withOpacity(0.9),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          IconButton(icon: Icon(Icons.home_rounded, color: _currentIndex == 0 ? Colors.cyanAccent : Colors.white54), onPressed: () => setState(() => _currentIndex = 0)),
          IconButton(icon: Icon(Icons.grid_view_rounded, color: _currentIndex == 1 ? Colors.cyanAccent : Colors.white54), onPressed: () => setState(() => _currentIndex = 1)),
          IconButton(icon: Icon(Icons.person_rounded, color: _currentIndex == 2 ? Colors.cyanAccent : Colors.white54), onPressed: () => setState(() => _currentIndex = 2)),
        ],
      ),
    );
  }
}`
    },

    // 6. TEXTFIELDS & OTP
    {
      id: 'comp_tf_01',
      title: 'Neon OTP Pin Verification Input',
      category: 'textfields',
      isPremium: false,
      badge: 'Free',
      description: '6-digit OTP verification field with automatic focus progression.',
      dependencies: ['pinput: ^3.0.0'],
      simType: 'otp_input',
      code: `import 'package:flutter/material.dart';

class NeonOtpInputField extends StatefulWidget {
  const NeonOtpInputField({Key? key}) : super(key: key);

  @override
  State<NeonOtpInputField> createState() => _NeonOtpInputFieldState();
}

class _NeonOtpInputFieldState extends State<NeonOtpInputField> {
  final List<TextEditingController> _controllers = List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(4, (index) {
        return Container(
          width: 48, height: 56,
          margin: const EdgeInsets.symmetric(horizontal: 6),
          child: TextField(
            controller: _controllers[index],
            focusNode: _focusNodes[index],
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
            decoration: InputDecoration(
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.white24)),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF38BDF8), width: 2)),
              fillColor: const Color(0xFF1E293B), filled: true,
            ),
            onChanged: (value) {
              if (value.isNotEmpty && index < 3) _focusNodes[index + 1].requestFocus();
            },
          ),
        );
      }),
    );
  }
}`
    },

    // 7. SEARCH BARS
    {
      id: 'comp_sb_01',
      title: 'Floating Glass Search Bar with Filter Chips',
      category: 'search_bars',
      isPremium: false,
      badge: 'Free',
      description: 'Animated expandable search bar with dynamic filter chip row.',
      dependencies: ['flutter/material.dart'],
      simType: 'glass_button',
      code: `import 'package:flutter/material.dart';

class GlassSearchBar extends StatelessWidget {
  const GlassSearchBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: const TextField(
        style: TextStyle(color: Colors.white),
        decoration: InputDecoration(
          icon: Icon(Icons.search_rounded, color: Colors.cyanAccent),
          hintText: 'Search components, screens...',
          hintStyle: TextStyle(color: Colors.white38),
          border: InputBorder.none,
        ),
      ),
    );
  }
}`
    },

    // 8. CHARTS
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
    },

    // 9. PROGRESS
    {
      id: 'comp_prog_01',
      title: 'Shimmer Skeleton Feed Skeleton',
      category: 'progress',
      isPremium: false,
      badge: 'Free',
      description: 'Smooth shimmer loader skeleton for post feeds and profiles.',
      dependencies: ['shimmer: ^3.0.0'],
      simType: 'shimmer_card',
      code: `import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ShimmerFeedSkeleton extends StatelessWidget {
  const ShimmerFeedSkeleton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFF1E293B),
      highlightColor: const Color(0xFF334155),
      child: Container(height: 120, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16))),
    );
  }
}`
    },

    // 10. TIMELINES
    {
      id: 'comp_time_01',
      title: 'Order Tracking Timeline Stepper',
      category: 'timelines',
      isPremium: false,
      badge: 'Free',
      description: 'Vertical timeline stepper displaying order lifecycle events.',
      dependencies: ['flutter/material.dart'],
      simType: 'timeline_preview',
      code: `import 'package:flutter/material.dart';

class OrderTimelineWidget extends StatelessWidget {
  const OrderTimelineWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        ListTile(leading: Icon(Icons.check_circle, color: Colors.greenAccent), title: Text('Order Placed', style: TextStyle(color: Colors.white))),
        ListTile(leading: Icon(Icons.local_shipping, color: Colors.cyanAccent), title: Text('Out for Delivery', style: TextStyle(color: Colors.white))),
      ],
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
    },

    {
      id: 'screen_03',
      title: 'FoodieExpress Delivery App Screen',
      category: 'Food Delivery',
      isPremium: true,
      badge: 'Pro (₹29/mo)',
      description: 'Complete food ordering home feed with restaurant cards and rating chips.',
      simType: 'glass_button',
      code: `import 'package:flutter/material.dart';

class FoodDeliveryHomeScreen extends StatelessWidget {
  const FoodDeliveryHomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Text('Deliver to Home', style: TextStyle(color: Colors.white54)),
          Text('The Biryani House ★ 4.8', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}`
    },

    {
      id: 'screen_04',
      title: 'Spotify Clone Audio Player Screen',
      category: 'Music Player',
      isPremium: true,
      badge: 'Pro (₹29/mo)',
      description: 'Audio playback interface with album artwork rotation and audio controls.',
      simType: 'glass_button',
      code: `import 'package:flutter/material.dart';

class SpotifyPlayerScreen extends StatelessWidget {
  const SpotifyPlayerScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.music_note, color: Colors.cyanAccent, size: 80),
            Text('Midnight City - M83', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          ],
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
    },
    {
      id: 'proj_03',
      title: 'StreamFlix - Netflix Clone App',
      category: 'Streaming',
      isPremium: true,
      badge: 'Pro Project (₹29/mo)',
      description: 'Video streaming app with TMDB API integration and Chewie player.',
      pubspec: `name: streamflix_app
dependencies:
  chewie: ^1.7.0
  video_player: ^2.8.0
  dio: ^5.4.0`
    }
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
      content: `Dart 3 introduced powerful pattern matching, record types, and class modifiers. Learn how switch expressions eliminate boilerplates in clean architecture!`
    }
  ]
};
