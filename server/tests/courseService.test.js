// server/tests/courseService.test.js

// 1. Import the specific named export 'suggest'
import { suggest } from "../services/courseSuggestionService.js";

// 2. Mock Dependencies
// Mock the Mongoose Model (the primary source/cache)
jest.mock("../models/Course.js", () => ({
    // Mock the find method to simulate a database cache miss (returning empty array)
    find: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]), // CRITICAL: Simulate cache MISS
    }),
    // Mock insertMany which is used to save the static/AI results
    insertMany: jest.fn().mockResolvedValue(true),
}));
const Course = require("../models/Course"); // Require the mocked version

// Mock the static/utility function used as a fallback (to control the expected output)
const mockStaticSuggestions = [
    { title: "Course 1", domain: "Data Science" },
    { title: "Course 2", domain: "Data Science" },
];
jest.mock("../utils/courseSuggestionUtil.js", () => ({
    suggestCourses: jest.fn((domain) => mockStaticSuggestions),
}));


describe("Course Suggestion Service", () => {
    
    // Clear mocks before each test to ensure isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return cached courses if found in DB", async () => {
        // Mock the DB find method to simulate a CACHE HIT
        Course.find().lean.mockResolvedValueOnce([
            { _id: 'db1', title: 'Cached Course' }
        ]);

        const results = await suggest("Web Development");
        
        expect(Course.find).toHaveBeenCalledWith({ domain: "Web Development" });
        expect(results).toEqual(expect.any(Array));
        expect(results[0].title).toBe("Cached Course");
        // Ensure the static utility was NOT called on a cache hit
        expect(require("../utils/courseSuggestionUtil").suggestCourses).not.toHaveBeenCalled();
    });

    test("should return static/utility suggestions on DB cache miss", async () => {
        // The global mock for Course.find().lean already returns [] (miss)
        
        const domain = "Data Science";
        const results = await suggest(domain);
        
        // Ensure the static utility WAS called on a cache miss
        expect(require("../utils/courseSuggestionUtil").suggestCourses).toHaveBeenCalledWith(domain);
        
        expect(results).toEqual(mockStaticSuggestions);
        expect(results.length).toBe(2);
    });

    test("should attempt to save static suggestions to DB cache after a miss", async () => {
        // The global mock for Course.find().lean already returns [] (miss)
        
        const results = await suggest("Data Science");
        
        // Ensure insertMany was called with the mock static suggestions
        expect(Course.insertMany).toHaveBeenCalledWith(mockStaticSuggestions);
    });
});