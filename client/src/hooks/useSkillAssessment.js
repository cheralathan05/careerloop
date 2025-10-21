// src/hooks/useSkillAssessment.js

import { useState, useMemo } from 'react';

export default function useSkillAssessment(domains = []) {
    const totalQuestions = 10;
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    // Dynamic questions based on selected domains
    const questions = useMemo(() => 
        Array.from({ length: totalQuestions }, (_, i) => ({ 
            id: i, 
            text: `Question ${i + 1} for ${domains[0] || 'General Skills'}`,
            answer: `Answer ${i}` // Mock correct answer
        })
    ), [domains]);

    const handleAnswer = (answer) => {
        // Mock scoring logic (optional)
        console.log(`Answered Q${questionIndex + 1} with: ${answer}`);
        
        if (questionIndex < totalQuestions - 1) {
            setQuestionIndex(questionIndex + 1);
        } else {
            setIsQuizFinished(true);
        }
    };

    return {
        currentQuestion: questions[questionIndex],
        progress: { current: questionIndex + 1, total: totalQuestions },
        isQuizFinished,
        handleAnswer,
        results: { 
            // Mock final results for Phase 9
            scores: [70, 80, 50, 90], 
            totalScore: 72.5 
        }
    };
}