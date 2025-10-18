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
    },
});

// Automatically delete OTPs after 10 minutes
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 10 });

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;
