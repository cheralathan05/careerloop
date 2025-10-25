import React, { useState, useCallback } from 'react'; // Added useState and useCallback
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
import { useSkillAssessment } from '../../hooks/useSkillAssessment'; // Fixed in step 18
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { SkillAssessmentCard } from '../../components/onboarding/SkillAssessmentCard';
import { AILoader } from '../../components/loaders/AILoader';
import { CheckCircle } from 'lucide-react';
import { AlertBox } from '../../components/ui/AlertBox';
import { showToast } from '../../utils/toastNotifications'; // Import fixed utility

/**
 * @desc Phase 4: Displays the AI-generated quiz and collects user answers.
 */
const SkillAssessmentPage = () => {
    // State from Onboarding Context/Hook (API/Flow Management)
    const { 
        onboardingState: { quiz }, 
        handleAssessmentSubmission, 
        isLoading,
        onboardingError
    } = useOnboarding();

    // State and logic from Skill Assessment Hook (Local Quiz Management)
    const { 
        allQuestions, 
        totalQuestions, 
        answeredCount, 
        isComplete, 
        userAnswers, 
        handleAnswer, 
        prepareSubmissionPayload 
    } = useSkillAssessment(quiz); // Passes the quiz data from context

    // Local state for non-API errors (e.g., incomplete form)
    const [localValidationError, setLocalValidationError] = useState(null);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setLocalValidationError(null); // Clear previous validation error

        // --- Client-Side Validation ---
        if (!isComplete) {
            const message = `Please answer all ${totalQuestions} questions before submitting.`;
            setLocalValidationError(message);
            // ENHANCEMENT: Use fixed showToast instead of browser alert
            showToast(message, 'warning'); 
            return;
        }
        
        // --- Submit to Hook (which calls the service) ---
        handleAssessmentSubmission(prepareSubmissionPayload());
    }, [isComplete, totalQuestions, handleAssessmentSubmission, prepareSubmissionPayload]);


    // --- Loading and Error States ---

    if (isLoading) return (
        <OnboardingLayout title="Submitting Assessment" className="max-w-xl">
            <AILoader text="Scoring assessment and generating summary..." />
        </OnboardingLayout>
    );

    // Initial state check: Quiz data might be empty if generation failed or is still loading
    if (totalQuestions === 0) return (
        <OnboardingLayout title="Assessment">
            {/* Display error from hook or a default message */}
            <AlertBox type="error" message={onboardingError || "Quiz failed to load. Please restart from domain selection."} />
        </OnboardingLayout>
    );

    // --- Main Render ---

    return (
        <OnboardingLayout title="Skill Assessment" className="max-w-3xl">
            {/* Display error from hook (API error) or local validation */}
            {(onboardingError || localValidationError) && (
                <AlertBox 
                    type="error" 
                    message={onboardingError || localValidationError} 
                    className="mb-4"
                />
            )}
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Answer these **{totalQuestions}** questions across your domains to gauge your current proficiency.
            </p>
            
            <ProgressBar 
                current={answeredCount} 
                total={totalQuestions} 
                label={`Answered: ${answeredCount}/${totalQuestions}`} 
            />
            
            {/* Form and Question Cards */}
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                {/* The question display area needs controlled scrolling */}
                <div className="max-h-[60vh] overflow-y-auto pr-2"> 
                    {/* The quiz array contains groups of questions (based on domains) */}
                    {quiz.map((group, index) => (
                        <SkillAssessmentCard
                            key={index}
                            group={group}
                            currentAnswers={userAnswers}
                            onAnswer={handleAnswer}
                            groupIndex={index}
                        />
                    ))}
                </div>
                
                {/* Submission Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                        type="submit" 
                        disabled={!isComplete || isLoading} 
                        icon={CheckCircle} 
                        className="w-full"
                        variant={isComplete ? "primary" : "secondary"}
                    >
                        {isComplete ? 'Submit Assessment and View Summary' : `Answer ${totalQuestions - answeredCount} more questions`}
                    </Button>
                </div>
            </form>
        </OnboardingLayout>
    );
};

export default SkillAssessmentPage;
