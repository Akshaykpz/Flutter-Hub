/* ==========================================================================
   MongoDB Connection Configuration using Mongoose
   ========================================================================== */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log("ℹ️ Note: Running in fallback mode if MongoDB is not active locally.");
  }
};

module.exports = connectDB;
