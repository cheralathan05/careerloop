// server/middleware/otpMiddleware.js

const asyncHandler = require('express-async-handler');
const OTP = require('../models/OTP');

/**
 * Middleware to validate OTP format and existence before verification.
 */
const validateOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  // Basic format validation: must be 6-digit numeric
  if (otp.length !== 6 || isNaN(otp)) {
    return res.status(400).json({ message: 'Invalid OTP format. Must be a 6-digit number.' });
  }

  // Optional: verify OTP existence (service layer handles expiry)
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    // Generic message to avoid account enumeration
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  next();
});

module.exports = { validateOtp };
