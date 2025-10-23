// server/controllers/onboardingController.js (FINAL, FULLY CORRECTED VERSION ✅)

// Convert require to import (Assuming these files are now using ES Modules)
import Onboarding from '../models/Onboarding.js';
import asyncHandler from 'express-async-handler';
import aiService from '../services/aiService.js';
import { success, error } from '../utils/responseHandler.js';
import { setCache } from '../utils/redisClient.js';

// ====================================================
// 🔹 SAVE DETAILS
// ====================================================
export const saveDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const payload = req.body;
  let onboarding = await Onboarding.findOne({ user: userId });
  if (!onboarding) {
    onboarding = await Onboarding.create({ user: userId, personalInfo: payload.personalInfo || {} });
  } else {
    onboarding.personalInfo = { ...(onboarding.personalInfo || {}), ...(payload.personalInfo || {}) };
    await onboarding.save();
  }
  success(res, 200, { message: 'Saved', onboarding });
});

// ====================================================
// 🔹 GET DOMAINS
// ====================================================
export const getDomains = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const onboarding = await Onboarding.findOne({ user: userId });
  const skills = (onboarding?.personalInfo?.skills) || [];
  const domains = await aiService.recommendDomains(skills, onboarding?.personalInfo?.interests || []);
  // cache
  await setCache(`domains:${userId}`, domains, 3600);
  success(res, 200, { domains });
});

// ====================================================
// 🔹 GET QUIZ
// ====================================================
export const getQuiz = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const onboarding = await Onboarding.findOne({ user: userId });
  const domains = onboarding?.selectedDomains?.length ? onboarding.selectedDomains : ['General'];
  
  // ✅ FIX: Pass userId as the first argument, as required by aiService.generateQuiz
  const quiz = await aiService.generateQuiz(userId, domains);
  
  success(res, 200, { quiz });
});

// ====================================================
// 🔹 SUBMIT ASSESSMENT
// ====================================================
export const submitAssessment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { results } = req.body;
  // store results in Onboarding.skillScores
  let onboarding = await Onboarding.findOne({ user: userId });
  onboarding = onboarding || new Onboarding({ user: userId });
  onboarding.skillScores = results;
  await onboarding.save();
  success(res, 200, { message: 'Assessment saved', onboarding });
});

// ====================================================
// 🔹 GET SUMMARY
// ====================================================
export const getSummary = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const onboarding = await Onboarding.findOne({ user: userId });
  const summary = await aiService.summarizeOnboarding(onboarding || {});
  success(res, 200, { summary });
});