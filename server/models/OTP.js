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
        // Automatically delete the document after 10 minutes (600 seconds)
        expires: 60 * 10, 
    },
});

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;