// server/server.js (FINAL CORRECTED VERSION)

// 🛑 1. Load Environment Variables EXPLICITLY FIRST
// We must ensure the .env file is loaded and variables (like MONGO_URI) are available.
const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Database connection utility
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { notFound } = require('./middleware/errorMiddleware'); // Also import notFound
const passport = require('passport'); // Required for Google OAuth

// 🛑 2. Connect to database ONLY AFTER dotenv has run
connectDB(); 

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Initialize Passport for Google OAuth
app.use(passport.initialize());

// --- Routes ---
app.get('/', (req, res) => res.send('Authentication API is running'));
app.use('/api/auth', authRoutes);

// --- Error Handler Middleware ---
// 🛑 3. Add notFound middleware before the general errorHandler
// If no route is found, this hits first.
app.use(notFound); 
app.use(errorHandler); 


app.listen(port, () => console.log(`Server started on port ${port}`));

// Note: You must ensure 'notFound' and 'errorHandler' are implemented and exported 
// in server/middleware/errorMiddleware.js.