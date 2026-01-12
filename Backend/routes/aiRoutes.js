import express from 'express';
const router = express.Router();
import {
  generateQuestions,
  evaluateCandidateAnswer,
  getNextQuestion,
  completeInterview
} from '../controllers/aiController.js';
// const { protect } = require('../middleware/auth');
import { authenticate } from '../middlewares/auth.js';
import { getInterviewResults } from '../controllers/InterviewController.js';
// All routes are protected
// router.use(protect);

router.post('/generate-questions', generateQuestions);
router.post('/evaluate-answer', evaluateCandidateAnswer);
router.post('/next-question', getNextQuestion);
router.post('/complete-interview',authenticate, completeInterview);
router.get('/:interviewId/results', authenticate, getInterviewResults);

export default router;