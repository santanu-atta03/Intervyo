// ============================================
// LEARNING HUB MODELS
// File: models/LearningHub.model.js
// ============================================

import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Fullstack', 'System Design', 'Data Science', 'DevOps', 'Mobile', 'ML', 'Blockchain', 'General']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  icon: {
    type: String,
    default: '📚'
  },
  estimatedHours: {
    type: Number,
    default: 10
  },
  prerequisites: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// ============================================
// MODULE SCHEMA (Sub-topics within a Topic)
// ============================================
const moduleSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    required: true
  },
  contentType: {
    type: String,
    enum: ['text', 'video', 'code', 'quiz', 'project'],
    default: 'text'
  },
  content: {
    type: String, // Can store markdown, HTML, or JSON
  },
  estimatedMinutes: {
    type: Number,
    default: 30
  },
  resources: [{
    title: String,
    url: String,
    type: String // 'article', 'video', 'documentation'
  }]
}, { timestamps: true });

// ============================================
// USER PROGRESS SCHEMA
// ============================================
const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedModules: [{
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    completedAt: Date,
    timeSpent: Number // in minutes
  }],
  totalTimeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  notes: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizScores: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    score: Number,
    attemptedAt: Date
  }]
}, { timestamps: true });

// Compound index for faster queries
userProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

// ============================================
// AI GENERATED CONTENT CACHE
// ============================================
const aiContentCacheSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  moduleTitle: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Store generated content
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// TTL index for automatic deletion
aiContentCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============================================
// LEARNING PATH SCHEMA (Predefined Learning Journeys)
// ============================================
const learningPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  topics: [{
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    order: Number
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  estimatedWeeks: {
    type: Number,
    default: 4
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// ============================================
// EXPORT MODELS
// ============================================
export const Topic = mongoose.model('Topic', topicSchema);
export const Module = mongoose.model('Module', moduleSchema);
export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export const AIContentCache = mongoose.model('AIContentCache', aiContentCacheSchema);
export const LearningPath = mongoose.model('LearningPath', learningPathSchema);

// ============================================
// DEFAULT TOPICS SEEDER
// ============================================
export const seedDefaultTopics = async () => {
  const defaultTopics = [
    {
      title: 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript including ES6+ features',
      domain: 'Frontend',
      difficulty: 'Beginner',
      icon: '⚡',
      estimatedHours: 15,
      tags: ['javascript', 'es6', 'fundamentals']
    },
    {
      title: 'React.js Complete Guide',
      description: 'Build modern web applications with React, Hooks, and Context API',
      domain: 'Frontend',
      difficulty: 'Intermediate',
      icon: '⚛️',
      estimatedHours: 25,
      prerequisites: ['JavaScript Fundamentals'],
      tags: ['react', 'hooks', 'components']
    },
    {
      title: 'Node.js & Express',
      description: 'Create scalable backend applications with Node.js and Express',
      domain: 'Backend',
      difficulty: 'Intermediate',
      icon: '🟢',
      estimatedHours: 20,
      tags: ['nodejs', 'express', 'backend']
    },
    {
      title: 'System Design Principles',
      description: 'Learn how to design scalable and reliable systems',
      domain: 'System Design',
      difficulty: 'Advanced',
      icon: '🏗️',
      estimatedHours: 30,
      tags: ['system-design', 'scalability', 'architecture']
    },
    {
      title: 'Data Structures & Algorithms',
      description: 'Master DSA for coding interviews',
      domain: 'General',
      difficulty: 'Intermediate',
      icon: '🧮',
      estimatedHours: 40,
      tags: ['dsa', 'algorithms', 'problem-solving']
    },
    {
      title: 'Database Design & SQL',
      description: 'Learn database design, SQL queries, and optimization',
      domain: 'Backend',
      difficulty: 'Intermediate',
      icon: '🗄️',
      estimatedHours: 18,
      tags: ['sql', 'database', 'queries']
    },
    {
      title: 'AWS Cloud Fundamentals',
      description: 'Get started with AWS services and cloud computing',
      domain: 'DevOps',
      difficulty: 'Intermediate',
      icon: '☁️',
      estimatedHours: 22,
      tags: ['aws', 'cloud', 'devops']
    },
    {
      title: 'Python for Data Science',
      description: 'Learn Python libraries for data analysis and visualization',
      domain: 'Data Science',
      difficulty: 'Beginner',
      icon: '🐍',
      estimatedHours: 20,
      tags: ['python', 'data-science', 'pandas']
    }
  ];

  try {
    const existingTopics = await Topic.countDocuments();
    if (existingTopics === 0) {
      await Topic.insertMany(defaultTopics);
      console.log('✅ Default topics seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding topics:', error);
  }
};