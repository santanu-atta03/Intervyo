import mongoose from 'mongoose';

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

  // Company-specific benchmarks
  hiringBar: {
    technical: { type: Number, default: 70 }, // Minimum score for technical
    behavioral: { type: Number, default: 65 }, // Minimum score for behavioral
    systemDesign: { type: Number, default: 75 }, // Minimum score for system design
    overall: { type: Number, default: 70 } // Overall minimum score
  },

  // Success metrics
  acceptanceRate: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },

  // Difficulty ratings
  difficultyRating: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  },

  // Interview characteristics
  characteristics: {
    focusAreas: [String], // e.g., ['algorithms', 'system-design', 'leadership']
    interviewStyle: String, // e.g., 'conversational', 'rigorous', 'practical'
    commonTopics: [String]
  },

  // Historical data
  stats: {
    totalInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    passRate: { type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Company', companySchema);
