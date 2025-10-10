// server/services/otpService.js

const OTPModel = require('../models/OTP');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Your email utility
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

/**
 * Generates and sends an OTP to a user.
 * @param {string} email - The user's email address.
 * @returns {object} The user and success status.
 */
const generateAndSendOTP = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found.');
    }

    // 1. Generate a 6-digit OTP
    const otpValue = crypto.randomInt(100000, 999999).toString();

    // 2. Invalidate any previous OTPs for this user
    await OTPModel.deleteMany({ userId: user._id });

    // 3. Save the new OTP
    const newOTP = await OTPModel.create({
        userId: user._id,
        otp: otpValue,
    });

    // 4. Send the OTP via email
    await sendEmail({
        to: email,
        subject: 'Your Account Verification Code',
        text: `Your OTP code is ${otpValue}. It will expire in 10 minutes.`,
        // html: `...`,
    });

    // For debugging/testing, return the user (without sensitive data)
    return { 
        user: { 
            _id: user._id, 
            email: user.email, 
            name: user.name 
        },
        message: 'OTP sent successfully.' 
    };
};


/**
 * Validates the provided OTP.
 * @param {string} userId - The ID of the user.
 * @param {string} otp - The OTP to verify.
 * @returns {object} The verified user and token.
 */
const verifyOTP = async (userId, otp) => {
    // 1. Find the latest valid OTP for the user
    const otpRecord = await OTPModel.findOne({
        userId,
        otp,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
        throw new Error('Invalid or expired OTP.');
    }

    // 2. Mark user as verified (if this is for initial signup verification)
    const user = await User.findByIdAndUpdate(
        userId,
        { isVerified: true },
        { new: true, select: '-password' } // Return updated user, exclude password
    );

    if (!user) {
        throw new Error('User not found.');
    }

    // 3. Delete the used OTP record
    await OTPModel.findByIdAndDelete(otpRecord._id);

    // 4. Generate JWT for the now verified user
    const token = generateToken(user._id);

    return { user, token };
};

module.exports = {
    generateAndSendOTP,
    verifyOTP,
};