import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple documents to have a null phone field
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
    },
}, { timestamps: true });

// Middleware to hash password before saving the user document
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);
export default User;