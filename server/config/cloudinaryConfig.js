/**
 * Cloudinary Configuration
 * ------------------------------------------------------
 * Handles secure Cloudinary initialization using environment variables.
 * Ensures credentials are validated before configuration.
 */

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// 1️⃣ Load required environment variables
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

// 2️⃣ Validate configuration
if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error(
    '❌ FATAL ERROR: Missing Cloudinary credentials. Please ensure the following are set in .env:\n' +
      '➡️ CLOUDINARY_CLOUD_NAME\n➡️ CLOUDINARY_API_KEY\n➡️ CLOUDINARY_API_SECRET'
  );
  process.exit(1); // Prevent app start without credentials (critical for image handling)
}

// 3️⃣ Initialize Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true, // Always use HTTPS URLs
  timeout: 60000, // Default timeout: 60s for large uploads
});

// 4️⃣ Optional check & confirmation
console.log(`☁️  Cloudinary configured successfully for cloud: '${CLOUD_NAME}'`);

export default cloudinary;
