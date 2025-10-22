const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  expertise: [String],
  contact: String,
  profileUrl: String
});

module.exports = mongoose.model('Mentor', mentorSchema);
