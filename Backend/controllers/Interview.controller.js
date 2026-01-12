// // controllers/interviewController.js
// import Interview from '../models/Interview.model.js';
// import questionGenerator from '../services/questionGenerator.js';
// import answerEvaluator from '../services/answerEvaluator.js';
// import emotionAnalyzer from '../services/emotionAnalyzer.js';

// function safeAverage(numbers) {
//   const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n) && isFinite(n));
//   if (validNumbers.length === 0) return 0;
//   const sum = validNumbers.reduce((a, b) => a + b, 0);
//   return Math.round(sum / validNumbers.length);
// }

// // Helper function to safely get number
// function safeNumber(value, defaultValue = 0) {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// }

// class InterviewController {

//   // Create and initialize new interview
//   // async createInterview(req, res) {
//   //   try {
//   //     const { domain, subDomain, interviewType, difficulty, duration, targetCompany, customQuestions } = req.body;
//   //     const userId = req.user.id;

//   //     // Validate required fields
//   //     if (!domain || !subDomain || !interviewType) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Missing required fields'
//   //       });
//   //     }

//   //     // Create interview document
//   //     const interview = new Interview({
//   //       userId,
//   //       config: {
//   //         domain,
//   //         subDomain,
//   //         interviewType,
//   //         difficulty: difficulty || 'medium',
//   //         duration: duration || 30,
//   //         targetCompany,
//   //         customQuestions: customQuestions || false
//   //       },
//   //       status: 'pending'
//   //     });

//   //     await interview.save();

//   //     res.status(201).json({
//   //       success: true,
//   //       message: 'Interview created successfully',
//   //       data: {
//   //         id: interview._id,
//   //         config: interview.config,
//   //         status: interview.status
//   //       }
//   //     });

//   //   } catch (error) {
//   //     console.error('Create interview error:', error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: 'Failed to create interview',
//   //       error: error.message
//   //     });
//   //   }
//   // }

//   async createInterview(req, res) {
//   try {
//     const {
//       domain,
//       subDomain,
//       interviewType,
//       difficulty,
//       duration,
//       targetCompany,
//       customQuestions
//     } = req.body;
//     const userId = req.user.id;

//     // Validate required fields
//     if (!domain || !subDomain || !interviewType) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields: domain, subDomain, and interviewType are required'
//       });
//     }

//     // Validate interviewType
//     const validTypes = ['behavioral', 'technical', 'system-design', 'coding', 'mixed'];
//     if (!validTypes.includes(interviewType)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid interview type. Must be one of: ${validTypes.join(', ')}`
//       });
//     }

//     // Validate difficulty
//     const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
//     const finalDifficulty = difficulty || 'medium';
//     if (!validDifficulties.includes(finalDifficulty)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`
//       });
//     }

//     // Parse custom questions if provided
//     let parsedQuestions = [];
//     if (customQuestions) {
//       try {
//         parsedQuestions = typeof customQuestions === 'string'
//           ? JSON.parse(customQuestions)
//           : customQuestions;
//       } catch (e) {
//         console.error('Error parsing custom questions:', e);
//       }
//     }

//     // Create interview document
//     const interview = new Interview({
//       userId,
//       config: {
//         domain,
//         subDomain,
//         interviewType,
//         difficulty: finalDifficulty,
//         duration: duration || 30,
//         targetCompany: targetCompany || 'General',
//         customQuestions: parsedQuestions.length > 0
//       },
//       status: 'pending',
//       // Store custom questions in a separate field if needed
//       customQuestionsList: parsedQuestions
//     });

//     await interview.save();

//     res.status(201).json({
//       success: true,
//       message: 'Interview created successfully',
//       data: {
//         id: interview._id,
//         config: interview.config,
//         status: interview.status
//       }
//     });

//   } catch (error) {
//     console.error('Create interview error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create interview',
//       error: error.message
//     });
//   }
// }

//   // Start interview - generate questions and return first one
//   async startInterview(req, res) {
//     try {
//       const { interviewId } = req.params;
//       const userId = req.user.id;

//       const interview = await Interview.findOne({ _id: interviewId, userId });

//       if (!interview) {
//         return res.status(404).json({
//           success: false,
//           message: 'Interview not found'
//         });
//       }

//       if (interview.status !== 'pending') {
//         return res.status(400).json({
//           success: false,
//           message: 'Interview already started or completed'
//         });
//       }

//       // Generate questions using AI
//       const questions = await questionGenerator.generateQuestions(interview.config);

//       // Create first round
//       interview.rounds = [{
//         roundNumber: 1,
//         roundType: interview.config.interviewType,
//         questions: questions,
//         answers: []
//       }];

//       interview.status = 'in-progress';
//       interview.startTime = new Date();
//       interview.performance.totalQuestions = questions.length;

//       await interview.save();

//       // Calculate time remaining
//       const timeRemaining = interview.config.duration * 60; // Convert to seconds

//       res.json({
//         success: true,
//         data: {
//           id: interview._id,
//           config: interview.config,
//           rounds: interview.rounds,
//           currentQuestion: questions[0],
//           totalQuestions: questions.length,
//           timeRemaining,
//           status: interview.status
//         }
//       });

//     } catch (error) {
//       console.error('Start interview error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to start interview',
//         error: error.message
//       });
//     }
//   }

//   // Submit answer and get next question
//   // controllers/interviewController.js

// async submitAnswer(req, res) {
//   try {
//     const { interviewId } = req.params;
//     const { questionId, answer, timeTaken, hintsUsed, skipped } = req.body;
//     const userId = req.user.id;

