// server/routes/authRoutes.js (FINAL, FULLY SYNCHRONIZED VERSION ✅)

import express from 'express';
const router = express.Router();
import passport from 'passport';

// Import necessary dependencies with correct paths and extensions
import { protect } from '../middleware/authMiddleware.js';
import { validateOtp } from '../middleware/otpMiddleware.js';

// Import all controller functions via named import (must match controller export structure)
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

// ======================================================
// 🔹 ROUTE DEFINITIONS
// ======================================================

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', validateOtp, verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }), googleAuthSuccess);

// Protected
router.get('/profile', protect, getUserProfile);

// ✅ FIX: Use ES Module default export
export default router;
