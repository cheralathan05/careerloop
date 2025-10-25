import apiClient from './apiClient';
// Removed: import { showToast } from '../utils/toastNotifications'; // Not used

const MENTOR_BASE_URL = 'mentors'; // Appends to VITE_API_BASE_URL (e.g., /api/mentors)

/**
 * @typedef {object} Mentor
 * @property {string} name - Mentor's name.
 * @property {string} domain - Mentor's domain of expertise.
 * @property {number} rating - Average rating.
 */

/**
 * @desc Fetches a list of recommended mentors based on a user's skills.
 * @param {Array<string>} userSkills - Skills to match mentors against.
 * @returns {Promise<Array<Mentor>>} List of prioritized mentors.
 */
export const recommendMentors = async (userSkills) => {
    try {
        // MANDATORY FIX: Encode the query string to handle spaces and special characters safely.
        const query = userSkills.join(' ');
        const encodedQuery = encodeURIComponent(query);

        // GET /api/mentors?q=encoded_skills
        const response = await apiClient.get(`${MENTOR_BASE_URL}?q=${encodedQuery}`);
        
        // ENHANCEMENT: Safely extract mentor data, assuming it could be an array, 
        // nested under 'data' or 'mentors' property from the server response.
        const mentors = response.data?.mentors || response.mentors || response.data || response;
        
        if (!Array.isArray(mentors)) {
             console.warn("Mentor service returned non-array data:", mentors);
             // Throw an error if the fundamental shape is wrong
             throw new Error('Mentor service returned unexpected data format.');
        }

        return mentors;
    } catch (error) {
        // apiClient handles the error toast globally
        console.error('Mentor Fetch Error:', error);
        throw error; // Re-throw the error for component/hook to catch
    }
};

export default { recommendMentors };
