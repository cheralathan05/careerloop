// server/utils/logger.js (ES Module Format)

// Check if the current environment is production
const isProduction = process.env.NODE_ENV === 'production';

/**
 * @desc Logging Utility for consistent message formatting.
 */
const logger = {
    /**
     * @desc Logs an informative message. Suppressed in Production mode.
     */
    info: (...args) => {
        if (!isProduction) {
            console.log('[INFO]', ...args);
        }
    },
    
    /**
     * @desc Logs a warning message (e.g., non-critical errors, fallbacks).
     */
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },
    
    /**
     * @desc Logs a critical error message.
     */
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },
};

export default logger;