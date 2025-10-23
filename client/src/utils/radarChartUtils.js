/**
 * @desc Utility to transform raw skill scores into a Radar Chart-compatible data format.
 */

/**
 * Transforms a skill score object into an array of objects for Recharts RadarChart.
 * @param {object} scoreMap - Key-value pair of skill/domain name to score (e.g., { 'React': 8, 'Node': 6 }).
 * @param {number} maxScore - The maximum value for the chart's radial axis (fullMark).
 * @returns {Array<object>} Formatted array: [{ subject: 'React', A: 80, fullMark: 100 }, ...]
 */
export const transformScoresForRadar = (scoreMap = {}, maxScore = 10) => {
    const fullMark = 100; // Standardize radial axis max to 100

    return Object.entries(scoreMap).map(([key, rawScore]) => ({
        subject: key,
        // Scale the raw score (e.g., 0-10) to the chart's fullMark (100)
        A: Math.round((rawScore / maxScore) * fullMark),
        fullMark: fullMark,
    }));
};