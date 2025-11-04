/**
 * OTP Validation Middleware
 * ------------------------------------------------------
 * Pre‑verification middleware to validate an OTP for a given email.
 * Checks presence, numeric format, and model existence before controller logic.
 */

import asyncHandler from 'express-async-handler';
import OTPModel from '../models/OTP.js';

export const validateOtp = asyncHandler(async (req, res, next) => {
  // 1️⃣ Normalize and sanitize user input
  const email = req.body?.email?.toLowerCase().trim() || '';
  const otp = req.body?.otp?.toString().trim() || '';

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  // 2️⃣ Format validation — must be strict 6‑digit numeric
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return res.status(400).json({ message: 'Invalid OTP format. Must be a 6‑digit number.' });
  }

  // 3️⃣ Model existence + TTL validation
  const otpRecord = await OTPModel.findOne({ email, otp });

  if (!otpRecord) {
    // Generic response avoids user enumeration attacks
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  // 4️⃣ If valid, attach OTP doc to req context for downstream logic (optional)
  req.verifiedOtp = otpRecord;

  next();
});
