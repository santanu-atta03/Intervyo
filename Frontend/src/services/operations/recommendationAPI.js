import { apiConnector } from '../apiConnector';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// Company Recommendation API endpoints
export const RECOMMENDATION_ENDPOINTS = {
    GET_RECOMMENDATIONS: `${BASE_URL}/recommendations`,
    GET_COMPANY_FIT: (companyName) => `${BASE_URL}/recommendations/${companyName}`,
};

/**
 * Get personalized company recommendations
 */
export const getCompanyRecommendations = async (token) => {
    try {
        const response = await apiConnector(
            'GET',
            RECOMMENDATION_ENDPOINTS.GET_RECOMMENDATIONS,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('GET_RECOMMENDATIONS API ERROR:', error);
        throw error;
    }
};

/**
 * Get detailed company fit analysis
 */
export const getCompanyFitAnalysis = async (companyName, token) => {
    try {
        const response = await apiConnector(
            'GET',
            RECOMMENDATION_ENDPOINTS.GET_COMPANY_FIT(companyName),
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response.data;
    } catch (error) {
        console.error('GET_COMPANY_FIT API ERROR:', error);
        throw error;
    }
};
