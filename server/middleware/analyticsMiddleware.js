const AnalyticsEvent = require('../models/AnalyticsEvent');

module.exports = async (req, res, next) => {
  // Lightweight: store phase transition if provided
  try {
    const userId = req.user?.id;
    if (userId && req.body && req.body._trackEvent) {
      await AnalyticsEvent.create({
        user: userId,
        eventType: req.body._trackEvent,
        payload: req.body._trackPayload || {}
      });
    }
  } catch (err) {
    console.warn('Analytics middleware failed', err.message);
  }
  next();
};
