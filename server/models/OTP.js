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
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// ✅ No TTL index — OTPs will not expire automatically

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;
