/* ==========================================================================
   FlutterHub Master Data Repository (Expanded Platform Datasets)
   ========================================================================== */

const FLUTTER_DATA = {
  // ------------------------------------------------------------------------
  // COMPONENTS CATEGORIES
  // ------------------------------------------------------------------------
  categories: [
    { id: 'buttons', name: 'Buttons & Action Dock', count: 18 },
    { id: 'textfields', name: 'TextFields & Forms', count: 20 },
    { id: 'cards', name: 'Cards & Surfaces', count: 22 },
    { id: 'lists', name: 'Lists & ListTile', count: 16 },
    { id: 'dialogs', name: 'Dialogs & Modals', count: 14 },
    { id: 'bottom_sheets', name: 'Bottom Sheets', count: 12 },
    { id: 'snackbars', name: 'SnackBars & Toast', count: 10 },
    { id: 'appbar', name: 'AppBar & SliverAppBar', count: 12 },
    { id: 'nav_bars', name: 'BottomNavigationBar & Dock', count: 16 },
    { id: 'drawers', name: 'NavigationDrawer & Drawers', count: 10 },
    { id: 'tabs', name: 'Tabs & TabBar', count: 14 },
    { id: 'dropdowns', name: 'Dropdowns & Menus', count: 12 },
    { id: 'checkboxes', name: 'Checkboxes & Switches', count: 15 },
    { id: 'radios', name: 'Radio Buttons & Choice Cards', count: 12 },
    { id: 'sliders', name: 'Sliders & RangeSliders', count: 12 },
    { id: 'progress', name: 'Progress & Shimmer', count: 14 },
    { id: 'chips', name: 'Chips & Tag Pills', count: 14 },
    { id: 'tooltips', name: 'Tooltips & Popovers', count: 10 },
    { id: 'pickers', name: 'Date & Time Pickers', count: 10 },
    { id: 'images', name: 'Images & Icons', count: 12 },
    { id: 'gridview', name: 'GridView & Masonry', count: 14 },
    { id: 'listview', name: 'ListView & PageView', count: 16 },
    { id: 'expansion', name: 'ExpansionTile & Accordions', count: 12 },
    { id: 'fab', name: 'FloatingActionButton & FAB', count: 10 },
    { id: 'material_cupertino', name: 'Material & Cupertino Widgets', count: 15 },
    { id: 'search_bars', name: 'Search Bars & Filters', count: 10 },
    { id: 'charts', name: 'Charts & Analytics', count: 15 },
    { id: 'timelines', name: 'Timelines & Steppers', count: 12 },
  ],

  // ------------------------------------------------------------------------
  // COMPONENTS SNIPPETS
  // ------------------------------------------------------------------------
  components: [
  {
    "id": "comp_buttons_01",
    "title": "Aceternity Glassmorphism Neo Button",
    "category": "buttons",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Aceternity Glassmorphism Neo Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Aceternity Glassmorphism Button\nClipRRect(\n  borderRadius: BorderRadius.circular(16),\n  child: BackdropFilter(\n    filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),\n    child: Container(\n      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),\n      decoration: BoxDecoration(\n        color: Colors.white.withOpacity(0.1),\n        borderRadius: BorderRadius.circular(16),\n        border: Border.all(color: Colors.white.withOpacity(0.2)),\n      ),\n      child: const Text('Aceternity Neo Button', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n    ),\n  ),\n)"
  },
  {
    "id": "comp_buttons_02",
    "title": "Voice Memo Audio Waveform Player",
    "category": "buttons",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Voice Memo Audio Waveform Player widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "voice_memo",
    "code": "// Voice Memo Audio Player\nContainer(\n  padding: const EdgeInsets.all(16),\n  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),\n  child: Row(\n    children: [\n      IconButton(icon: const Icon(Icons.play_circle_fill, color: Colors.purple), onPressed: () {}),\n      Expanded(child: LinearProgressIndicator(value: 0.4, color: Colors.blue)),\n      const Text('00:04 / 00:30', style: TextStyle(color: Colors.purple)),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_buttons_03",
    "title": "Pulsing Neon Glow CTA Button",
    "category": "buttons",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Pulsing Neon Glow CTA Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Pulsing Neon Glow Button\nContainer(\n  decoration: BoxDecoration(\n    borderRadius: BorderRadius.circular(30),\n    boxShadow: [BoxShadow(color: const Color(0xFF38BDF8).withOpacity(0.6), blurRadius: 20, spreadRadius: 2)],\n    gradient: const LinearGradient(colors: [Color(0xFF38BDF8), Color(0xFF8B5CF6)]),\n  ),\n  child: ElevatedButton(\n    onPressed: () {},\n    style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent),\n    child: const Text('Get Started Free', style: TextStyle(fontWeight: FontWeight.bold)),\n  ),\n)"
  },
  {
    "id": "comp_buttons_04",
    "title": "Neumorphic Soft 3D Action Button",
    "category": "buttons",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Neumorphic Soft 3D Action Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Neumorphic 3D Soft Button\nContainer(\n  decoration: BoxDecoration(\n    color: const Color(0xFF1E293B),\n    borderRadius: BorderRadius.circular(16),\n    boxShadow: const [\n      BoxShadow(color: Color(0xFF0F172A), offset: Offset(4, 4), blurRadius: 10),\n      BoxShadow(color: Color(0xFF334155), offset: Offset(-4, -4), blurRadius: 10),\n    ],\n  ),\n  child: const Padding(padding: EdgeInsets.all(16), child: Icon(Icons.touch_app, color: Colors.cyan)),\n)"
  },
  {
    "id": "comp_buttons_05",
    "title": "Animated Loading Spinner Button",
    "category": "buttons",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Animated Loading Spinner Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Animated Loading Button\nElevatedButton.icon(\n  onPressed: () {},\n  icon: const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)),\n  label: const Text('Processing Order...'),\n  style: ElevatedButton.styleFrom(backgroundColor: Colors.deepPurple, shape: const StadiumBorder()),\n)"
  },
  {
    "id": "comp_buttons_06",
    "title": "Shimmer Gradient Border Button",
    "category": "buttons",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Shimmer Gradient Border Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Shimmer Gradient Border Button\nContainer(\n  padding: const EdgeInsets.all(2),\n  decoration: BoxDecoration(\n    borderRadius: BorderRadius.circular(14),\n    gradient: const LinearGradient(colors: [Colors.cyan, Colors.purple, Colors.pink]),\n  ),\n  child: Container(\n    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),\n    decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(12)),\n    child: const Text('Shimmer Border', style: TextStyle(color: Colors.white)),\n  ),\n)"
  },
  {
    "id": "comp_buttons_07",
    "title": "Multi-Action Split Dropdown Button",
    "category": "buttons",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Multi-Action Split Dropdown Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Multi Action Split Dropdown Button\nRow(\n  children: [\n    ElevatedButton(onPressed: () {}, child: const Text('Export PDF')),\n    PopupMenuButton<String>(\n      icon: const Icon(Icons.arrow_drop_down),\n      onSelected: (val) {},\n      itemBuilder: (context) => [\n        const PopupMenuItem(value: 'csv', child: Text('Export CSV')),\n        const PopupMenuItem(value: 'json', child: Text('Export JSON')),\n      ],\n    ),\n  ],\n)"
  },
  {
    "id": "comp_buttons_08",
    "title": "Social OAuth Login Button Group",
    "category": "buttons",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Social OAuth Login Button Group widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Social OAuth Button Group\nColumn(\n  children: [\n    OutlinedButton.icon(icon: const Icon(Icons.g_mobiledata), label: const Text('Sign in with Google'), onPressed: () {}),\n    const SizedBox(height: 8),\n    OutlinedButton.icon(icon: const Icon(Icons.apple), label: const Text('Sign in with Apple'), onPressed: () {}),\n  ],\n)"
  },
  {
    "id": "comp_buttons_09",
    "title": "Icon Floating Ripple Action Button",
    "category": "buttons",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Icon Floating Ripple Action Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Floating Ripple Action Button\nInkWell(\n  onTap: () {},\n  borderRadius: BorderRadius.circular(50),\n  splashColor: Colors.cyan.withOpacity(0.3),\n  child: Container(\n    padding: const EdgeInsets.all(16),\n    decoration: const BoxDecoration(color: Colors.cyan, shape: BoxShape.circle),\n    child: const Icon(Icons.send_rounded, color: Colors.black),\n  ),\n)"
  },
  {
    "id": "comp_buttons_10",
    "title": "Interactive Mac OS Glass Dock Bar",
    "category": "buttons",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Interactive Mac OS Glass Dock Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dock_menu",
    "code": "// Mac OS Glass Dock Bar\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),\n  decoration: BoxDecoration(\n    color: Colors.white.withOpacity(0.1),\n    borderRadius: BorderRadius.circular(30),\n    border: Border.all(color: Colors.white24),\n  ),\n  child: Row(\n    mainAxisSize: MainAxisSize.min,\n    children: const [\n      IconButton(icon: Icon(Icons.home, color: Colors.cyan), onPressed: null),\n      IconButton(icon: Icon(Icons.search, color: Colors.white), onPressed: null),\n      IconButton(icon: Icon(Icons.grid_view, color: Colors.white), onPressed: null),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_textfields_01",
    "title": "Glass Floating Label Email Input",
    "category": "textfields",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glass Floating Label Email Input widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "form_input",
    "code": "// Glass Floating Label TextField\nTextField(\n  decoration: InputDecoration(\n    labelText: 'Email Address',\n    prefixIcon: const Icon(Icons.email, color: Colors.cyan),\n    filled: true,\n    fillColor: Colors.white.withOpacity(0.05),\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),\n  ),\n)"
  },
  {
    "id": "comp_textfields_02",
    "title": "6-Digit Auto-Focus OTP Verification Input",
    "category": "textfields",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready 6-Digit Auto-Focus OTP Verification Input widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "otp_input",
    "code": "// 6-Digit OTP Verification Fields\nRow(\n  mainAxisAlignment: MainAxisAlignment.spaceEvenly,\n  children: List.generate(6, (index) => SizedBox(\n    width: 45,\n    child: TextField(\n      textAlign: TextAlign.center,\n      keyboardType: TextInputType.number,\n      maxLength: 1,\n      decoration: InputDecoration(counterText: '', border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),\n    ),\n  )),\n)"
  },
  {
    "id": "comp_textfields_03",
    "title": "Password Field with Instant Eye Toggle",
    "category": "textfields",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Password Field with Instant Eye Toggle widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "password_input",
    "code": "// Password Field with Visibility Toggle\nTextField(\n  obscureText: true,\n  decoration: InputDecoration(\n    labelText: 'Password',\n    prefixIcon: const Icon(Icons.lock, color: Colors.purple),\n    suffixIcon: IconButton(icon: const Icon(Icons.visibility_off), onPressed: () {}),\n  ),\n)"
  },
  {
    "id": "comp_textfields_04",
    "title": "Search Field with Auto-Suggest Clear Button",
    "category": "textfields",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Search Field with Auto-Suggest Clear Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "search_input",
    "code": "// Search Input with Clear Action\nTextField(\n  decoration: InputDecoration(\n    hintText: 'Search widgets...',\n    prefixIcon: const Icon(Icons.search),\n    suffixIcon: IconButton(icon: const Icon(Icons.clear), onPressed: () {}),\n    borderRadius: BorderRadius.circular(30),\n  ),\n)"
  },
  {
    "id": "comp_textfields_05",
    "title": "Credit Card Format Number Input",
    "category": "textfields",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Credit Card Format Number Input widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "card_input",
    "code": "// Credit Card Formatter TextField\nTextField(\n  keyboardType: TextInputType.number,\n  decoration: InputDecoration(\n    hintText: 'XXXX - XXXX - XXXX - XXXX',\n    prefixIcon: const Icon(Icons.credit_card, color: Colors.blue),\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),\n  ),\n)"
  },
  {
    "id": "comp_textfields_06",
    "title": "Multiline Expandable Comment Box",
    "category": "textfields",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Multiline Expandable Comment Box widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "comment_input",
    "code": "// Multiline Expandable Comment Input\nTextField(\n  maxLines: 4,\n  decoration: InputDecoration(\n    hintText: 'Write your feedback or bug description...',\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),\n  ),\n)"
  },
  {
    "id": "comp_textfields_07",
    "title": "Phone Number Input with Country Code Selector",
    "category": "textfields",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Phone Number Input with Country Code Selector widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "phone_input",
    "code": "// Phone Input with Country Code\nRow(\n  children: [\n    Container(\n      padding: const EdgeInsets.all(12),\n      decoration: BoxDecoration(border: Border.all(color: Colors.grey), borderRadius: BorderRadius.circular(10)),\n      child: const Text('+91 🇮🇳'),\n    ),\n    const SizedBox(width: 8),\n    Expanded(child: TextField(keyboardType: TextInputType.phone, decoration: const InputDecoration(hintText: 'Phone Number'))),\n  ],\n)"
  },
  {
    "id": "comp_textfields_08",
    "title": "Currency & Amount Numeric Field",
    "category": "textfields",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Currency & Amount Numeric Field widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "currency_input",
    "code": "// Currency Amount Input\nTextField(\n  keyboardType: TextInputType.number,\n  decoration: InputDecoration(\n    prefixText: '₹ ',\n    prefixStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green),\n    hintText: '0.00',\n  ),\n)"
  },
  {
    "id": "comp_textfields_09",
    "title": "Tag Chips Input Field",
    "category": "textfields",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Tag Chips Input Field widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Tag Chips Input\nWrap(\n  spacing: 8,\n  children: [\n    Chip(label: const Text('Flutter'), onDeleted: () {}),\n    Chip(label: const Text('Dart 3'), onDeleted: () {}),\n    Chip(label: const Text('Provider'), onDeleted: () {}),\n  ],\n)"
  },
  {
    "id": "comp_textfields_10",
    "title": "Neumorphic Inset Text Box",
    "category": "textfields",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Neumorphic Inset Text Box widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "form_input",
    "code": "// Neumorphic Inset Input Container\nContainer(\n  decoration: BoxDecoration(\n    color: const Color(0xFF1E293B),\n    borderRadius: BorderRadius.circular(14),\n    boxShadow: const [BoxShadow(color: Colors.black54, offset: Offset(2, 2), blurRadius: 4, inset: true)],\n  ),\n  child: const TextField(decoration: InputDecoration(border: InputBorder.none, contentPadding: EdgeInsets.all(16))),\n)"
  },
  {
    "id": "comp_cards_01",
    "title": "Aceternity Bento Grid Telemetry Card",
    "category": "cards",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Aceternity Bento Grid Telemetry Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bento_card",
    "code": "// Bento Grid Telemetry Card\nContainer(\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(\n    color: const Color(0xFF0F172A),\n    borderRadius: BorderRadius.circular(20),\n    border: Border.all(color: Colors.cyan.withOpacity(0.3)),\n  ),\n  child: Column(\n    crossAxisAlignment: CrossAxisAlignment.start,\n    children: const [\n      Icon(Icons.grid_view_rounded, color: Colors.cyan),\n      SizedBox(height: 12),\n      Text('Revenue Telemetry', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_cards_02",
    "title": "Modern Checkout Order Summary Card",
    "category": "cards",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Modern Checkout Order Summary Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// Modern Checkout Order Card\nContainer(\n  padding: const EdgeInsets.all(16),\n  decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(18)),\n  child: Column(\n    children: const [\n      Text('Total Payment', style: TextStyle(color: Colors.grey)),\n      Text('₹1,499.00', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_cards_03",
    "title": "Glassmorphism User Profile Hero Card",
    "category": "cards",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphism User Profile Hero Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// Glassmorphism Profile Hero Card\nClipRRect(\n  borderRadius: BorderRadius.circular(20),\n  child: BackdropFilter(\n    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),\n    child: Container(\n      padding: const EdgeInsets.all(20),\n      color: Colors.white.withOpacity(0.08),\n      child: const ListTile(\n        leading: CircleAvatar(child: Text('AR')),\n        title: Text('Alex Rivera', style: TextStyle(color: Colors.white)),\n        subtitle: Text('Senior Flutter Architect'),\n      ),\n    ),\n  ),\n)"
  },
  {
    "id": "comp_cards_04",
    "title": "Crypto Wallet Balance Card with Glow",
    "category": "cards",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Crypto Wallet Balance Card with Glow widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// Crypto Wallet Balance Card\nContainer(\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(\n    gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFFA855F7)]),\n    borderRadius: BorderRadius.circular(24),\n    boxShadow: [BoxShadow(color: Colors.indigo.withOpacity(0.4), blurRadius: 20)],\n  ),\n  child: Column(\n    crossAxisAlignment: CrossAxisAlignment.start,\n    children: const [\n      Text('Total Balance', style: TextStyle(color: Colors.white70)),\n      Text('3.482 ETH ($11,492.20)', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_cards_05",
    "title": "Interactive Flip Card with Back Details",
    "category": "cards",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Interactive Flip Card with Back Details widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Interactive Flip Card\nContainer(\n  height: 180,\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),\n  child: const Center(child: Text('Tap to Flip Card 🔄', style: TextStyle(color: Colors.white))),\n)"
  },
  {
    "id": "comp_cards_06",
    "title": "Ecommerce Product Showcase Card",
    "category": "cards",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Ecommerce Product Showcase Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// Ecommerce Product Showcase Card\nCard(\n  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),\n  child: Column(\n    children: [\n      Image.network('https://via.placeholder.com/200', height: 120, fit: BoxFit.cover),\n      const ListTile(title: Text('Flutter Tech T-Shirt'), trailing: Text('₹699')),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_cards_07",
    "title": "Subscription Plan Pricing Card",
    "category": "cards",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Subscription Plan Pricing Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Subscription Pricing Card\nContainer(\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(border: Border.all(color: Colors.cyan, width: 2), borderRadius: BorderRadius.circular(20)),\n  child: Column(\n    children: const [\n      Text('PRO PASS', style: TextStyle(color: Colors.cyan, fontWeight: FontWeight.bold)),\n      Text('₹29 / month', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_cards_08",
    "title": "Neumorphic Weather Widget Card",
    "category": "cards",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Neumorphic Weather Widget Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bento_card",
    "code": "// Neumorphic Weather Card\nContainer(\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(24)),\n  child: Row(\n    mainAxisAlignment: MainAxisAlignment.spaceBetween,\n    children: const [\n      Text('28°C Sunny', style: TextStyle(color: Colors.white, fontSize: 20)),\n      Icon(Icons.wb_sunny, color: Colors.amber, size: 36),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_cards_09",
    "title": "Credit Card 3D Tilt View Surface",
    "category": "cards",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Credit Card 3D Tilt View Surface widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// 3D Credit Card Surface\nContainer(\n  height: 180,\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(\n    gradient: const LinearGradient(colors: [Colors.purple, Colors.deepPurpleAccent]),\n    borderRadius: BorderRadius.circular(16),\n  ),\n  child: const Column(\n    mainAxisAlignment: MainAxisAlignment.spaceBetween,\n    crossAxisAlignment: CrossAxisAlignment.start,\n    children: [Text('PREMIUM CARD', style: TextStyle(color: Colors.white)), Text('**** **** **** 8829', style: TextStyle(color: Colors.white, fontSize: 18))],\n  ),\n)"
  },
  {
    "id": "comp_cards_10",
    "title": "Skeleton Loader Shimmer Card",
    "category": "cards",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Skeleton Loader Shimmer Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "shimmer_card",
    "code": "// Skeleton Shimmer Loading Placeholder\nContainer(\n  padding: const EdgeInsets.all(16),\n  child: Row(\n    children: [\n      Container(width: 44, height: 44, decoration: const BoxDecoration(color: Colors.grey, shape: BoxShape.circle)),\n      const SizedBox(width: 12),\n      Expanded(child: Container(height: 16, color: Colors.grey.shade800)),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_lists_01",
    "title": "Slidable ListTile with Archive & Delete Actions",
    "category": "lists",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Slidable ListTile with Archive & Delete Actions widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Slidable ListTile\nDismissible(\n  key: const Key('item_1'),\n  background: Container(color: Colors.green, child: const Icon(Icons.archive)),\n  secondaryBackground: Container(color: Colors.red, child: const Icon(Icons.delete)),\n  child: const ListTile(title: Text('Alex Rivera'), subtitle: Text('Swipe for actions')),\n)"
  },
  {
    "id": "comp_lists_02",
    "title": "User Avatar Contact ListTile",
    "category": "lists",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready User Avatar Contact ListTile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "avatar_preview",
    "code": "// User Avatar Contact ListTile\nListTile(\n  leading: const CircleAvatar(backgroundColor: Colors.cyan, child: Text('FH')),\n  title: const Text('FlutterHub Team', style: TextStyle(color: Colors.white)),\n  subtitle: const Text('Online now'),\n  trailing: const Icon(Icons.chevron_right, color: Colors.grey),\n)"
  },
  {
    "id": "comp_lists_03",
    "title": "Settings Toggle ListTile with Switch",
    "category": "lists",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Settings Toggle ListTile with Switch widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Settings Toggle ListTile\nSwitchListTile(\n  title: const Text('Push Notifications', style: TextStyle(color: Colors.white)),\n  subtitle: const Text('Receive instant widget release alerts'),\n  value: true,\n  onChanged: (val) {},\n)"
  },
  {
    "id": "comp_lists_04",
    "title": "Transaction History ListTile with Status Badge",
    "category": "lists",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Transaction History ListTile with Status Badge widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Transaction History ListTile\nListTile(\n  leading: const Icon(Icons.arrow_downward, color: Colors.green),\n  title: const Text('Payment Received'),\n  subtitle: const Text('Aug 04, 2026'),\n  trailing: const Text('+ ₹1,499.00', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),\n)"
  },
  {
    "id": "comp_lists_05",
    "title": "Notification Message ListTile with Unread Badge",
    "category": "lists",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Notification Message ListTile with Unread Badge widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Notification ListTile with Badge\nListTile(\n  leading: const Icon(Icons.notifications_active, color: Colors.amber),\n  title: const Text('New Flutter 3.24 Released'),\n  trailing: Container(padding: const EdgeInsets.all(6), decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle), child: const Text('1')),\n)"
  },
  {
    "id": "comp_lists_06",
    "title": "Reorderable Drag & Drop ListTile",
    "category": "lists",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Reorderable Drag & Drop ListTile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Reorderable ListView Tile\nReorderableListView(\n  children: [\n    ListTile(key: const Key('1'), title: const Text('Item 1'), trailing: const Icon(Icons.drag_handle)),\n    ListTile(key: const Key('2'), title: const Text('Item 2'), trailing: const Icon(Icons.drag_handle)),\n  ],\n  onReorder: (oldIndex, newIndex) {},\n)"
  },
  {
    "id": "comp_lists_07",
    "title": "Expandable Multi-Level Tree ListTile",
    "category": "lists",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Expandable Multi-Level Tree ListTile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Multi-Level Expansion Tile\nExpansionTile(\n  title: const Text('Documentation Tree'),\n  children: const [\n    ListTile(title: Text('Widget Basics')),\n    ListTile(title: Text('State Management')),\n  ],\n)"
  },
  {
    "id": "comp_lists_08",
    "title": "Audio Playlist Song Item",
    "category": "lists",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Audio Playlist Song Item widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "voice_memo",
    "code": "// Audio Playlist Song Item\nListTile(\n  leading: const Icon(Icons.music_note, color: Colors.purple),\n  title: const Text('Midnight Synthwave'),\n  subtitle: const Text('3:45 min'),\n  trailing: IconButton(icon: const Icon(Icons.play_arrow), onPressed: () {}),\n)"
  },
  {
    "id": "comp_lists_09",
    "title": "Radio Option Selection ListTile",
    "category": "lists",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Radio Option Selection ListTile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Radio Selection ListTile\nRadioListTile<String>(\n  title: const Text('Razorpay UPI Instant Payment'),\n  value: 'upi',\n  groupValue: 'upi',\n  onChanged: (val) {},\n)"
  },
  {
    "id": "comp_lists_10",
    "title": "Checkbox Task List Item",
    "category": "lists",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Checkbox Task List Item widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Checkbox Task List Item\nCheckboxListTile(\n  title: const Text('Complete Flutter UI Inspection'),\n  value: true,\n  onChanged: (val) {},\n)"
  },
  {
    "id": "comp_dialogs_01",
    "title": "Glassmorphism Blur Confirmation Dialog",
    "category": "dialogs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphism Blur Confirmation Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Glassmorphism Blur Dialog\nAlertDialog(\n  backgroundColor: const Color(0xFF1E293B),\n  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),\n  title: const Text('Glassmorphism Alert', style: TextStyle(color: Colors.white)),\n  content: const Text('Are you sure you want to proceed?'),\n  actions: [\n    TextButton(onPressed: () {}, child: const Text('Cancel')),\n    ElevatedButton(onPressed: () {}, child: const Text('Confirm')),\n  ],\n)"
  },
  {
    "id": "comp_dialogs_02",
    "title": "Success Celebration Modal Dialog",
    "category": "dialogs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Success Celebration Modal Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Success Celebration Modal\nDialog(\n  child: Padding(\n    padding: const EdgeInsets.all(24),\n    child: Column(\n      mainAxisSize: MainAxisSize.min,\n      children: [\n        const Icon(Icons.check_circle, color: Colors.green, size: 60),\n        const SizedBox(height: 12),\n        const Text('Payment Successful!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),\n      ],\n    ),\n  ),\n)"
  },
  {
    "id": "comp_dialogs_03",
    "title": "Warning Action Alert Modal",
    "category": "dialogs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Warning Action Alert Modal widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Warning Action Modal\nAlertDialog(\n  title: const Row(children: [Icon(Icons.warning, color: Colors.red), SizedBox(width: 8), Text('Warning')]),\n  content: const Text('This action cannot be undone.'),\n)"
  },
  {
    "id": "comp_dialogs_04",
    "title": "Premium Pro Subscription Upgrade Dialog",
    "category": "dialogs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Premium Pro Subscription Upgrade Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Pro Upgrade Dialog\nDialog(\n  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),\n  child: Padding(\n    padding: const EdgeInsets.all(24),\n    child: Column(\n      mainAxisSize: MainAxisSize.min,\n      children: [\n        const Text('Unlock Pro Pass ₹29/mo', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),\n        ElevatedButton(onPressed: () {}, child: const Text('Subscribe Now')),\n      ],\n    ),\n  ),\n)"
  },
  {
    "id": "comp_dialogs_05",
    "title": "Rating & Review Feedback Dialog",
    "category": "dialogs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Rating & Review Feedback Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Rating & Feedback Dialog\nAlertDialog(\n  title: const Text('Rate FlutterHub'),\n  content: Row(children: List.generate(5, (i) => const Icon(Icons.star, color: Colors.amber))),\n)"
  },
  {
    "id": "comp_dialogs_06",
    "title": "iOS Cupertino Styled Alert Dialog",
    "category": "dialogs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Cupertino Styled Alert Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "cupertino_sheet",
    "code": "// Cupertino Alert Dialog\nCupertinoAlertDialog(\n  title: const Text('iOS Dialog'),\n  content: const Text('Allow permissions?'),\n  actions: [CupertinoDialogAction(child: const Text('Cancel')), CupertinoDialogAction(child: const Text('Allow'))],\n)"
  },
  {
    "id": "comp_dialogs_07",
    "title": "Custom Image Header Banner Dialog",
    "category": "dialogs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Custom Image Header Banner Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Image Banner Dialog\nDialog(\n  child: Column(\n    mainAxisSize: MainAxisSize.min,\n    children: [\n      Image.network('https://via.placeholder.com/300x120', fit: BoxFit.cover),\n      const Padding(padding: EdgeInsets.all(16), child: Text('Special Offer Available!')),\n    ],\n  ),\n)"
  },
  {
    "id": "comp_dialogs_08",
    "title": "Multi-Step Wizard Modal Dialog",
    "category": "dialogs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Multi-Step Wizard Modal Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Multi-Step Wizard Dialog\nAlertDialog(\n  title: const Text('Step 1 of 3: Profile Setup'),\n  content: const TextField(decoration: InputDecoration(hintText: 'Enter Full Name')),\n)"
  },
  {
    "id": "comp_dialogs_09",
    "title": "Fullscreen Interactive Dialog",
    "category": "dialogs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Fullscreen Interactive Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Fullscreen Dialog\nDialog.fullscreen(\n  child: Scaffold(\n    appBar: AppBar(title: const Text('Edit Profile'), leading: const CloseButton()),\n    body: const Center(child: Text('Fullscreen form details')),\n  ),\n)"
  },
  {
    "id": "comp_dialogs_10",
    "title": "Password Reset Prompt Dialog",
    "category": "dialogs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Password Reset Prompt Dialog widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Password Reset Prompt Dialog\nAlertDialog(\n  title: const Text('Reset Password'),\n  content: const TextField(decoration: InputDecoration(labelText: 'Email Address')),\n)"
  },
  {
    "id": "comp_bottom_sheets_01",
    "title": "Glassmorphism Payment Selector Bottom Sheet",
    "category": "bottom_sheets",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphism Payment Selector Bottom Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bottom_sheet_preview",
    "code": "// Glassmorphism Payment BottomSheet\nshowModalBottomSheet(\n  context: context,\n  backgroundColor: const Color(0xFF0F172A),\n  shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),\n  builder: (context) => Container(padding: const EdgeInsets.all(24), child: const Text('Select Payment Option')),\n);"
  },
  {
    "id": "comp_bottom_sheets_02",
    "title": "Share Social Media Options Bottom Sheet",
    "category": "bottom_sheets",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Share Social Media Options Bottom Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bottom_sheet_preview",
    "code": "// Share Social Bottom Sheet\nshowModalBottomSheet(\n  context: context,\n  builder: (context) => Row(\n    mainAxisAlignment: MainAxisAlignment.spaceEvenly,\n    children: const [Icon(Icons.share), Icon(Icons.copy), Icon(Icons.email)],\n  ),\n);"
  },
  {
    "id": "comp_bottom_sheets_03",
    "title": "Filter & Sort Options Draggable Bottom Sheet",
    "category": "bottom_sheets",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Filter & Sort Options Draggable Bottom Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bottom_sheet_preview",
    "code": "// Draggable Scrollable BottomSheet\nDraggableScrollableSheet(\n  builder: (context, controller) => Container(\n    color: Colors.slate,\n    child: ListView(controller: controller, children: const [Text('Filter Options')]),\n  ),\n);"
  },
  {
    "id": "comp_bottom_sheets_04",
    "title": "User Profile Quick Settings Sheet",
    "category": "bottom_sheets",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready User Profile Quick Settings Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bottom_sheet_preview",
    "code": "// Profile Quick Settings Sheet\nshowModalBottomSheet(\n  context: context,\n  builder: (context) => Column(\n    mainAxisSize: MainAxisSize.min,\n    children: const [ListTile(title: Text('Edit Profile')), ListTile(title: Text('Log Out'))],\n  ),\n);"
  },
  {
    "id": "comp_bottom_sheets_05",
    "title": "Audio Music Player Expanded Sheet",
    "category": "bottom_sheets",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Audio Music Player Expanded Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "voice_memo",
    "code": "// Music Player Expanded Sheet\nshowModalBottomSheet(\n  context: context,\n  isScrollControlled: true,\n  builder: (context) => SizedBox(height: 500, child: const Center(child: Text('Expanded Player'))),\n);"
  },
  {
    "id": "comp_bottom_sheets_06",
    "title": "Location Map Address Picker Sheet",
    "category": "bottom_sheets",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Location Map Address Picker Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bottom_sheet_preview",
    "code": "// Address Picker Sheet\nshowModalBottomSheet(\n  context: context,\n  builder: (context) => Container(padding: const EdgeInsets.all(20), child: const Text('Confirm Delivery Address')),\n);"
  },
  {
    "id": "comp_bottom_sheets_07",
    "title": "Comment Section Interactive Sheet",
    "category": "bottom_sheets",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Comment Section Interactive Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bottom_sheet_preview",
    "code": "// Comments Section Sheet\nshowModalBottomSheet(\n  context: context,\n  builder: (context) => Column(children: const [Expanded(child: Text('User Comments List'))]),\n);"
  },
  {
    "id": "comp_bottom_sheets_08",
    "title": "Shopping Cart Quick Drawer Sheet",
    "category": "bottom_sheets",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Shopping Cart Quick Drawer Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// Quick Cart Bottom Sheet\nshowModalBottomSheet(\n  context: context,\n  builder: (context) => ListTile(title: const Text('Total: ₹1,499'), trailing: ElevatedButton(onPressed: () {}, child: const Text('Checkout'))),\n);"
  },
  {
    "id": "comp_bottom_sheets_09",
    "title": "iOS Cupertino Modal Action Sheet",
    "category": "bottom_sheets",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready iOS Cupertino Modal Action Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "cupertino_sheet",
    "code": "// Cupertino Action Sheet\nshowCupertinoModalPopup(\n  context: context,\n  builder: (context) => CupertinoActionSheet(\n    title: const Text('Select Option'),\n    actions: [CupertinoActionSheetAction(onPressed: () {}, child: const Text('Option A'))],\n  ),\n);"
  },
  {
    "id": "comp_bottom_sheets_10",
    "title": "Persistent Docked Bottom Sheet",
    "category": "bottom_sheets",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Persistent Docked Bottom Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bottom_sheet_preview",
    "code": "// Persistent Docked Bottom Sheet\nScaffold(\n  bottomSheet: Container(height: 60, color: Colors.blue, child: const Center(child: Text('Docked Footer'))),\n);"
  },
  {
    "id": "comp_snackbars_01",
    "title": "Success Animated Glass Toast SnackBar",
    "category": "snackbars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Success Animated Glass Toast SnackBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Success Glass SnackBar\nScaffoldMessenger.of(context).showSnackBar(\n  SnackBar(\n    content: const Text('✓ Code copied to clipboard!'),\n    backgroundColor: Colors.green,\n    behavior: SnackBarBehavior.floating,\n    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),\n  ),\n);"
  },
  {
    "id": "comp_snackbars_02",
    "title": "Error Warning Floating Toast Alert",
    "category": "snackbars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Error Warning Floating Toast Alert widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Error Floating Toast\nScaffoldMessenger.of(context).showSnackBar(\n  SnackBar(content: const Text('⚠️ Connection Timeout'), backgroundColor: Colors.red),\n);"
  },
  {
    "id": "comp_snackbars_03",
    "title": "Undo Action Interactive SnackBar",
    "category": "snackbars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Undo Action Interactive SnackBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Undo Action SnackBar\nScaffoldMessenger.of(context).showSnackBar(\n  SnackBar(\n    content: const Text('Item archived'),\n    action: SnackBarAction(label: 'UNDO', onPressed: () {}),\n  ),\n);"
  },
  {
    "id": "comp_snackbars_04",
    "title": "Custom Icon Avatar Toast Notification",
    "category": "snackbars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Custom Icon Avatar Toast Notification widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Avatar Toast Banner\nScaffoldMessenger.of(context).showSnackBar(\n  SnackBar(content: Row(children: const [CircleAvatar(child: Text('A')), SizedBox(width: 8), Text('Alex sent a message')])),\n);"
  },
  {
    "id": "comp_snackbars_05",
    "title": "Network Connection Restored Banner",
    "category": "snackbars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Network Connection Restored Banner widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Network Banner Toast\nScaffoldMessenger.of(context).showSnackBar(\n  const SnackBar(content: Text('⚡ Online: Sync Completed'), backgroundColor: Colors.blue),\n);"
  },
  {
    "id": "comp_snackbars_06",
    "title": "Top Floating Banner Notification",
    "category": "snackbars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Top Floating Banner Notification widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Top Floating Banner Toast\nMaterialBanner(\n  content: const Text('New update available!'),\n  actions: [TextButton(onPressed: () {}, child: const Text('UPDATE'))],\n);"
  },
  {
    "id": "comp_snackbars_07",
    "title": "Progress Bar Loading SnackBar",
    "category": "snackbars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Progress Bar Loading SnackBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Progress Loading SnackBar\nSnackBar(content: Row(children: const [CircularProgressIndicator(), SizedBox(width: 12), Text('Uploading file...')]));"
  },
  {
    "id": "comp_snackbars_08",
    "title": "Dark Neumorphic Pill Toast",
    "category": "snackbars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Dark Neumorphic Pill Toast widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Neumorphic Pill Toast\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(20)),\n  child: const Text('Notification Pill', style: TextStyle(color: Colors.white)),\n);"
  },
  {
    "id": "comp_snackbars_09",
    "title": "Multi-Line Action Message SnackBar",
    "category": "snackbars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Multi-Line Action Message SnackBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// Multi-Line SnackBar\nSnackBar(content: const Text('Detailed multi-line error log saved to storage.'), duration: Duration(seconds: 4));"
  },
  {
    "id": "comp_snackbars_10",
    "title": "iOS Style Capsule Notification",
    "category": "snackbars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Style Capsule Notification widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "snackbar_preview",
    "code": "// iOS Capsule Toast\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),\n  decoration: BoxDecoration(color: Colors.black, borderRadius: BorderRadius.circular(30)),\n  child: const Text('AirPods Connected 🎧', style: TextStyle(color: Colors.white)),\n);"
  },
  {
    "id": "comp_appbar_01",
    "title": "Collapsing Parallax SliverAppBar",
    "category": "appbar",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Collapsing Parallax SliverAppBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "sliver_appbar",
    "code": "// Collapsing Parallax SliverAppBar\nCustomScrollView(\n  slivers: [\n    SliverAppBar(\n      expandedHeight: 200,\n      pinned: true,\n      flexibleSpace: FlexibleSpaceBar(title: Text('Collapsing Header'), background: Image.network('https://via.placeholder.com/400')),\n    ),\n  ],\n);"
  },
  {
    "id": "comp_appbar_02",
    "title": "Glassmorphism Search Bar Header",
    "category": "appbar",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Glassmorphism Search Bar Header widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "search_input",
    "code": "// Glassmorphism Search Header\nAppBar(\n  backgroundColor: Colors.transparent,\n  title: Container(padding: const EdgeInsets.all(8), child: const TextField(decoration: InputDecoration(hintText: 'Search...'))),\n);"
  },
  {
    "id": "comp_appbar_03",
    "title": "Tabbed Segmented Header Bar",
    "category": "appbar",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Tabbed Segmented Header Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Tabbed Header Bar\nAppBar(\n  title: const Text('Dashboard'),\n  bottom: const TabBar(tabs: [Tab(text: 'Overview'), Tab(text: 'Analytics')]),\n);"
  },
  {
    "id": "comp_appbar_04",
    "title": "Floating Action Header Bar",
    "category": "appbar",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Floating Action Header Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dock_menu",
    "code": "// Floating Header Bar\nContainer(\n  margin: const EdgeInsets.all(16),\n  padding: const EdgeInsets.all(12),\n  decoration: BoxDecoration(color: Colors.slate, borderRadius: BorderRadius.circular(16)),\n  child: const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Icon(Icons.menu), Text('Header')]),\n);"
  },
  {
    "id": "comp_appbar_05",
    "title": "User Profile Hero Header Bar",
    "category": "appbar",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready User Profile Hero Header Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "avatar_preview",
    "code": "// Profile Hero Header Bar\nSliverPersistentHeader(\n  delegate: MyHeaderDelegate(),\n);"
  },
  {
    "id": "comp_appbar_06",
    "title": "Custom Gradient Extended Title Bar",
    "category": "appbar",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Custom Gradient Extended Title Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "sliver_appbar",
    "code": "// Gradient Title Bar\nAppBar(\n  flexibleSpace: Container(decoration: const BoxDecoration(gradient: LinearGradient(colors: [Colors.blue, Colors.purple]))),\n  title: const Text('Gradient AppBar'),\n);"
  },
  {
    "id": "comp_appbar_07",
    "title": "Back Button & Action Menu Header",
    "category": "appbar",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Back Button & Action Menu Header widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "sliver_appbar",
    "code": "// Standard Navigation Header\nAppBar(\n  leading: const BackButton(),\n  title: const Text('Settings'),\n  actions: [IconButton(icon: const Icon(Icons.more_vert), onPressed: () {})],\n);"
  },
  {
    "id": "comp_appbar_08",
    "title": "Searchable Expandable Sliver Header",
    "category": "appbar",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Searchable Expandable Sliver Header widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "search_input",
    "code": "// Searchable Sliver Header\nSliverAppBar(\n  floating: true,\n  title: const Text('Search Repository'),\n);"
  },
  {
    "id": "comp_appbar_09",
    "title": "Cupertino Navigation Bar Header",
    "category": "appbar",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Cupertino Navigation Bar Header widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "sliver_appbar",
    "code": "// Cupertino Navigation Bar\nCupertinoNavigationBar(\n  middle: const Text('iOS Title'),\n  trailing: CupertinoButton(child: const Icon(Icons.add), onPressed: () {}),\n);"
  },
  {
    "id": "comp_appbar_10",
    "title": "Centered Brand Logo Header Bar",
    "category": "appbar",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Centered Brand Logo Header Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "sliver_appbar",
    "code": "// Centered Logo Header\nAppBar(\n  centerTitle: true,\n  title: const FlutterLogo(size: 32),\n);"
  },
  {
    "id": "comp_nav_bars_01",
    "title": "Salomon Animated Bottom Navigation Bar",
    "category": "nav_bars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Salomon Animated Bottom Navigation Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "nav_bar_preview",
    "code": "// Salomon Animated Bottom Nav\nBottomNavigationBar(\n  currentIndex: 0,\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),\n    BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),\n    BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),\n  ],\n);"
  },
  {
    "id": "comp_nav_bars_02",
    "title": "Mac OS Floating Glass Dock Bar",
    "category": "nav_bars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Mac OS Floating Glass Dock Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dock_menu",
    "code": "// Mac OS Glass Dock Bar\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),\n  decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(30)),\n  child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.apps), Icon(Icons.folder)]),\n);"
  },
  {
    "id": "comp_nav_bars_03",
    "title": "Curved Notch FAB Bottom Navigation Bar",
    "category": "nav_bars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Curved Notch FAB Bottom Navigation Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "nav_bar_preview",
    "code": "// Curved Notch FAB Navigation Bar\nBottomAppBar(\n  shape: const CircularNotchedRectangle(),\n  notchMargin: 8,\n  child: Row(children: const [IconButton(icon: Icon(Icons.menu), onPressed: null)]),\n);"
  },
  {
    "id": "comp_nav_bars_04",
    "title": "Minimalist Icon-Only Indicator Bar",
    "category": "nav_bars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Minimalist Icon-Only Indicator Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "nav_bar_preview",
    "code": "// Icon Only Navigation Bar\nRow(\n  mainAxisAlignment: MainAxisAlignment.spaceAround,\n  children: const [Icon(Icons.home_filled), Icon(Icons.explore), Icon(Icons.bookmark)],\n);"
  },
  {
    "id": "comp_nav_bars_05",
    "title": "Glassmorphic Capsule Navigation Dock",
    "category": "nav_bars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphic Capsule Navigation Dock widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dock_menu",
    "code": "// Glass Capsule Navigation Dock\nContainer(\n  padding: const EdgeInsets.all(12),\n  decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(40)),\n  child: const Row(children: [Icon(Icons.explore)]),\n);"
  },
  {
    "id": "comp_nav_bars_06",
    "title": "Labeled Active Pill Navigation Bar",
    "category": "nav_bars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Labeled Active Pill Navigation Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "nav_bar_preview",
    "code": "// Labeled Pill Navigation\nContainer(\n  padding: const EdgeInsets.all(8),\n  child: const Row(children: [Text('Home', style: TextStyle(color: Colors.cyan))]),\n);"
  },
  {
    "id": "comp_nav_bars_07",
    "title": "Sliding Indicator Segmented Dock",
    "category": "nav_bars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Sliding Indicator Segmented Dock widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Segmented Dock Bar\nTabBar(tabs: const [Tab(text: 'Nav 1'), Tab(text: 'Nav 2')]);"
  },
  {
    "id": "comp_nav_bars_08",
    "title": "iOS Cupertino Tab Bar Navigation",
    "category": "nav_bars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Cupertino Tab Bar Navigation widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "nav_bar_preview",
    "code": "// Cupertino TabBar Navigation\nCupertinoTabBar(\n  items: const [BottomNavigationBarItem(icon: Icon(CupertinoIcons.home), label: 'Home')],\n);"
  },
  {
    "id": "comp_nav_bars_09",
    "title": "Badge Counter Navigation Bar",
    "category": "nav_bars",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Badge Counter Navigation Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "nav_bar_preview",
    "code": "// Badge Counter Navigation\nBottomNavigationBarItem(\n  icon: Badge(label: Text('3'), child: Icon(Icons.mail)),\n  label: 'Inbox',\n);"
  },
  {
    "id": "comp_nav_bars_10",
    "title": "Neumorphic Inset Navigation Dock",
    "category": "nav_bars",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Neumorphic Inset Navigation Dock widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dock_menu",
    "code": "// Neumorphic Inset Dock\nContainer(\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(20)),\n  child: const Row(children: [Icon(Icons.settings)]),\n);"
  },
  {
    "id": "comp_drawers_01",
    "title": "Glassmorphism Sliding Navigation Drawer",
    "category": "drawers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphism Sliding Navigation Drawer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// Glassmorphism Navigation Drawer\nDrawer(\n  backgroundColor: const Color(0xFF0F172A).withOpacity(0.9),\n  child: ListView(\n    children: const [\n      DrawerHeader(child: Text('UserProfile')),\n      ListTile(title: Text('Dashboard')),\n    ],\n  ),\n);"
  },
  {
    "id": "comp_drawers_02",
    "title": "User Profile Extended Side Drawer",
    "category": "drawers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready User Profile Extended Side Drawer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// Extended Profile Drawer\nDrawer(\n  child: Column(\n    children: const [\n      UserAccountsDrawerHeader(accountName: Text('Alex Rivera'), accountEmail: Text('dev@flutterhub.dev')),\n      ListTile(title: Text('Account Settings')),\n    ],\n  ),\n);"
  },
  {
    "id": "comp_drawers_03",
    "title": "Collapsible Mini Sidebar Drawer",
    "category": "drawers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Collapsible Mini Sidebar Drawer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// Mini Sidebar Drawer\nNavigationRail(\n  destinations: const [\n    NavigationRailDestination(icon: Icon(Icons.home), label: Text('Home')),\n  ],\n  selectedIndex: 0,\n);"
  },
  {
    "id": "comp_drawers_04",
    "title": "Dual Column Navigation Sidebar",
    "category": "drawers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Dual Column Navigation Sidebar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// Dual Column Navigation\nRow(\n  children: [\n    NavigationRail(destinations: const [NavigationRailDestination(icon: Icon(Icons.settings), label: Text('Settings'))], selectedIndex: 0),\n    const VerticalDivider(),\n  ],\n);"
  },
  {
    "id": "comp_drawers_05",
    "title": "Dark Neumorphic Menu Drawer",
    "category": "drawers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Dark Neumorphic Menu Drawer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// Dark Neumorphic Drawer\nContainer(\n  width: 250,\n  color: const Color(0xFF1E293B),\n  child: const Column(children: [ListTile(title: Text('Dark Theme'))]),\n);"
  },
  {
    "id": "comp_drawers_06",
    "title": "Right-Side End Drawer Modal",
    "category": "drawers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Right-Side End Drawer Modal widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// End Drawer Component\nScaffold(\n  endDrawer: Drawer(child: const Center(child: Text('Right End Drawer'))),\n);"
  },
  {
    "id": "comp_drawers_07",
    "title": "Rounded Floating Island Drawer",
    "category": "drawers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Rounded Floating Island Drawer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// Floating Island Drawer\nContainer(\n  margin: const EdgeInsets.all(16),\n  decoration: BoxDecoration(borderRadius: BorderRadius.circular(24), color: Colors.slate),\n  child: const Drawer(),\n);"
  },
  {
    "id": "comp_drawers_08",
    "title": "Category Filter Drawer Menu",
    "category": "drawers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Category Filter Drawer Menu widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Category Filter Drawer\nDrawer(\n  child: Column(children: const [Text('Filter Categories'), Chip(label: Text('Widgets'))]),\n);"
  },
  {
    "id": "comp_drawers_09",
    "title": "Multi-Level Tree Menu Drawer",
    "category": "drawers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Multi-Level Tree Menu Drawer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Multi-Level Tree Drawer\nDrawer(\n  child: ListView(children: const [ExpansionTile(title: Text('Components'))]),\n);"
  },
  {
    "id": "comp_drawers_10",
    "title": "iOS Style Modal Side Drawer",
    "category": "drawers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Style Modal Side Drawer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "drawer_preview",
    "code": "// iOS Style Side Drawer\nCupertinoPageScaffold(\n  child: const Center(child: Text('iOS Side Menu')),\n);"
  },
  {
    "id": "comp_tabs_01",
    "title": "Animated Rounded Segmented Control TabBar",
    "category": "tabs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Animated Rounded Segmented Control TabBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Segmented Control TabBar\nContainer(\n  padding: const EdgeInsets.all(4),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),\n  child: TabBar(\n    indicator: BoxDecoration(color: Colors.cyan, borderRadius: BorderRadius.circular(12)),\n    tabs: const [Tab(text: 'Overview'), Tab(text: 'Analytics')],\n  ),\n);"
  },
  {
    "id": "comp_tabs_02",
    "title": "Underline Glow Indicator TabBar",
    "category": "tabs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Underline Glow Indicator TabBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Underline Glow TabBar\nTabBar(\n  indicatorColor: Colors.cyan,\n  indicatorWeight: 4,\n  tabs: const [Tab(text: 'Tab 1'), Tab(text: 'Tab 2')],\n);"
  },
  {
    "id": "comp_tabs_03",
    "title": "Icon & Badge Counter TabBar",
    "category": "tabs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Icon & Badge Counter TabBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Icon Badge TabBar\nTabBar(\n  tabs: const [\n    Tab(icon: Badge(label: Text('5'), child: Icon(Icons.mail)), text: 'Messages'),\n  ],\n);"
  },
  {
    "id": "comp_tabs_04",
    "title": "Glass Capsule Pill Tab Selector",
    "category": "tabs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Glass Capsule Pill Tab Selector widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Glass Capsule Tab Selector\nContainer(\n  decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(30)),\n  child: const TabBar(tabs: [Tab(text: 'Capsule 1')]),\n);"
  },
  {
    "id": "comp_tabs_05",
    "title": "Vertical Sidebar Tab Bar Navigation",
    "category": "tabs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Vertical Sidebar Tab Bar Navigation widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Vertical Tab Bar\nRotatedBox(\n  quarterTurns: 1,\n  child: const TabBar(tabs: [Tab(text: 'Vertical 1')]),\n);"
  },
  {
    "id": "comp_tabs_06",
    "title": "Scrollable Multi-Category TabBar",
    "category": "tabs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Scrollable Multi-Category TabBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Scrollable Multi-Category TabBar\nTabBar(\n  isScrollable: true,\n  tabs: const [Tab(text: 'All'), Tab(text: 'Buttons'), Tab(text: 'Forms'), Tab(text: 'Cards')],\n);"
  },
  {
    "id": "comp_tabs_07",
    "title": "Neumorphic Press Tab Controller",
    "category": "tabs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Press Tab Controller widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Neumorphic Tab Controller\nContainer(\n  color: const Color(0xFF1E293B),\n  child: const TabBar(tabs: [Tab(text: 'Neumorphic')]),\n);"
  },
  {
    "id": "comp_tabs_08",
    "title": "Cupertino Segmented Control Tabs",
    "category": "tabs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Cupertino Segmented Control Tabs widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Cupertino Segmented Control\nCupertinoSegmentedControl<int>(\n  children: const {0: Text('First'), 1: Text('Second')},\n  onValueChanged: (val) {},\n);"
  },
  {
    "id": "comp_tabs_09",
    "title": "Gradient Active Background TabBar",
    "category": "tabs",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Gradient Active Background TabBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Gradient Active TabBar\nContainer(\n  decoration: const BoxDecoration(gradient: LinearGradient(colors: [Colors.purple, Colors.indigo])),\n  child: const TabBar(tabs: [Tab(text: 'Gradient Tab')]),\n);"
  },
  {
    "id": "comp_tabs_10",
    "title": "Floating Top Island TabBar",
    "category": "tabs",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Floating Top Island TabBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Floating Top Island TabBar\nContainer(\n  margin: const EdgeInsets.all(12),\n  decoration: BoxDecoration(color: Colors.slate, borderRadius: BorderRadius.circular(20)),\n  child: const TabBar(tabs: [Tab(text: 'Island 1')]),\n);"
  },
  {
    "id": "comp_dropdowns_01",
    "title": "Searchable Glass Dropdown Select Menu",
    "category": "dropdowns",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Searchable Glass Dropdown Select Menu widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Glass Dropdown Select Menu\nDropdownButton<String>(\n  value: 'Riverpod 2.x',\n  dropdownColor: const Color(0xFF0F172A),\n  items: ['Riverpod 2.x', 'BLoC 8.x', 'Provider'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_dropdowns_02",
    "title": "Multi-Select Checkbox Dropdown",
    "category": "dropdowns",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Multi-Select Checkbox Dropdown widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Multi-Select Dropdown Menu\nPopupMenuButton<String>(\n  itemBuilder: (context) => [\n    const PopupMenuItem(child: CheckboxListTile(title: Text('Option 1'), value: true, onChanged: null)),\n  ],\n);"
  },
  {
    "id": "comp_dropdowns_03",
    "title": "Contextual Right-Click Popup Menu",
    "category": "dropdowns",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Contextual Right-Click Popup Menu widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Contextual Popup Menu\nPopupMenuButton<String>(\n  icon: const Icon(Icons.more_vert),\n  itemBuilder: (context) => const [PopupMenuItem(value: 'edit', child: Text('Edit'))],\n);"
  },
  {
    "id": "comp_dropdowns_04",
    "title": "User Account Switcher Dropdown",
    "category": "dropdowns",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready User Account Switcher Dropdown widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "avatar_preview",
    "code": "// Account Switcher Dropdown\nDropdownButton<String>(\n  hint: const Text('Switch Account'),\n  items: const [DropdownMenuItem(value: 'user1', child: Text('dev@flutterhub.dev'))],\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_dropdowns_05",
    "title": "Country Phone Code Picker Dropdown",
    "category": "dropdowns",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Country Phone Code Picker Dropdown widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Country Code Picker Dropdown\nDropdownButton<String>(\n  value: '+91',\n  items: const [DropdownMenuItem(value: '+91', child: Text('+91 🇮🇳 India'))],\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_dropdowns_06",
    "title": "Filter Tag Dropdown Menu",
    "category": "dropdowns",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Filter Tag Dropdown Menu widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Filter Tag Dropdown\nDropdownButton<String>(\n  hint: const Text('Filter by Tag'),\n  items: const [DropdownMenuItem(value: 'pro', child: Text('PRO Components'))],\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_dropdowns_07",
    "title": "Neumorphic Select Options Dropdown",
    "category": "dropdowns",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Select Options Dropdown widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Neumorphic Dropdown\nContainer(\n  padding: const EdgeInsets.all(12),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(12)),\n  child: const DropdownButtonHideUnderline(child: Text('Neumorphic Select')),\n);"
  },
  {
    "id": "comp_dropdowns_08",
    "title": "Cascading Sub-Menu Dropdown",
    "category": "dropdowns",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Cascading Sub-Menu Dropdown widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Cascading Sub-Menu Dropdown\nSubmenuButton(\n  menuChildren: const [MenuItemButton(child: Text('Sub Item 1'))],\n  child: const Text('File Menu'),\n);"
  },
  {
    "id": "comp_dropdowns_09",
    "title": "iOS Cupertino Picker Wheel Dropdown",
    "category": "dropdowns",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready iOS Cupertino Picker Wheel Dropdown widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Cupertino Picker Wheel\nCupertinoPicker(\n  itemExtent: 32,\n  onSelectedItemChanged: (index) {},\n  children: const [Text('Item 1'), Text('Item 2')],\n);"
  },
  {
    "id": "comp_dropdowns_10",
    "title": "Icon Header Dropdown Select",
    "category": "dropdowns",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Icon Header Dropdown Select widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dropdown_preview",
    "code": "// Icon Header Dropdown Select\nDropdownButtonFormField<String>(\n  decoration: const InputDecoration(prefixIcon: Icon(Icons.category)),\n  items: const [DropdownMenuItem(value: 'cat1', child: Text('Category 1'))],\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_checkboxes_01",
    "title": "Neumorphic Glowing Toggle Switch",
    "category": "checkboxes",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Glowing Toggle Switch widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Neumorphic Glowing Toggle Switch\nSwitch(\n  value: true,\n  activeColor: Colors.green,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_checkboxes_02",
    "title": "Custom Animated Checkbox Tile",
    "category": "checkboxes",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Custom Animated Checkbox Tile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Animated Checkbox Tile\nCheckboxListTile(\n  title: const Text('Enable Impeller Engine'),\n  value: true,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_checkboxes_03",
    "title": "Dark/Light Theme Switch Toggle",
    "category": "checkboxes",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Dark/Light Theme Switch Toggle widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Theme Switch Toggle\nIconButton(\n  icon: const Icon(Icons.dark_mode, color: Colors.amber),\n  onPressed: () {},\n);"
  },
  {
    "id": "comp_checkboxes_04",
    "title": "Multi-State Tri-State Checkbox",
    "category": "checkboxes",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Multi-State Tri-State Checkbox widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Tri-State Checkbox\nCheckbox(\n  tristate: true,\n  value: null,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_checkboxes_05",
    "title": "iOS Cupertino Style Toggle Switch",
    "category": "checkboxes",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready iOS Cupertino Style Toggle Switch widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Cupertino Switch Toggle\nCupertinoSwitch(\n  value: true,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_checkboxes_06",
    "title": "Icon-Inside Custom Switch Toggle",
    "category": "checkboxes",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Icon-Inside Custom Switch Toggle widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Icon Switch Toggle\nSwitch(\n  thumbIcon: WidgetStateProperty.all(const Icon(Icons.check)),\n  value: true,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_checkboxes_07",
    "title": "Rounded Checkbox Group Selection",
    "category": "checkboxes",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Rounded Checkbox Group Selection widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Rounded Checkbox Group\nRow(\n  children: [\n    Checkbox(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)), value: true, onChanged: (v) {}),\n    const Text('Remember Choice'),\n  ],\n);"
  },
  {
    "id": "comp_checkboxes_08",
    "title": "Notification Toggles List Tile",
    "category": "checkboxes",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Notification Toggles List Tile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Notification Switch Tile\nSwitchListTile(\n  title: const Text('Email Notifications'),\n  value: false,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_checkboxes_09",
    "title": "Gradient Active Toggle Switch",
    "category": "checkboxes",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Gradient Active Toggle Switch widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Gradient Toggle Switch\nContainer(\n  decoration: const BoxDecoration(gradient: LinearGradient(colors: [Colors.cyan, Colors.purple])),\n  child: const Switch(value: true, onChanged: null),\n);"
  },
  {
    "id": "comp_checkboxes_10",
    "title": "Accordion Checkbox Tree Item",
    "category": "checkboxes",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Accordion Checkbox Tree Item widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Checkbox Tree Tile\nExpansionTile(\n  leading: Checkbox(value: true, onChanged: (v) {}),\n  title: const Text('Select All Widgets'),\n);"
  },
  {
    "id": "comp_radios_01",
    "title": "Custom Choice Pricing Radio Cards",
    "category": "radios",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Custom Choice Pricing Radio Cards widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Choice Pricing Radio Cards\nRadioListTile<String>(\n  title: const Text('Monthly Pass - ₹29/mo'),\n  value: 'monthly',\n  groupValue: 'monthly',\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_radios_02",
    "title": "Gradient Circle Radio Button",
    "category": "radios",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Gradient Circle Radio Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Gradient Circle Radio Button\nRadio<int>(\n  value: 1,\n  groupValue: 1,\n  activeColor: Colors.purple,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_radios_03",
    "title": "Segmented Choice Selector Cards",
    "category": "radios",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Segmented Choice Selector Cards widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Segmented Choice Selector Cards\nRow(\n  children: const [\n    Expanded(child: ChoiceChip(label: Text('Monthly'), selected: true)),\n    Expanded(child: ChoiceChip(label: Text('Yearly'), selected: false)),\n  ],\n);"
  },
  {
    "id": "comp_radios_04",
    "title": "Image Choice Selection Cards",
    "category": "radios",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Image Choice Selection Cards widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Image Choice Selection Card\nCard(\n  color: Colors.cyan.withOpacity(0.2),\n  child: const ListTile(leading: Icon(Icons.image), title: Text('Theme Dark')),\n);"
  },
  {
    "id": "comp_radios_05",
    "title": "Neumorphic Pressed Radio Group",
    "category": "radios",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Pressed Radio Group widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Neumorphic Radio Group\nContainer(\n  padding: const EdgeInsets.all(8),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(12)),\n  child: const Radio(value: 1, groupValue: 1, onChanged: null),\n);"
  },
  {
    "id": "comp_radios_06",
    "title": "Radio ListTile with Subtitle",
    "category": "radios",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Radio ListTile with Subtitle widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Radio ListTile Subtitle\nRadioListTile<String>(\n  title: const Text('Credit Card Payment'),\n  subtitle: const Text('Instant authorization'),\n  value: 'card',\n  groupValue: 'card',\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_radios_07",
    "title": "Color Swatch Theme Radio Selector",
    "category": "radios",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Color Swatch Theme Radio Selector widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Color Swatch Radio Selector\nRow(\n  children: [\n    CircleAvatar(backgroundColor: Colors.cyan, radius: 14),\n    SizedBox(width: 8),\n    CircleAvatar(backgroundColor: Colors.purple, radius: 14),\n  ],\n);"
  },
  {
    "id": "comp_radios_08",
    "title": "Payment Method Radio Selection Group",
    "category": "radios",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Payment Method Radio Selection Group widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// Payment Radio Selection\nColumn(\n  children: const [\n    RadioListTile(title: Text('Razorpay UPI'), value: 'upi', groupValue: 'upi', onChanged: null),\n  ],\n);"
  },
  {
    "id": "comp_radios_09",
    "title": "Horizontal Pill Choice Selector",
    "category": "radios",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Horizontal Pill Choice Selector widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Horizontal Pill Choice Selector\nWrap(\n  spacing: 8,\n  children: const [\n    ChoiceChip(label: Text('Flutter 3.x'), selected: true),\n    ChoiceChip(label: Text('Dart 3.x'), selected: false),\n  ],\n);"
  },
  {
    "id": "comp_radios_10",
    "title": "iOS Style Radio Group Selector",
    "category": "radios",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Style Radio Group Selector widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "radio_card",
    "code": "// iOS Style Radio Group\nCupertinoRadio<int>(\n  value: 1,\n  groupValue: 1,\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_sliders_01",
    "title": "Dual-Thumb Price RangeSlider",
    "category": "sliders",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Dual-Thumb Price RangeSlider widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Price RangeSlider\nRangeSlider(\n  values: const RangeValues(20, 80),\n  min: 0,\n  max: 100,\n  activeColor: Colors.cyan,\n  onChanged: (values) {},\n);"
  },
  {
    "id": "comp_sliders_02",
    "title": "Gradient Volume Slider with Tooltip",
    "category": "sliders",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Gradient Volume Slider with Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Volume Slider\nSlider(\n  value: 0.7,\n  activeColor: Colors.purple,\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_sliders_03",
    "title": "Circular Radial Value Slider",
    "category": "sliders",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Circular Radial Value Slider widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Radial Value Slider\nSlider.adaptive(\n  value: 0.5,\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_sliders_04",
    "title": "Stepped Continuous Rating Slider",
    "category": "sliders",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Stepped Continuous Rating Slider widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Stepped Rating Slider\nSlider(\n  value: 4,\n  min: 1,\n  max: 5,\n  divisions: 4,\n  label: '4 Stars',\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_sliders_05",
    "title": "Neumorphic Inset Track Slider",
    "category": "sliders",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Inset Track Slider widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Neumorphic Slider Track\nContainer(\n  color: const Color(0xFF1E293B),\n  child: Slider(value: 0.4, onChanged: (v) {}),\n);"
  },
  {
    "id": "comp_sliders_06",
    "title": "Brightness Level Slider Control",
    "category": "sliders",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Brightness Level Slider Control widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Brightness Level Slider\nSlider(\n  thumbColor: Colors.amber,\n  value: 0.8,\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_sliders_07",
    "title": "Temperature Dial Range Control",
    "category": "sliders",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Temperature Dial Range Control widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Temperature Dial Slider\nSlider(\n  value: 24,\n  min: 16,\n  max: 32,\n  label: '24°C',\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_sliders_08",
    "title": "Custom Thumb Icon Value Slider",
    "category": "sliders",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Custom Thumb Icon Value Slider widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Custom Icon Slider Thumb\nSliderTheme(\n  data: SliderThemeData(thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 12)),\n  child: Slider(value: 0.5, onChanged: (v) {}),\n);"
  },
  {
    "id": "comp_sliders_09",
    "title": "iOS Style System Slider",
    "category": "sliders",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready iOS Style System Slider widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// iOS Cupertino Slider\nCupertinoSlider(\n  value: 0.6,\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_sliders_10",
    "title": "Dual Range Filter Track",
    "category": "sliders",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Dual Range Filter Track widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Dual Range Filter Track\nRangeSlider(\n  values: const RangeValues(100, 500),\n  min: 0,\n  max: 1000,\n  onChanged: (v) {},\n);"
  },
  {
    "id": "comp_progress_01",
    "title": "Skeleton Shimmer Pulse Loading Card",
    "category": "progress",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Skeleton Shimmer Pulse Loading Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "shimmer_card",
    "code": "// Skeleton Shimmer Loading Container\nContainer(\n  padding: const EdgeInsets.all(16),\n  decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(16)),\n  child: Row(\n    children: [\n      Container(width: 40, height: 40, color: Colors.white24),\n      const SizedBox(width: 12),\n      Expanded(child: Container(height: 16, color: Colors.white24)),\n    ],\n  ),\n);"
  },
  {
    "id": "comp_progress_02",
    "title": "Circular Gradient Progress Indicator",
    "category": "progress",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Circular Gradient Progress Indicator widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "progress",
    "code": "// Circular Gradient Progress Indicator\nCircularProgressIndicator(\n  value: 0.75,\n  strokeWidth: 6,\n  color: Colors.cyan,\n  backgroundColor: Colors.white10,\n);"
  },
  {
    "id": "comp_progress_03",
    "title": "Step Progress Timeline Stepper",
    "category": "progress",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Step Progress Timeline Stepper widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "timeline_preview",
    "code": "// Timeline Stepper Progress\nStepper(\n  steps: const [\n    Step(title: Text('Order Placed'), content: Text('Completed'), isActive: true),\n    Step(title: Text('Out for Delivery'), content: Text('In Progress'), isActive: true),\n  ],\n);"
  },
  {
    "id": "comp_progress_04",
    "title": "Linear Percentage Progress Bar",
    "category": "progress",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Linear Percentage Progress Bar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Linear Progress Bar\nLinearProgressIndicator(\n  value: 0.6,\n  color: Colors.purple,\n  minHeight: 8,\n  borderRadius: BorderRadius.circular(4),\n);"
  },
  {
    "id": "comp_progress_05",
    "title": "Skeleton List Tile Loading Shimmer",
    "category": "progress",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Skeleton List Tile Loading Shimmer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "shimmer_card",
    "code": "// ListTile Shimmer Placeholder\nContainer(height: 60, color: Colors.white10);"
  },
  {
    "id": "comp_progress_06",
    "title": "Upload File Progress Ring",
    "category": "progress",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Upload File Progress Ring widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "progress",
    "code": "// Upload File Progress Ring\nStack(\n  alignment: Alignment.center,\n  children: const [\n    CircularProgressIndicator(value: 0.8),\n    Text('80%'),\n  ],\n);"
  },
  {
    "id": "comp_progress_07",
    "title": "Multi-Segmented Progress Tracker",
    "category": "progress",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Multi-Segmented Progress Tracker widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Multi-Segmented Progress Tracker\nRow(\n  children: [\n    Expanded(child: Container(height: 6, color: Colors.green)),\n    const SizedBox(width: 4),\n    Expanded(child: Container(height: 6, color: Colors.grey)),\n  ],\n);"
  },
  {
    "id": "comp_progress_08",
    "title": "Dot Pulsing Loading Animation",
    "category": "progress",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Dot Pulsing Loading Animation widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "progress",
    "code": "// Dot Pulsing Animation\nRow(\n  mainAxisAlignment: MainAxisAlignment.center,\n  children: const [\n    CircleAvatar(radius: 4, backgroundColor: Colors.cyan),\n    SizedBox(width: 4),\n    CircleAvatar(radius: 4, backgroundColor: Colors.cyan),\n  ],\n);"
  },
  {
    "id": "comp_progress_09",
    "title": "Neumorphic Circular Gauge",
    "category": "progress",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Circular Gauge widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "progress",
    "code": "// Neumorphic Gauge Ring\nContainer(\n  width: 80,\n  height: 80,\n  decoration: BoxDecoration(shape: BoxShape.circle, color: const Color(0xFF1E293B)),\n  child: const CircularProgressIndicator(value: 0.7),\n);"
  },
  {
    "id": "comp_progress_10",
    "title": "Cupertino Activity Indicator",
    "category": "progress",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Cupertino Activity Indicator widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "progress",
    "code": "// Cupertino Activity Indicator\nCupertinoActivityIndicator(radius: 14);"
  },
  {
    "id": "comp_chips_01",
    "title": "Filter Tag Chips Group",
    "category": "chips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Filter Tag Chips Group widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Filter Tag Chips Group\nWrap(\n  spacing: 8,\n  children: const [\n    FilterChip(label: Text('Widgets'), selected: true, onSelected: null),\n    FilterChip(label: Text('State'), selected: false, onSelected: null),\n  ],\n);"
  },
  {
    "id": "comp_chips_02",
    "title": "Deletable Tag Input Chips",
    "category": "chips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Deletable Tag Input Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Deletable Input Tag Chip\nInputChip(\n  label: const Text('Flutter 3.x'),\n  onDeleted: () {},\n  deleteIcon: const Icon(Icons.close, size: 16),\n);"
  },
  {
    "id": "comp_chips_03",
    "title": "Avatar User Status Tag Chips",
    "category": "chips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Avatar User Status Tag Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "avatar_preview",
    "code": "// User Avatar Status Tag Chip\nChip(\n  avatar: CircleAvatar(child: Text('AR')),\n  label: const Text('Alex Rivera (Admin)'),\n);"
  },
  {
    "id": "comp_chips_04",
    "title": "Gradient Badge Category Chips",
    "category": "chips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Gradient Badge Category Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Gradient Badge Category Chip\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),\n  decoration: BoxDecoration(gradient: const LinearGradient(colors: [Colors.cyan, Colors.purple]), borderRadius: BorderRadius.circular(16)),\n  child: const Text('PRO PASS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n);"
  },
  {
    "id": "comp_chips_05",
    "title": "Choice Action Tag Chips",
    "category": "chips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Choice Action Tag Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Choice Action Tag Chip\nActionChip(\n  avatar: const Icon(Icons.bolt, color: Colors.amber),\n  label: const Text('Quick Action'),\n  onPressed: () {},\n);"
  },
  {
    "id": "comp_chips_06",
    "title": "Outline Glow Filter Chips",
    "category": "chips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Outline Glow Filter Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Outline Glow Filter Chip\nFilterChip(\n  shape: StadiumBorder(side: BorderSide(color: Colors.cyan)),\n  label: const Text('Glow Filter'),\n  selected: true,\n  onSelected: (v) {},\n);"
  },
  {
    "id": "comp_chips_07",
    "title": "Icon Prefix Feature Chips",
    "category": "chips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Icon Prefix Feature Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Icon Prefix Feature Chip\nChip(\n  avatar: const Icon(Icons.star, color: Colors.amber),\n  label: const Text('Featured Widget'),\n);"
  },
  {
    "id": "comp_chips_08",
    "title": "Status Live Indicator Chips",
    "category": "chips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Status Live Indicator Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Status Live Indicator Chip\nChip(\n  avatar: const CircleAvatar(backgroundColor: Colors.green, radius: 4),\n  label: const Text('Live Server Online'),\n);"
  },
  {
    "id": "comp_chips_09",
    "title": "Neumorphic Soft Tag Pills",
    "category": "chips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Soft Tag Pills widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Neumorphic Tag Pill\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(20)),\n  child: const Text('Neumorphic Pill'),\n);"
  },
  {
    "id": "comp_chips_10",
    "title": "iOS Style Capsule Tag Chips",
    "category": "chips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Style Capsule Tag Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// iOS Style Capsule Tag\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),\n  decoration: BoxDecoration(color: Colors.grey.shade900, borderRadius: BorderRadius.circular(30)),\n  child: const Text('iOS Tag', style: TextStyle(color: Colors.white)),\n);"
  },
  {
    "id": "comp_tooltips_01",
    "title": "Glassmorphism Glow Tooltip Popover",
    "category": "tooltips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphism Glow Tooltip Popover widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Glassmorphism Glow Tooltip\nTooltip(\n  message: 'Copy Flutter Dart source code',\n  decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),\n  child: const Icon(Icons.info_outline, color: Colors.cyan),\n);"
  },
  {
    "id": "comp_tooltips_02",
    "title": "Interactive Action Menu Tooltip",
    "category": "tooltips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Interactive Action Menu Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Action Menu Tooltip\nTooltip(\n  message: 'Download .dart widget file',\n  child: IconButton(icon: const Icon(Icons.download), onPressed: () {}),\n);"
  },
  {
    "id": "comp_tooltips_03",
    "title": "Form Field Info Callout Tooltip",
    "category": "tooltips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Form Field Info Callout Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Form Field Info Tooltip\nRow(\n  children: const [\n    Text('CVV Code'),\n    SizedBox(width: 4),\n    Tooltip(message: '3-digit code on back of card', child: Icon(Icons.help_outline, size: 16)),\n  ],\n);"
  },
  {
    "id": "comp_tooltips_04",
    "title": "Rich Text Banner Pointer Tooltip",
    "category": "tooltips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Rich Text Banner Pointer Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Rich Text Pointer Tooltip\nTooltip(\n  richMessage: TextSpan(text: 'PRO Feature: ', style: TextStyle(fontWeight: FontWeight.bold), children: [TextSpan(text: 'Unlock all 250 components')]),\n  child: const Icon(Icons.star, color: Colors.amber),\n);"
  },
  {
    "id": "comp_tooltips_05",
    "title": "Onboarding Tour Feature Tooltip",
    "category": "tooltips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Onboarding Tour Feature Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Onboarding Tour Tooltip\nTooltip(\n  message: 'Step 1: Tap to preview live interactive widget',\n  triggerMode: TooltipTriggerMode.tap,\n  child: const Text('Tap Here'),\n);"
  },
  {
    "id": "comp_tooltips_06",
    "title": "Price Chart Hover Tooltip",
    "category": "tooltips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Price Chart Hover Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Chart Hover Tooltip\nTooltip(\n  message: '₹4,85,000 (+28.4%)',\n  child: const Icon(Icons.trending_up, color: Colors.green),\n);"
  },
  {
    "id": "comp_tooltips_07",
    "title": "Dark Neumorphic Capsule Tooltip",
    "category": "tooltips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Dark Neumorphic Capsule Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Neumorphic Capsule Tooltip\nTooltip(\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(12)),\n  message: 'Neumorphic Tooltip',\n  child: const Icon(Icons.touch_app),\n);"
  },
  {
    "id": "comp_tooltips_08",
    "title": "Icon Hover Floating Popover",
    "category": "tooltips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Icon Hover Floating Popover widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Hover Floating Popover\nTooltip(\n  message: 'View License Agreement',\n  child: const Icon(Icons.verified, color: Colors.blue),\n);"
  },
  {
    "id": "comp_tooltips_09",
    "title": "Custom Arrow Pointer Tooltip",
    "category": "tooltips",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Custom Arrow Pointer Tooltip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// Custom Arrow Tooltip\nTooltip(\n  message: 'Arrow callout box',\n  child: const Icon(Icons.arrow_upward),\n);"
  },
  {
    "id": "comp_tooltips_10",
    "title": "iOS Style Popover Bubble",
    "category": "tooltips",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Style Popover Bubble widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tooltip_preview",
    "code": "// iOS Popover Bubble\nTooltip(\n  message: 'Copied!',\n  child: const Text('Long Press Action'),\n);"
  },
  {
    "id": "comp_pickers_01",
    "title": "Glass Date & Time Range Picker",
    "category": "pickers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glass Date & Time Range Picker widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Date & Time Range Picker\nshowDateRangePicker(\n  context: context,\n  firstDate: DateTime(2025),\n  lastDate: DateTime(2030),\n  builder: (context, child) => Theme(data: ThemeData.dark(), child: child!),\n);"
  },
  {
    "id": "comp_pickers_02",
    "title": "Calendar Month View Picker",
    "category": "pickers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Calendar Month View Picker widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Calendar Month Picker\nCalendarDatePicker(\n  initialDate: DateTime.now(),\n  firstDate: DateTime(2025),\n  lastDate: DateTime(2030),\n  onDateChanged: (date) {},\n);"
  },
  {
    "id": "comp_pickers_03",
    "title": "Analog Clock Time Picker Dial",
    "category": "pickers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Analog Clock Time Picker Dial widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Time Picker Dial\nshowTimePicker(\n  context: context,\n  initialTime: TimeOfDay.now(),\n);"
  },
  {
    "id": "comp_pickers_04",
    "title": "Quick Relative Date Preset Selector",
    "category": "pickers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Quick Relative Date Preset Selector widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Quick Date Preset Selector\nWrap(\n  spacing: 8,\n  children: const [\n    ChoiceChip(label: Text('Today'), selected: true),\n    ChoiceChip(label: Text('This Week'), selected: false),\n    ChoiceChip(label: Text('This Month'), selected: false),\n  ],\n);"
  },
  {
    "id": "comp_pickers_05",
    "title": "Cupertino Wheel Date & Time Scroll",
    "category": "pickers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Cupertino Wheel Date & Time Scroll widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Cupertino Date Picker Scroll\nSizedBox(\n  height: 180,\n  child: CupertinoDatePicker(\n    mode: CupertinoDatePickerMode.date,\n    onDateTimeChanged: (date) {},\n  ),\n);"
  },
  {
    "id": "comp_pickers_06",
    "title": "Flight Hotel Date Range Picker",
    "category": "pickers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Flight Hotel Date Range Picker widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Flight Date Range Picker\nListTile(\n  leading: const Icon(Icons.flight_takeoff, color: Colors.cyan),\n  title: const Text('Aug 04, 2026 - Aug 12, 2026'),\n  onTap: () {},\n);"
  },
  {
    "id": "comp_pickers_07",
    "title": "Inline Horizontal Calendar Strip",
    "category": "pickers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Inline Horizontal Calendar Strip widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Horizontal Calendar Strip\nSingleChildScrollView(\n  scrollDirection: Axis.horizontal,\n  child: Row(\n    children: List.generate(7, (i) => Container(padding: const EdgeInsets.all(12), child: Text('Day ${i + 1}'))),\n  ),\n);"
  },
  {
    "id": "comp_pickers_08",
    "title": "Duration & Timer Counter Picker",
    "category": "pickers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Duration & Timer Counter Picker widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Duration Timer Picker\nCupertinoTimerPicker(\n  mode: CupertinoTimerPickerMode.hm,\n  onTimerDurationChanged: (duration) {},\n);"
  },
  {
    "id": "comp_pickers_09",
    "title": "Neumorphic Date Calendar Card",
    "category": "pickers",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Date Calendar Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Neumorphic Calendar Card\nContainer(\n  padding: const EdgeInsets.all(16),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),\n  child: const Text('📅 Aug 04, 2026', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n);"
  },
  {
    "id": "comp_pickers_10",
    "title": "Birthday & Year Scroll Selector",
    "category": "pickers",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Birthday & Year Scroll Selector widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Year Scroll Selector\nYearPicker(\n  selectedDate: DateTime.now(),\n  firstDate: DateTime(1950),\n  lastDate: DateTime.now(),\n  onChanged: (date) {},\n);"
  },
  {
    "id": "comp_images_01",
    "title": "Cached Network Image Hero Avatar",
    "category": "images",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Cached Network Image Hero Avatar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "avatar_preview",
    "code": "// Cached Image Avatar\nCircleAvatar(\n  radius: 24,\n  backgroundImage: const NetworkImage('https://via.placeholder.com/150'),\n);"
  },
  {
    "id": "comp_images_02",
    "title": "Glassmorphic Image Card Blur Backdrop",
    "category": "images",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Glassmorphic Image Card Blur Backdrop widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bento_card",
    "code": "// Image Card Blur Backdrop\nStack(\n  children: [\n    Image.network('https://via.placeholder.com/300x180', fit: BoxFit.cover),\n    Positioned.fill(\n      child: BackdropFilter(\n        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),\n        child: Container(color: Colors.black26),\n      ),\n    ),\n  ],\n);"
  },
  {
    "id": "comp_images_03",
    "title": "Circular Avatar Badge Stack",
    "category": "images",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Circular Avatar Badge Stack widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "avatar_preview",
    "code": "// Avatar Badge Stack\nStack(\n  children: [\n    const CircleAvatar(radius: 20, child: Text('A')),\n    Positioned(right: 0, bottom: 0, child: Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle))),\n  ],\n);"
  },
  {
    "id": "comp_images_04",
    "title": "Image Carousel Fullscreen Zoom Viewer",
    "category": "images",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Image Carousel Fullscreen Zoom Viewer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "carousel_preview",
    "code": "// Fullscreen Image Viewer\nInteractiveViewer(\n  child: Image.network('https://via.placeholder.com/400x250'),\n);"
  },
  {
    "id": "comp_images_05",
    "title": "Animated Feather Icon Pack Grid",
    "category": "images",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Animated Feather Icon Pack Grid widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Feather Icon Grid\nGridView.count(\n  crossAxisCount: 4,\n  children: const [Icon(Icons.home), Icon(Icons.star), Icon(Icons.settings), Icon(Icons.person)],\n);"
  },
  {
    "id": "comp_images_06",
    "title": "Rounded Image AspectRatio Card",
    "category": "images",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Rounded Image AspectRatio Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// AspectRatio Image Card\nClipRRect(\n  borderRadius: BorderRadius.circular(16),\n  child: AspectRatio(\n    aspectRatio: 16 / 9,\n    child: Image.network('https://via.placeholder.com/400x225', fit: BoxFit.cover),\n  ),\n);"
  },
  {
    "id": "comp_images_07",
    "title": "Parallax Hero Image View",
    "category": "images",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Parallax Hero Image View widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "sliver_appbar",
    "code": "// Parallax Hero Image View\nHero(\n  tag: 'hero_img',\n  child: Image.network('https://via.placeholder.com/400x200', fit: BoxFit.cover),\n);"
  },
  {
    "id": "comp_images_08",
    "title": "Image Comparison Before/After Slider",
    "category": "images",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Image Comparison Before/After Slider widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "range_slider",
    "code": "// Image Comparison Slider\nStack(\n  children: [\n    Image.network('https://via.placeholder.com/300x150?text=Before'),\n  ],\n);"
  },
  {
    "id": "comp_images_09",
    "title": "Circular Progress Image Profile",
    "category": "images",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Circular Progress Image Profile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "avatar_preview",
    "code": "// Profile Image Ring Progress\nStack(\n  alignment: Alignment.center,\n  children: const [\n    SizedBox(width: 60, height: 60, child: CircularProgressIndicator(value: 0.8)),\n    CircleAvatar(radius: 24, child: Text('FH')),\n  ],\n);"
  },
  {
    "id": "comp_images_10",
    "title": "Skeleton Image Shimmer Placeholder",
    "category": "images",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Skeleton Image Shimmer Placeholder widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "shimmer_card",
    "code": "// Skeleton Image Placeholder\nContainer(\n  height: 140,\n  decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(14)),\n);"
  },
  {
    "id": "comp_gridview_01",
    "title": "Staggered Masonry Product Grid",
    "category": "gridview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Staggered Masonry Product Grid widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Staggered Masonry Grid\nGridView.builder(\n  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 10, crossAxisSpacing: 10),\n  itemCount: 10,\n  itemBuilder: (context, index) => Card(child: Center(child: Text('Product ${index + 1}'))),\n);"
  },
  {
    "id": "comp_gridview_02",
    "title": "Bento Box Telemetry Grid Layout",
    "category": "gridview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Bento Box Telemetry Grid Layout widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "bento_card",
    "code": "// Bento Box Grid Layout\nContainer(\n  padding: const EdgeInsets.all(12),\n  decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(16)),\n  child: const Text('Bento Box Cell'),\n);"
  },
  {
    "id": "comp_gridview_03",
    "title": "Responsive Dashboard Tile Grid",
    "category": "gridview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Responsive Dashboard Tile Grid widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Responsive Grid Tiles\nLayoutBuilder(\n  builder: (context, constraints) => GridView.count(\n    crossAxisCount: constraints.maxWidth > 600 ? 4 : 2,\n    children: const [Card(child: Text('Tile 1')), Card(child: Text('Tile 2'))],\n  ),\n);"
  },
  {
    "id": "comp_gridview_04",
    "title": "Photo Gallery Grid with Zoom",
    "category": "gridview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Photo Gallery Grid with Zoom widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Photo Gallery Grid\nGridView.extent(\n  maxCrossAxisExtent: 120,\n  children: List.generate(8, (i) => Image.network('https://via.placeholder.com/120')),\n);"
  },
  {
    "id": "comp_gridview_05",
    "title": "Category Icon Grid Menu",
    "category": "gridview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Category Icon Grid Menu widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Category Icon Grid Menu\nGridView.count(\n  crossAxisCount: 3,\n  children: const [\n    Column(children: [Icon(Icons.directions_car), Text('Auto')]),\n    Column(children: [Icon(Icons.flight), Text('Flight')]),\n  ],\n);"
  },
  {
    "id": "comp_gridview_06",
    "title": "Ecommerce Grid Card View",
    "category": "gridview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Ecommerce Grid Card View widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// Ecommerce Card Grid\nGridView.count(\n  crossAxisCount: 2,\n  childAspectRatio: 0.75,\n  children: const [Card(child: Text('Shoes - ₹1,999'))],\n);"
  },
  {
    "id": "comp_gridview_07",
    "title": "Neumorphic Grid Action Tiles",
    "category": "gridview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Grid Action Tiles widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Neumorphic Grid Tile\nContainer(\n  margin: const EdgeInsets.all(8),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(14)),\n  child: const Center(child: Icon(Icons.bolt, color: Colors.cyan)),\n);"
  },
  {
    "id": "comp_gridview_08",
    "title": "Drag & Drop Reorderable Grid",
    "category": "gridview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Drag & Drop Reorderable Grid widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Reorderable Grid View\nReorderableGridView.count(\n  crossAxisCount: 3,\n  children: const [Card(key: ValueKey(1), child: Text('Drag 1'))],\n  onReorder: (oldIdx, newIdx) {},\n);"
  },
  {
    "id": "comp_gridview_09",
    "title": "Infinite Scroll Loading Grid",
    "category": "gridview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Infinite Scroll Loading Grid widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// Infinite Scroll Grid\nGridView.builder(\n  itemCount: 20,\n  itemBuilder: (context, index) => Card(child: Text('Grid Item ${index + 1}')),\n);"
  },
  {
    "id": "comp_gridview_10",
    "title": "iOS App Library Icon Grid",
    "category": "gridview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS App Library Icon Grid widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "masonry_grid",
    "code": "// iOS App Library Grid\nGridView.count(\n  crossAxisCount: 4,\n  children: const [CircleAvatar(child: Icon(Icons.phone))],\n);"
  },
  {
    "id": "comp_listview_01",
    "title": "Hero Banner PageView Carousel",
    "category": "listview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Hero Banner PageView Carousel widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "carousel_preview",
    "code": "// Hero Banner PageView\nSizedBox(\n  height: 180,\n  child: PageView(\n    children: [\n      Container(color: Colors.cyan, child: const Center(child: Text('Banner 1'))),\n      Container(color: Colors.purple, child: const Center(child: Text('Banner 2'))),\n    ],\n  ),\n);"
  },
  {
    "id": "comp_listview_02",
    "title": "Infinite Scroll ListView with Shimmer",
    "category": "listview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Infinite Scroll ListView with Shimmer widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "shimmer_card",
    "code": "// Infinite Scroll ListView\nListView.builder(\n  itemCount: 50,\n  itemBuilder: (context, index) => ListTile(title: Text('Data Item ${index + 1}')),\n);"
  },
  {
    "id": "comp_listview_03",
    "title": "Horizontal Scrolling Card List",
    "category": "listview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Horizontal Scrolling Card List widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "checkout_preview",
    "code": "// Horizontal Card List\nSizedBox(\n  height: 120,\n  child: ListView(\n    scrollDirection: Axis.horizontal,\n    children: const [Card(child: SizedBox(width: 100, child: Center(child: Text('Card A'))))],\n  ),\n);"
  },
  {
    "id": "comp_listview_04",
    "title": "Grouped Sticky Header ListView",
    "category": "listview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Grouped Sticky Header ListView widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Grouped Sticky Header ListView\nListView(\n  children: const [\n    ListTile(title: Text('SECTION A'), tileColor: Colors.black26),\n    ListTile(title: Text('Item 1')),\n  ],\n);"
  },
  {
    "id": "comp_listview_05",
    "title": "Onboarding Fullscreen PageView",
    "category": "listview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Onboarding Fullscreen PageView widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "carousel_preview",
    "code": "// Onboarding PageView\nPageView(\n  children: const [\n    Center(child: Text('Welcome to FlutterHub')),\n    Center(child: Text('Build 10x Faster')),\n  ],\n);"
  },
  {
    "id": "comp_listview_06",
    "title": "Slidable Chat Messages ListView",
    "category": "listview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Slidable Chat Messages ListView widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Chat Messages ListView\nListView.separated(\n  itemCount: 10,\n  separatorBuilder: (context, index) => const Divider(),\n  itemBuilder: (context, index) => ListTile(title: Text('Chat message ${index + 1}')),\n);"
  },
  {
    "id": "comp_listview_07",
    "title": "Vertical Timeline Step ListView",
    "category": "listview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Vertical Timeline Step ListView widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "timeline_preview",
    "code": "// Vertical Timeline ListView\nListView(\n  children: const [\n    ListTile(leading: Icon(Icons.check_circle, color: Colors.green), title: Text('Order Confirmed')),\n  ],\n);"
  },
  {
    "id": "comp_listview_08",
    "title": "Accordion List View Stepper",
    "category": "listview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Accordion List View Stepper widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Accordion List View Stepper\nListView(\n  children: const [ExpansionTile(title: Text('Step 1: Account Info'))],\n);"
  },
  {
    "id": "comp_listview_09",
    "title": "Swipe-to-Dismiss Dismissible List",
    "category": "listview",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Swipe-to-Dismiss Dismissible List widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Swipe to Dismiss List\nListView.builder(\n  itemCount: 5,\n  itemBuilder: (context, index) => Dismissible(\n    key: Key('item_$index'),\n    child: ListTile(title: Text('Item $index')),\n  ),\n);"
  },
  {
    "id": "comp_listview_10",
    "title": "iOS Cupertino List Section",
    "category": "listview",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Cupertino List Section widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "slidable_list",
    "code": "// Cupertino List Section\nCupertinoListSection(\n  header: const Text('MY ACCOUNT'),\n  children: const [CupertinoListTile(title: Text('Profile'))],\n);"
  },
  {
    "id": "comp_expansion_01",
    "title": "Animated Accordion FAQ ExpansionCard",
    "category": "expansion",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Animated Accordion FAQ ExpansionCard widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Accordion FAQ ExpansionCard\nExpansionTile(\n  title: const Text('What is FlutterHub Pro?', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n  children: const [\n    Padding(padding: EdgeInsets.all(16), child: Text('FlutterHub Pro gives you full access to source code copy & downloads.')),\n  ],\n);"
  },
  {
    "id": "comp_expansion_02",
    "title": "Multi-Level Nested Expansion Tree",
    "category": "expansion",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Multi-Level Nested Expansion Tree widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Multi-Level Expansion Tree\nExpansionTile(\n  title: const Text('State Management'),\n  children: const [\n    ExpansionTile(title: Text('Riverpod 2.x'), children: [ListTile(title: Text('StateNotifierProvider'))]),\n  ],\n);"
  },
  {
    "id": "comp_expansion_03",
    "title": "Glassmorphism Filter Expansion Panel",
    "category": "expansion",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphism Filter Expansion Panel widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Glassmorphism Filter Expansion\nExpansionPanelList(\n  children: [\n    ExpansionPanel(headerBuilder: (ctx, isOpen) => const ListTile(title: Text('Filters')), body: const Text('Filter details'), isExpanded: true),\n  ],\n);"
  },
  {
    "id": "comp_expansion_04",
    "title": "Accordion Settings Group Tile",
    "category": "expansion",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Accordion Settings Group Tile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Settings Group Accordion\nExpansionTile(\n  leading: const Icon(Icons.security, color: Colors.cyan),\n  title: const Text('Security & Privacy'),\n  children: const [ListTile(title: Text('Two-Factor Authentication'))],\n);"
  },
  {
    "id": "comp_expansion_05",
    "title": "Pricing Feature Comparison Expansion",
    "category": "expansion",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Pricing Feature Comparison Expansion widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Pricing Feature Expansion\nExpansionTile(\n  title: const Text('View All Pro Features'),\n  children: const [ListTile(title: Text('✓ 250+ Flutter Widgets')), ListTile(title: Text('✓ Commercial License'))],\n);"
  },
  {
    "id": "comp_expansion_06",
    "title": "Order History Items Expansion Tile",
    "category": "expansion",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Order History Items Expansion Tile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Order History Expansion Tile\nExpansionTile(\n  title: const Text('Order #8829 - ₹1,499.00'),\n  subtitle: const Text('Delivered Aug 04, 2026'),\n  children: const [ListTile(title: Text('1x Flutter Hub Pass'))],\n);"
  },
  {
    "id": "comp_expansion_07",
    "title": "Neumorphic Soft Accordion Card",
    "category": "expansion",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Soft Accordion Card widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Neumorphic Accordion Card\nContainer(\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(14)),\n  child: const ExpansionTile(title: Text('Neumorphic Accordion')),\n);"
  },
  {
    "id": "comp_expansion_08",
    "title": "Custom Leading Icon Expansion Tile",
    "category": "expansion",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Custom Leading Icon Expansion Tile widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Custom Leading Icon Expansion Tile\nExpansionTile(\n  leading: const Icon(Icons.help_center, color: Colors.purple),\n  title: const Text('Help Center'),\n);"
  },
  {
    "id": "comp_expansion_09",
    "title": "iOS Cupertino Accordion Disclosure",
    "category": "expansion",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready iOS Cupertino Accordion Disclosure widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Cupertino Accordion Disclosure\nCupertinoListSection(\n  children: const [CupertinoListTile(title: Text('Accordion Disclosure'))],\n);"
  },
  {
    "id": "comp_expansion_10",
    "title": "Multi-Select Accordion Filter Group",
    "category": "expansion",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Multi-Select Accordion Filter Group widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "expansion_preview",
    "code": "// Multi-Select Accordion Group\nExpansionTile(\n  title: const Text('Category Select'),\n  children: const [CheckboxListTile(title: Text('Buttons'), value: true, onChanged: null)],\n);"
  },
  {
    "id": "comp_fab_01",
    "title": "Speed Dial Expandable FAB",
    "category": "fab",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Speed Dial Expandable FAB widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Speed Dial Expandable FAB\nFloatingActionButton(\n  onPressed: () {},\n  child: const Icon(Icons.add),\n);"
  },
  {
    "id": "comp_fab_02",
    "title": "Extended Label FAB with Icon",
    "category": "fab",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Extended Label FAB with Icon widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Extended FAB with Icon\nFloatingActionButton.extended(\n  onPressed: () {},\n  icon: const Icon(Icons.bolt),\n  label: const Text('Create Component'),\n  backgroundColor: Colors.cyan,\n);"
  },
  {
    "id": "comp_fab_03",
    "title": "Pulsing Glow Floating Action Button",
    "category": "fab",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Pulsing Glow Floating Action Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Pulsing Glow FAB\nContainer(\n  decoration: BoxDecoration(\n    shape: BoxShape.circle,\n    boxShadow: [BoxShadow(color: Colors.purple.withOpacity(0.6), blurRadius: 20)],\n  ),\n  child: FloatingActionButton(onPressed: () {}, child: const Icon(Icons.star)),\n);"
  },
  {
    "id": "comp_fab_04",
    "title": "Docked Bottom Navigation Center FAB",
    "category": "fab",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Docked Bottom Navigation Center FAB widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Docked Center FAB\nScaffold(\n  floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,\n  floatingActionButton: FloatingActionButton(onPressed: () {}, child: const Icon(Icons.add)),\n);"
  },
  {
    "id": "comp_fab_05",
    "title": "Neumorphic Floating Action Button",
    "category": "fab",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Neumorphic Floating Action Button widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Neumorphic FAB\nContainer(\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), shape: BoxShape.circle),\n  child: IconButton(icon: const Icon(Icons.add, color: Colors.cyan), onPressed: () {}),\n);"
  },
  {
    "id": "comp_fab_06",
    "title": "Multi-Action Circular Radial FAB",
    "category": "fab",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Multi-Action Circular Radial FAB widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Radial Multi-Action FAB\nStack(\n  children: [\n    FloatingActionButton(onPressed: () {}, child: const Icon(Icons.menu)),\n  ],\n);"
  },
  {
    "id": "comp_fab_07",
    "title": "Animated Morphing Icon FAB",
    "category": "fab",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Animated Morphing Icon FAB widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Morphing Icon FAB\nFloatingActionButton(\n  onPressed: () {},\n  child: const AnimatedSwitcher(duration: Duration(milliseconds: 300), child: Icon(Icons.edit)),\n);"
  },
  {
    "id": "comp_fab_08",
    "title": "Scroll-Aware Shrinking FAB",
    "category": "fab",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Scroll-Aware Shrinking FAB widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Scroll-Aware Shrinking FAB\nFloatingActionButton.extended(\n  isExtended: true,\n  onPressed: () {},\n  label: const Text('New Message'),\n  icon: const Icon(Icons.message),\n);"
  },
  {
    "id": "comp_fab_09",
    "title": "Glassmorphic Floating Island FAB",
    "category": "fab",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Glassmorphic Floating Island FAB widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// Glassmorphic Floating Island FAB\nContainer(\n  padding: const EdgeInsets.all(12),\n  decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(30)),\n  child: const Icon(Icons.add, color: Colors.white),\n);"
  },
  {
    "id": "comp_fab_10",
    "title": "iOS Style Floating Action Capsule",
    "category": "fab",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready iOS Style Floating Action Capsule widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "fab_menu",
    "code": "// iOS Capsule FAB\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),\n  decoration: BoxDecoration(color: Colors.black, borderRadius: BorderRadius.circular(30)),\n  child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.add, color: Colors.white), Text('  Add', style: TextStyle(color: Colors.white))]),\n);"
  },
  {
    "id": "comp_material_cupertino_01",
    "title": "iOS Cupertino Modal Action Sheet",
    "category": "material_cupertino",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready iOS Cupertino Modal Action Sheet widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "cupertino_sheet",
    "code": "// Cupertino Action Sheet\nCupertinoActionSheet(\n  title: const Text('Cupertino Action Sheet'),\n  actions: [\n    CupertinoActionSheetAction(onPressed: () {}, child: const Text('Save Widget')),\n    CupertinoActionSheetAction(isDestructiveAction: true, onPressed: () {}, child: const Text('Delete')),\n  ],\n);"
  },
  {
    "id": "comp_material_cupertino_02",
    "title": "Material 3 Dynamic Color Switcher",
    "category": "material_cupertino",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Material 3 Dynamic Color Switcher widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "switch_preview",
    "code": "// Material 3 Switch\nSwitch(\n  value: true,\n  thumbIcon: WidgetStateProperty.all(const Icon(Icons.palette)),\n  onChanged: (val) {},\n);"
  },
  {
    "id": "comp_material_cupertino_03",
    "title": "Cupertino Segmented Control TabBar",
    "category": "material_cupertino",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Cupertino Segmented Control TabBar widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "tab_bar_preview",
    "code": "// Cupertino Segmented Control\nCupertinoSegmentedControl<int>(\n  children: const {0: Text('iOS 17'), 1: Text('Material 3')},\n  onValueChanged: (val) {},\n);"
  },
  {
    "id": "comp_material_cupertino_04",
    "title": "Material 3 Filled & Tonal Buttons",
    "category": "material_cupertino",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Material 3 Filled & Tonal Buttons widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "glass_button",
    "code": "// Material 3 Tonal Button\nFilledButton.tonal(\n  onPressed: () {},\n  child: const Text('Material 3 Tonal Button'),\n);"
  },
  {
    "id": "comp_material_cupertino_05",
    "title": "Cupertino Activity Loading Indicator",
    "category": "material_cupertino",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Cupertino Activity Loading Indicator widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "progress",
    "code": "// Cupertino Activity Indicator\nCupertinoActivityIndicator(radius: 16);"
  },
  {
    "id": "comp_material_cupertino_06",
    "title": "Material 3 Navigation Rail",
    "category": "material_cupertino",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Material 3 Navigation Rail widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "nav_bar_preview",
    "code": "// Material 3 Navigation Rail\nNavigationRail(\n  selectedIndex: 0,\n  destinations: const [NavigationRailDestination(icon: Icon(Icons.dashboard), label: Text('Dashboard'))],\n);"
  },
  {
    "id": "comp_material_cupertino_07",
    "title": "Cupertino Date & Time Wheel Picker",
    "category": "material_cupertino",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Cupertino Date & Time Wheel Picker widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "picker_preview",
    "code": "// Cupertino Date Picker\nSizedBox(height: 200, child: CupertinoDatePicker(onDateTimeChanged: (dt) {}));"
  },
  {
    "id": "comp_material_cupertino_08",
    "title": "Material 3 Filter & Input Chips",
    "category": "material_cupertino",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Material 3 Filter & Input Chips widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "chip_group",
    "code": "// Material 3 Filter Chip\nFilterChip(label: const Text('Material 3 Chip'), selected: true, onSelected: (v) {});"
  },
  {
    "id": "comp_material_cupertino_09",
    "title": "Cupertino Alert Dialog Modal",
    "category": "material_cupertino",
    "isPremium": false,
    "badge": "Free",
    "description": "Production-ready Cupertino Alert Dialog Modal widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "dialog_preview",
    "code": "// Cupertino Alert Dialog\nCupertinoAlertDialog(\n  title: const Text('Cupertino Alert'),\n  actions: [CupertinoDialogAction(child: const Text('OK'))],\n);"
  },
  {
    "id": "comp_material_cupertino_10",
    "title": "Material 3 Search Bar & View",
    "category": "material_cupertino",
    "isPremium": true,
    "badge": "PRO",
    "description": "Production-ready Material 3 Search Bar & View widget optimized for high performance and clean Flutter architecture.",
    "dependencies": [
      "flutter/material.dart"
    ],
    "simType": "search_input",
    "code": "// Material 3 SearchBar\nSearchBar(\n  leading: const Icon(Icons.search),\n  hintText: 'Search Flutter components...',\n);"
  }
],

  // ------------------------------------------------------------------------
  // 50 FLUTTER INTERVIEW QUESTIONS & ROADMAPS DATASET
  // ------------------------------------------------------------------------
  interviewQuestions: [
  {
    "id": "q_01",
    "number": 1,
    "level": "Beginner",
    "isPremium": false,
    "question": "What is Flutter, and why should you use it?",
    "answer": "Flutter is an open-source UI framework developed by Google. It lets developers build Android, iOS, web, and desktop applications from a single Dart codebase. It is popular because of fast development with Hot Reload, strong performance, customizable widgets, and a large package ecosystem.",
    "interviewAnswer": "Flutter is Google's cross-platform UI framework. I use it because I can build Android and iOS apps from one codebase while maintaining good performance and a consistent UI."
  },
  {
    "id": "q_02",
    "number": 2,
    "level": "Beginner",
    "isPremium": false,
    "question": "What is the difference between Flutter and Dart?",
    "answer": "Flutter is the UI framework used to build applications. Dart is the programming language used to write Flutter applications. Dart supports object-oriented programming, null safety, async/await, Futures, Streams, and garbage collection. (Remember: Flutter = Framework; Dart = Language)."
  },
  {
    "id": "q_03",
    "number": 3,
    "level": "Beginner",
    "isPremium": false,
    "question": "Explain StatelessWidget vs StatefulWidget.",
    "answer": "A StatelessWidget is suitable when the widget does not own mutable state that changes during its lifetime. A StatefulWidget has a separate State object and is used when local state can change over time. For example, static text can be StatelessWidget, while a counter or form with changing UI can be StatefulWidget."
  },
  {
    "id": "q_04",
    "number": 4,
    "level": "Beginner",
    "isPremium": false,
    "question": "What is BuildContext?",
    "answer": "BuildContext represents a widget's location in the widget tree. It is commonly used to access inherited information and services such as Theme.of(context), MediaQuery.of(context), Navigator.of(context), and ScaffoldMessenger.of(context)."
  },
  {
    "id": "q_05",
    "number": 5,
    "level": "Beginner",
    "isPremium": false,
    "question": "What is the Widget Tree?",
    "answer": "Flutter UI is created by composing widgets in a hierarchy called the widget tree. For example: MaterialApp -> Scaffold -> Column -> Text/Button/Image. Parent widgets contain child widgets, and Flutter uses this structure to build and update the interface."
  },
  {
    "id": "q_06",
    "number": 6,
    "level": "Beginner",
    "isPremium": false,
    "question": "What is Hot Reload vs Hot Restart?",
    "answer": "Hot Reload injects updated Dart code and rebuilds affected widgets while generally preserving the current in-memory state. Hot Restart restarts the Dart application and resets the current state. Hot Reload is useful for quick UI changes; Hot Restart is useful when initialization or state must restart."
  },
  {
    "id": "q_07",
    "number": 7,
    "level": "Beginner",
    "isPremium": false,
    "question": "What is pubspec.yaml?",
    "answer": "pubspec.yaml is the main configuration file for a Flutter/Dart project. It defines project metadata, Dart/Flutter SDK constraints, dependencies, assets, fonts, and other project settings."
  },
  {
    "id": "q_08",
    "number": 8,
    "level": "Beginner",
    "isPremium": false,
    "question": "What are Packages and Plugins?",
    "answer": "A package is reusable Dart/Flutter code. A plugin is a package that can also contain platform-specific implementations for Android, iOS, web, or desktop. Examples include camera, geolocator, shared_preferences, and Firebase packages."
  },
  {
    "id": "q_09",
    "number": 9,
    "level": "Beginner",
    "isPremium": false,
    "question": "What is setState(), and when should you use it?",
    "answer": "setState() tells Flutter that data inside a State object has changed and the UI may need rebuilding. It is appropriate for simple local state in a StatefulWidget. For larger or shared application state, solutions such as Riverpod, Provider, BLoC, or Cubit provide better organization."
  },
  {
    "id": "q_10",
    "number": 10,
    "level": "Beginner",
    "isPremium": false,
    "question": "Difference between Container, Padding, SizedBox, and Expanded.",
    "answer": "Container: combines decoration, constraints, alignment, padding, and sizing capabilities. Padding: adds space around its child. SizedBox: creates fixed space or constrains width/height. Expanded: makes a child fill available remaining space inside Row, Column, or Flex."
  },
  {
    "id": "q_11",
    "number": 11,
    "level": "Intermediate",
    "isPremium": false,
    "question": "What is the Flutter App Lifecycle?",
    "answer": "For a StatefulWidget, important lifecycle methods include initState(), didChangeDependencies(), build(), didUpdateWidget(), deactivate(), and dispose(). initState() runs once when State is inserted into the tree; build() may run many times; dispose() cleans up resources. Flutter also has application lifecycle states such as resumed, inactive, hidden, paused, and detached."
  },
  {
    "id": "q_12",
    "number": 12,
    "level": "Intermediate",
    "isPremium": false,
    "question": "What are Keys in Flutter?",
    "answer": "Keys help Flutter identify widgets/elements when widgets are inserted, removed, moved, or rebuilt. They are especially useful in dynamic lists, reorderable widgets, and situations where state must stay associated with the correct item."
  },
  {
    "id": "q_13",
    "number": 13,
    "level": "Intermediate",
    "isPremium": false,
    "question": "Explain GlobalKey, ValueKey, and UniqueKey.",
    "answer": "ValueKey: identifies a widget using a stable value such as user.id. UniqueKey: creates a unique identity each time it is constructed. GlobalKey: provides an identity unique across the app and can access associated State/BuildContext, for example GlobalKey<FormState>. GlobalKeys should be used carefully because they are relatively expensive."
  },
  {
    "id": "q_14",
    "number": 14,
    "level": "Intermediate",
    "isPremium": false,
    "question": "What is State Management?",
    "answer": "State management is the way an application stores, updates, shares, and reacts to changing data. Examples include logged-in user information, API responses, cart items, theme, notifications, and form state."
  },
  {
    "id": "q_15",
    "number": 15,
    "level": "Intermediate",
    "isPremium": false,
    "question": "Compare Provider, Riverpod, BLoC, Cubit, and GetX.",
    "answer": "Provider: simple and widely used, based on Flutter's inherited mechanisms. Riverpod: provider-based state management and dependency injection with strong testability and no BuildContext requirement for reading providers. BLoC: explicit event-to-state architecture, useful for predictable complex flows. Cubit: simpler BLoC approach where methods directly emit states. GetX: combines state management, dependency injection, and routing with low boilerplate."
  },
  {
    "id": "q_16",
    "number": 16,
    "level": "Intermediate",
    "isPremium": false,
    "question": "Explain Future, Stream, and async/await.",
    "answer": "A Future represents one asynchronous result that becomes available later. A Stream represents multiple asynchronous values over time. async/await provides readable syntax for working with asynchronous operations. Example: final user = await getUser();"
  },
  {
    "id": "q_17",
    "number": 17,
    "level": "Intermediate",
    "isPremium": false,
    "question": "How do you call REST APIs?",
    "answer": "Flutter apps commonly use packages such as http or Dio. Create the request, await the response, validate the HTTP status code, decode the response, and map it to models. Typical methods are GET, POST, PUT, PATCH, and DELETE. In production, API logic is placed in a service/repository layer."
  },
  {
    "id": "q_18",
    "number": 18,
    "level": "Intermediate",
    "isPremium": false,
    "question": "How do you parse JSON?",
    "answer": "Use dart:convert and jsonDecode() to convert JSON text into Dart maps/lists, then map those values into typed model classes using factory constructors such as User.fromJson(). Larger projects often use code generation such as json_serializable."
  },
  {
    "id": "q_19",
    "number": 19,
    "level": "Intermediate",
    "isPremium": false,
    "question": "How do you handle API exceptions?",
    "answer": "Use try/catch, validate HTTP status codes, handle timeouts and network failures, and convert technical errors into user-friendly application errors. Common cases include no internet, timeout, 401, 403, 404, 500, and malformed JSON. Logging and retry strategies are also appropriate."
  },
  {
    "id": "q_20",
    "number": 20,
    "level": "Intermediate",
    "isPremium": false,
    "question": "What are Mixins in Dart?",
    "answer": "Mixins allow reusable behavior to be shared across multiple classes without traditional inheritance. A class can apply one or more mixins using the with keyword. They are useful for reusable functionality such as logging or shared behaviors."
  },
  {
    "id": "q_21",
    "number": 21,
    "level": "Intermediate",
    "isPremium": true,
    "question": "Explain Navigator 1.0 vs Navigator 2.0.",
    "answer": "Navigator 1.0 is primarily imperative: code calls push(), pop(), or pushReplacement(). Navigator 2.0 provides a declarative routing model with greater control over route state, browser history, and deep links. Packages such as go_router simplify declarative routing."
  },
  {
    "id": "q_22",
    "number": 22,
    "level": "Intermediate",
    "isPremium": true,
    "question": "What is InheritedWidget?",
    "answer": "InheritedWidget is a core Flutter mechanism for efficiently exposing data to widgets lower in the tree without manually passing it through every constructor. Flutter APIs and many state-management libraries build on inherited dependency mechanisms."
  },
  {
    "id": "q_23",
    "number": 23,
    "level": "Intermediate",
    "isPremium": true,
    "question": "How do you pass data between screens?",
    "answer": "Common methods include constructor parameters, route arguments, returning a result from Navigator.pop(), or using shared state management such as Riverpod/BLoC. Constructor parameters are usually simplest for direct parent-to-next-screen data."
  },
  {
    "id": "q_24",
    "number": 24,
    "level": "Intermediate",
    "isPremium": true,
    "question": "How do you manage local storage?",
    "answer": "Choose storage based on data type. SharedPreferences is useful for small settings, Hive can store lightweight local structured/key-value data, SQLite is suitable for relational/offline data, and secure storage should be used for sensitive tokens or credentials."
  },
  {
    "id": "q_25",
    "number": 25,
    "level": "Intermediate",
    "isPremium": true,
    "question": "SharedPreferences vs Hive vs SQLite.",
    "answer": "SharedPreferences: simple key-value preferences such as theme. Hive: lightweight local NoSQL/key-value storage. SQLite: relational database suited to complex structured data, queries, relationships, and offline-first applications."
  },
  {
    "id": "q_26",
    "number": 26,
    "level": "Intermediate",
    "isPremium": true,
    "question": "What is Dependency Injection?",
    "answer": "Dependency Injection means providing an object's dependencies from outside instead of constructing them internally. This reduces coupling and makes code easier to test, replace, and maintain. Riverpod, Provider, and get_it are common ways to manage dependencies in Flutter."
  },
  {
    "id": "q_27",
    "number": 27,
    "level": "Intermediate",
    "isPremium": true,
    "question": "How do you implement Firebase Authentication?",
    "answer": "Configure Firebase for the Flutter project, add Firebase Core and Firebase Auth packages, initialize Firebase, and call FirebaseAuth methods such as signInWithEmailAndPassword(). Authentication state can be observed to handle user session routing."
  },
  {
    "id": "q_28",
    "number": 28,
    "level": "Intermediate",
    "isPremium": true,
    "question": "How do Push Notifications work?",
    "answer": "Use Firebase Cloud Messaging (FCM). The app obtains an FCM registration token, associates it with the backend, and the backend sends messages through FCM. The app handles notifications in foreground, background, and terminated states. On iOS, delivery integrates with APNs."
  },
  {
    "id": "q_29",
    "number": 29,
    "level": "Intermediate",
    "isPremium": true,
    "question": "How do you upload images/files?",
    "answer": "Select or capture the file, validate size/type, create a multipart request, upload it to a backend or cloud storage, and store the returned URL/identifier. Dio and http can perform multipart uploads. Show progress indicators and handle retries."
  },
  {
    "id": "q_30",
    "number": 30,
    "level": "Intermediate",
    "isPremium": true,
    "question": "How do you optimize app performance?",
    "answer": "Use const widgets, avoid unnecessary rebuilds, keep expensive work out of build(), use lazy lists such as ListView.builder, optimize images, paginate datasets, dispose resources, move CPU-heavy work off the UI isolate, and profile using Flutter DevTools in profile/release mode."
  },
  {
    "id": "q_31",
    "number": 31,
    "level": "Advanced",
    "isPremium": true,
    "question": "Explain Flutter Rendering Pipeline.",
    "answer": "Widget configuration -> Element tree updates -> Render object updates -> Layout -> Paint -> Compositing -> Rasterization -> Display. Widgets are immutable configurations, Elements manage positions/relationships in the tree, and RenderObjects perform layout and painting."
  },
  {
    "id": "q_32",
    "number": 32,
    "level": "Advanced",
    "isPremium": true,
    "question": "How does the Skia Engine work?",
    "answer": "Skia is a 2D graphics library historically central to Flutter's rendering stack. Flutter produces drawing operations that are rasterized using platform graphics APIs. In modern Flutter, Impeller is increasingly used as the rendering engine."
  },
  {
    "id": "q_33",
    "number": 33,
    "level": "Advanced",
    "isPremium": true,
    "question": "What is Impeller?",
    "answer": "Impeller is Flutter's modern rendering engine designed for predictable graphics performance and reduced shader-compilation jank. It prepares rendering pipeline work ahead of time and uses modern platform graphics APIs such as Metal and Vulkan."
  },
  {
    "id": "q_34",
    "number": 34,
    "level": "Advanced",
    "isPremium": true,
    "question": "Explain Platform Channels.",
    "answer": "Platform Channels let Dart/Flutter communicate with native host code such as Kotlin/Java on Android and Swift/Objective-C on iOS. They are useful when an app needs a native platform API that is not available through a Flutter plugin."
  },
  {
    "id": "q_35",
    "number": 35,
    "level": "Advanced",
    "isPremium": true,
    "question": "MethodChannel vs EventChannel vs BasicMessageChannel.",
    "answer": "MethodChannel: method-call request/response communication. EventChannel: continuous streams of platform events such as sensor updates. BasicMessageChannel: general bidirectional message passing using codecs."
  },
  {
    "id": "q_36",
    "number": 36,
    "level": "Advanced",
    "isPremium": true,
    "question": "What is Pigeon in Flutter?",
    "answer": "Pigeon is a code-generation tool for creating type-safe communication APIs between Flutter and host-platform code. It reduces manual channel boilerplate, string-based mistakes, and type mismatches."
  },
  {
    "id": "q_37",
    "number": 37,
    "level": "Advanced",
    "isPremium": true,
    "question": "What are Isolates and compute()?",
    "answer": "Dart isolates provide concurrency with separate memory and event loops. They communicate through message passing instead of shared mutable memory. CPU-heavy work can be moved to another isolate using Flutter's compute() helper."
  },
  {
    "id": "q_38",
    "number": 38,
    "level": "Advanced",
    "isPremium": true,
    "question": "How do you prevent memory leaks?",
    "answer": "Dispose or cancel resources that outlive widgets, including AnimationController, TextEditingController, ScrollController, FocusNode, StreamSubscription, timers, and listeners. Avoid keeping unnecessary references to BuildContext."
  },
  {
    "id": "q_39",
    "number": 39,
    "level": "Advanced",
    "isPremium": true,
    "question": "How do you profile apps using Flutter DevTools?",
    "answer": "DevTools provides performance timelines, CPU profiling, memory analysis, network inspection, and widget rebuild info. Reproduce issues in profile mode, locate slow frames, fix rebuilds/allocations, and profile again."
  },
  {
    "id": "q_40",
    "number": 40,
    "level": "Advanced",
    "isPremium": true,
    "question": "Explain CustomPainter and Custom RenderObject.",
    "answer": "CustomPainter is used for custom canvas drawing such as charts, shapes, signatures, and progress graphics. Custom RenderObject is lower-level and gives control over layout, painting, hit testing, and semantics."
  },
  {
    "id": "q_41",
    "number": 41,
    "level": "Advanced",
    "isPremium": true,
    "question": "How do Deep Links work?",
    "answer": "Deep links allow a URI/URL to open a specific location inside an app. The app receives the incoming link, parses its route and parameters, and navigates to the appropriate screen (e.g., https://example.com/product/100)."
  },
  {
    "id": "q_42",
    "number": 42,
    "level": "Advanced",
    "isPremium": true,
    "question": "What are App Links and Universal Links?",
    "answer": "Android App Links and iOS Universal Links are verified HTTP/HTTPS links associated with an application. Domain/app association files are used by the operating system to verify ownership."
  },
  {
    "id": "q_43",
    "number": 43,
    "level": "Advanced",
    "isPremium": true,
    "question": "How do you secure API keys?",
    "answer": "Never assume a secret embedded in a mobile app is truly secret. Sensitive secrets should remain on a trusted backend. Client-side keys must be restricted using app identifiers, signing certificates, allowed APIs, quotas, or domains."
  },
  {
    "id": "q_44",
    "number": 44,
    "level": "Advanced",
    "isPremium": true,
    "question": "How do you implement SSL Pinning?",
    "answer": "Normal TLS validates a server certificate through the platform trust store. Pinning adds an extra check against an expected certificate or public-key identity in HttpClient/Dio to reduce man-in-the-middle risks."
  },
  {
    "id": "q_45",
    "number": 45,
    "level": "Advanced",
    "isPremium": true,
    "question": "Explain Flutter CI/CD.",
    "answer": "CI/CD automates analyze, test, build, signing, and deployment steps. A typical flow is: push code -> CI pipeline -> flutter analyze/tests -> build -> sign -> distribute/deploy. Common tools include GitHub Actions, Codemagic, Bitrise, and GitLab CI."
  },
  {
    "id": "q_46",
    "number": 46,
    "level": "Advanced",
    "isPremium": true,
    "question": "How do you reduce APK/IPA size?",
    "answer": "Remove unused assets/packages, resize and compress images, use Android App Bundles (.aab), split ABI where appropriate, and use Flutter's size-analysis tools (--analyze-size). Obfuscation and splitting debug info also reduce release build size."
  },
  {
    "id": "q_47",
    "number": 47,
    "level": "Advanced",
    "isPremium": true,
    "question": "How do you implement Feature Modules?",
    "answer": "Organize a large app by business feature (e.g., features/auth, features/home, features/profile). Each feature contains its own presentation, domain, and data layers. Feature-based modularization improves scalability and code separation."
  },
  {
    "id": "q_48",
    "number": 48,
    "level": "Advanced",
    "isPremium": true,
    "question": "Flutter Web limitations and optimization?",
    "answer": "Consider initial download size, browser compatibility, SEO requirements, and web plugin support. Optimize assets, lazy-load modules, paginate datasets, reduce unnecessary rebuilds, and test across desktop/mobile browsers."
  },
  {
    "id": "q_49",
    "number": 49,
    "level": "Advanced",
    "isPremium": true,
    "question": "Explain Clean Architecture in Flutter.",
    "answer": "Clean Architecture separates responsibilities into Presentation (UI & state management), Domain (entities, use cases, business rules), and Data (APIs, databases, DTOs, repositories). The goal is low coupling, testability, and maintainability."
  },
  {
    "id": "q_50",
    "number": 50,
    "level": "Advanced",
    "isPremium": true,
    "question": "What Flutter project are you most proud of, and why?",
    "answer": "A strong answer explains the project, your role, technologies, problem solved, architecture, and results. Example: I am proud of a real-world enterprise app where I implemented authentication, REST API layer, offline local storage, and clean architecture, demonstrating strong Flutter engineering skills."
  }
],
  roadmaps: {
  "free": [
    {
      "step": 1,
      "duration": "Week 1 - 2",
      "level": "Beginner",
      "title": "Dart 3 Fundamentals & Flutter Architecture",
      "topics": [
        "Dart Null Safety, Records, Pattern Matching & async/await",
        "StatelessWidget vs StatefulWidget & Lifecycle (initState, dispose)",
        "Widget Tree, Element Tree & RenderObject Architecture",
        "Basic Layouts: Row, Column, Container, Padding, SizedBox, Expanded"
      ]
    },
    {
      "step": 2,
      "duration": "Week 3 - 4",
      "level": "Beginner / Intermediate",
      "title": "UI Components & Form Validation Masterclass",
      "topics": [
        "Form & GlobalKey<FormState> with instant validation",
        "Custom Buttons, TextFields, Cards & Glassmorphic Surfaces",
        "ListView.builder, GridView.extent & CustomScrollView",
        "Top 20 Beginner & Intermediate Interview Q&A Practice"
      ]
    }
  ],
  "pro": [
    {
      "step": 3,
      "duration": "Week 5 - 6",
      "level": "Intermediate (Pro)",
      "title": "Advanced State Management & REST API Layer",
      "topics": [
        "Riverpod 2.x, BLoC 8.x, Cubit & Provider Production Architectures",
        "Dio / HTTP REST API client with interceptors & JWT auth",
        "JSON Serialization, Local Storage (Hive, SQLite, SecureStorage)",
        "Q21-Q30 Intermediate Interview Q&A (PRO Access)"
      ]
    },
    {
      "step": 4,
      "duration": "Week 7 - 8",
      "level": "Advanced (Pro)",
      "title": "Impeller Engine, Custom Painter & Clean Architecture",
      "topics": [
        "Impeller 2D Graphics, Skia vs Impeller rendering pipeline",
        "Platform Channels, MethodChannel & Pigeon Native Bindings",
        "Dart Isolates, compute() & Memory Leak Prevention via DevTools",
        "Clean Architecture (Presentation, Domain, Data) & Q31-Q50 Advanced Q&A"
      ]
    }
  ]
},

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
  },
  // ------------------------------------------------------------------------
  // JOBS, COMMUNITY, SCREENS, ANIMATIONS & DOWNLOADS DATASETS
  // ------------------------------------------------------------------------
  jobs: [
  {
    "id": "job_01",
    "company": "Google / Flutter Team",
    "location": "Remote (US/EU/India)",
    "title": "Senior Flutter Framework Engineer",
    "salary": "$140,000 - $180,000 / yr",
    "logoBg": "#38bdf8",
    "tags": [
      "Full Time",
      "Remote",
      "Engine"
    ],
    "applyUrl": "https://careers.google.com"
  },
  {
    "id": "job_02",
    "company": "Cred",
    "location": "Bengaluru, India (Hybrid)",
    "title": "Lead Mobile Architect (Flutter & iOS)",
    "salary": "₹45,00,000 - ₹65,00,000 / yr",
    "logoBg": "#a855f7",
    "tags": [
      "Full Time",
      "Hybrid",
      "Fintech"
    ],
    "applyUrl": "https://cred.club/careers"
  },
  {
    "id": "job_03",
    "company": "BMW Group",
    "location": "Munich, Germany / Remote",
    "title": "Flutter In-Vehicle Infotainment Developer",
    "salary": "€85,000 - €105,000 / yr",
    "logoBg": "#10b981",
    "tags": [
      "Full Time",
      "Automotive",
      "Metal/Vulkan"
    ],
    "applyUrl": "https://bmwgroup.jobs"
  },
  {
    "id": "job_04",
    "company": "Swiggy",
    "location": "Bengaluru / Remote",
    "title": "Senior Staff Flutter Engineer (Consumer App)",
    "salary": "₹40,00,000 - ₹55,00,000 / yr",
    "logoBg": "#f59e0b",
    "tags": [
      "Full Time",
      "High Scale",
      "Riverpod"
    ],
    "applyUrl": "https://careers.swiggy.com"
  },
  {
    "id": "job_05",
    "company": "Tencent",
    "location": "Singapore / Remote Asia",
    "title": "Principal Flutter Multi-Platform Architect",
    "salary": "$120,000 - $160,000 / yr",
    "logoBg": "#ec4899",
    "tags": [
      "Full Time",
      "Gaming & Web",
      "Impeller"
    ],
    "applyUrl": "https://careers.tencent.com"
  },
  {
    "id": "job_06",
    "company": "Razorpay",
    "location": "Bengaluru / Remote India",
    "title": "Flutter SDK & Payment Systems Engineer",
    "salary": "₹30,00,000 - ₹45,00,000 / yr",
    "logoBg": "#0284c7",
    "tags": [
      "Full Time",
      "SDK",
      "Security"
    ],
    "applyUrl": "https://razorpay.com/jobs"
  }
],
  communityGroups: [
  {
    "name": "All Discussions",
    "members": "5.2k"
  },
  {
    "name": "Riverpod 2.x",
    "members": "1.8k"
  },
  {
    "name": "Clean Architecture",
    "members": "2.4k"
  },
  {
    "name": "Impeller & Graphics",
    "members": "950"
  },
  {
    "name": "Jobs & Careers",
    "members": "3.1k"
  }
],
  screens: [
  {
    "id": "scr_01",
    "title": "Ecommerce Checkout & Order Summary",
    "description": "Complete multi-step checkout flow with Razorpay, UPI & saved credit card views.",
    "isPremium": true,
    "badge": "PRO",
    "code": "// Ecommerce Checkout Screen\nclass CheckoutScreen extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) => Scaffold(body: Center(child: Text('Checkout')));\n}"
  },
  {
    "id": "scr_02",
    "title": "SaaS Analytics Dashboard & Telemetry",
    "description": "High-density telemetry dashboard with responsive grid layouts and charts.",
    "isPremium": true,
    "badge": "PRO",
    "code": "// SaaS Dashboard Screen\nclass DashboardScreen extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) => Scaffold(body: Center(child: Text('Dashboard')));\n}"
  },
  {
    "id": "scr_03",
    "title": "Crypto Wallet Portfolio & Swap",
    "description": "Live asset price tracker with token swap bottom sheets and QR scanner.",
    "isPremium": false,
    "badge": "FREE",
    "code": "// Crypto Wallet Screen\nclass CryptoWalletScreen extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) => Scaffold(body: Center(child: Text('Crypto Wallet')));\n}"
  },
  {
    "id": "scr_04",
    "title": "Onboarding Wizard & Welcome Slides",
    "description": "Smooth pageview slides with progress indicators and animated skip/next actions.",
    "isPremium": false,
    "badge": "FREE",
    "code": "// Onboarding Screen\nclass OnboardingScreen extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) => Scaffold(body: Center(child: Text('Onboarding')));\n}"
  }
],
  animations: [
  {
    "id": "anim_01",
    "title": "Spring Physics Card Tilt",
    "category": "Physics",
    "description": "Smooth 3D gyroscope and pointer tilt physics for glassmorphic cards.",
    "code": "// Spring Physics Card Tilt\nTransform(\n  transform: Matrix4.identity()..setEntry(3, 2, 0.001)..rotateX(0.1),\n  child: Container(color: Colors.cyan),\n)"
  },
  {
    "id": "anim_02",
    "title": "Shimmer Skeleton Pulse Loader",
    "category": "Loading",
    "description": "High-performance shimmer gradient pulse for data loading placeholders.",
    "code": "// Shimmer Skeleton Loader\nShaderMask(\n  shaderCallback: (bounds) => LinearGradient(colors: [Colors.grey, Colors.white, Colors.grey]).createShader(bounds),\n  child: Container(color: Colors.white),\n)"
  },
  {
    "id": "anim_03",
    "title": "Floating Glass Island Dock Motion",
    "category": "Navigation",
    "description": "Mac OS style dock icon zoom and backdrop blur motion animation.",
    "code": "// Animated Glass Dock\nAnimatedContainer(\n  duration: const Duration(milliseconds: 300),\n  child: Icon(Icons.home),\n)"
  }
],
  stateManagement: [
  {
    "id": "sm_01",
    "title": "Riverpod 2.x AsyncNotifier & AutoDispose",
    "framework": "Riverpod",
    "description": "Production recipe for auto-refreshing REST API endpoints with family parameters.",
    "code": "@riverpod\nclass UserNotifier extends _$UserNotifier {\n  @override\n  FutureOr<User> build(String id) async => fetchUser(id);\n}"
  },
  {
    "id": "sm_02",
    "title": "BLoC 8.x Event-to-State Architecture",
    "framework": "BLoC",
    "description": "Explicit event mapping with Freezed state unions and predictable test coverage.",
    "code": "class AuthBloc extends Bloc<AuthEvent, AuthState> {\n  AuthBloc() : super(const AuthState.initial()) {\n    on<LoginRequested>(_onLogin);\n  }\n}"
  }
],
  projects: [
  {
    "id": "proj_01",
    "title": "FlutterHub Production Pro SaaS App",
    "description": "Complete production multi-platform web & mobile SaaS template with Razorpay & Auth.",
    "isPremium": true,
    "badge": "PRO",
    "pubspec": "name: flutterhub_pro\ndependencies:\n  flutter:\n    sdk: flutter\n  flutter_riverpod: ^2.5.1\n  dio: ^5.4.0"
  },
  {
    "id": "proj_02",
    "title": "Crypto & Stock Portfolio Manager",
    "description": "Full production crypto app with WebSocket live prices, charting & portfolio tracking.",
    "isPremium": true,
    "badge": "PRO",
    "pubspec": "name: crypto_portfolio\ndependencies:\n  flutter:\n    sdk: flutter\n  fl_chart: ^0.66.0"
  },
  {
    "id": "proj_03",
    "title": "E-Learning & Video Streaming Starter",
    "description": "Free open-source video course platform with custom player controls & offline downloads.",
    "isPremium": false,
    "badge": "FREE",
    "pubspec": "name: elearning_app\ndependencies:\n  flutter:\n    sdk: flutter\n  video_player: ^2.8.2"
  }
],
  documentation: [
  {
    "id": "doc_01",
    "title": "ListView.builder & Performance Optimization",
    "category": "Widgets",
    "isPremium": false,
    "description": "Lazy-rendering long lists to prevent memory bloat and achieve 120 FPS scrolling.",
    "bestPractices": "Always provide itemExtent or prototypeItem when list items have fixed height.",
    "performanceTips": "Avoid nesting ListView inside SingleChildScrollView without shrinkWrap and physics.",
    "exampleCode": "ListView.builder(\n  itemCount: 10000,\n  itemExtent: 72.0,\n  itemBuilder: (context, index) => ListTile(title: Text('Item $index')),\n);"
  },
  {
    "id": "doc_02",
    "title": "Impeller Engine & Metal / Vulkan Pipeline",
    "category": "Architecture",
    "isPremium": true,
    "description": "Understanding Flutter 3.x Impeller rendering pipeline and ahead-of-time shader compilation.",
    "bestPractices": "Use Impeller for zero-jank iOS and Android release builds.",
    "performanceTips": "Replace heavy opacity layers with color alpha values where possible.",
    "exampleCode": "// Enable Impeller in AndroidManifest.xml / Info.plist\n<key>FLTEnableImpeller</key>\n<true/>"
  }
],
  downloads: [
  {
    "id": "dl_01",
    "title": "Flutter 3.x Production Cheat Sheet (.pdf)",
    "description": "Quick reference guide covering Dart 3 patterns, Riverpod 2.x, BLoC & widget lifecycles.",
    "isPremium": false,
    "badge": "FREE",
    "fileSize": "2.4 MB"
  },
  {
    "id": "dl_02",
    "title": "Clean Architecture Production Starter Kit (.zip)",
    "description": "Complete folder structure with presentation, domain & data layers ready for deployment.",
    "isPremium": true,
    "badge": "PRO",
    "fileSize": "14.8 MB"
  },
  {
    "id": "dl_03",
    "title": "Senior Flutter Developer Resume & Portfolio Template (.docx)",
    "description": "ATS-optimized resume template tailored for high-paying remote Flutter roles.",
    "isPremium": true,
    "badge": "PRO",
    "fileSize": "1.1 MB"
  }
],

};
