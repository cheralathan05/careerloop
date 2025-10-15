// server/models/OTP.js

const mongoose = require('mongoose');

const OTPSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Remove the 'expires' field from here if it exists.
        // It's cleaner to define the index explicitly below.
    },
});

// ✅ CRITICAL FIX: Explicitly define the TTL index using expireAfterSeconds (in seconds)
// This tells MongoDB to automatically delete the document 600 seconds (10 minutes) after creation.
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 10 }); 

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;