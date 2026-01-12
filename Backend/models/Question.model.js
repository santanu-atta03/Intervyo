import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
  isHidden: Boolean
});

const codingDetailsSchema = new mongoose.Schema({
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  testCases: [testCaseSchema],
  constraints: String,
  hints: [String],
  timeComplexity: String,
  spaceComplexity: String
});

const evaluationSchema = new mongoose.Schema({
  idealAnswer: String,
  keyPoints: [String],
  commonMistakes: [String],
  followUpQuestions: [String]
});

const statsSchema = new mongoose.Schema({
  timesAsked: Number,
  averageScore: Number,
  averageTimeToAnswer: Number,
  skipRate: Number
});

const questionSchema = new mongoose.Schema({
  question: String,
  type: String,
  difficulty: String,
  domain: String,
  subDomain: String,
  companies: [String],
  trending: Boolean,
  frequency: Number,
  codingDetails: codingDetailsSchema,
  evaluation: evaluationSchema,
  stats: statsSchema,
  tags: [String],
  createdBy: String,
  source: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Question', questionSchema);