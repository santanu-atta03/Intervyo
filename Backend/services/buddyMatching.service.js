import { BuddyMatch, StudyGroup } from '../models/BuddyMatch.model.js';
import User from '../models/User.model.js';
import Interview from '../models/Interview.model.js';

/**
 * Buddy Matching Service
 * Connects users preparing for same companies with peer collaboration features
 */

/**
 * Find compatible buddies for a user
 * @param {String} userId - User ID
 * @param {Object} preferences - Matching preferences
 * @returns {Array} Compatible buddies
 */
export const findBuddies = async (userId, preferences = {}) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Get user's recent interviews to determine target companies
        const userInterviews = await Interview.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(10);

        const targetCompanies = [...new Set(
            userInterviews.map(i => i.config?.targetCompany).filter(Boolean)
        )];

        if (targetCompanies.length === 0) {
            return {
                message: 'Complete some interviews first to find compatible buddies',
                buddies: []
            };
        }

        // Find users with similar target companies
        const potentialBuddies = await Interview.aggregate([
            {
                $match: {
                    'config.targetCompany': { $in: targetCompanies },
                    user: { $ne: userId }
                }
            },
            {
                $group: {
                    _id: '$user',
                    companies: { $addToSet: '$config.targetCompany' },
                    interviewCount: { $sum: 1 },
                    avgScore: { $avg: '$result.overallScore' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },
            {
                $limit: 50
            }
        ]);

        // Check existing connections
        const existingMatches = await BuddyMatch.find({
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        });

        const connectedUserIds = existingMatches.map(m =>
            m.user1.toString() === userId.toString() ? m.user2.toString() : m.user1.toString()
        );

        // Calculate compatibility scores
        const buddies = potentialBuddies
            .filter(b => !connectedUserIds.includes(b._id.toString()))
            .map(buddy => {
                // Calculate match score based on common companies and skill level
                const commonCompanies = buddy.companies.filter(c => targetCompanies.includes(c));
                const companyScore = (commonCompanies.length / targetCompanies.length) * 50;

                // Skill level similarity (prefer similar skill levels)
                const userAvgScore = userInterviews.reduce((sum, i) => sum + (i.result?.overallScore || 0), 0) / userInterviews.length;
                const skillDiff = Math.abs(userAvgScore - buddy.avgScore);
                const skillScore = Math.max(0, 50 - skillDiff);

                const matchScore = Math.round(companyScore + skillScore);

                return {
                    userId: buddy._id,
                    user: buddy.userInfo,
                    commonCompanies,
                    matchScore,
                    interviewCount: buddy.interviewCount,
                    avgScore: Math.round(buddy.avgScore)
                };
            })
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 20);

        return {
            totalFound: buddies.length,
            buddies
        };
    } catch (error) {
        console.error('Error finding buddies:', error);
        throw error;
    }
};

/**
 * Send buddy connection request
 * @param {String} userId - Requesting user ID
 * @param {String} buddyId - Target buddy ID
 * @param {Object} matchData - Match details
 * @returns {Object} Created match
 */
export const connectWithBuddy = async (userId, buddyId, matchData = {}) => {
    try {
        // Check if match already exists
        const existingMatch = await BuddyMatch.findOne({
            $or: [
                { user1: userId, user2: buddyId },
                { user1: buddyId, user2: userId }
            ]
        });

        if (existingMatch) {
            if (existingMatch.status === 'pending') {
                // Accept pending request
                existingMatch.status = 'accepted';
                existingMatch.connectedAt = new Date();
                await existingMatch.save();
                return existingMatch;
            }
            throw new Error('Already connected with this user');
        }

        // Create new match
        const match = new BuddyMatch({
            user1: userId,
            user2: buddyId,
            targetCompany: matchData.targetCompany,
            targetRole: matchData.targetRole,
            matchScore: matchData.matchScore || 0,
            initiatedBy: userId,
            status: 'pending'
        });

        await match.save();

        // Award XP for connecting
        await User.findByIdAndUpdate(userId, {
            $inc: { 'gamification.xp': 5 }
        });

        return match;
    } catch (error) {
        console.error('Error connecting with buddy:', error);
        throw error;
    }
};

/**
 * Get user's buddy connections
 * @param {String} userId - User ID
 * @param {String} status - Filter by status
 * @returns {Array} Buddy matches
 */
