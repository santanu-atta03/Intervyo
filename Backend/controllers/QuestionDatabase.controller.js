import {
    submitQuestion,
    voteOnQuestion,
    getQuestionsByCompany,
    getTrendingQuestions,
    getQuestionFrequency,
    reportQuestion,
    verifyQuestion,
    searchQuestions,
    getUserQuestions
} from '../services/questionDatabase.service.js';

/**
 * Submit a new interview question
 */
export const submit = async (req, res) => {
    try {
        const userId = req.user.id;
        const questionData = req.body;

        const question = await submitQuestion(userId, questionData);

        res.status(201).json({
            success: true,
            message: 'Question submitted successfully. It will be reviewed before appearing publicly.',
            data: question
        });
    } catch (error) {
        console.error('Error submitting question:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit question'
        });
    }
};

/**
 * Vote on a question
 */
export const vote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { questionId } = req.params;
        const { voteType } = req.body; // 'up' or 'down'

        const question = await voteOnQuestion(questionId, userId, voteType);

        res.status(200).json({
            success: true,
            message: 'Vote recorded successfully',
            data: question
        });
    } catch (error) {
        console.error('Error voting on question:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to vote on question'
        });
    }
};

/**
 * Get questions for a specific company
 */
export const getByCompany = async (req, res) => {
    try {
        const { company } = req.params;
        const filters = req.query;

        const questions = await getQuestionsByCompany(company, filters);

        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error('Error getting company questions:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get company questions'
        });
    }
};

/**
 * Get trending questions
 */
export const getTrending = async (req, res) => {
    try {
        const { limit } = req.query;

        const questions = await getTrendingQuestions(parseInt(limit) || 20);

        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error('Error getting trending questions:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get trending questions'
        });
    }
};

/**
 * Get question frequency statistics
 */
export const getFrequency = async (req, res) => {
    try {
        const { company } = req.params;

        const stats = await getQuestionFrequency(company);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting question frequency:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get question frequency'
        });
    }
};

/**
 * Report a question
 */
export const report = async (req, res) => {
    try {
        const userId = req.user.id;
        const { questionId } = req.params;
        const { reason } = req.body;

        const question = await reportQuestion(questionId, userId, reason);

        res.status(200).json({
            success: true,
            message: 'Question reported successfully',
            data: question
        });
    } catch (error) {
        console.error('Error reporting question:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to report question'
        });
    }
};

/**
 * Verify question (admin only)
 */
export const verify = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { questionId } = req.params;

        // TODO: Add admin role check

        const question = await verifyQuestion(questionId, adminId);

        res.status(200).json({
            success: true,
            message: 'Question verified successfully',
            data: question
        });
    } catch (error) {
        console.error('Error verifying question:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify question'
        });
    }
};

/**
 * Search questions
 */
export const search = async (req, res) => {
    try {
        const { q } = req.query;
        const filters = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const questions = await searchQuestions(q, filters);

        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error('Error searching questions:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to search questions'
        });
    }
};

/**
 * Get user's submitted questions
 */
export const getMyQuestions = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await getUserQuestions(userId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error getting user questions:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get user questions'
        });
    }
};


