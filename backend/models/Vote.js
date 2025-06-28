const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  studentId: String,
  candidateId: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', voteSchema);