export const getUserBuddies = async (userId, status = 'accepted') => {
    try {
        const query = {
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        };

        if (status) {
            query.status = status;
        }

        const matches = await BuddyMatch.find(query)
            .populate('user1', 'firstName lastName email gamification')
            .populate('user2', 'firstName lastName email gamification')
            .sort({ connectedAt: -1 });

        // Format response to show buddy info
        const buddies = matches.map(match => {
            const buddy = match.user1._id.toString() === userId.toString()
                ? match.user2
                : match.user1;

            return {
                matchId: match._id,
                buddy,
                targetCompany: match.targetCompany,
                matchScore: match.matchScore,
                status: match.status,
                connectedAt: match.connectedAt,
                totalSessions: match.totalSessions,
                mockInterviews: match.mockInterviews
            };
        });

        return buddies;
    } catch (error) {
        console.error('Error getting user buddies:', error);
        throw error;
    }
};

/**
 * Schedule mock interview with buddy
 * @param {String} matchId - Match ID
 * @param {Object} interviewData - Interview details
 * @returns {Object} Updated match
 */
export const scheduleMockInterview = async (matchId, interviewData) => {
    try {
        const match = await BuddyMatch.findById(matchId);
        if (!match) {
            throw new Error('Buddy match not found');
        }

        if (match.status !== 'accepted') {
            throw new Error('Buddy connection must be accepted first');
        }

        match.mockInterviews.push({
            scheduledDate: new Date(interviewData.scheduledDate),
            duration: interviewData.duration || 60,
            interviewType: interviewData.interviewType,
            completed: false
        });

        match.lastInteraction = new Date();
        await match.save();

        return match;
    } catch (error) {
        console.error('Error scheduling mock interview:', error);
        throw error;
    }
};

/**
 * Create study group
 * @param {String} userId - Creator user ID
 * @param {Object} groupData - Group details
 * @returns {Object} Created study group
 */
export const createStudyGroup = async (userId, groupData) => {
    try {
        const { name, description, targetCompany, targetRole, focusAreas, maxMembers, isPrivate } = groupData;

        const group = new StudyGroup({
            name,
            description,
            targetCompany,
            targetRole,
            focusAreas: focusAreas || [],
            creator: userId,
            members: [{
                user: userId,
                role: 'admin'
            }],
            maxMembers: maxMembers || 10,
            isPrivate: isPrivate || false
        });

        await group.save();

        // Award XP for creating group
        await User.findByIdAndUpdate(userId, {
            $inc: { 'gamification.xp': 15 }
        });

        return group;
    } catch (error) {
        console.error('Error creating study group:', error);
        throw error;
    }
};

/**
 * Find study groups
 * @param {Object} filters - Search filters
 * @returns {Array} Study groups
 */
export const findStudyGroups = async (filters = {}) => {
    try {
        const query = {
            status: 'active',
            isPrivate: false
        };

        if (filters.targetCompany) {
            query.targetCompany = filters.targetCompany;
        }

        const groups = await StudyGroup.find(query)
            .populate('creator', 'firstName lastName')
            .populate('members.user', 'firstName lastName')
            .sort({ lastActivity: -1 })
            .limit(filters.limit || 20);

        // Filter out full groups if requested
        const availableGroups = filters.onlyAvailable
            ? groups.filter(g => g.memberCount < g.maxMembers)
            : groups;

        return availableGroups;
    } catch (error) {
        console.error('Error finding study groups:', error);
        throw error;
    }
};

/**
 * Join study group
 * @param {String} groupId - Group ID
 * @param {String} userId - User ID
 * @returns {Object} Updated group
 */
export const joinStudyGroup = async (groupId, userId) => {
    try {
        const group = await StudyGroup.findById(groupId);
        if (!group) {
            throw new Error('Study group not found');
        }

        if (group.isMember(userId)) {
            throw new Error('Already a member of this group');
        }

        if (group.memberCount >= group.maxMembers) {
            throw new Error('Group is full');
        }

        group.members.push({
            user: userId,
            role: 'member'
        });

        group.lastActivity = new Date();
        await group.save();

        // Award XP for joining
        await User.findByIdAndUpdate(userId, {
            $inc: { 'gamification.xp': 5 }
        });

        return group;
    } catch (error) {
        console.error('Error joining study group:', error);
        throw error;
    }
};

/**
 * Get user's study groups
 * @param {String} userId - User ID
 * @returns {Array} User's groups
 */
export const getUserStudyGroups = async (userId) => {
    try {
        const groups = await StudyGroup.find({
            'members.user': userId,
            status: 'active'
        })
            .populate('creator', 'firstName lastName')
            .populate('members.user', 'firstName lastName')
            .sort({ lastActivity: -1 });

        return groups;
    } catch (error) {
        console.error('Error getting user study groups:', error);
        throw error;
    }
};




