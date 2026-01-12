import Interview from '../models/Interview.js';
import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.model.js';
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
// export const evaluateCandidateAnswer = async (req, res) => {
//   try {
//     const { sessionId, question, answer, codeSubmitted } = req.body;

//     if (!sessionId || !question || !answer) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide sessionId, question, and answer'
//       });
//     }

//     const session = await InterviewSession.findById(sessionId)
//       .populate('interviewId');

//     if (!session) {
//       return res.status(404).json({
//         success: false,
//         message: 'Session not found'
//       });
//     }

//     // Create context from previous conversation
//     const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}`;

//     // Evaluate the answer
//     const evaluation = await evaluateAnswer(
//       question,
//       answer,
//       context,
//       codeSubmitted
//     );

//     // Add to conversation history
//     session.conversation.push({
//   speaker: 'candidate',
//   message: answer,
//   type: 'answer',
//   timestamp: new Date()
// });

// session.conversation.push({
//   speaker: 'ai',
//   message: evaluation.review,
//   type: 'feedback',
//   timestamp: new Date()
// });

//     session.currentQuestionIndex += 1;
//     await session.save();

//     res.json({
//       success: true,
//       data: {
//         review: evaluation.review,
//         score: evaluation.score,
//         strength: evaluation.strength,
//         improvement: evaluation.improvement
//       }
//     });
//   } catch (error) {
//     console.error('Evaluate answer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error evaluating answer',
//       error: error.message
//     });
//   }
// };

// controllers/aiInterview.controller.js

