// server/controllers/authController.js (FINAL, COMPLETE, AND WORKING VERSION)

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); 
const bcrypt = require('bcryptjs'); 
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');


// --- 1. Standard Auth Logic ---

const registerUser = asyncHandler(async (req, res) => {
    // 🎯 FIX: Extract variables from req.body first
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
    
    // User creation logic
    const user = await User.create({ name, email, password });
    
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            // Note: Keep email sending commented out until Nodemailer is configured
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    // 🎯 FIX: Extract variables from req.body first
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // matchPassword method is defined in the User model
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

const sendOtp = asyncHandler(async (req, res) => {
    // Variables are correctly defined here: const { email } = req.body;
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
    // Variables are correctly defined here: const { userId, otp } = req.body;
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


// --- 3. Google OAuth Logic (googleAuthSuccess) ---

const googleAuthSuccess = (req, res) => {
    if (req.user) {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } else {
        res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
    }
};


// --- 4. Profile Retrieval ---

const getUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json(req.user); 
});


module.exports = {
    registerUser,
    loginUser,
    sendOtp,
    verifyOtp,
    googleAuthSuccess,
    getUserProfile, 
};