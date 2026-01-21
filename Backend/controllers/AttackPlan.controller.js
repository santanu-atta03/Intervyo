import AttackPlan from "../models/AttackPlan.model.js";
import Interview from "../models/Interview.model.js";
import InterviewSession from "../models/InterviewSession.js";

/**
 * Attack Plan Controller
 * 
 * AI-powered weakness prediction and personalized improvement system
 */

class AttackPlanController {
  /**
   * Analyze user's interview history and generate attack plan
   * POST /api/attack-plan/analyze
   */
  async analyzeAndGeneratePlan(req, res) {
    try {
      const userId = req.user.id;
      const { targetCompany, targetDifficulty } = req.body;

      // Get completed interviews
      const interviews = await Interview.find({
        userId,
        status: "completed",
      })
        .sort({ completedAt: -1 })
        .limit(20); // Analyze last 20 interviews

      if (interviews.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Need at least 2 completed interviews to generate attack plan",
          data: {
            completedInterviews: interviews.length,
            required: 2,
          },
        });
      }

      // Analyze weaknesses
      const weaknesses = await this._analyzeWeaknesses(interviews);

      // Calculate readiness score
      const readinessScore = this._calculateReadinessScore(
        interviews,
        weaknesses
      );

      // Generate success probabilities
      const successProbability = this._predictSuccessProbability(
        readinessScore,
        weaknesses
      );

      // Generate attack plan phases
      const attackPlan = this._generateAttackPlan(weaknesses);

      // Generate micro-challenges
      const microChallenges = this._generateMicroChallenges(weaknesses);

      // Generate immediate actions
      const immediateActions = this._generateImmediateActions(weaknesses);

      // AI insights
      const aiInsights = this._generateAIInsights(interviews, weaknesses);

      // Peer comparison
      const peerComparison = await this._generatePeerComparison(
        userId,
        readinessScore
      );

      // Create attack plan
      const plan = await AttackPlan.createNewPlan(userId, {
        analysisDate: new Date(),
        interviewsAnalyzed: interviews.length,
        dataQuality: this._assessDataQuality(interviews.length),
        weaknesses,
        overallReadinessScore: readinessScore,
        criticalWeaknessCount: weaknesses.filter((w) => w.severity === "critical")
          .length,
        highWeaknessCount: weaknesses.filter((w) => w.severity === "high")
          .length,
        successProbability: {
          ...successProbability,
          targetCompany: targetCompany
            ? {
                company: targetCompany,
                probability: this._calculateCompanyProbability(
                  readinessScore,
                  targetDifficulty || "medium",
                  weaknesses
                ),
                reasoning: this._getCompanyReasons(targetCompany, weaknesses),
              }
            : null,
        },
        attackPlan,
        microChallenges,
        immediateActions,
        aiInsights,
        peerComparison,
        progress: {
          challengesCompleted: 0,
          challengesTotal: microChallenges.length,
          improvementScore: 0,
          lastUpdated: new Date(),
        },
        nextMilestone: {
          title: "Complete Phase 1",
          description: attackPlan.phase1.name,
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
          criteria: attackPlan.phase1.focus,
        },
      });

