// server/routes/authRoutes.js (FINAL, CONSOLIDATED VERSION)

const express = require('express');
const router = express.Router();
const passport = require('passport'); // Required for Google OAuth
const { protect } = require('../middleware/authMiddleware'); // For protected routes
const { validateOtp } = require('../middleware/otpMiddleware'); // For OTP validation

// CRITICAL: Import ALL required controller functions from authController.js
// If any function here is not exported by authController.js, the server will crash.
const { 
    registerUser, 
    loginUser, 
    sendOtp, 
    verifyOtp,
    googleAuthSuccess, 
    // This function must be defined and exported in authController.js
    getUserProfile, 
} = require('../controllers/authController');


// --- PUBLIC ROUTES (No JWT required) ---

// Standard Authentication
router.post('/signup', registerUser);
router.post('/login', loginUser);

// OTP Verification Flow
router.post('/send-otp', sendOtp);
router.post('/verify-otp', validateOtp, verifyOtp); // Example: using OTP middleware

// --- GOOGLE OAUTH ROUTES ---

// 1. Initiates the Google login process
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false // We use JWTs, not session cookies
}));

// 2. Google redirects here after user grants permission
router.get(
    '/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false 
    }),
    googleAuthSuccess // Controller handles JWT generation and client redirect
);


// --- PROTECTED ROUTES (JWT required via `protect` middleware) ---

// Get user profile (Requires a valid token in the Authorization header)
// This was the route likely causing the initial crash if getUserProfile wasn't defined/exported.
router.get('/profile', protect, getUserProfile); 

module.exports = router;