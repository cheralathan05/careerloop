// server/tests/feedback.test.js (FINAL, ZERO-ERROR VERSION)

// 1. Import the specific named export 'save'
import { save } from "../services/feedbackService.js";

// 2. Mock Dependencies
// Mock the Mongoose Model (Feedback)
jest.mock("../models/Feedback.js", () => ({
    // Mock the create function to simulate successful DB save (returning a promise)
    create: jest.fn(data => Promise.resolve({ ...data, _id: "mockFeedbackId" })),
}));
const Feedback = require("../models/Feedback"); // Access the mocked version

// Mock the non-blocking services (Analytics and Email)
jest.mock("../services/analyticsService.js", () => ({
    // CRITICAL FIX: The service now exports 'track'
    track: jest.fn().mockResolvedValue(true), 
}));

// The sendEmail utility is a named export in the final version
jest.mock("../utils/sendEmail.js", () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}));


describe("Feedback Service (save function)", () => {
    
    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Set the mock ENV variable for the email test case
        process.env.FEEDBACK_NOTIFICATION_EMAIL = 'support@test.com';
    });

    test("should save feedback to DB and trigger background tasks", async () => {
        
        const userId = "test-user-f456";
        // ⬅️ CRITICAL FIX: Combine user ID and data into the single object expected by the service
        const feedbackData = {
            userId: userId, // Passed in the object
            type: "general",
            comments: "Amazing onboarding experience!",
            rating: 5,
            context: "onboarding", // Aligned with the final model name
        };
        
        // 1. Call the correct function with the correct signature (single object)
        const savedFeedback = await save(feedbackData);
        
        // 2. Assertions
        
        // Check the returned structure
        expect(savedFeedback).toHaveProperty("_id", "mockFeedbackId");
        expect(savedFeedback).toHaveProperty("rating", 5);
        expect(savedFeedback.user).toBe(userId);
        
        // Check that the database creation was called correctly
        // NOTE: The model defaults 'status' to 'New', but the service explicitly passes it.
        expect(Feedback.create).toHaveBeenCalledWith({
            user: userId,
            type: feedbackData.type,
            comments: feedbackData.comments,
            rating: feedbackData.rating,
            context: feedbackData.context,
            status: 'New', // Default status from the service
        });

        // Check that background tasks were triggered (Analytics)
        const analyticsService = require("../services/analyticsService");
        expect(analyticsService.track).toHaveBeenCalledWith( // ⬅️ FIX: Using 'track'
            userId,
            'feedback_submitted',
            expect.objectContaining({ rating: 5, context: feedbackData.context })
        );
        
        // Check that an email notification was attempted
        expect(require("../utils/sendEmail").sendEmail).toHaveBeenCalled();
    });

    test("should save feedback without user ID (guest) or rating", async () => {
        const feedbackData = {
            comments: "This is a public bug report.",
            type: "Bug Report",
        };
        
        const savedFeedback = await save(feedbackData); // Call with implicit null user ID
        
        // Check returned data
        expect(savedFeedback.user).toBeUndefined(); // Mongoose defaults null user to undefined on create
        expect(savedFeedback.comments).toBe(feedbackData.comments);
        
        // Ensure DB was still called and user was null
        expect(Feedback.create).toHaveBeenCalledWith(
            expect.objectContaining({ user: undefined, type: "Bug Report" })
        );
        
        // Ensure email was triggered even for guest
        expect(require("../utils/sendEmail").sendEmail).toHaveBeenCalled();
    });
});