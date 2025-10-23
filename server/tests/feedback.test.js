// server/tests/feedback.test.js

// 1. Import the specific named export 'save'
import { save } from "../services/feedbackService.js";

// 2. Mock Dependencies
// Mock the Mongoose Model (Feedback)
jest.mock("../models/Feedback.js", () => ({
    // Mock the create function to simulate successful DB save
    create: jest.fn(data => ({ ...data, _id: "mockFeedbackId" })),
}));
const Feedback = require("../models/Feedback"); // Access the mocked version

// Mock the non-blocking services (Analytics and Email)
jest.mock("../services/analyticsService.js", () => ({
    // Mock the 'log' function
    log: jest.fn().mockResolvedValue(true), 
}));
jest.mock("../utils/sendEmail.js", () => ({
    // Mock the 'sendEmail' function (default export)
    __esModule: true,
    default: jest.fn().mockResolvedValue(true),
}));


describe("Feedback Service (save function)", () => {
    
    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should save feedback to DB and trigger background tasks", async () => {
        
        const userId = "test-user-f456";
        const feedbackData = {
            type: "general",
            comments: "Amazing onboarding experience!",
            rating: 5,
            phase: "onboarding",
        };
        
        // 1. Call the correct function with the correct signature
        const savedFeedback = await save(userId, feedbackData);
        
        // 2. Assertions
        
        // Check the returned structure
        expect(savedFeedback).toHaveProperty("_id", "mockFeedbackId");
        expect(savedFeedback).toHaveProperty("rating", 5);
        expect(savedFeedback.user).toBe(userId);
        expect(savedFeedback.comments).toBe(feedbackData.comments);
        
        // Check that the database creation was called correctly
        expect(Feedback.create).toHaveBeenCalledWith({
            user: userId,
            phase: feedbackData.phase,
            rating: feedbackData.rating,
            comments: feedbackData.comments,
            status: 'New', // Default status from the service
            ...feedbackData // Should include all spread data
        });

        // Check that background tasks were triggered (non-blocking)
        const analyticsService = require("../services/analyticsService");
        expect(analyticsService.log).toHaveBeenCalledWith(
            userId,
            'feedback_submitted',
            expect.objectContaining({ rating: 5 })
        );
        // Check that an email notification was attempted
        expect(require("../utils/sendEmail").default).toHaveBeenCalled();
    });

    test("should save feedback even without rating or user ID", async () => {
        const feedbackData = {
            comments: "This is a bug report.",
            type: "bug",
        };
        
        const savedFeedback = await save(null, feedbackData); // Call with null user ID
        
        expect(savedFeedback.user).toBeNull();
        expect(savedFeedback.comments).toBe(feedbackData.comments);
        // Ensure DB was still called
        expect(Feedback.create).toHaveBeenCalledTimes(1);
    });
});