//     const interview = await Interview.findOne({ _id: interviewId, userId });

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message: 'Interview not found'
//       });
//     }

//     if (interview.status !== 'in-progress') {
//       return res.status(400).json({
//         success: false,
//         message: 'Interview is not in progress'
//       });
//     }

//     // Find the question
//     const currentRound = interview.rounds[interview.rounds.length - 1];
//     const question = currentRound.questions.find(q => q.questionId === questionId);

//     if (!question) {
//       return res.status(404).json({
//         success: false,
//         message: 'Question not found'
//       });
//     }

//     let evaluation = null;

//     // Evaluate answer if not skipped
//     if (!skipped && answer && answer.trim()) {
//       try {
//         evaluation = await answerEvaluator.evaluateAnswer(question, answer, {
//           interviewType: interview.config.interviewType,
//           difficulty: interview.config.difficulty
//         });
//       } catch (evalError) {
//         console.error('Evaluation error:', evalError);
//         // Use fallback evaluation if AI fails
//         evaluation = {
//           score: 50,
//           feedback: 'Answer recorded. Evaluation temporarily unavailable.',
//           strengths: ['Provided an answer'],
//           improvements: ['Technical evaluation pending'],
//           technicalAccuracy: 50,
//           clarity: 50,
//           completeness: 50,
//           categoryScores: {
//             accuracy: 50,
//             clarity: 50,
//             completeness: 50,
//             depth: 50
//           }
//         };
//       }
//     }

//     // Save answer
//     currentRound.answers.push({
//       questionId,
//       answer: answer || '',
//       timeTaken: timeTaken || 0,
//       hintsUsed: hintsUsed || 0,
//       skipped: skipped || false,
//       evaluation: evaluation || {
//         score: 0,
//         feedback: 'Question skipped',
//         strengths: [],
//         improvements: ['Question was skipped'],
//         technicalAccuracy: 0,
//         clarity: 0,
//         completeness: 0,
//         categoryScores: {
//           accuracy: 0,
//           clarity: 0,
//           completeness: 0,
//           depth: 0
//         }
//       }
//     });

//     // Update performance metrics safely
//     const allAnswers = currentRound.answers;
//     const answeredCount = allAnswers.filter(a => !a.skipped).length;
//     const skippedCount = allAnswers.filter(a => a.skipped).length;

//     interview.performance.questionsAnswered = answeredCount;
//     interview.performance.questionsSkipped = skippedCount;
//     interview.performance.hintsUsed = (interview.performance.hintsUsed || 0) + (hintsUsed || 0);

//     // Calculate average scores SAFELY
//     const validAnswers = allAnswers.filter(a => !a.skipped && a.evaluation && a.evaluation.score);

//     if (validAnswers.length > 0) {
//       // Overall score
//       const totalScore = validAnswers.reduce((sum, a) => sum + (a.evaluation.score || 0), 0);
//       interview.performance.overallScore = Math.round(totalScore / validAnswers.length);

//       // Category scores with safety checks
//       const totalTechnical = validAnswers.reduce((sum, a) => sum + (a.evaluation.technicalAccuracy || 0), 0);
//       const totalClarity = validAnswers.reduce((sum, a) => sum + (a.evaluation.clarity || 0), 0);
//       const totalCompleteness = validAnswers.reduce((sum, a) => sum + (a.evaluation.completeness || 0), 0);

//       interview.performance.categoryScores.technical = Math.round(totalTechnical / validAnswers.length);
//       interview.performance.categoryScores.communication = Math.round(totalClarity / validAnswers.length);
//       interview.performance.categoryScores.problemSolving = Math.round(totalCompleteness / validAnswers.length);

//       // Confidence score based on consistency
//       const scores = validAnswers.map(a => a.evaluation.score || 0);
//       const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
//       const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
//       const consistency = Math.max(0, 100 - variance);
//       interview.performance.categoryScores.confidence = Math.round(consistency);
//     } else {
//       // No valid answers yet - set to 0 instead of NaN
//       interview.performance.overallScore = 0;
//       interview.performance.categoryScores.technical = 0;
//       interview.performance.categoryScores.communication = 0;
//       interview.performance.categoryScores.problemSolving = 0;
//       interview.performance.categoryScores.confidence = 0;
//     }

//     // Save interview
//     await interview.save();

//     // Check if interview is complete
//     const isComplete = currentRound.answers.length >= currentRound.questions.length;
//     const nextQuestionIndex = currentRound.answers.length;
//     const nextQuestion = isComplete ? null : currentRound.questions[nextQuestionIndex];

//     res.json({
//       success: true,
//       data: {
//         evaluation: evaluation,
//         isComplete,
//         nextQuestion,
//         progress: {
//           answered: interview.performance.questionsAnswered,
//           total: interview.performance.totalQuestions,
//           percentage: Math.round((currentRound.answers.length / currentRound.questions.length) * 100)
//         },
//         currentScore: interview.performance.overallScore,
//         categoryScores: interview.performance.categoryScores
//       }
//     });

//   } catch (error) {
//     console.error('Submit answer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit answer',
//       error: error.message
//     });
//   }
// }

//   // Get hint for current question
//   async getHint(req, res) {
//     try {
//       const { interviewId, questionId } = req.params;
//       const { hintIndex } = req.query;
//       const userId = req.user.id;

//       const interview = await Interview.findOne({ _id: interviewId, userId });

