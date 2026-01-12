const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  score: Number,
  interviewsCompleted: Number,
  averageScore: Number,
  rank: Number
});

const leaderboardSchema = new mongoose.Schema({
  domain: String,
  timeFrame: String, // daily, weekly, monthly, all-time
  rankings: [rankingSchema],
  lastUpdated: Date
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);