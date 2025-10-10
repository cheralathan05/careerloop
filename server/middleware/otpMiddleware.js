// server/middleware/otpMiddleware.js

const asyncHandler = require('express-async-handler');
const OTP = require('../models/OTP'); // Import your OTP model

/**
 * Validates the format and basic existence of an OTP before verification.
 */
const validateOtp = asyncHandler(async (req, res, next) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        res.status(400);
        throw new Error('User ID and OTP are required.');
    }
    
    // Basic format validation
    if (otp.length !== 6 || isNaN(otp)) {
        res.status(400);
        throw new Error('Invalid OTP format. Must be a 6-digit number.');
    }

    // Optional: Check if the OTP exists and hasn't expired (though the service layer usually handles expiry)
    const otpRecord = await OTP.findOne({ userId, otp });
    
    if (!otpRecord) {
        // Send a generic error message to prevent enumeration
        res.status(400);
        throw new Error('Invalid code or expired.');
    }
    
    next();
});

module.exports = { validateOtp };