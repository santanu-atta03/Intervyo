import {
    findBuddies,
    connectWithBuddy,
    getUserBuddies,
    scheduleMockInterview,
    createStudyGroup,
    findStudyGroups,
    joinStudyGroup,
    getUserStudyGroups
} from '../services/buddyMatching.service.js';

/**
 * Find compatible buddies
 */
export const findMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const preferences = req.query;

        const result = await findBuddies(userId, preferences);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error finding buddies:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to find buddies'
        });
    }
};

/**
 * Connect with a buddy
 */
export const connect = async (req, res) => {
    try {
        const userId = req.user.id;
        const { buddyId, targetCompany, targetRole, matchScore } = req.body;

        const match = await connectWithBuddy(userId, buddyId, {
            targetCompany,
            targetRole,
            matchScore
        });

        res.status(201).json({
            success: true,
            message: 'Buddy connection request sent',
            data: match
        });
    } catch (error) {
        console.error('Error connecting with buddy:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to connect with buddy'
        });
    }
};

/**
 * Get user's buddies
 */
export const getMyBuddies = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const buddies = await getUserBuddies(userId, status);

        res.status(200).json({
            success: true,
            data: buddies
        });
    } catch (error) {
        console.error('Error getting buddies:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get buddies'
        });
    }
};

/**
 * Schedule mock interview with buddy
 */
export const scheduleMock = async (req, res) => {
    try {
        const { matchId } = req.params;
        const interviewData = req.body;

        const match = await scheduleMockInterview(matchId, interviewData);

        res.status(200).json({
            success: true,
            message: 'Mock interview scheduled successfully',
            data: match
        });
    } catch (error) {
        console.error('Error scheduling mock interview:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to schedule mock interview'
        });
    }
};

/**
 * Create study group
 */
export const createGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const groupData = req.body;

        const group = await createStudyGroup(userId, groupData);

        res.status(201).json({
            success: true,
            message: 'Study group created successfully',
            data: group
        });
    } catch (error) {
        console.error('Error creating study group:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create study group'
        });
    }
};

/**
 * Find study groups
 */
export const findGroups = async (req, res) => {
    try {
        const filters = req.query;

        const groups = await findStudyGroups(filters);

        res.status(200).json({
            success: true,
            data: groups
        });
    } catch (error) {
        console.error('Error finding study groups:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to find study groups'
        });
    }
};

/**
 * Join study group
 */
export const joinGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const { groupId } = req.params;

        const group = await joinStudyGroup(groupId, userId);

        res.status(200).json({
            success: true,
            message: 'Successfully joined study group',
            data: group
        });
    } catch (error) {
        console.error('Error joining study group:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to join study group'
        });
    }
};

/**
 * Get user's study groups
 */
export const getMyGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const groups = await getUserStudyGroups(userId);

        res.status(200).json({
            success: true,
            data: groups
        });
    } catch (error) {
        console.error('Error getting study groups:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get study groups'
        });
    }
};


