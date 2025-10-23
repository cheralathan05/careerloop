// server/services/aiService.js (FINAL, CLEANED VERSION ✅)

// Import configurations and utilities needed for caching/structure
import aiConfig from '../config/aiConfig.js'; 
import * as redisClient from '../utils/redisClient.js'; // Used for caching logic

/**
 * Minimal AI stubs. This version uses local utility functions and avoids external API calls.
 */
export const recommendDomains = async (skills = [], interests = []) => {
    // Use dynamic import for local CommonJS/utility modules
    const { mapSkillsToDomains } = await import('../utils/skillMappingUtil.js'); 
    
    const scores = mapSkillsToDomains(skills);
    return Object.entries(scores).map(([name, score]) => ({ name, score }));
};

export const generateQuiz = async (userId, domains = []) => {
    // Note: The controller now passes userId and domains.
    if (!userId || domains.length === 0) return [];

    // Check Redis cache first (assuming getCached is on the redisClient namespace)
    const cached = await redisClient.getCached(`quiz:${userId}`);
    if (cached) return JSON.parse(cached);

    // This is the permanent local stub logic:
    const quiz = domains.map(domain => ({
        domain,
        questions: [
            // Return sample, consistent questions
            { id: `${domain}-q1`, text: `What is a core skill in ${domain}?`, options: ['A', 'B', 'C'] },
            { id: `${domain}-q2`, text: `Another sample question in ${domain}?`, options: ['X', 'Y', 'Z'] }
        ]
    }));

    // Cache quiz in Redis for 1 hour
    await redisClient.setCache(`quiz:${userId}`, quiz, 3600);

    return quiz;
};

export const summarizeOnboarding = async (onboarding) => {
    // Use dynamic import for local CommonJS/utility modules
    const { toRadar } = await import('../utils/radarDataUtil.js'); 

    return {
        radar: toRadar(onboarding.skillScores || {}),
        recommendedTasks: ['Complete React tutorial', 'Build one mini project'],
        suggestedCourses: ['React Fundamentals']
    };
};
// All functions are exported via 'export const'
