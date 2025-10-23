// server/models/Feedback.js (ES Module Format)
import mongoose from 'mongoose';

/**
 * Schema for storing user feedback, bug reports, and feature requests.
 */
const FeedbackSchema = new mongoose.Schema({
  // Link to the User who submitted the feedback (optional, for unauthenticated users)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true // Index for fast lookup of feedback by user
  },
  
  // Application phase where the feedback originated (e.g., 'onboarding', 'chat', 'profile')
  phase: {
    type: String,
    required: false, // Optional if feedback is general
    trim: true,
  },
  
  // Numerical rating (often 1-5 or 0-5)
  rating: { 
    type: Number,
    min: 0,
    max: 5, // CRITICAL: Schema-level validation for the rating range
    required: false
  },
  
  // The main text content of the feedback or report
  comments: { 
    type: String,
    required: [true, 'Feedback comments cannot be empty.'],
    trim: true
  },
  
  // Optional: A field to track the status (e.g., 'New', 'In Progress', 'Resolved')
  status: {
    type: String,
    enum: ['New', 'Acknowledged', 'Resolved', 'Archived'],
    default: 'New'
  }
}, { 
  timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;