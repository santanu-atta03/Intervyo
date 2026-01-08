import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
  },
  
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  unsubscribedAt: {
    type: Date,
    default: null,
  },
  
  // Track if this email is associated with a registered user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  
  // For tracking engagement
  emailsSent: {
    type: Number,
    default: 0,
  },
  
  lastEmailSentAt: {
    type: Date,
    default: null,
  },
});

// Index for faster queries
newsletterSchema.index({ email: 1, isActive: 1 });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);
