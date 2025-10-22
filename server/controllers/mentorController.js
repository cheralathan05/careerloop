const asyncHandler = require('express-async-handler');
const Mentor = require('../models/Mentor');

exports.list = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const mentors = await Mentor.find(q ? { $text: { $search: q } } : {}).limit(50);
  res.json({ mentors });
});
