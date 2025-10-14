// routes/interview.routes.js
import express from 'express';
const router = express.Router();
import interviewController from '../controllers/Interview.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

// All routes require authentication
router.use(authenticate);

// Interview CRUD
router.post('/create', aiLimiter, interviewController.createInterview);
router.post('/:interviewId/start', aiLimiter, interviewController.startInterview);
router.post('/:interviewId/answer', interviewController.submitAnswer);
router.get('/:interviewId/hint/:questionId', interviewController.getHint);
router.post('/:interviewId/emotion', interviewController.analyzeEmotion);
router.post('/:interviewId/complete', aiLimiter, interviewController.completeInterview);
router.get('/:interviewId/results', interviewController.getResults);
router.get('/history', interviewController.getInterviewHistory);
// routes/interviewRoutes.js - ADD this route

// router.get('/interview/:interviewId/results', authenticate, interviewController.getDetailedResults);

export default router;