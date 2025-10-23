// server/utils/generateToken.js (ES Module Format)
import jwt from 'jsonwebtoken';
// Import the centralized JWT configuration
import jwtConfig from '../config/jwtConfig.js'; 

/**
 * @desc Generates a JWT token containing the user ID.
 * Uses the secret and expiration time defined in jwtConfig.
 * @param {string} id - The user ID to encode in the payload.
 * @returns {string} The signed JWT.
 */
const generateToken = (id) => {
    // 1. Use the centralized secret from the config file
    const secret = jwtConfig.secret;
    
    // 2. Use the centralized expiration time from the config file
    const expiresIn = jwtConfig.expiresIn; 

    // The payload uses 'id' to match how mongoose stores the user ID (_id)
    return jwt.sign({ id }, secret, {
        expiresIn: expiresIn, 
    });
};

export default generateToken;