//       if (!interview) {
//         return res.status(404).json({
//           success: false,
//           message: 'Interview not found'
//         });
//       }

//       const currentRound = interview.rounds[interview.rounds.length - 1];
//       const question = currentRound.questions.find(q => q.questionId === questionId);

//       if (!question) {
//         return res.status(404).json({
//           success: false,
//           message: 'Question not found'
//         });
//       }

//       const index = parseInt(hintIndex) || 0;
//       if (index >= question.hints.length) {
//         return res.status(400).json({
//           success: false,
//           message: 'No more hints available'
//         });
//       }

//       res.json({
//         success: true,
//         data: {
//           hint: question.hints[index],
//           hintsRemaining: question.hints.length - index - 1,
//           pointsDeducted: 5 // Each hint costs 5 points
//         }
//       });

//     } catch (error) {
//       console.error('Get hint error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get hint',
//         error: error.message
//       });
//     }
//   }

//   // Analyze emotion from video frame
//   async analyzeEmotion(req, res) {
//     try {
//       const { interviewId } = req.params;
//       const { frameData, timestamp } = req.body;
//       const userId = req.user.id;

//       const interview = await Interview.findOne({ _id: interviewId, userId });

//       if (!interview) {
//         return res.status(404).json({
//           success: false,
//           message: 'Interview not found'
//         });
//       }

//       // Analyze emotion from frame
//       const emotionData = await emotionAnalyzer.analyzeFrame(frameData);

//       // Store emotion data
//       if (!interview.metrics.emotionTimeline) {
//         interview.metrics.emotionTimeline = [];
//       }

//       interview.metrics.emotionTimeline.push({
//         timestamp,
//         emotions: emotionData.emotions
//       });

//       // Update confidence timeline
//       if (!interview.metrics.confidence) {
//         interview.metrics.confidence = [];
//       }

//       interview.metrics.confidence.push({
//         timestamp,
//         value: emotionData.confidence
//       });

//       await interview.save();

//       res.json({
//         success: true,
//         data: emotionData
//       });

//     } catch (error) {
//       console.error('Analyze emotion error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to analyze emotion',
//         error: error.message
//       });
//     }
//   }

//   // Complete interview and generate final analysis
//   async completeInterview(req, res) {
//     try {
//       const { interviewId } = req.params;
//       const { videoUrl } = req.body;
//       const userId = req.user.id;

//       const interview = await Interview.findOne({ _id: interviewId, userId });

//       if (!interview) {
//         return res.status(404).json({
//           success: false,
//           message: 'Interview not found'
//         });
//       }

//       if (interview.status !== 'in-progress') {
//         return res.status(400).json({
//           success: false,
//           message: 'Interview is not in progress'
//         });
//       }

//       // Update interview status
//       interview.status = 'completed';
//       interview.endTime = new Date();
//       interview.totalDuration = Math.floor((interview.endTime - interview.startTime) / 1000);

//       if (videoUrl) {
//         interview.videoRecording.url = videoUrl;
//         interview.videoRecording.uploaded = true;
//         interview.videoRecording.duration = interview.totalDuration;
//       }

//       // Generate comprehensive AI analysis
//       const aiAnalysis = await answerEvaluator.evaluateInterview(interview);
//       interview.aiAnalysis = aiAnalysis;

//       // Calculate percentile (mock calculation - in production, compare with other users)
//       interview.performance.percentile = this._calculatePercentile(interview.performance.overallScore);

//       await interview.save();

//       res.json({
//         success: true,
//         message: 'Interview completed successfully',
//         data: {
//           id: interview._id,
//           performance: interview.performance,
//           aiAnalysis: interview.aiAnalysis
//         }
//       });

//     } catch (error) {
//       console.error('Complete interview error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to complete interview',
//         error: error.message
//       });
//     }
//   }

//   // Get interview results
//   async getResults(req, res) {
//     try {
//       const { interviewId } = req.params;
//       const userId = req.user.id;

//       const interview = await Interview.findOne({ _id: interviewId, userId });

//       if (!interview) {
//         return res.status(404).json({
//           success: false,
//           message: 'Interview not found'
//         });
//       }

//       if (interview.status !== 'completed') {
//         return res.status(400).json({
//           success: false,
//           message: 'Interview not completed yet'
//         });
//       }

//       res.json({
//         success: true,
//         data: {
//           id: interview._id,
//           config: interview.config,
//           performance: interview.performance,
//           aiAnalysis: interview.aiAnalysis,
//           rounds: interview.rounds,
//           metrics: interview.metrics,
//           videoRecording: interview.videoRecording,
//           duration: interview.totalDuration,
//           completedAt: interview.endTime
//         }
//       });

//     } catch (error) {
//       console.error('Get results error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get results',
//         error: error.message
//       });
//     }
//   }

//   // Get user's interview history
//   async getInterviewHistory(req, res) {
//     try {
//       const userId = req.user.id;
//       const { status, page = 1, limit = 10 } = req.query;

//       const query = { userId };
//       if (status) {
//         query.status = status;
//       }

//       const interviews = await Interview.find(query)
//         .select('config status performance startTime endTime createdAt')
//         .sort({ createdAt: -1 })
//         .limit(limit * 1)
//         .skip((page - 1) * limit)
//         .exec();

//       const count = await Interview.countDocuments(query);

//       res.json({
//         success: true,
//         data: {
//           interviews,
//           totalPages: Math.ceil(count / limit),
//           currentPage: page,
//           total: count
//         }
//       });

