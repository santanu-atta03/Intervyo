

import User from '../models/User.model.js';
import Interview from '../models/Interview.js';

// ============================================
// XP CALCULATION ENGINE
// ============================================
// export const calculateXP = (interview, session) => {
//   const { difficulty, overallScore } = interview;
  
//   // Base XP by difficulty
//   const baseXP = {
//     'easy': 50,
//     'medium': 100,
//     'hard': 200
//   };
  
//   // Score multiplier (0.5x to 1.5x based on score)
//   const scoreMultiplier = 0.5 + (overallScore / 100);
  
//   // Bonus XP for perfect scores
//   const perfectBonus = overallScore === 100 ? 100 : 0;
  
//   // Code submission bonus
//   const codeBonus = session?.codeSubmissions?.length > 0 ? 50 : 0;
  
//   // First attempt bonus (no previous attempts for same role)
//   const firstAttemptBonus = 25;
  
//   // Calculate total
//   const totalXP = Math.round(
//     (baseXP[difficulty] * scoreMultiplier) + 
//     perfectBonus + 
//     codeBonus + 
//     firstAttemptBonus
//   );
  
//   return {
//     baseXP: baseXP[difficulty],
//     scoreBonus: Math.round(baseXP[difficulty] * (scoreMultiplier - 1)),
//     perfectBonus,
//     codeBonus,
//     firstAttemptBonus,
//     totalXP
//   };
// };


export const BADGE_DEFINITIONS = {
  // Completion Badges
  FIRST_INTERVIEW: {
    id: 'first_interview',
    name: 'First Steps',
    description: 'Complete your first interview',
    icon: '🎯',
    xpReward: 10
  },
  INTERVIEWS_5: {
    id: 'interviews_5',
    name: 'Getting Started',
    description: 'Complete 5 interviews',
    icon: '🌟',
    xpReward: 30
  },
  INTERVIEWS_10: {
    id: 'interviews_10',
    name: 'Dedicated Learner',
    description: 'Complete 10 interviews',
    icon: '💪',
    xpReward: 50
  },
  INTERVIEWS_25: {
    id: 'interviews_25',
    name: 'Interview Master',
    description: 'Complete 25 interviews',
    icon: '👑',
    xpReward: 75
  },
  INTERVIEWS_50: {
    id: 'interviews_50',
    name: 'Interview Legend',
    description: 'Complete 50 interviews',
    icon: '🏆',
    xpReward: 100
  },
  
  // Streak Badges
  STREAK_3: {
    id: 'streak_3',
    name: 'Consistency Starter',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    xpReward: 5
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚔️',
    xpReward: 10
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🎖️',
    xpReward: 20
  },
  STREAK_100: {
    id: 'streak_100',
    name: 'Century Champion',
    description: 'Maintain a 100-day streak',
    icon: '💯',
    xpReward: 30
  },
  
  // Performance Badges
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfection',
    description: 'Score 100% in an interview',
    icon: '💎',
    xpReward: 30
  },
  PERFECT_SCORE_5: {
    id: 'perfect_score_5',
    name: 'Flawless Five',
    description: 'Score 100% in 5 interviews',
    icon: '✨',
    xpReward: 50
  },
  HIGH_SCORER: {
    id: 'high_scorer',
    name: 'High Achiever',
    description: 'Score above 90% in 10 interviews',
    icon: '⭐',
    xpReward: 75
  },
  
  // Difficulty Badges
  EASY_MASTER: {
    id: 'easy_master',
    name: 'Easy Mode Champion',
    description: 'Complete 10 easy interviews with 80%+ average',
    icon: '🎓',
    xpReward: 25
  },
  MEDIUM_MASTER: {
    id: 'medium_master',
    name: 'Medium Mode Expert',
    description: 'Complete 10 medium interviews with 80%+ average',
    icon: '🔰',
    xpReward: 75
  },
  HARD_MASTER: {
    id: 'hard_master',
    name: 'Hard Mode Legend',
    description: 'Complete 10 hard interviews with 80%+ average',
    icon: '⚡',
    xpReward: 100
  },
  
  // Coding Badges
  CODE_WARRIOR: {
    id: 'code_warrior',
    name: 'Code Warrior',
    description: 'Complete 5 coding challenges',
    icon: '💻',
    xpReward: 20
  },
  CODE_MASTER: {
    id: 'code_master',
    name: 'Code Master',
    description: 'Complete 20 coding challenges',
    icon: '🖥️',
    xpReward: 40
  },
  
  // Speed Badges
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete an interview in under 20 minutes',
    icon: '⚡',
    xpReward: 75
  },
  
  // Level Badges (Auto-generated)
  LEVEL_5: {
    id: 'level_5',
    name: 'Level 5 Reached',
    description: 'Reach level 5',
    icon: '🎖️',
    xpReward: 10
  },
  LEVEL_10: {
    id: 'level_10',
    name: 'Level 10 Reached',
    description: 'Reach level 10',
    icon: '👑',
    xpReward: 25
  },
  LEVEL_25: {
    id: 'level_25',
    name: 'Level 25 Reached',
    description: 'Reach level 25',
    icon: '🏆',
    xpReward: 10
  }
};

