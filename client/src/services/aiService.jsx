import apiClient from './apiClient';
// Assuming this utility exists and is correctly structured
import { showToast } from '../utils/toastNotifications'; 

const AI_BASE_URL = 'ai'; // Appends to VITE_API_BASE_URL (e.g., /api/ai)

/**
 * @typedef {object} ChatResponse
 * @property {string} reply - The AI's text response.
 */

/**
 * @desc Sends a user prompt to the AI assistant for a response.
 * @param {string} prompt - The user's text message.
 * @returns {Promise<ChatResponse>} The AI's structured reply.
 */
export const sendChatMessage = async (prompt) => {
    try {
        // POST /api/ai/chat
        // apiClient will automatically wrap the result of response.data
        const result = await apiClient.post(`${AI_BASE_URL}/chat`, { prompt });

        // ENHANCEMENT: Based on typical API wrapper structure, 
        // we expect the reply to be nested inside a data object or directly in the result.
        // We'll safely check for the 'reply' key in the result (which is the server's response data).
        const replyText = result?.data?.reply || result?.reply;

        if (!replyText) {
            // Throw a local error if the expected data shape is not met
            throw new Error('AI assistant generated an empty or malformed reply.');
        }

        // Return the standardized structure
        return { reply: replyText };

    } catch (error) {
        // apiClient interceptor already handles showing the error toast.
        // We re-throw the error so the calling hook/component can handle loading state or logging.
        throw error;
    }
};

/**
 * @desc Fetches generalized career recommendations from the AI.
 * @returns {Promise<Array<object>>} List of tasks/mentors data.
 */
export const getGeneralRecommendations = async () => {
    try {
        // GET /api/ai/recommendations
        const result = await apiClient.get(`${AI_BASE_URL}/recommendations`);
        
        // Ensure result is an array or valid data structure before returning
        if (!Array.isArray(result.data) && !Array.isArray(result)) {
             console.warn("Recommendations API returned non-array data:", result);
        }
        
        // Return the data object (assuming the actual list is nested in result.data or is the result itself)
        return result.data || result; 
    } catch (error) {
        // FIX: Removed redundant showToast, as apiClient interceptor handles it globally.
        throw error;
    }
};

// Export all functions
export default { sendChatMessage, getGeneralRecommendations };
