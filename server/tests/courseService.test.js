// server/tests/courseService.test.js
import courseSuggestionService from "../services/courseSuggestionService.js";

describe("Course Suggestion Service", () => {
  test("should return AI suggested courses", async () => {
    const results = await courseSuggestionService.suggestCourses("Data Science");
    expect(results).toEqual(expect.any(Array));
  });
});
