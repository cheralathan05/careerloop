// server/services/mentorRecommendationService.js (ES Module Format)
import Mentor from '../models/Mentor.js'; // Use ES Module import

/**
 * @desc Recommends mentors based on a list of user skills, prioritizing the best matches.
 * @param {Array<string>} skills - A list of the user's skills.
 * @returns {Promise<Array>} List of recommended mentor objects.
 */
export const recommend = async (skills = []) => {
    if (skills.length === 0) {
        console.log("[MentorService] No skills provided, returning empty list.");
        return [];
    }

    // 1. Build the Aggregation Pipeline
    // Aggregation is used to calculate a 'match score' for each mentor.
    const pipeline = [
        // Stage 1: Filter mentors whose 'expertise' array intersects with the user's 'skills'
        {
            $match: { 
                expertise: { $in: skills } 
            }
        },
        // Stage 2: Calculate the intersection count (match score)
        {
            $addFields: {
                matchScore: { 
                    $size: {
                        $setIntersection: ['$expertise', skills] // Count common elements
                    }
                }
            }
        },
        // Stage 3: Sort by match score (highest score first)
        { 
            $sort: { 
                matchScore: -1, 
                rating: -1 // Secondary sort by public rating
            } 
        },
        // Stage 4: Limit and Project
        { $limit: 10 },
        { $project: { __v: 0, password: 0 } } // Exclude unnecessary fields
    ];

    try {
        const recommendedMentors = await Mentor.aggregate(pipeline);
        console.log(`[MentorService] Found ${recommendedMentors.length} prioritized mentor recommendations.`);
        return recommendedMentors;
    } catch (error) {
        console.error("❌ Mentor recommendation aggregation failed:", error.message);
        return [];
    }
};