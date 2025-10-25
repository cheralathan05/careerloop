/**
 * @desc Client-side utility for categorizing skills into high-level groups.
 * This map is used for charting (e.g., radar chart grouping) and UI logic.
 */

const skillCategoryMap = {
    'JavaScript': 'Frontend',
    'React': 'Frontend',
    'Vue': 'Frontend',
    'HTML': 'Frontend',
    'CSS': 'Frontend',
    'Node.js': 'Backend',
    'Python': 'Backend',
    'Django': 'Backend',
    'MongoDB': 'Database',
    'SQL': 'Database',
    'AWS': 'Cloud',
    'Docker': 'Cloud',
    'Figma': 'Design',
    'UX': 'Design',
    // Adding general categories for completeness
    'Java': 'Backend',
    'C++': 'Backend',
    'Angular': 'Frontend',
    'TypeScript': 'General',
    'Project Management': 'Soft Skills',
    'Communication': 'Soft Skills',
};

/**
 * Gets the primary category for a given skill.
 * @param {string} skill - The skill name (e.g., 'React', 'MongoDB').
 * @returns {string} The associated category or 'General'.
 */
export const getSkillCategory = (skill) => {
    // Perform a case-insensitive lookup for robustness
    const normalizedSkill = skill.trim();
    return skillCategoryMap[normalizedSkill] || 'General';
};
