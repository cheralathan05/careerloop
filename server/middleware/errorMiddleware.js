// server/middleware/errorMiddleware.js (ES Module format)

/**
 * @desc Middleware to handle 404 - Not Found errors for any unhandled routes.
 */
const notFound = (req, res, next) => {
    // 1. Create a clear Error object
    const error = new Error(`Not Found - ${req.originalUrl}`);
    
    // 2. Set the response status to 404
    res.status(404);
    
    // 3. Pass the error object to the next error handling middleware
    next(error); 
};

/**
 * @desc General error handling middleware (with four arguments: err, req, res, next).
 * This catches all errors passed via next(error) or thrown by controllers/middleware.
 */
const errorHandler = (err, req, res, next) => {
    
    // 1. Determine the status code
    // If res.statusCode is 200 (meaning an error was thrown before a status was set), 
    // default to 500 (Internal Server Error). Otherwise, use the existing status.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // 2. Set the status and send the JSON response
    res.status(statusCode).json({
        message: err.message,
        // Only include the stack trace in development for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    
    // Do not call next() here unless you have more error handlers to process.
};

export {
    notFound,
    errorHandler,
};