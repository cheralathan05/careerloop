// server/tests/onboarding.test.js

// 1. Import the specific controller functions to be tested
import { 
    saveDetails, 
    getDomains, 
    getQuiz, 
    submitAssessment, 
    getSummary 
} from "../controllers/onboardingController.js";

// 2. Mock Dependencies
// Mock the Redis client used by the controller for state management
const mockSetCache = jest.fn().mockResolvedValue(true);
const mockGetCached = jest.fn();
jest.mock("../utils/redisClient.js", () => ({
    setCache: mockSetCache,
    getCached: mockGetCached,
}));

// Mock the AI service for predictable outcomes
const mockRecommendDomains = jest.fn().mockResolvedValue([
    { name: "Web Dev", score: 5 },
    { name: "UI/UX", score: 3 }
]);
const mockGenerateQuiz = jest.fn().mockResolvedValue({ quiz: [] });
const mockSummarize = jest.fn().mockResolvedValue({ summary: 'Great summary.' });

jest.mock("../services/aiService.js", () => ({
    recommendDomains: mockRecommendDomains,
    generateQuiz: mockGenerateQuiz,
    summarizeOnboarding: mockSummarize,
}));


// Mock Express request/response objects for controller testing
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


describe("Onboarding Controller Flow", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

// --------------------------------------------------------------------------

    test("1. saveDetails should save initial data to Redis cache", async () => {
        const mockUserId = "test-user-save";
        const mockReq = { 
            user: { id: mockUserId }, 
            body: { skills: ["react", "node"], interests: ["frontend"] } 
        };
        const res = mockResponse();

        await saveDetails(mockReq, res);

        // Assert that setCache was called with the correct key and data
        expect(mockSetCache).toHaveBeenCalledWith(
            `onboarding:${mockUserId}`, 
            mockReq.body, 
            expect.any(Number) // Check that a TTL was passed
        );
        // Assert successful response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining("saved successfully") })
        );
    });
    
// --------------------------------------------------------------------------

    test("2. getDomains should fetch data from cache, call AI, and save results", async () => {
        const mockUserId = "test-user-domains";
        const mockOnboardingData = JSON.stringify({ 
            skills: ["react", "node"], 
            interests: ["frontend"] 
        });
        
        // Arrange: Mock cache hit for onboarding data
        mockGetCached.mockResolvedValueOnce(mockOnboardingData); 
        
        const mockReq = { 
            user: { id: mockUserId }, 
            params: {} // Use req.user.id
        };
        const res = mockResponse();

        await getDomains(mockReq, res);

        // Assert AI service was called with the correct parsed data
        expect(mockRecommendDomains).toHaveBeenCalledWith(
            ["react", "node"], 
            ["frontend"]
        );
        
        // Assert the result was saved back to the cache
        expect(mockSetCache).toHaveBeenCalledWith(
            `domains:${mockUserId}`, 
            // The mocked return value of recommendDomains
            mockRecommendDomains.mock.results[0].value, 
            expect.any(Number)
        );
        
        // Assert successful response
        expect(res.status).toHaveBeenCalledWith(200);
    });

// --------------------------------------------------------------------------
    
    test("3. getQuiz should call AI to generate quiz questions", async () => {
        const mockUserId = "test-user-quiz";
        const mockDomains = JSON.stringify([{name: "Web Dev"}, {name: "UI/UX"}]);
        
        // Arrange: Mock cache hit for domains
        mockGetCached.mockResolvedValueOnce(mockDomains); 
        
        const mockReq = { user: { id: mockUserId }, params: {} };
        const res = mockResponse();

        await getQuiz(mockReq, res);

        // Assert AI service was called
        expect(mockGenerateQuiz).toHaveBeenCalledWith(
            mockUserId, 
            // Pass the parsed domains
            expect.arrayContaining([expect.objectContaining({name: "Web Dev"})])
        );
        
        // Assert successful response
        expect(res.status).toHaveBeenCalledWith(200);
    });
    
// --------------------------------------------------------------------------

    test("4. submitAssessment should save answers to Redis cache", async () => {
        const mockUserId = "test-user-submit";
        const mockAnswers = [{ id: 'q1', answer: 'A' }];
        
        const mockReq = { 
            user: { id: mockUserId }, 
            body: { answers: mockAnswers } 
        };
        const res = mockResponse();

        await submitAssessment(mockReq, res);

        // Assert that setCache was called with the assessment key and answers
        expect(mockSetCache).toHaveBeenCalledWith(
            `assessment:${mockUserId}`, 
            mockAnswers, 
            expect.any(Number)
        );
        
        // Assert successful response
        expect(res.status).toHaveBeenCalledWith(200);
    });

// --------------------------------------------------------------------------

    test("5. getSummary should return an error if data is incomplete", async () => {
        // Arrange: Mock cache miss for assessment (simulating incomplete flow)
        mockGetCached.mockResolvedValueOnce(JSON.stringify({ skills: ["react"] })); // Onboarding hit
        mockGetCached.mockResolvedValueOnce(null); // Assessment miss

        const mockReq = { user: { id: 'incomplete-user' }, params: {} };
        const res = mockResponse();

        await getSummary(mockReq, res);

        // Assert 404 error was returned
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining("Incomplete onboarding data") })
        );
        // Assert AI was NOT called
        expect(mockSummarize).not.toHaveBeenCalled();
    });
});