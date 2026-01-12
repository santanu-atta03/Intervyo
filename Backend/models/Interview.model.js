// models/Interview.model.js
import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  config: {
    domain: { type: String, required: true },
    subDomain: { type: String, required: true },
    interviewType: {
      type: String,
      enum: ["behavioral", "technical", "system-design", "coding"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    duration: { type: Number, default: 30 },
    targetCompany: { type: String },
    customQuestions: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "abandoned"],
    default: "pending",
  },
  rounds: [
    {
      roundNumber: Number,
      roundType: String,
      questions: [
        {
          questionId: String,
          question: String,
          type: {
            type: String,
            enum: ["behavioral", "technical", "system-design", "coding"],
            required: true, // Make it required
          },
          difficulty: String,
          expectedAnswer: String,
          hints: [String],
          tags: [String],
          evaluationCriteria: [String],
          metadata: {
            timeLimit: Number,
            maxHints: Number,
            skippable: Boolean,
          },
        },
      ],
      answers: [
        {
          questionId: String,
          answer: String,
          timeTaken: Number,
          hintsUsed: Number,
          skipped: Boolean,
          evaluation: {
            score: Number,
            feedback: String,
            strengths: [String],
            improvements: [String],
            technicalAccuracy: Number,
            clarity: Number,
            completeness: Number,
            categoryScores: {
              accuracy: Number,
              clarity: Number,
              completeness: Number,
              depth: Number,
            },
            isComplete: Boolean,
            missingPoints: [String],
            needsFollowUp: Boolean,
            weightedScore: Number,
            metadata: mongoose.Schema.Types.Mixed,
          },
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  videoRecording: {
    url: String,
    duration: Number,
    uploaded: { type: Boolean, default: false },
  },
  metrics: {
    confidence: [
      {
        timestamp: Number,
        value: Number,
      },
    ],
    emotionTimeline: [
      {
        timestamp: Number,
        emotions: {
          neutral: Number,
          happy: Number,
          confident: Number,
          nervous: Number,
          confused: Number,
        },
      },
    ],
    conversationHistory: [
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: {
      type: { type: String }, // 'text', 'code', 'code_review', 'diagram'
      language: String,
      code: String,
      evaluation: mongoose.Schema.Types.Mixed
    }
  }
],
    speechMetrics: {
      averagePace: Number,
      fillerWords: Number,
      pauseCount: Number,
      clarity: Number,
    },
    eyeContact: {
      percentage: Number,
      timeline: [
        {
          timestamp: Number,
          looking: Boolean,
        },
      ],
    },
  },
  performance: {
    overallScore: { type: Number, default: 0, min: 0, max: 100 },
    categoryScores: {
      technical: { type: Number, default: 0, min: 0, max: 100 },
      communication: { type: Number, default: 0, min: 0, max: 100 },
      problemSolving: { type: Number, default: 0, min: 0, max: 100 },
      confidence: { type: Number, default: 0, min: 0, max: 100 },
    },
    percentile: { type: Number, default: 0, min: 0, max: 100 },
    totalQuestions: { type: Number, default: 0 },
    questionsAnswered: { type: Number, default: 0 },
    questionsSkipped: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
  },
  aiAnalysis: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    studyPlan: [
      {
        topic: String,
        resources: [String],
        priority: String,
        estimatedHours: Number,
      },
    ],
    companyFit: [
      {
        company: String,
        matchScore: Number,
        reasons: [String],
      },
    ],
    overallAssessment: String,
  },
   results: {
    summary: {
      overallScore: { type: Number, default: 0, min: 0, max: 100 },
      grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'], default: 'F' },
      percentile: { type: Number, default: 0, min: 0, max: 100 },
      passed: { type: Boolean, default: false },
      totalQuestions: { type: Number, default: 0 },
      questionsAnswered: { type: Number, default: 0 },
      questionsSkipped: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      partialAnswers: { type: Number, default: 0 },
      incorrectAnswers: { type: Number, default: 0 },
      averageTimePerQuestion: { type: Number, default: 0 },
      totalHintsUsed: { type: Number, default: 0 }
    },
    
    categoryBreakdown: {
      technical: {
        score: { type: Number, default: 0, min: 0, max: 100 },
        questionsAnswered: { type: Number, default: 0 },
        strengths: [String],
        weaknesses: [String]
      },
      communication: {
        score: { type: Number, default: 0, min: 0, max: 100 },
        clarity: { type: Number, default: 0 },
        articulation: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 }
      },
      problemSolving: {
        score: { type: Number, default: 0, min: 0, max: 100 },
        analyticalThinking: { type: Number, default: 0 },
        creativity: { type: Number, default: 0 },
        efficiency: { type: Number, default: 0 }
      }
    },
    
    detailedFeedback: {
      overallAssessment: { type: String, default: '' },
      strengths: [String],
      weaknesses: [String],
      keyHighlights: [String],
      areasOfConcern: [String],
      
      technicalAnalysis: {
        coreConcepts: { type: String, default: '' },
        problemSolvingApproach: { type: String, default: '' },
        codeQuality: { type: String, default: '' },
        bestPractices: { type: String, default: '' }
      },
      
      behavioralAnalysis: {
        communication: { type: String, default: '' },
        confidence: { type: String, default: '' },
        professionalism: { type: String, default: '' },
        adaptability: { type: String, default: '' }
      }
    },
    
    improvementPlan: {
      shortTerm: [
        {
          title: String,
          description: String,
          priority: { type: String, enum: ['high', 'medium', 'low'] },
          estimatedTime: String,
          resources: [String]
        }
      ],
      
      mediumTerm: [
        {
          title: String,
          description: String,
          priority: { type: String, enum: ['high', 'medium', 'low'] },
          estimatedTime: String,
          resources: [String]
        }
      ],
      
      longTerm: [
        {
          title: String,
          description: String,
          priority: { type: String, enum: ['high', 'medium', 'low'] },
          estimatedTime: String,
          resources: [String]
        }
      ],
      
      recommendedCourses: [
        {
          title: String,
          platform: String,
          url: String,
          duration: String,
          level: String
        }
      ],
      
      practiceResources: [
        {
          title: String,
          type: String,
          url: String,
          description: String
        }
      ]
    },
    
    comparisonData: {
      averageScore: { type: Number, default: 0 },
      topPercentile: { type: Number, default: 0 },
      yourRank: { type: Number, default: 0 },
      totalCandidates: { type: Number, default: 0 },
      betterThan: { type: Number, default: 0 }
    },
    
    questionAnalysis: [
      {
        questionId: String,
        question: String,
        yourAnswer: String,
        score: Number,
        maxScore: Number,
        timeTaken: Number,
        hintsUsed: Number,
        feedback: String,
        strengths: [String],
        improvements: [String],
        modelAnswer: String,
        tags: [String]
      }
    ],
    
    timeline: [
      {
        timestamp: Date,
        event: String,
        description: String,
        score: Number
      }
    ],
    
    certificateData: {
      certificateId: String,
      issuedAt: Date,
      validUntil: Date,
      shareableLink: String,
      verificationCode: String
    }
  },
  startTime: Date,
  endTime: Date,
  totalDuration: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamps on save
InterviewSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
InterviewSchema.index({ userId: 1, status: 1 });
InterviewSchema.index({ createdAt: -1 });
InterviewSchema.index({ "performance.overallScore": -1 });

const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);

export default Interview;


