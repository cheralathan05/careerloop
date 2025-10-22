const asyncHandler = require('express-async-handler');
const courseService = require('../services/courseSuggestionService');

exports.getByDomain = asyncHandler(async (req, res) => {
  const { domain } = req.params;
  const courses = await courseService.suggest(domain);
  res.json({ courses });
});
