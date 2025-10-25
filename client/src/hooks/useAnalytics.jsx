import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { trackEvent } from '../services/analyticsService'; // Assuming service exists

/**
 * @desc Custom hook to simplify logging analytics events across the application.
 */
export const useAnalytics = () => {
    const { user } = useAuth();

    /**
     * Logs an event to the backend analytics endpoint.
     * The call is non-blocking and fire-and-forget.
     * @param {string} eventType - The action taken (e.g., 'domain_selected', 'quiz_started').
     * @param {object} [payload={}] - Additional data for the event.
     */
    const track = useCallback((eventType, payload = {}) => {
        // Only track if the user is available (or track as 'guest' if required)
        const userId = user?.id || null;
        
        // This is non-blocking (fire-and-forget) to ensure it doesn't slow down the main thread
        trackEvent(eventType, { ...payload, userId })
            .catch(err => console.warn(`[Analytics Failed] Event: ${eventType}, Error: ${err.message}`));

    }, [user]);

    return { track };
};