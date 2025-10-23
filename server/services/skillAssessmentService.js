// server/services/assessmentService.js (ES Module Format)

/**
 * @desc Calculates the score for a list of submitted assessment answers.
 * Assumes each item in the answers array is an object with a 'correct' boolean property.
 * @param {Array<object>} answers - The array of submitted answer results.
 * @returns {object} The calculated score object (total, correct, percentage).
 */
export const score = async (answers = []) => {
    // 1. Input Validation and Coercion
    if (!Array.isArray(answers) || answers.length === 0) {
        return { total: 0, correct: 0, percentage: 0 };
    }

    // 2. Naive Scoring Logic
    const total = answers.length;
    
    // Ensure 'correct' property is a reliable boolean before counting
    const correct = answers.filter(a => a && a.correct === true).length;
    
    // 3. Calculation and Formatting
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    // In a real application, you would also use the SkillAssessment model here 
    // to finalize and persist the record after scoring.

    return { 
        total, 
        correct, 
        percentage 
    };
};