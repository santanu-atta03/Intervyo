import InterviewCalendar from '../models/InterviewCalendar.model.js';
import User from '../models/User.model.js';
import Company from '../models/Company.model.js';

/**
 * Interview Calendar Service
 * Manages interview dates, preparation timelines, and daily recommendations
 */

/**
 * Create interview calendar entry
 * @param {String} userId - User ID
 * @param {Object} calendarData - Calendar details
 * @returns {Object} Created calendar
 */
export const createInterviewCalendar = async (userId, calendarData) => {
    try {
        const { targetCompany, interviewDate, role, interviewType } = calendarData;

        // Validate interview date is in future
        if (new Date(interviewDate) <= new Date()) {
            throw new Error('Interview date must be in the future');
        }

        // Calculate preparation timeline
        const prepDays = Math.ceil((new Date(interviewDate) - new Date()) / (1000 * 60 * 60 * 24));

        // Generate milestones based on preparation time
        const milestones = generateMilestones(prepDays, interviewType, targetCompany);

        // Create calendar entry
        const calendar = new InterviewCalendar({
            user: userId,
            targetCompany,
            interviewDate: new Date(interviewDate),
            role,
            interviewType,
            milestones,
            preparationStartDate: new Date()
        });

        await calendar.save();

        // Generate initial daily recommendations
        await generateDailyRecommendations(calendar._id);

        return calendar;
    } catch (error) {
        console.error('Error creating interview calendar:', error);
        throw error;
    }
};

/**
 * Generate preparation milestones
 * @param {Number} days - Days until interview
 * @param {String} interviewType - Type of interview
 * @param {String} company - Target company
 * @returns {Array} Milestones
 */
const generateMilestones = (days, interviewType, company) => {
    const milestones = [];
    const now = new Date();

    if (days >= 30) {
        // 30+ days preparation
        milestones.push({
            title: 'Foundation Building',
            description: 'Review fundamentals and core concepts',
            targetDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        });
        milestones.push({
            title: 'Practice Phase',
            description: 'Complete 20+ practice interviews',
            targetDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000)
        });
        milestones.push({
            title: 'Mock Interviews',
            description: `Complete 5 ${company}-specific mock interviews`,
            targetDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000)
        });
    } else if (days >= 14) {
        // 14-30 days preparation
        milestones.push({
            title: 'Intensive Practice',
            description: 'Complete 10+ practice interviews',
            targetDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        });
        milestones.push({
            title: 'Company Research',
            description: `Study ${company} interview patterns`,
            targetDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000)
        });
    } else if (days >= 7) {
        // 7-14 days preparation
        milestones.push({
            title: 'Focused Practice',
            description: 'Daily practice sessions',
            targetDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        });
        milestones.push({
            title: 'Final Review',
            description: 'Review common questions and patterns',
            targetDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
        });
    } else {
        // Less than 7 days
        milestones.push({
            title: 'Crash Course',
            description: 'Focus on most common questions',
            targetDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
        });
    }

    // Add final milestone
    milestones.push({
        title: 'Interview Day Prep',
        description: 'Rest well and review key concepts',
        targetDate: new Date(now.getTime() + (days - 1) * 24 * 60 * 60 * 1000)
    });

    return milestones;
};

/**
 * Generate daily practice recommendations
 * @param {String} calendarId - Calendar ID
 * @returns {Object} Updated calendar
 */
export const generateDailyRecommendations = async (calendarId) => {
    try {
        const calendar = await InterviewCalendar.findById(calendarId);
        if (!calendar) {
            throw new Error('Calendar not found');
        }

        const daysRemaining = calendar.daysRemaining;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if recommendations already exist for today
        const existingToday = calendar.dailyPractice.find(
            dp => dp.date.toDateString() === today.toDateString()
        );

        if (existingToday) {
            return calendar;
        }

        // Generate recommendations based on days remaining
        let recommendations = [];

        if (daysRemaining > 14) {
            recommendations = [
                'Complete 1 practice interview',
                'Study 2 technical concepts',
                'Review 5 behavioral questions',
                'Practice coding for 30 minutes'
            ];
        } else if (daysRemaining > 7) {
            recommendations = [
                'Complete 2 practice interviews',
                `Review ${calendar.targetCompany} interview questions`,
                'Practice system design problem',
                'Mock interview with a peer'
            ];
        } else if (daysRemaining > 3) {
            recommendations = [
                'Complete 1 full mock interview',
                'Review your weak areas',
                `Study ${calendar.targetCompany} culture and values`,
                'Practice common questions'
            ];
        } else {
            recommendations = [
                'Light practice only',
                'Review key concepts',
                'Rest and stay confident',
                'Prepare questions for interviewer'
            ];
        }

        calendar.dailyPractice.push({
            date: today,
            recommendations,
            completed: false
        });

        await calendar.save();
        return calendar;
    } catch (error) {
        console.error('Error generating daily recommendations:', error);
        throw error;
    }
};

