import OTPModel from '../models/OTP.js'; // Assuming Mongoose model is default export
import User from '../models/User.js'; // Assuming Mongoose model is default export
import { sendEmail } from '../utils/sendEmail.js'; // CRITICAL FIX: Changed to NAMED IMPORT
import generateToken from '../utils/generateToken.js'; // Assuming utility is default export
import crypto from 'crypto';

/**
 * Generates and sends a One-Time Password (OTP) for verification.
 * @param {string} email - The user's email address.
 * @returns {object} The user info and success message.
 */
export const generateAndSendOTP = async (email) => { // ESM Named Export
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        throw new Error('User not found.');
    }

    // Generate 6-digit OTP (crypto.randomInt is preferred in modern Node.js)
    const otpValue = crypto.randomInt(100000, 999999).toString();

    // Delete any existing OTPs for this email
    await OTPModel.deleteMany({ email: user.email });

    // Save new OTP
    await OTPModel.create({
        email: user.email,
        otp: otpValue,
        // Assuming expiry is managed by TTL index in the model
    });

    // Send OTP via email
    try {
        await sendEmail({ // **This is now correctly callable!**
            to: user.email,
            subject: 'Your CareerLoop Verification Code',
            text: `Your OTP is ${otpValue}.`,
            html: `
                <div style="font-family:sans-serif;line-height:1.5">
                    <h2>Verify Your CareerLoop Account</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="letter-spacing:4px;">${otpValue}</h1>
                </div>
            `,
        });
    } catch (error) {
        console.error('Failed to send OTP email:', error.message);
        throw new Error('Failed to send OTP email. Please try again.');
    }

    console.log(`OTP generated for ${email}: ${otpValue}`);

    return { user: { _id: user._id, email: user.email, name: user.name }, message: 'OTP sent successfully.' };
};

/**
 * Verifies a user's OTP using their email.
 * @param {string} email - The user's email.
 * @param {string} otp - The OTP to verify.
 * @returns {object} The verified user and a JWT token.
 */
export const verifyOTP = async (email, otp) => { // ESM Named Export
    // Find OTP record
    const otpRecord = await OTPModel.findOne({
        email: email.toLowerCase().trim(),
        otp,
    });

    if (!otpRecord) {
        throw new Error('Invalid OTP or OTP has expired.');
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        { isVerified: true },
        { new: true, select: '-password' }
    );

    if (!user) {
        throw new Error('User not found.');
    }

    // Delete OTP after successful verification
    await OTPModel.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = generateToken(user._id);

    return { user, token };
};

// NOTE: CommonJS 'module.exports' is removed. The functions are exported via 'export const'.
