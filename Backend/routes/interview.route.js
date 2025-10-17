// routes/interview.routes.js - COMPLETE FIXED VERSION

import express from 'express';
const router = express.Router();
import interviewController from '../controllers/Interview.controller.js';
import RealTimeAiInterviewController from '../controllers/RealTimeAiInterview.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

// All routes require authentication
router.use(authenticate);

// ==================== INTERVIEW SETUP ====================
// Create new interview
router.post('/create', aiLimiter, interviewController.createInterview);

// Start regular interview (non-conversational)
router.post('/:interviewId/start', aiLimiter, interviewController.startInterview);

// ==================== REAL-TIME AI INTERVIEW ====================
// Start conversational AI interview (NEW)
router.post('/:interviewId/start-conversation', aiLimiter, RealTimeAiInterviewController.startConversation);

// Ask next question in AI interview
router.post('/:interviewId/ask-next-question', RealTimeAiInterviewController.askNextQuestion);

// Get real-time AI response during conversation
router.post('/:interviewId/real-time-response', RealTimeAiInterviewController.getRealTimeResponse);

// Evaluate code submission
router.post('/:interviewId/evaluate-code', RealTimeAiInterviewController.evaluateCode);

// Submit answer and move to next question
router.post('/:interviewId/submit-answer', RealTimeAiInterviewController.submitAnswer);

// ==================== REGULAR INTERVIEW ACTIONS ====================
// Submit answer (regular interview)
router.post('/:interviewId/answer', interviewController.submitAnswer);

// Get hint
router.get('/:interviewId/hint/:questionId', interviewController.getHint);

// Analyze emotion from video
router.post('/:interviewId/emotion', interviewController.analyzeEmotion);

// ==================== COMPLETE & RESULTS ====================
// Complete interview
router.post('/:interviewId/complete', aiLimiter, interviewController.completeInterview);

// Get interview results
router.get('/:interviewId/results', interviewController.getResults);

// Get detailed results
router.get('/:interviewId/detailed-results', interviewController.getDetailedResults);

// ==================== HISTORY ====================
// Get interview history
router.get('/history', interviewController.getInterviewHistory);

export default router;