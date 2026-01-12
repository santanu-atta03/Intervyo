import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import User from '../models/User.model.js';
import Interview from '../models/Interview.js';
import InterviewSession from '../models/InterviewSession.js';
import { Topic, Module, UserProgress, AIContentCache } from '../models/LearningHub.model.js';

const router = express.Router();

// ============================================
// GET USER DASHBOARD STATS
// ============================================
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with stats
    const user = await User.findById(userId).select('stats subscription');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get total interviews
    const totalInterviews = await Interview.countDocuments({ 
      userId, 
      status: 'completed' 
    });

    // Get recent interviews for trend calculation
    const recentInterviews = await Interview.find({ 
      userId, 
      status: 'completed' 
    })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('overallScore completedAt');

    // Calculate average score
    const avgScore = recentInterviews.length > 0
      ? recentInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / recentInterviews.length
      : 0;

    // Calculate trend (compare last 3 vs previous 3)
    let trend = 0;
    if (recentInterviews.length >= 6) {
      const recent3 = recentInterviews.slice(0, 3);
      const previous3 = recentInterviews.slice(3, 6);
      
      const recentAvg = recent3.reduce((sum, i) => sum + (i.overallScore || 0), 0) / 3;
      const previousAvg = previous3.reduce((sum, i) => sum + (i.overallScore || 0), 0) / 3;
      
      if (previousAvg > 0) {
        trend = ((recentAvg - previousAvg) / previousAvg) * 100;
      }
    }

    // Update user stats if needed
    if (user.stats.totalInterviews !== totalInterviews) {
      user.stats.totalInterviews = totalInterviews;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        ...user.stats.toObject(),
        totalInterviews,
        averageScore: Math.round(avgScore * 10) / 10,
        trend: Math.round(trend * 10) / 10,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// ============================================
// GET RECENT INTERVIEWS
// ============================================
router.get('/interviews/recent', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const interviews = await Interview.find({ 
      userId,
      status: 'completed'
    })
      .sort({ completedAt: -1 })
      .limit(limit)
      .select('role difficulty duration overallScore completedAt createdAt status');

    res.json({
      success: true,
      data: interviews,
      count: interviews.length
    });
  } catch (error) {
    console.error('Error fetching recent interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent interviews',
      error: error.message
    });
  }
});

// ============================================
// GET LEARNING PROGRESS
// ============================================
router.get('/learning-progress', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all completed interviews grouped by role/domain
    // const interviews = await Interview.find({ 
    //   userId,
    //   status: 'completed'
    // }).select('role overallScore duration');

    const enrolledCourses = await UserProgress.find({ userId })
          .populate('topicId')
          .sort({ lastAccessedAt: -1 });

    // Group by role and calculate progress
    // const progressMap = {};
    
    // interviews.forEach(interview => {
    //   const domain = interview.role || 'General';
      
    //   if (!progressMap[domain]) {
    //     progressMap[domain] = {
    //       topic: domain,
    //       totalScore: 0,
    //       count: 0,
    //       totalTime: 0,
    //       scores: []
    //     };
    //   }
      
    //   progressMap[domain].totalScore += interview.overallScore || 0;
    //   progressMap[domain].count += 1;
    //   progressMap[domain].totalTime += interview.duration || 0;
    //   progressMap[domain].scores.push(interview.overallScore || 0);
    // });

    // Convert to array and calculate averages
    // const learningProgress = Object.values(progressMap).map(item => ({
    //   topic: item.topic,
    //   progress: Math.round(item.totalScore / item.count),
    //   timeSpent: `${Math.round(item.totalTime / 60)}h ${item.totalTime % 60}min`,
    //   interviews: item.count,
    //   trend: item.scores.length >= 2 
    //     ? item.scores[0] - item.scores[item.scores.length - 1]
    //     : 0
    // }));

    const formattedCourses = enrolledCourses.map(course => ({
      topic: course.topicId,
      progress: course.progressPercentage,
      status: course.status,
      enrolledAt: course.enrolledAt,
      lastAccessedAt: course.lastAccessedAt,
      totalTimeSpent: course.totalTimeSpent,
      completedModules: course.completedModules.length
    }));

    res.json({
      success: true,
      data: formattedCourses,
      count: formattedCourses.length
    });
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning progress',
      error: error.message
    });
  }
});

