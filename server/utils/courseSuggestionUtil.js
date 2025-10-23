// server/utils/courseSuggestionUtil.js (ES Module Format)

/**
 * @desc Provides static, hardcoded course suggestions based on domain.
 * This is the ultimate fallback when the database cache is empty.
 * In a production environment, this function would house the direct AI call 
 * to Gemini (if not in the service layer itself) to generate dynamic, real-time suggestions.
 * @param {string} domain - The career domain to search for.
 * @returns {Array<object>} List of static course objects.
 */
export const suggestCourses = (domain) => {
    
    // Normalize input for case-insensitive lookup
    const normalizedDomain = domain.toLowerCase().trim();

    const map = {
        'web development': [
            { title: 'React Fundamentals', provider: 'Coursera', url: '#react-c', domain: 'Web Development', level: 'Beginner' },
            { title: 'Node.js API Design', provider: 'Udemy', url: '#node-u', domain: 'Web Development', level: 'Intermediate' }
        ],
        'data science': [
            { title: 'Intro to Data Science', provider: 'edX', url: '#ds-e', domain: 'Data Science', level: 'Beginner' },
            { title: 'Machine Learning Basics', provider: 'Coursera', url: '#ml-c', domain: 'Data Science', level: 'Intermediate' }
        ],
        'ui/ux': [
            { title: 'Figma Design Mastery', provider: 'Skillshare', url: '#fig-s', domain: 'UI/UX', level: 'Beginner' }
        ],
        // Default suggestions for any other domain
    };
    
    return map[normalizedDomain] || [];
};