const asyncHandler = require('express-async-handler');
const aiService = require('../services/aiService');
const { success } = require('../utils/responseHandler');

exports.getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user?.id;
  // stub: use onboarding stored data normally
  const recs = { tasks: ['Build portfolio'], mentors: ['Find mentor'] };
  success(res, 200, recs);
});

exports.chat = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  // naive echo response for now
  success(res, 200, { reply: `AI (stub) received: ${prompt}` });
});
