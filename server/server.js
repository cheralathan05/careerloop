import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/db.js';

// ✅ IMPORT ALL ROUTES
import authRoutes from './routes/authRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

// ✅ FIX: Use NAMED IMPORT to correctly load initPassportSetup
import { initPassportSetup } from './config/passportSetup.js'; 

// -------------------------------------------------------------------
// EXECUTION ORDER IS CRITICAL HERE:
// -------------------------------------------------------------------

// ✅ 1️⃣ Load .env FIRST
dotenv.config(); 

// ✅ 2️⃣ NOW that ENV vars are loaded, initialize Passport
initPassportSetup(); 

// ✅ 3️⃣ Connect to MongoDB
connectDB();

// ✅ 4️⃣ Initialize Express app
const app = express();

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

// ✅ 7️⃣ Initialize Passport middleware
app.use(passport.initialize());

// -------------------------------------------------------------------
// ✅ 8️⃣ MOUNT ALL ROUTES
// -------------------------------------------------------------------

app.use('/api/auth', authRoutes); // Already present
app.use('/api/onboarding', onboardingRoutes); // 👈 FIX for the 404 error
app.use('/api/ai', aiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/courses', courseRoutes);

// -------------------------------------------------------------------

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
