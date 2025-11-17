/**
 * Course Controller — Suggests courses by career domain
 * -------------------------------------------------------
 * Handles recommendation queries by domain (public or authenticated route).
 * Follows MVC + service-layer architecture principles.
 */
// In courseController.js
import * as courseService from '../services/courseSuggestionService.js';
import { success } from '../utils/responseHandler.js';

/**
 * @desc Get course suggestions based on a specific career domain.
 * @route GET /api/courses/suggest/:domain
 * @access Public or Authenticated (configurable)
 */
export const getByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    // Validate domain name
    if (!domain || typeof domain !== 'string') {
      return res
        .status(400)
        .json({ message: 'Domain parameter is required and must be a string.' });
    }

    // Sanitize/normalize input
    const safeDomain = domain.toLowerCase().trim();

    // Retrieve courses via the service layer
    const courses = await courseService.suggest(safeDomain);

    // Return standardized response
    success(res, 200, {
      domain: safeDomain,
      count: Array.isArray(courses) ? courses.length : 0,
      courses: courses || [],
    });
  } catch (error) {
    console.error('❌ Course suggestion error:', error.message);
    res.status(500).json({
      message: 'Failed to generate course suggestions.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
