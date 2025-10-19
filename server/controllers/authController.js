// server/controllers/authController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');

// ==========================
// 🧩 REGISTER (Sign Up with OTP)
// ==========================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

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

  return res.status(201).json({
    message: 'Signup successful. OTP sent to your email.',
    userId: user._id,
    email: user.email,
  });
});

// ==========================
// 🔑 LOGIN
// ==========================
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
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
});

// ==========================
// 📩 SEND OTP
// ==========================
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  await generateAndSendOTP(email);
  res.status(200).json({ message: 'OTP sent successfully' });
});

// ==========================
// ✅ VERIFY OTP
// ==========================
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

  const result = await verifyOTP(email, otp);
  if (!result?.user) return res.status(400).json({ message: 'Invalid or expired OTP.' });

  const token = generateToken(result.user._id);
  return res.status(200).json({
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

// ==========================
// 🔁 FORGOT PASSWORD
// ==========================
// ==========================
// 🔁 FORGOT PASSWORD (FIXED)
// ==========================
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) {
    // Security: don't reveal user existence
    return res.status(200).json({
      message: 'If a user with that email exists, a password reset link has been sent.',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  // ✅ FIX: use `resetUrl` consistently (not resetURL)
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const message = `
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetUrl}" target="_blank" style="color:#6366f1; text-decoration:none;">${resetUrl}</a>
    <p>This link is valid for 15 minutes. If you did not request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: message,
  });

  res.status(200).json({ message: 'Password reset email sent successfully!' });
});

  
// ==========================
// 🔁 RESET PASSWORD
// ==========================
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

  // 1. Set new password (Mongoose pre-save hook handles hashing)
  user.password = newPassword;
  
  // 2. Clear token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  // 🚨 CRITICAL FINAL FIX: Add { validateBeforeSave: false } 
  // This ensures Mongoose only updates the password without failing on other untouched 'required' fields.
  await user.save({ validateBeforeSave: false }); // <--- THIS LINE IS THE FIX

  res.status(200).json({ message: 'Password reset successfully!' });
});
// ==========================
// 🌐 GOOGLE AUTH SUCCESS
// ==========================
const googleAuthSuccess = (req, res) => {
  if (req.user) {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } else {
    res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
  }
};

// ==========================
// 👤 GET USER PROFILE
// ==========================
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpire');
  if (!user) return res.status(404).json({ message: 'User profile not found.' });
  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  googleAuthSuccess,
  getUserProfile,
};
