import mongoose from 'mongoose';

const interviewCalendarSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetCompany: {
    type: String,
    required: true
  },
  interviewDate: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  interviewType: {
    type: String,
    enum: ['technical', 'behavioral', 'system-design', 'mixed'],
    default: 'technical'
  },
  
  // Preparation tracking
  preparationStartDate: {
    type: Date,
    default: Date.now
  },
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  
  // Daily recommendations
  dailyPractice: [{
    date: Date,
    recommendations: [String],
    completed: {
      type: Boolean,
      default: false
    },
    practicesDone: [String]
  }],
  
  // Progress tracking
  readinessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Notifications
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  reminderDays: {
    type: [Number],
    default: [7, 3, 1] // Days before interview to send reminders
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  outcome: {
    type: String,
    enum: ['pending', 'passed', 'failed', 'no-show'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

// Virtual for days remaining
interviewCalendarSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const diffTime = this.interviewDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for preparation duration
interviewCalendarSchema.virtual('preparationDays').get(function() {
  const diffTime = this.interviewDate - this.preparationStartDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to calculate progress percentage
interviewCalendarSchema.methods.calculateProgress = function() {
  if (this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(m => m.completed).length;
  return Math.round((completed / this.milestones.length) * 100);
};

// Method to get next milestone
interviewCalendarSchema.methods.getNextMilestone = function() {
  return this.milestones
    .filter(m => !m.completed)
    .sort((a, b) => a.targetDate - b.targetDate)[0];
};

// Index for efficient queries
interviewCalendarSchema.index({ user: 1, status: 1 });
interviewCalendarSchema.index({ interviewDate: 1 });
interviewCalendarSchema.index({ targetCompany: 1 });

export default mongoose.model('InterviewCalendar', interviewCalendarSchema);


