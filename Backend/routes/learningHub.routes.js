
import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { Topic, Module, UserProgress, AIContentCache } from '../models/LearningHub.model.js';
import { generateTopicContent } from '../services/aiContentGenerator.js';
import User from '../models/User.model.js';
import { generateModuleContent } from '../services/aiContentGenerator.js';

const router = express.Router();

// ============================================
// GET ALL TOPICS (Browse Learning Hub)
// ============================================
router.get('/topics', authenticate, async (req, res) => {
  try {
    const { domain, difficulty, search } = req.query;
    const userId = req.user.id;

    let query = { isActive: true };

    // Filters
    if (domain && domain !== 'all') {
      query.domain = domain;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const topics = await Topic.find(query).sort({ createdAt: -1 });

    // Get user's progress for each topic
    const topicsWithProgress = await Promise.all(
      topics.map(async (topic) => {
        const progress = await UserProgress.findOne({
          userId,
          topicId: topic._id
        });

        return {
          ...topic.toObject(),
          userProgress: progress ? {
            progressPercentage: progress.progressPercentage,
            status: progress.status,
            enrolledAt: progress.enrolledAt,
            lastAccessedAt: progress.lastAccessedAt
          } : null,
          isEnrolled: !!progress
        };
      })
    );

    res.json({
      success: true,
      data: topicsWithProgress,
      count: topicsWithProgress.length
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics',
      error: error.message
    });
  }
});

// ============================================
// GET SINGLE TOPIC DETAILS
// ============================================
router.get('/topics/:topicId', authenticate, async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user.id;

    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Get modules for this topic
    const modules = await Module.find({ topicId }).sort({ order: 1 });

    // Get user progress
    const progress = await UserProgress.findOne({ userId, topicId });

    res.json({
      success: true,
      data: {
        topic: topic.toObject(),
        modules,
        userProgress: progress || null,
        isEnrolled: !!progress
      }
    });
  } catch (error) {
    console.error('Error fetching topic details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic details',
      error: error.message
    });
  }
});

// ============================================
// ENROLL IN TOPIC
// ============================================
router.post('/topics/:topicId/enroll', authenticate, async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user.id;

    // Check if topic exists
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Check if already enrolled
    let progress = await UserProgress.findOne({ userId, topicId });

    if (progress) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this topic'
      });
    }

    // Generate AI modules for this topic
    const modules = await generateTopicContent(topic);

    // Create user progress
    progress = await UserProgress.create({
      userId,
      topicId,
      status: 'in_progress',
      completedModules: []
    });

    // Award XP for enrollment
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.xpPoints': 50 }
    });

    res.json({
      success: true,
      message: 'Successfully enrolled in topic',
      data: {
        progress,
        modules,
        xpAwarded: 50
      }
    });
  } catch (error) {
    console.error('Error enrolling in topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in topic',
      error: error.message
    });
  }
});

// ============================================
// GET MODULE CONTENT
// ============================================
// router.get('/modules/:moduleId', authenticate, async (req, res) => {
//   try {
//     const { moduleId } = req.params;
//     const userId = req.user.id;

//     const module = await Module.findById(moduleId).populate('topicId');

//     if (!module) {
//       return res.status(404).json({
//         success: false,
//         message: 'Module not found'
//       });
//     }

//     // Check if user is enrolled
//     const progress = await UserProgress.findOne({
//       userId,
//       topicId: module.topicId._id
//     });

//     if (!progress) {
//       return res.status(403).json({
//         success: false,
//         message: 'Please enroll in this topic first'
//       });
//     }

//     // Check if module content exists, otherwise generate
//     if (!module.content) {
//       // Generate content using AI
//       const generatedContent = await generateModuleContent(module);
//       module.content = generatedContent;
//       await module.save();
//     }

//     // Update last accessed
//     progress.lastAccessedAt = new Date();
//     await progress.save();

//     res.json({
//       success: true,
//       data: module
//     });
//   } catch (error) {
//     console.error('Error fetching module:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch module',
//       error: error.message
//     });
//   }
// });


