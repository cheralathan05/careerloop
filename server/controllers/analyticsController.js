// server/controllers/analyticsController.js
const asyncHandler = require('express-async-handler');
// 1. Import the central Analytics Service instead of the model
const analyticsService = require('../services/analyticsService'); 
// Assuming the service exposes a 'track' function
const { success } = require('../utils/responseHandler'); 
const AnalyticsEvent = require('../models/AnalyticsEvent'); // Keep the model for getEvents

/**
 * @desc Tracks an event using the configured analytics provider.
 * @route POST /api/analytics/track
 * @access Public/Authenticated (Depending on your requirements)
 */
exports.track = asyncHandler(async (req, res) => {
    const { type, payload } = req.body;
    // Get user ID from the request, usually added by a preceding middleware
    const userId = req.user?.id || null; 

    if (!type) {
        return res.status(400).json({ message: 'Event type is required.' });
    }

    // 2. Use the central service to track the event
    // The service internally decides whether to log to DB, send to Mixpanel, or do nothing.
    analyticsService.track(type, { 
        ...payload, 
        userId: userId,
        // Add more context like IP, user agent, etc., here or in a middleware
    });

    // 3. Return a successful, immediate response
    // We don't need to wait for the database interaction or external API call to finish
    // unless you specifically need the result object for the client.
    success(res, 200, { message: 'Analytics event accepted.' });
});

/**
 * @desc Retrieves the latest stored analytics events (for admin/internal use).
 * @route GET /api/analytics/events
 * @access Private/Admin
 */
exports.getEvents = asyncHandler(async (req, res) => {
    // This function still needs direct DB access if it's meant to retrieve internal logs.
    // We assume the service only handles tracking, not retrieval.
    const events = await AnalyticsEvent.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .select('-__v'); // Exclude the Mongoose version key
        
    success(res, 200, { count: events.length, events });
});