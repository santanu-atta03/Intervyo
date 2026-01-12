import {
    getCompanyRecommendations,
    getCompanyFitAnalysis
} from '../services/companyRecommendation.service.js';

/**
 * Get personalized company recommendations for user
 */
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        const recommendations = await getCompanyRecommendations(userId);

        res.status(200).json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get company recommendations'
        });
    }
};

/**
 * Get detailed fit analysis for specific company
 */
export const getCompanyFit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { companyName } = req.params;

        const fitAnalysis = await getCompanyFitAnalysis(userId, companyName);

        res.status(200).json({
            success: true,
            data: fitAnalysis
        });
    } catch (error) {
        console.error('Error getting company fit:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get company fit analysis'
        });
    }
};


