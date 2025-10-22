const asyncHandler = require('express-async-handler');
const feedbackService = require('../services/feedbackService');

exports.submit = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const saved = await feedbackService.save(userId, req.body);
  res.json({ message: 'Feedback saved', saved });
});

