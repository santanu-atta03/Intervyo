import Interview from "../models/Interview.model.js";
import User from "../models/User.model.js";

// Get comprehensive analytics for a user
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const timeRangeDays = Number.parseInt(req.query.timeRange || "30", 10);
    if (!Number.isInteger(timeRangeDays) || timeRangeDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "timeRange must be a positive number of days",
      });
    }

    const user = await User.findById(userId).lean();
    const gamification = user?.stats || {
      xpPoints: 0,
      level: 1,
      streak: 0,
      totalInterviews: 0,
    };

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - timeRangeDays);

    // Completed interviews are timestamped with endTime in the current schema.
    // Include legacy completedAt documents and createdAt as a fallback.
    const interviewsRaw = await Interview.find({
      userId,
      status: "completed",
      $or: [
        { endTime: { $gte: dateFilter } },
        { completedAt: { $gte: dateFilter } },
        { endTime: null, completedAt: null, createdAt: { $gte: dateFilter } },
      ],
    })
      .sort({ endTime: -1, completedAt: -1, createdAt: -1 })
      .lean();

    const interviews = interviewsRaw.map(normalizeInterview);

    // Calculate performance trends
    const performanceTrend = interviews.map((interview) => ({
      date: interview.analyticsDate,
      score: interview.analyticsScores.overall,
      domain: interview.config?.domain || "General",
      difficulty: interview.config?.difficulty || "medium",
    }));

    // Calculate category averages
    const categoryScores = {
      technical: interviews.map(
        (interview) => interview.analyticsScores.technical,
      ),
      communication: interviews.map(
        (interview) => interview.analyticsScores.communication,
      ),
      problemSolving: interviews.map(
        (interview) => interview.analyticsScores.problemSolving,
      ),
      confidence: interviews.map(
        (interview) => interview.analyticsScores.confidence,
      ),
    };

    const avgCategoryScores = {
      technical: average(categoryScores.technical),
      communication: average(categoryScores.communication),
      problemSolving: average(categoryScores.problemSolving),
      confidence: average(categoryScores.confidence),
    };

    // Domain breakdown
    const domainStats = {};
    interviews.forEach((interview) => {
      const domain = interview.config?.domain || "General";
      if (!domainStats[domain]) {
        domainStats[domain] = { count: 0, totalScore: 0, scores: [] };
      }
      domainStats[domain].count++;
      domainStats[domain].totalScore += interview.analyticsScores.overall;
      domainStats[domain].scores.push(interview.analyticsScores.overall);
    });

    const domainBreakdown = Object.entries(domainStats).map(
      ([domain, stats]) => ({
        domain,
        count: stats.count,
        avgScore: Math.round(stats.totalScore / stats.count),
        trend: calculateTrend(stats.scores),
      }),
    );

    // Difficulty distribution
    const difficultyStats = { easy: 0, medium: 0, hard: 0 };
    interviews.forEach((interview) => {
      const diff = interview.config?.difficulty || "medium";
      if (Object.prototype.hasOwnProperty.call(difficultyStats, diff)) {
        difficultyStats[diff]++;
      }
    });

    // Weekly activity
    const weeklyActivity = getWeeklyActivity(interviews);

    // Strengths and weaknesses
    const strengths = [];
    const weaknesses = [];

    Object.entries(avgCategoryScores).forEach(([category, score]) => {
      if (score >= 70) strengths.push({ category, score });
      else if (score < 50 && score > 0) weaknesses.push({ category, score });
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalInterviews: interviews.length,
          avgScore: average(interviews.map((i) => i.analyticsScores.overall)),
          bestScore: Math.max(
            ...interviews.map((i) => i.analyticsScores.overall),
            0,
          ),
          totalTime: interviews.reduce(
            (sum, i) => sum + i.analyticsDuration,
            0,
          ),
        },
        gamification,
        performanceTrend,
        categoryScores: avgCategoryScores,
        domainBreakdown,
        difficultyDistribution: difficultyStats,
        weeklyActivity,
        strengths: strengths.sort((a, b) => b.score - a.score),
        weaknesses: weaknesses.sort((a, b) => a.score - b.score),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

// Get skill radar data
export const getSkillRadar = async (req, res) => {
  try {
    const userId = req.user.id;

    const interviewsRaw = await Interview.find({ userId, status: "completed" })
      .sort({ endTime: -1, completedAt: -1, createdAt: -1 })
      .limit(20)
      .lean();
    const interviews = interviewsRaw.map(normalizeInterview);

    const skills = {
      "Technical Knowledge": [],
      Communication: [],
      "Problem Solving": [],
      "Code Quality": [],
      "System Design": [],
      Behavioral: [],
    };

    interviews.forEach((interview) => {
      const scores = interview.analyticsScores;
      const type = interview.config?.interviewType || interview.type;

      if (scores.technical > 0)
        skills["Technical Knowledge"].push(scores.technical);
      if (scores.communication > 0)
        skills["Communication"].push(scores.communication);
      if (scores.problemSolving > 0)
        skills["Problem Solving"].push(scores.problemSolving);

      if (type === "coding")
        skills["Code Quality"].push(scores.overall);
      if (type === "system-design")
        skills["System Design"].push(scores.overall);
      if (type === "behavioral")
        skills["Behavioral"].push(scores.overall);
    });

    const radarData = Object.entries(skills).map(([skill, scores]) => ({
      skill,
      score: scores.length > 0 ? Math.round(average(scores)) : 0,
      fullMark: 100,
    }));

    res.json({ success: true, data: radarData });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch skill data",
      error: error.message,
    });
  }
};

// Helper functions
function average(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function firstAvailableScore(...values) {
  const numericValues = values.filter(
    (value) => typeof value === "number" && Number.isFinite(value),
  );
  return numericValues.find((value) => value > 0) ?? numericValues[0] ?? 0;
}

function normalizeInterview(interview) {
  const categories = interview.performance?.categoryScores || {};
  const resultCategories = interview.results?.categoryBreakdown || {};
  const overall = firstAvailableScore(
    interview.performance?.overallScore,
    interview.results?.summary?.overallScore,
    interview.overallScore,
  );

  return {
    ...interview,
    config: interview.config || {
      domain: interview.role || "General",
      difficulty: interview.difficulty || "medium",
      interviewType: interview.type,
    },
    analyticsDate:
      interview.endTime || interview.completedAt || interview.createdAt,
    analyticsDuration:
      interview.totalDuration ?? interview.duration ?? 0,
    analyticsScores: {
      overall,
      technical: firstAvailableScore(
        categories.technical,
        resultCategories.technical?.score,
      ),
      communication: firstAvailableScore(
        categories.communication,
        resultCategories.communication?.score,
        resultCategories.communication?.clarity,
      ),
      problemSolving: firstAvailableScore(
        categories.problemSolving,
        resultCategories.problemSolving?.score,
      ),
      confidence: firstAvailableScore(
        categories.confidence,
        resultCategories.communication?.confidence,
      ),
    },
  };
}

function calculateTrend(scores) {
  if (scores.length < 2) return 0;
  const recent = scores.slice(0, Math.ceil(scores.length / 2));
  const older = scores.slice(Math.ceil(scores.length / 2));
  return Math.round(average(recent) - average(older));
}

function getWeeklyActivity(interviews) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activity = days.map((day) => ({ day, count: 0 }));

  interviews.forEach((interview) => {
    if (interview.analyticsDate) {
      const dayIndex = new Date(interview.analyticsDate).getDay();
      activity[dayIndex].count++;
    }
  });

  return activity;
}

export default { getUserAnalytics, getSkillRadar };
