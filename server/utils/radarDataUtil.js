// server/utils/radarDataUtil.js (ES Module Format)

/**
 * @desc Converts a simple key-value score map into the structured array format
 * typically required by radar charts/data visualization libraries.
 * Example: { 'React': 85, 'Node': 60 } => [ { label: 'React', value: 85 }, { label: 'Node', value: 60 } ]
 * @param {object} scoreMap - An object where keys are labels (e.g., skill names) and values are scores.
 * @returns {Array<object>} An array of objects, each with 'label' and 'value' properties.
 */
export const toRadar = (scoreMap = {}) => {
    // 1. Input Validation: Ensure the input is an object
    if (typeof scoreMap !== 'object' || scoreMap === null) {
        return [];
    }

    // 2. Transformation
    return Object.entries(scoreMap).map(([key, value]) => ({ 
        label: key, 
        // Ensure the value is a number, defaulting to 0 if NaN
        value: Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value) 
    }));
};