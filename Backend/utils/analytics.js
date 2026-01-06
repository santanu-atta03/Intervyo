/**
 * Interview Analytics Utilities
 * Provides analytics and statistics calculations for the Intervyo platform
 * @module utils/analytics
 */

/**
 * Calculate average score from an array of scores
 * @param {number[]} scores - Array of numeric scores
 * @returns {number} Average score rounded to 2 decimal places
 */
export const calculateAverageScore = (scores) => {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  const validScores = scores.filter(s => typeof s === 'number' && !isNaN(s));
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / validScores.length) * 100) / 100;
};

/**
 * Calculate percentile rank
 * @param {number} score - Individual score
 * @param {number[]} allScores - All scores to compare against
 * @returns {number} Percentile (0-100)
 */
export const calculatePercentile = (score, allScores) => {
  if (!Array.isArray(allScores) || allScores.length === 0) return 0;
  const validScores = allScores.filter(s => typeof s === 'number' && !isNaN(s));
  if (validScores.length === 0) return 0;
  
  const sortedScores = [...validScores].sort((a, b) => a - b);
  const belowCount = sortedScores.filter(s => s < score).length;
  
  return Math.round((belowCount / sortedScores.length) * 100);
};

/**
 * Calculate standard deviation
 * @param {number[]} values - Array of numeric values
 * @returns {number} Standard deviation
 */
export const calculateStandardDeviation = (values) => {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const validValues = values.filter(v => typeof v === 'number' && !isNaN(v));
  if (validValues.length === 0) return 0;
  
  const mean = validValues.reduce((a, b) => a + b, 0) / validValues.length;
  const squaredDiffs = validValues.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / validValues.length;
  
  return Math.round(Math.sqrt(avgSquaredDiff) * 100) / 100;
};

/**
 * Calculate interview performance metrics
 * @param {object} interviewData - Interview data object
 * @returns {object} Performance metrics
 */
export const calculateInterviewMetrics = (interviewData) => {
  const {
    totalQuestions = 0,
    correctAnswers = 0,
    duration = 0,
    scores = [],
    difficulty = 'medium'
  } = interviewData;

  // Base accuracy calculation
  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  // Average score from individual question scores
  const averageScore = calculateAverageScore(scores);

  // Time efficiency (questions per minute)
  const questionsPerMinute = duration > 0 
    ? Math.round((totalQuestions / (duration / 60)) * 100) / 100 
    : 0;

  // Difficulty multiplier
  const difficultyMultipliers = {
    easy: 0.8,
    medium: 1.0,
    hard: 1.3,
    expert: 1.5
  };
  const multiplier = difficultyMultipliers[difficulty.toLowerCase()] || 1.0;

  // Weighted score
  const weightedScore = Math.round(averageScore * multiplier * 100) / 100;

  // Performance grade
  let grade;
  if (weightedScore >= 90) grade = 'A+';
  else if (weightedScore >= 85) grade = 'A';
  else if (weightedScore >= 80) grade = 'B+';
  else if (weightedScore >= 75) grade = 'B';
  else if (weightedScore >= 70) grade = 'C+';
  else if (weightedScore >= 65) grade = 'C';
  else if (weightedScore >= 60) grade = 'D';
  else grade = 'F';

  return {
    accuracy,
    averageScore,
    weightedScore,
    questionsPerMinute,
    grade,
    totalQuestions,
    correctAnswers,
    duration,
    difficulty
  };
};

/**
 * Calculate user progress over time
 * @param {object[]} interviews - Array of interview records
 * @returns {object} Progress analytics
 */
