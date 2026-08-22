/* ==========================================================================
   FlutterHub Production Express Server Entrypoint
   Configures CORS, dotenv, MongoDB, Razorpay APIs, Auth, and Content Routes
   ========================================================================== */

const path = require('path');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const supabase = require('./config/superbase');

// Initialize Express App
const app = express();

// CORS Middleware Configuration (Allow Vercel frontend & localhost)
app.use(
  cors({
    origin: '*', // Allows Vercel frontend (https://flutter-hub-akshay.vercel.app) & local testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Terminal Request Logging Middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    const time = new Date().toISOString();
    console.log(`\x1b[35m[${time}] 🌐 [HTTP REQUEST]: ${req.method} ${req.url}\x1b[0m`);
  }
  next();
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Start Job Sync Scheduler (daily cron + startup sync)
require('./jobs/scheduler');


// Serve Static Frontend Files (index.html, css, js)
app.use(express.static(path.join(__dirname, '..')));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FlutterHub Backend',
    database: 'Supabase',
    supabaseConfigured: !!process.env.SUPABASE_URL,
    razorpayKeyConfigured: !!process.env.RAZORPAY_KEY_ID,
    timestamp: new Date(),
  });
});

// Database Connection Test Route
app.get('/api/db-check', async (req, res) => {
  try {
    const start = Date.now();
    // Execute live ping query against Supabase users table
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const latency = Date.now() - start;

    if (error) {
      return res.status(500).json({
        success: false,
        connected: false,
        message: 'Supabase users table check failed.',
        error: error.message,
        url: process.env.SUPABASE_URL,
        latencyMs: `${latency}ms`,
      });
    }

    res.json({
      success: true,
      connected: true,
      message: '⚡ Supabase Database Connection Fully Active & Verified!',
      url: process.env.SUPABASE_URL,
      userRecordCount: count || 0,
      latencyMs: `${latency}ms`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      connected: false,
      error: err.message,
    });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Server with EADDRINUSE Fallback Handling
const DEFAULT_PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

function getLocalNetworkAddress() {
  const interfaces = os.networkInterfaces();

  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }

  return null;
}

function startServer(port) {
  const server = app.listen(port, HOST, () => {
    const networkAddress = getLocalNetworkAddress();

    console.log(`FlutterHub Server running: http://localhost:${port}`);
    console.log(`Network testing URL: ${networkAddress ? `http://${networkAddress}:${port}` : 'No LAN address detected'}`);
    console.log(`Listening host: ${HOST}`);
    console.log(`Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID || 'Not configured'}`);
    console.log(`Supabase URL: ${process.env.SUPABASE_URL || 'Not configured'}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is already in use by an existing background process.`);
      if (port === DEFAULT_PORT) {
        console.log(`🔄 Automatically trying alternative port ${Number(port) + 1}...`);
        startServer(Number(port) + 1);
      } else {
        console.log(`ℹ️ Server is already live and active on http://localhost:${DEFAULT_PORT}`);
      }
    } else {
      console.error('Server Listen Error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
