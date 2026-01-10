import { apiConnector } from '../apiConnector';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// Buddy Matching API endpoints
export const BUDDY_ENDPOINTS = {
    FIND_MATCHES: `${BASE_URL}/buddy/matches`,
    CONNECT: `${BASE_URL}/buddy/connect`,
    GET_MY_BUDDIES: `${BASE_URL}/buddy/my`,
    SCHEDULE_MOCK: (matchId) => `${BASE_URL}/buddy/${matchId}/schedule`,
    CREATE_GROUP: `${BASE_URL}/buddy/groups`,
    FIND_GROUPS: `${BASE_URL}/buddy/groups`,
    GET_MY_GROUPS: `${BASE_URL}/buddy/groups/my`,
    JOIN_GROUP: (groupId) => `${BASE_URL}/buddy/groups/${groupId}/join`,
};

/**
 * Find compatible buddies
 */
export const findBuddies = async (preferences, token) => {
    try {
        const queryParams = new URLSearchParams(preferences).toString();
        const url = queryParams
            ? `${BUDDY_ENDPOINTS.FIND_MATCHES}?${queryParams}`
            : BUDDY_ENDPOINTS.FIND_MATCHES;

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
        console.error('FIND_BUDDIES API ERROR:', error);
        throw error;
    }
};

/**
 * Connect with a buddy
 */
export const connectWithBuddy = async (buddyData, token) => {
    try {
        const response = await apiConnector(
            'POST',
            BUDDY_ENDPOINTS.CONNECT,
            buddyData,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('CONNECT_BUDDY API ERROR:', error);
        throw error;
    }
};

/**
 * Get user's buddies
 */
export const getMyBuddies = async (status, token) => {
    try {
        const url = status
            ? `${BUDDY_ENDPOINTS.GET_MY_BUDDIES}?status=${status}`
            : BUDDY_ENDPOINTS.GET_MY_BUDDIES;

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
        console.error('GET_MY_BUDDIES API ERROR:', error);
        throw error;
    }
};

/**
 * Schedule mock interview with buddy
 */
export const scheduleMockInterview = async (matchId, interviewData, token) => {
    try {
        const response = await apiConnector(
            'POST',
            BUDDY_ENDPOINTS.SCHEDULE_MOCK(matchId),
            interviewData,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('SCHEDULE_MOCK API ERROR:', error);
        throw error;
    }
};

/**
 * Create study group
 */
export const createStudyGroup = async (groupData, token) => {
    try {
        const response = await apiConnector(
            'POST',
            BUDDY_ENDPOINTS.CREATE_GROUP,
            groupData,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('CREATE_GROUP API ERROR:', error);
        throw error;
    }
};

/**
 * Find study groups
 */
export const findStudyGroups = async (filters, token) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${BUDDY_ENDPOINTS.FIND_GROUPS}?${queryParams}`
            : BUDDY_ENDPOINTS.FIND_GROUPS;

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
        console.error('FIND_GROUPS API ERROR:', error);
        throw error;
    }
};

/**
 * Get user's study groups
 */
export const getMyStudyGroups = async (token) => {
    try {
        const response = await apiConnector(
            'GET',
            BUDDY_ENDPOINTS.GET_MY_GROUPS,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('GET_MY_GROUPS API ERROR:', error);
        throw error;
    }
};

/**
 * Join study group
 */
export const joinStudyGroup = async (groupId, token) => {
    try {
        const response = await apiConnector(
            'POST',
            BUDDY_ENDPOINTS.JOIN_GROUP(groupId),
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('JOIN_GROUP API ERROR:', error);
        throw error;
    }
};