export const calculateProgressAnalytics = (interviews) => {
  if (!Array.isArray(interviews) || interviews.length === 0) {
    return {
      totalInterviews: 0,
      averageScore: 0,
      improvement: 0,
      consistency: 0,
      streak: 0,
      topSkills: [],
      weakAreas: [],
      trend: 'neutral'
    };
  }

  // Sort by date
  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Calculate scores
  const scores = sortedInterviews.map(i => i.score || 0);
  const averageScore = calculateAverageScore(scores);
  const consistency = 100 - calculateStandardDeviation(scores);

  // Calculate improvement (compare first half vs second half)
  const midPoint = Math.floor(scores.length / 2);
  const firstHalfAvg = calculateAverageScore(scores.slice(0, midPoint));
  const secondHalfAvg = calculateAverageScore(scores.slice(midPoint));
  const improvement = Math.round((secondHalfAvg - firstHalfAvg) * 100) / 100;

  // Determine trend
  let trend = 'neutral';
  if (improvement > 5) trend = 'improving';
  else if (improvement < -5) trend = 'declining';

  // Calculate streak (consecutive days of practice)
  let streak = 0;
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = sortedInterviews.length - 1; i >= 0; i--) {
    const interviewDate = new Date(sortedInterviews[i].createdAt);
    interviewDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - interviewDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === currentStreak) {
      streak++;
      currentStreak++;
    } else {
      break;
    }
  }

  // Analyze skills
  const skillScores = {};
  sortedInterviews.forEach(interview => {
    if (interview.skills && Array.isArray(interview.skills)) {
      interview.skills.forEach(skill => {
        if (!skillScores[skill]) {
          skillScores[skill] = [];
        }
        skillScores[skill].push(interview.score || 0);
      });
    }
  });

  const skillAverages = Object.entries(skillScores)
    .map(([skill, scores]) => ({
      skill,
      average: calculateAverageScore(scores),
      count: scores.length
    }))
    .sort((a, b) => b.average - a.average);

  const topSkills = skillAverages.slice(0, 5);
  const weakAreas = [...skillAverages].sort((a, b) => a.average - b.average).slice(0, 5);

  return {
    totalInterviews: interviews.length,
    averageScore,
    improvement,
    consistency: Math.round(consistency * 100) / 100,
    streak,
    topSkills,
    weakAreas,
    trend,
    recentScores: scores.slice(-10),
    firstScore: scores[0] || 0,
    latestScore: scores[scores.length - 1] || 0
  };
};

/**
 * Calculate leaderboard rankings
 * @param {object[]} users - Array of user objects with scores
 * @returns {object[]} Ranked users
 */
export const calculateLeaderboardRankings = (users) => {
  if (!Array.isArray(users) || users.length === 0) return [];

  // Calculate composite score for each user
  const rankedUsers = users.map(user => {
    const totalInterviews = user.interviews?.length || 0;
    const averageScore = calculateAverageScore(
      user.interviews?.map(i => i.score) || []
    );
    const consistency = 100 - calculateStandardDeviation(
      user.interviews?.map(i => i.score) || []
    );

    // Composite score: 60% average score + 25% consistency + 15% activity
    const activityScore = Math.min(totalInterviews * 2, 100);
    const compositeScore = Math.round(
      (averageScore * 0.6) + (consistency * 0.25) + (activityScore * 0.15)
    );

    return {
      userId: user._id || user.id,
      name: user.name,
      avatar: user.avatar,
      totalInterviews,
      averageScore,
      consistency: Math.round(consistency),
      compositeScore,
      badges: user.badges || []
    };
  });

  // Sort by composite score
  rankedUsers.sort((a, b) => b.compositeScore - a.compositeScore);

  // Assign ranks
  return rankedUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
    percentile: calculatePercentile(
      user.compositeScore,
      rankedUsers.map(u => u.compositeScore)
    )
  }));
};

/**
 * Generate time-based analytics
 * @param {object[]} data - Array of data points with timestamps
 * @param {string} groupBy - Grouping period ('day', 'week', 'month')
 * @returns {object[]} Grouped analytics
 */
export const generateTimeBasedAnalytics = (data, groupBy = 'day') => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const grouped = {};

  data.forEach(item => {
    const date = new Date(item.createdAt || item.date);
    let key;

    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!grouped[key]) {
      grouped[key] = {
        period: key,
        count: 0,
        scores: [],
        totalDuration: 0
      };
    }

    grouped[key].count++;
    if (item.score !== undefined) grouped[key].scores.push(item.score);
    if (item.duration !== undefined) grouped[key].totalDuration += item.duration;
  });

  return Object.values(grouped).map(group => ({
    period: group.period,
    count: group.count,
    averageScore: calculateAverageScore(group.scores),
    totalDuration: group.totalDuration,
    averageDuration: group.count > 0 
      ? Math.round(group.totalDuration / group.count) 
      : 0
  })).sort((a, b) => a.period.localeCompare(b.period));
};

/**
 * Calculate skill gap analysis
 * @param {object} userSkills - User's current skill levels
 * @param {object} targetSkills - Target skill levels for a role
 * @returns {object} Gap analysis
 */
