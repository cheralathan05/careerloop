// server/middleware/ratingValidationMiddleware.js (ES Module format)

/**
 * @desc Middleware to validate the 'rating' field in the request body.
 * Ensures the rating exists and is between 0 and 5, inclusive.
 */
const ratingValidation = (req, res, next) => {
    // Note: We use parseFloat to handle string-encoded numbers from the request body
    const rating = parseFloat(req.body.rating); 

    // 1. Check for null/undefined/NaN or out-of-range value
    if (rating == null || isNaN(rating) || rating < 0 || rating > 5) {
        res.status(400); // Set the HTTP status code
        // Pass a new Error object to the central error handler
        return next(new Error('Invalid rating. A numerical value between 0 and 5 is required.')); 
    }
    
    // 2. Attach the clean, parsed number back to the body/request if needed
    req.body.rating = rating; 
    
    next();
};

export default ratingValidation;