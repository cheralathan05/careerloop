// src/utils/radarChartUtils.js

// Utility to process assessment data into a format suitable for the RadarChart component.
export const processSkillData = (rawScores) => {
    // rawScores: { javascript: 75, python: 60, leadership: 85 }
    const labels = Object.keys(rawScores);
    const scores = Object.values(rawScores);
    
    // Calculate gaps (e.g., scores below 70)
    const gaps = labels.filter((_, i) => scores[i] < 70);

    return {
        labels,
        scores,
        gaps
    };
};