export const calculateSkillGap = (userSkills, targetSkills) => {
  const gaps = [];
  const strengths = [];

  for (const [skill, targetLevel] of Object.entries(targetSkills)) {
    const userLevel = userSkills[skill] || 0;
    const gap = targetLevel - userLevel;

    if (gap > 0) {
      gaps.push({
        skill,
        currentLevel: userLevel,
        targetLevel,
        gap,
        priority: gap > 30 ? 'high' : gap > 15 ? 'medium' : 'low'
      });
    } else {
      strengths.push({
        skill,
        currentLevel: userLevel,
        targetLevel,
        surplus: Math.abs(gap)
      });
    }
  }

  // Sort gaps by priority
  gaps.sort((a, b) => b.gap - a.gap);
  strengths.sort((a, b) => b.surplus - a.surplus);

  const readinessScore = Math.round(
    (Object.keys(targetSkills).length - gaps.filter(g => g.priority === 'high').length) /
    Object.keys(targetSkills).length * 100
  );

  return {
    gaps,
    strengths,
    readinessScore,
    totalSkillsRequired: Object.keys(targetSkills).length,
    skillsMet: strengths.length,
    skillsToImprove: gaps.length,
    recommendations: gaps.slice(0, 3).map(g => ({
      skill: g.skill,
      suggestion: `Focus on improving ${g.skill} - current gap is ${g.gap} points`
    }))
  };
};

/**
 * Calculate interview readiness score
 * @param {object} userData - User data including interviews, skills, etc.
 * @returns {object} Readiness assessment
 */
export const calculateReadinessScore = (userData) => {
  const weights = {
    practiceFrequency: 0.2,
    averageScore: 0.3,
    consistency: 0.15,
    skillCoverage: 0.2,
    recentImprovement: 0.15
  };

  const { interviews = [], skills = [] } = userData;
  const progress = calculateProgressAnalytics(interviews);

  // Practice frequency score (0-100)
  const recentInterviews = interviews.filter(i => {
    const date = new Date(i.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  });
  const practiceFrequencyScore = Math.min(recentInterviews.length * 10, 100);

  // Average score (0-100)
  const averageScoreComponent = progress.averageScore;

  // Consistency score (0-100)
  const consistencyScore = progress.consistency;

  // Skill coverage (0-100)
  const requiredSkillCount = 10; // Target number of skills
  const skillCoverageScore = Math.min((skills.length / requiredSkillCount) * 100, 100);

  // Recent improvement score (0-100)
  const improvementScore = Math.min(Math.max(50 + progress.improvement, 0), 100);

  // Calculate weighted score
  const readinessScore = Math.round(
    (practiceFrequencyScore * weights.practiceFrequency) +
    (averageScoreComponent * weights.averageScore) +
    (consistencyScore * weights.consistency) +
    (skillCoverageScore * weights.skillCoverage) +
    (improvementScore * weights.recentImprovement)
  );

  // Determine readiness level
  let readinessLevel;
  if (readinessScore >= 85) readinessLevel = 'Excellent';
  else if (readinessScore >= 70) readinessLevel = 'Good';
  else if (readinessScore >= 55) readinessLevel = 'Moderate';
  else if (readinessScore >= 40) readinessLevel = 'Needs Work';
  else readinessLevel = 'Not Ready';

  return {
    readinessScore,
    readinessLevel,
    breakdown: {
      practiceFrequency: Math.round(practiceFrequencyScore),
      averageScore: Math.round(averageScoreComponent),
      consistency: Math.round(consistencyScore),
      skillCoverage: Math.round(skillCoverageScore),
      recentImprovement: Math.round(improvementScore)
    },
    recommendations: generateReadinessRecommendations({
      practiceFrequencyScore,
      averageScoreComponent,
      consistencyScore,
      skillCoverageScore,
      improvementScore
    })
  };
};

/**
 * Generate recommendations based on readiness components
 * @param {object} scores - Component scores
 * @returns {string[]} Recommendations
 */
const generateReadinessRecommendations = (scores) => {
  const recommendations = [];

  if (scores.practiceFrequencyScore < 50) {
    recommendations.push('Increase your practice frequency - aim for at least 3-4 mock interviews per week');
  }
  if (scores.averageScoreComponent < 70) {
    recommendations.push('Focus on improving your answer quality - review feedback from past interviews');
  }
  if (scores.consistencyScore < 60) {
    recommendations.push('Work on consistency - your scores vary significantly between interviews');
  }
  if (scores.skillCoverageScore < 70) {
    recommendations.push('Expand your skill set - practice interviews covering different technical areas');
  }
  if (scores.improvementScore < 50) {
    recommendations.push('Your recent performance has declined - review fundamentals and take breaks to avoid burnout');
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job! Keep up the consistent practice and you\'ll be interview-ready soon');
  }

  return recommendations;
};

export default {
  calculateAverageScore,
  calculatePercentile,
  calculateStandardDeviation,
  calculateInterviewMetrics,
  calculateProgressAnalytics,
  calculateLeaderboardRankings,
  generateTimeBasedAnalytics,
  calculateSkillGap,
  calculateReadinessScore
};
