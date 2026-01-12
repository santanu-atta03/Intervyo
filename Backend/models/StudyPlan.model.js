const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  estimatedTime: Number,
});

const dailyTaskSchema = new mongoose.Schema({
  day: Number,
  topics: [String],
  resources: [resourceSchema],
  practiceQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  ],
});

const progressSchema = new mongoose.Schema({
  currentDay: Number,
  completedTasks: [Number],
  nextReviewDate: Date,
});

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  generatedAfterInterview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview",
  },
  plan: {
    duration: Number,
    weakAreas: [String],
    dailyTasks: [dailyTaskSchema],
  },
  progress: progressSchema,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StudyPlan", studyPlanSchema);
