const mongoose = require('mongoose');

const skillAssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  domain: String,
  questions: [Object],
  results: Object
}, { timestamps: true });

module.exports = mongoose.model('SkillAssessment', skillAssessmentSchema);
