// server/models/AnalyticsEvent.js (ES Module Format)
import mongoose from 'mongoose';
// Import your config to get the retention period
import analyticsConfig from '../config/analyticsConfig.js'; 

const ANALYTICS_RETENTION_DAYS = analyticsConfig.RETENTION_DAYS || 90;

/**
 * Schema for storing internal user and system events.
 */
const AnalyticsEventSchema = new mongoose.Schema({
  // Link to the User who performed the action (can be null for public actions)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    index: true // Index for fast lookup by user
  },
  
  // The type of event (e.g., 'user_login_success', 'quiz_completed')
  eventType: {
    type: String,
    required: true,
    index: true // Index for fast lookups by event type
  },
  
  // Custom data associated with the event
  payload: {
    type: Object,
    default: {}
  },
  
  // Timestamp of the event
  createdAt: { 
    type: Date, 
    default: Date.now,
    // CRITICAL: MongoDB Time-To-Live (TTL) Index
    // This setting tells MongoDB to automatically delete the document 
    // after the specified number of seconds has passed since `createdAt`.
    expires: ANALYTICS_RETENTION_DAYS * 24 * 60 * 60, 
  }
}, { 
  timestamps: false // We use the custom `createdAt` for the TTL index
});

const AnalyticsEvent = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
export default AnalyticsEvent;