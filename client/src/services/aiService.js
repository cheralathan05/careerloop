import apiClient from './apiClient';
import { showToast } from '../utils/toastNotifications';

const AI_BASE_URL = 'ai';

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
        const response = await apiClient.post(`${AI_BASE_URL}/chat`, { prompt });
        if (!response.success || !response.data?.reply) {
            throw new Error(response.message || 'AI assistant failed to generate a reply.');
        }
        return { reply: response.data.reply };
    } catch (error) {
        // apiClient interceptor already shows the error toast
        throw error;
    }
};

/**
 * @desc Fetches generalized career recommendations from the AI.
 * (Used as a general utility, but the main onboarding call is in onboardingService.js)
 * @returns {Promise<Array<object>>} List of tasks/mentors.
 */
export const getGeneralRecommendations = async () => {
    try {
        // GET /api/ai/recommendations
        const response = await apiClient.get(`${AI_BASE_URL}/recommendations`);
        return response.data;
    } catch (error) {
        showToast('Could not fetch general recommendations.', 'error');
        throw error;
    }
};