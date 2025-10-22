const Mentor = require('../models/Mentor');

exports.recommend = async (skills = []) => {
  // basic DB query: find mentors who match any skill in expertise
  return Mentor.find({ expertise: { $in: skills } }).limit(10).lean();
};
