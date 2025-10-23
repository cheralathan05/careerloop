// server/services/aiService.js (FINAL EXTERNAL AI INTEGRATION)

// WARNING: This file will cause a 403 error unless Google Cloud billing is active.

// Import necessary modules
import aiConfig from '../config/aiConfig.js'; 
import * as redisClient from '../utils/redisClient.js'; // Access as redisClient.getCached
import axios from 'axios'; // For external API calls

// =========================================================================
// 1. RECOMMEND DOMAINS (Local Stub)
// =========================================================================
export const recommendDomains = async (skills = [], interests = []) => {
    // Use dynamic import for local CommonJS/utility modules
    const { mapSkillsToDomains } = await import('../utils/skillMappingUtil.js'); 
    
    // In the final version, this would be an AI call:
    /*
    const prompt = `Based on skills: ${skills} and interests: ${interests}, recommend 5 career domains...`;
    const aiResponse = await axios.post(aiApiUrl, { ... });
    */
    
    const scores = mapSkillsToDomains(skills);
    // Return a structured list of recommended domains with an associated score/weight
    return Object.entries(scores).map(([name, score]) => ({ name, score }));
};

// =========================================================================
// 2. GENERATE QUIZ (External AI Integration with Fallback)
// =========================================================================
export const generateQuiz = async (userId, domains = []) => {
    if (!userId || domains.length === 0) return [];

    // Check Redis cache first 
    const cached = await redisClient.getCached(`quiz:${userId}`);
    if (cached) {
        console.log(`[QUIZ CACHE HIT] for user ${userId}`);
        return JSON.parse(cached);
    }

    let quiz = [];
    const totalDomains = domains.length;
    const totalQuestions = 50; // Total desired questions
    const questionsPerDomain = Math.ceil(totalQuestions / totalDomains); 
    
    // Use the official Google API URL from config
    const aiApiUrl = aiConfig.apiUrl; 

    // --- Temporary Placeholder for User Data ---
    // NOTE: In the controller, you should fetch the user's skills/interests from the 
    // persistent Onboarding model or Redis cache before calling this service.
    const skills = ["React", "Node.js"]; 
    const interests = ["Frontend"]; 
    // --- End Placeholder ---

    try {
        console.log(`[AI CALL] Generating ${totalQuestions} questions for ${totalDomains} domains...`);
        for (const domainObj of domains) {
            const domainName = domainObj.name;
            
            const prompt = `Generate ${questionsPerDomain} complex, multiple-choice questions for the ${domainName} domain. The user has skills in ${skills.join(', ')} and interests in ${interests.join(', ')}. Focus the questions on intermediate/advanced topics relevant to these skills. Return the questions in a clean JSON array structure.`;
            
            // HITTING EXTERNAL API
            const response = await axios.post(
                `${aiApiUrl}:generateContent?key=${aiConfig.apiKey}`, // Corrected URL structure
                {
                    model: aiConfig.model,
                    contents: [{ parts: [{ text: prompt }] }],
                    config: { 
                        responseMimeType: "application/json" // Prefer JSON output
                    }
                }, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            // Robust JSON extraction (assuming Gemini uses JSON response Mime Type now)
            const rawResponseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
            let parsedQuestions = [];
            try {
                parsedQuestions = JSON.parse(rawResponseText);
            } catch (parseError) {
                console.error("Failed to parse AI JSON:", parseError);
            }
            
            quiz.push({ domain: domainObj, questions: parsedQuestions });
        }

    } catch (err) {
        console.error(`❌ REAL AI CALL FAILED (Using STUB FALLBACK): ${err.message}`);
        
        // --- Fallback Stub ---
        quiz = domains.map(domainObj => ({
            domain: domainObj,
            questions: Array(questionsPerDomain).fill(0).map((_, i) => ({
                id: `${domainObj.name}-q${i + 1}`,
                text: `STUB: Question ${i + 1} (${domainObj.name}) - Skills: ${skills.join(', ')}.`,
                options: ['A', 'B', 'C']
            }))
        }));
    }

    // Cache quiz for 1 hour
    await redisClient.setCache(`quiz:${userId}`, JSON.stringify(quiz), 3600);
    return quiz;
};

// =========================================================================
// 3. SUMMARIZE ONBOARDING (Local Stub)
// =========================================================================
export const summarizeOnboarding = async (onboarding) => {
    // Use dynamic import for local CommonJS/utility modules
    const { toRadar } = await import('../utils/radarDataUtil.js'); 

    // In the final version, this would be an AI call:
    /*
    const prompt = `Summarize the following data and provide next steps... Data: ${JSON.stringify(onboarding)}`;
    const aiResponse = await axios.post(aiApiUrl, { ... });
    */

    return {
        radar: toRadar(onboarding.skillScores || {}),
        // Hardcoded stub recommendations
        recommendedTasks: ['Complete React tutorial', 'Build one mini project'],
        suggestedCourses: ['React Fundamentals']
    };
};