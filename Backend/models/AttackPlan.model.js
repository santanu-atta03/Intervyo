import mongoose from "mongoose";

/**
 * Weakness Predictor Model
 * 
 * AI-powered system that:
 * - Analyzes historical interview performance
 * - Predicts weak areas before upcoming interviews
 * - Generates personalized "attack plans" to overcome weaknesses
 * - Tracks improvement through micro-challenges
 * - Provides success probability scores for different scenarios
 */

const microChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true,
  },
  weaknessCategory: {
    type: String,
    required: true,
    enum: [
      "technical-depth",
      "system-design",
      "coding-efficiency",
      "communication-clarity",
      "problem-solving-speed",
      "behavioral-responses",
      "confidence-under-pressure",
      "code-quality",
      "edge-case-handling",
      "time-management",
    ],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  estimatedTime: {
    type: Number, // in minutes
    required: true,
  },
  targetSkills: [String],
  completionCriteria: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
  attempts: {
    type: Number,
    default: 0,
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

const weaknessPredictionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["critical", "high", "medium", "low"],
    required: true,
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    description: "How confident the system is about this weakness (0-100)",
  },
  evidenceCount: {
    type: Number,
    required: true,
    description: "Number of interviews showing this pattern",
  },
  averageScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    description: "Average score in this category across interviews",
  },
  trend: {
    type: String,
    enum: ["improving", "declining", "stagnant"],
    required: true,
  },
  lastOccurrence: {
    type: Date,
    required: true,
  },
  specificIssues: [
    {
      issue: String,
      frequency: Number,
      impact: String, // "high", "medium", "low"
    },
  ],
  recommendations: [String],
});

const attackPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Analysis Metadata
    analysisDate: {
      type: Date,
      default: Date.now,
    },
    interviewsAnalyzed: {
      type: Number,
      required: true,
      min: 1,
    },
    dataQuality: {
      type: String,
      enum: ["excellent", "good", "fair", "limited"],
      required: true,
    },

    // Predicted Weaknesses
    weaknesses: [weaknessPredictionSchema],

    // Overall Assessment
    overallReadinessScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      description: "Overall interview readiness (0-100)",
    },
    criticalWeaknessCount: {
      type: Number,
      default: 0,
    },
    highWeaknessCount: {
      type: Number,
      default: 0,
    },

    // Success Probability Predictions
    successProbability: {
      easy: {
        type: Number,
        min: 0,
        max: 100,
      },
      medium: {
        type: Number,
        min: 0,
        max: 100,
      },
      hard: {
        type: Number,
        min: 0,
        max: 100,
      },
      targetCompany: {
        company: String,
        probability: Number,
        reasoning: [String],
      },
    },

    // Personalized Attack Plan
    attackPlan: {
      phase1: {
        name: String,
        duration: String, // "1 week", "3 days", etc.
        focus: [String],
        targetWeaknesses: [String],
        expectedImprovement: Number, // percentage
      },
      phase2: {
        name: String,
        duration: String,
        focus: [String],
        targetWeaknesses: [String],
        expectedImprovement: Number,
      },
      phase3: {
        name: String,
        duration: String,
        focus: [String],
        targetWeaknesses: [String],
        expectedImprovement: Number,
      },
    },

    // Micro-Challenges (Targeted Practice)
    microChallenges: [microChallengeSchema],

    // Priority Actions
    immediateActions: [
      {
        priority: Number,
        action: String,
        reasoning: String,
        estimatedImpact: String, // "high", "medium", "low"
      },
    ],

    // Progress Tracking
    progress: {
      challengesCompleted: {
        type: Number,
        default: 0,
      },
      challengesTotal: {
        type: Number,
        default: 0,
      },
      improvementScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      lastUpdated: Date,
    },

    // Next Steps
    nextMilestone: {
      title: String,
      description: String,
      targetDate: Date,
      criteria: [String],
    },

    // AI Insights
    aiInsights: {
      strengths: [String],
      hiddenStrengths: [String], // Strengths user might not be aware of
      blindSpots: [String], // Areas user thinks they're good at but aren't
      quickWins: [String], // Easy improvements with high impact
      longTermGoals: [String],
    },

    // Comparison with Peers
    peerComparison: {
      userPercentile: Number,
      commonWeaknesses: [String],
      uniqueStrengths: [String],
      averageImprovementTime: String,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "completed", "expired", "superseded"],
      default: "active",
    },
    expiresAt: {
      type: Date,
      description: "Attack plan expires after 30 days or new analysis",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
attackPlanSchema.index({ userId: 1, status: 1 });
attackPlanSchema.index({ status: 1, expiresAt: 1 });
attackPlanSchema.index({ analysisDate: -1 });

// Virtual: Active weaknesses count
attackPlanSchema.virtual("activeWeaknessCount").get(function () {
  return this.weaknesses?.length || 0;
});

// Virtual: Plan completion percentage
attackPlanSchema.virtual("completionPercentage").get(function () {
  if (this.progress.challengesTotal === 0) return 0;
  return Math.round(
    (this.progress.challengesCompleted / this.progress.challengesTotal) * 100
  );
});

// Methods

/**
 * Mark a micro-challenge as completed
 */
attackPlanSchema.methods.completeChallenge = function (challengeId, success) {
  const challenge = this.microChallenges.find(
    (c) => c.challengeId === challengeId
  );

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.isCompleted) {
    throw new Error("Challenge already completed");
  }

  challenge.isCompleted = true;
  challenge.completedAt = new Date();
  challenge.attempts += 1;
  
  if (success) {
    challenge.successRate = Math.min(
      100,
      challenge.successRate + (100 / challenge.attempts)
    );
  }

  this.progress.challengesCompleted += 1;
  this.progress.lastUpdated = new Date();

  // Recalculate improvement score
  this.progress.improvementScore = this.calculateImprovementScore();

  return this.save();
};

