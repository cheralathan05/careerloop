
// server/utils/generateToken.js

const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token containing the user ID.
 * @param {string} id - The user ID to encode in the payload.
 * @returns {string} The signed JWT.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        // Set an expiration time (e.g., 30 days)
        expiresIn: '30d', 
    });
};

module.exports = generateToken;