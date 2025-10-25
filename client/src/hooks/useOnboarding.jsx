import { useContext, useMemo, useCallback, useState } from 'react';
import { OnboardingContext } from '../context/OnboardingContext';
import useAuth from './useAuth'; // <-- Correct: Getting the default export
// FIX 1: Import the correct function names from onboardingService.jsx (Step 8)
import { 
    saveUserDetails,
    getRecommendedDomains, 
    generateSkillQuiz, 
    submitAssessmentAnswers,
    getOnboardingSummary // Added to fetch the final summary
} from '../services/onboardingService';
import { showToast } from '../utils/toastNotifications';

/**
 * @desc Custom hook to manage the multi-step onboarding flow and AI interactions.
 */
export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }

    // Context State and Helpers
    const { onboardingState, setOnboardingData, nextPhase, prevPhase, setIsLoading, isLoading } = context;
    const { user } = useAuth();
    
    // FIX 2: Local state for errors, since it wasn't in OnboardingContext
    const [onboardingError, setOnboardingError] = useState(null);

    // --- Core Action: Fetch Quiz (Called after domain selection) ---
    const fetchQuiz = useCallback(async () => {
        setIsLoading(true);
        setOnboardingError(null);
        try {
            const quiz = await generateSkillQuiz(); // FIX: Calls the correct service function
            setOnboardingData('quiz', quiz);
            nextPhase(); // Move to Skill Assessment
        } catch (err) {
            console.error("Quiz generation failed:", err);
            setOnboardingError('Failed to generate skill assessment quiz.');
            showToast('Failed to generate quiz.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setOnboardingData, nextPhase]);


    // --- Phase 2: User Details Submission ---
    const handleDetailsSubmission = useCallback(async (details) => {
        setIsLoading(true);
        setOnboardingError(null);

        try {
            // 1. CRITICAL FIX: Save the details to the server first
            await saveUserDetails(details);
            
            // 2. Update context state with details
            setOnboardingData('details', details);

            // 3. Fetch domains (server uses the saved details)
            const domains = await getRecommendedDomains(); // No need to pass details again
            setOnboardingData('domains', domains);
            showToast('Details saved and domains fetched!', 'success');

            nextPhase(); // Move to Domain Selection
        } catch (err) {
            console.error("Details submission failed:", err);
            setOnboardingError(err.message || 'Failed to submit details or fetch domains.');
            showToast(err.message || 'Error submitting details.', 'error');
            // Fallback for demo/development if server fails (remove in production)
            setOnboardingData('domains', [{name: 'Web Development', score: 8}, {name: 'Data Science', score: 7}]);
            nextPhase();
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setOnboardingData, nextPhase]);

    // --- Phase 3: Domain Selection ---
    const handleDomainSelection = useCallback(async (selectedDomains) => {
        if (!selectedDomains || selectedDomains.length === 0) {
            setOnboardingError('Please select at least one domain.');
            showToast('Please select at least one domain.', 'warning');
            return;
        }
        
        // Save selected domains to context
        setOnboardingData('selectedDomains', selectedDomains);
        
        // FIX 4: Immediately trigger the fetching of the quiz 
        await fetchQuiz(); 
    }, [setOnboardingData, fetchQuiz]); // Dependency on fetchQuiz is essential

    // --- Phase 4: Skill Assessment Submission ---
    // NOTE: This function expects the payload from useSkillAssessment.prepareSubmissionPayload
    const handleAssessmentSubmission = useCallback(async (answersPayload) => {
        setIsLoading(true);
        setOnboardingError(null);
        try {
            // Save answers locally before submission
            setOnboardingData('quizAnswers', answersPayload);

            // FIX 5: Submit results using the correct service function
            const summary = await submitAssessmentAnswers(answersPayload);
            
            // Fetch the final summary (or assume service returns it)
            const finalSummary = await getOnboardingSummary(); 
            setOnboardingData('summary', finalSummary);
            showToast('Assessment complete! Generating summary.', 'success');

            nextPhase(); // Move to Onboarding Summary (Phase 5)
        } catch (err) {
            console.error("Assessment submission failed:", err);
            setOnboardingError(err.message || 'Failed to submit assessment.');
            showToast('Failed to submit assessment.', 'error');
            nextPhase(); // Move forward to avoid blocking the user, but show error
        } finally {
            setIsLoading(false);
        }
    }, [setOnboardingData, nextPhase, setOnboardingError, setIsLoading]);

    // --- Return Value ---
    return useMemo(() => ({
        onboardingState,
        setOnboardingData,
        nextPhase,
        prevPhase, // Added prevPhase for navigation control
        isLoading,
        onboardingError, // Now managed locally and exposed
        setOnboardingError, // Exposed setter
        handleDetailsSubmission,
        handleDomainSelection,
        handleAssessmentSubmission,
        // Expose a function to refresh the summary later if needed
        getOnboardingSummary, 
    }), [
        onboardingState, setOnboardingData, nextPhase, prevPhase, isLoading, onboardingError, 
        handleDetailsSubmission, handleDomainSelection, handleAssessmentSubmission
    ]);
};

export default useOnboarding;
