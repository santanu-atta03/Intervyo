import mongoose from 'mongoose';

const criteriaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['interviews_completed', 'streak', 'score', 'level', 'xp', 'domain_mastery'],
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  domain: String // Optional: for domain-specific achievements
});

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    default: '🏆'
  },
  criteria: {
    type: criteriaSchema,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  xpReward: {
    type: Number,
    default: 50
  },
  category: {
    type: String,
    enum: ['milestone', 'streak', 'performance', 'mastery', 'special'],
    default: 'milestone'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Predefined achievements
export const predefinedAchievements = [
  // Milestone Achievements
  {
    name: 'First Steps',
    description: 'Complete your first interview',
    icon: '🎯',
    criteria: { type: 'interviews_completed', threshold: 1 },
    rarity: 'common',
    xpReward: 50,
    category: 'milestone'
  },
  {
    name: 'Getting Started',
    description: 'Complete 5 interviews',
    icon: '🚀',
    criteria: { type: 'interviews_completed', threshold: 5 },
    rarity: 'common',
    xpReward: 100,
    category: 'milestone'
  },
  {
    name: 'Interview Enthusiast',
    description: 'Complete 10 interviews',
    icon: '⭐',
    criteria: { type: 'interviews_completed', threshold: 10 },
    rarity: 'rare',
    xpReward: 200,
    category: 'milestone'
  },
  {
    name: 'Interview Master',
    description: 'Complete 25 interviews',
    icon: '🎖️',
    criteria: { type: 'interviews_completed', threshold: 25 },
    rarity: 'epic',
    xpReward: 500,
    category: 'milestone'
  },
  {
    name: 'Interview Legend',
    description: 'Complete 50 interviews',
    icon: '👑',
    criteria: { type: 'interviews_completed', threshold: 50 },
    rarity: 'legendary',
    xpReward: 1000,
    category: 'milestone'
  },
  {
    name: 'Century Club',
    description: 'Complete 100 interviews',
    icon: '💯',
    criteria: { type: 'interviews_completed', threshold: 100 },
    rarity: 'legendary',
    xpReward: 2000,
    category: 'milestone'
  },

  // Streak Achievements
  {
    name: 'Consistent',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    criteria: { type: 'streak', threshold: 3 },
    rarity: 'common',
    xpReward: 75,
    category: 'streak'
  },
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚔️',
    criteria: { type: 'streak', threshold: 7 },
    rarity: 'rare',
    xpReward: 150,
    category: 'streak'
  },
  {
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    criteria: { type: 'streak', threshold: 30 },
    rarity: 'epic',
    xpReward: 500,
    category: 'streak'
  },
  {
    name: 'Century Champion',
    description: 'Maintain a 100-day streak',
    icon: '💎',
    criteria: { type: 'streak', threshold: 100 },
    rarity: 'legendary',
    xpReward: 2000,
    category: 'streak'
  },

  // Performance Achievements
  {
    name: 'High Achiever',
    description: 'Score 90% or above in an interview',
    icon: '🌟',
    criteria: { type: 'score', threshold: 90 },
    rarity: 'rare',
    xpReward: 200,
    category: 'performance'
  },
  {
    name: 'Perfect Score',
    description: 'Achieve a perfect 100% score',
    icon: '💫',
    criteria: { type: 'score', threshold: 100 },
    rarity: 'legendary',
    xpReward: 1000,
    category: 'performance'
  },

  // Level Achievements
  {
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    criteria: { type: 'level', threshold: 5 },
    rarity: 'common',
    xpReward: 100,
    category: 'milestone'
  },
  {
    name: 'Expert',
    description: 'Reach Level 10',
    icon: '🎯',
    criteria: { type: 'level', threshold: 10 },
    rarity: 'rare',
    xpReward: 300,
    category: 'milestone'
  },
  {
    name: 'Elite',
    description: 'Reach Level 25',
    icon: '💪',
    criteria: { type: 'level', threshold: 25 },
    rarity: 'epic',
    xpReward: 750,
    category: 'milestone'
  },
  {
    name: 'Grandmaster',
    description: 'Reach Level 50',
    icon: '👑',
    criteria: { type: 'level', threshold: 50 },
    rarity: 'legendary',
    xpReward: 2000,
    category: 'milestone'
  },

  // XP Achievements
  {
    name: 'XP Hunter',
    description: 'Earn 1,000 XP',
    icon: '✨',
    criteria: { type: 'xp', threshold: 1000 },
    rarity: 'common',
    xpReward: 100,
    category: 'milestone'
  },
  {
    name: 'XP Collector',
    description: 'Earn 5,000 XP',
    icon: '💰',
    criteria: { type: 'xp', threshold: 5000 },
    rarity: 'rare',
    xpReward: 250,
    category: 'milestone'
  },
  {
    name: 'XP Master',
    description: 'Earn 10,000 XP',
    icon: '🎁',
    criteria: { type: 'xp', threshold: 10000 },
    rarity: 'epic',
    xpReward: 500,
    category: 'milestone'
  }
];

export default mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);