// server/routes/authRoutes.js (FINAL CORRECTED VERSION ✅)

import express from 'express';
import passport from 'passport';
import { protect } from '../middleware/authMiddleware.js';
import { validateOtp } from '../middleware/otpMiddleware.js';

// 1. ✅ CORRECT IMPORT: Use NAMED IMPORTS to match 'export { ... }' in authController.js
import {
    registerUser,
    loginUser,
    sendOtp,
    verifyOtp,
    googleAuthSuccess,
    getUserProfile,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js'; 

const router = express.Router();

// ======================================================
// 🔹 PUBLIC ROUTES
// ======================================================

// Standard authentication
router.post('/signup', registerUser);
router.post('/login', loginUser);

// OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', validateOtp, verifyOtp);

// Forgot / Reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ======================================================
// 🔹 GOOGLE OAUTH ROUTES
// ======================================================

// Step 1️⃣: Initiate Google Login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false, // using JWT, not sessions
  })
);

// Step 2️⃣: Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  googleAuthSuccess // Issues JWT + redirects to frontend
);

// ======================================================
// 🔹 PROTECTED ROUTES
// ======================================================

// Example: fetch authenticated user's profile
router.get('/profile', protect, getUserProfile);

// Future onboarding-related protected routes can be added here
// e.g., router.get('/onboarding/status', protect, getOnboardingStatus);

export default router;