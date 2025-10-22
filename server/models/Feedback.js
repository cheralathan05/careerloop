const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phase: String,
  rating: Number,
  comments: String
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
