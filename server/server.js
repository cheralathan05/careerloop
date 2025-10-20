// server/server.js (FINAL ✅ FULLY CORRECTED)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/db');

// ✅ 1️⃣ Load .env FIRST — before anything else
dotenv.config();

// ✅ 2️⃣ Connect to MongoDB
connectDB();

// ✅ 3️⃣ Initialize Express app
const app = express();

// ✅ 4️⃣ Load Passport configuration (after dotenv)
require('./config/passportSetup');

// ✅ 5️⃣ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 6️⃣ Enable CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ✅ 7️⃣ Initialize Passport
app.use(passport.initialize());

// ✅ 8️⃣ Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ 9️⃣ Test route
app.get('/', (req, res) => {
  res.send('🚀 Auth API running successfully...');
});

// ✅ 🔟 Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(res.statusCode || 500).json({
    message: err.message || 'Server error',
  });
});

// ✅ 11️⃣ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
