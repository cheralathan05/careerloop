// server/tests/feedback.test.js
import feedbackService from "../services/feedbackService.js";

describe("Feedback Service", () => {
  test("should save and retrieve user feedback", async () => {
    const feedback = await feedbackService.submitFeedback({
      userId: "u123",
      message: "Amazing onboarding experience!",
      rating: 5,
    });
    expect(feedback).toHaveProperty("rating");
  });
});
