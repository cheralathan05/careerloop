/**
 * @desc Utility to transform raw skill scores into a Radar Chart-compatible data format.
 */

/**
 * Transforms a skill score object into an array of objects for Recharts RadarChart.
 * @param {object} scoreMap - Key-value pair of skill/domain name to score (e.g., { 'React': 8, 'Node': 6 }).
 * @param {number} [maxScore=10] - The maximum possible raw score value.
 * @returns {Array<object>} Formatted array: [{ subject: 'React', A: 80, fullMark: 100 }, ...]
 */
export const transformScoresForRadar = (scoreMap = {}, maxScore = 10) => {
    // Standardize the radial axis max to 100 for percentage-based visualization
    const fullMark = 100; 

    // Ensure scoreMap is treated as an array of entries
    return Object.entries(scoreMap).map(([key, rawScore]) => {
        // Ensure rawScore is a number, defaulting to 0 if invalid
        const score = typeof rawScore === 'number' && !isNaN(rawScore) ? rawScore : 0;
        
        // Scale the score to the fullMark (100)
        // Example: (8 / 10) * 100 = 80
        const scaledScore = Math.round((score / maxScore) * fullMark);

        return {
            subject: key,
            A: scaledScore, // The value series for the user's data
            fullMark: fullMark,
        };
    });
};
