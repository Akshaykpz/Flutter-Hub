/* ==========================================================================
   FlutterHub Core Data Store - Unified Data Architecture
   ========================================================================== */

const FLUTTER_DATA = {
  "categories": [
    {
      "id": "buttons",
      "name": "Buttons & Action",
      "enabled": true
    },
    {
      "id": "textfields",
      "name": "TextFields & Forms",
      "enabled": true
    },
    {
      "id": "cards",
      "name": "Cards & Surfaces",
      "enabled": true
    },
    {
      "id": "lists",
      "name": "Lists & ListTile",
      "enabled": true
    },
    {
      "id": "dialogs",
      "name": "Dialogs & Modals",
      "enabled": true
    },
    {
      "id": "bottom_sheets",
      "name": "Bottom Sheets",
      "enabled": true
    },
    {
      "id": "snackbars",
      "name": "SnackBars & Toast",
      "enabled": true
    },
    {
      "id": "appbar",
      "name": "AppBar & SliverAppBar",
      "enabled": true
    },
    {
      "id": "nav_bars",
      "name": "BottomNavigationBar & Navigation",
      "enabled": true
    },
    {
      "id": "drawers",
      "name": "NavigationDrawer & Drawers",
      "enabled": true
    },
    {
      "id": "tabs",
      "name": "Tabs & TabBar",
      "enabled": true
    },
    {
      "id": "dropdowns",
      "name": "Dropdowns & Menus",
      "enabled": true
    },
    {
      "id": "checkboxes",
      "name": "Checkboxes & Switches",
      "enabled": true
    },
    {
      "id": "radios",
      "name": "Radio Buttons & Choice",
      "enabled": true
    },
    {
      "id": "sliders",
      "name": "Sliders & RangeSliders",
      "enabled": true
    },
    {
      "id": "progress",
      "name": "Loading & Progress",
      "enabled": true
    },
    {
      "id": "gridview",
      "name": "GridView",
      "enabled": true
    },
    {
      "id": "listview",
      "name": "ListView",
      "enabled": true
    },
    {
      "id": "images",
      "name": "Images & Gallery",
      "enabled": true
    },
    {
      "id": "animations",
      "name": "Animations",
      "enabled": true
    },
    {
      "id": "pickers",
      "name": "Date & Time Pickers",
      "enabled": true
    },
    {
      "id": "chips",
      "name": "Chips & Tags",
      "enabled": true
    },
    {
      "id": "search_bars",
      "name": "Search",
      "enabled": true
    },
    {
      "id": "expansion",
      "name": "ExpansionTile",
      "enabled": true
    },
    {
      "id": "pageview",
      "name": "PageView / Carousel",
      "enabled": true
    },
    {
      "id": "fab",
      "name": "FloatingActionButton",
      "enabled": true
    },
    {
      "id": "badges",
      "name": "Badges",
      "enabled": true
    },
    {
      "id": "tooltips",
      "name": "Tooltips",
      "enabled": true
    },
    {
      "id": "layouts",
      "name": "Layouts",
      "enabled": true
    }
  ],
  "components": [
    {
      "id": "comp_btn_01",
      "title": "Aceternity Glassmorphism Neo Button",
      "category": "buttons",
      "isPremium": false,
      "badge": "Free",
      "description": "Backdrop blurred glassmorphism button with dynamic gradient borders and tactile hover animation.",
      "dependencies": [
        "flutter/material.dart",
        "dart:ui"
      ],
      "simType": "sim_btn_01",
      "code": "// Aceternity Glassmorphism Button\nClipRRect(\n  borderRadius: BorderRadius.circular(16),\n  child: BackdropFilter(\n    filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),\n    child: Container(\n      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),\n      decoration: BoxDecoration(\n        color: Colors.white.withOpacity(0.1),\n        borderRadius: BorderRadius.circular(16),\n        border: Border.all(color: Colors.white.withOpacity(0.2)),\n      ),\n      child: const Text('Aceternity Neo Button', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n    ),\n  ),\n)"
    },
    {
      "id": "comp_btn_02",
      "title": "Gradient Pulse CTA Action Button",
      "category": "buttons",
      "isPremium": true,
      "badge": "PRO",
      "description": "High-converting action button featuring animated gradient glowing aura and press ripple animation.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_btn_02",
      "code": "// Gradient Pulse CTA Button\nContainer(\n  decoration: BoxDecoration(\n    borderRadius: BorderRadius.circular(30),\n    gradient: const LinearGradient(colors: [Color(0xFF38BDF8), Color(0xFF8B5CF6)]),\n    boxShadow: [BoxShadow(color: const Color(0xFF8B5CF6).withOpacity(0.4), blurRadius: 20, offset: const Offset(0, 8))],\n  ),\n  child: ElevatedButton(\n    style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent, padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16)),\n    onPressed: () {},\n    child: const Text('Unlock Access 🚀', style: TextStyle(fontSize: 16, fontWeight: FontWeight.extrabold, color: Colors.white)),\n  ),\n)"
    },
    {
      "id": "comp_btn_03",
      "title": "Neumorphic Dual-State Interactive Button",
      "category": "buttons",
      "isPremium": false,
      "badge": "Free",
      "description": "Tactile dark-mode neumorphic button with interactive pressed/unpressed shadow inset toggle.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_btn_03",
      "code": "// Neumorphic Dual-State Button\nGestureDetector(\n  onTap: () {},\n  child: AnimatedContainer(\n    duration: const Duration(milliseconds: 150),\n    padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),\n    decoration: BoxDecoration(\n      color: const Color(0xFF0F172A),\n      borderRadius: BorderRadius.circular(16),\n      boxShadow: const [\n        BoxShadow(color: Color(0xFF1E293B), offset: Offset(-4, -4), blurRadius: 10),\n        BoxShadow(color: Color(0xFF020617), offset: Offset(4, 4), blurRadius: 10),\n      ],\n    ),\n    child: const Text('Tactile Button', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold)),\n  ),\n)"
    },
    {
      "id": "comp_btn_04",
      "title": "Icon Loading State Button with Spinner",
      "category": "buttons",
      "isPremium": true,
      "badge": "PRO",
      "description": "Smart action button that switches seamlessly into an inline loading spinner state upon click.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_btn_04",
      "code": "// Loading Spinner Action Button\nElevatedButton.icon(\n  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14)),\n  onPressed: () {},\n  icon: const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)),\n  label: const Text('Processing...'),\n)"
    },
    {
      "id": "comp_btn_05",
      "title": "Cupertino Bouncy Tactile Button",
      "category": "buttons",
      "isPremium": false,
      "badge": "Free",
      "description": "iOS Cupertino styled interactive button with spring scale feedback when tapped.",
      "dependencies": [
        "flutter/cupertino.dart"
      ],
      "simType": "sim_btn_05",
      "code": "// Cupertino Bouncy Button\nCupertinoButton.filled(\n  borderRadius: BorderRadius.circular(20),\n  onPressed: () {},\n  child: const Text('Cupertino Action'),\n)"
    },
    {
      "id": "comp_txt_01",
      "title": "Glass Floating Label Email Input",
      "category": "textfields",
      "isPremium": false,
      "badge": "Free",
      "description": "Sleek glassmorphic text input with animated floating label and prefix icon highlight.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_txt_01",
      "code": "// Glass Floating Label Email Field\nTextField(\n  decoration: InputDecoration(\n    labelText: 'Email Address',\n    prefixIcon: const Icon(Icons.email_outlined, color: Colors.cyan),\n    filled: true,\n    fillColor: Colors.white.withOpacity(0.05),\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Colors.white24)),\n  ),\n)"
    },
    {
      "id": "comp_txt_02",
      "title": "6-Digit Auto-Focus OTP Verification Input",
      "category": "textfields",
      "isPremium": true,
      "badge": "PRO",
      "description": "Production-ready 6-digit pin code entry form with auto-focus transition and numerical formatting.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_txt_02",
      "code": "// 6-Digit OTP Pin Input\nRow(\n  mainAxisAlignment: MainAxisAlignment.spaceEvenly,\n  children: List.generate(6, (index) => SizedBox(\n    width: 42,\n    child: TextField(\n      textAlign: TextAlign.center,\n      keyboardType: TextInputType.number,\n      maxLength: 1,\n      decoration: InputDecoration(counterText: '', border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),\n    ),\n  )),\n)"
    },
    {
      "id": "comp_txt_03",
      "title": "Password Input with Eye Visibility Toggle",
      "category": "textfields",
      "isPremium": false,
      "badge": "Free",
      "description": "Secure password field featuring instant show/hide obscure text toggle button.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_txt_03",
      "code": "// Password Field with Eye Toggle\nStatefulBuilder(\n  builder: (context, setState) {\n    bool obscure = true;\n    return TextField(\n      obscureText: obscure,\n      decoration: InputDecoration(\n        labelText: 'Password',\n        prefixIcon: const Icon(Icons.lock_outline),\n        suffixIcon: IconButton(\n          icon: Icon(obscure ? Icons.visibility_off : Icons.visibility),\n          onPressed: () => setState(() => obscure = !obscure),\n        ),\n      ),\n    );\n  }\n)"
    },
    {
      "id": "comp_txt_04",
      "title": "Search Input with Auto-Suggest Clear Button",
      "category": "textfields",
      "isPremium": true,
      "badge": "PRO",
      "description": "Pill-shaped live search input box with dynamic one-tap clear content action.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_txt_04",
      "code": "// Live Search Input\nTextField(\n  decoration: InputDecoration(\n    hintText: 'Search Flutter widgets...',\n    prefixIcon: const Icon(Icons.search, color: Colors.cyan),\n    suffixIcon: const Icon(Icons.cancel_outlined, color: Colors.grey),\n    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(30)),\n  ),\n)"
    },
    {
      "id": "comp_txt_05",
      "title": "Credit Card Formatted Number Input",
      "category": "textfields",
      "isPremium": false,
      "badge": "Free",
      "description": "Numeric text input with card brand icon indicator and auto-spaced card formatting.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_txt_05",
      "code": "// Credit Card Input\nTextField(\n  keyboardType: TextInputType.number,\n  decoration: InputDecoration(\n    hintText: '4532 •••• •••• 8921',\n    prefixIcon: const Icon(Icons.credit_card, color: Colors.blueAccent),\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),\n  ),\n)"
    },
    {
      "id": "comp_txt_06",
      "title": "Multiline Expandable Comment Box",
      "category": "textfields",
      "isPremium": true,
      "badge": "PRO",
      "description": "Auto-expanding multiline text field with character count limit badge and quick send action.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_txt_06",
      "code": "// Expandable Comment Box\nTextField(\n  maxLines: 4,\n  minLines: 2,\n  decoration: InputDecoration(\n    hintText: 'Write a detailed review...',\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),\n  ),\n)"
    },
    {
      "id": "comp_card_01",
      "title": "Bento Grid Telemetry Metric Card",
      "category": "cards",
      "isPremium": false,
      "badge": "Free",
      "description": "Modern SaaS Bento grid card surface featuring live indicator pills and metric stats.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_card_01",
      "code": "// Bento Grid Telemetry Card\nContainer(\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(\n    color: const Color(0xFF0F172A),\n    borderRadius: BorderRadius.circular(20),\n    border: Border.all(color: Colors.cyan.withOpacity(0.3)),\n  ),\n  child: Column(\n    crossAxisAlignment: CrossAxisAlignment.start,\n    children: const [\n      Icon(Icons.grid_view_rounded, color: Colors.cyan),\n      SizedBox(height: 12),\n      Text('Telemetry Insights', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n    ],\n  ),\n)"
    },
    {
      "id": "comp_card_02",
      "title": "Modern Checkout Order Summary Card",
      "category": "cards",
      "isPremium": true,
      "badge": "PRO",
      "description": "E-commerce order checkout card showing subtotal calculation, tax breakdown, and pay button.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_card_02",
      "code": "// Modern Checkout Order Card\nContainer(\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(24)),\n  child: Column(\n    children: const [\n      Text('Total Payment', style: TextStyle(color: Colors.grey)),\n      Text('₹1,499.00', style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),\n    ],\n  ),\n)"
    },
    {
      "id": "comp_card_03",
      "title": "Glassmorphism User Profile Hero Card",
      "category": "cards",
      "isPremium": false,
      "badge": "Free",
      "description": "Frosted glass hero card layout with avatar badge, bio tags, and action buttons.",
      "dependencies": [
        "flutter/material.dart",
        "dart:ui"
      ],
      "simType": "sim_card_03",
      "code": "// Glassmorphism Profile Hero Card\nClipRRect(\n  borderRadius: BorderRadius.circular(24),\n  child: BackdropFilter(\n    filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),\n    child: Container(\n      padding: const EdgeInsets.all(20),\n      color: Colors.white.withOpacity(0.08),\n      child: const ListTile(\n        leading: CircleAvatar(child: Text('AR')),\n        title: Text('Alex Rivera', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n        subtitle: Text('Senior Flutter Architect'),\n      ),\n    ),\n  ),\n)"
    },
    {
      "id": "comp_card_04",
      "title": "Crypto Wallet Balance Card with Glow",
      "category": "cards",
      "isPremium": true,
      "badge": "PRO",
      "description": "Fintech crypto balance card featuring radial ambient gradient background and sparkline curve.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_card_04",
      "code": "// Crypto Wallet Balance Card\nContainer(\n  padding: const EdgeInsets.all(22),\n  decoration: BoxDecoration(\n    gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFFA855F7)]),\n    borderRadius: BorderRadius.circular(24),\n    boxShadow: [BoxShadow(color: Colors.indigo.withOpacity(0.4), blurRadius: 20)],\n  ),\n  child: Column(\n    crossAxisAlignment: CrossAxisAlignment.start,\n    children: const [\n      Text('Total Balance', style: TextStyle(color: Colors.white70)),\n      Text('3.482 ETH ($11,492.20)', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),\n    ],\n  ),\n)"
    },
    {
      "id": "comp_card_05",
      "title": "3D Interactive Flip Card Surface",
      "category": "cards",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive card widget that flips smoothly to reveal extra details on the back upon tap.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_card_05",
      "code": "// 3D Interactive Flip Card\nContainer(\n  height: 160,\n  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),\n  child: const Center(child: Text('Tap to Flip Card 🔄', style: TextStyle(color: Colors.white))),\n)"
    },
    {
      "id": "comp_list_01",
      "title": "Slidable ListTile with Archive & Delete Actions",
      "category": "lists",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive swipeable list item revealing quick action buttons for archive and delete.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_list_01",
      "code": "// Slidable ListTile Action\nDismissible(\n  key: const Key('item_1'),\n  background: Container(color: Colors.green, child: const Icon(Icons.archive)),\n  secondaryBackground: Container(color: Colors.red, child: const Icon(Icons.delete)),\n  child: const ListTile(title: Text('Inbox Notification'), subtitle: Text('Swipe left/right for quick actions')),\n)"
    },
    {
      "id": "comp_list_02",
      "title": "User Avatar Contact ListTile with Online Badge",
      "category": "lists",
      "isPremium": true,
      "badge": "PRO",
      "description": "Messaging contact tile displaying status indicator dot, timestamp, and message preview.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_list_02",
      "code": "// Contact ListTile\nListTile(\n  leading: const CircleAvatar(backgroundColor: Colors.cyan, child: Text('FH')),\n  title: const Text('FlutterHub Team', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n  subtitle: const Text('Online • New component released'),\n  trailing: const Icon(Icons.chevron_right, color: Colors.grey),\n)"
    },
    {
      "id": "comp_list_03",
      "title": "Settings Toggle ListTile with Switch",
      "category": "lists",
      "isPremium": false,
      "badge": "Free",
      "description": "Clean preference settings list item featuring icon avatar and trailing toggle switch.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_list_03",
      "code": "// Settings Switch ListTile\nSwitchListTile(\n  title: const Text('Push Notifications', style: TextStyle(color: Colors.white)),\n  subtitle: const Text('Receive instant widget release alerts'),\n  value: true,\n  onChanged: (val) {},\n)"
    },
    {
      "id": "comp_list_04",
      "title": "Transaction History ListTile with Status Badge",
      "category": "lists",
      "isPremium": true,
      "badge": "PRO",
      "description": "Financial ledger transaction tile with direction icon, date, and formatted currency amount.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_list_04",
      "code": "// Transaction History ListTile\nListTile(\n  leading: const Icon(Icons.arrow_downward, color: Colors.green),\n  title: const Text('Payment Received'),\n  subtitle: const Text('Aug 06, 2026'),\n  trailing: const Text('+ ₹1,499.00', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),\n)"
    },
    {
      "id": "comp_dlg_01",
      "title": "Basic Material Alert Dialog",
      "category": "dialogs",
      "isPremium": false,
      "badge": "Free",
      "description": "Standard Material alert notification dialog with message text and OK dismiss button.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_dlg_01",
      "code": "// Basic Material Alert Dialog\nshowDialog(\n  context: context,\n  builder: (context) => AlertDialog(\n    title: const Text('Simple Alert'),\n    content: const Text('This is a standard Material alert dialog message.'),\n    actions: [\n      TextButton(\n        onPressed: () => Navigator.pop(context),\n        child: const Text('OK'),\n      ),\n    ],\n  ),\n);"
    },
    {
      "id": "comp_dlg_02",
      "title": "Confirmation Action Dialog",
      "category": "dialogs",
      "isPremium": true,
      "badge": "PRO",
      "description": "Interactive confirmation dialog with warning icon, message details, and Cancel/Delete actions.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_dlg_02",
      "code": "// Confirmation Action Dialog with Warning\nshowDialog(\n  context: context,\n  builder: (context) => AlertDialog(\n    icon: const Icon(Icons.warning_amber_rounded, color: Colors.amber, size: 36),\n    title: const Text('Delete Resource?'),\n    content: const Text('This action is permanent and cannot be undone.'),\n    actions: [\n      TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),\n      ElevatedButton(\n        style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),\n        onPressed: () => Navigator.pop(context),\n        child: const Text('Delete'),\n      ),\n    ],\n  ),\n);"
    },
    {
      "id": "comp_dlg_03",
      "title": "Custom Rounded Success Dialog",
      "category": "dialogs",
      "isPremium": false,
      "badge": "Free",
      "description": "Custom rounded celebration dialog with green check icon badge and transaction confirmation.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_dlg_03",
      "code": "// Custom Rounded Success Dialog\nshowDialog(\n  context: context,\n  builder: (context) => Dialog(\n    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),\n    child: Padding(\n      padding: const EdgeInsets.all(24),\n      child: Column(\n        mainAxisSize: MainAxisSize.min,\n        children: [\n          const CircleAvatar(radius: 28, backgroundColor: Color(0xFF10B981), child: Icon(Icons.check, color: Colors.white, size: 32)),\n          const SizedBox(height: 16),\n          const Text('Payment Confirmed!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),\n          const SizedBox(height: 8),\n          const Text('Transaction #89210 completed successfully.', style: TextStyle(color: Colors.grey)),\n          const SizedBox(height: 16),\n          ElevatedButton(onPressed: () => Navigator.pop(context), child: const Text('Done')),\n        ],\n      ),\n    ),\n  ),\n);"
    },
    {
      "id": "comp_sheet_01",
      "title": "Standard Modal Bottom Sheet",
      "category": "bottom_sheets",
      "isPremium": false,
      "badge": "Free",
      "description": "Standard modal bottom sheet featuring top handle indicator, share actions, and list items.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_sheet_01",
      "code": "// Standard Modal Bottom Sheet\nshowModalBottomSheet(\n  context: context,\n  shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),\n  builder: (context) => Container(\n    padding: const EdgeInsets.all(20),\n    child: Column(\n      mainAxisSize: MainAxisSize.min,\n      children: [\n        Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey, borderRadius: BorderRadius.circular(2))),\n        const SizedBox(height: 16),\n        const ListTile(leading: Icon(Icons.share), title: Text('Share Link')),\n        const ListTile(leading: Icon(Icons.copy), title: Text('Copy to Clipboard')),\n      ],\n    ),\n  ),\n);"
    },
    {
      "id": "comp_sheet_02",
      "title": "Draggable Scrollable Bottom Sheet",
      "category": "bottom_sheets",
      "isPremium": true,
      "badge": "PRO",
      "description": "Expandable DraggableScrollableSheet container with scrollable list items and payment choices.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_sheet_02",
      "code": "// Draggable Scrollable Bottom Sheet\nDraggableScrollableSheet(\n  initialChildSize: 0.4,\n  minChildSize: 0.2,\n  maxChildSize: 0.85,\n  builder: (context, scrollController) => Container(\n    decoration: const BoxDecoration(\n      color: Color(0xFF0F172A),\n      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),\n    ),\n    child: ListView.builder(\n      controller: scrollController,\n      itemCount: 15,\n      itemBuilder: (context, index) => ListTile(title: Text('Payment Option $index')),\n    ),\n  ),\n);"
    },
    {
      "id": "comp_snack_01",
      "title": "Basic Text SnackBar",
      "category": "snackbars",
      "isPremium": false,
      "badge": "Free",
      "description": "Simple floating text message SnackBar with automatic dismiss timer.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_snack_01",
      "code": "// Basic Text SnackBar\nScaffoldMessenger.of(context).showSnackBar(\n  const SnackBar(\n    content: Text('Changes saved successfully.'),\n    duration: Duration(seconds: 2),\n  ),\n);"
    },
    {
      "id": "comp_snack_02",
      "title": "Action SnackBar with Undo",
      "category": "snackbars",
      "isPremium": true,
      "badge": "PRO",
      "description": "Interactive SnackBar notification featuring a highlighted UNDO action button.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_snack_02",
      "code": "// Interactive Action SnackBar with Undo\nScaffoldMessenger.of(context).showSnackBar(\n  SnackBar(\n    content: const Text('Item deleted from library'),\n    backgroundColor: const Color(0xFF1E293B),\n    action: SnackBarAction(\n      label: 'UNDO',\n      textColor: const Color(0xFFF59E0B),\n      onPressed: () {\n        // Restore deleted item logic\n      },\n    ),\n  ),\n);"
    },
    {
      "id": "comp_appbar_01",
      "title": "Standard Material AppBar",
      "category": "appbar",
      "isPremium": false,
      "badge": "Free",
      "description": "Classic Material 3 top app bar with navigation drawer icon, title, and action icons.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_appbar_01",
      "code": "// Standard Material 3 AppBar\nAppBar(\n  leading: IconButton(icon: const Icon(Icons.menu), onPressed: () {}),\n  title: const Text('Dashboard'),\n  actions: [\n    IconButton(icon: const Icon(Icons.search), onPressed: () {}),\n    IconButton(icon: const Icon(Icons.more_vert), onPressed: () {}),\n  ],\n);"
    },
    {
      "id": "comp_appbar_02",
      "title": "Collapsible SliverAppBar",
      "category": "appbar",
      "isPremium": true,
      "badge": "PRO",
      "description": "Dynamic scrollable SliverAppBar expanding into a gradient hero header and collapsing on scroll.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_appbar_02",
      "code": "// Collapsible SliverAppBar with FlexibleSpace\nCustomScrollView(\n  slivers: [\n    SliverAppBar(\n      expandedHeight: 180.0,\n      floating: false,\n      pinned: true,\n      flexibleSpace: FlexibleSpaceBar(\n        title: const Text('Sliver Library'),\n        background: Container(\n          decoration: const BoxDecoration(\n            gradient: LinearGradient(colors: [Color(0xFF38BDF8), Color(0xFF8B5CF6)]),\n          ),\n        ),\n      ),\n    ),\n  ],\n);"
    },
    {
      "id": "comp_nav_01",
      "title": "Material BottomNavigationBar",
      "category": "nav_bars",
      "isPremium": false,
      "badge": "Free",
      "description": "Standard Material 3 bottom navigation bar with active tab icon highlighting and labels.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_nav_01",
      "code": "// Standard Material BottomNavigationBar\nBottomNavigationBar(\n  currentIndex: _selectedIndex,\n  onTap: (index) => setState(() => _selectedIndex = index),\n  selectedItemColor: const Color(0xFF38BDF8),\n  unselectedItemColor: Colors.grey,\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),\n    BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),\n    BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),\n  ],\n);"
    },
    {
      "id": "comp_nav_02",
      "title": "Floating Glassmorphism Navigation Dock",
      "category": "nav_bars",
      "isPremium": true,
      "badge": "PRO",
      "description": "MacOS/iOS floating navigation bar with frosted glass backdrop blur and active aura indicator.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_nav_02",
      "code": "// Floating Glassmorphism Navigation Dock\nContainer(\n  margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),\n  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),\n  decoration: BoxDecoration(\n    color: Colors.white.withOpacity(0.08),\n    borderRadius: BorderRadius.circular(30),\n    border: Border.all(color: Colors.white24),\n  ),\n  child: Row(\n    mainAxisAlignment: MainAxisAlignment.spaceAround,\n    children: [\n      IconButton(icon: const Icon(Icons.home, color: Color(0xFF38BDF8)), onPressed: () {}),\n      IconButton(icon: const Icon(Icons.bolt, color: Colors.white), onPressed: () {}),\n      IconButton(icon: const Icon(Icons.favorite, color: Colors.white), onPressed: () {}),\n      IconButton(icon: const Icon(Icons.settings, color: Colors.white), onPressed: () {}),\n    ],\n  ),\n);"
    },
    {
      "id": "comp_drawer_01",
      "title": "Blurred Glass Side Navigation Drawer",
      "category": "drawers",
      "isPremium": false,
      "badge": "Free",
      "description": "Collapsible side navigation drawer with glassmorphism blur and profile header.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_drawer_01",
      "code": "// Glass Side Navigation Drawer\nDrawer(\n  child: ListView(\n    children: const [\n      DrawerHeader(child: Text('FlutterHub Navigation')),\n      ListTile(leading: Icon(Icons.home), title: Text('Home')),\n    ],\n  ),\n)"
    },
    {
      "id": "comp_tab_01",
      "title": "Segmented Pill Tab Controller",
      "category": "tabs",
      "isPremium": false,
      "badge": "Free",
      "description": "iOS/Mac styled Segmented Tab Controller using a solid filled background pill active state.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_tab_01",
      "code": "// Segmented Pill Tab Controller\nContainer(\n  padding: const EdgeInsets.all(4),\n  decoration: BoxDecoration(\n    color: const Color(0xFF1E293B),\n    borderRadius: BorderRadius.circular(24),\n  ),\n  child: Row(\n    children: [\n      Expanded(\n        child: Container(\n          alignment: Alignment.center,\n          padding: const EdgeInsets.symmetric(vertical: 8),\n          decoration: BoxDecoration(\n            color: const Color(0xFF38BDF8),\n            borderRadius: BorderRadius.circular(20),\n          ),\n          child: const Text('Overview', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n        ),\n      ),\n      Expanded(\n        child: Container(\n          alignment: Alignment.center,\n          padding: const EdgeInsets.symmetric(vertical: 8),\n          child: const Text('Dart Code', style: TextStyle(color: Colors.grey)),\n        ),\n      ),\n    ],\n  ),\n)"
    },
    {
      "id": "comp_tab_02",
      "title": "Animated Underline Material TabBar",
      "category": "tabs",
      "isPremium": true,
      "badge": "PRO",
      "description": "Classic Material 3 TabBar featuring an animated horizontal underline indicator line.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_tab_02",
      "code": "// Animated Underline Material TabBar\nTabBar(\n  controller: _tabController,\n  indicatorColor: const Color(0xFF38BDF8),\n  indicatorWeight: 3.0,\n  labelColor: const Color(0xFF38BDF8),\n  unselectedLabelColor: Colors.grey,\n  tabs: const [\n    Tab(text: 'Overview'),\n    Tab(text: 'Preview'),\n    Tab(text: 'Code'),\n  ],\n)"
    },
    {
      "id": "comp_drop_01",
      "title": "Glassmorphism Animated Dropdown Selector",
      "category": "dropdowns",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive dropdown menu field displaying selected value and smooth options menu.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_drop_01",
      "code": "// Dropdown Button Selector\nDropdownButtonFormField<String>(\n  value: 'Flutter 3.x',\n  items: const [\n    DropdownMenuItem(value: 'Flutter 3.x', child: Text('Flutter 3.x')),\n    DropdownMenuItem(value: 'Dart 3.5', child: Text('Dart 3.5')),\n  ],\n  onChanged: (val) {},\n)"
    },
    {
      "id": "comp_chk_01",
      "title": "Animated Neumorphic Toggle Switch",
      "category": "checkboxes",
      "isPremium": false,
      "badge": "Free",
      "description": "Custom interactive toggle switch with smooth glowing thumb motion and ON/OFF indicator.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_chk_01",
      "code": "// Animated Toggle Switch\nStatefulBuilder(\n  builder: (context, setState) {\n    bool active = true;\n    return Switch(\n      value: active,\n      activeColor: Colors.cyan,\n      onChanged: (val) => setState(() => active = val),\n    );\n  }\n)"
    },
    {
      "id": "comp_chk_02",
      "title": "Custom Animated Checkbox Tile",
      "category": "checkboxes",
      "isPremium": true,
      "badge": "PRO",
      "description": "Interactive checkbox widget featuring checkmark spring animation and title label.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_chk_02",
      "code": "// Checkbox ListTile Widget\nCheckboxListTile(\n  title: const Text('Enable Auto Update'),\n  value: true,\n  activeColor: Colors.cyan,\n  onChanged: (val) {},\n)"
    },
    {
      "id": "comp_rad_01",
      "title": "Choice Card Radio Selector",
      "category": "radios",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive radio selection group styled as selectable choice card tiles.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_rad_01",
      "code": "// Choice Card Radio Group\nRow(\n  children: [\n    ChoiceChip(label: Text('Monthly'), selected: true, selectedColor: Colors.cyan),\n    SizedBox(width: 8),\n    ChoiceChip(label: Text('Yearly'), selected: false),\n  ],\n)"
    },
    {
      "id": "comp_sld_01",
      "title": "Dual-Thumb Price RangeSlider",
      "category": "sliders",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive dual-thumb range slider updating live minimum and maximum numerical values.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_sld_01",
      "code": "// Dual Thumb RangeSlider\nRangeSlider(\n  values: const RangeValues(20, 80),\n  min: 0,\n  max: 100,\n  activeColor: Colors.cyan,\n  onChanged: (values) {},\n)"
    },
    {
      "id": "comp_sld_02",
      "title": "Gradient Volume & Brightness Slider",
      "category": "sliders",
      "isPremium": true,
      "badge": "PRO",
      "description": "Interactive horizontal slider widget featuring gradient fill track and live percentage readout.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_sld_02",
      "code": "// Volume Slider\nSlider(\n  value: 0.75,\n  activeColor: Colors.purpleAccent,\n  onChanged: (val) {},\n)"
    },
    {
      "id": "comp_prg_01",
      "title": "Skeleton Shimmer Pulse Loading Card",
      "category": "progress",
      "isPremium": false,
      "badge": "Free",
      "description": "Animated shimmer skeleton loader placeholder for cards and text content.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_prg_01",
      "code": "// Skeleton Shimmer Loading\nContainer(\n  padding: const EdgeInsets.all(16),\n  decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(16)),\n  child: Row(\n    children: [\n      Container(width: 40, height: 40, color: Colors.white24),\n      const SizedBox(width: 12),\n      Expanded(child: Container(height: 16, color: Colors.white24)),\n    ],\n  ),\n)"
    },
    {
      "id": "comp_prg_02",
      "title": "Circular Gradient Percentage Indicator",
      "category": "progress",
      "isPremium": true,
      "badge": "PRO",
      "description": "Circular progress ring featuring gradient stroke and center percentage value text.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_prg_02",
      "code": "// Circular Percentage Indicator\nCircularProgressIndicator(\n  value: 0.75,\n  strokeWidth: 6,\n  color: Colors.cyan,\n  backgroundColor: Colors.white10,\n)"
    },
    {
      "id": "comp_grid_01",
      "title": "Staggered Pinterest Masonry Grid",
      "category": "gridview",
      "isPremium": false,
      "badge": "Free",
      "description": "Dynamic Masonry grid view layout displaying mixed height cards with rounded corners.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_grid_01",
      "code": "// GridView Builder Widget\nGridView.builder(\n  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 10, mainAxisSpacing: 10),\n  itemCount: 4,\n  itemBuilder: (context, index) => Container(color: Colors.white10, child: Center(child: Text('Item $index'))),\n)"
    },
    {
      "id": "comp_lvw_01",
      "title": "Grouped Sticky Header ListView",
      "category": "listview",
      "isPremium": false,
      "badge": "Free",
      "description": "Categorized list view featuring sticky date section headers and custom row items.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_lvw_01",
      "code": "// ListView Separated\nListView.separated(\n  itemCount: 5,\n  separatorBuilder: (context, index) => const Divider(),\n  itemBuilder: (context, index) => ListTile(title: Text('List Item #$index')),\n)"
    },
    {
      "id": "comp_img_01",
      "title": "Glass Blur Image Preview with Hero Animation",
      "category": "images",
      "isPremium": false,
      "badge": "Free",
      "description": "Rounded image widget with subtle backdrop blur overlay badge and zoom capability.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_img_01",
      "code": "// Glass Image Card\nClipRRect(\n  borderRadius: BorderRadius.circular(20),\n  child: Container(\n    color: const Color(0xFF1E293B),\n    child: const Icon(Icons.image, size: 60, color: Colors.cyan),\n  ),\n)"
    },
    {
      "id": "comp_anim_01",
      "title": "Spring Physics Bouncy Container",
      "category": "animations",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive widget container driven by spring damping physics for touch response.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_anim_01",
      "code": "// Spring Physics Animation Container\nAnimatedContainer(\n  duration: const Duration(milliseconds: 300),\n  curve: Curves.elasticOut,\n  decoration: BoxDecoration(color: Colors.cyan, borderRadius: BorderRadius.circular(16)),\n)"
    },
    {
      "id": "comp_pick_01",
      "title": "Glassmorphism Calendar Date Range Picker",
      "category": "pickers",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive calendar date picker dialog styled with dark glassmorphic accent colors.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_pick_01",
      "code": "// Date Range Picker Dialog\nshowDatePicker(\n  context: context,\n  initialDate: DateTime.now(),\n  firstDate: DateTime(2020),\n  lastDate: DateTime(2030),\n);"
    },
    {
      "id": "comp_chip_01",
      "title": "Removable Filter Tag Chips",
      "category": "chips",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive chip pills featuring delete action button for quick query filtering.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_chip_01",
      "code": "// Removable InputChip Widget\nInputChip(\n  label: const Text('Flutter 3.x'),\n  onDeleted: () {},\n  deleteIconColor: Colors.redAccent,\n)"
    },
    {
      "id": "comp_srch_01",
      "title": "Glassmorphism Command Palette Search Bar",
      "category": "search_bars",
      "isPremium": false,
      "badge": "Free",
      "description": "Keyboard shortcut driven search modal input inspired by Raycast and Cmd+K palettes.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_srch_01",
      "code": "// Command Palette Search Field\nTextField(\n  decoration: InputDecoration(\n    hintText: 'Type a command or search... (Ctrl+K)',\n    prefixIcon: const Icon(Icons.search, color: Colors.cyan),\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),\n  ),\n)"
    },
    {
      "id": "comp_exp_01",
      "title": "Smooth Accordion FAQ ExpansionTile",
      "category": "expansion",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive collapsible accordion widget expanding smoothly to show answer details.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_exp_01",
      "code": "// ExpansionTile Accordion\nExpansionTile(\n  title: const Text('What is FlutterHub Pro?'),\n  children: const [Padding(padding: EdgeInsets.all(16), child: Text('FlutterHub Pro gives you access to full source code.'))],\n)"
    },
    {
      "id": "comp_page_01",
      "title": "Onboarding Feature Carousel with Smooth Dots",
      "category": "pageview",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive swiping PageView widget with dynamic pagination indicator dots.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_page_01",
      "code": "// Onboarding PageView Carousel\nPageView(\n  children: const [\n    Center(child: Text('Slide 1: High Performance')),\n    Center(child: Text('Slide 2: Production Ready')),\n  ],\n)"
    },
    {
      "id": "comp_fab_01",
      "title": "Expandable Speed Dial Floating Action Button",
      "category": "fab",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive FAB button that expands into multiple quick action speed dial sub-buttons.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_fab_01",
      "code": "// Speed Dial FloatingActionButton\nFloatingActionButton(\n  backgroundColor: Colors.cyan,\n  child: const Icon(Icons.add),\n  onPressed: () {},\n)"
    },
    {
      "id": "comp_bdg_01",
      "title": "Notification Bell Counter Badge",
      "category": "badges",
      "isPremium": false,
      "badge": "Free",
      "description": "Interactive button with numerical counter badge overlay indicating unread items.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_bdg_01",
      "code": "// Notification Counter Badge\nBadge(\n  label: const Text('3'),\n  child: const Icon(Icons.notifications, size: 28),\n)"
    },
    {
      "id": "comp_ttp_01",
      "title": "Custom Glassmorphism Animated Tooltip",
      "category": "tooltips",
      "isPremium": false,
      "badge": "Free",
      "description": "Hover popover tooltip box displaying helpful contextual information.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_ttp_01",
      "code": "// Custom Tooltip Widget\nTooltip(\n  message: 'Copy source code to clipboard',\n  child: const Icon(Icons.copy_rounded),\n)"
    },
    {
      "id": "comp_lay_01",
      "title": "Responsive Dashboard Grid Layout",
      "category": "layouts",
      "isPremium": false,
      "badge": "Free",
      "description": "Clean multi-column responsive dashboard container adaptively scaling to device width.",
      "dependencies": [
        "flutter/material.dart"
      ],
      "simType": "sim_lay_01",
      "code": "// Responsive Layout Builder\nLayoutBuilder(\n  builder: (context, constraints) {\n    return constraints.maxWidth > 600 ? const Row() : const Column();\n  },\n)"
    }
  ],
  "designSystems": {
    "bento": {
      "name": "Bento Grid System",
      "components": [
        {
          "id": "comp_card_01",
          "title": "Bento Grid Telemetry Metric Card",
          "badge": "FREE",
          "isPremium": false,
          "description": "Modern SaaS Bento grid card surface featuring live indicator pills and metric stats.",
          "simType": "sim_card_01",
          "code": "// Bento Grid Telemetry Card\nContainer(\n  padding: const EdgeInsets.all(20),\n  decoration: BoxDecoration(\n    color: const Color(0xFF0F172A),\n    borderRadius: BorderRadius.circular(20),\n    border: Border.all(color: Colors.cyan.withOpacity(0.3)),\n  ),\n  child: Column(\n    crossAxisAlignment: CrossAxisAlignment.start,\n    children: const [\n      Icon(Icons.grid_view_rounded, color: Colors.cyan),\n      SizedBox(height: 12),\n      Text('Telemetry Insights', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),\n    ],\n  ),\n)"
        }
      ]
    },
    "neumorphism": {
      "name": "Neumorphism System",
      "components": [
        {
          "id": "comp_btn_03",
          "title": "Neumorphic Dual-State Interactive Button",
          "badge": "FREE",
          "isPremium": false,
          "description": "Tactile dark-mode neumorphic button with interactive pressed/unpressed shadow inset toggle.",
          "simType": "sim_btn_03",
          "code": "// Neumorphic Dual-State Button\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),\n  decoration: BoxDecoration(\n    color: const Color(0xFF0F172A),\n    borderRadius: BorderRadius.circular(16),\n  ),\n)"
        }
      ]
    },
    "claymorphism": {
      "name": "Claymorphism System",
      "components": [
        {
          "id": "clay_01",
          "title": "3D Clay Button Surface",
          "badge": "FREE",
          "isPremium": false,
          "description": "Puffy rounded 3D clay button with outer shadow & top inner light highlight.",
          "simType": "sim_btn_02",
          "code": "// Claymorphic Puffy 3D Button\nContainer(\n  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),\n  decoration: BoxDecoration(\n    gradient: const LinearGradient(colors: [Color(0xFFEC4899), Color(0xFF8B5CF6)]),\n    borderRadius: BorderRadius.circular(30),\n  ),\n)"
        }
      ]
    },
    "glassmorphism": {
      "name": "Glassmorphism System",
      "components": [
        {
          "id": "comp_btn_01",
          "title": "Aceternity Glassmorphism Neo Button",
          "badge": "FREE",
          "isPremium": false,
          "description": "Backdrop blurred glassmorphism button with dynamic gradient borders.",
          "simType": "sim_btn_01",
          "code": "// Glassmorphism Button\nClipRRect(\n  borderRadius: BorderRadius.circular(16),\n  child: BackdropFilter(filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12), child: Container()),\n)"
        }
      ]
    },
    "aurora": {
      "name": "Aurora System",
      "components": [
        {
          "id": "comp_card_04",
          "title": "Crypto Wallet Balance Card with Glow",
          "badge": "PRO",
          "isPremium": true,
          "description": "Fintech crypto balance card featuring radial ambient gradient background.",
          "simType": "sim_card_04",
          "code": "// Aurora Glowing Card\nContainer(\n  decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFFA855F7)])),\n)"
        }
      ]
    }
  },
  "interviewQuestions": [
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
  "roadmaps": {
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
  "blogs": [
    {
      "id": "blog_01",
      "title": "Mastering Flutter 3.x Performance: 10 Instant Speed Hacks",
      "author": "Antigravity DeepMind Team",
      "date": "July 28, 2026",
      "readTime": "6 min read",
      "tag": "Performance",
      "content": "Flutter applications running on web and mobile demand zero jank. Always use const constructors and RepaintBoundary for heavy subtrees."
    },
    {
      "id": "blog_02",
      "title": "Dart 3 Patterns & Record Types in Clean Architecture",
      "author": "Flutter Engineering",
      "date": "July 22, 2026",
      "readTime": "8 min read",
      "tag": "Dart"
    }
  ],
  "jobs": [
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
  "communityGroups": [
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
  "screens": [
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
  "animations": [
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
  "stateManagement": [
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
  "projects": [
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
  "documentation": [
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
  "downloads": [
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
  "cheatSheets": []
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FLUTTER_DATA;
}
