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

// const questionEvaluationSchema = new mongoose.Schema({
//   question: String,
//   answer: String,
//   score: Number,
//   maxScore: Number,
//   feedback: String,
//   category: {
//     type: String,
//     enum: ['technical', 'behavioral', 'problem-solving', 'coding']
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// });

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


const questionEvaluationSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  expectedAnswer: String, // Optional: store what was expected
  userAnswer: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'coding', 'general', 'problem-solving'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Additional fields for detailed analysis
  strengths: [String],
  improvements: [String],
  codeSubmitted: String, // For coding questions
  timeSpent: Number // in seconds
});

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
  sessionStatus: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  
  // Conversation history
  conversation: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system']
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['greeting', 'question', 'answer','code-review','closing', 'feedback', 'transition']
    }
  }],
  
  // CRITICAL: Store all question evaluations
  questionEvaluations: [questionEvaluationSchema],
  
  // Overall scores (0-10 scale)
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  technicalScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  communicationScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  problemSolvingScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  
  // Detailed feedback structure
  feedback: {
    summary: String,
    strengths: [String],
    improvements: [String],
    keyHighlights: [String],
    areasOfConcern: [String],
    
    // Technical analysis
    technicalAnalysis: {
      coreConcepts: String,
      problemSolvingApproach: String,
      codeQuality: String,
      bestPractices: String
    },
    
    // Behavioral analysis
    behavioralAnalysis: {
      communication: String,
      confidence: String,
      professionalism: String,
      adaptability: String
    }
  },
  
  // Statistics
  stats: {
    totalQuestions: { type: Number, default: 0 },
    questionsAnswered: { type: Number, default: 0 },
    questionsSkipped: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.model('InterviewSession', interviewSessionSchema);