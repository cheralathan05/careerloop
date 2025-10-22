const Feedback = require('../models/Feedback');

exports.save = async (userId, data) => {
  return Feedback.create({ user: userId, ...data });
};
