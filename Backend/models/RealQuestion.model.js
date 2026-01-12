import mongoose from 'mongoose';

const realQuestionSchema = new mongoose.Schema({
    // Question details
    question: {
        type: String,
        required: true,
        trim: true
    },
    questionType: {
        type: String,
        enum: ['technical', 'behavioral', 'system-design', 'coding', 'other'],
        required: true
    },

    // Company information
    company: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'staff', 'principal'],
        default: 'mid'
    },

    // Interview context
    interviewRound: {
        type: String,
        enum: ['phone-screen', 'technical-1', 'technical-2', 'system-design', 'behavioral', 'bar-raiser', 'final'],
        default: 'technical-1'
    },
    interviewDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        enum: ['onsite', 'remote', 'hybrid'],
        default: 'remote'
    },

    // Submission details
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },

    // Verification and quality
    verified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: Date,

    // Voting system
    upvotes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],
    downvotes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Frequency tracking
    timesAsked: {
        type: Number,
        default: 1
    },
    lastAskedDate: {
        type: Date,
        default: Date.now
    },

    // Additional metadata
    tags: [String],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        default: 'medium'
    },
    expectedDuration: Number, // in minutes

    // Additional context
    followUpQuestions: [String],
    hints: [String],
    sampleAnswer: String,
    notes: String,

    // Moderation
    reported: {
        type: Boolean,
        default: false
    },
    reportCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'rejected', 'archived'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Virtual for vote score
realQuestionSchema.virtual('voteScore').get(function () {
    return this.upvotes.length - this.downvotes.length;
});

// Virtual for popularity score
realQuestionSchema.virtual('popularityScore').get(function () {
    const voteScore = this.upvotes.length - this.downvotes.length;
    const recencyBonus = Math.max(0, 30 - Math.floor((Date.now() - this.lastAskedDate) / (1000 * 60 * 60 * 24)));
    return (voteScore * 10) + (this.timesAsked * 5) + recencyBonus;
});

// Method to check if user has voted
realQuestionSchema.methods.hasUserVoted = function (userId) {
    const upvoted = this.upvotes.some(v => v.user.toString() === userId.toString());
    const downvoted = this.downvotes.some(v => v.user.toString() === userId.toString());
    return { upvoted, downvoted };
};

// Method to add vote
realQuestionSchema.methods.addVote = function (userId, voteType) {
    const { upvoted, downvoted } = this.hasUserVoted(userId);

    // Remove existing vote if any
    if (upvoted) {
        this.upvotes = this.upvotes.filter(v => v.user.toString() !== userId.toString());
    }
    if (downvoted) {
        this.downvotes = this.downvotes.filter(v => v.user.toString() !== userId.toString());
    }

    // Add new vote
    if (voteType === 'up' && !upvoted) {
        this.upvotes.push({ user: userId });
    } else if (voteType === 'down' && !downvoted) {
        this.downvotes.push({ user: userId });
    }
};

// Indexes for efficient queries
realQuestionSchema.index({ company: 1, status: 1 });
realQuestionSchema.index({ questionType: 1, company: 1 });
realQuestionSchema.index({ verified: 1, status: 1 });
realQuestionSchema.index({ submittedBy: 1 });
realQuestionSchema.index({ tags: 1 });

export default mongoose.model('RealQuestion', realQuestionSchema);


