// server/services/otpService.js

const OTPModel = require('../models/OTP');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

/**
 * Generates and sends a One-Time Password (OTP) for verification.
 * @param {string} email - The user's email address.
 * @returns {object} The user info and success message.
 */
const generateAndSendOTP = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found.');
  }

  // 1️⃣ Generate a 6-digit OTP
  const otpValue = crypto.randomInt(100000, 999999).toString();

  // 2️⃣ Invalidate previous OTPs for this user
  await OTPModel.deleteMany({ userId: user._id });

  // 3️⃣ Create a new OTP with expiry (10 minutes)
  const newOTP = await OTPModel.create({
    userId: user._id,
    otp: otpValue,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min from now
  });

  // 4️⃣ Try to send the OTP via email
  try {
    await sendEmail({
      to: email,
      subject: 'Your CareerLoop Verification Code',
      text: `Your OTP is ${otpValue}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Verify Your CareerLoop Account</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing:4px;">${otpValue}</h1>
          <p>This code will expire in <b>10 minutes</b>.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error.message);
    throw new Error('Failed to send OTP email. Please try again.');
  }

  console.log(`✅ OTP generated for ${email}: ${otpValue}`);

  return {
    user: { _id: user._id, email: user.email, name: user.name },
    message: 'OTP sent successfully.',
  };
};

/**
 * Verifies a user's OTP.
 * @param {string} userId - The ID of the user.
 * @param {string} otp - The OTP to verify.
 * @returns {object} The verified user and a JWT token.
 */
const verifyOTP = async (userId, otp) => {
  // 1️⃣ Find a valid OTP
  const otpRecord = await OTPModel.findOne({
    userId,
    otp,
    expiresAt: { $gt: Date.now() }, // ✅ Ensure it's still valid
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP.');
  }

  // 2️⃣ Mark user as verified
  const user = await User.findByIdAndUpdate(
    userId,
    { isVerified: true },
    { new: true, select: '-password' }
  );

  if (!user) {
    throw new Error('User not found.');
  }

  // 3️⃣ Delete OTP (prevent reuse)
  await OTPModel.findByIdAndDelete(otpRecord._id);

  // 4️⃣ Generate a JWT token for login
  const token = generateToken(user._id);

  return { user, token };
};

module.exports = { generateAndSendOTP, verifyOTP };
