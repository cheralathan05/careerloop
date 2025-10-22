// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Protect routes - requires valid JWT token
 * Ensures that only authenticated users can access protected resources.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header (Bearer <token>)
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request (excluding password field)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // ✅ Move to next middleware
    } catch (error) {
      console.error('JWT Verification Failed:', error);
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };
