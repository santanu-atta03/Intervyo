// models/Interview.js
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
    type: Number,
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  resumeText: String, // Extracted text from resume
  
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  scheduledAt: {
    type: Date,
    required: true
  },
  startedAt: Date,
  completedAt: Date,
  
  // Scores (stored after completion)
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  technicalScore: {
    type: Number,
    min: 0,
    max: 10
  },
  communicationScore: {
    type: Number,
    min: 0,
    max: 10
  },
  problemSolvingScore: {
    type: Number,
    min: 0,
    max: 10
  },
  
  // Summary feedback
  feedback: String,
  strengths: [String],
  improvements: [String],
  
  // Reference to session for detailed data
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession'
  },
  
  // Certificate information (generated after completion)
  certificate: {
    certificateId: String,
    issuedAt: Date,
    validUntil: Date,
    verificationCode: String,
    shareableLink: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Interview', interviewSchema);