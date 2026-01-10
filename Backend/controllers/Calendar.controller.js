import {
    createInterviewCalendar,
    getUserCalendars,
    updateMilestone,
    completeDailyPractice,
    getPreparationTimeline,
    deleteCalendar
} from '../services/calendarService.js';

/**
 * Create new interview calendar
 */
export const createCalendar = async (req, res) => {
    try {
        const userId = req.user.id;
        const calendarData = req.body;

        const calendar = await createInterviewCalendar(userId, calendarData);

        res.status(201).json({
            success: true,
            message: 'Interview calendar created successfully',
            data: calendar
        });
    } catch (error) {
        console.error('Error creating calendar:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create interview calendar'
        });
    }
};

/**
 * Get user's calendars
 */
export const getCalendars = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const calendars = await getUserCalendars(userId, status);

        res.status(200).json({
            success: true,
            data: calendars
        });
    } catch (error) {
        console.error('Error getting calendars:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get calendars'
        });
    }
};

/**
 * Update milestone status
 */
export const updateMilestoneStatus = async (req, res) => {
    try {
        const { calendarId, milestoneId } = req.params;
        const { completed } = req.body;

        const calendar = await updateMilestone(calendarId, milestoneId, completed);

        res.status(200).json({
            success: true,
            message: 'Milestone updated successfully',
            data: calendar
        });
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update milestone'
        });
    }
};

/**
 * Mark daily practice as completed
 */
export const markPracticeComplete = async (req, res) => {
    try {
        const { calendarId, practiceId } = req.params;
        const { practicesDone } = req.body;

        const calendar = await completeDailyPractice(calendarId, practiceId, practicesDone);

        res.status(200).json({
            success: true,
            message: 'Daily practice marked as complete',
            data: calendar
        });
    } catch (error) {
        console.error('Error marking practice complete:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to mark practice complete'
        });
    }
};

/**
 * Get preparation timeline
 */
export const getTimeline = async (req, res) => {
    try {
        const { calendarId } = req.params;

        const timeline = await getPreparationTimeline(calendarId);

        res.status(200).json({
            success: true,
            data: timeline
        });
    } catch (error) {
        console.error('Error getting timeline:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get preparation timeline'
        });
    }
};

/**
 * Delete calendar
 */
export const removeCalendar = async (req, res) => {
    try {
        const userId = req.user.id;
        const { calendarId } = req.params;

        const calendar = await deleteCalendar(calendarId, userId);

        res.status(200).json({
            success: true,
            message: 'Calendar deleted successfully',
            data: calendar
        });
    } catch (error) {
        console.error('Error deleting calendar:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete calendar'
        });
    }
};