// ============================================
// CHECK AND AWARD BADGES
// ============================================
export const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    const completedInterviews = await Interview.find({ 
      userId, 
      status: 'completed' 
    });

    const earnedBadges = user.stats.badges.map(b => b.name);
    const newBadges = [];

    // Check completion badges
    const totalInterviews = completedInterviews.length;
    if (totalInterviews >= 1 && !earnedBadges.includes('First Steps')) {
      newBadges.push(BADGE_DEFINITIONS.FIRST_INTERVIEW);
    }
    if (totalInterviews >= 5 && !earnedBadges.includes('Getting Started')) {
      newBadges.push(BADGE_DEFINITIONS.INTERVIEWS_5);
    }
    if (totalInterviews >= 10 && !earnedBadges.includes('Dedicated Learner')) {
      newBadges.push(BADGE_DEFINITIONS.INTERVIEWS_10);
    }
    if (totalInterviews >= 25 && !earnedBadges.includes('Interview Master')) {
      newBadges.push(BADGE_DEFINITIONS.INTERVIEWS_25);
    }
    if (totalInterviews >= 50 && !earnedBadges.includes('Interview Legend')) {
      newBadges.push(BADGE_DEFINITIONS.INTERVIEWS_50);
    }

    // Check streak badges
    const streak = user.stats.streak;
    if (streak >= 3 && !earnedBadges.includes('Consistency Starter')) {
      newBadges.push(BADGE_DEFINITIONS.STREAK_3);
    }
    if (streak >= 7 && !earnedBadges.includes('Week Warrior')) {
      newBadges.push(BADGE_DEFINITIONS.STREAK_7);
    }
    if (streak >= 30 && !earnedBadges.includes('Monthly Master')) {
      newBadges.push(BADGE_DEFINITIONS.STREAK_30);
    }
    if (streak >= 100 && !earnedBadges.includes('Century Champion')) {
      newBadges.push(BADGE_DEFINITIONS.STREAK_100);
    }

    // Check perfect score badges
    const perfectScores = completedInterviews.filter(i => i.overallScore === 100);
    if (perfectScores.length >= 1 && !earnedBadges.includes('Perfection')) {
      newBadges.push(BADGE_DEFINITIONS.PERFECT_SCORE);
    }
    if (perfectScores.length >= 5 && !earnedBadges.includes('Flawless Five')) {
      newBadges.push(BADGE_DEFINITIONS.PERFECT_SCORE_5);
    }

    // Check high scorer badge
    const highScores = completedInterviews.filter(i => i.overallScore >= 90);
    if (highScores.length >= 10 && !earnedBadges.includes('High Achiever')) {
      newBadges.push(BADGE_DEFINITIONS.HIGH_SCORER);
    }

    // Check difficulty badges
    const easyInterviews = completedInterviews.filter(i => i.difficulty === 'easy');
    const easyAvg = easyInterviews.length > 0 
      ? easyInterviews.reduce((sum, i) => sum + i.overallScore, 0) / easyInterviews.length 
      : 0;
    if (easyInterviews.length >= 10 && easyAvg >= 80 && !earnedBadges.includes('Easy Mode Champion')) {
      newBadges.push(BADGE_DEFINITIONS.EASY_MASTER);
    }

    const mediumInterviews = completedInterviews.filter(i => i.difficulty === 'medium');
    const mediumAvg = mediumInterviews.length > 0 
      ? mediumInterviews.reduce((sum, i) => sum + i.overallScore, 0) / mediumInterviews.length 
      : 0;
    if (mediumInterviews.length >= 10 && mediumAvg >= 80 && !earnedBadges.includes('Medium Mode Expert')) {
      newBadges.push(BADGE_DEFINITIONS.MEDIUM_MASTER);
    }

    const hardInterviews = completedInterviews.filter(i => i.difficulty === 'hard');
    const hardAvg = hardInterviews.length > 0 
      ? hardInterviews.reduce((sum, i) => sum + i.overallScore, 0) / hardInterviews.length 
      : 0;
    if (hardInterviews.length >= 10 && hardAvg >= 80 && !earnedBadges.includes('Hard Mode Legend')) {
      newBadges.push(BADGE_DEFINITIONS.HARD_MASTER);
    }

    // Check level badges
    const level = user.stats.level;
    if (level >= 5 && !earnedBadges.includes('Level 5 Reached')) {
      newBadges.push(BADGE_DEFINITIONS.LEVEL_5);
    }
    if (level >= 10 && !earnedBadges.includes('Level 10 Reached')) {
      newBadges.push(BADGE_DEFINITIONS.LEVEL_10);
    }
    if (level >= 25 && !earnedBadges.includes('Level 25 Reached')) {
      newBadges.push(BADGE_DEFINITIONS.LEVEL_25);
    }

    // Award new badges
    let totalXPAwarded = 0;
    for (const badge of newBadges) {
      user.stats.badges.push({
        name: badge.name,
        icon: badge.icon,
        earnedAt: new Date(),
        description: badge.description
      });
      totalXPAwarded += badge.xpReward;
    }

    // Award XP for badges
    if (totalXPAwarded > 0) {
      user.stats.xpPoints += totalXPAwarded;
      
      // Check for level up
      const newLevel = Math.floor(user.stats.xpPoints / 500) + 1;
      if (newLevel > user.stats.level) {
        user.stats.level = newLevel;
      }
    }

    await user.save();

    return {
      newBadges,
      totalXPAwarded
    };
  } catch (error) {
    console.error('Error checking badges:', error);
    return { newBadges: [], totalXPAwarded: 0 };
  }
};

