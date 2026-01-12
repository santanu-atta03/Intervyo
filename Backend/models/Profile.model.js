import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Add this to ensure one profile per user
    },

    // ========================================
    // PERSONAL INFORMATION
    // ========================================
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    age: {
      type: Number,
      min: 16,
      max: 100,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
    },

    // ========================================
    // PROFESSIONAL INFORMATION
    // ========================================
    domain: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "fullstack",
        "data-science",
        "devops",
        "mobile",
        "ml",
        "blockchain",
      ],
    },
    experience: {
      type: Number,
      min: 0,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    linkedIn: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
    },

    // ========================================
    // EDUCATION
    // ========================================
    education: [
      {
        degree: {
          type: String,
          required: true,
        },
        institution: {
          type: String,
          required: true,
        },
        field: String,
        startYear: String,
        endYear: String,
        grade: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ========================================
    // CERTIFICATES
    // ========================================
    certificates: [
      {
        name: {
          type: String,
          required: true,
        },
        issuer: {
          type: String,
          required: true,
        },
        issueDate: Date,
        credentialId: String,
        url: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ========================================
    // ACHIEVEMENTS
    // ========================================
    achievements: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        date: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Update the updatedAt field on save
profileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// models/Profile.model.js - at the end
export default mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);
