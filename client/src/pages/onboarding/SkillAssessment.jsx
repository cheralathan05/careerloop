import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useSkillAssessment } from '../../hooks/useSkillAssessment';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { SkillAssessmentCard } from '../../components/onboarding/SkillAssessmentCard';
import { AILoader } from '../../components/loaders/AILoader';
import { CheckCircle } from 'lucide-react';
import { AlertBox } from '../../components/ui/AlertBox';

/**
 * @desc Phase 4: Displays the AI-generated quiz and collects user answers.
 */
const SkillAssessmentPage = () => {
    const { 
        onboardingState: { quiz }, 
        handleAssessmentSubmission, 
        isLoading,
        onboardingError
    } = useOnboarding();

    const { 
        allQuestions, 
        totalQuestions, 
        answeredCount, 
        isComplete, 
        userAnswers, 
        handleAnswer, 
        prepareSubmissionPayload 
    } = useSkillAssessment(quiz);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isComplete) {
            alert(`Please answer all ${totalQuestions} questions before submitting.`);
            return;
        }
        handleAssessmentSubmission(prepareSubmissionPayload());
    };

    if (isLoading) return (
        <OnboardingLayout title="Generating Quiz" className="max-w-xl">
            <AILoader text="Compiling final assessment..." />
        </OnboardingLayout>
    );

    if (totalQuestions === 0) return (
        <OnboardingLayout title="Assessment">
            <AlertBox type="error" message="Quiz failed to load. Please restart from domain selection." />
        </OnboardingLayout>
    );

    return (
        <OnboardingLayout title="Skill Assessment" className="max-w-3xl">
            {onboardingError && <AlertBox type="error" message={onboardingError} className="mb-4"/>}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Answer these **{totalQuestions}** questions across your domains to gauge your current proficiency.
            </p>
            
            <ProgressBar current={answeredCount} total={totalQuestions} label="Questions Answered" />
            
            <form onSubmit={handleSubmit} className="space-y-8 mt-6 max-h-[60vh] overflow-y-auto pr-2">
                {quiz.map((group, index) => (
                    <SkillAssessmentCard
                        key={index}
                        group={group}
                        currentAnswers={userAnswers}
                        onAnswer={handleAnswer}
                        groupIndex={index}
                    />
                ))}
                
                <Button type="submit" disabled={!isComplete || isLoading} icon={CheckCircle} className="w-full sticky bottom-0 z-10 py-3">
                    Submit Assessment
                </Button>
            </form>
        </OnboardingLayout>
    );
};

export default SkillAssessmentPage;