// ============================================
// LEADERBOARD SYSTEM
// ============================================
export const getLeaderboard = async (period = 'all-time', limit = 10) => {
  try {
    let query = {};
    
    // Filter by time period
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = { 'stats.lastInterviewDate': { $gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = { 'stats.lastInterviewDate': { $gte: monthAgo } };
    }

    const leaderboard = await User.find(query)
      .select('name profilePicture stats')
      .sort({ 'stats.xpPoints': -1 })
      .limit(limit);

    return leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
      xpPoints: user.stats.xpPoints,
      level: user.stats.level,
      totalInterviews: user.stats.totalInterviews,
      streak: user.stats.streak,
      badges: user.stats.badges.length
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

// ============================================
// DAILY CHALLENGES SYSTEM
// ============================================
export const DAILY_CHALLENGES = [
  {
    id: 'complete_interview',
    title: 'Daily Interview',
    description: 'Complete one interview today',
    xpReward: 5,
    type: 'daily'
  },
  {
    id: 'score_80_plus',
    title: 'High Score',
    description: 'Score 80% or higher in an interview',
    xpReward: 10,
    type: 'daily'
  },
  {
    id: 'coding_challenge',
    title: 'Code Today',
    description: 'Complete a coding challenge',
    xpReward: 7,
    type: 'daily'
  }
];

export const generateDailyChallenges = async (userId) => {
  // Randomly select 3 challenges for the day
  const challenges = [];
  const allChallenges = [...DAILY_CHALLENGES];
  
  for (let i = 0; i < 3 && allChallenges.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * allChallenges.length);
    challenges.push(allChallenges[randomIndex]);
    allChallenges.splice(randomIndex, 1);
  }
  
  return challenges;
};

// ============================================
// ACHIEVEMENT NOTIFICATION SYSTEM
// ============================================
export const createAchievementNotification = (badge, xpAwarded) => {
  return {
    type: 'achievement',
    title: `🎉 ${badge.name} Unlocked!`,
    message: badge.description,
    xpAwarded,
    icon: badge.icon,
    timestamp: new Date()
  };
};

// ============================================
// LEVEL UP REWARDS
// ============================================
export const LEVEL_REWARDS = {
  5: {
    title: 'Custom Profile Badge',
    description: 'Unlock custom badge customization'
  },
  10: {
    title: 'Advanced Analytics',
    description: 'Access detailed performance analytics'
  },
  15: {
    title: 'Priority Support',
    description: 'Get faster response from support team'
  },
  20: {
    title: 'Exclusive Interview Templates',
    description: 'Access premium interview templates'
  },
  25: {
    title: 'Mentor Access',
    description: 'Connect with industry mentors'
  }
};

export const getLevelRewards = (level) => {
  const rewards = [];
  for (const [rewardLevel, reward] of Object.entries(LEVEL_REWARDS)) {
    if (level >= parseInt(rewardLevel)) {
      rewards.push({ level: rewardLevel, ...reward });
    }
  }
  return rewards;
};


export const calculateXP = (interview, session) => {
  const { difficulty, overallScore } = interview;
  
  // Base XP by difficulty
  const baseXP = {
    'easy': 5,
    'medium': 10,
    'hard': 20
  };
  
  // Score multiplier (0.5x to 1.5x)
  const scoreMultiplier = 0.5 + (overallScore / 100);
  
  // Perfect score bonus
  const perfectBonus = overallScore === 100 ? 100 : 0;
  
  // Code submission bonus
  const codeBonus = session?.codeSubmissions?.length > 0 ? 50 : 0;
  
  // Completion bonus
  const completionBonus = 25;
  
  // Calculate total
  const basePoints = baseXP[difficulty] || baseXP.medium;
  const scorePoints = Math.round(basePoints * (scoreMultiplier - 1));
  const totalXP = Math.round(basePoints + scorePoints + perfectBonus + codeBonus + completionBonus);
  
  return {
    baseXP: basePoints,
    scoreBonus: scorePoints,
    perfectBonus,
    codeBonus,
    completionBonus,
    totalXP,
    breakdown: `Base: ${basePoints}, Score: ${scorePoints}, Perfect: ${perfectBonus}, Code: ${codeBonus}, Completion: ${completionBonus}`
  };
};

export const updateUserStreak = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = user.stats.lastInterviewDate 
    ? new Date(user.stats.lastInterviewDate)
    : null;

  if (lastDate) {
    lastDate.setHours(0, 0, 0, 0);
  }

  let streakIncreased = false;
  let streakBroken = false;

  if (!lastDate || lastDate < today) {
    if (lastDate) {
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day - increment
        user.stats.streak += 1;
        streakIncreased = true;
      } else if (diffDays > 1) {
        // Streak broken - reset
        user.stats.streak = 1;
        streakBroken = true;
      }
    } else {
      // First interview
      user.stats.streak = 1;
      streakIncreased = true;
    }

    user.stats.lastInterviewDate = new Date();
    await user.save();
  }

  return {
    streak: user.stats.streak,
    streakIncreased,
    streakBroken,
    lastInterviewDate: user.stats.lastInterviewDate
  };
};

