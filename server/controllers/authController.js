import User from '../models/User.js';
import Token from '../models/Token.js';
import generateToken from '../utils/generateToken.js';
import { generateOTP } from '../utils/otpHelper.js';
import sendEmail from '../services/emailService.js';
import crypto from 'crypto';


// @desc    Register a new user & send OTP
// @route   POST /api/auth/signup
export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        // Generate OTP
        const otp = generateOTP();
        await Token.create({ userId: user._id, token: otp });

        // Send OTP email
        const message = `Your account verification OTP is: ${otp}`;
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Account',
            message,
        });

        res.status(201).json({ 
            message: `An OTP has been sent to ${user.email}. Please verify.`,
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Verify OTP and log user in
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: 'User not found.' });

        const token = await Token.findOne({ userId, token: otp });
        if (!token) return res.status(400).json({ message: 'Invalid or expired OTP.' });

        user.isVerified = true;
        await user.save();
        await token.deleteOne(); // OTP is single-use

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Account not verified. Please check your email for an OTP.' });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Send a generic message for security
            return res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        await Token.create({ userId: user._id, token: resetToken });

        // IMPORTANT: In a real app, the resetURL should come from your frontend config
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`; 
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the following link to reset your password: \n\n ${resetURL}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
        });

        res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const resetToken = await Token.findOne({ token });
        if (!resetToken) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const user = await User.findById(resetToken.userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        user.password = password;
        await user.save();
        await resetToken.deleteOne();

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};