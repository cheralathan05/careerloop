// server/models/Course.js (ES Module Format)
import mongoose from 'mongoose';

/**
 * Schema for storing suggested courses (e.g., from AI or a manual list).
 */
const CourseSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true,
    trim: true 
  },
  provider: { 
    type: String, 
    required: true,
    trim: true
  }, // e.g., 'Coursera', 'Udemy'
  url: { 
    type: String, 
    required: true 
  },
  domain: { 
    type: String, 
    required: true,
    index: true // Index for fast filtering by career domain
  }, 
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], // Restrict to valid levels
    default: 'Beginner'
  },
  // Adding timestamps to track when a course was added/updated
}, { 
  timestamps: true 
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;