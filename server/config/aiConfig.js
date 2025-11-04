/**
 * AI Configuration — Google Gemini API
 * ------------------------------------------------------
 * This module defines configuration and validation
 * for connecting with Google's Generative AI models.
 */

import dotenv from 'dotenv';
dotenv.config(); // Ensure environment variables are loaded early

export const aiConfig = {
  provider: 'gemini',

  // Default model setup
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',

  // API endpoint ("v1beta" used for Gemini v1/v2)
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta',

  // Secure API key from environment
  apiKey: process.env.GEMINI_API_KEY?.trim(),

  // Timeout (in ms)
  timeout: Number(process.env.GEMINI_TIMEOUT || 30000),

  // Feature toggles for development
  enable: process.env.ENABLE_GEMINI === 'true',
};

// --------- Validation Section ---------
if (!aiConfig.apiKey && aiConfig.enable) {
  console.error(
    '❌ FATAL ERROR: GEMINI_API_KEY is not set in environment variables.\n' +
      '→ Fix: Add GEMINI_API_KEY to your .env file before starting the server.'
  );
  process.exit(1); // Prevent accidental server start without credentials
}

if (aiConfig.enable) {
  console.log(`🤖 Gemini AI initialized: ${aiConfig.model}`);
}

export default aiConfig;
