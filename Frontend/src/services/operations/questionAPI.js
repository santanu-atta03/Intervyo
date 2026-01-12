import { apiConnector } from '../apiConnector';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// Question Database API endpoints
export const QUESTION_ENDPOINTS = {
    SUBMIT_QUESTION: `${BASE_URL}/questions`,
    GET_TRENDING: `${BASE_URL}/questions/trending`,
    SEARCH_QUESTIONS: `${BASE_URL}/questions/search`,
    GET_BY_COMPANY: (company) => `${BASE_URL}/questions/company/${company}`,
    GET_FREQUENCY: (company) => `${BASE_URL}/questions/company/${company}/frequency`,
    GET_MY_QUESTIONS: `${BASE_URL}/questions/my`,
    VOTE_QUESTION: (questionId) => `${BASE_URL}/questions/${questionId}/vote`,
    REPORT_QUESTION: (questionId) => `${BASE_URL}/questions/${questionId}/report`,
};

/**
 * Submit a new question
 */
export const submitQuestion = async (questionData, token) => {
    try {
        const response = await apiConnector(
            'POST',
            QUESTION_ENDPOINTS.SUBMIT_QUESTION,
            questionData,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('SUBMIT_QUESTION API ERROR:', error);
        throw error;
    }
};

/**
 * Get trending questions
 */
export const getTrendingQuestions = async (limit = 20) => {
    try {
        const response = await apiConnector(
            'GET',
            `${QUESTION_ENDPOINTS.GET_TRENDING}?limit=${limit}`,
            null
        );
        return response.data;
    } catch (error) {
        console.error('GET_TRENDING API ERROR:', error);
        throw error;
    }
};

/**
 * Get questions by company
 */
export const getQuestionsByCompany = async (company, filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${QUESTION_ENDPOINTS.GET_BY_COMPANY(company)}?${queryParams}`
            : QUESTION_ENDPOINTS.GET_BY_COMPANY(company);

        const response = await apiConnector('GET', url, null);
        return response.data;
    } catch (error) {
        console.error('GET_BY_COMPANY API ERROR:', error);
        throw error;
    }
};

/**
 * Get question frequency statistics
 */
export const getQuestionFrequency = async (company) => {
    try {
        const response = await apiConnector(
            'GET',
            QUESTION_ENDPOINTS.GET_FREQUENCY(company),
            null
        );
        return response.data;
    } catch (error) {
        console.error('GET_FREQUENCY API ERROR:', error);
        throw error;
    }
};

/**
 * Search questions
 */
export const searchQuestions = async (searchTerm, filters = {}) => {
    try {
        const queryParams = new URLSearchParams({ q: searchTerm, ...filters }).toString();
        const response = await apiConnector(
            'GET',
            `${QUESTION_ENDPOINTS.SEARCH_QUESTIONS}?${queryParams}`,
            null
        );
        return response.data;
    } catch (error) {
        console.error('SEARCH_QUESTIONS API ERROR:', error);
        throw error;
    }
};

/**
 * Vote on a question
 */
export const voteOnQuestion = async (questionId, voteType, token) => {
    try {
        const response = await apiConnector(
            'POST',
            QUESTION_ENDPOINTS.VOTE_QUESTION(questionId),
            { voteType },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('VOTE_QUESTION API ERROR:', error);
        throw error;
    }
};

/**
 * Report a question
 */
export const reportQuestion = async (questionId, reason, token) => {
    try {
        const response = await apiConnector(
            'POST',
            QUESTION_ENDPOINTS.REPORT_QUESTION(questionId),
            { reason },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('REPORT_QUESTION API ERROR:', error);
        throw error;
    }
};

/**
 * Get user's submitted questions
 */
export const getMyQuestions = async (token) => {
    try {
        const response = await apiConnector(
            'GET',
            QUESTION_ENDPOINTS.GET_MY_QUESTIONS,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('GET_MY_QUESTIONS API ERROR:', error);
        throw error;
    }
};
