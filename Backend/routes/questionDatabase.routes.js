import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import {
    submit,
    vote,
    getByCompany,
    getTrending,
    getFrequency,
    report,
    verify,
    search,
    getMyQuestions
} from '../controllers/QuestionDatabase.controller.js';

// Public routes
// GET /api/questions/trending - Get trending questions
router.get('/trending', getTrending);

// GET /api/questions/search - Search questions
router.get('/search', search);

// GET /api/questions/company/:company - Get questions by company
router.get('/company/:company', getByCompany);

// GET /api/questions/company/:company/frequency - Get question frequency stats
router.get('/company/:company/frequency', getFrequency);

// Protected routes
router.use(protect);

// POST /api/questions - Submit new question
router.post('/', submit);

// GET /api/questions/my - Get user's submitted questions
router.get('/my', getMyQuestions);

// POST /api/questions/:questionId/vote - Vote on question
router.post('/:questionId/vote', vote);

// POST /api/questions/:questionId/report - Report question
router.post('/:questionId/report', report);

// POST /api/questions/:questionId/verify - Verify question (admin only)
router.post('/:questionId/verify', verify);

export default router;

