// server/controllers/authController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');

// ==========================
// 🧩 SIGNUP (with OTP)
// ==========================
const registerUser = asyncHandler(async (req, res) => {
  console.log('📥 SIGNUP BODY:', req.body);

  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Check for existing user
  let user = await User.findOne({ email });
  if (user) {
    if (!user.isVerified) {
      // Resend OTP for unverified user
      const otpRes = await generateAndSendOTP(email);
      return res.status(200).json({
        message: 'User exists but not verified. OTP resent.',
        userId: user._id,
        otpMessage: otpRes.message,
      });
    }
    return res.status(400).json({ message: 'User already exists and verified.' });
  }

  // Create new user
  user = await User.create({ name, email, password });

  if (!user || !user._id) {
    console.error('❌ User creation failed.');
    return res.status(500).json({ message: 'User could not be created' });
  }

  console.log('✅ USER CREATED:', user._id);

  // Generate & send OTP
  const otpResponse = await generateAndSendOTP(email);

  // Return userId to frontend for OTP page
  return res.status(201).json({
    message: 'Signup successful! OTP sent to email.',
    userId: user._id,
    otpMessage: otpResponse.message,
  });
});

// ==========================
// 🔑 LOGIN
// ==========================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 LOGIN ATTEMPT:', email);

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    console.log('✅ LOGIN SUCCESS:', user._id);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    console.warn('⚠️ Invalid credentials for', email);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ==========================
// 📩 SEND OTP
// ==========================
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const response = await generateAndSendOTP(email);

  if (!response?.user?._id) {
    return res.status(500).json({ message: 'Failed to send OTP' });
  }

  console.log('📨 OTP SENT TO:', email);
  res.status(200).json({
    message: 'OTP sent successfully',
    userId: response.user._id,
  });
});

// ==========================
// ✅ VERIFY OTP
// ==========================
const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res
      .status(400)
      .json({ message: 'Please provide both userId and OTP' });
  }

  const { user, token } = await verifyOTP(userId, otp);

  if (!user) {
    return res.status(400).json({ message: 'Invalid OTP or user not found' });
  }

  console.log('✅ OTP VERIFIED FOR:', user.email);
  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    },
    token,
    message: 'Account verified successfully',
  });
});

// ==========================
// 🔁 FORGOT PASSWORD
// ==========================
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    text: `Click this link to reset your password: ${resetUrl}`,
  });

  console.log('📧 Password reset email sent to:', user.email);
  res.status(200).json({ message: 'Password reset link sent!' });
});

// ==========================
// 🔁 RESET PASSWORD
// ==========================
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  console.log('🔐 Password reset for:', user.email);
  res.status(200).json({ message: 'Password successfully reset' });
});

// ==========================
// 🌐 GOOGLE AUTH
// ==========================
const googleAuthSuccess = (req, res) => {
  if (req.user) {
    const token = generateToken(req.user._id);
    console.log('✅ Google auth success:', req.user.email);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } else {
    console.warn('⚠️ Google auth failed');
    res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
  }
};

// ==========================
// 👤 USER PROFILE
// ==========================
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(req.user);
});
const user = await User.findOne({
  resetPasswordToken: token,
  resetPasswordExpire: { $gt: Date.now() },
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
