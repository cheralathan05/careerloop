// server/controllers/mentorController.js
const asyncHandler = require('express-async-handler');
const Mentor = require('../models/Mentor');
const { success } = require('../utils/responseHandler'); // Assuming this utility exists

/**
 * @desc Lists mentors with optional text search and basic filtering/pagination.
 * @route GET /api/mentors
 * @access Public
 */
exports.list = asyncHandler(async (req, res) => {
    // --- 1. Get Query Parameters ---
    const { 
        q, 
        limit = 50, 
        skip = 0,
        domain // e.g., ?domain=software
    } = req.query; 

    // --- 2. Build the MongoDB Query Object ---
    let query = {};
    let sortOptions = { name: 1 }; // Default sort by name

    if (domain) {
        // Add domain filtering (assuming 'domain' is a field in your Mentor model)
        query.domain = domain; 
    }

    if (q) {
        // Use $text search operator
        query.$text = { $search: q };
        // When using $text, MongoDB provides a score we can sort by
        sortOptions = { score: { $meta: 'textScore' } };
    }

    // --- 3. Execute the Query ---
    const mentors = await Mentor.find(query)
        .select('-__v') // Exclude Mongoose version key
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .sort(sortOptions)
        // If a text search was performed, project the score to see how results are ranked
        .lean(); 

    // --- 4. Return Response ---
    success(res, 200, {
        count: mentors.length,
        total: await Mentor.countDocuments(query), // Optional: for client-side pagination
        mentors: mentors 
    });
});