//     } catch (error) {
//       console.error('Get interview history error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to get interview history',
//         error: error.message
//       });
//     }
//   }

//   // Helper method to calculate percentile
//   _calculatePercentile(score) {
//     // Mock percentile calculation
//     // In production, query database for users with similar config and compare scores
//     if (score >= 90) return 95;
//     if (score >= 80) return 85;
//     if (score >= 70) return 70;
//     if (score >= 60) return 55;
//     if (score >= 50) return 40;
//     return 25;
//   }
// }

// export default  new InterviewController();

// controllers/interviewController.js
import Interview from "../models/Interview.model.js";
import questionGenerator from "../services/questionGenerator.js";
import answerEvaluator from "../services/answerEvaluator.js";
import emotionAnalyzer from "../services/emotionAnalyzer.js";
import resultsGenerator from "../services/resultsGenerator.js";
import mongoose from "mongoose";
import groqService from "../services/groqService.js";

// Helper function to safely get number
function safeNumber(value, defaultValue = 0) {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
}

// Helper function to calculate percentile (moved outside class)
function calculatePercentile(score) {
  if (score >= 90) return 95;
  if (score >= 80) return 85;
  if (score >= 70) return 70;
  if (score >= 60) return 55;
  if (score >= 50) return 40;
  return 25;
}

