// server/controllers/authController.js (FINAL, FULLY CORRECTED VERSION ✅)

// Convert require to import
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js'; // Added .js extension
import generateToken from '../utils/generateToken.js'; // Added .js extension
import sendEmail from '../utils/sendEmail.js'; // Added .js extension
import { generateAndSendOTP, verifyOTP } from '../services/otpService.js'; // Added .js extension
import analyticsService from '../services/analyticsService.js'; // Added .js extension

// ✅ FIX: Import the named function 'setCache' directly from the utility.
// Removed the problematic 'import * as redisClient'
import { setCache } from '../utils/redisClient.js'; 


// ====================================================
// 🧩 REGISTER (Sign Up with OTP)
// ====================================================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please enter all required fields' });

  let user = await User.findOne({ email });

  if (user) {
    if (!user.isVerified) {
      await generateAndSendOTP(email);
      return res.status(200).json({
        message: 'User exists but not verified. OTP resent.',
        userId: user._id,
        email: user.email,
      });
    }
    return res.status(400).json({ message: 'User already registered and verified.' });
  }

  user = await User.create({ name, email, password });
  await generateAndSendOTP(email);

  // Track signup attempt in analytics (Using the 'log' function from your service)
  await analyticsService.log(user._id, 'user_signup_initiated', { email }); 

  res.status(201).json({
    message: 'Signup successful. OTP sent to your email.',
    userId: user._id,
    email: user.email,
  });
});

// ====================================================
// 🔑 LOGIN
// ====================================================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Please enter email and password' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email before login.' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);

  // ✅ FIX: Use the imported 'setCache' function instead of the raw .set method
  await setCache(`userToken:${user._id}`, token, 3600); 

  // Track successful login (Using the 'log' function from your service)
  await analyticsService.log(user._id, 'user_login_success', { userId: user._id });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
});

// ... (sendOtp and verifyOtp functions remain the same)

// ====================================================
// 📩 SEND OTP
// ====================================================
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  await generateAndSendOTP(email);
  // Track OTP sent (Using the 'log' function from your service)
  await analyticsService.log(user._id, 'otp_sent', { email }); 

  res.status(200).json({ message: 'OTP sent successfully' });
});

// ====================================================
// ✅ VERIFY OTP
// ====================================================
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: 'Email and OTP are required.' });

  const result = await verifyOTP(email, otp);
  if (!result?.user) return res.status(400).json({ message: 'Invalid or expired OTP.' });

  const token = generateToken(result.user._id);

  // Store verification in analytics (Using the 'log' function from your service)
  await analyticsService.log(result.user._id, 'user_verified', { email });

  res.status(200).json({
    message: 'Account verified successfully',
    user: {
      _id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      isVerified: result.user.isVerified,
    },
    token,
  });
});

// ... (forgotPassword and resetPassword functions remain the same)

// ====================================================
// 🔁 FORGOT PASSWORD
// ====================================================
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });

  // Silent response for security
  if (!user) {
    return res.status(200).json({
      message: 'If a user with that email exists, a password reset link has been sent.',
    });
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const message = `
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="color:#6366f1;">${resetUrl}</a>
    <p>Expires in 15 minutes.</p>
  `;

  await sendEmail({ to: user.email, subject: 'Password Reset Request', html: message });
  // Track password reset requested (Using the 'log' function from your service)
  await analyticsService.log(user._id, 'password_reset_requested', { email });

  res.status(200).json({ message: 'Password reset email sent successfully!' });
});

// ====================================================
// 🔁 RESET PASSWORD
// ====================================================
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).json({ message: 'Token and new password are required.' });

  if (newPassword.length < 8)
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token.' });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Track password reset success (Using the 'log' function from your service)
  await analyticsService.log(user._id, 'password_reset_success', { userId: user._id });

  res.status(200).json({ message: 'Password reset successfully!' });
});

// ====================================================
// 🌐 GOOGLE AUTH SUCCESS (OAuth Callback)
// ====================================================
const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
  }

  const token = generateToken(req.user._id);

  // ✅ FIX 3: Use the imported 'setCache' function 
  setCache(`userToken:${req.user._id}`, token, 3600);

  // Track Google login success (Using the 'log' function from your service)
  analyticsService.log(req.user._id, 'google_login_success', { userId: req.user._id });

  res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
};

// ====================================================
// 👤 GET USER PROFILE
// ====================================================
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpire');
  if (!user) return res.status(404).json({ message: 'User profile not found.' });

  // Track profile view (Using the 'log' function from your service)
  await analyticsService.log(user._id, 'profile_view', { userId: user._id });
  res.status(200).json(user);
});

// The final export remains as CommonJS 'module.exports' to resolve the route import error
export {
    registerUser,
    loginUser,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
    googleAuthSuccess,
    getUserProfile,
}