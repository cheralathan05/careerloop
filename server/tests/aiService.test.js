// server/tests/aiService.test.js

// 1. Import named exports from the service file
import { 
    recommendDomains, 
    generateQuiz, 
    summarizeOnboarding 
} from "../services/aiService.js";

// Mock the necessary utility functions used by aiService, 
// as they are dynamically imported and not available in the test environment by default.
// You would need to set up jest.mock or similar for '../utils/skillMappingUtil.js' 
// and '../utils/radarDataUtil.js' if they contain complex logic.

// Assuming simple mock return for testing the service contract:
jest.mock('../utils/skillMappingUtil.js', () => ({
    mapSkillsToDomains: (skills) => ({ 
        'Web Development': 0.8, 
        'UI/UX': 0.6 
    }),
}));

// Mock the Redis client used internally by generateQuiz to prevent external calls
jest.mock('../utils/redisClient.js', () => ({
    getCached: jest.fn().mockResolvedValue(null), // Always cache miss
    setCache: jest.fn().mockResolvedValue(true),  // Always succeeds
}));


describe("AI Service Stubs/Contracts", () => {
    
    // Test for domain recommendation stub
    test("should recommend domains based on skills and return structured data", async () => {
        const skills = ["React", "Node", "Figma", "Python"];
        // Call the imported named function
        const recommendations = await recommendDomains(skills); 

        expect(recommendations).toEqual(expect.any(Array));
        expect(recommendations.length).toBeGreaterThan(0);
        
        // Ensure the data structure matches the service's output (name and score)
        expect(recommendations[0]).toHaveProperty("name");
        expect(recommendations[0]).toHaveProperty("score");
        expect(recommendations[0].name).toBe('Web Development'); // Check against mock output
    });

// --------------------------------------------------------------------------

    // Test for quiz generation stub (CRITICAL ARGUMENT FIX)
    test("should generate quiz questions for given domains and cache the result", async () => {
        // generateQuiz requires userId (first arg) and domains (second arg)
        const userId = 'test-user-123';
        const domains = [{name: "Web Development", score: 0.8}, {name: "UI/UX", score: 0.6}];
        
        // Call the imported named function with the correct signature
        const quiz = await generateQuiz(userId, domains); 

        expect(quiz).toEqual(expect.any(Array));
        // Expect output to have the same number of domain groups as input
        expect(quiz.length).toBe(domains.length); 
        
        // Check that the first domain group has questions
        expect(quiz[0]).toHaveProperty("questions");
        expect(quiz[0]).toHaveProperty("domain");
        // Due to the stub/fallback logic in aiService, it should generate questions
        expect(quiz[0].questions.length).toBeGreaterThan(0); 
    });

// --------------------------------------------------------------------------

    // Test for onboarding summary stub
    test("should return a structured onboarding summary", async () => {
        // Mock minimal onboarding data (matches the data structure expected by the service)
        const mockOnboarding = {
            skillScores: { react: 4, node: 3, figma: 5 },
            personalInfo: { interests: ["design"] }
        };
        // Call the imported named function
        const summary = await summarizeOnboarding(mockOnboarding); 

        expect(summary).toHaveProperty("radar");
        expect(summary).toHaveProperty("recommendedTasks");
        expect(summary).toHaveProperty("suggestedCourses");
        expect(summary.recommendedTasks).toEqual(expect.any(Array));
    });
});