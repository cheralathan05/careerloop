const Course = require('../models/Course');
const { suggestCourses } = require('../utils/courseSuggestionUtil');

exports.suggest = async (domain) => {
  // try DB first
  const courses = await Course.find({ domain }).limit(10).lean();
  if (courses.length) return courses;
  // fallback static suggestions
  return suggestCourses(domain);
};
