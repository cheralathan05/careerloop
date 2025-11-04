/**
 * Onboarding Controller
 * ------------------------------------------------------
 * Manages all onboarding phases:
 *  - Details collection
 *  - Domain recommendations
 *  - AI quiz generation
 *  - Assessment submission
 *  - Summary report
 *  - Completion persistence
 */

import asyncHandler from 'express-async-handler';
import * as aiService from '../services/aiService.js';
import User from '../models/User.js';
import { success } from '../utils/responseHandler.js';
import { setCache, getCached } from '../utils/redisClient.js';

// Helper: safely parse JSON from Redis
const parseCachedData = (data, resource) => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`❌ Cache parsing error for ${resource}:`, err.message);
    throw new Error(`Failed to process cached ${resource} data.`);
  }
};

// ====================================================
// 1️⃣ Save User Details (Phase 9)
// ====================================================
export const saveDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const onboardingData = req.body;

  if (!onboardingData.name?.trim() || !onboardingData.goals?.trim()) {
    res.status(400);
    throw new Error('Name and career goals are required.');
  }

  await setCache(
    `onboarding:details:${userId}`,
    JSON.stringify(onboardingData),
    3600
  );

  // Trigger background AI domain prefetch (non‑blocking)
  aiService
    .getRecommendedDomains(userId, onboardingData)
    .then((domains) =>
      setCache(`onboarding:domains:${userId}`, JSON.stringify(domains), 3600)
    )
    .catch((err) =>
      console.error(`AI domain prefetch failed for ${userId}:`, err.message)
    );

  success(res, 200, { message: 'User details saved. AI recommendations in progress.' });
});

// ====================================================
// 2️⃣ Get Recommended Domains (Phase 9)
// ====================================================
export const getDomains = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cachedDomains = await getCached(`onboarding:domains:${userId}`);
  if (cachedDomains) {
    return success(res, 200, parseCachedData(cachedDomains, 'domains'));
  }

  const cachedDetails = await getCached(`onboarding:details:${userId}`);
  if (!cachedDetails) {
    res.status(404);
    throw new Error('Onboarding step incomplete. Please enter user details.');
  }

  const details = parseCachedData(cachedDetails, 'details');
  const domains = await aiService.getRecommendedDomains(userId, details);
  await setCache(`onboarding:domains:${userId}`, JSON.stringify(domains), 3600);

  success(res, 200, domains);
});

// ====================================================
// 3️⃣ Generate AI Quiz (Phase 10)
// ====================================================
export const getQuiz = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { selectedDomains } = req.body;

  if (!Array.isArray(selectedDomains) || selectedDomains.length === 0) {
    res.status(400);
    throw new Error('Please select at least one domain.');
  }

  await setCache(
    `onboarding:selected_domains:${userId}`,
    JSON.stringify(selectedDomains),
    3600
  );

  const quiz = await aiService.generateSkillQuiz(userId, selectedDomains);
  await setCache(`onboarding:quiz:${userId}`, JSON.stringify(quiz), 3600);

  success(res, 200, quiz);
});

// ====================================================
// 4️⃣ Submit Assessment (Phase 11)
// ====================================================
export const submitAssessment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    res.status(400);
    throw new Error('Invalid or missing assessment answers.');
  }

  const cachedQuiz = await getCached(`onboarding:quiz:${userId}`);
  if (!cachedQuiz) {
    res.status(404);
    throw new Error('No quiz found. Please retake the quiz.');
  }

  const quiz = parseCachedData(cachedQuiz, 'quiz');
  const assessmentResult = await aiService.processAssessment(userId, quiz, answers);

  await setCache(
    `onboarding:assessment:${userId}`,
    JSON.stringify(assessmentResult),
    3600
  );

  success(res, 200, {
    message: 'Assessment graded successfully.',
    scoreMetrics: assessmentResult.metrics,
  });
});

// ====================================================
// 5️⃣ Get Summary Report (Phase 12)
// ====================================================
export const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [cachedDetails, cachedAssessment] = await Promise.all([
    getCached(`onboarding:details:${userId}`),
    getCached(`onboarding:assessment:${userId}`),
  ]);

  if (!cachedDetails || !cachedAssessment) {
    res.status(404);
    throw new Error('Incomplete onboarding. Details or assessment missing.');
  }

  const details = parseCachedData(cachedDetails, 'details');
  const assessment = parseCachedData(cachedAssessment, 'assessment');
  const summary = await aiService.generateSummaryReport(details, assessment);

  await setCache(`onboarding:summary:${userId}`, JSON.stringify(summary), 3600);
  success(res, 200, summary);
});

// ====================================================
// 6️⃣ Complete Onboarding (Phase 14)
// ====================================================
export const completeOnboarding = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [detailsCache, assessmentCache, summaryCache] = await Promise.all([
    getCached(`onboarding:details:${userId}`),
    getCached(`onboarding:assessment:${userId}`),
    getCached(`onboarding:summary:${userId}`),
  ]);

  if (!detailsCache || !assessmentCache || !summaryCache) {
    res.status(400);
    throw new Error('Cannot complete. One or more onboarding steps are incomplete.');
  }

  const details = parseCachedData(detailsCache, 'details');
  const assessment = parseCachedData(assessmentCache, 'assessment');
  const summary = parseCachedData(summaryCache, 'summary');

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name: details.name,
      goals: details.goals,
      experience: details.experience,
      domains: assessment.domains,
      skills: assessment.metrics.skillRadar,
      onboardingComplete: true,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found.');
  }

  success(res, 200, {
    message: 'Onboarding completed successfully.',
    redirect: '/dashboard/home',
    user: {
      name: updatedUser.name,
      onboardingComplete: updatedUser.onboardingComplete,
    },
  });
});
