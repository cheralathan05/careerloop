// server/tests/aiService.test.js

import aiService from "../services/aiService.js";

describe("AI Service Stubs", () => {
  // Test for domain recommendation stub
  test("should recommend domains based on skills and return structured data", async () => {
    const skills = ["React", "Node", "Figma", "Python"];
    const recommendations = await aiService.recommendDomains(skills);

    expect(recommendations).toEqual(expect.any(Array));
    expect(recommendations.length).toBeGreaterThan(0);
    // Assumes at least one recommendation has a name and score property
    expect(recommendations[0]).toHaveProperty("name");
    expect(recommendations[0]).toHaveProperty("score");
  });

  // Test for quiz generation stub
  test("should generate quiz questions for given domains", async () => {
    const domains = ["Web Development", "UI/UX"];
    const quiz = await aiService.generateQuiz(domains);

    expect(quiz).toEqual(expect.any(Array));
    expect(quiz.length).toBe(domains.length);
    // Check that the first domain has questions
    expect(quiz[0]).toHaveProperty("questions");
    expect(quiz[0].questions.length).toBeGreaterThan(0);
  });

  // Test for onboarding summary stub
  test("should return a structured onboarding summary", async () => {
    // Mock minimal onboarding data
    const mockOnboarding = {
      skillScores: { react: 4, node: 3, figma: 5 },
      personalInfo: { interests: ["design"] }
    };
    const summary = await aiService.summarizeOnboarding(mockOnboarding);

    expect(summary).toHaveProperty("radar");
    expect(summary).toHaveProperty("recommendedTasks");
    expect(summary).toHaveProperty("suggestedCourses");
    expect(summary.recommendedTasks).toEqual(expect.any(Array));
  });
});