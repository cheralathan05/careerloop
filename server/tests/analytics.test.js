// server/tests/analytics.test.js
import analyticsService from "../services/analyticsService.js";

describe("Analytics Service", () => {
  test("should record onboarding progress event", async () => {
    const event = await analyticsService.trackEvent({
      userId: "123",
      type: "onboarding_progress",
      data: { phase: 7 },
    });
    expect(event).toHaveProperty("userId");
    expect(event.type).toBe("onboarding_progress");
  });
});
