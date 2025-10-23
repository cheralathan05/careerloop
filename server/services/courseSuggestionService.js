// server/services/courseSuggestionService.js (ES Module Format)
import Course from '../models/Course.js'; // Use ES Module import
import { suggestCourses } from '../utils/courseSuggestionUtil.js'; // Use ES Module import

/**
 * @desc Retrieves course suggestions, prioritizing the persistent database cache.
 * @param {string} domain - The career domain to search for.
 * @returns {Promise<Array>} List of course objects.
 */
export const suggest = async (domain) => {
    if (!domain || typeof domain !== 'string') {
        console.warn("Attempted course suggestion with invalid domain.");
        return [];
    }
    
    // 1. Try Database Cache First
    // Using .select('-__v') to keep the response clean
    const courses = await Course.find({ domain })
        .limit(10)
        .select('-__v')
        .lean(); 

    if (courses.length > 0) {
        console.log(`[CourseService] Cache hit: Found ${courses.length} courses for ${domain}.`);
        return courses;
    }
    
    // 2. Fallback to Static/Utility Suggestions
    console.log(`[CourseService] Cache miss: Falling back to utility suggestions for ${domain}.`);
    
    // The utility function (suggestCourses) is where you could integrate the 
    // AI API call if you wanted dynamic, real-time suggestions instead of static stubs.
    const staticSuggestions = suggestCourses(domain);
    
    // Optional: Save the static suggestions to the database for future cache hits
    if (staticSuggestions.length > 0) {
        try {
            // Using insertMany for bulk insert (fire-and-forget, no await needed)
            await Course.insertMany(staticSuggestions);
        } catch (error) {
            // Ignore insert errors (e.g., duplicate key if you had a unique index)
            console.error("Failed to cache static suggestions:", error.message);
        }
    }
    
    return staticSuggestions;
};