/**
 * Mentor Controller
 * ------------------------------------------------------
 * Handles mentor listing, search, and filtering by domain.
 * Uses modern async/await, safe input handling, and consistent API responses.
 */

import Mentor from '../models/Mentor.js';
import { success } from '../utils/responseHandler.js';

/**
 * @desc Lists mentors with optional text search, filtering, and pagination
 * @route GET /api/mentors
 * @access Public
 */
export const list = async (req, res) => {
  try {
    // 1️⃣ Extract and sanitize query parameters
    const {
      q = '',
      domain,
      limit = 50,
      skip = 0,
      sort = 'name', // Default sort field
      order = 'asc', // asc | desc
    } = req.query;

    const maxLimit = Math.min(parseInt(limit, 10) || 50, 100); // hard cap: 100
    const offset = Math.max(parseInt(skip, 10) || 0, 0);

    // 2️⃣ Build MongoDB query dynamically
    const query = {};
    if (domain) query.domain = domain.trim();
    if (q) query.$text = { $search: q.trim() };

    // 3️⃣ Define sorting logic
    const sortOptions =
      q && !sort ? { score: { $meta: 'textScore' } } : { [sort]: order === 'desc' ? -1 : 1 };

    // 4️⃣ Execute query with optional textScore projection
    const mentors = await Mentor.find(query)
      .select(q ? { score: { $meta: 'textScore' } } : '-__v')
      .limit(maxLimit)
      .skip(offset)
      .sort(sortOptions)
      .lean();

    // 5️⃣ Get total count for pagination metadata
    const total = await Mentor.countDocuments(query);

    // 6️⃣ Use standardized response
    success(res, 200, {
      total,
      count: mentors.length,
      pageSize: maxLimit,
      pageOffset: offset,
      mentors,
    });
  } catch (error) {
    console.error('❌ Mentor listing failed:', error.message);
    res.status(500).json({
      message: 'Failed to fetch mentor list.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
