import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  },
  strengths: [String],
  improvements: [String]
}, {
  timestamps: true
});

export default mongoose.model('Interview', interviewSchema);