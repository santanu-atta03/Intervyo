import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import {
    createCalendar,
    getCalendars,
    updateMilestoneStatus,
    markPracticeComplete,
    getTimeline,
    removeCalendar
} from '../controllers/Calendar.controller.js';

// All routes require authentication
router.use(protect);

// POST /api/calendar - Create new interview calendar
router.post('/', createCalendar);

// GET /api/calendar - Get user's calendars
router.get('/', getCalendars);

// GET /api/calendar/:calendarId/timeline - Get preparation timeline
router.get('/:calendarId/timeline', getTimeline);

// PUT /api/calendar/:calendarId/milestone/:milestoneId - Update milestone
router.put('/:calendarId/milestone/:milestoneId', updateMilestoneStatus);

// PUT /api/calendar/:calendarId/practice/:practiceId - Mark practice complete
router.put('/:calendarId/practice/:practiceId', markPracticeComplete);

// DELETE /api/calendar/:calendarId - Delete calendar
router.delete('/:calendarId', removeCalendar);

export default router;

