// server/middleware/authMiddleware.js (ES Module format)
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';         // Use ES Module path
import jwtConfig from '../config/jwtConfig.js'; // Import your configuration

/**
 * Middleware to protect routes: requires a valid JWT token.
 * Ensures that only authenticated users can access protected resources.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization header (Bearer <token>)
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Extract the token (e.g., 'Bearer abc.123.xyz' -> 'abc.123.xyz')
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the JWT token using the secret from your config
      // Note: The payload generally contains { id: user._id }
      const decoded = jwt.verify(token, jwtConfig.secret);

      // 3. Attach user to the request (excluding password field)
      // Use .select('-password') for security.
      req.user = await User.findById(decoded.id).select('-password');
      
      // If user exists, but wasn't found (e.g., user was deleted)
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 4. Token is valid and user exists: Move to the next middleware/controller
      next(); 

    } catch (error) {
      // Catches token errors (expired, invalid signature, malformed)
      console.error('JWT Verification Failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  } else {
    // No token found in the header
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
});

// Export the function for use in routes
export { protect };