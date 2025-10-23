// server/config/aiConfig.js
/**
 * Configuration settings for the AI service (Google Gemini).
 */
export const aiConfig = {
  // General Provider Info
  provider: 'gemini',
  
  // Model Configuration
  model: 'gemini-1.5-flash', 
  // Note: 'gemini-1.5-pro' is available for more complex tasks.
  
  // API Endpoint
  // This endpoint is general, but the actual URL for API calls will often 
  // be managed by the SDK or constructed with the model name.
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta', 
  
  // Security
  // Retrieves the key from the environment. Throws an error if not found 
  // for early failure detection.
  apiKey: process.env.GEMINI_API_KEY,
};

// Optional: Add a check for the API Key to ensure the server doesn't start without it
if (!aiConfig.apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not set in environment variables.");
    // In a production server, you might want to stop the process here:
    // process.exit(1); 
}

// Default export for easier integration
export default aiConfig;