// ✅ ONBOARDING CONTROLLER
import asyncHandler from 'express-async-handler';
import * as aiService from '../services/aiService.js'; // ✅ Use named imports via *
// ✅ Correct ESM import from CommonJS module
import responseHandler from '../utils/responseHandler.js';
const { success, error } = responseHandler;

import { setCache, getCached } from '../utils/redisClient.js';

// ============================================
// 1️⃣ Save Onboarding Details
// ============================================
export const saveDetails = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const onboardingData = req.body;

  if (!userId || !onboardingData) {
    return error(res, 'Invalid onboarding data or user missing', 400);
  }

  await setCache(`onboarding:${userId}`, onboardingData, 3600);
  return success(res, 'Onboarding details saved successfully', onboardingData);
});

// ============================================
// 2️⃣ Get Recommended Domains
// ============================================
export const getDomains = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user?.id;
  const onboarding = await getCached(`onboarding:${userId}`);

  if (!onboarding) return error(res, 'No onboarding data found', 404);

  const parsed = JSON.parse(onboarding);
  const domains = await aiService.recommendDomains(
    parsed.skills || [],
    parsed.interests || []
  );

  await setCache(`domains:${userId}`, domains, 3600);
  return success(res, 'Recommended domains generated', domains);
});

// ============================================
// 3️⃣ Generate AI Quiz
// ============================================
export const getQuiz = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user?.id;
  const domains = await getCached(`domains:${userId}`);

  if (!domains) return error(res, 'No domains found. Please complete previous step.', 404);

  const parsedDomains = JSON.parse(domains);
  const quiz = await aiService.generateQuiz(userId, parsedDomains);

  return success(res, 'Quiz generated successfully', quiz);
});

// ============================================
// 4️⃣ Submit Assessment
// ============================================
export const submitAssessment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { answers } = req.body;

  if (!userId || !answers) return error(res, 'Invalid submission', 400);

  await setCache(`assessment:${userId}`, answers, 3600);
  return success(res, 'Assessment submitted successfully', { total: answers.length });
});

// ============================================
// 5️⃣ Get Summary
// ============================================
export const getSummary = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user?.id;

  const onboarding = await getCached(`onboarding:${userId}`);
  const assessment = await getCached(`assessment:${userId}`);

  if (!onboarding || !assessment)
    return error(res, 'Incomplete onboarding data', 404);

  const summary = await aiService.summarizeOnboarding(JSON.parse(onboarding));
  return success(res, 'Onboarding summary generated', summary);
});
