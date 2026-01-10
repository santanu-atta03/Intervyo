import RealQuestion from '../models/RealQuestion.model.js';
import User from '../models/User.model.js';

/**
 * Question Database Service
 * Manages crowdsourced interview questions with verification and voting
 */

/**
 * Submit a new question
 * @param {String} userId - User ID
 * @param {Object} questionData - Question details
 * @returns {Object} Created question
 */
export const submitQuestion = async (userId, questionData) => {
    try {
        const {
            question,
            questionType,
            company,
            role,
            level,
            interviewRound,
            interviewDate,
            location,
            tags,
            difficulty,
            expectedDuration,
            followUpQuestions,
            hints,
            notes
        } = questionData;

        const newQuestion = new RealQuestion({
            question,
            questionType,
            company,
            role,
            level: level || 'mid',
            interviewRound: interviewRound || 'technical-1',
            interviewDate: new Date(interviewDate),
            location: location || 'remote',
            submittedBy: userId,
            tags: tags || [],
            difficulty: difficulty || 'medium',
            expectedDuration,
            followUpQuestions: followUpQuestions || [],
            hints: hints || [],
            notes,
            status: 'pending' // Requires verification
        });

        await newQuestion.save();

        // Award XP to user for contribution
        await User.findByIdAndUpdate(userId, {
            $inc: { 'gamification.xp': 10 }
        });

        return newQuestion;
    } catch (error) {
        console.error('Error submitting question:', error);
        throw error;
    }
};

/**
 * Vote on a question
 * @param {String} questionId - Question ID
 * @param {String} userId - User ID
 * @param {String} voteType - 'up' or 'down'
 * @returns {Object} Updated question
 */
export const voteOnQuestion = async (questionId, userId, voteType) => {
    try {
        const question = await RealQuestion.findById(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        // Add vote
        question.addVote(userId, voteType);
        await question.save();

        // Auto-verify if enough upvotes
        if (question.upvotes.length >= 5 && !question.verified) {
            question.verified = true;
            question.status = 'active';
            await question.save();
        }

        return question;
    } catch (error) {
        console.error('Error voting on question:', error);
        throw error;
    }
};

/**
 * Get questions by company
 * @param {String} company - Company name
 * @param {Object} filters - Additional filters
 * @returns {Array} Questions
 */
export const getQuestionsByCompany = async (company, filters = {}) => {
    try {
        const query = {
            company,
            status: 'active'
        };

        // Apply filters
        if (filters.questionType) {
            query.questionType = filters.questionType;
        }
        if (filters.difficulty) {
            query.difficulty = filters.difficulty;
        }
        if (filters.role) {
            query.role = filters.role;
        }
        if (filters.verified !== undefined) {
            query.verified = filters.verified;
        }

        const questions = await RealQuestion.find(query)
            .populate('submittedBy', 'firstName lastName')
            .sort({ 'upvotes.length': -1, timesAsked: -1 })
            .limit(filters.limit || 50);

        return questions;
    } catch (error) {
        console.error('Error getting questions by company:', error);
        throw error;
    }
};

/**
 * Get trending questions
 * @param {Number} limit - Number of questions to return
 * @returns {Array} Trending questions
 */
export const getTrendingQuestions = async (limit = 20) => {
    try {
        const questions = await RealQuestion.find({ status: 'active' })
            .populate('submittedBy', 'firstName lastName')
            .sort({ popularityScore: -1 })
            .limit(limit);

        return questions;
    } catch (error) {
        console.error('Error getting trending questions:', error);
        throw error;
    }
};

/**
 * Get question frequency statistics
 * @param {String} company - Company name
 * @returns {Object} Frequency stats
 */
export const getQuestionFrequency = async (company) => {
    try {
        const questions = await RealQuestion.find({
            company,
            status: 'active',
            verified: true
        }).sort({ timesAsked: -1 });

        // Calculate frequency distribution
        const totalQuestions = questions.length;
        const frequencyDistribution = {
            veryCommon: questions.filter(q => q.timesAsked >= 10).length,
            common: questions.filter(q => q.timesAsked >= 5 && q.timesAsked < 10).length,
            occasional: questions.filter(q => q.timesAsked >= 2 && q.timesAsked < 5).length,
            rare: questions.filter(q => q.timesAsked < 2).length
        };

        // Most asked questions
        const mostAsked = questions.slice(0, 10);

        // Recent questions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentQuestions = questions.filter(
            q => q.lastAskedDate >= thirtyDaysAgo
        );

        return {
            totalQuestions,
            frequencyDistribution,
            mostAsked,
            recentCount: recentQuestions.length,
            recentQuestions: recentQuestions.slice(0, 10)
        };
    } catch (error) {
        console.error('Error getting question frequency:', error);
        throw error;
    }
};

/**
 * Report a question
 * @param {String} questionId - Question ID
 * @param {String} userId - User ID
 * @param {String} reason - Report reason
 * @returns {Object} Updated question
 */
export const reportQuestion = async (questionId, userId, reason) => {
    try {
        const question = await RealQuestion.findById(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        question.reported = true;
        question.reportCount += 1;

        // Auto-archive if too many reports
        if (question.reportCount >= 3) {
            question.status = 'pending'; // Requires admin review
        }

        await question.save();

        return question;
    } catch (error) {
        console.error('Error reporting question:', error);
        throw error;
    }
};

/**
 * Verify question (admin only)
 * @param {String} questionId - Question ID
 * @param {String} adminId - Admin user ID
 * @returns {Object} Verified question
 */
export const verifyQuestion = async (questionId, adminId) => {
    try {
        const question = await RealQuestion.findById(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        question.verified = true;
        question.verifiedBy = adminId;
        question.verifiedAt = new Date();
        question.status = 'active';

        await question.save();

        // Award bonus XP to submitter
        await User.findByIdAndUpdate(question.submittedBy, {
            $inc: { 'gamification.xp': 25 }
        });

        return question;
    } catch (error) {
        console.error('Error verifying question:', error);
        throw error;
    }
};

/**
 * Search questions
 * @param {String} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Array} Matching questions
 */
export const searchQuestions = async (searchTerm, filters = {}) => {
    try {
        const query = {
            status: 'active',
            $text: { $search: searchTerm }
        };

        if (filters.company) {
            query.company = filters.company;
        }
        if (filters.questionType) {
            query.questionType = filters.questionType;
        }

        const questions = await RealQuestion.find(query)
            .populate('submittedBy', 'firstName lastName')
            .sort({ score: { $meta: 'textScore' } })
            .limit(filters.limit || 30);

        return questions;
    } catch (error) {
        console.error('Error searching questions:', error);
        throw error;
    }
};

/**
 * Get user's submitted questions
 * @param {String} userId - User ID
 * @returns {Array} User's questions
 */
export const getUserQuestions = async (userId) => {
    try {
        const questions = await RealQuestion.find({ submittedBy: userId })
            .sort({ createdAt: -1 });

        const stats = {
            total: questions.length,
            verified: questions.filter(q => q.verified).length,
            pending: questions.filter(q => q.status === 'pending').length,
            totalUpvotes: questions.reduce((sum, q) => sum + q.upvotes.length, 0)
        };

        return { questions, stats };
    } catch (error) {
        console.error('Error getting user questions:', error);
        throw error;
    }
};




