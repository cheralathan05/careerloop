// server/models/Mentor.js (ES Module Format)
import mongoose from 'mongoose';

/**
 * Schema for storing mentor profiles.
 */
const MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mentor name is required'],
    trim: true,
  },
  bio: {
    type: String,
    required: [true, 'A short biography is required'],
  },
  // CRITICAL: Renamed 'expertise' to 'domain' for consistency with the controller
  domain: { 
    type: String, 
    required: true, 
    trim: true,
    index: true // Index for domain filtering
  },
  expertise: {
    type: [String], // Specific skills/technologies the mentor is proficient in
    default: [],
  },
  contact: {
    type: String, // E.g., email or external contact link
    required: true,
  },
  profileUrl: {
    type: String, // Link to an external professional profile or a stored image URL
    required: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  }
}, { 
  timestamps: true 
});

// CRITICAL: Define a Text Index for Search (as required by mentorController.js)
// This enables the `$text` search operation in your controller.
MentorSchema.index({ 
    name: 'text', 
    bio: 'text', 
    domain: 'text',
    expertise: 'text'
}, { 
    // Weighting prioritizes matches in the name and domain fields
    weights: { name: 5, domain: 3, bio: 1 } 
});

const Mentor = mongoose.model('Mentor', MentorSchema);
export default Mentor;