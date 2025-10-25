import apiClient from './apiClient';
import { showToast } from '../utils/toastNotifications';

const MENTOR_BASE_URL = 'mentors';

/**
 * @typedef {object} Mentor
 * @property {string} name
 * @property {string} domain
 * @property {number} rating
 */

/**
 * @desc Fetches a list of recommended mentors based on a user's skills.
 * @param {Array<string>} userSkills - Skills to match mentors against.
 * @returns {Promise<Array<Mentor>>} List of prioritized mentors.
 */
export const recommendMentors = async (userSkills) => {
    // NOTE: Your backend service is ready to take user skills/context for prioritization.
    // For simplicity, we just query based on a static query for now.
    
    try {
        // GET /api/mentors?q=
        const response = await apiClient.get(`${MENTOR_BASE_URL}?q=${userSkills.join(' ')}`);
        
        if (!response.success || !response.data?.mentors) {
            throw new Error('Mentor service returned unexpected data.');
        }

        return response.data.mentors;
    } catch (error) {
        // apiClient handles the error toast
        console.error('Mentor Fetch Error:', error);
        throw error;
    }
};