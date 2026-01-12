import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import User from '../models/User.model.js';
import Achievement, { predefinedAchievements } from '../models/Achievement.model.js';

const router = express.Router();

// ============================================
// INITIALIZE ACHIEVEMENTS (Run once)
// ============================================
router.post('/initialize', authenticate, async (req, res) => {
  try {
    // Check if achievements already exist
    const count = await Achievement.countDocuments();
    
    if (count > 0) {
      return res.json({
        success: true,
        message: 'Achievements already initialized',
        count
      });
    }

    // Insert predefined achievements
    const achievements = await Achievement.insertMany(predefinedAchievements);

    res.json({
      success: true,
      message: 'Achievements initialized successfully',
      count: achievements.length
    });
  } catch (error) {
    console.error('Error initializing achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize achievements',
      error: error.message
    });
  }
});

// ============================================
// GET ALL ACHIEVEMENTS WITH USER PROGRESS
// ============================================
router.get('/all', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all achievements
    const achievements = await Achievement.find({ isActive: true })
      .sort({ rarity: 1, xpReward: 1 });

    // Get user's earned achievements
    const user = await User.findById(userId)
      .select('stats.earnedAchievements')
      .populate('stats.earnedAchievements.achievementId');

    const earnedAchievementIds = user?.stats?.earnedAchievements?.map(
      ea => ea.achievementId._id.toString()
    ) || [];

    // Map achievements with earned status
    const achievementsWithProgress = achievements.map(achievement => {
      const earned = earnedAchievementIds.includes(achievement._id.toString());
      const earnedData = user?.stats?.earnedAchievements?.find(
        ea => ea.achievementId._id.toString() === achievement._id.toString()
      );

      return {
        ...achievement.toObject(),
        earned,
        earnedAt: earnedData?.earnedAt || null,
        progress: earned ? 100 : 0 // Can be enhanced with actual progress tracking
      };
    });

    // Group by category
    const grouped = achievementsWithProgress.reduce((acc, achievement) => {
      const category = achievement.category || 'milestone';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(achievement);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        all: achievementsWithProgress,
        grouped,
        totalAchievements: achievements.length,
        earnedCount: earnedAchievementIds.length
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message
    });
  }
});

// ============================================
// GET USER'S EARNED ACHIEVEMENTS
// ============================================
router.get('/earned', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('stats.earnedAchievements')
      .populate('stats.earnedAchievements.achievementId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const earnedAchievements = user.stats.earnedAchievements?.map(ea => ({
      ...ea.achievementId.toObject(),
      earnedAt: ea.earnedAt
    })) || [];

    res.json({
      success: true,
      data: earnedAchievements,
      count: earnedAchievements.length
    });
  } catch (error) {
    console.error('Error fetching earned achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earned achievements',
      error: error.message
    });
  }
});

// ============================================
// CHECK AND AWARD ACHIEVEMENTS
// ============================================
router.post('/check', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('stats')
      .populate('stats.earnedAchievements.achievementId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all achievements
    const allAchievements = await Achievement.find({ isActive: true });

    // Get already earned achievement IDs
    const earnedIds = user.stats.earnedAchievements?.map(
      ea => ea.achievementId._id.toString()
    ) || [];

    // Check which achievements can be awarded
    const newAchievements = [];

    for (const achievement of allAchievements) {
      // Skip if already earned
      if (earnedIds.includes(achievement._id.toString())) {
        continue;
      }

      // Check criteria
      let meetsRequirement = false;

      switch (achievement.criteria.type) {
        case 'interviews_completed':
          meetsRequirement = user.stats.totalInterviews >= achievement.criteria.threshold;
          break;
        case 'streak':
          meetsRequirement = user.stats.streak >= achievement.criteria.threshold;
          break;
        case 'level':
          meetsRequirement = user.stats.level >= achievement.criteria.threshold;
          break;
        case 'xp':
          meetsRequirement = user.stats.xpPoints >= achievement.criteria.threshold;
          break;
        // Add more criteria types as needed
      }

      if (meetsRequirement) {
        // Award achievement
        if (!user.stats.earnedAchievements) {
          user.stats.earnedAchievements = [];
        }

        user.stats.earnedAchievements.push({
          achievementId: achievement._id,
          earnedAt: new Date(),
          notified: false
        });

        // Award XP
        user.stats.xpPoints += achievement.xpReward;

        newAchievements.push({
          ...achievement.toObject(),
          earnedAt: new Date()
        });
      }
    }

    if (newAchievements.length > 0) {
      await user.save();
    }

    res.json({
      success: true,
      data: {
        newAchievements,
        totalXpEarned: newAchievements.reduce((sum, a) => sum + a.xpReward, 0)
      }
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check achievements',
      error: error.message
    });
  }
});

// ============================================
// MARK ACHIEVEMENT AS NOTIFIED
// ============================================
router.post('/mark-notified/:achievementId', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { achievementId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const achievement = user.stats.earnedAchievements?.find(
      ea => ea.achievementId.toString() === achievementId
    );

    if (achievement) {
      achievement.notified = true;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Achievement marked as notified'
    });
  } catch (error) {
    console.error('Error marking achievement as notified:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark achievement as notified',
      error: error.message
    });
  }
});

// ============================================
// GET ACHIEVEMENT STATISTICS
// ============================================
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('stats.earnedAchievements')
      .populate('stats.earnedAchievements.achievementId');

    const totalAchievements = await Achievement.countDocuments({ isActive: true });
    const earnedCount = user?.stats?.earnedAchievements?.length || 0;

    // Calculate rarity distribution
    const rarityCount = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    user?.stats?.earnedAchievements?.forEach(ea => {
      const rarity = ea.achievementId.rarity;
      rarityCount[rarity]++;
    });

    res.json({
      success: true,
      data: {
        totalAchievements,
        earnedCount,
        completionPercentage: Math.round((earnedCount / totalAchievements) * 100),
        rarityCount
      }
    });
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement stats',
      error: error.message
    });
  }
});

export default router;

// ============================================
// ADD TO YOUR MAIN APP FILE
// ============================================
// import achievementRoutes from './routes/achievement.routes.js';
// app.use('/api/achievements', achievementRoutes);