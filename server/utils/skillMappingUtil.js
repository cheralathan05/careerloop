// server/utils/skillMappingUtil.js (FINAL ES MODULE VERSION)

/**
 * @desc Statically maps a user's skills to predefined career domains and assigns a score 
 * based on the number of matching skills.
 * @param {Array<string>} userSkills - List of skills provided by the user.
 * @returns {object} A map of domain names to their raw match score (count of matched skills).
 */
export const mapSkillsToDomains = (userSkills = []) => {
    
    // Define domain-specific skill buckets (all lowercase for easy matching)
    const domainBuckets = {
        'Web Development': ['react', 'node', 'html', 'css', 'javascript', 'typescript', 'mongodb', 'express'],
        'Data Science': ['python', 'pandas', 'numpy', 'ml', 'statistics', 'r', 'tableau', 'sql'],
        'UI/UX': ['figma', 'ux', 'ui', 'prototyping', 'design', 'adobe xd', 'sketch'],
        'Cloud Engineering': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'],
    };
    
    const scores = {};
    
    // Normalize user input skills for case-insensitive matching
    const normalizedUserSkills = userSkills.map(s => String(s).toLowerCase().trim());

    for (const [domain, domainSkills] of Object.entries(domainBuckets)) {
        
        // Count how many of the user's skills are in the domain's skill bucket
        const matchCount = normalizedUserSkills.filter(userSkill => 
            domainSkills.includes(userSkill)
        ).length;

        // Assign the raw count as the score
        scores[domain] = matchCount;
    }
    
    // Optional: Filter out domains with a score of zero and sort by score
    return Object.fromEntries(
        Object.entries(scores)
            .filter(([, score]) => score > 0)
            .sort(([, a], [, b]) => b - a) // Sort descending by score
    );
};