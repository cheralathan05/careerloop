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

      .limit(100)
      .select('-__v');

s.status(500).json({ message: 'Unable to fetch analytics logs.' });
  }
};
