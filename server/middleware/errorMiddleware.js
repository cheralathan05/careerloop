// server/middleware/errorMiddleware.js

// Handles not found routes (e.g., a request to /api/users when /api/user is correct)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the errorHandler
};

// Main error handling function
const errorHandler = (err, req, res, next) => {
    // Determine the status code (default to 500 if it was 200)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        // Only provide stack trace in development environment for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};