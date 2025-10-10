// server/server.js

const express = require('express');
const dotenv = require('dotenv').config(); // Load environment variables
const cors = require('cors');
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware'); // Simple error handler

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json()); // Body parser for raw JSON
app.use(express.urlencoded({ extended: false })); // Body parser for form data

// CORS Configuration (Essential for frontend communication)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from your React frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allows cookies/authorization headers
}));

// --- Routes ---
app.get('/', (req, res) => res.send('Authentication API is running'));
app.use('/api/auth', authRoutes);

// --- Error Handler Middleware ---
// This should be the last middleware used
app.use(errorHandler); 


app.listen(port, () => console.log(`Server started on port ${port}`));


// --- Simple Error Handler Example (Create this in server/middleware/errorMiddleware.js) ---
/*
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
*/