/**
 * Get user's interview calendars
 * @param {String} userId - User ID
 * @param {String} status - Filter by status
 * @returns {Array} Calendars
 */
export const getUserCalendars = async (userId, status = 'active') => {
    try {
        const query = { user: userId };
        if (status) {
            query.status = status;
        }

        const calendars = await InterviewCalendar.find(query)
            .sort({ interviewDate: 1 });

        // Generate daily recommendations for active calendars
        for (const calendar of calendars) {
            if (calendar.status === 'active') {
                await generateDailyRecommendations(calendar._id);
            }
        }

        return calendars;
    } catch (error) {
        console.error('Error getting user calendars:', error);
        throw error;
    }
};

/**
 * Update calendar milestone
 * @param {String} calendarId - Calendar ID
 * @param {String} milestoneId - Milestone ID
 * @param {Boolean} completed - Completion status
 * @returns {Object} Updated calendar
 */
export const updateMilestone = async (calendarId, milestoneId, completed) => {
    try {
        const calendar = await InterviewCalendar.findById(calendarId);
        if (!calendar) {
            throw new Error('Calendar not found');
        }

        const milestone = calendar.milestones.id(milestoneId);
        if (!milestone) {
            throw new Error('Milestone not found');
        }

        milestone.completed = completed;
        if (completed) {
            milestone.completedAt = new Date();
        }

        calendar.lastUpdated = new Date();
        await calendar.save();

        return calendar;
    } catch (error) {
        console.error('Error updating milestone:', error);
        throw error;
    }
};

/**
 * Mark daily practice as completed
 * @param {String} calendarId - Calendar ID
 * @param {String} practiceId - Daily practice ID
 * @param {Array} practicesDone - Completed practices
 * @returns {Object} Updated calendar
 */
export const completeDailyPractice = async (calendarId, practiceId, practicesDone) => {
    try {
        const calendar = await InterviewCalendar.findById(calendarId);
        if (!calendar) {
            throw new Error('Calendar not found');
        }

        const practice = calendar.dailyPractice.id(practiceId);
        if (!practice) {
            throw new Error('Daily practice not found');
        }

        practice.completed = true;
        practice.practicesDone = practicesDone;

        await calendar.save();
        return calendar;
    } catch (error) {
        console.error('Error completing daily practice:', error);
        throw error;
    }
};

/**
 * Get preparation timeline
 * @param {String} calendarId - Calendar ID
 * @returns {Object} Timeline data
 */
export const getPreparationTimeline = async (calendarId) => {
    try {
        const calendar = await InterviewCalendar.findById(calendarId);
        if (!calendar) {
            throw new Error('Calendar not found');
        }

        const progress = calendar.calculateProgress();
        const nextMilestone = calendar.getNextMilestone();

        return {
            daysRemaining: calendar.daysRemaining,
            preparationDays: calendar.preparationDays,
            progress,
            nextMilestone,
            milestones: calendar.milestones,
            dailyPractice: calendar.dailyPractice.slice(-7), // Last 7 days
            readinessScore: calendar.readinessScore
        };
    } catch (error) {
        console.error('Error getting preparation timeline:', error);
        throw error;
    }
};

/**
 * Delete calendar
 * @param {String} calendarId - Calendar ID
 * @param {String} userId - User ID
 * @returns {Object} Deleted calendar
 */
export const deleteCalendar = async (calendarId, userId) => {
    try {
        const calendar = await InterviewCalendar.findOneAndDelete({
            _id: calendarId,
            user: userId
        });

        if (!calendar) {
            throw new Error('Calendar not found or unauthorized');
        }

        return calendar;
    } catch (error) {
        console.error('Error deleting calendar:', error);
        throw error;
    }
};




