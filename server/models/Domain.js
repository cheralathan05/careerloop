const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  skills: [String],
  demandScore: Number
});

module.exports = mongoose.model('Domain', domainSchema);
