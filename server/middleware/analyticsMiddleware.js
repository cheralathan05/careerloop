// server/middleware/analyticsMiddleware.js (ES Module format)

// Import the central service we defined earlier
import analyticsService from '../services/analyticsService.js'; 
// Use an import for the model/async handler if needed, but the service handles it.

/**
 * Lightweight middleware to detect and track events provided in the request body.
 * Assumes a key like '_trackEvent' exists in the body.
 */
export default async (req, res, next) => {
    
    // Check if the service is available and configured
    if (!analyticsService || typeof analyticsService.track !== 'function') {
        // If the service is missing or disabled, quietly skip tracking
        return next(); 
    }

    try {
        const userId = req.user?.id;
        const body = req.body;
        
        // Check for the client-provided event fields in the body
        if (body && body._trackEvent) {
            
            const eventType = body._trackEvent;
            const eventPayload = {
                ...body._trackPayload, // Custom payload from the client
                // Add server-side context
                userId: userId, 
                method: req.method,
                path: req.originalUrl,
                ip: req.ip
            };
            
            // Log the event using the central service. 
            // We do NOT await this to ensure it doesn't slow down the main API response.
            analyticsService.track(eventType, eventPayload);
            
            // Optional: Remove tracking fields from the body before it hits the controller
            delete body._trackEvent;
            delete body._trackPayload;
        }
    } catch (err) {
        // Use console.warn for non-critical failures
        console.warn('Analytics middleware failed during tracking:', err.message);
    }
    
    next();
};