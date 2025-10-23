// server/config/cloudinaryConfig.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration and Initialization for the Cloudinary service.
 */
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// 1. Check for required environment variables
if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error("FATAL ERROR: Cloudinary credentials (CLOUD_NAME, API_KEY, or API_SECRET) are missing.");
    // In a critical server environment, you might want to stop the process:
    // process.exit(1); 
}

// 2. Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true, // Always use HTTPS
});

// 3. Export the configured instance
export default cloudinary;