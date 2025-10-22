const asyncHandler = require('express-async-handler');
const AnalyticsEvent = require('../models/AnalyticsEvent');

exports.track = asyncHandler(async (req, res) => {
  const { type, payload } = req.body;
  const user = req.user?.id || null;
  const ev = await AnalyticsEvent.create({ user, eventType: type, payload });
  res.json({ message: 'tracked', ev });
});

exports.getEvents = asyncHandler(async (req, res) => {
  const events = await AnalyticsEvent.find().sort({ createdAt: -1 }).limit(100);
  res.json({ events });
});
