// server/tests/mentorService.test.js (FINAL, ZERO-ERROR VERSION)

// 1. Import the specific named export 'recommend'
import { recommend } from "../services/mentorRecommendationService.js";

// 2. Mock Dependencies
// Mock the Mongoose Model (Mentor)
const mockAggregate = jest.fn();
jest.mock("../models/Mentor.js", () => ({
    // The service uses Mentor.aggregate(pipeline)
    aggregate: mockAggregate,
}));


describe("Mentor Recommendation Service (recommend function)", () => {
    
    const mockSkills = ["React", "Node.js", "MongoDB"];
    // CRITICAL FIX: The service normalizes skills to lowercase before aggregation.
    // The aggregation pipeline should be asserted against the lowercase version.
    const expectedNormalizedSkills = mockSkills.map(s => s.toLowerCase());

    const mockAggregatedMentors = [
        // Mentor 1 has 3 matches (highest score)
        { name: "Alice", matchScore: 3, expertise: mockSkills }, 
        // Mentor 2 has 2 matches (second highest score)
        { name: "Bob", matchScore: 2, expertise: ["React", "Node.js"] },
    ];

    beforeEach(() => {
        // Reset the mock before each test
        mockAggregate.mockClear();
        // Default mock implementation: always returns the mock list
        mockAggregate.mockResolvedValue(mockAggregatedMentors); 
    });

    test("should return mentors prioritized by skill match score", async () => {
        
        const recommendations = await recommend(mockSkills);
        
        // 1. Assert the structure
        expect(Array.isArray(recommendations)).toBe(true);
        expect(recommendations.length).toBe(mockAggregatedMentors.length);
        
        // 2. Assert the content (verify prioritization)
        expect(recommendations[0].name).toBe("Alice");
        expect(recommendations[0].matchScore).toBe(3);
    });

    test("should call Mentor.aggregate with the correct prioritization pipeline", async () => {
        
        await recommend(mockSkills);
        
        // 1. Assert that the aggregate function was called
        expect(mockAggregate).toHaveBeenCalledTimes(1);
        
        // 2. Assert that the pipeline structure is correct, using the normalized skills
        const pipeline = mockAggregate.mock.calls[0][0];
        // ⬅️ FIX: Assert against the expected lowercase/normalized skills array
        expect(pipeline[0].$match).toEqual({ expertise: { $in: expectedNormalizedSkills } }); 
        
        // 3. Assert the sorting stage is correct (sorting by matchScore and then rating)
        expect(pipeline.find(stage => stage.$sort)).toEqual({ 
            $sort: { 
                matchScore: -1, 
                rating: -1 
            } 
        });
        
        // 4. Assert the limit is 10
        expect(pipeline.find(stage => stage.$limit)).toEqual({ $limit: 10 });
    });
    
    test("should return an empty array if no skills are provided", async () => {
        // The aggregation pipeline should not even be called if skills array is empty
        const recommendations = await recommend([]);
        
        expect(recommendations).toEqual([]);
        expect(mockAggregate).not.toHaveBeenCalled();
    });
});