const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventType: String,
  payload: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
