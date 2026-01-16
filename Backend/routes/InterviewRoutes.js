import express from "express";
import { authenticate, protect } from "../middlewares/auth.js";
import { getUserAnalytics } from "../controllers/Analytics.controller.js";
import {
  createInterview,
  getUserInterviews,
  getInterviewById,
  startInterview,
  getInterviewSession,
  endInterview,
  deleteInterview,
} from "../controllers/InterviewController.js";

const router = express.Router();

// ... your other imports and middleware
router.get("/analytics", protect, getUserAnalytics);

// Interview CRUD
router.post("/create", authenticate, createInterview);
router.get("/all", authenticate, getUserInterviews);
router.get("/:id", authenticate, getInterviewById);
router.delete("/:id", deleteInterview);

// Interview session management
router.post("/:id/start", authenticate, startInterview);
router.get("/:id/session", getInterviewSession);
router.post("/:id/end", endInterview);

export default router;
