// server/tests/analytics.test.js

// 1. Import the specific named export 'log' which holds the tracking logic.
// The service file uses 'export const log = ...'
import { log } from "../services/analyticsService.js";

// 2. Mock the internal dependencies to ensure a true unit test.
// The service uses the AnalyticsEvent model and the analyticsConfig.
jest.mock("../models/AnalyticsEvent.js", () => ({
  create: jest.fn(data => ({ ...data, _id: "mockId" })), // Mock the DB interaction
}));
jest.mock("../config/analyticsConfig.js", () => ({
  default: { ENABLED: true, PROVIDER: 'internal' }, // Ensure internal logging is active
}));

// We also mock the external tracking stub to prevent logging warnings
jest.mock("../utils/sendEmail.js", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));


describe("Analytics Service (log function)", () => {
  
  // The service function is named 'log', not 'trackEvent'.
  // The arguments are: (user, eventType, payload).
  test("should record an onboarding progress event using internal provider", async () => {
    
    const userId = "test-user-456";
    const eventType = "onboarding_progress";
    const payload = { phase: 7, progress: "skills_entered" };
    
    // 1. Call the correct function with the correct arguments
    const event = await log(
      userId, 
      eventType, 
      payload
    );
    
    // 2. Assertions based on the service's internal contract
    
    // The created event should match the input data
    expect(event).toHaveProperty("_id");
    expect(event.user).toBe(userId);
    expect(event.eventType).toBe(eventType);
    
    // The payload should be the provided data object
    expect(event.payload).toEqual(payload);
  });
  
  test("should handle unauthenticated (guest) events", async () => {
    const eventType = "public_page_view";
    const payload = { url: "/landing" };

    // Call with user = null
    const event = await log(null, eventType, payload);

    expect(event).toHaveProperty("_id");
    expect(event.user).toBeNull(); // Assert that the user field is null
    expect(event.eventType).toBe(eventType);
  });
});