// server.js — Final Stable Release
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';

// ↓ Configuration Imports
import connectDB from './config/db.js';
import { initPassportSetup } from './config/passportSetup.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ↓ Route Imports
import authRoutes from './routes/authRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

// ------------------------------------------------------------------
// 1️⃣ Environment Configuration
// ------------------------------------------------------------------
dotenv.config();

// ------------------------------------------------------------------
// 2️⃣ Database Connection
// ------------------------------------------------------------------
connectDB().catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

// ------------------------------------------------------------------
// 3️⃣ Passport (Google OAuth) Initialization
// ------------------------------------------------------------------
initPassportSetup();

// ------------------------------------------------------------------
// 4️⃣ App Initialization
// ------------------------------------------------------------------
const app = express();

// ------------------------------------------------------------------
// 5️⃣ Core Middlewares
// ------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS Configuration
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Passport Middleware
app.use(passport.initialize());

// ------------------------------------------------------------------
// 6️⃣ API Route Mounting
// ------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/courses', courseRoutes);

// ------------------------------------------------------------------
// 7️⃣ Health Check/Test Route
// ------------------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    message: `🚀 CareerLoop API running successfully on port ${process.env.PORT || 5000}`,
    environment: process.env.NODE_ENV || 'development',
  });
});

// ------------------------------------------------------------------
// 8️⃣ Global Error Handlers
// ------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ------------------------------------------------------------------
// 9️⃣ Start Server
// ------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
  console.log(`🌐 Client: ${CLIENT_URL}`);
});

export default app;
