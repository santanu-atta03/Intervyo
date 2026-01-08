import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  // ========================================
  // AUTHENTICATION FIELDS
  // ========================================
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local';
    },
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  
  // ========================================
  // OAUTH PROVIDER IDs
  // ========================================
  googleId: {
    type: String,
    sparse: true,
  },
  githubId: {
    type: String,
    sparse: true,
  },
  
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local',
  },
  
  isVerified: {
    type: Boolean,
    default: false,
  },
  
  // Reference to Profile model
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    // required : true,
    ref: 'Profile',
  },
  
  // ========================================
  // GAMIFICATION
  // ========================================
  stats: {
    totalInterviews: {
      type: Number,
      default: 0,
    },
    xpPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastInterviewDate: Date,

    earnedAchievements: [{
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    notified: {
      type: Boolean,
      default: false
    }
  }],
    badges: [{
      name: String,
      earnedAt: Date,
      icon: String,
    }],
  },
  
  // ========================================
  // SUBSCRIPTION
  // ========================================
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    startDate: Date,
    endDate: Date,
    interviewsRemaining: {
      type: Number,
      default: 2,
    },
  },
  
  // ========================================
  // PASSWORD RESET
  // ========================================
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ========================================
// HASH PASSWORD BEFORE SAVING
// ========================================
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.authProvider !== 'local') {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ========================================
// METHOD: Compare password
// ========================================
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ========================================
// METHOD: Generate JWT Token
// ========================================
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export default mongoose.models.User || mongoose.model('User', userSchema);