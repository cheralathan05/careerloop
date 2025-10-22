const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  provider: String,
  url: String,
  domain: String,
  level: String
});

module.exports = mongoose.model('Course', courseSchema);
