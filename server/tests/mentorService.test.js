// server/tests/mentorService.test.js
import mentorRecommendationService from "../services/mentorRecommendationService.js";

describe("Mentor Recommendation Service", () => {
  test("should recommend mentors based on domain", async () => {
    const mentors = await mentorRecommendationService.getMentorsByDomain("Web Development");
    expect(Array.isArray(mentors)).toBe(true);
  });
});
