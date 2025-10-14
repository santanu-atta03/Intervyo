const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  logo: String,
  customQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  interviewProcess: {
    rounds: [String],
    avgDuration: Number,
    tips: [String]
  },
  subscriptionTier: String, // basic, premium
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);