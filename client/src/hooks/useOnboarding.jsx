import { useContext, useMemo, useCallback } from 'react';
import { OnboardingContext } from '../context/OnboardingContext';
import { useAuth } from './useAuth';
import { getRecommendedDomains, generateQuiz, submitQuizResults } from '../services/onboardingService';

/**
 * @desc Custom hook to manage the multi-step onboarding flow and AI interactions.
 */
export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }

    const { onboardingState, setOnboardingData, nextPhase, setIsLoading, isLoading, onboardingError, setOnboardingError } = context;
    const { user } = useAuth();

    // --- Phase 2: User Details Submission ---
    const handleDetailsSubmission = useCallback(async (details) => {
        setIsLoading(true);
        setOnboardingError(null);

        try {
            setOnboardingData('details', details);

            const domains = await getRecommendedDomains(details);
            setOnboardingData('domains', domains);

            nextPhase(); // Move to Domain Selection
        } catch (err) {
            console.error(err);
            setOnboardingError('Failed to submit details or fetch domains.');
            // Fallback for demo
            setOnboardingData('domains', [{name: 'Web Development', score: 8}, {name: 'Data Science', score: 7}]);
            nextPhase();
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setOnboardingData, nextPhase, setOnboardingError]);

    // --- Phase 3: Domain Selection ---
    const handleDomainSelection = useCallback((selectedDomains) => {
        if (!selectedDomains || selectedDomains.length === 0) {
            setOnboardingError('Please select at least one domain.');
            return;
        }
        setOnboardingData('selectedDomains', selectedDomains);
        nextPhase(); // Move to Skill Assessment
    }, [setOnboardingData, nextPhase, setOnboardingError]);

    // --- Phase 4: Skill Assessment Submission ---
    const handleAssessmentSubmission = useCallback(async (answersPayload) => {
        setIsLoading(true);
        setOnboardingError(null);
        try {
            setOnboardingData('quizAnswers', answersPayload);

            const summary = await submitQuizResults(answersPayload);
            setOnboardingData('summary', summary);

            nextPhase(); // Move to Onboarding Summary
        } catch (err) {
            console.error(err);
            setOnboardingError('Failed to submit assessment.');
            nextPhase();
        } finally {
            setIsLoading(false);
        }
    }, [setOnboardingData, nextPhase, setOnboardingError, setIsLoading]);

    return useMemo(() => ({
        onboardingState,
        setOnboardingData,
        nextPhase,
        isLoading,
        onboardingError,
        setOnboardingError,
        handleDetailsSubmission,
        handleDomainSelection,
        handleAssessmentSubmission,
    }), [
        onboardingState,
        setOnboardingData,
        nextPhase,
        isLoading,
        onboardingError,
        setOnboardingError,
        handleDetailsSubmission,
        handleDomainSelection,
        handleAssessmentSubmission
    ]);
};
