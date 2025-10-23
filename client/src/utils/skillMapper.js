/**
 * @desc Client-side utility for categorizing skills into high-level groups.
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
};

/**
 * Gets the primary category for a given skill.
 */
export const getSkillCategory = (skill) => {
    return skillCategoryMap[skill] || 'General';
};