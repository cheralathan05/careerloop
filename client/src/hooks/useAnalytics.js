// src/hooks/useAnalytics.js

import { useCallback } from 'react';
import analyticsService from '../services/analyticsService';

export default function useAnalytics() {
    
    // Function to track any custom event
    const trackEvent = useCallback((eventName, properties = {}) => {
        // Log to console for debugging
        console.log(`[ANALYTICS] Tracking: ${eventName}`, properties);
        
        // Asynchronously send data to the backend/analytics service
        analyticsService.sendEvent(eventName, properties);
    }, []);

    // Function specifically for phase tracking
    const trackPhase = useCallback((phaseNumber, data = {}) => {
        const eventName = `ONBOARDING_PHASE_${phaseNumber}_VIEWED`;
        trackEvent(eventName, { ...data, phase: phaseNumber });
    }, [trackEvent]);

    return {
        trackEvent,
        trackPhase,
    };
}