/**
 * Calculate overall improvement score
 */
attackPlanSchema.methods.calculateImprovementScore = function () {
  const completedChallenges = this.microChallenges.filter((c) => c.isCompleted);
  
  if (completedChallenges.length === 0) return 0;

  const avgSuccessRate =
    completedChallenges.reduce((sum, c) => sum + c.successRate, 0) /
    completedChallenges.length;

  const completionBonus =
    (this.progress.challengesCompleted / this.progress.challengesTotal) * 20;

  return Math.min(100, Math.round(avgSuccessRate * 0.8 + completionBonus));
};

/**
 * Get next recommended challenge
 */
attackPlanSchema.methods.getNextChallenge = function () {
  // Find incomplete challenges for critical weaknesses first
  const criticalWeaknesses = this.weaknesses
    .filter((w) => w.severity === "critical")
    .map((w) => w.category);

  let nextChallenge = this.microChallenges.find(
    (c) =>
      !c.isCompleted &&
      criticalWeaknesses.includes(c.weaknessCategory)
  );

  // If no critical challenges, get any incomplete
  if (!nextChallenge) {
    nextChallenge = this.microChallenges.find((c) => !c.isCompleted);
  }

  return nextChallenge;
};

/**
 * Check if plan is expired
 */
attackPlanSchema.methods.isExpired = function () {
  return this.expiresAt && new Date() > this.expiresAt;
};

/**
 * Update progress after new interview
 */
attackPlanSchema.methods.updateProgressFromInterview = function (
  interviewResults
) {
  // Compare results with predicted weaknesses
  this.weaknesses.forEach((weakness) => {
    const categoryScore = interviewResults.categoryScores?.[weakness.category];
    
    if (categoryScore !== undefined) {
      // Check if user improved in this area
      if (categoryScore > weakness.averageScore) {
        weakness.trend = "improving";
      } else if (categoryScore < weakness.averageScore) {
        weakness.trend = "declining";
      }
    }
  });

  this.progress.lastUpdated = new Date();
  return this.save();
};

// Static Methods

/**
 * Get active attack plan for user
 */
attackPlanSchema.statics.getActiveplan = async function (userId) {
  return this.findOne({
    userId,
    status: "active",
    $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
  }).sort({ analysisDate: -1 });
};

/**
 * Create new attack plan (marks old ones as superseded)
 */
attackPlanSchema.statics.createNewPlan = async function (userId, planData) {
  // Mark existing active plans as superseded
  await this.updateMany(
    { userId, status: "active" },
    { status: "superseded" }
  );

  // Create new plan with 30-day expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return this.create({
    userId,
    ...planData,
    status: "active",
    expiresAt,
  });
};

/**
 * Get user's improvement trend
 */
attackPlanSchema.statics.getImprovementTrend = async function (userId) {
  const plans = await this.find({ userId })
    .sort({ analysisDate: -1 })
    .limit(5)
    .select("overallReadinessScore analysisDate weaknesses");

  if (plans.length < 2) return "insufficient-data";

  const scores = plans.map((p) => p.overallReadinessScore);
  const avgChange =
    (scores[0] - scores[scores.length - 1]) / (scores.length - 1);

  if (avgChange > 5) return "improving";
  if (avgChange < -5) return "declining";
  return "stable";
};

/**
 * Calculate success probability for specific company
 */
attackPlanSchema.statics.predictSuccessForCompany = async function (
  userId,
  company,
  difficulty
) {
  const plan = await this.getActiveplan(userId);
  
  if (!plan) {
    return {
      probability: 50,
      confidence: "low",
      reasoning: ["Insufficient data for accurate prediction"],
    };
  }

  // Base probability on readiness score
  let baseProbability = plan.overallReadinessScore;

  // Adjust for difficulty
  const difficultyMultiplier = {
    easy: 1.2,
    medium: 1.0,
    hard: 0.7,
  };
  
  baseProbability *= difficultyMultiplier[difficulty] || 1.0;

  // Penalize for critical weaknesses
  const penalty = plan.criticalWeaknessCount * 5;
  baseProbability -= penalty;

  return {
    probability: Math.max(0, Math.min(100, Math.round(baseProbability))),
    confidence: plan.dataQuality === "excellent" ? "high" : "medium",
    reasoning: [
      `Readiness score: ${plan.overallReadinessScore}/100`,
      `Critical weaknesses: ${plan.criticalWeaknessCount}`,
      `Trend: ${plan.weaknesses[0]?.trend || "unknown"}`,
    ],
  };
};

const AttackPlan = mongoose.model("AttackPlan", attackPlanSchema);

export default AttackPlan;
