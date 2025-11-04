/**
 * Feedback Controller
 * -------------------------------------------------------
 * Handles user feedback submissions such as feature requests,
 * bug reports, and general comments.
 * Follows clean controller principles and async/await practices.
 */

import feedbackService from '../services/feedbackService.js';
import { success } from '../utils/responseHandler.js';

/**
 * @desc Submits user feedback (bug report, request, comment)
 * @route POST /api/feedback/submit
 * @access Private (requires authentication)
 */
export const submit = async (req, res) => {
  try {
    // Retrieve user info added by authentication middleware
    const userId = req.user?.id;

    // Destructure body with defaults for safety
    const { type = 'general', rating = null, comments, context = {} } = req.body;

    // Validate input early
    if (!comments || typeof comments !== 'string' || comments.trim() === '') {
      return res.status(400).json({ message: 'Feedback comments are required.' });
    }

    // Use service to save and process feedback
    const savedFeedback = await feedbackService.save(userId, {
      type,
      rating,
      comments: comments.trim(),
      context,
    });

    // Consistent success response
    success(res, 201, {
      message: 'Feedback received successfully.',
      feedbackId: savedFeedback._id,
    });
  } catch (error) {
    console.error('❌ Feedback submission failed:', error.message);
    res.status(500).json({
      message: 'Failed to submit feedback.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
