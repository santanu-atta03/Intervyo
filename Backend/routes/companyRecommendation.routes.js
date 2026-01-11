import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import {
    getRecommendations,
    getCompanyFit
} from '../controllers/CompanyRecommendation.controller.js';

// All routes require authentication
router.use(protect);

// GET /api/recommendations - Get personalized company recommendations
router.get('/', getRecommendations);

// GET /api/recommendations/:companyName - Get detailed fit analysis for specific company
router.get('/:companyName', getCompanyFit);

export default router;
