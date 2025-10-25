import apiClient from './apiClient';
// Removed: import { showToast } from '../utils/toastNotifications'; // Toast is handled by apiClient

const ONBOARDING_BASE_URL = 'onboarding'; // Appends to VITE_API_BASE_URL (e.g., /api/onboarding)

/**
 * @typedef {object} UserDetails - Data model for initial user profile.
 */
/**
 * @typedef {Array<string>} DomainList - Array of recommended career domains.
 */
/**
 * @typedef {object} Quiz - Data model for the skill assessment quiz questions.
 */
/**
 * @typedef {object} Summary - Data model for the final AI-generated summary.
 */


/**
 * @desc Saves the initial user details (skills, interests, education) to the server cache/profile.
 * @param {UserDetails} details
 * @returns {Promise<object>} Server confirmation data.
 */
export const saveUserDetails = async (details) => {
    try {
        // POST /api/onboarding/save
        const response = await apiClient.post(`${ONBOARDING_BASE_URL}/save`, details);

        // ENHANCEMENT: Removed redundant success check, apiClient handles status codes.
        // We assume a successful response means the details were saved.
        return response.data || response;
    } catch (error) {
        // FIX: Removed showToast. apiClient interceptor handles API errors globally.
        throw error;
    }
};

/**
 * @desc Triggers the AI model to recommend domains based on the user's saved profile.
 * @returns {Promise<DomainList>} List of recommended career domains.
 */
export const getRecommendedDomains = async () => {
    try {
        // GET /api/onboarding/domains
        const response = await apiClient.get(`${ONBOARDING_BASE_URL}/domains`);
        
        // ENHANCEMENT: Safely extract domains, checking for nesting under 'data' or being the root.
        const domains = response.data?.domains || response.domains || response.data || response;

        if (!Array.isArray(domains) || domains.length === 0) {
            throw new Error('AI failed to generate recommended domains.');
        }

        return domains;
    } catch (error) {
        // FIX: Removed showToast. apiClient interceptor handles API errors globally.
        throw error;
    }
};

/**
 * @desc Triggers the AI model to generate a quiz based on the selected domains.
 * @returns {Promise<Quiz>} The generated quiz object.
 */
export const generateSkillQuiz = async () => {
    try {
        // GET /api/onboarding/quiz
        const response = await apiClient.get(`${ONBOARDING_BASE_URL}/quiz`);
        
        // ENHANCEMENT: Safely extract quiz, checking for nesting under 'data' or being the root.
        const quiz = response.data?.quiz || response.quiz || response.data || response;

        if (!quiz || Object.keys(quiz).length === 0) {
            throw new Error('AI failed to generate the quiz.');
        }

        return quiz;
    } catch (error) {
        // FIX: Removed showToast. apiClient interceptor handles API errors globally.
        throw error;
    }
};

/**
 * @desc Submits the user's assessment answers for scoring and persistence.
 * @param {object} answers - The user's quiz answers.
 * @returns {Promise<object>} Scoring result data.
 */
export const submitAssessmentAnswers = async (answers) => {
    try {
        // POST /api/onboarding/assessment
        const response = await apiClient.post(`${ONBOARDING_BASE_URL}/assessment`, { answers });
        
        // FIX: The success toast is moved outside the service for component/hook control, 
        // as the service should only handle data transport.
        
        return response.data || response;
    } catch (error) {
        // FIX: Removed showToast. apiClient interceptor handles API errors globally.
        throw error;
    }
};

/**
 * @desc Retrieves the final AI-generated summary (radar chart data, tasks, courses).
 * @returns {Promise<Summary>} The final onboarding summary object.
 */
export const getOnboardingSummary = async () => {
    try {
        // GET /api/onboarding/summary
        const response = await apiClient.get(`${ONBOARDING_BASE_URL}/summary`);
        
        // ENHANCEMENT: Safely extract summary.
        const summary = response.data?.summary || response.summary || response.data || response;

        if (!summary || Object.keys(summary).length === 0) {
            throw new Error('Failed to retrieve final summary.');
        }

        return summary;
    } catch (error) {
        // FIX: Removed showToast. apiClient interceptor handles API errors globally.
        throw error;
    }
};

export default { 
    saveUserDetails, 
    getRecommendedDomains, 
    generateSkillQuiz, 
    submitAssessmentAnswers, 
    getOnboardingSummary 
};
