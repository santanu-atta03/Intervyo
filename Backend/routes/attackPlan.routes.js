import express from "express";
import attackPlanController from "../controllers/AttackPlan.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/**
 * Attack Plan Routes
 * 
 * AI-powered weakness prediction and personalized improvement system
 * Prefix: /api/attack-plan
 * All routes require authentication
 */

// ============================================
// ANALYSIS & GENERATION
// ============================================

/**
 * Analyze interview history and generate attack plan
 * @route POST /api/attack-plan/analyze
 * @access Private
 * @body { targetCompany?: string, targetDifficulty?: string }
 */
router.post("/analyze", authenticate, attackPlanController.analyzeAndGeneratePlan);

/**
 * Get active attack plan
 * @route GET /api/attack-plan
 * @access Private
 */
router.get("/", authenticate, attackPlanController.getActivePlan);

// ============================================
// PROGRESS TRACKING
// ============================================

/**
 * Get improvement trend
 * @route GET /api/attack-plan/trend
 * @access Private
 */
router.get("/trend", authenticate, attackPlanController.getImprovementTrend);

/**
 * Predict success for specific company/difficulty
 * @route POST /api/attack-plan/predict
 * @access Private
 * @body { company: string, difficulty: string }
 */
router.post("/predict", authenticate, attackPlanController.predictSuccess);

// ============================================
// MICRO-CHALLENGES
// ============================================

/**
 * Get all challenges
 * @route GET /api/attack-plan/challenges
 * @access Private
 * @query status (completed, pending, all)
 */
router.get("/challenges", authenticate, attackPlanController.getAllChallenges);

/**
 * Complete a micro-challenge
 * @route POST /api/attack-plan/challenge/:challengeId/complete
 * @access Private
 * @body { success: boolean }
 */
router.post(
  "/challenge/:challengeId/complete",
  authenticate,
  attackPlanController.completeChallenge
);

export default router;
