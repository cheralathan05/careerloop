/**
 * Auth Middleware — Protect Routes Using JWT
 * ------------------------------------------------------
 * Validates incoming requests by verifying JWTs in the Authorization header.
 * Attaches the corresponding user object to req.user for downstream access.
 */

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { jwtConfig } from '../config/jwtConfig.js'; // Named export from config

/**
 * Middleware to protect routes (Authenticated Access)
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1️⃣ Check if Authorization header with Bearer token exists
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing.' });
  }

  try {
    // 2️⃣ Verify JWT — throws if expired or invalid
    const decoded = jwt.verify(token, jwtConfig.secret, {
      algorithms: [jwtConfig.algorithm || 'HS256'],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });

    // 3️⃣ Fetch user and attach to request
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found or deleted.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ JWT verification error:', error.message);
    const isExpired = error.name === 'TokenExpiredError';
    res.status(401).json({
      message: isExpired
        ? 'Token expired. Please log in again.'
        : 'Invalid or malformed token.',
    });
  }
});

/**
 * Role‑based Access Control (optional)
 * Allows certain actions only for specified roles (e.g. admin)
 */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions.' });
    }
    next();
  };
