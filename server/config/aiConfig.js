// server/config/aiConfig.js (✅ FIXED VERSION)
export default {
  provider: 'gemini',
  model: 'gemini-1.5-flash', // You can also use gemini-1.5-pro if needed
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  apiKey: process.env.GEMINI_API_KEY || '',
};
