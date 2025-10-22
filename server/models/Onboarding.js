const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    fullName: String,
    education: String,
    role: String,
    interests: [String],
    skills: [String]
  },
  selectedDomains: [String],
  skillScores: { type: Object, default: {} },
  recommendations: { type: Object, default: {} },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Onboarding', onboardingSchema);
