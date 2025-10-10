// server/controllers/authController.js (FINAL, CONSOLIDATED VERSION)

const asyncHandler = require('express-async-handler'); // 👈 CRITICAL FIX: Ensure this is imported
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); 
const bcrypt = require('bcryptjs'); // Used for hashing/comparing passwords
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    // (Actual implementation logic, based on previous steps)
    // 1. Validation, 2. Check if user exists, 3. Create user, 4. Send token/response
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    
    const user = await User.create({ name, email, password }); // Password hashing handled by User model pre-save hook
    
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            // Optionally, trigger OTP sending here: await generateAndSendOTP(email);
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
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


// -----------------------------------------------------------
// --- OTP LOGIC (From your provided snippet) ----------------
// -----------------------------------------------------------

// @desc    Send OTP to user's email
// @route   POST /api/auth/send-otp
// @access  Public
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

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
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

// -----------------------------------------------------------
// --- GOOGLE OAUTH LOGIC (From your provided snippet) -------
// -----------------------------------------------------------

// @desc    Handle successful Google OAuth callback
// @route   GET /api/auth/google/success
// @access  Private 
const googleAuthSuccess = (req, res) => {
    if (req.user) {
        const token = generateToken(req.user._id);

        // Redirect back to the client dashboard with the token
        res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
        
    } else {
        res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
    }
};


module.exports = {
    // Standard Auth
    registerUser,
    loginUser,
    
    // OTP Logic
    sendOtp,
    verifyOtp,
    
    // OAuth Logic
    googleAuthSuccess,
    
    // Add profile retrieval if implemented elsewhere
    // getUserProfile 
};