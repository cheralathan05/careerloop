// server/controllers/authController.js (FINAL, COMPLETE, AND WORKING)

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); 
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');

// --- 1. Standard Auth Logic ---

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body; 
    
    if (!email || !password || !name) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    
    const user = await User.create({ name, email, password });
    
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); 
        throw new Error('Invalid credentials');
    }
});

// --- 2. OTP Logic ---

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body; 
    
    if (!email) {
        res.status(400);
        throw new Error('Please provide an email address.');
    }

    const response = await generateAndSendOTP(email);
    
    res.status(200).json({ 
        message: 'OTP sent successfully. Check your inbox.',
        userId: response.user._id,
    });
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body; 

    if (!userId || !otp) {
        res.status(400);
        throw new Error('Please provide user ID and OTP.');
    }

    const { user, token } = await verifyOTP(userId, otp);

    res.status(200).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        },
        token,
        message: 'Account successfully verified.',
    });
});

// --- 3. Forgot / Reset Password ---

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error('Please provide your email');

    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: ${resetUrl}`
    });

    res.status(200).json({ message: 'Password reset link sent! Check your email.' });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) throw new Error('Invalid or expired token');

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password successfully reset!' });
});

// --- 4. Google OAuth ---

const googleAuthSuccess = (req, res) => {
    if (req.user) {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } else {
        res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
    }
};

// --- 5. Profile Retrieval ---

const getUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json(req.user); 
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
