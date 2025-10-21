// src/utils/skillMapper.js

// Utility to map raw skills (from resume or form) to standardized CareerLoop skills.
export const mapRawSkillsToStandard = (rawSkills, role) => {
    const standardizedMap = {
        'js': 'JavaScript',
        'py': 'Python',
        'aws': 'AWS Cloud',
        'scrum': 'Agile Methodologies'
    };
    
    // Simulate AI logic to prioritize based on role
    let mappedSkills = rawSkills.map(skill => standardizedMap[skill.toLowerCase()] || skill);

    if (role.toLowerCase().includes('data')) {
        mappedSkills = [...mappedSkills, 'SQL', 'Machine Learning'];
    }

    // Return unique skills
    return [...new Set(mappedSkills)];
};