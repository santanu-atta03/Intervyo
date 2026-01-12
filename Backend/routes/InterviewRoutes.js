import express from "express";
const router = express.Router();
import {
  createInterview,
  getUserInterviews,
  getInterviewById,
  startInterview,
  getInterviewSession,
  endInterview,
  deleteInterview,
} from "../controllers/InterviewController.js";
// const { protect } = require('../middleware/auth');
import { authenticate } from "../middlewares/auth.js";

// All routes require authentication
// router.use(protect);

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
