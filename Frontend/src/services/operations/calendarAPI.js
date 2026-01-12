import { apiConnector } from '../apiConnector';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// Calendar API endpoints
export const CALENDAR_ENDPOINTS = {
    CREATE_CALENDAR: `${BASE_URL}/calendar`,
    GET_CALENDARS: `${BASE_URL}/calendar`,
    GET_TIMELINE: (calendarId) => `${BASE_URL}/calendar/${calendarId}/timeline`,
    UPDATE_MILESTONE: (calendarId, milestoneId) =>
        `${BASE_URL}/calendar/${calendarId}/milestone/${milestoneId}`,
    COMPLETE_PRACTICE: (calendarId, practiceId) =>
        `${BASE_URL}/calendar/${calendarId}/practice/${practiceId}`,
    DELETE_CALENDAR: (calendarId) => `${BASE_URL}/calendar/${calendarId}`,
};

/**
 * Create interview calendar
 */
export const createInterviewCalendar = async (calendarData, token) => {
    try {
        const response = await apiConnector(
            'POST',
            CALENDAR_ENDPOINTS.CREATE_CALENDAR,
            calendarData,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('CREATE_CALENDAR API ERROR:', error);
        throw error;
    }
};

/**
 * Get user's calendars
 */
export const getUserCalendars = async (status, token) => {
    try {
        const url = status
            ? `${CALENDAR_ENDPOINTS.GET_CALENDARS}?status=${status}`
            : CALENDAR_ENDPOINTS.GET_CALENDARS;

        const response = await apiConnector(
            'GET',
            url,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('GET_CALENDARS API ERROR:', error);
        throw error;
    }
};

/**
 * Get preparation timeline
 */
export const getPreparationTimeline = async (calendarId, token) => {
    try {
        const response = await apiConnector(
            'GET',
            CALENDAR_ENDPOINTS.GET_TIMELINE(calendarId),
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('GET_TIMELINE API ERROR:', error);
        throw error;
    }
};

/**
 * Update milestone status
 */
export const updateMilestone = async (calendarId, milestoneId, completed, token) => {
    try {
        const response = await apiConnector(
            'PUT',
            CALENDAR_ENDPOINTS.UPDATE_MILESTONE(calendarId, milestoneId),
            { completed },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('UPDATE_MILESTONE API ERROR:', error);
        throw error;
    }
};

/**
 * Mark daily practice as complete
 */
export const completeDailyPractice = async (calendarId, practiceId, practicesDone, token) => {
    try {
        const response = await apiConnector(
            'PUT',
            CALENDAR_ENDPOINTS.COMPLETE_PRACTICE(calendarId, practiceId),
            { practicesDone },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('COMPLETE_PRACTICE API ERROR:', error);
        throw error;
    }
};

/**
 * Delete calendar
 */
export const deleteCalendar = async (calendarId, token) => {
    try {
        const response = await apiConnector(
            'DELETE',
            CALENDAR_ENDPOINTS.DELETE_CALENDAR(calendarId),
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('DELETE_CALENDAR API ERROR:', error);
        throw error;
    }
};
