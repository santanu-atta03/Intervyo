import express from "express";
import emotionController from "../controllers/EmotionAnalysis.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Store real-time emotion metrics
router.post(
  "/:interviewId/emotion-metrics",
  authenticate,
  emotionController.storeEmotionMetrics,
);

// Get emotion summary
router.get(
  "/:interviewId/emotion-summary",
  authenticate,
  emotionController.getEmotionSummary,
);

// Generate emotion-based feedback
router.post(
  "/:interviewId/emotion-feedback",
  authenticate,
  emotionController.generateEmotionFeedback,
);

export default router;
