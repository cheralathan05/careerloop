// server/models/SkillAssessment.js (ES Module Format)
import mongoose from 'mongoose';

/**
 * Define a sub-schema for individual assessment attempts for better structure
 */
const AssessmentQuestionSchema = new mongoose.Schema({
    questionText: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean,
}, { _id: false }); // Don't generate an _id for sub-documents if not necessary

/**
 * Schema for storing a user's completed skill assessment results.
 */
const SkillAssessmentSchema = new mongoose.Schema({
  // Link to the User who took the assessment
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Index for fast retrieval of all assessments by user
  },
  
  // The career domain the assessment was focused on
  domain: { 
    type: String,
    required: true,
    index: true // Index for filtering assessments by domain
  },
  
  // The list of questions and the user's answers for auditability
  questions: {
    type: [AssessmentQuestionSchema],
    default: [],
  },
  
  // Summary of the assessment results (e.g., score, percentage)
  results: { 
    type: Object, // Could be { rawScore: 4, totalQuestions: 5, percentage: 80 }
    default: {}
  },

  // Status to track if the assessment is completed, pending, or failed
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed' // Assuming you only store completed assessments
  }
}, { 
  timestamps: true // Tracks when the assessment was created and completed
});

const SkillAssessment = mongoose.model('SkillAssessment', SkillAssessmentSchema);
export default SkillAssessment;