const Onboarding = require('../models/Onboarding');
const asyncHandler = require('express-async-handler');
const aiService = require('../services/aiService');
const { success, error } = require('../utils/responseHandler');
const { setCache } = require('../utils/redisClient');

exports.saveDetails = asyncHandler(async (req, res) => {
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

exports.getDomains = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const onboarding = await Onboarding.findOne({ user: userId });
  const skills = (onboarding?.personalInfo?.skills) || [];
  const domains = await aiService.recommendDomains(skills, onboarding?.personalInfo?.interests || []);
  // cache
  await setCache(`domains:${userId}`, domains, 3600);
  success(res, 200, { domains });
});

exports.getQuiz = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const onboarding = await Onboarding.findOne({ user: userId });
  const domains = onboarding?.selectedDomains?.length ? onboarding.selectedDomains : ['General'];
  const quiz = await aiService.generateQuiz(domains);
  success(res, 200, { quiz });
});

exports.submitAssessment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { results } = req.body;
  // store results in Onboarding.skillScores
  let onboarding = await Onboarding.findOne({ user: userId });
  onboarding = onboarding || new Onboarding({ user: userId });
  onboarding.skillScores = results;
  await onboarding.save();
  success(res, 200, { message: 'Assessment saved', onboarding });
});

exports.getSummary = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const onboarding = await Onboarding.findOne({ user: userId });
  const summary = await aiService.summarizeOnboarding(onboarding || {});
  success(res, 200, { summary });
});
