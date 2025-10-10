// server/services/googleAuthService.js

const User = require('../models/User'); 
const generateToken = require('../utils/generateToken');

/**
 * Handles the logic after a successful Google Passport authentication.
 * If you need to integrate with a different service or perform complex data mapping, do it here.
 * @param {object} profile - The user profile returned by Google.
 * @returns {object} The user and their JWT token.
 */
const processGoogleLogin = async (profile) => {
    const email = profile.emails[0].value;
    
    let user = await User.findOne({ email });

    if (!user) {
        // Create user if they don't exist
        user = await User.create({
            name: profile.displayName,
            email: email,
            password: 'OAuth_RANDOM_PASSWORD', // Placeholder
            isVerified: true,
            // role: 'user', 
        });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Return the user data (excluding password) and the token
    return { 
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        },
        token 
    };
};

module.exports = { processGoogleLogin };