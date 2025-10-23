import { useContext, useMemo, useCallback } from 'react';
import { OnboardingContext } from '../context/OnboardingContext';
import { useAuth } from './useAuth';
// Import necessary service functions
import { getRecommendedDomains } from '../services/onboardingService'; 

/**
 * @desc Custom hook to manage the full, multi-step onboarding process state and logic.
 * Orchestrates phase navigation and key API calls.
 */
export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    
    // Destructure core state and setters
    const { 
        onboardingState, 
        setOnboardingData, 
        nextPhase, 
        setIsLoading, 
        isLoading 
    } = context;

    const { user } = useAuth(); 

    // --- Phase-Specific Actions ---

    /**
     * Handles the successful submission of the User Details form (Phase 2).
     * Triggers domain recommendation and moves to Phase 3.
     * @param {object} details - The submitted form data.
     */
    const handleDetailsSubmission = useCallback(async (details) => {
        setIsLoading(true);
        
        try {
            // 1. Update client state with details (This is where skills/interests are saved)
            setOnboardingData('details', details);

            // 2. Trigger AI domain recommendation (GET /api/onboarding/domains)
            const domains = await getRecommendedDomains();

            // 3. Update state with AI results and move to next step
            setOnboardingData('domains', domains);
            nextPhase();
            
        } catch (err) {
            // Handle error (e.g., set an error state, show toast)
            console.error('Failed to submit details or fetch domains:', err);
            // Fallback for demo/testing if API fails:
            setOnboardingData('domains', [{name: 'Web Development', score: 8.0}, {name: 'Data Science', score: 7.0}]);
            nextPhase();
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setOnboardingData, nextPhase]);


    // Expose all context values and specialized handlers
    return useMemo(() => ({
        ...context, 
        handleDetailsSubmission,
        // Other handlers (handleDomainSelection, handleAssessmentSubmission) would go here
    }), [context, handleDetailsSubmission]);
};