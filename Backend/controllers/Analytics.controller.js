import Interview from '../models/Interview.model.js';
import InterviewLegacy from '../models/Interview.js';
import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.model.js';

// Get comprehensive analytics for a user
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30' } = req.query; // days

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - parseInt(timeRange));

    // Get all completed interviews from both models
    const [interviews1, interviews2] = await Promise.all([
      Interview.find({
        userId,
        status: 'completed',
        completedAt: { $gte: dateFilter }
      }).sort({ completedAt: -1 }).lean(),
      InterviewLegacy.find({
        userId,
        status: 'completed',
        completedAt: { $gte: dateFilter }
      }).sort({ completedAt: -1 }).lean()
    ]);

    // Merge and normalize interviews
    const interviews = [...interviews1, ...interviews2].map(i => ({
      ...i,
      performance: i.performance || { overallScore: i.overallScore || 0, categoryScores: {} },
      config: i.config || { domain: i.role || 'General', difficulty: i.difficulty || 'medium' },
      totalDuration: i.totalDuration || i.duration || 0
    }));

    // Calculate performance trends
    const performanceTrend = interviews.map(interview => ({
      date: interview.completedAt,
      score: interview.performance?.overallScore || 0,
      domain: interview.config?.domain || 'General',
      difficulty: interview.config?.difficulty || 'medium'
    }));

    // Calculate category averages
    const categoryScores = {
      technical: [],
      communication: [],
      problemSolving: [],
      confidence: []
    };

    interviews.forEach(interview => {
      const scores = interview.performance?.categoryScores;
      if (scores) {
        if (scores.technical) categoryScores.technical.push(scores.technical);
        if (scores.communication) categoryScores.communication.push(scores.communication);
        if (scores.problemSolving) categoryScores.problemSolving.push(scores.problemSolving);
        if (scores.confidence) categoryScores.confidence.push(scores.confidence);
      }
    });

    const avgCategoryScores = {
      technical: average(categoryScores.technical),
      communication: average(categoryScores.communication),
      problemSolving: average(categoryScores.problemSolving),
      confidence: average(categoryScores.confidence)
    };

    // Domain breakdown
    const domainStats = {};
    interviews.forEach(interview => {
      const domain = interview.config?.domain || 'General';
      if (!domainStats[domain]) {
        domainStats[domain] = { count: 0, totalScore: 0, scores: [] };
      }
      domainStats[domain].count++;
      domainStats[domain].totalScore += interview.performance?.overallScore || 0;
      domainStats[domain].scores.push(interview.performance?.overallScore || 0);
    });

    const domainBreakdown = Object.entries(domainStats).map(([domain, stats]) => ({
      domain,
      count: stats.count,
      avgScore: Math.round(stats.totalScore / stats.count),
      trend: calculateTrend(stats.scores)
    }));

    // Difficulty distribution
    const difficultyStats = { easy: 0, medium: 0, hard: 0 };
    interviews.forEach(interview => {
      const diff = interview.config?.difficulty || 'medium';
      difficultyStats[diff]++;
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
          avgScore: Math.round(average(interviews.map(i => i.performance?.overallScore || 0))),
          bestScore: Math.max(...interviews.map(i => i.performance?.overallScore || 0), 0),
          totalTime: interviews.reduce((sum, i) => sum + (i.totalDuration || 0), 0)
        },
        performanceTrend,
        categoryScores: avgCategoryScores,
        domainBreakdown,
        difficultyDistribution: difficultyStats,
        weeklyActivity,
        strengths: strengths.sort((a, b) => b.score - a.score),
        weaknesses: weaknesses.sort((a, b) => a.score - b.score)
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
};

// Get skill radar data
export const getSkillRadar = async (req, res) => {
  try {
    const userId = req.user.id;

    const [interviews1, interviews2] = await Promise.all([
      Interview.find({ userId, status: 'completed' }).sort({ completedAt: -1 }).limit(20).lean(),
      InterviewLegacy.find({ userId, status: 'completed' }).sort({ completedAt: -1 }).limit(20).lean()
    ]);

    const interviews = [...interviews1, ...interviews2].slice(0, 20).map(i => ({
      ...i,
      performance: i.performance || { overallScore: i.overallScore || 0, categoryScores: {} },
      config: i.config || { interviewType: i.type || 'technical' }
    }));

    const skills = {
      'Technical Knowledge': [],
      'Communication': [],
      'Problem Solving': [],
      'Code Quality': [],
      'System Design': [],
      'Behavioral': []
    };

    interviews.forEach(interview => {
      const scores = interview.performance?.categoryScores;
      const type = interview.config?.interviewType;
      
      if (scores?.technical) skills['Technical Knowledge'].push(scores.technical);
      if (scores?.communication) skills['Communication'].push(scores.communication);
      if (scores?.problemSolving) skills['Problem Solving'].push(scores.problemSolving);
      
      if (type === 'coding') skills['Code Quality'].push(interview.performance?.overallScore || 0);
      if (type === 'system-design') skills['System Design'].push(interview.performance?.overallScore || 0);
      if (type === 'behavioral') skills['Behavioral'].push(interview.performance?.overallScore || 0);
    });

    const radarData = Object.entries(skills).map(([skill, scores]) => ({
      skill,
      score: scores.length > 0 ? Math.round(average(scores)) : 0,
      fullMark: 100
    }));

    res.json({ success: true, data: radarData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch skill data', error: error.message });
  }
};

// Helper functions
function average(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function calculateTrend(scores) {
  if (scores.length < 2) return 0;
  const recent = scores.slice(0, Math.ceil(scores.length / 2));
  const older = scores.slice(Math.ceil(scores.length / 2));
  return Math.round(average(recent) - average(older));
}

function getWeeklyActivity(interviews) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activity = days.map(day => ({ day, count: 0 }));
  
  interviews.forEach(interview => {
    if (interview.completedAt) {
      const dayIndex = new Date(interview.completedAt).getDay();
      activity[dayIndex].count++;
    }
  });
  
  return activity;
}

export default { getUserAnalytics, getSkillRadar };
