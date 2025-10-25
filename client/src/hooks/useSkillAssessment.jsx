import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * @typedef {object} AssessmentQuestion
 * @property {string} id
 * @property {string} text
 * @property {Array<string>} options
 * @property {string} correctAnswer
 * @property {string} domain - The domain this question belongs to.
 */

/**
 * @desc Hook to manage user answers and calculate completion status for a quiz.
 * @param {Array<object>} quizData - The raw quiz data from the Onboarding context.
 * Expected structure: Array<{ domain: { name: string }, questions: Array<AssessmentQuestion> }>
 */
export const useSkillAssessment = (quizData) => {
    // State to hold the user's current answers { questionId: 'answer_value' }
    const [userAnswers, setUserAnswers] = useState({});

    // Effect to reset answers if quiz data changes (e.g., user selects new domains)
    useEffect(() => {
        // Reset only if the quiz data structure changes meaningfully
        setUserAnswers({});
    }, [quizData]);
    
    // Flatten quiz structure for easier calculation and access
    const allQuestions = useMemo(() => {
        // FIX: Add a null/undefined check for quizData to prevent runtime errors on initial render
        if (!quizData || !Array.isArray(quizData)) {
            return [];
        }

        return quizData.flatMap(group => 
            // Ensure group.questions is an array before mapping
            (group.questions || []).map(q => ({ 
                ...q, 
                // ENHANCEMENT: Store the domain name with the question for context
                domain: group.domain?.name || 'General' 
            }))
        );
    }, [quizData]);

    // Derived State (for UI display and submission control)
    const totalQuestions = allQuestions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const isComplete = answeredCount === totalQuestions && totalQuestions > 0;

    const handleAnswer = useCallback((questionId, answer) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    }, []);

    /**
     * @desc Prepares the final answer payload for submission to the server.
     * @returns {Array<object>} Payload: { questionId, answer }
     */
    const prepareSubmissionPayload = useCallback(() => {
        // Only include answers for existing questions to keep the payload clean
        return allQuestions.map(q => ({
            questionId: q.id,
            answer: userAnswers[q.id] || null, // Null if the user skipped the question
        }));
    }, [allQuestions, userAnswers]);


    return useMemo(() => ({
        allQuestions,
        totalQuestions,
        answeredCount,
        isComplete,
        userAnswers,
        handleAnswer,
        prepareSubmissionPayload,
        // The submission to the backend is handled by the useOnboarding hook (next step)
    }), [allQuestions, totalQuestions, answeredCount, isComplete, userAnswers, handleAnswer, prepareSubmissionPayload]);
};

export default useSkillAssessment;
