import Interview from '../models/Interview.js';
import InterviewSession from '../models/InterviewSession.js';
import {
  generateInterviewQuestions,
  evaluateAnswer,
  generateNextQuestion,
  generateOverallFeedback
} from '../config/openai.js';

// @desc    Generate initial questions
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateQuestions = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    const questions = await generateInterviewQuestions(
      interview.role,
      interview.difficulty,
      interview.resumeText
    );

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating questions',
      error: error.message
    });
  }
};

// @desc    Evaluate candidate answer
// @route   POST /api/ai/evaluate-answer
// @access  Private
export const evaluateCandidateAnswer = async (req, res) => {
  try {
    const { sessionId, question, answer, codeSubmitted } = req.body;

    if (!sessionId || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sessionId, question, and answer'
      });
    }

    const session = await InterviewSession.findById(sessionId)
      .populate('interviewId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Create context from previous conversation
    const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}`;

    // Evaluate the answer
    const evaluation = await evaluateAnswer(
      question,
      answer,
      context,
      codeSubmitted
    );

    // Add to conversation history
    session.conversation.push({
  speaker: 'candidate',
  message: answer,
  type: 'answer',
  timestamp: new Date()
});

session.conversation.push({
  speaker: 'ai',
  message: evaluation.review,
  type: 'feedback',
  timestamp: new Date()
});

    session.currentQuestionIndex += 1;
    await session.save();

    res.json({
      success: true,
      data: {
        review: evaluation.review,
        score: evaluation.score,
        strength: evaluation.strength,
        improvement: evaluation.improvement
      }
    });
  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error evaluating answer',
      error: error.message
    });
  }
};

// @desc    Get next question
// @route   POST /api/ai/next-question
// @access  Private
export const getNextQuestion = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findById(sessionId)
      .populate('interviewId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Generate next question based on conversation
    const nextQuestion = await generateNextQuestion(
      session.conversation,
      session.interviewId.role,
      session.interviewId.difficulty
    );

    res.json({
      success: true,
      data: nextQuestion
    });
  } catch (error) {
    console.error('Get next question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating next question',
      error: error.message
    });
  }
};


export const updateUserStreakAndStats = async (userId) => {
  try {
    const User = require('../models/User.model'); // Adjust path as needed
    
    const user = await User.findById(userId);
    if (!user || !user.stats) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = user.stats.lastActivityDate 
      ? new Date(user.stats.lastActivityDate) 
      : null;
    
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
    }

    // Check if this is a new day
    if (!lastActivity || lastActivity.getTime() !== today.getTime()) {
      // Calculate days difference
      const daysDiff = lastActivity 
        ? Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))
        : 0;

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        user.stats.streak += 1;
      } else if (daysDiff > 1) {
        // Streak broken - reset to 1
        user.stats.streak = 1;
      } else if (!lastActivity) {
        // First activity ever
        user.stats.streak = 1;
      }

      // Update last activity date
      user.stats.lastActivityDate = today;
      
      // Calculate max streak
      if (user.stats.streak > (user.stats.maxStreak || 0)) {
        user.stats.maxStreak = user.stats.streak;
      }

      await user.save();
    }

    return user.stats;
  } catch (error) {
    console.error('Error updating streak:', error);
    return null;
  }
};

// export const completeInterview = async (req, res) => {
//   try {
//     const {  interviewId } = req.body;
//     const userId = req.user.id;
//     console.log("inter",interviewId,userId)

//     const session = await InterviewSession.findOne({ interviewId:interviewId, userId:userId });

//     if (!session) {
//       return res.status(404).json({
//         success: false,
//         message: 'Session not found'
//       });
//     }

//     // Generate overall feedback
//     const feedback = await generateOverallFeedback(session);

//     // Update session
//     session.status = 'completed';
//     session.overallScore = feedback.overallScore;
//     session.communicationScore = feedback.communicationScore;
//     session.problemSolvingScore = feedback.problemSolvingScore;
//     session.feedback = {
//       summary: feedback.summary,
//       strengths: feedback.strengths,
//       improvements: feedback.improvements
//     };
//     await session.save();

//     // Update interview
//     const interview = await Interview.findById(interviewId);
//     if (interview) {
//       interview.status = 'completed';
//       interview.completedAt = new Date();
//       await interview.save();
//     }
//     console.log("Session : ",session)
//     console.log("feedback : ",feedback)
//     res.json({
//       success: true,
//       data: {
//         session,
//         feedback
//       }
//     });
//   } catch (error) {
//     console.error('Complete interview error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error completing interview',
//       error: error.message
//     });
//   }
// };


export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const userId = req.user.id;
    
    console.log("Completing interview:", interviewId, "for user:", userId);

    // Find session by interviewId and userId
    const session = await InterviewSession.findOne({ 
      interviewId: interviewId, 
      userId: userId 
    }).populate('interviewId');

    if (!session) {
      console.log("Session not found for:", { interviewId, userId });
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Generate overall feedback
    const feedback = await generateOverallFeedback(session);

    // Calculate technical score from evaluations if available
    const technicalScore = session.questionEvaluations && session.questionEvaluations.length > 0
      ? Math.round(
          session.questionEvaluations
            .filter(q => q.category === 'technical')
            .reduce((sum, q) => sum + (q.score || 0), 0) / 
          Math.max(session.questionEvaluations.filter(q => q.category === 'technical').length, 1)
        )
      : feedback.technicalScore || 7;

    // Update session using findByIdAndUpdate to avoid version conflict
    const updatedSession = await InterviewSession.findByIdAndUpdate(
      session._id,
      {
        $set: {
          sessionStatus: 'completed',
          overallScore: feedback.overallScore,
          technicalScore: technicalScore,
          communicationScore: feedback.communicationScore,
          problemSolvingScore: feedback.problemSolvingScore,
          'feedback.summary': feedback.summary,
          'feedback.strengths': feedback.strengths,
          'feedback.improvements': feedback.improvements,
        }
      },
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    ).populate('interviewId');

    // Update interview using findByIdAndUpdate to avoid version conflict
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          overallScore: feedback.overallScore,
          feedback: feedback.summary,
          strengths: feedback.strengths,
          improvements: feedback.improvements
        }
      },
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    );

    if (!updatedInterview) {
      console.log("Interview not found:", interviewId);
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    console.log("Interview completed successfully");
    
    // Prepare the response data
    const responseData = {
      session: {
        _id: updatedSession._id,
        interviewId: updatedSession.interviewId,
        userId: updatedSession.userId,
        conversation: updatedSession.conversation,
        questionEvaluations: updatedSession.questionEvaluations,
        sessionStatus: updatedSession.sessionStatus,
        overallScore: updatedSession.overallScore,
        technicalScore: updatedSession.technicalScore,
        communicationScore: updatedSession.communicationScore,
        problemSolvingScore: updatedSession.problemSolvingScore,
        feedback: updatedSession.feedback,
        createdAt: updatedSession.createdAt,
        updatedAt: updatedSession.updatedAt
      },
      feedback: {
        summary: feedback.summary,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        overallScore: feedback.overallScore,
        technicalScore: technicalScore,
        communicationScore: feedback.communicationScore,
        problemSolvingScore: feedback.problemSolvingScore
      }
    };
    
    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing interview',
      error: error.message
    });
  }
};