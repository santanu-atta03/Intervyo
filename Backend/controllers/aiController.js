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

// @desc    Complete interview and generate feedback
// @route   POST /api/ai/complete-interview
// @access  Private
export const completeInterview = async (req, res) => {
  try {
    const { sessionId, interviewId } = req.body;

    const session = await InterviewSession.findById(sessionId)
      .populate('interviewId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Generate overall feedback
    const feedback = await generateOverallFeedback(session);

    // Update session
    session.status = 'completed';
    session.overallScore = feedback.overallScore;
    session.communicationScore = feedback.communicationScore;
    session.problemSolvingScore = feedback.problemSolvingScore;
    session.feedback = {
      summary: feedback.summary,
      strengths: feedback.strengths,
      improvements: feedback.improvements
    };
    await session.save();

    // Update interview
    const interview = await Interview.findById(interviewId);
    if (interview) {
      interview.status = 'completed';
      interview.completedAt = new Date();
      await interview.save();
    }

    res.json({
      success: true,
      data: {
        session,
        feedback
      }
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
