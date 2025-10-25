import asyncHandler from 'express-async-handler'; // FIX 1: Changed require to import
import OTPModel from '../models/OTP.js'; // CRITICAL FIX 2: Default import for Mongoose model

/**
 * @desc Middleware to validate OTP format and existence before verification.
 * This runs before the controller to check for basic errors and model existence.
 */
export const validateOtp = asyncHandler(async (req, res, next) => { // FIX 3: Changed to ESM named export
    // Ensure email and otp are trimmed early
    const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
    const otp = req.body.otp ? req.body.otp.toString().trim() : '';
    
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    // Basic format validation: must be 6-digit numeric
    if (otp.length !== 6 || isNaN(otp)) {
        return res.status(400).json({ message: 'Invalid OTP format. Must be a 6-digit number.' });
    }

    // Check OTP existence (TTL index in model handles expiry)
    // CRITICAL FIX: Using OTPModel (default import) instead of the old CJS reference.
    const otpRecord = await OTPModel.findOne({ email, otp });

    if (!otpRecord) {
        // Generic message to avoid account enumeration
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // OTP exists and is valid (not expired by TTL index)
    next();
});

// Remove module.exports
