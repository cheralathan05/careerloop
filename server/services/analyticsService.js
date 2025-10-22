const AnalyticsEvent = require('../models/AnalyticsEvent');

exports.log = async (user, type, payload = {}) => {
  return AnalyticsEvent.create({ user, eventType: type, payload });
};
