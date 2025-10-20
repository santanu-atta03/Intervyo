import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  speaker: {
    type: String,
    enum: ['ai', 'candidate'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  audioUrl: String,
  type: {
    type: String,
    enum: ['greeting', 'question', 'answer', 'feedback', 'closing'],
    default: 'question'
  }
});

const codeSubmissionSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  code: String,
  language: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  score: Number,
  feedback: String,
  testCasesPassed: Number,
  totalTestCases: Number
});

const questionEvaluationSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  maxScore: Number,
  feedback: String,
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'problem-solving', 'coding']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// const interviewSessionSchema = new mongoose.Schema({
//   interviewId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Interview',
//     required: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   conversation: [conversationSchema],
//   codeSubmissions: [codeSubmissionSchema],
//   questionEvaluations: [questionEvaluationSchema],
//   currentQuestionIndex: {
//     type: Number,
//     default: 0
//   },
//   sessionStatus: {
//     type: String,
//     enum: ['active', 'paused', 'completed'],
//     default: 'active'
//   },
//   technicalScore: {
//     type: Number,
//     default: 0
//   },
//   communicationScore: {
//     type: Number,
//     default: 0
//   },
//   problemSolvingScore: {
//     type: Number,
//     default: 0
//   },
//   overallPerformance: {
//     type: String,
//     enum: ['excellent', 'good', 'average', 'needs-improvement'],
//   },
//   aiAnalysis: {
//     keyStrengths: [String],
//     areasForImprovement: [String],
//     detailedFeedback: String,
//     recommendedNextSteps: [String]
//   }
// }, {
//   timestamps: true
// });



const interviewSessionSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversation: [conversationSchema],
  codeSubmissions: [codeSubmissionSchema],
  questionEvaluations: [questionEvaluationSchema],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  sessionStatus: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  technicalScore: {
    type: Number,
    default: 0
  },
  communicationScore: {
    type: Number,
    default: 0
  },
  problemSolvingScore: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
    default: 0
  },
  overallPerformance: {
    type: String,
    enum: ['excellent', 'good', 'average', 'needs-improvement'],
  },
  feedback: {
    summary: {
      type: String,
      default: ''
    },
    strengths: {
      type: [String],
      default: []
    },
    improvements: {
      type: [String],
      default: []
    }
  },
  aiAnalysis: {
    keyStrengths: [String],
    areasForImprovement: [String],
    detailedFeedback: String,
    recommendedNextSteps: [String]
  }
}, {
  timestamps: true,
  versionKey: false  // Disable versioning to avoid conflicts
});

export default mongoose.model('InterviewSession', interviewSessionSchema);