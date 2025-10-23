// server/controllers/courseController.js
const asyncHandler = require('express-async-handler');
const courseService = require('../services/courseSuggestionService');
const { success } = require('../utils/responseHandler'); // Assuming you have this utility

/**
 * @desc Get course suggestions based on a specific career domain.
 * @route GET /api/courses/suggest/:domain
 * @access Public/Authenticated (Depending on your requirement)
 */
exports.getByDomain = asyncHandler(async (req, res) => {
    const { domain } = req.params;

    if (!domain) {
        return res.status(400).json({ message: 'Domain parameter is required for suggestion.' });
    }

    // Sanitize or validate the domain parameter before passing it to the service
    const safeDomain = domain.toLowerCase().trim();

    // The service handles the complex logic (e.g., calling an AI, querying a DB, or scraping)
    const courses = await courseService.suggest(safeDomain);

    // Use a consistent response handler
    success(res, 200, { 
        domain: safeDomain,
        count: courses.length,
        courses: courses 
    });
});