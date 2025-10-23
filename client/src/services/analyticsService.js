import apiClient from './apiClient';

const ANALYTICS_BASE_URL = 'analytics';

/**
 * @desc Sends a fire-and-forget event to the backend analytics tracker.
 * This function is non-blocking.
 * @param {string} eventType - The action taken (e.g., 'domain_selected', 'login_success').
 * @param {object} [payload={}] - Additional data for the event.
 * @returns {Promise<void>} Resolves immediately, but errors are only logged.
 */
export const trackEvent = async (eventType, payload = {}) => {
    try {
        // POST /api/analytics/track
        // We do not await this, making it non-blocking
        await apiClient.post(`${ANALYTICS_BASE_URL}/track`, { 
            type: eventType, 
            payload: payload 
        });
        
    } catch (error) {
        // Log error but do not disrupt the user's main action
        console.warn(`[Analytics Fail] Event: ${eventType}, Error: ${error.message}`);
    }
};