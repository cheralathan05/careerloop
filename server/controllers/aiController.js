// server/controllers/aiController.js
const asyncHandler = require('express-async-handler');
const aiService = require('../services/aiService'); // Assuming this exposes the AI call function
const { success } = require('../utils/responseHandler');

/**
 * @desc Get career path recommendations for a user.
 * @route GET /api/ai/recommendations/:userId
 * @access Private/Authenticated
 */
exports.getRecommendations = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user?.id;
    
    // --- INTEGRATE AI SERVICE HERE FOR REAL DATA ---
    // Example: fetch user profile data and pass it to a recommendation function
    const userProfileData = { /* fetch data using userId */ };
    
    // Call the AI service to get real recommendations
    // const recs = await aiService.generateRecommendations(userProfileData);
    
    // Using the stub for now, but ready for AI integration:
    const recs = { tasks: ['Build portfolio'], mentors: ['Find mentor'] }; 

    success(res, 200, recs);
});

/**
 * @desc Chat with the AI assistant.
 * @route POST /api/ai/chat
 * @access Private/Authenticated
 */
exports.chat = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ message: 'Chat prompt is required.' });
    }

    try {
        // --- DEPENDING ON AI SERVICE HERE ---
        // 1. Call your AI service function (e.g., getAiReply or generateText)
        const aiResponseText = await aiService.getAiReply(prompt); 
        
        // 2. Return the real AI reply
        success(res, 200, { reply: aiResponseText });
        
    } catch (error) {
        // Handle potential AI API errors
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: 'Failed to get a response from the AI assistant.' });
    }
});