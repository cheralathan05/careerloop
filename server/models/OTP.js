const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

// Automatically delete OTPs after 10 minutes
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 * 60 });

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;