      res.json({
        success: true,
        message: "Attack plan generated successfully",
        data: {
          plan,
          summary: {
            readinessScore,
            criticalWeaknesses: weaknesses.filter((w) => w.severity === "critical")
              .length,
            interviewsAnalyzed: interviews.length,
            estimatedImprovementTime: this._estimateImprovementTime(weaknesses),
          },
        },
      });
    } catch (error) {
      console.error("Generate attack plan error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate attack plan",
        error: error.message,
      });
    }
  }

  /**
   * Get active attack plan
   * GET /api/attack-plan
   */
  async getActivePlan(req, res) {
    try {
      const userId = req.user.id;

      const plan = await AttackPlan.getActiveplan(userId);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "No active attack plan found. Generate one first.",
        });
      }

      // Check if expired
      if (plan.isExpired()) {
        plan.status = "expired";
        await plan.save();

        return res.status(404).json({
          success: false,
          message: "Attack plan expired. Generate a new one to see progress.",
        });
      }

      res.json({
        success: true,
        data: {
          plan,
          nextChallenge: plan.getNextChallenge(),
          completionPercentage: plan.completionPercentage,
        },
      });
    } catch (error) {
      console.error("Get attack plan error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get attack plan",
        error: error.message,
      });
    }
  }

  /**
   * Complete a micro-challenge
   * POST /api/attack-plan/challenge/:challengeId/complete
   */
  async completeChallenge(req, res) {
    try {
      const { challengeId } = req.params;
      const { success } = req.body;
      const userId = req.user.id;

      const plan = await AttackPlan.getActiveplan(userId);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "No active attack plan found",
        });
      }

      await plan.completeChallenge(challengeId, success !== false);

      const nextChallenge = plan.getNextChallenge();

      res.json({
        success: true,
        message: "Challenge completed!",
        data: {
          improvementScore: plan.progress.improvementScore,
          challengesCompleted: plan.progress.challengesCompleted,
          challengesTotal: plan.progress.challengesTotal,
          completionPercentage: plan.completionPercentage,
          nextChallenge,
        },
      });
    } catch (error) {
      console.error("Complete challenge error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to complete challenge",
        error: error.message,
      });
    }
  }

  /**
   * Get improvement trend
   * GET /api/attack-plan/trend
   */
  async getImprovementTrend(req, res) {
    try {
      const userId = req.user.id;

      const trend = await AttackPlan.getImprovementTrend(userId);
      const plans = await AttackPlan.find({ userId })
        .sort({ analysisDate: -1 })
        .limit(5)
        .select("overallReadinessScore analysisDate progress");

      res.json({
        success: true,
        data: {
          trend,
          history: plans,
        },
      });
    } catch (error) {
      console.error("Get trend error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get improvement trend",
        error: error.message,
      });
    }
  }

  /**
   * Predict success for specific company
   * POST /api/attack-plan/predict
   */
  async predictSuccess(req, res) {
    try {
      const { company, difficulty } = req.body;
      const userId = req.user.id;

      if (!company || !difficulty) {
        return res.status(400).json({
          success: false,
          message: "Company and difficulty are required",
        });
      }

      const prediction = await AttackPlan.predictSuccessForCompany(
        userId,
        company,
        difficulty
      );

      res.json({
        success: true,
        data: prediction,
      });
    } catch (error) {
      console.error("Predict success error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to predict success",
        error: error.message,
      });
    }
  }

  /**
   * Get all challenges
   * GET /api/attack-plan/challenges
   */
  async getAllChallenges(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query; // "completed", "pending", "all"

      const plan = await AttackPlan.getActiveplan(userId);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "No active attack plan found",
        });
      }

      let challenges = plan.microChallenges;

      if (status === "completed") {
        challenges = challenges.filter((c) => c.isCompleted);
      } else if (status === "pending") {
        challenges = challenges.filter((c) => !c.isCompleted);
      }

      res.json({
        success: true,
        data: {
          challenges,
          stats: {
            total: plan.microChallenges.length,
            completed: plan.progress.challengesCompleted,
            pending: plan.microChallenges.filter((c) => !c.isCompleted).length,
          },
        },
      });
    } catch (error) {
      console.error("Get challenges error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get challenges",
        error: error.message,
      });
    }
  }

  // ============================================
  // PRIVATE HELPER METHODS
  // ============================================

  /**
   * Analyze weaknesses from interview history
   */
  async _analyzeWeaknesses(interviews) {
    const categoryScores = {};
    const categoryData = {};

    // Aggregate scores by category
    interviews.forEach((interview) => {
      const scores = interview.performance?.categoryScores || {};
      Object.entries(scores).forEach(([category, score]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = [];
          categoryData[category] = {
            lastOccurrence: interview.completedAt,
            interviews: [],
          };
        }
        categoryScores[category].push(score);
        categoryData[category].interviews.push(interview._id);
      });
    });

    // Analyze each category
    const weaknesses = [];

    Object.entries(categoryScores).forEach(([category, scores]) => {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);

      // Determine trend
      const recentScores = scores.slice(0, 3);
      const olderScores = scores.slice(3);
      const recentAvg =
        recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const olderAvg =
        olderScores.length > 0
          ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
          : recentAvg;

      let trend = "stagnant";
      if (recentAvg > olderAvg + 1) trend = "improving";
      else if (recentAvg < olderAvg - 1) trend = "declining";

      // Determine severity
      let severity = "low";
      if (avgScore < 4) severity = "critical";
      else if (avgScore < 6) severity = "high";
      else if (avgScore < 7.5) severity = "medium";

      // Only include if it's actually a weakness
      if (avgScore < 7.5) {
        weaknesses.push({
          category,
          severity,
          confidenceScore: Math.min(100, scores.length * 20), // More data = higher confidence
          evidenceCount: scores.length,
          averageScore: Math.round(avgScore * 10) / 10,
          trend,
          lastOccurrence: categoryData[category].lastOccurrence,
          specificIssues: this._identifySpecificIssues(category, avgScore),
          recommendations: this._generateRecommendations(category, avgScore),
        });
      }
    });

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    weaknesses.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return weaknesses;
  }

  /**
   * Identify specific issues in a category
   */
  _identifySpecificIssues(category, avgScore) {
    const issueMap = {
      technical: [
        { issue: "Shallow understanding of core concepts", frequency: 8, impact: "high" },
        { issue: "Missing advanced topics knowledge", frequency: 6, impact: "medium" },
      ],
      communication: [
        { issue: "Unclear explanation of technical concepts", frequency: 7, impact: "high" },
        { issue: "Too much jargon without context", frequency: 5, impact: "medium" },
      ],
      problemSolving: [
        { issue: "Jumping to solution without analysis", frequency: 8, impact: "high" },
        { issue: "Missing edge cases", frequency: 6, impact: "medium" },
      ],
    };

    return issueMap[category] || [];
  }

  /**
   * Generate recommendations for a weakness
   */
  _generateRecommendations(category, avgScore) {
    const recommendationMap = {
      technical: [
        "Complete 5 technical deep-dive sessions on core concepts",
        "Practice explaining concepts in simple terms",
        "Review fundamentals daily for 30 minutes",
      ],
      communication: [
        "Practice the STAR method for behavioral answers",
        "Record yourself answering questions and review",
        "Join a public speaking group or Toastmasters",
      ],
      problemSolving: [
        "Solve 3 LeetCode problems daily (Easy→Medium→Hard)",
        "Practice thinking out loud while solving",
        "Focus on edge case identification",
      ],
    };

    return recommendationMap[category] || ["Practice this category more"];
  }

  /**
   * Calculate overall readiness score
   */
  _calculateReadinessScore(interviews, weaknesses) {
    // Base score from recent interviews
    const recentInterviews = interviews.slice(0, 5);
    const avgScore =
      recentInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) /
      recentInterviews.length;

    // Penalty for weaknesses
    const criticalPenalty = weaknesses.filter((w) => w.severity === "critical")
      .length * 15;
    const highPenalty = weaknesses.filter((w) => w.severity === "high").length * 8;

    const readinessScore = Math.max(0, Math.min(100, avgScore - criticalPenalty - highPenalty));

    return Math.round(readinessScore);
  }

  /**
   * Predict success probability for different difficulties
   */
  _predictSuccessProbability(readinessScore, weaknesses) {
    const criticalCount = weaknesses.filter((w) => w.severity === "critical").length;

    return {
      easy: Math.min(100, readinessScore + 20 - criticalCount * 5),
      medium: readinessScore - criticalCount * 7,
      hard: Math.max(0, readinessScore - 20 - criticalCount * 10),
    };
  }

  /**
   * Generate attack plan phases
   */
  _generateAttackPlan(weaknesses) {
    const critical = weaknesses.filter((w) => w.severity === "critical");
    const high = weaknesses.filter((w) => w.severity === "high");
    const medium = weaknesses.filter((w) => w.severity === "medium");

    return {
      phase1: {
        name: "Emergency Fixes - Critical Weaknesses",
        duration: "1 week",
        focus: critical.map((w) => w.category),
        targetWeaknesses: critical.map((w) => w.category),
        expectedImprovement: 25,
      },
      phase2: {
        name: "Strengthening Core - High Priority",
        duration: "2 weeks",
        focus: high.map((w) => w.category),
        targetWeaknesses: high.map((w) => w.category),
        expectedImprovement: 20,
      },
      phase3: {
        name: "Polish & Perfect - Medium Priority",
        duration: "1 week",
        focus: medium.map((w) => w.category),
        targetWeaknesses: medium.map((w) => w.category),
        expectedImprovement: 15,
      },
    };
  }

  /**
   * Generate micro-challenges targeting weaknesses
   */
  _generateMicroChallenges(weaknesses) {
    const challenges = [];
    let challengeCounter = 1;

    weaknesses.forEach((weakness) => {
      const categoryMap = {
        technical: [
          {
            title: "Explain 3 core concepts in simple terms",
            description:
              "Choose 3 technical concepts you struggle with. Explain each in under 2 minutes to a non-technical person.",
            difficulty: "medium",
            estimatedTime: 30,
            completionCriteria: "Can explain clearly without jargon",
          },
          {
            title: "Deep-dive technical documentation",
            description:
              "Read official documentation for 1 hour on your weakest technical area. Take notes.",
            difficulty: "easy",
            estimatedTime: 60,
            completionCriteria: "Complete notes and understand 80%+ of content",
          },
        ],
        communication: [
          {
            title: "Practice STAR method responses",
            description:
              "Write 5 behavioral answers using STAR method. Record yourself delivering them.",
            difficulty: "medium",
            estimatedTime: 45,
            completionCriteria: "Clear structure, concise, under 2 min each",
          },
        ],
        problemSolving: [
          {
            title: "Think-aloud problem solving",
            description:
              "Solve 3 medium LeetCode problems while explaining your thought process aloud. Record it.",
            difficulty: "hard",
            estimatedTime: 90,
            completionCriteria: "Verbalize approach before coding, consider edge cases",
          },
        ],
      };

      const categoryKey = Object.keys(categoryMap).find((k) =>
        weakness.category.includes(k)
      );
      const templates = categoryMap[categoryKey] || [];

      templates.forEach((template) => {
        challenges.push({
          challengeId: `challenge-${challengeCounter++}`,
          weaknessCategory: weakness.category,
          ...template,
          targetSkills: [weakness.category],
          isCompleted: false,
          attempts: 0,
          successRate: 0,
        });
      });
    });

    return challenges.slice(0, 15); // Max 15 challenges
  }

  /**
   * Generate immediate priority actions
   */
  _generateImmediateActions(weaknesses) {
    const critical = weaknesses.filter((w) => w.severity === "critical");
    const actions = [];

    critical.forEach((weakness, index) => {
      actions.push({
        priority: index + 1,
        action: `Start daily practice on ${weakness.category}`,
        reasoning: `This is a critical weakness (avg score: ${weakness.averageScore}/10) appearing in ${weakness.evidenceCount} interviews`,
        estimatedImpact: "high",
      });
    });

    // Add general actions
    if (critical.length > 0) {
      actions.push({
        priority: actions.length + 1,
        action: "Schedule daily 30-min focused practice sessions",
        reasoning: "Consistency is key to rapid improvement",
        estimatedImpact: "high",
      });
    }

    return actions;
  }

  /**
   * Generate AI insights
   */
  _generateAIInsights(interviews, weaknesses) {
    // Analyze patterns
    const allScores = interviews.flatMap((i) =>
      Object.entries(i.performance?.categoryScores || {})
    );
    const highScores = allScores.filter(([_, score]) => score >= 8);
    const lowScores = allScores.filter(([_, score]) => score < 6);

    return {
      strengths: [...new Set(highScores.map(([cat]) => cat))].slice(0, 3),
      hiddenStrengths: ["Consistency in practice", "Willingness to learn"],
      blindSpots: [...new Set(lowScores.map(([cat]) => cat))].slice(0, 3),
      quickWins: [
        "Focus on communication - easiest to improve in 1 week",
        "Practice mock interviews daily",
      ],
      longTermGoals: [
        "Master system design",
        "Become confident in all interview formats",
      ],
    };
  }

  /**
   * Generate peer comparison
   */
  async _generatePeerComparison(userId, readinessScore) {
    // In real implementation, compare with other users
    // For now, return mock data
    return {
      userPercentile: Math.min(95, readinessScore + 10),
      commonWeaknesses: ["system-design", "coding-efficiency"],
      uniqueStrengths: ["problem-solving-speed"],
      averageImprovementTime: "3-4 weeks with consistent practice",
    };
  }

  /**
   * Calculate success probability for specific company
   */
  _calculateCompanyProbability(readinessScore, difficulty, weaknesses) {
    const difficultyMultiplier = { easy: 1.2, medium: 1.0, hard: 0.7 };
    const criticalPenalty =
      weaknesses.filter((w) => w.severity === "critical").length * 8;

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          readinessScore * difficultyMultiplier[difficulty] - criticalPenalty
        )
      )
    );
  }

  /**
   * Get reasoning for company-specific prediction
   */
  _getCompanyReasons(company, weaknesses) {
    const critical = weaknesses.filter((w) => w.severity === "critical");
    const reasons = [];

    if (critical.length > 0) {
      reasons.push(
        `Critical weaknesses detected: ${critical.map((w) => w.category).join(", ")}`
      );
    } else {
      reasons.push("No critical weaknesses - good foundation");
    }

    reasons.push(
      "Complete attack plan to increase probability by 20-30%"
    );

    return reasons;
  }

  /**
   * Assess data quality based on interview count
   */
  _assessDataQuality(count) {
    if (count >= 15) return "excellent";
    if (count >= 10) return "good";
    if (count >= 5) return "fair";
    return "limited";
  }

  /**
   * Estimate time needed for improvement
   */
  _estimateImprovementTime(weaknesses) {
    const critical = weaknesses.filter((w) => w.severity === "critical").length;
    const high = weaknesses.filter((w) => w.severity === "high").length;

    if (critical > 2) return "4-6 weeks with daily practice";
    if (critical > 0 || high > 3) return "3-4 weeks with consistent effort";
    return "1-2 weeks with focused practice";
  }
}

export default new AttackPlanController();
