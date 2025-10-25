import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { trackEvent } from '../services/analyticsService'; // Fixed in Step 6

/**
 * @desc Custom hook to simplify logging analytics events across the application.
 * This abstracts away the need to manually include the User ID in every event.
 */
export const useAnalytics = () => {
    // Access the current user from the Auth Context/Hook
    const { user } = useAuth();

    /**
     * Logs an event to the backend analytics endpoint.
     * The call is non-blocking and fire-and-forget.
     * @param {string} eventType - The action taken (e.g., 'domain_selected', 'quiz_started').
     * @param {object} [payload={}] - Additional data for the event.
     */
    const track = useCallback((eventType, payload = {}) => {
        // Retrieve the user ID, falling back to null if not authenticated
        const userId = user?.id || null;
        
        // Asynchronously call the tracking service. The caller does NOT await this.
        // The service itself handles the API call and logs errors internally.
        // We add an outer catch just for extreme debug safety, though the service covers it.
        trackEvent(eventType, { ...payload, userId })
            .catch(err => {
                 // Non-critical failure: only log to console, do not disrupt the user flow.
                 console.warn(`[Analytics Failed] Event: ${eventType}, Error:`, err);
            });

    }, [user]); // Recreate 'track' function only if 'user' changes (e.g., login/logout)

    return { track };
};

export default useAnalytics;