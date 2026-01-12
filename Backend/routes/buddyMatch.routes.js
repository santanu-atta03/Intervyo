import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import {
    findMatches,
    connect,
    getMyBuddies,
    scheduleMock,
    createGroup,
    findGroups,
    joinGroup,
    getMyGroups
} from '../controllers/BuddyMatch.controller.js';

// All routes require authentication
router.use(protect);

// Buddy matching routes
// GET /api/buddy/matches - Find compatible buddies
router.get('/matches', findMatches);

// POST /api/buddy/connect - Connect with a buddy
router.post('/connect', connect);

// GET /api/buddy/my - Get user's buddies
router.get('/my', getMyBuddies);

// POST /api/buddy/:matchId/schedule - Schedule mock interview
router.post('/:matchId/schedule', scheduleMock);

// Study group routes
// POST /api/buddy/groups - Create study group
router.post('/groups', createGroup);

// GET /api/buddy/groups - Find study groups
router.get('/groups', findGroups);

// GET /api/buddy/groups/my - Get user's study groups
router.get('/groups/my', getMyGroups);

// POST /api/buddy/groups/:groupId/join - Join study group
router.post('/groups/:groupId/join', joinGroup);

export default router;

