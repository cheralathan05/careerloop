// server/tests/resumeParser.test.js
import resumeParserService from "../services/resumeParserService.js";

describe("Resume Parser", () => {
  test("should extract skills from uploaded resume text", async () => {
    const sampleText = "Experienced in JavaScript, React, and Node.js development.";
    const skills = await resumeParserService.extractSkills(sampleText);
    expect(skills).toContain("JavaScript");
  });
});