class InterviewController {
  // Create Interview
  async createInterview(req, res) {
    try {
      const {
        domain,
        subDomain,
        interviewType,
        difficulty,
        duration,
        targetCompany,
        customQuestions,
      } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!domain || !subDomain || !interviewType) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: domain, subDomain, and interviewType are required",
        });
      }

      // Validate interviewType
      const validTypes = [
        "behavioral",
        "technical",
        "system-design",
        "coding",
        "mixed",
      ];
      if (!validTypes.includes(interviewType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid interview type. Must be one of: ${validTypes.join(
            ", ",
          )}`,
        });
      }

      // Parse custom questions
      let parsedQuestions = [];
      if (customQuestions) {
        try {
          parsedQuestions =
            typeof customQuestions === "string"
              ? JSON.parse(customQuestions)
              : customQuestions;
        } catch (e) {
          console.error("Error parsing custom questions:", e);
        }
      }

      // Create interview
      const interview = new Interview({
        userId,
        config: {
          domain,
          subDomain,
          interviewType,
          difficulty: difficulty || "medium",
          duration: duration || 30,
          targetCompany: targetCompany || "General",
          customQuestions: parsedQuestions.length > 0,
        },
        status: "pending",
        customQuestionsList: parsedQuestions,
      });

      await interview.save();
      await interview.populate("userId");

      res.status(201).json({
        success: true,
        message: "Interview created successfully",
        data: {
          interviewId: interview._id,
          id: interview._id,
          user: interview.userId,
          config: interview.config,
          status: interview.status,
        },
      });
    } catch (error) {
      console.error("Create interview error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create interview",
        error: error.message,
      });
    }
  }

  // Start Interview - FIX: Add retry logic and proper session handling
  // async startInterview(req, res) {
  //   try {
  //     const { interviewId } = req.params;
  //     const userId = req.user.id;

  //     // Find interview
  //     const interview = await Interview.findOne({ _id: interviewId, userId });

  //     if (!interview) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Interview not found'
  //       });
  //     }

  //     if (interview.status !== 'pending') {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Interview already started or completed'
  //       });
  //     }

  //     // Generate questions
  //     console.log('Generating questions for:', interview.config);
  //     const questions = await questionGenerator.generateQuestions(interview.config);

  //     if (!questions || questions.length === 0) {
  //       return res.status(500).json({
  //         success: false,
  //         message: 'Failed to generate questions'
  //       });
  //     }

  //     // Update interview - FIX: Use atomic update
  //     interview.rounds = [{
  //       roundNumber: 1,
  //       roundType: interview.config.interviewType,
  //       questions: questions,
  //       answers: []
  //     }];
  //     interview.status = 'in-progress';
  //     interview.startTime = new Date();
  //     interview.performance.totalQuestions = questions.length;

  //     // Save with retry
  //     let retries = 3;
  //     let saved = false;

  //     while (retries > 0 && !saved) {
  //       try {
  //         await interview.save();
  //         saved = true;
  //       } catch (saveError) {
  //         retries--;
  //         if (retries === 0) throw saveError;
  //         console.log(`Save failed, retrying... (${retries} attempts left)`);
  //         await new Promise(resolve => setTimeout(resolve, 100));
  //       }
  //     }

  //     // Calculate time remaining
  //     const timeRemaining = interview.config.duration * 60;

  //     res.json({
  //       success: true,
  //       data: {
  //         interviewId: interview._id,
  //         config: interview.config,
  //         rounds: interview.rounds,
  //         currentQuestion: questions[0],
  //         totalQuestions: questions.length,
  //         timeRemaining,
  //         status: interview.status,
  //         metrics: {
  //           technical: 0,
  //           communication: 0,
  //           confidence: 0,
  //           problemSolving: 0
  //         }
  //       }
  //     });

  //   } catch (error) {
  //     console.error('Start interview error:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Failed to start interview',
  //       error: error.message
  //     });
  //   }
  // }

  // Start Interview
  async startInterview(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;
      const objectUserId = new mongoose.Types.ObjectId(userId);

      // Find interview
      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      if (interview.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Interview already started or completed",
        });
      }

      // Generate questions - handle "mixed" type
      console.log("Generating questions for:", interview.config);
      let actualInterviewType = interview.config.interviewType;

      // If mixed, randomly choose a type for question generation
      if (actualInterviewType === "mixed") {
        const types = ["behavioral", "technical", "system-design", "coding"];
        actualInterviewType = types[Math.floor(Math.random() * types.length)];
      }

      const configForGeneration = {
        ...interview.config,
        interviewType: actualInterviewType,
      };

      const questions =
        await questionGenerator.generateQuestions(configForGeneration);

      if (!questions || questions.length === 0) {
        return res.status(500).json({
          success: false,
          message: "Failed to generate questions",
        });
      }

      // Use findOneAndUpdate with atomic operation
      const updatedInterview = await Interview.findOneAndUpdate(
        { _id: interviewId },
        {
          $set: {
            rounds: [
              {
                roundNumber: 1,
                roundType: actualInterviewType,
                questions: questions,
                answers: [],
              },
            ],
            status: "in-progress",
            startTime: new Date(),
            "performance.totalQuestions": questions.length,
            "performance.questionsAnswered": 0,
            "performance.questionsSkipped": 0,
            "performance.hintsUsed": 0,
          },
        },
        { new: true },
      );

      if (!updatedInterview) {
        return res.status(400).json({
          success: false,
          message: "Failed to start interview. Please try again.",
        });
      }

      // Calculate time remaining
      const timeRemaining = updatedInterview.config.duration * 60;

      res.json({
        success: true,
        data: {
          interviewId: updatedInterview._id,
          config: updatedInterview.config,
          rounds: updatedInterview.rounds,
          currentQuestion: questions[0],
          totalQuestions: questions.length,
          timeRemaining,
          status: updatedInterview.status,
          performance: updatedInterview.performance, // ADD THIS
          progress: {
            // ADD THIS
            answered: 0,
            total: questions.length,
            percentage: 0,
          },
          metrics: {
            technical: 0,
            communication: 0,
            confidence: 0,
            problemSolving: 0,
          },
        },
      });
    } catch (error) {
      console.error("Start interview error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to start interview",
        error: error.message,
      });
    }
  }

  // Add this method to the InterviewController class

  async getRealTimeResponse(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, answer, conversationHistory, questionType, type } =
        req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      const question = round.questions.find((q) => q.questionId === questionId);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      // Build conversation context
      const conversationContext = conversationHistory
        .map(
          (msg) =>
            `${msg.role === "user" ? "Candidate" : "Interviewer"}: ${msg.content}`,
        )
        .join("\n");

      // Prepare messages for Groq
      const messages = [
        {
          role: "system",
          content: `You are an expert technical interviewer conducting a ${interview.config.interviewType} interview for ${interview.config.domain} - ${interview.config.subDomain}.
Difficulty level: ${interview.config.difficulty}

Your responsibilities:
1. Listen carefully to candidate's answers
2. Ask follow-up questions if answers are incomplete or unclear
3. Provide constructive feedback when answers are complete
4. Be encouraging yet professional
5. Determine if the answer is sufficient to move forward`,
        },
        {
          role: "user",
          content: `Current Question: "${question.question}"

Conversation History:
${conversationContext}

Candidate's Latest Response: "${answer}"

Evaluate the response and provide your feedback in the following JSON structure:
{
  "response": "Your verbal response to the candidate",
  "isComplete": boolean,
  "needsFollowUp": boolean,
  "followUpQuestion": "question if needed (null if not needed)",
  "evaluation": {
    "score": number (0-100, only if isComplete is true, otherwise null),
    "feedback": "detailed feedback",
    "strengths": ["point1", "point2"],
    "improvements": ["point1", "point2"]
  }
}`,
        },
      ];

      // Use GroqService to get JSON response
      const aiData = await groqService.generateJSON(messages, {
        temperature: 0.7,
        maxTokens: 1500,
      });

      res.json({
        success: true,
        data: aiData,
      });
    } catch (error) {
      console.error("Real-time response error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get real-time response",
        error: error.message,
      });
    }
  }

  async evaluateCode(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, code, language, speakReview } = req.body;
      const userId = req.user.id;

      if (!code || !language) {
        return res.status(400).json({
          success: false,
          message: "Code and language are required",
        });
      }

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      const question = round.questions.find((q) => q.questionId === questionId);

      // Prepare messages for code evaluation
      const messages = [
        {
          role: "system",
          content: `You are an expert code reviewer conducting technical interviews. Provide comprehensive, constructive feedback as you would in a real interview setting.`,
        },
        {
          role: "user",
          content: `Review this ${language} code for the following question:

**Question:** "${question.question}"
**Domain:** ${interview.config.domain}
**Difficulty:** ${interview.config.difficulty}

**Code Submission:**
\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive code review in JSON format:
{
  "score": number (0-100),
  "correctness": number (0-100),
  "efficiency": number (0-100),
  "readability": number (0-100),
  "bestPractices": number (0-100),
  "feedback": "Natural, conversational feedback as you would speak to a candidate",
  "verbalReview": "A complete verbal review that can be spoken aloud (2-3 sentences)",
  "strengths": ["specific strength 1", "specific strength 2", ...],
  "improvements": ["specific improvement 1", "specific improvement 2", ...],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", ...],
  "isCorrect": boolean,
  "hasErrors": boolean,
  "errors": ["error description if any"]
}

Be encouraging but honest. Provide specific, actionable feedback.`,
        },
      ];

      // Use GroqService to get JSON response
      const evaluation = await groqService.generateJSON(messages, {
        temperature: 0.6,
        maxTokens: 2000,
      });

      res.json({
        success: true,
        data: evaluation,
      });
    } catch (error) {
      console.error("Code evaluation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to evaluate code",
        error: error.message,
      });
    }
  }

  // Optional: Streaming response for real-time feedback
  async streamResponse(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, answer } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      const question = round.questions.find((q) => q.questionId === questionId);

      // Set headers for SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const messages = [
        {
          role: "system",
          content: `You are an interviewer providing real-time feedback.`,
        },
        {
          role: "user",
          content: `Question: "${question.question}"\nAnswer: "${answer}"\n\nProvide brief feedback.`,
        },
      ];

      // Stream the response
      for await (const chunk of groqService.streamCompletion(messages)) {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error("Stream error:", error);
      res.status(500).json({
        success: false,
        message: "Streaming failed",
        error: error.message,
      });
    }
  }
  // Submit Answer - FIX: Add real-time metrics
  // Submit Answer
  async submitAnswer(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, answer, timeTaken, hintsUsed, skipped } = req.body;
      const userId = req.user.id;

      // Validate inputs
      if (!answer || answer.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Answer cannot be empty",
        });
      }

      // Validate timeTaken
      const validTimeTaken = safeNumber(timeTaken, 0);
      if (validTimeTaken < 0 || validTimeTaken > 3600) {
        return res.status(400).json({
          success: false,
          message: "Invalid time taken. Must be between 0 and 3600 seconds",
        });
      }

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      if (!round) {
        return res.status(404).json({
          success: false,
          message: "Round not found",
        });
      }

      const question = round.questions.find((q) => q.questionId === questionId);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      // Check if already answered
      const alreadyAnswered = round.answers.find(
        (a) => a.questionId === questionId,
      );
      if (alreadyAnswered) {
        return res.status(400).json({
          success: false,
          message: "Question already answered",
        });
      }

      // Evaluate the answer
      console.log("Evaluating answer...");
      const evaluation = await answerEvaluator.evaluateAnswer(
        question,
        answer,
        interview.config.domain,
        interview.config.difficulty,
      );

      // Save the complete evaluation
      round.answers.push({
        questionId,
        answer,
        timeTaken: validTimeTaken,
        hintsUsed: hintsUsed || 0,
        skipped: skipped || false,
        evaluation: {
          score: evaluation.overallScore,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths || [],
          improvements: evaluation.improvements || [],
          technicalAccuracy:
            evaluation.categoryScores?.accuracy || evaluation.overallScore,
          clarity:
            evaluation.categoryScores?.clarity || evaluation.overallScore,
          completeness:
            evaluation.categoryScores?.completeness || evaluation.overallScore,
          categoryScores: evaluation.categoryScores || {
            accuracy: evaluation.overallScore,
            clarity: evaluation.overallScore,
            completeness: evaluation.overallScore,
            depth: evaluation.overallScore,
          },
          isComplete: evaluation.isComplete !== false,
          missingPoints: evaluation.missingPoints || [],
          needsFollowUp: evaluation.needsFollowUp || false,
          weightedScore: evaluation.weightedScore || evaluation.overallScore,
          metadata: evaluation.metadata || {},
        },
        timestamp: new Date(),
      });

      // Calculate updated metrics - only from non-skipped answers
      const validAnswers = round.answers.filter(
        (a) => !a.skipped && a.evaluation,
      );
      const answeredCount = validAnswers.length;
      const skippedCount = round.answers.filter((a) => a.skipped).length;

      // Calculate category scores from actual evaluations
      const avgTechnical =
        validAnswers.length > 0
          ? Math.round(
              validAnswers.reduce(
                (sum, a) => sum + (a.evaluation?.score || 0),
                0,
              ) / validAnswers.length,
            )
          : 0;

      // Calculate other metrics based on evaluation data
      const avgClarity =
        validAnswers.length > 0
          ? Math.round(
              validAnswers.reduce(
                (sum, a) => sum + (a.evaluation?.clarity || 0),
                0,
              ) / validAnswers.length,
            )
          : 0;

      const avgCompleteness =
        validAnswers.length > 0
          ? Math.round(
              validAnswers.reduce(
                (sum, a) => sum + (a.evaluation?.completeness || 0),
                0,
              ) / validAnswers.length,
            )
          : 0;

      // Update performance metrics without overwriting
      interview.performance.overallScore = avgTechnical;
      interview.performance.categoryScores.technical = avgTechnical;
      interview.performance.categoryScores.communication = avgClarity;
      interview.performance.categoryScores.confidence = Math.round(
        (avgTechnical + avgClarity) / 2,
      );
      interview.performance.categoryScores.problemSolving = avgCompleteness;
      interview.performance.questionsAnswered = answeredCount;
      interview.performance.questionsSkipped = skippedCount;
      interview.performance.percentile = calculatePercentile(avgTechnical);

      // Calculate progress
      const totalQuestions = round.questions.length;
      const totalAnswered = round.answers.length; // Includes skipped
      const progress = {
        answered: answeredCount,
        skipped: skippedCount,
        total: totalQuestions,
        percentage: Math.round((totalAnswered / totalQuestions) * 100),
      };

      // Check if interview is complete
      const isComplete = totalAnswered >= totalQuestions;

      let nextQuestion = null;
      if (!isComplete) {
        // Find next unanswered question
        const answeredIds = round.answers.map((a) => a.questionId);
        const nextQ = round.questions.find(
          (q) => !answeredIds.includes(q.questionId),
        );

        if (nextQ) {
          nextQuestion = {
            questionId: nextQ.questionId,
            question: nextQ.question,
            type: nextQ.type,
            difficulty: nextQ.difficulty,
            hints: nextQ.hints,
            tags: nextQ.tags,
            metadata: nextQ.metadata,
          };
        }
      }

      await interview.save();

      res.json({
        success: true,
        message: "Answer submitted successfully",
        data: {
          evaluation: {
            score: evaluation.overallScore,
            feedback: evaluation.feedback,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
          },
          isComplete,
          nextQuestion,
          progress,
          currentScore: avgTechnical,
          metrics: {
            technical: avgTechnical,
            communication: avgClarity,
            confidence: Math.round((avgTechnical + avgClarity) / 2),
            problemSolving: avgCompleteness,
          },
        },
      });
    } catch (error) {
      console.error("Submit answer error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit answer",
        error: error.message,
      });
    }
  }

  // UPDATE skipQuestion method similarly
  async skipQuestion(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      if (!round) {
        return res.status(404).json({
          success: false,
          message: "Round not found",
        });
      }

      // Add skipped answer
      round.answers.push({
        questionId,
        answer: "",
        skipped: true,
        answeredAt: new Date(),
      });

      // Calculate progress
      const allAnswers = round.answers;
      const totalQuestions = round.questions.length;
      const progress = {
        answered: allAnswers.length,
        total: totalQuestions,
        percentage: Math.round((allAnswers.length / totalQuestions) * 100),
      };

      // Check if interview is complete
      const isComplete = allAnswers.length >= totalQuestions;

      let nextQuestion = null;
      if (!isComplete) {
        const answeredIds = round.answers.map((a) => a.questionId);
        nextQuestion = round.questions.find(
          (q) => !answeredIds.includes(q.questionId),
        );

        if (nextQuestion) {
          nextQuestion = {
            questionId: nextQuestion.questionId,
            question: nextQuestion.question,
            type: nextQuestion.type,
            difficulty: nextQuestion.difficulty,
            hints: nextQuestion.hints,
            tags: nextQuestion.tags,
            metadata: nextQuestion.metadata,
          };
        }
      }

      await interview.save();

      res.json({
        success: true,
        message: "Question skipped",
        data: {
          isComplete,
          nextQuestion,
          progress,
        },
      });
    } catch (error) {
      console.error("Skip question error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to skip question",
        error: error.message,
      });
    }
  }

  // Get Hint
  async getHint(req, res) {
    try {
      const { interviewId, questionId } = req.params;
      const { hintIndex } = req.query;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      const currentRound = interview.rounds[interview.rounds.length - 1];
      const question = currentRound.questions.find(
        (q) => q.questionId === questionId,
      );

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      const index = parseInt(hintIndex) || 0;
      if (index >= question.hints.length) {
        return res.status(400).json({
          success: false,
          message: "No more hints available",
        });
      }

      res.json({
        success: true,
        data: {
          hint: question.hints[index],
          hintsRemaining: question.hints.length - index - 1,
          pointsDeducted: 5,
        },
      });
    } catch (error) {
      console.error("Get hint error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get hint",
        error: error.message,
      });
    }
  }

  // Analyze emotion from video frame
  async analyzeEmotion(req, res) {
    try {
      const { interviewId } = req.params;
      const { frameData, timestamp } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      // Analyze emotion from frame
      const emotionData = await emotionAnalyzer.analyzeFrame(frameData);

      // Store emotion data
      if (!interview.metrics.emotionTimeline) {
        interview.metrics.emotionTimeline = [];
      }

      interview.metrics.emotionTimeline.push({
        timestamp,
        emotions: emotionData.emotions,
      });

      // Update confidence timeline
      if (!interview.metrics.confidence) {
        interview.metrics.confidence = [];
      }

      interview.metrics.confidence.push({
        timestamp,
        value: emotionData.confidence,
      });

      await interview.save();

      res.json({
        success: true,
        data: emotionData,
      });
    } catch (error) {
      console.error("Analyze emotion error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to analyze emotion",
        error: error.message,
      });
    }
  }

  // Complete Interview - FIX: Use function instead of this._calculatePercentile
  //   async completeInterview(req, res) {
  //   try {
  //     const { interviewId } = req.params;
  //     const userId = req.user.id;

  //     const interview = await Interview.findOne({ _id: interviewId, userId });

  //     if (!interview) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Interview not found'
  //       });
  //     }

  //     if (interview.status === 'completed') {
  //       return res.json({
  //         success: true,
  //         message: 'Interview already completed',
  //         data: {
  //           interviewId: interview._id,
  //           results: interview.results
  //         }
  //       });
  //     }

  //     // Update status
  //     interview.status = 'completed';
  //     interview.endTime = new Date();
  //     interview.totalDuration = Math.floor((interview.endTime - interview.startTime) / 1000);

  //     // Generate comprehensive results
  //     const resultsData = await resultsGenerator.generateResults(interview);
  //     interview.results = resultsData;

  //     await interview.save();

  //     res.json({
  //       success: true,
  //       message: 'Interview completed successfully',
  //       data: {
  //         interviewId: interview._id,
  //         results: interview.results
  //       }
  //     });

  //   } catch (error) {
  //     console.error('Complete interview error:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Failed to complete interview',
  //       error: error.message
  //     });
  //   }
  // }

  // In Interview.controller.js - UPDATE completeInterview

  async completeInterview(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({
        _id: interviewId,
        userId,
      }).populate({
        path: "userId",
        select: "name email", // select only needed fields
      });
      console.log("Interview certificate data section : ", interview);

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      if (interview.status === "completed") {
        return res.json({
          success: true,
          message: "Interview already completed",
          data: {
            interviewId: interview._id,
            results: interview.results,
          },
        });
      }

      // Update status and times
      interview.status = "completed";
      interview.endTime = new Date();
      interview.totalDuration = Math.floor(
        (interview.endTime - interview.startTime) / 1000,
      );

      // Generate comprehensive results
      try {
        const resultsData = await resultsGenerator.generateResults(interview);
        interview.results = resultsData;
      } catch (resultsError) {
        console.error("Results generation error:", resultsError);
        // Set default results if generation fails
        interview.results = {
          summary: {
            overallScore: interview.performance.overallScore || 0,
            grade: "F",
            percentile: 0,
            passed: false,
            totalQuestions: interview.performance.totalQuestions || 0,
            questionsAnswered: interview.performance.questionsAnswered || 0,
            questionsSkipped: interview.performance.questionsSkipped || 0,
            correctAnswers: 0,
            partialAnswers: 0,
            incorrectAnswers: 0,
            averageTimePerQuestion: 0,
            totalHintsUsed: interview.performance.hintsUsed || 0,
          },
          categoryBreakdown: {
            technical: {
              score: 0,
              questionsAnswered: 0,
              strengths: [],
              weaknesses: [],
            },
            communication: {
              score: 0,
              clarity: 0,
              articulation: 0,
              confidence: 0,
            },
            problemSolving: {
              score: 0,
              analyticalThinking: 0,
              creativity: 0,
              efficiency: 0,
            },
          },
          detailedFeedback: {
            overallAssessment:
              "Interview completed. Detailed analysis pending.",
            strengths: [],
            weaknesses: [],
            keyHighlights: [],
            areasOfConcern: [],
          },
          improvementPlan: {
            shortTerm: [],
            mediumTerm: [],
            longTerm: [],
            recommendedCourses: [],
            practiceResources: [],
          },
          comparisonData: {
            averageScore: 0,
            topPercentile: 0,
            yourRank: 0,
            totalCandidates: 0,
            betterThan: 0,
          },
          questionAnalysis: [],
          certificateData: {
            certificateId: `CERT-${interview._id}`,
            userName: interview.userId.name,
            userEmail: interview.userId.email,
            issuedAt: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            shareableLink: `${process.env.FRONTEND_URL}/certificate/${interview._id}`,
            verificationCode: Math.random()
              .toString(36)
              .substring(2, 10)
              .toUpperCase(),
          },
          timeline: [],
        };
      }

      await interview.save();

      res.json({
        success: true,
        message: "Interview completed successfully",
        data: {
          interviewId: interview._id,
          results: interview.results,
          user: {
            name: interview.userId.name,
            email: interview.userId.email,
          },
        },
      });
    } catch (error) {
      console.error("Complete interview error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to complete interview",
        error: error.message,
      });
    }
  }

  // Get Results
  // In Interview.controller.js - REPLACE getResults method

  async getResults(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      // If interview is not completed yet, return error
      if (interview.status !== "completed") {
        return res.status(400).json({
          success: false,
          message: "Interview not yet completed",
        });
      }

      // CRITICAL FIX: Check if results exist, if not generate them
      if (!interview.results || !interview.results.summary) {
        console.log("Results not found, generating...");

        // Generate results
        try {
          const resultsData = await resultsGenerator.generateResults(interview);
          interview.results = resultsData;
          await interview.save();
        } catch (resultsError) {
          console.error("Results generation error:", resultsError);
          // Return minimal data structure if generation fails
          return res.status(500).json({
            success: false,
            message: "Failed to generate results",
            error: resultsError.message,
          });
        }
      }

      // CRITICAL FIX: Return data in the format Results.jsx expects
      res.json({
        success: true,
        data: {
          // Main results object
          results: interview.results,

          // Additional metadata
          config: interview.config,
          duration: interview.totalDuration || 0,
          completedAt: interview.endTime || new Date(),

          // Optional: Include raw data for debugging
          performance: interview.performance,
          metrics: interview.metrics,
          rounds: interview.rounds,
        },
      });
    } catch (error) {
      console.error("Get results error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get results",
        error: error.message,
      });
    }
  }

  // Get Interview History
  async getInterviewHistory(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const query = { userId };
      if (status) {
        query.status = status;
      }

      const interviews = await Interview.find(query)
        .select("config status performance startTime endTime createdAt")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await Interview.countDocuments(query);

      res.json({
        success: true,
        data: {
          interviews,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          total: count,
        },
      });
    } catch (error) {
      console.error("Get interview history error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get interview history",
        error: error.message,
      });
    }
  }

  // controllers/interviewController.js - ADD this method

  async getDetailedResults(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found",
        });
      }

      if (interview.status !== "completed") {
        return res.status(400).json({
          success: false,
          message: "Interview not yet completed",
        });
      }

      res.json({
        success: true,
        data: {
          interviewId: interview._id,
          config: interview.config,
          results: interview.results,
          duration: interview.totalDuration,
          completedAt: interview.endTime,
        },
      });
    } catch (error) {
      console.error("Get detailed results error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get results",
        error: error.message,
      });
    }
  }
}

export default new InterviewController();
