// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport'); // Google OAuth
const { protect } = require('../middleware/authMiddleware'); // JWT protection
const { validateOtp } = require('../middleware/otpMiddleware'); // Optional OTP validation

const {
    registerUser,
    loginUser,
    sendOtp,
    verifyOtp,
    googleAuthSuccess,
    getUserProfile,
    forgotPassword,    // Forgot password controller
    resetPassword      // Reset password controller
} = require('../controllers/authController');


// --- PUBLIC ROUTES ---

// Standard authentication
router.post('/signup', registerUser);
router.post('/login', loginUser);

// OTP flow
router.post('/send-otp', sendOtp);
router.post('/verify-otp', validateOtp, verifyOtp);

// Forgot / Reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- GOOGLE OAUTH ---

// Initiate Google login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false
    }),
    googleAuthSuccess
);

// --- PROTECTED ROUTES ---

// User profile (JWT required)
router.get('/profile', protect, getUserProfile);


module.exports = router;
