import apiClient from './apiClient';

const ANALYTICS_BASE_URL = 'analytics'; // Appends to VITE_API_BASE_URL (e.g., /api/analytics)

/**
 * @desc Sends a fire-and-forget event to the backend analytics tracker.
 * This function is non-blocking (the caller should not await the result).
 * @param {string} eventType - The action taken (e.g., 'domain_selected', 'login_success').
 * @param {object} [payload={}] - Additional data for the event.
 * @returns {Promise<void>} Resolves immediately, but errors are only logged.
 */
export const trackEvent = async (eventType, payload = {}) => {
    try {
        // POST /api/analytics/track
        // We use 'await' here to ensure the API call starts and completes/fails gracefully
        // within this function, but the *caller* of trackEvent should not await it
        // if they want non-blocking behavior.
        await apiClient.post(`${ANALYTICS_BASE_URL}/track`, { 
            type: eventType, 
            payload: payload 
        });
        
    } catch (error) {
        // Log error but do not disrupt the user's main action (non-critical function)
        console.warn(`[Analytics Fail] Event: ${eventType}, Error:`, error.message);
    }
};

export default { trackEvent };
