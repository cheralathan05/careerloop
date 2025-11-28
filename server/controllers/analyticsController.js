/**
 * Analytics Controller
 * ------------------------------------------------------
 * Tracks and retrieves analytics events via the centralized service layer.
 * Compatible with Express 5 native async error handling.
 */

import analyticsService from '../services/analyticsService.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { success } from '../utils/responseHandler.js';

/**
 * @desc Track an analytics event.
 * @route POST /api/analytics/track
 * @access Public / Authenticated (configurable)
 */
export const track = async (req, res) => {
  const { type, payload } = req.body;
  const userId = req.user?.id || null;

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ message: 'Event type is required.' });
  }

  try {
    // Pass to service layer (DB, Mixpanel, or internal)
    await analyticsService.track(type, {
      ...payload,
      userId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Return immediately (async fire-and-forget pattern)
    success(res, 200, { message: 'Analytics event accepted.' });
  } catch (error) {
    console.error('❌ Analytics tracking failed:', error.message);
    res.status(500).json({ message: 'Failed to record event.', error: error.message });
  }
};

/**
 * @desc Retrieve recent analytics events (admin/internal-only)
 * @route GET /api/analytics/events
 * @access Private / Admin
 */
export const getEvents = async (req, res) => {
  try {
    const
      .select('-__v');

s.status(500).json({ message: 'Unable to fetch analytics logs.' });
  }
};