export const evaluateCandidateAnswer = async (req, res) => {
  try {
    const { sessionId, question, answer, codeSubmitted, category, questionNumber } = req.body;

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

    // Evaluate the answer using AI
    const evaluation = await evaluateAnswer(
      question,
      answer,
      context,
      codeSubmitted
    );

    // CRITICAL: Store the question evaluation
    const questionEval = {
      questionNumber: questionNumber || session.questionEvaluations.length + 1,
      question: question,
      userAnswer: answer,
      score: evaluation.score, // 0-10
      feedback: evaluation.review,
      category: category || 'general',
      difficulty: session.interviewId.difficulty,
      strengths: evaluation.strength ? [evaluation.strength] : [],
      improvements: evaluation.improvement ? [evaluation.improvement] : [],
      codeSubmitted: codeSubmitted || null,
      timestamp: new Date()
    };

    // Add to session's question evaluations
    session.questionEvaluations.push(questionEval);

    // Add to conversation history
    session.conversation.push({
      role: 'user',
      content: answer,
      type: 'answer',
      timestamp: new Date()
    });

    session.conversation.push({
      role: 'assistant',
      content: evaluation.review,
      type: 'feedback',
      timestamp: new Date()
    });

    // Update stats
    session.stats.questionsAnswered = session.questionEvaluations.length;
    session.stats.totalQuestions = session.stats.totalQuestions || session.questionEvaluations.length;

    await session.save();

    res.json({
      success: true,
      data: {
        evaluation: {
          review: evaluation.review,
          score: evaluation.score,
          strength: evaluation.strength,
          improvement: evaluation.improvement
        },
        questionEvaluation: questionEval
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


// const generateOverallFeedback = async (session) => {
//   try {
//     // Calculate scores from question evaluations
//     const evaluations = session.questionEvaluations || [];
    
//     if (evaluations.length === 0) {
//       return {
//         summary: "Interview completed. Keep practicing to improve your skills!",
//         strengths: ["Completed the interview", "Showed determination"],
//         improvements: ["Practice more technical questions", "Work on communication clarity"],
//         overallScore: 50,
//         technicalScore: 5,
//         communicationScore: 5,
//         problemSolvingScore: 5
//       };
//     }
    
//     // Calculate average scores by category
//     const technicalQuestions = evaluations.filter(e => e.category === 'technical');
//     const behavioralQuestions = evaluations.filter(e => e.category === 'behavioral');
//     const codingQuestions = evaluations.filter(e => e.category === 'coding');
    
//     const technicalScore = technicalQuestions.length > 0
//       ? Math.round(technicalQuestions.reduce((sum, e) => sum + (e.score || 0), 0) / technicalQuestions.length)
//       : 5;
    
//     const communicationScore = behavioralQuestions.length > 0
//       ? Math.round(behavioralQuestions.reduce((sum, e) => sum + (e.score || 0), 0) / behavioralQuestions.length)
//       : 5;
    
//     const problemSolvingScore = codingQuestions.length > 0
//       ? Math.round(codingQuestions.reduce((sum, e) => sum + (e.score || 0), 0) / codingQuestions.length)
//       : technicalScore;
    
//     // Calculate overall score (0-100)
//     const overallScore = Math.round(
//       (technicalScore * 10 * 0.4) + 
//       (communicationScore * 10 * 0.3) + 
//       (problemSolvingScore * 10 * 0.3)
//     );
    
//     // Generate strengths based on high-scoring questions
//     const strengths = evaluations
//       .filter(e => e.score >= 7)
//       .slice(0, 3)
//       .map(e => `Strong understanding of ${e.category} concepts`)
//       .concat(overallScore >= 70 ? ["Good overall performance"] : []);
    
//     // Generate improvements based on low-scoring questions
//     const improvements = evaluations
//       .filter(e => e.score < 6)
//       .slice(0, 3)
//       .map(e => `Improve ${e.category} knowledge and practice`)
//       .concat(overallScore < 70 ? ["Focus on core fundamentals"] : []);
    
//     // Generate summary
//     const summary = overallScore >= 80
//       ? `Excellent performance! You demonstrated strong ${technicalScore >= 7 ? 'technical skills' : 'problem-solving abilities'} throughout the interview.`
//       : overallScore >= 60
//       ? `Good job! You showed solid understanding in most areas. Focus on ${technicalScore < 6 ? 'technical concepts' : 'communication clarity'} to improve further.`
//       : `Keep practicing! Review the feedback carefully and work on ${technicalScore < 6 ? 'technical fundamentals' : 'problem-solving approaches'}.`;
    
//     return {
//       summary,
//       strengths: strengths.length > 0 ? strengths : ["Completed the interview"],
//       improvements: improvements.length > 0 ? improvements : ["Practice more interview questions"],
//       overallScore,
//       technicalScore,
//       communicationScore,
//       problemSolvingScore
//     };
//   } catch (error) {
//     console.error('Error generating feedback:', error);
//     return {
//       summary: "Interview completed successfully!",
//       strengths: ["Participated in the interview"],
//       improvements: ["Continue practicing"],
//       overallScore: 50,
//       technicalScore: 5,
//       communicationScore: 5,
//       problemSolvingScore: 5
//     };
//   }
// };


// export const completeInterview = async (req, res) => {
//   try {
//     const { interviewId } = req.body;
//     const userId = req.user.id;
    
//     console.log("Completing interview:", interviewId, "for user:", userId);

//     // Find session
//     const session = await InterviewSession.findOne({ 
//       interviewId: interviewId, 
//       userId: userId 
//     }).populate('interviewId');

//     if (!session) {
//       console.log("Session not found for:", { interviewId, userId });
//       return res.status(404).json({
//         success: false,
//         message: 'Session not found'
//       });
//     }

//     // Generate feedback
//     const feedback = await generateOverallFeedback(session);

//     // Update session
//     const updatedSession = await InterviewSession.findByIdAndUpdate(
//       session._id,
//       {
//         $set: {
//           sessionStatus: 'completed',
//           overallScore: feedback.overallScore,
//           technicalScore: feedback.technicalScore,
//           communicationScore: feedback.communicationScore,
//           problemSolvingScore: feedback.problemSolvingScore,
//           'feedback.summary': feedback.summary,
//           'feedback.strengths': feedback.strengths,
//           'feedback.improvements': feedback.improvements,
//         }
//       },
//       { 
//         new: true,
//         runValidators: true 
//       }
//     ).populate('interviewId');

//     // Update interview
//     const updatedInterview = await Interview.findByIdAndUpdate(
//       interviewId,
//       {
//         $set: {
//           status: 'completed',
//           completedAt: new Date(),
//           overallScore: feedback.overallScore,
//           technicalScore: feedback.technicalScore,
//           communicationScore: feedback.communicationScore,
//           problemSolvingScore: feedback.problemSolvingScore,
//           feedback: feedback.summary,
//           strengths: feedback.strengths,
//           improvements: feedback.improvements,
//           questionEvaluations: updatedSession.questionEvaluations
//         }
//       },
//       { 
//         new: true,
//         runValidators: true 
//       }
//     );

//     if (!updatedInterview) {
//       return res.status(404).json({
//         success: false,
//         message: 'Interview not found'
//       });
//     }

//     console.log("Interview completed successfully");
    
//     // CRITICAL: Return data in the EXACT format ResultsPage expects
//     const responseData = {
//       session: {
//         _id: updatedSession._id,
//         interviewId: updatedSession.interviewId,
//         userId: updatedSession.userId,
//         conversation: updatedSession.conversation,
//         questionEvaluations: updatedSession.questionEvaluations || [],
//         sessionStatus: updatedSession.sessionStatus,
//         overallScore: updatedSession.overallScore,
//         technicalScore: updatedSession.technicalScore,
//         communicationScore: updatedSession.communicationScore,
//         problemSolvingScore: updatedSession.problemSolvingScore,
//         feedback: updatedSession.feedback,
//         createdAt: updatedSession.createdAt,
//         updatedAt: updatedSession.updatedAt
//       },
//       feedback: {
//         summary: feedback.summary,
//         strengths: feedback.strengths,
//         improvements: feedback.improvements,
//         overallScore: feedback.overallScore,
//         technicalScore: feedback.technicalScore,
//         communicationScore: feedback.communicationScore,
//         problemSolvingScore: feedback.problemSolvingScore
//       }
//     };
    
//     res.json({
//       success: true,
//       data: responseData
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

// controllers/aiInterview.controller.js


const generateEnhancedFeedback = async (session) => {
  try {
    const evaluations = session.questionEvaluations || [];
    
    if (evaluations.length === 0) {
      return getDefaultFeedback();
    }
    
    // Calculate category scores
    const technical = evaluations.filter(e => e.category === 'technical');
    const behavioral = evaluations.filter(e => e.category === 'behavioral');
    const coding = evaluations.filter(e => e.category === 'coding');
    const problemSolving = evaluations.filter(e => e.category === 'problem-solving');
    
    const technicalScore = calculateAverageScore(technical);
    const communicationScore = calculateAverageScore(behavioral);
    const problemSolvingScore = calculateAverageScore([...coding, ...problemSolving]);
    
    // Calculate overall score (0-100)
    const overallScore = Math.round(
      (technicalScore * 10 * 0.4) + 
      (communicationScore * 10 * 0.3) + 
      (problemSolvingScore * 10 * 0.3)
    );
    
    // Generate strengths (from high-scoring questions)
    const strengths = generateStrengths(evaluations);
    
    // Generate improvements (from low-scoring questions)
    const improvements = generateImprovements(evaluations);
    
    // Generate key highlights
    const keyHighlights = evaluations
      .filter(e => e.score >= 8)
      .slice(0, 3)
      .map(e => `Excellent response to: "${e.question.substring(0, 50)}..."`);
    
    // Generate areas of concern
    const areasOfConcern = evaluations
      .filter(e => e.score < 5)
      .slice(0, 3)
      .map(e => `Needs improvement: "${e.question.substring(0, 50)}..."`);
    
    // Generate detailed analysis
    const technicalAnalysis = generateTechnicalAnalysis(technical);
    const behavioralAnalysis = generateBehavioralAnalysis(behavioral);
    
    // Generate summary
    const summary = generateSummary(overallScore, technicalScore, communicationScore, problemSolvingScore);
    
    return {
      summary,
      strengths: strengths.slice(0, 5),
      improvements: improvements.slice(0, 5),
      keyHighlights: keyHighlights.length > 0 ? keyHighlights : ['Completed the interview'],
      areasOfConcern: areasOfConcern.length > 0 ? areasOfConcern : [],
      technicalAnalysis,
      behavioralAnalysis,
      overallScore,
      technicalScore,
      communicationScore,
      problemSolvingScore
    };
  } catch (error) {
    console.error('Error generating feedback:', error);
    return getDefaultFeedback();
  }
};

// Helper functions
const calculateAverageScore = (questions) => {
  if (questions.length === 0) return 5;
  return Math.round(
    questions.reduce((sum, q) => sum + (q.score || 0), 0) / questions.length
  );
};

const generateStrengths = (evaluations) => {
  const highScoring = evaluations.filter(e => e.score >= 7);
  const strengths = [];
  
  // Group by category
  const categories = ['technical', 'behavioral', 'coding', 'problem-solving'];
  categories.forEach(cat => {
    const catQuestions = highScoring.filter(e => e.category === cat);
    if (catQuestions.length > 0) {
      strengths.push(`Strong performance in ${cat} questions`);
    }
  });
  
  // Add specific strengths from evaluations
  highScoring.forEach(e => {
    if (e.strengths && e.strengths.length > 0) {
      strengths.push(...e.strengths);
    }
  });
  
  return [...new Set(strengths)]; // Remove duplicates
};

const generateImprovements = (evaluations) => {
  const lowScoring = evaluations.filter(e => e.score < 6);
  const improvements = [];
  
  // Group by category
  const categories = ['technical', 'behavioral', 'coding', 'problem-solving'];
  categories.forEach(cat => {
    const catQuestions = lowScoring.filter(e => e.category === cat);
    if (catQuestions.length > 0) {
      improvements.push(`Focus on improving ${cat} skills`);
    }
  });
  
  // Add specific improvements from evaluations
  lowScoring.forEach(e => {
    if (e.improvements && e.improvements.length > 0) {
      improvements.push(...e.improvements);
    }
  });
  
  return [...new Set(improvements)]; // Remove duplicates
};

const generateTechnicalAnalysis = (technicalQuestions) => {
  const avgScore = calculateAverageScore(technicalQuestions);
  
  return {
    coreConcepts: avgScore >= 7 
      ? "Demonstrates solid understanding of core technical concepts"
      : "Needs to strengthen fundamental technical knowledge",
    problemSolvingApproach: avgScore >= 7
      ? "Shows logical and structured approach to problem-solving"
      : "Consider practicing more structured problem-solving techniques",
    codeQuality: avgScore >= 7
      ? "Writes clean and maintainable code"
      : "Focus on code organization and best practices",
    bestPractices: avgScore >= 7
      ? "Follows industry best practices"
      : "Study common design patterns and best practices"
  };
};

const generateBehavioralAnalysis = (behavioralQuestions) => {
  const avgScore = calculateAverageScore(behavioralQuestions);
  
  return {
    communication: avgScore >= 7
      ? "Communicates ideas clearly and effectively"
      : "Work on articulating thoughts more clearly",
    confidence: avgScore >= 7
      ? "Demonstrates good confidence in responses"
      : "Build confidence through more practice",
    professionalism: avgScore >= 7
      ? "Maintains professional demeanor throughout"
      : "Focus on professional communication skills",
    adaptability: avgScore >= 7
      ? "Shows flexibility in approaching different scenarios"
      : "Practice adapting to different question types"
  };
};

const generateSummary = (overall, technical, communication, problemSolving) => {
  if (overall >= 80) {
    return `Excellent performance! You scored ${overall}/100, demonstrating strong capabilities across all areas. Your technical skills (${technical}/10) and problem-solving abilities (${problemSolving}/10) are particularly impressive.`;
  } else if (overall >= 60) {
    return `Good job! You scored ${overall}/100, showing solid understanding in most areas. Focus on improving ${technical < 6 ? 'technical concepts' : communication < 6 ? 'communication clarity' : 'problem-solving approaches'} to reach the next level.`;
  } else {
    return `Keep practicing! You scored ${overall}/100. Review the feedback carefully and work on ${technical < 6 ? 'technical fundamentals' : communication < 6 ? 'communication skills' : 'problem-solving strategies'}. Every interview is a learning opportunity!`;
  }
};

const getDefaultFeedback = () => ({
  summary: "Interview completed. Continue practicing to improve your skills!",
  strengths: ["Completed the interview", "Showed determination"],
  improvements: ["Practice more technical questions", "Work on communication clarity"],
  keyHighlights: ["Participated actively"],
  areasOfConcern: [],
  technicalAnalysis: {
    coreConcepts: "Not enough data to analyze",
    problemSolvingApproach: "Not enough data to analyze",
    codeQuality: "Not enough data to analyze",
    bestPractices: "Not enough data to analyze"
  },
  behavioralAnalysis: {
    communication: "Not enough data to analyze",
    confidence: "Not enough data to analyze",
    professionalism: "Not enough data to analyze",
    adaptability: "Not enough data to analyze"
  },
  overallScore: 50,
  technicalScore: 5,
  communicationScore: 5,
  problemSolvingScore: 5
});

/**
 * Complete interview with enhanced feedback
 */
export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const userId = req.user.id;
    
    console.log("Completing interview:", interviewId, "for user:", userId);

    // Find session
    const session = await InterviewSession.findOne({ 
      interviewId: interviewId, 
      userId: userId 
    }).populate('interviewId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Generate enhanced feedback
    const feedback = await generateEnhancedFeedback(session);

    // Update session with complete feedback structure
    const updatedSession = await InterviewSession.findByIdAndUpdate(
      session._id,
      {
        $set: {
          sessionStatus: 'completed',
          overallScore: feedback.overallScore,
          technicalScore: feedback.technicalScore,
          communicationScore: feedback.communicationScore,
          problemSolvingScore: feedback.problemSolvingScore,
          feedback: {
            summary: feedback.summary,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            keyHighlights: feedback.keyHighlights,
            areasOfConcern: feedback.areasOfConcern,
            technicalAnalysis: feedback.technicalAnalysis,
            behavioralAnalysis: feedback.behavioralAnalysis
          },
          'stats.totalQuestions': session.questionEvaluations.length,
          'stats.questionsAnswered': session.questionEvaluations.filter(q => q.userAnswer).length,
          'stats.questionsSkipped': session.questionEvaluations.filter(q => !q.userAnswer).length
        }
      },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('interviewId');

    // Generate certificate data
    const certificateData = generateCertificate(updatedSession, feedback);

    // Update interview with certificate
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
          overallScore: feedback.overallScore,
          technicalScore: feedback.technicalScore,
          communicationScore: feedback.communicationScore,
          problemSolvingScore: feedback.problemSolvingScore,
          feedback: feedback.summary,
          strengths: feedback.strengths,
          improvements: feedback.improvements,
          sessionId: updatedSession._id,
          certificate: certificateData
        }
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    console.log("Interview completed successfully");
    
    // Return comprehensive data
    const responseData = {
      session: {
        _id: updatedSession._id,
        interviewId: updatedSession.interviewId,
        userId: updatedSession.userId,
        conversation: updatedSession.conversation,
        questionEvaluations: updatedSession.questionEvaluations || [],
        sessionStatus: updatedSession.sessionStatus,
        overallScore: updatedSession.overallScore,
        technicalScore: updatedSession.technicalScore,
        communicationScore: updatedSession.communicationScore,
        problemSolvingScore: updatedSession.problemSolvingScore,
        feedback: updatedSession.feedback,
        stats: updatedSession.stats,
        createdAt: updatedSession.createdAt,
        updatedAt: updatedSession.updatedAt
      },
      feedback: feedback,
      certificate: certificateData
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

// Certificate generation helper
const generateCertificate = (session, feedback) => {
  const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();
  const issuedAt = new Date();
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1); // Valid for 1 year
  
  return {
    certificateId,
    issuedAt,
    validUntil,
    verificationCode,
    shareableLink: `${process.env.FRONTEND_URL}/certificates/${certificateId}`,
    userName: session.userId.name || 'Candidate',
    interviewType: session.interviewId.difficulty.toUpperCase(),
    domain: session.interviewId.role,
    score: feedback.overallScore,
    grade: feedback.overallScore >= 90 ? 'A' : feedback.overallScore >= 80 ? 'B' : feedback.overallScore >= 70 ? 'C' : 'D'
  };
};