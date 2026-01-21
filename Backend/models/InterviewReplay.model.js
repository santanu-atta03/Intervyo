import mongoose from "mongoose";

/**
 * Interview Replay Model
 * 
 * Allows users to review completed interviews with:
 * - Full conversation playback
 * - Timestamped personal notes
 * - Bookmarks for important moments
 * - Search within conversation
 * - Performance insights at specific timestamps
 */

const replayNoteSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Number,
      required: true,
      min: 0,
      description: "Time in seconds from interview start",
    },
    conversationIndex: {
      type: Number,
      required: true,
      min: 0,
      description: "Index in conversation array this note refers to",
    },
    noteText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: [
        "improvement",
        "strength",
        "mistake",
        "learning",
        "question-analysis",
        "general",
      ],
      default: "general",
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: "Maximum 10 tags allowed per note",
      },
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const interviewReplaySchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },

    // Replay Metadata
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastViewedAt: {
      type: Date,
      default: null,
    },
    totalWatchTime: {
      type: Number,
      default: 0,
      min: 0,
      description: "Total time spent reviewing in seconds",
    },

    // User Notes & Bookmarks
    notes: {
      type: [replayNoteSchema],
      default: [],
      validate: {
        validator: function (notes) {
          return notes.length <= 100;
        },
        message: "Maximum 100 notes allowed per interview",
      },
    },

    // Quick Bookmarks (for fast navigation)
    bookmarks: [
      {
        conversationIndex: {
          type: Number,
          required: true,
        },
        label: {
          type: String,
          required: true,
          maxlength: 100,
        },
        timestamp: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: ["question", "answer", "feedback", "highlight", "custom"],
          default: "custom",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Insights Tracking
    insights: {
      mostReviewedSection: {
        type: String,
        default: "",
        description: "Which part user reviewed most (e.g., 'Technical Questions')",
      },
      improvementAreas: {
        type: [String],
        default: [],
      },
      strengthAreas: {
        type: [String],
        default: [],
      },
    },

    // Replay Progress
    lastPlaybackPosition: {
      conversationIndex: {
        type: Number,
        default: 0,
      },
      timestamp: {
        type: Number,
        default: 0,
      },
    },

    // Privacy & Sharing
    isPublic: {
      type: Boolean,
      default: false,
      description: "Allow sharing replay with mentors or study buddies",
    },
    shareToken: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      description: "Unique token for sharing replay link",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
interviewReplaySchema.index({ userId: 1, createdAt: -1 });
interviewReplaySchema.index({ interviewId: 1 });
interviewReplaySchema.index({ shareToken: 1 });
interviewReplaySchema.index({ "notes.category": 1 });
interviewReplaySchema.index({ "notes.tags": 1 });

// Virtual: Total notes count
interviewReplaySchema.virtual("notesCount").get(function () {
  return this.notes?.length || 0;
});

// Virtual: Bookmarks count
interviewReplaySchema.virtual("bookmarksCount").get(function () {
  return this.bookmarks?.length || 0;
});

// Methods

/**
 * Add a note to the replay
 */
interviewReplaySchema.methods.addNote = function (noteData) {
  if (this.notes.length >= 100) {
    throw new Error("Maximum 100 notes allowed per interview");
  }

  const note = {
    ...noteData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  this.notes.push(note);
  return this.save();
};

/**
 * Update an existing note
 */
interviewReplaySchema.methods.updateNote = function (noteId, updates) {
  const note = this.notes.id(noteId);
  if (!note) {
    throw new Error("Note not found");
  }

  Object.assign(note, updates, { updatedAt: new Date() });
  return this.save();
};

/**
 * Delete a note
 */
interviewReplaySchema.methods.deleteNote = function (noteId) {
  const note = this.notes.id(noteId);
  if (!note) {
    throw new Error("Note not found");
  }

  note.remove();
  return this.save();
};

/**
 * Add a bookmark
 */
interviewReplaySchema.methods.addBookmark = function (bookmarkData) {
  if (this.bookmarks.length >= 50) {
    throw new Error("Maximum 50 bookmarks allowed per interview");
  }

  this.bookmarks.push({
    ...bookmarkData,
    createdAt: new Date(),
  });
  return this.save();
};

/**
 * Update view tracking
 */
interviewReplaySchema.methods.trackView = function (watchDuration = 0) {
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  this.totalWatchTime += watchDuration;
  return this.save();
};

/**
 * Generate share token
 */
interviewReplaySchema.methods.generateShareToken = function () {
  const crypto = require("crypto");
  this.shareToken = crypto.randomBytes(32).toString("hex");
  this.isPublic = true;
  return this.save();
};

/**
 * Revoke share access
 */
interviewReplaySchema.methods.revokeShare = function () {
  this.shareToken = null;
  this.isPublic = false;
  return this.save();
};

// Static Methods

/**
 * Get or create replay for an interview
 */
interviewReplaySchema.statics.getOrCreate = async function (
  interviewId,
  userId,
  sessionId
) {
  let replay = await this.findOne({ interviewId, userId });

  if (!replay) {
    replay = await this.create({
      interviewId,
      userId,
      sessionId,
    });
  }

  return replay;
};

/**
 * Get replay with populated interview and session data
 */
interviewReplaySchema.statics.getReplayWithData = async function (
  replayId,
  userId
) {
  return this.findOne({ _id: replayId, userId })
    .populate({
      path: "interviewId",
      select: "role difficulty duration overallScore completedAt status",
    })
    .populate({
      path: "sessionId",
      select: "conversation questionEvaluations technicalScore communicationScore",
    });
};

/**
 * Search notes within replays
 */
interviewReplaySchema.statics.searchNotes = async function (userId, searchQuery) {
  return this.find({
    userId,
    $or: [
      { "notes.noteText": { $regex: searchQuery, $options: "i" } },
      { "notes.tags": { $regex: searchQuery, $options: "i" } },
    ],
  })
    .populate("interviewId", "role difficulty completedAt")
    .select("interviewId notes createdAt");
};

const InterviewReplay = mongoose.model("InterviewReplay", interviewReplaySchema);

export default InterviewReplay;