// ============================================
// GET MODULE CONTENT
// ============================================
router.get('/modules/:moduleId', authenticate, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;

    const module = await Module.findById(moduleId).populate('topicId');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Check if user is enrolled
    const progress = await UserProgress.findOne({
      userId,
      topicId: module.topicId._id
    });

    if (!progress) {
      return res.status(403).json({
        success: false,
        message: 'Please enroll in this topic first'
      });
    }

    // Check if module content exists, otherwise generate
    if (!module.content) {
      console.log('🤖 Generating AI content for module...');
      const generatedContent = await generateModuleContent(module);
      module.content = JSON.stringify(generatedContent); // Store as JSON string
      await module.save();
    }

    // Parse content if it's stored as string
    let content = module.content;
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        // If it's not JSON, wrap it
        content = { type: 'markdown', content: module.content };
      }
    }

    // Update last accessed
    progress.lastAccessedAt = new Date();
    await progress.save();

    // Get all modules for navigation
    const allModules = await Module.find({ topicId: module.topicId }).sort({ order: 1 });
    const currentIndex = allModules.findIndex(m => m._id.toString() === moduleId);
    
    const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;
    const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;

    // Check if current module is completed
    const isCompleted = progress.completedModules.some(
      cm => cm.moduleId.toString() === moduleId
    );

    res.json({
      success: true,
      data: {
        ...module.toObject(),
        content: content,
        nextModule: nextModule ? { _id: nextModule._id, title: nextModule.title } : null,
        prevModule: prevModule ? { _id: prevModule._id, title: prevModule.title } : null,
        isCompleted
      }
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module',
      error: error.message
    });
  }
});

// ============================================
// MARK MODULE AS COMPLETE
// ============================================
router.post('/modules/:moduleId/complete', authenticate, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { timeSpent } = req.body; // in minutes
    const userId = req.user.id;

    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const progress = await UserProgress.findOne({
      userId,
      topicId: module.topicId
    });

    if (!progress) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this topic'
      });
    }

    // Check if already completed
    const alreadyCompleted = progress.completedModules.some(
      cm => cm.moduleId.toString() === moduleId
    );

    if (!alreadyCompleted) {
      progress.completedModules.push({
        moduleId,
        completedAt: new Date(),
        timeSpent: timeSpent || module.estimatedMinutes
      });

      progress.totalTimeSpent += timeSpent || module.estimatedMinutes;

      // Calculate progress percentage
      const totalModules = await Module.countDocuments({ topicId: module.topicId });
      progress.progressPercentage = Math.round(
        (progress.completedModules.length / totalModules) * 100
      );

      // Update status
      if (progress.progressPercentage === 100) {
        progress.status = 'completed';
        
        // Award completion XP
        await User.findByIdAndUpdate(userId, {
          $inc: { 'stats.xpPoints': 500 }
        });
      }

      await progress.save();

      // Award XP for module completion
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.xpPoints': 25 }
      });
    }

    res.json({
      success: true,
      message: 'Module marked as complete',
      data: {
        progress: progress.progressPercentage,
        status: progress.status,
        xpAwarded: alreadyCompleted ? 0 : 25
      }
    });
  } catch (error) {
    console.error('Error marking module complete:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark module complete',
      error: error.message
    });
  }
});

// ============================================
// GET USER'S ENROLLED COURSES
// ============================================
router.get('/my-learning', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const enrolledCourses = await UserProgress.find({ userId })
      .populate('topicId')
      .sort({ lastAccessedAt: -1 });

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
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses',
      error: error.message
    });
  }
});

// ============================================
// ADD NOTE TO MODULE
// ============================================
router.post('/modules/:moduleId/notes', authenticate, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const progress = await UserProgress.findOne({
      userId,
      topicId: module.topicId
    });

    if (!progress) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this topic'
      });
    }

    progress.notes.push({
      moduleId,
      content,
      createdAt: new Date()
    });

    await progress.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: progress.notes[progress.notes.length - 1]
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
});

// ============================================
// GET LEARNING STATS
// ============================================
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const enrolledCount = await UserProgress.countDocuments({ userId });
    const completedCount = await UserProgress.countDocuments({
      userId,
      status: 'completed'
    });
    const inProgressCount = await UserProgress.countDocuments({
      userId,
      status: 'in_progress'
    });

    // Calculate total time spent
    const progressDocs = await UserProgress.find({ userId }).select('totalTimeSpent');
    const totalTimeSpent = progressDocs.reduce((sum, doc) => sum + doc.totalTimeSpent, 0);

    // Get recent activity
    const recentActivity = await UserProgress.find({ userId })
      .populate('topicId', 'title icon')
      .sort({ lastAccessedAt: -1 })
      .limit(5)
      .select('topicId progressPercentage lastAccessedAt');

    res.json({
      success: true,
      data: {
        enrolledCount,
        completedCount,
        inProgressCount,
        totalTimeSpent,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching learning stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning stats',
      error: error.message
    });
  }
});

export default router;

// ============================================
// ADD TO YOUR MAIN APP FILE
// ============================================
// import learningHubRoutes from './routes/learningHub.routes.js';
// app.use('/api/learning-hub', learningHubRoutes);