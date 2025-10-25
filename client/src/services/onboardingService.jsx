import apiClient from './apiClient';
import { showToast } from '../utils/toastNotifications';

const ONBOARDING_BASE_URL = 'onboarding';

/**
 * @desc Saves the initial user details (skills, interests, education) to the server cache.
 */
export const saveUserDetails = async (details) => {
    try {
        const response = await apiClient.post(`${ONBOARDING_BASE_URL}/save`, details);
        if (!response.success) throw new Error(response.message || 'Failed to save details.');
        return response.data;
    } catch (error) {
        showToast('Failed to save details.', 'error');
        throw error;
    }
};

/**
 * @desc Triggers the AI model to recommend domains based on the user's saved profile.
 */
export const getRecommendedDomains = async () => {
    try {
        const response = await apiClient.get(`${ONBOARDING_BASE_URL}/domains`);
        if (!response.success || !response.data?.domains) {
            throw new Error(response.message || 'AI failed to generate domains.');
        }
        return response.data.domains;
    } catch (error) {
        showToast('Failed to fetch domains.', 'error');
        throw error;
    }
};

/**
 * @desc Triggers the AI model to generate a quiz based on the selected domains.
 */
export const generateSkillQuiz = async () => {
    try {
        const response = await apiClient.get(`${ONBOARDING_BASE_URL}/quiz`);
        if (!response.success || !response.data?.quiz) {
            throw new Error(response.message || 'AI failed to generate the quiz.');
        }
        return response.data.quiz;
    } catch (error) {
        showToast('Failed to generate quiz.', 'error');
        throw error;
    }
};

/**
 * @desc Submits the user's assessment answers for scoring and persistence.
 */
export const submitAssessmentAnswers = async (answers) => {
    try {
        const response = await apiClient.post(`${ONBOARDING_BASE_URL}/assessment`, { answers });
        if (!response.success) throw new Error(response.message || 'Failed to submit assessment.');
        
        showToast('Assessment submitted!', 'success');
        return response.data;
    } catch (error) {
        showToast('Failed to submit assessment.', 'error');
        throw error;
    }
};

/**
 * @desc Retrieves the final AI-generated summary (radar chart data, tasks, courses).
 */
export const getOnboardingSummary = async () => {
    try {
        const response = await apiClient.get(`${ONBOARDING_BASE_URL}/summary`);
        if (!response.success || !response.data?.summary) {
            throw new Error(response.message || 'Failed to generate final summary.');
        }
        return response.data.summary;
    } catch (error) {
        showToast('Failed to retrieve summary.', 'error');
        throw error;
    }
};