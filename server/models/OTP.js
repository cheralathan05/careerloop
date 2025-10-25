import mongoose from 'mongoose'; // FIX: Changed require to import

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            // Added index for faster lookup during verification
            index: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // ✅ CRITICAL FIX: Add a TTL index to ensure documents expire automatically
            // This tells MongoDB to delete the document 600 seconds (10 minutes) after 'createdAt'
            expires: 600, 
        },
    },
    { timestamps: true }
);

// Define the model
const OTP = mongoose.model('OTP', OTPSchema);

// FIX: Changed module.exports to standard ESM export
export default OTP;