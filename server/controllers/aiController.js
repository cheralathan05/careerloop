/**
 * AI Controller
 * ------------------------------------------------------
 * Manages routes for AI recommendations and chat interactions.
 * Now fully async/await compatible with Express 5 automatic
 * error propagation — no need for express-async-handler.
 */

import aiService from '../services/aiService.js';
import { success } from '../utils/responseHandler.js';

/**
 * @desc Get personalized career path recommendations
 * @route GET /api/ai/recommendations/:userId
 * @access Private/Authenticated
 */
export const getRecommendations = async (req, res) => {
  const userId = req.params.userId || req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  // Example: Fetch user data from database or profile service
  const userProfileData = {}; // Replace with actual query logic

  // Get results from the AI recommendation service
  const recommendations =
    (await aiService.generateRecommendations(userProfileData)) || {
      tasks: ['Build portfolio'],
      mentors: ['Find mentor'],
    };

  success(res, 200, recommendations);
};

/**
 * @desc Chat with AI Assistant (Google Gemini or other models)
 * @route POST /api/ai/chat
 * @access Private/Authenticated
 */
export const chat = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ message: 'Chat prompt is required.' });
  }

  try {
    // Call AI service for a real response
    const aiReply = await aiService.getAiReply(prompt);

    if (!aiReply || typeof aiReply !== 'string') {
      throw new Error('Invalid AI response format.');
    }

    success(res, 200, { reply: aiReply });
  } catch (error) {
    console.error('❌ AI Chat Error:', error.message);
    res.status(500).json({
      message: 'Failed to get a response from the AI assistant.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
