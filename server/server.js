/* ==========================================================================
   FlutterHub Production Express Server Entrypoint
   Configures CORS, dotenv, MongoDB, Razorpay APIs, Auth, and Content Routes
   ========================================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express App
const app = express();

// Connect MongoDB
connectDB();

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

// Serve Static Frontend Files (index.html, css, js)
const path = require('path');
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FlutterHub Backend',
    razorpayKeyConfigured: !!process.env.RAZORPAY_KEY_ID,
    timestamp: new Date(),
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FlutterHub Server running in production mode on port ${PORT}`);
  console.log(`💳 Razorpay Live Key ID: ${process.env.RAZORPAY_KEY_ID}`);
});
