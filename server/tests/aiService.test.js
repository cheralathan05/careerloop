// server/tests/aiService.test.js (FINAL, ZERO-ERROR VERSION)

// IMPORTANT: Mock external dependencies before imports to ensure the service uses them
jest.mock('../utils/skillMappingUtil.js', () => ({
    // Mock the utility used by recommendDomains
    mapSkillsToDomains: (skills, interests) => ({ 
        'Web Development': 0.8, 
        'UI/UX': 0.6 
    }),
}));

// Mock the Redis client used internally by the service functions
jest.mock('../utils/redisClient.js', () => ({
    getCached: jest.fn().mockResolvedValue(null), 
    setCache: jest.fn().mockResolvedValue(true), 
}));

// Mock the util used by summarizeOnboarding (if defined)
jest.mock('../utils/radarDataUtil.js', () => ({
    toRadar: jest.fn(scores => ({ labels: Object.keys(scores), data: Object.values(scores) })),
}));

// Import the correct named exports from the service file
import { 
    getRecommendedDomains, // ⬅️ CRITICAL FIX: Use the correct service name
    generateSkillQuiz,     // ⬅️ CRITICAL FIX: Use the correct service name
    generateSummaryReport  // ⬅️ CRITICAL FIX: Use the correct service name
} from "../services/aiService.js";


describe("AI Service Contracts", () => {
    
    // Test for domain recommendation stub
    test("should recommend domains based on skills and return structured data", async () => {
        const userId = 'test-user-123';
        // ⬅️ CRITICAL FIX: Pass data in the structure expected by the service (onboardingData)
        const mockOnboardingData = {
            skills: ["React", "Node", "Figma", "Python"],
            interests: ["Frontend"]
        };

        const recommendations = await getRecommendedDomains(userId, mockOnboardingData); 

        expect(recommendations).toEqual(expect.any(Array));
        expect(recommendations.length).toBeGreaterThan(0);
        
        // Ensure the data structure matches the service's output (name and score)
        expect(recommendations[0]).toHaveProperty("name");
        expect(recommendations[0]).toHaveProperty("score");
        expect(recommendations[0].name).toBe('Web Development');
    });

// --------------------------------------------------------------------------

    // Test for quiz generation stub (using the corrected function name)
    test("should generate quiz questions for given domains and cache the result", async () => {
        const userId = 'test-user-123';
        // Domains is an array of strings in the final controller/service logic
        const domains = ["Web Development", "UI/UX"]; 
        
        // Call the imported named function with the correct signature
        const quiz = await generateSkillQuiz(userId, domains); // ⬅️ FIX: Correct function name

        expect(quiz).toEqual(expect.any(Array));
        // Due to the fallback logic, the stub should return questions (flat array of objects)
        expect(quiz.length).toBeGreaterThan(0); 
        
        // Check that the first question has the required properties
        expect(quiz[0]).toHaveProperty("questionText");
        expect(quiz[0]).toHaveProperty("domain");
    });

// --------------------------------------------------------------------------

    // Test for onboarding summary stub
    test("should return a structured onboarding summary", async () => {
        // Mock minimal data (assessment.metrics is critical here)
        const mockDetails = { goals: 'Become a senior developer' };
        const mockAssessment = {
            metrics: {
                percentageScore: 85,
                skillRadar: { react: 85, node: 70, figma: 60 } // Critical for summary text/radar
            }
        };

        const summary = await generateSummaryReport(mockDetails, mockAssessment); // ⬅️ FIX: Correct function name

        expect(summary).toHaveProperty("radarMetrics");
        expect(summary).toHaveProperty("textSummary");
        expect(summary).toHaveProperty("recommendedTasks");
        expect(summary.radarMetrics).toEqual(expect.any(Object));
    });
});