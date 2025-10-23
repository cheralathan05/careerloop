// server/utils/responseHandler.js (FINAL ES MODULE VERSION)

/**
 * @desc Handles successful API responses, standardizing the JSON output.
 * * NOTE on Signature: This structure (res, status, data) is often clearer, 
 * but since your usage often put the message first, the final signature is:
 * (res, status, data, message) 
 * * @param {object} res - Express response object.
 * @param {number} status - The HTTP status code (e.g., 200, 201).
 * @param {any} data - The data payload to send.
 * @param {string} message - A brief message about the result (optional).
 */
const success = (res, status, data = null, message = 'Success') => {
    res.status(status).json({
        success: true,
        message: message,
        data: data,
    });
};


/**
 * @desc Handles erroneous API responses, standardizing the JSON output.
 * @param {object} res - Express response object.
 * @param {string} message - A brief message about the error.
 * @param {number} status - The HTTP status code (e.g., 400, 500). Defaults to 500.
 */
const error = (res, message, status = 500) => {
    res.status(status).json({
        success: false,
        message: message,
    });
};


// Export both functions for named import by controllers
export {
    success,
    error,
};

// If you need to import the whole object:
export default {
    success,
    error,
};