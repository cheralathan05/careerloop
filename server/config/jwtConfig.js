// server/config/jwtConfig.js (ES Module format)
import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration for JSON Web Tokens (JWT).
 */
export const jwtConfig = {
  // CRITICAL: Fetches the secret key from environment variables.
  // Using a strong default is safer than an empty string, but a warning is needed.
  secret: process.env.JWT_SECRET,
  
  // Defines the token's lifetime (e.g., '7d', '1h', '30m')
  expiresIn: process.env.JWT_EXPIRES_IN || '7d', 
};

// CRITICAL: Safety Check
if (!jwtConfig.secret || jwtConfig.secret === 'default_jwt_secret') {
    console.warn("⚠️ WARNING: JWT_SECRET is missing or using the default. Use a strong, unique secret in your .env file for security.");
    // In a real application, you should enforce a strong, random secret.
    if (!jwtConfig.secret) {
        // Fallback to a placeholder secret if not defined, but logging the error is key.
        jwtConfig.secret = 'default_jwt_secret_placeholder'; 
    }
}

export default jwtConfig;