import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * @typedef {object} AssessmentQuestion
 * @property {string} id
 * @property {string} text
 * @property {Array<string>} options
 * @property {string} correctAnswer
 */

/**
 * @desc Hook to manage user answers and calculate completion status for a quiz.
 * @param {Array<object>} quizData - The raw quiz data from the Onboarding context.
 */
export const useSkillAssessment = (quizData) => {
    // State to hold the user's current answers { questionId: 'answer_value' }
    const [userAnswers, setUserAnswers] = useState({});

    // Effect to reset answers if quiz data changes (e.g., user selects new domains)
    useEffect(() => {
        setUserAnswers({});
    }, [quizData]);
    
    // Flatten quiz structure for easier calculation
    const allQuestions = useMemo(() => 
        quizData.flatMap(group => 
            group.questions.map(q => ({ ...q, domain: group.domain.name }))
        ), [quizData]
    );

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
        return allQuestions.map(q => ({
            questionId: q.id,
            answer: userAnswers[q.id] || null,
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
        // The submission to the backend is handled by the useOnboarding hook
    }), [allQuestions, totalQuestions, answeredCount, isComplete, userAnswers, handleAnswer, prepareSubmissionPayload]);
};