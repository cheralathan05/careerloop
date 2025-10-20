// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { protect } = require('../middleware/authMiddleware');
const { validateOtp } = require('../middleware/otpMiddleware');

const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  googleAuthSuccess,
  getUserProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

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
    session: false, // we are using JWT, not sessions
  })
);

// Step 2️⃣: Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  googleAuthSuccess // Controller will issue JWT + redirect to frontend
);

// ======================================================
// 🔹 PROTECTED ROUTES
// ======================================================
router.get('/profile', protect, getUserProfile);

module.exports = router;