// ============================================
// UPDATE STREAK
// ============================================
router.post('/update-streak', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastInterviewDate = user.stats.lastInterviewDate 
      ? new Date(user.stats.lastInterviewDate)
      : null;

    if (lastInterviewDate) {
      lastInterviewDate.setHours(0, 0, 0, 0);
    }

    const previousStreak = user.stats.streak;

    if (!lastInterviewDate || lastInterviewDate < today) {
      // Check if it's consecutive day
      if (lastInterviewDate) {
        const diffDays = Math.floor((today - lastInterviewDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day - increment streak
          user.stats.streak += 1;
          
          // Check for streak milestones
          await notificationService.notifyStreakMilestone(userId, user.stats.streak);
          
        } else if (diffDays > 1) {
          // Streak broken - notify user
          if (previousStreak > 0) {
            await notificationService.notifyStreakBroken(userId, previousStreak);
          }
          user.stats.streak = 1;
        }
      } else {
        // First interview
        user.stats.streak = 1;
      }

      user.stats.lastInterviewDate = new Date();
      await user.save();

      // Check for streak badges
      if (user.stats.streak === 7) {
        await awardBadge(user, 'Week Warrior', '⚔️');
        await notificationService.notifyBadgeEarned(userId, 'Week Warrior', '⚔️');
      } else if (user.stats.streak === 30) {
        await awardBadge(user, 'Monthly Master', '🏆');
        await notificationService.notifyBadgeEarned(userId, 'Monthly Master', '🏆');
      } else if (user.stats.streak === 100) {
        await awardBadge(user, 'Century Champion', '💯');
        await notificationService.notifyBadgeEarned(userId, 'Century Champion', '💯');
      }
    }

    res.json({
      success: true,
      data: {
        streak: user.stats.streak,
        lastInterviewDate: user.stats.lastInterviewDate,
        streakBroken: previousStreak > user.stats.streak
      }
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update streak',
      error: error.message
    });
  }
});
// ============================================
// AWARD XP POINTS
// ============================================
router.post('/award-xp', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { xpAmount, reason } = req.body;

    if (!xpAmount || xpAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid XP amount'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldLevel = user.stats.level;
    user.stats.xpPoints += xpAmount;

    // Calculate new level (500 XP per level)
    const newLevel = Math.floor(user.stats.xpPoints / 500) + 1;
    
    let leveledUp = false;
    if (newLevel > oldLevel) {
      user.stats.level = newLevel;
      leveledUp = true;
      
      // Award level-up badge
      await awardBadge(user, `Level ${newLevel} Achieved`, '🎖️');
      
      // Notify user of level up
      await notificationService.notifyLevelUp(userId, newLevel);
      await notificationService.notifyBadgeEarned(userId, `Level ${newLevel} Achieved`, '🎖️');
    }

    await user.save();

    res.json({
      success: true,
      data: {
        xpPoints: user.stats.xpPoints,
        level: user.stats.level,
        leveledUp,
        reason
      }
    });
  } catch (error) {
    console.error('Error awarding XP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to award XP',
      error: error.message
    });
  }
});

// ============================================
// GET ALL BADGES
// ============================================
router.get('/badges', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('stats.badges');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.stats.badges || [],
      count: user.stats.badges?.length || 0
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges',
      error: error.message
    });
  }
});

// ============================================
// HELPER: AWARD BADGE
// ============================================
async function awardBadge(user, badgeName, icon) {
  const existingBadge = user.stats.badges?.find(b => b.name === badgeName);
  
  if (!existingBadge) {
    if (!user.stats.badges) {
      user.stats.badges = [];
    }
    
    user.stats.badges.push({
      name: badgeName,
      icon: icon,
      earnedAt: new Date()
    });
    
    await user.save();
  }
}

// ============================================
// GET DASHBOARD OVERVIEW (ALL DATA AT ONCE)
// ============================================
router.get('/overview', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with stats
    const user = await User.findById(userId)
      .select('name email profilePicture stats subscription')
      .populate('profile', 'domain skills');

    // Get recent interviews
    const recentInterviews = await Interview.find({ 
      userId,
      status: 'completed'
    })
      .sort({ completedAt: -1 })
      .limit(5)
      .select('role difficulty duration overallScore completedAt createdAt status');

    // Get total stats
    const totalInterviews = await Interview.countDocuments({ 
      userId, 
      status: 'completed' 
    });

    // Calculate average score
    const avgScore = recentInterviews.length > 0
      ? recentInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / recentInterviews.length
      : 0;

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          stats: user.stats,
          subscription: user.subscription
        },
        recentInterviews,
        summary: {
          totalInterviews,
          averageScore: Math.round(avgScore * 10) / 10
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard overview',
      error: error.message
    });
  }
});

export default router;