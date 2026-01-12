import mongoose from 'mongoose';

const buddyMatchSchema = new mongoose.Schema({
    // User pairing
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Match details
    targetCompany: String,
    targetRole: String,
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    // Connection status
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending'
    },
    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    connectedAt: Date,

    // Study group
    studyGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyGroup'
    },

    // Mock interviews scheduled
    mockInterviews: [{
        scheduledDate: Date,
        duration: Number,
        interviewType: String,
        completed: {
            type: Boolean,
            default: false
        },
        feedback: String,
        rating: Number
    }],

    // Activity tracking
    lastInteraction: {
        type: Date,
        default: Date.now
    },
    totalSessions: {
        type: Number,
        default: 0
    },

    // Preferences
    preferences: {
        communicationFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'flexible'],
            default: 'flexible'
        },
        preferredTimes: [String],
        timezone: String
    },

    // Notes
    notes: String
}, {
    timestamps: true
});

// Study Group Schema
const studyGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,

    // Group details
    targetCompany: String,
    targetRole: String,
    focusAreas: [String],

    // Members
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }],
    maxMembers: {
        type: Number,
        default: 10
    },

    // Activity
    sessions: [{
        title: String,
        scheduledDate: Date,
        duration: Number,
        type: {
            type: String,
            enum: ['mock-interview', 'study-session', 'discussion', 'code-review']
        },
        attendees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        notes: String
    }],

    // Resources
    resources: [{
        title: String,
        url: String,
        type: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Settings
    isPrivate: {
        type: Boolean,
        default: false
    },
    requireApproval: {
        type: Boolean,
        default: true
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for current member count
studyGroupSchema.virtual('memberCount').get(function () {
    return this.members.length;
});

// Virtual for available slots
studyGroupSchema.virtual('availableSlots').get(function () {
    return this.maxMembers - this.members.length;
});

// Method to check if user is member
studyGroupSchema.methods.isMember = function (userId) {
    return this.members.some(m => m.user.toString() === userId.toString());
};

// Method to check if user is admin
studyGroupSchema.methods.isAdmin = function (userId) {
    const member = this.members.find(m => m.user.toString() === userId.toString());
    return member && member.role === 'admin';
};

// Indexes
buddyMatchSchema.index({ user1: 1, user2: 1 }, { unique: true });
buddyMatchSchema.index({ status: 1 });
buddyMatchSchema.index({ targetCompany: 1 });

studyGroupSchema.index({ targetCompany: 1, status: 1 });
studyGroupSchema.index({ creator: 1 });
studyGroupSchema.index({ 'members.user': 1 });

const BuddyMatch = mongoose.model('BuddyMatch', buddyMatchSchema);
const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export { BuddyMatch, StudyGroup };

