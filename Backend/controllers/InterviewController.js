import Interview from '../models/Interview.js';
import InterviewSession from '../models/InterviewSession.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Create new interview
export const createInterview = async (req, res) => {
  try {
    const { role, difficulty, duration, scheduledAt } = req.body;
    const userId = req.user.id;

    // Handle resume upload
    if (!req.files || !req.files.resume) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    const resume = req.files.resume;
    const resumeUpload = await uploadToCloudinary(resume, 'resumes');

    const interview = await Interview.create({
      userId,
      role,
      difficulty,
      duration,
      scheduledAt,
      resumeUrl: resumeUpload.secure_url
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: error.message
    });
  }
};

// Get all interviews for a user
export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const interviews = await Interview.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      error: error.message
    });
  }
};

// Get single interview details
export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const interview = await Interview.findOne({ _id: id, userId });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: error.message
    });
  }
};

// Start interview (creates session)
export const startInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const interview = await Interview.findOne({ _id: id, userId });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Interview cannot be started'
      });
    }

    // Update interview status
    interview.status = 'in-progress';
    interview.startedAt = new Date();
    await interview.save();

    // Create interview session
    const session = await InterviewSession.create({
      interviewId: interview._id,
      userId,
      conversation: [{
        speaker: 'ai',
        message: `Hello! Welcome to your ${interview.role} interview. I'm your AI interviewer today. Let's begin with a brief introduction. Could you tell me about yourself and your experience?`,
        type: 'greeting'
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Interview started successfully',
      data: {
        interview,
        session
      }
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      error: error.message
    });
  }
};

// Get interview session
export const getInterviewSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await InterviewSession.findOne({ interviewId: id, userId })
      .populate('interviewId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session',
      error: error.message
    });
  }
};

// End interview
export const endInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const interview = await Interview.findOne({ _id: id, userId });
    const session = await InterviewSession.findOne({ interviewId: id, userId });

    if (!interview || !session) {
      return res.status(404).json({
        success: false,
        message: 'Interview or session not found'
      });
    }

    // Calculate final scores
    const technicalAvg = session.technicalScore || 0;
    const communicationAvg = session.communicationScore || 0;
    const problemSolvingAvg = session.problemSolvingScore || 0;
    
    const overallScore = Math.round((technicalAvg + communicationAvg + problemSolvingAvg) / 3);

    // Update interview
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.overallScore = overallScore;
    await interview.save();

    // Update session
    session.sessionStatus = 'completed';
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Interview completed successfully',
      data: {
        interview,
        session
      }
    });
  } catch (error) {
    console.error('Error ending interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end interview',
      error: error.message
    });
  }
};

// Delete interview
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const interview = await Interview.findOneAndDelete({ _id: id, userId });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Delete associated session
    await InterviewSession.deleteOne({ interviewId: id });

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: error.message
    });
  }
};

export const getInterviewResults = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.id;

    // Find interview
    const interview = await Interview.findOne({ 
      _id: interviewId, 
      userId: userId 
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if completed
    if (interview.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview not yet completed'
      });
    }

    // Find session
    const session = await InterviewSession.findOne({
      interviewId: interviewId,
      userId: userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Return data in the same format as completeInterview
    const responseData = {
      session: {
        _id: session._id,
        interviewId: session.interviewId,
        userId: session.userId,
        conversation: session.conversation,
        questionEvaluations: session.questionEvaluations || [],
        sessionStatus: session.sessionStatus,
        overallScore: session.overallScore,
        technicalScore: session.technicalScore,
        communicationScore: session.communicationScore,
        problemSolvingScore: session.problemSolvingScore,
        feedback: session.feedback,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      },
      feedback: {
        summary: interview.feedback || session.feedback?.summary,
        strengths: interview.strengths || session.feedback?.strengths || [],
        improvements: interview.improvements || session.feedback?.improvements || [],
        overallScore: interview.overallScore,
        technicalScore: interview.technicalScore,
        communicationScore: interview.communicationScore,
        problemSolvingScore: interview.problemSolvingScore
      }
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get results',
      error: error.message
    });
  }
};