// server/controllers/feedbackController.js
const asyncHandler = require('express-async-handler');
const feedbackService = require('../services/feedbackService');
const { success } = require('../utils/responseHandler'); // Assuming this utility exists

/**
 * @desc Submits user feedback (e.g., bug report, feature request, general comment).
 * @route POST /api/feedback/submit
 * @access Private (Requires authentication to get userId)
 */
exports.submit = asyncHandler(async (req, res) => {
    // Get user ID from the authentication middleware (req.user)
    const userId = req.user?.id; 

    // Destructure body to ensure only expected fields are passed
    const { type, rating, comments, context } = req.body;

    // Optional: Basic validation check
    if (!comments) {
        return res.status(400).json({ message: 'Feedback comments are required.' });
    }

    // Delegate saving and processing to the service layer
    const saved = await feedbackService.save(userId, { 
        type, 
        rating, 
        comments, 
        context 
    });
    
    // Use a consistent response handler
    success(res, 201, { message: 'Feedback received and saved.', feedbackId: saved._id });
});