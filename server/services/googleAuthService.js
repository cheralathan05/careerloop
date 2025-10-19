const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Handles logic after successful Google authentication
 * @param {object} profile - Google user profile
 * @returns {object} user and JWT token
 */
const processGoogleLogin = async (profile) => {
  try {
    const email = profile.emails[0].value.toLowerCase().trim();

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name: profile.displayName,
        email,
        password: 'GOOGLE_OAUTH_USER', // Placeholder password
        isVerified: true, // Google email is verified
      });
    }

    const token = generateToken(user._id);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    };
  } catch (error) {
    console.error('Google login failed:', error);
    throw new Error('Google login failed');
  }
};

module.exports = { processGoogleLogin };
