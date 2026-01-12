import Interview from '../models/Interview.model.js';
import User from '../models/User.model.js';
import Company from '../models/Company.model.js';

/**
 * Smart Company Recommendation Engine
 * Analyzes user performance and recommends best-fit companies
 */

/**
 * Calculate user-company fit score
 * @param {Object} user - User object
 * @param {String} companyName - Company name
 * @param {Array} userInterviews - User's interview history
 * @returns {Object} Fit analysis
 */
export const calculateCompanyFit = async (user, companyName, userInterviews) => {
    try {
        // Get company data
        const company = await Company.findOne({ name: companyName });
        if (!company) {
            return {
                company: companyName,
                fitScore: 0,
                analysis: 'Company data not available'
            };
        }

        // Filter interviews for this company
        const companyInterviews = userInterviews.filter(
            i => i.config?.targetCompany === companyName
        );

        // Calculate average scores by type
        const technicalScores = companyInterviews
            .filter(i => i.config?.interviewType === 'technical')
            .map(i => i.result?.overallScore || 0);

        const behavioralScores = companyInterviews
            .filter(i => i.config?.interviewType === 'behavioral')
            .map(i => i.result?.overallScore || 0);

        const systemDesignScores = companyInterviews
            .filter(i => i.config?.interviewType === 'system-design')
            .map(i => i.result?.overallScore || 0);

        const avgTechnical = technicalScores.length > 0
            ? technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length
            : 0;

        const avgBehavioral = behavioralScores.length > 0
            ? behavioralScores.reduce((a, b) => a + b, 0) / behavioralScores.length
            : 0;

        const avgSystemDesign = systemDesignScores.length > 0
            ? systemDesignScores.reduce((a, b) => a + b, 0) / systemDesignScores.length
            : 0;

        // Compare against company hiring bar
        const technicalGap = company.hiringBar.technical - avgTechnical;
        const behavioralGap = company.hiringBar.behavioral - avgBehavioral;
        const systemDesignGap = company.hiringBar.systemDesign - avgSystemDesign;

        // Calculate overall fit score (0-100)
        const technicalFit = Math.max(0, 100 - Math.abs(technicalGap));
        const behavioralFit = Math.max(0, 100 - Math.abs(behavioralGap));
        const systemDesignFit = Math.max(0, 100 - Math.abs(systemDesignGap));

        const overallFit = Math.round((technicalFit + behavioralFit + systemDesignFit) / 3);

        // Determine readiness level
        let readinessLevel = 'Not Ready';
        if (overallFit >= 85) readinessLevel = 'Excellent';
        else if (overallFit >= 70) readinessLevel = 'Good';
        else if (overallFit >= 55) readinessLevel = 'Moderate';
        else if (overallFit >= 40) readinessLevel = 'Needs Work';

        // Calculate success probability
        const successProbability = Math.min(100, Math.max(0,
            overallFit * (company.acceptanceRate / 100)
        ));

        return {
            company: companyName,
            fitScore: overallFit,
            readinessLevel,
            successProbability: Math.round(successProbability),
            scores: {
                technical: Math.round(avgTechnical),
                behavioral: Math.round(avgBehavioral),
                systemDesign: Math.round(avgSystemDesign)
            },
            gaps: {
                technical: Math.round(technicalGap),
                behavioral: Math.round(behavioralGap),
                systemDesign: Math.round(systemDesignGap)
            },
            hiringBar: company.hiringBar,
            strengths: [],
            weaknesses: [],
            recommendations: []
        };
    } catch (error) {
        console.error('Error calculating company fit:', error);
        throw error;
    }
};

/**
 * Get personalized company recommendations
 * @param {String} userId - User ID
 * @returns {Array} Recommended companies with fit scores
 */
export const getCompanyRecommendations = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Get all user interviews
        const userInterviews = await Interview.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        if (userInterviews.length === 0) {
            return {
                message: 'Complete some interviews first to get personalized recommendations',
                recommendations: []
            };
        }

        // Get all companies
        const companies = await Company.find({});

        // Calculate fit for each company
        const recommendations = await Promise.all(
            companies.map(async (company) => {
                const fit = await calculateCompanyFit(user, company.name, userInterviews);

                // Add strengths and weaknesses
                if (fit.gaps.technical <= 0) fit.strengths.push('Strong technical skills');
                else if (fit.gaps.technical > 15) fit.weaknesses.push('Technical skills need improvement');

                if (fit.gaps.behavioral <= 0) fit.strengths.push('Excellent communication');
                else if (fit.gaps.behavioral > 15) fit.weaknesses.push('Behavioral skills need work');

                if (fit.gaps.systemDesign <= 0) fit.strengths.push('Great system design skills');
                else if (fit.gaps.systemDesign > 15) fit.weaknesses.push('System design needs practice');

                // Add recommendations
                if (fit.fitScore >= 70) {
                    fit.recommendations.push(`You're well-prepared for ${company.name}! Keep practicing.`);
                } else {
                    if (fit.gaps.technical > 10) {
                        fit.recommendations.push('Focus on technical interview preparation');
                    }
                    if (fit.gaps.behavioral > 10) {
                        fit.recommendations.push('Practice behavioral questions using STAR method');
                    }
                    if (fit.gaps.systemDesign > 10) {
                        fit.recommendations.push('Study system design patterns and architectures');
                    }
                }

                return {
                    ...fit,
                    companyInfo: {
                        logo: company.logo,
                        difficultyRating: company.difficultyRating,
                        acceptanceRate: company.acceptanceRate,
                        characteristics: company.characteristics
                    }
                };
            })
        );

        // Sort by fit score
        recommendations.sort((a, b) => b.fitScore - a.fitScore);

        return {
            totalCompanies: recommendations.length,
            bestFit: recommendations.slice(0, 3),
            allRecommendations: recommendations
        };
    } catch (error) {
        console.error('Error getting company recommendations:', error);
        throw error;
    }
};

/**
 * Get detailed company fit analysis
 * @param {String} userId - User ID
 * @param {String} companyName - Company name
 * @returns {Object} Detailed fit analysis
 */
export const getCompanyFitAnalysis = async (userId, companyName) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const userInterviews = await Interview.find({ user: userId })
            .sort({ createdAt: -1 });

        const fit = await calculateCompanyFit(user, companyName, userInterviews);

        // Get company-specific interview history
        const companyInterviews = userInterviews.filter(
            i => i.config?.targetCompany === companyName
        );

        // Calculate improvement over time
        const improvement = companyInterviews.length >= 2
            ? companyInterviews[0].result?.overallScore - companyInterviews[companyInterviews.length - 1].result?.overallScore
            : 0;

        return {
            ...fit,
            interviewHistory: companyInterviews.length,
            improvement: Math.round(improvement),
            lastInterviewDate: companyInterviews[0]?.createdAt,
            detailedAnalysis: {
                readyForInterview: fit.fitScore >= 70,
                estimatedPreparationTime: fit.fitScore < 70
                    ? `${Math.ceil((70 - fit.fitScore) / 5)} weeks`
                    : 'Ready now',
                keyFocusAreas: fit.weaknesses.length > 0
                    ? fit.weaknesses
                    : ['Maintain current skill level', 'Practice regularly']
            }
        };
    } catch (error) {
        console.error('Error getting company fit analysis:', error);
        throw error;
    }
};




