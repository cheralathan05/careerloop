// server/services/aiService.js (FINAL, FULLY UPDATED AND ES MODULE COMPLIANT ✅)

// 1. Convert initial requires to import statements
import aiConfig from '../config/aiConfig.js';
import axios from 'axios'; // External packages use simple import

/**
 * Minimal AI stubs. Replace calls with real LLM integration.
 * NOTE: Local utility requires are converted to dynamic imports
* to avoid circular dependency issues common in ESM.
 */
export const recommendDomains = async (skills = [], interests = []) => {
  // simple local scoring using util mapping later
  // returns [{ name, score }]
  
  // 2. Convert nested require to dynamic import (avoids initial load errors)
  const { mapSkillsToDomains } = await import('../utils/skillMappingUtil.js'); 
  const scores = mapSkillsToDomains(skills);
  return Object.entries(scores).map(([name, score]) => ({ name, score }));
};

export const generateQuiz = async (domains = []) => {
  // return a small set of example questions
  return domains.map(domain => ({
    domain,
    questions: [
      { id: `${domain}-q1`, text: `What is a core skill in ${domain}?`, options: ['A', 'B', 'C'] }
    ]
  }));
};

export const summarizeOnboarding = async (onboarding) => {
  // 2. Convert nested require to dynamic import
  const { toRadar } = await import('../utils/radarDataUtil.js'); 

  return {
    radar: toRadar(onboarding.skillScores || {}),
    recommendedTasks: ['Complete React tutorial', 'Build one mini project'],
    suggestedCourses: ['React Fundamentals']
  };
};

// No need for module.exports, as 'export const' handles it.