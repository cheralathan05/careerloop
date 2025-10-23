// server/tests/resumeParser.test.js

// 1. Import the specific named export 'parse'
import { parse } from "../services/resumeParserService.js";

// 2. Mock Dependencies (If you were testing the non-stub version)
// Since the service uses static stub data, we don't need extensive mocks 
// unless we were testing the AI integration part.
// We mock the setTimeout call to avoid waiting 500ms in tests.
jest.useFakeTimers();

describe("Resume Parser Service (parse function)", () => {
    
    // Create a mock file buffer for the test
    const mockBuffer = Buffer.from("This is a mock resume file content.");

    // Advance timers so the simulated delay doesn't slow down the test
    beforeEach(() => {
        jest.advanceTimersByTime(500); 
    });

    test("should return the static list of skills for the stub", async () => {
        
        // 1. Act: Call the service with a mock buffer
        const skills = await parse(mockBuffer);
        
        // 2. Assert: Check the contract (returns an array)
        expect(Array.isArray(skills)).toBe(true);
        expect(skills.length).toBeGreaterThan(0);
        
        // 3. Assert: Check for expected static content from the stub
        expect(skills).toEqual(
            expect.arrayContaining(['React', 'Node.js', 'JavaScript', 'MongoDB', 'REST APIs'])
        );
        // The original expectation:
        expect(skills).toContain("JavaScript"); 
    });

    test("should handle null or undefined input and still return a skill list", async () => {
        // Even if the buffer is missing, the stub should return a predictable list
        const skills = await parse(null);
        
        expect(Array.isArray(skills)).toBe(true);
        expect(skills).toContain("JavaScript");
    });
});