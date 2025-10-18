// server/server.js

// 🛑 1. Load Environment Variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // MongoDB connection
const passport = require('passport');

const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// 🛑 2. Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Initialize Passport (for Google OAuth)
app.use(passport.initialize());

// --- Routes ---
app.get('/', (req, res) => res.send('Authentication API is running'));
app.use('/api/auth', authRoutes);

// --- Error Handling ---
// Not Found (404)
app.use(notFound);
// General Error Handler
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
