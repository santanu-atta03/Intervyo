// backend/models/Chatbot.model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatbotConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [messageSchema],
  context: {
    type: String,
    enum: ['general', 'interview-prep', 'technical-help', 'career-advice'],
    default: 'general'
  },
  metadata: {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview'
    },
    domain: String,
    tags: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
chatbotConversationSchema.index({ userId: 1, sessionId: 1 });
chatbotConversationSchema.index({ userId: 1, isActive: 1, lastActivity: -1 });

// Update lastActivity on any message addition
chatbotConversationSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

const ChatbotConversation = mongoose.model('ChatbotConversation', chatbotConversationSchema);

export default ChatbotConversation;