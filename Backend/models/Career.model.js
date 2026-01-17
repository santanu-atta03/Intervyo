import mongoose from "mongoose";

const jobListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Remote", "Internship"],
    default: "Full-time",
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
  salaryRange: {
    type: String,
    trim: true,
  },
  applicationUrl: {
    type: String,
    required: true,
    trim: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const careerResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Article", "Video", "Webinar", "Guide"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Can be text or a URL
  },
  category: {
    type: String,
    enum: ["Resume Tips", "Interview Prep", "Career Growth", "Job Search"],
    required: true,
  },
  author: {
    type: String,
    trim: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
    type: String,
  }
});

const JobListing = mongoose.model("JobListing", jobListingSchema);
const CareerResource = mongoose.model("CareerResource", careerResourceSchema);

export { JobListing, CareerResource };
