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

// ----------------- PUBLIC ROUTES -----------------

// Standard authentication
router.post('/signup', registerUser);
router.post('/login', loginUser);

// OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', validateOtp, verifyOtp);

// Forgot / Reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ----------------- GOOGLE OAUTH -----------------

// Initiate Google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleAuthSuccess
);

// ----------------- PROTECTED ROUTES -----------------

// User profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
