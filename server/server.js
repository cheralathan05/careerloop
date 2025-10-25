import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser'; // For session/JWT cookies

// --- Configuration & Initialization ---
import connectDB from './config/db.js';
import { initPassportSetup } from './config/passportSetup.js'; 

// --- Import All Routes (Assuming they are correctly defined) ---
import authRoutes from './routes/authRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

// -------------------------------------------------------------------

// 1️⃣ Load .env FIRST (CRITICAL: Loads PORT, CLIENT_URL, SECRETS)
dotenv.config(); 

// 2️⃣ Apply OpenSSL fix globally to avoid the "tlsv1 alert internal error" during OAuth/DB connection
// NOTE: This should ONLY be used if you consistently face the SSL error.
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disabling TLS checking (Use only for local testing)

// 3️⃣ Initialize Passport (Uses loaded ENV variables)
initPassportSetup(); 

// 4️⃣ Connect to MongoDB (Must happen after dotenv.config)
connectDB();

// 5️⃣ Initialize Express app
const app = express();

// -------------------------------------------------------------------
// 6️⃣ CORE MIDDLEWARE
// -------------------------------------------------------------------

app.use(express.json()); // Body parser for application/json
app.use(express.urlencoded({ extended: true })); // Body parser for form data
app.use(cookieParser()); // Cookie parser for handling sessions/tokens

// 7️⃣ CORS Middleware (CRITICAL FIX for Client/Server Connection)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true, // Must be true to allow cookies/sessions (needed for OAuth)
    })
);

// 8️⃣ Initialize Passport (CRITICAL for OAuth routes)
app.use(passport.initialize());

// -------------------------------------------------------------------
// 9️⃣ MOUNT ALL API ROUTES
// -------------------------------------------------------------------

// All routes are mounted under the '/api' base path, consistent with client services
app.use('/api/auth', authRoutes); 
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/courses', courseRoutes);

// -------------------------------------------------------------------

// 🔟 Test route
app.get('/', (req, res) => {
    res.status(200).send(`🚀 CareerLoop API running successfully on port ${PORT}...`);
});

// 11️⃣ Global Error Handler (Good practice)
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(err.status || 500).json({ 
        message: err.message || 'An unexpected server error occurred.',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack 
    });
});

// 12️⃣ Start the Server
app.listen(PORT, () => console.log(`✅ Server listening on ${PORT}. Client connecting from ${CLIENT_URL}`));