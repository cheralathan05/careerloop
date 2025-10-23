// server/models/Onboarding.js (ES Module Format)
import mongoose from 'mongoose';

/**
 * Schema for storing user data collected during the initial onboarding process,
 * including raw input, selected paths, and assessment results.
 */
const OnboardingSchema = new mongoose.Schema({
  // CRITICAL: Link to the User, ensuring one onboarding record per user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Only one onboarding record per user
    index: true
  },

  // 1. Raw Personal/Input Information
  personalInfo: {
    fullName: { type: String, trim: true },
    education: { type: String, trim: true },
    role: { type: String, trim: true },
    interests: { type: [String], default: [] },
    skills: { type: [String], default: [] }
  },

  // 2. AI/User-Selected Path
  selectedDomains: { 
    type: [String], 
    default: [] 
  },

  // 3. Assessment and Recommendation Results
  skillScores: { 
    // Example: { "Data Science": 80, "Web Development": 45 }
    type: Object, 
    default: {} 
  },
  recommendations: { 
    // Example: { "nextStep": "Build a Portfolio" }
    type: Object, 
    default: {} 
  },

  // 4. Status Flag
  completed: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true // Tracks when the onboarding record was first created and last updated
});

const Onboarding = mongoose.model('Onboarding', OnboardingSchema);
export default Onboarding;