// export const checkAndAwardBadges = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const Interview = require('../models/Interview.js').default;
//     const completedInterviews = await Interview.find({ 
//       userId, 
//       status: 'completed' 
//     });

//     const earnedBadgeNames = user.stats.badges?.map(b => b.name) || [];
//     const newBadges = [];
//     let totalXPAwarded = 0;

//     // Badge definitions
//     const badges = {
//       FIRST_INTERVIEW: { name: 'First Steps', icon: '🎯', xp: 50, condition: () => completedInterviews.length === 1 },
//       INTERVIEWS_5: { name: 'Getting Started', icon: '🌟', xp: 100, condition: () => completedInterviews.length === 5 },
//       INTERVIEWS_10: { name: 'Dedicated Learner', icon: '💪', xp: 200, condition: () => completedInterviews.length === 10 },
//       PERFECT_SCORE: { name: 'Perfection', icon: '💎', xp: 200, condition: () => completedInterviews.some(i => i.overallScore === 100) },
//       STREAK_3: { name: 'Consistency Starter', icon: '🔥', xp: 75, condition: () => user.stats.streak >= 3 },
//       STREAK_7: { name: 'Week Warrior', icon: '⚔️', xp: 150, condition: () => user.stats.streak >= 7 },
//       LEVEL_5: { name: 'Level 5 Reached', icon: '🎖️', xp: 100, condition: () => user.stats.level >= 5 },
//       LEVEL_10: { name: 'Level 10 Reached', icon: '👑', xp: 250, condition: () => user.stats.level >= 10 }
//     };

//     // Check each badge
//     for (const [key, badge] of Object.entries(badges)) {
//       if (!earnedBadgeNames.includes(badge.name) && badge.condition()) {
//         // Award badge
//         user.stats.badges.push({
//           name: badge.name,
//           icon: badge.icon,
//           earnedAt: new Date(),
//           description: badge.name
//         });
        
//         // Award XP
//         user.stats.xpPoints += badge.xp;
//         totalXPAwarded += badge.xp;
        
//         newBadges.push(badge);
        
//         console.log(`🏆 Badge awarded: ${badge.name} (+${badge.xp} XP)`);
//       }
//     }

//     // Check for level up from badge XP
//     if (totalXPAwarded > 0) {
//       const newLevel = Math.floor(user.stats.xpPoints / 500) + 1;
//       if (newLevel > user.stats.level) {
//         user.stats.level = newLevel;
//       }
//     }

//     await user.save();

//     return { newBadges, totalXPAwarded };
//   } catch (error) {
//     console.error('Error checking badges:', error);
//     return { newBadges: [], totalXPAwarded: 0 };
//   }
// };
// ============================================
// USAGE EXAMPLE
// ============================================
/*
// After interview completion:
const xpBreakdown = calculateXP(interview, session);
user.stats.xpPoints += xpBreakdown.totalXP;

// Check for level up
const newLevel = Math.floor(user.stats.xpPoints / 500) + 1;
if (newLevel > user.stats.level) {
  user.stats.level = newLevel;
}

// Check and award badges
const { newBadges, totalXPAwarded } = await checkAndAwardBadges(userId);

// Update streak
await updateStreak(userId);

await user.save();
*/