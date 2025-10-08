// src/utils/authHelpers.js

/**
 * Placeholder for client-side persistence or token manipulation.
 * Currently just shows simple local storage usage.
 */

export const storeAuthToken = (token) => {
    // In a real app, you might store more than just a display name.
    // Firebase handles the main token, but this is for extra data.
    localStorage.setItem('careerLoop_token_placeholder', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('careerLoop_token_placeholder');
};