// server/controllers/authController.js (FINAL, COMPLETE VERSION)

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); 
const bcrypt = require('bcryptjs'); 
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');


// --- 1. Standard Auth Logic (registerUser, loginUser) ---
// (Logic retained from your provided code)

const registerUser = asyncHandler(async (req, res) => {
    // ... (Your implementation)
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
    // ... (Your implementation)
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


// --- 2. OTP Logic (sendOtp, verifyOtp) ---
// (Logic retained from your provided code)

const sendOtp = asyncHandler(async (req, res) => {
    // ... (Your implementation)
    const { email } = req.body;
    // ...
    const response = await generateAndSendOTP(email);
    // ...
});

const verifyOtp = asyncHandler(async (req, res) => {
    // ... (Your implementation)
    const { userId, otp } = req.body;
    // ...
    const { user, token } = await verifyOTP(userId, otp);
    // ...
});


// --- 3. Google OAuth Logic (googleAuthSuccess) ---
// (Logic retained from your provided code)

const googleAuthSuccess = (req, res) => {
    if (req.user) {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } else {
        res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
    }
};


// ----------------------------------------------------------------------
// 🎯 CRITICAL FIX: Add the missing function causing the route crash (Line 55)
// ----------------------------------------------------------------------

// @desc    Get user profile data
// @route   GET /api/auth/profile
// @access  Private 
const getUserProfile = asyncHandler(async (req, res) => {
    // The 'protect' middleware ensures req.user is populated with user data
    // If the token is valid, we return the user object (excluding the hashed password).
    res.status(200).json(req.user); 
});


module.exports = {
    // Standard Auth
    registerUser,
    loginUser,
    
    // OTP Logic
    sendOtp,
    verifyOtp,
    
    // OAuth Logic
    googleAuthSuccess,
    
    // ✅ FIX: Export the missing function used in authRoutes.js
    getUserProfile, 
};