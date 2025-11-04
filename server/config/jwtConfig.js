/**
 * JSON Web Token Configuration
 * -----------------------------------------------------
 * Manages JWT secret key, expiration duration, and security checks.
 * Follows 2025 Node.js authentication best practices.
 */

import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  // Secret key used to sign tokens
  secret: process.env.JWT_SECRET?.trim(),

  // Token expiration (default: 7 days)
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Optional configuration — advanced validation fields
  algorithm: 'HS256', // Recommended symmetric algorithm
  issuer: process.env.JWT_ISSUER || 'careerloop-auth-service',
  audience: process.env.JWT_AUDIENCE || 'careerloop-client',
};

// 1️⃣ Security: Ensure secret is defined and strong
if (!jwtConfig.secret) {
  console.error(
    '❌ FATAL: Missing JWT_SECRET in environment variables.\n' +
      '➡️  Generate a new strong secret using:\n' +
      '   node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
  );
  // Terminate process to prevent insecure startup
  process.exit(1);
}

// 2️⃣ Warn if fallback / test secret detected
if (jwtConfig.secret.length < 32) {
  console.warn(
    '⚠️ WARNING: JWT_SECRET appears weak (<32 chars). Use a randomly generated 64‑byte value for production.'
  );
} else {
  console.log(`🔐 JWT configured successfully | Expiration: ${jwtConfig.expiresIn}`);
}

export default jwtConfig;
