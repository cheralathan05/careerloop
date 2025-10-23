// server/models/Domain.js (ES Module Format)
import mongoose from 'mongoose';

/**
 * Schema for storing structured career domain information.
 */
const DomainSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Domain name is required'],
    trim: true,
    uppercase: true, // Optional: Force consistency for easier lookup
    unique: true,     // CRITICAL: Ensures no two domains have the same name
    index: true       // Index for fast lookups
  },
  description: {
    type: String
  },
  skills: {
    type: [String], // Array of skills required for the domain
    default: []
  },
  demandScore: {
    type: Number, // A numerical score representing market demand
    min: 0,
    max: 10,
    default: 5
  }
}, { 
  timestamps: true // Track when domains were created/updated
});

const Domain = mongoose.model('Domain', DomainSchema);
export default Domain;