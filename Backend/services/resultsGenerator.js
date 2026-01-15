// services/resultsGenerator.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
class ResultsGenerator {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.modelName = "mistralai/Mistral-7B-Instruct-v0.1"; // You can change this
    this.apiURL = `https://api-inference.huggingface.co/models/${this.modelName}`;
  }

  calculateGrade(score) {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 75) return "C+";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  calculatePercentile(score) {
    if (score >= 90) return 95;
    if (score >= 80) return 85;
    if (score >= 70) return 70;
    if (score >= 60) return 55;
    if (score >= 50) return 40;
    return 25;
  }

  async generateDetailedFeedback(interview) {
    try {
      const round = interview.rounds[0];
      const answers = round.answers.filter((a) => !a.skipped);

      const analysisData = {
        domain: interview.config.domain,
        subDomain: interview.config.subDomain,
        difficulty: interview.config.difficulty,
        overallScore: interview.performance.overallScore,
        categoryScores: interview.performance.categoryScores,
        questionsAnswered: answers.length,
        totalQuestions: round.questions.length,
        answers: answers.map((a) => ({
          question: round.questions.find((q) => q.questionId === a.questionId)
            ?.question,
          answer: a.answer,
          score: a.evaluation?.score,
          feedback: a.evaluation?.feedback,
        })),
      };

      const prompt = `
You are an expert technical interviewer analyzing a candidate's interview performance. Generate a comprehensive, professional, and constructive analysis.

Interview Details:
- Domain: ${analysisData.domain} - ${analysisData.subDomain}
- Difficulty: ${analysisData.difficulty}
- Overall Score: ${analysisData.overallScore}/100
- Questions Answered: ${analysisData.questionsAnswered}/${analysisData.totalQuestions}

Category Scores:
- Technical: ${analysisData.categoryScores.technical}/100
- Communication: ${analysisData.categoryScores.communication}/100
- Problem Solving: ${analysisData.categoryScores.problemSolving}/100
- Confidence: ${analysisData.categoryScores.confidence}/100

Based on the answers and scores provided, generate a JSON response with:

{ 
  "overallAssessment": "...", 
  "strengths": [...], 
  "weaknesses": [...], 
  ...
}

Make it professional, constructive, and actionable. Focus on growth and improvement.
      `.trim();

      const response = await axios.post(
        this.apiURL,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 60000, // optional: to avoid timeout on long prompts
        },
      );

      const generated = response.data?.[0]?.generated_text || "";

      const jsonMatch = generated.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Failed to parse AI response");
    } catch (error) {
      console.error("Generate feedback error (HF):", error);
      return this.getFallbackFeedback(interview);
    }
  }

  getFallbackFeedback(interview) {
    const score = interview.performance.overallScore;
    return {
      overallAssessment: `You completed the ${
        interview.config.domain
      } interview with a score of ${score}/100. ${
        score >= 70 ? "Good job!" : "Keep practicing to improve your skills."
      }`,
      strengths: ["Completed the interview", "Showed determination"],
      weaknesses: ["Need more practice in core concepts"],
      keyHighlights: ["Participated in the interview"],
      areasOfConcern: ["Some answers need improvement"],
      technicalAnalysis: {
        coreConcepts: "Continue studying fundamental concepts",
        problemSolvingApproach: "Practice more coding problems",
        codeQuality: "Focus on writing clean code",
        bestPractices: "Learn industry best practices",
      },
      behavioralAnalysis: {
        communication: "Work on clarity of expression",
        confidence: "Build confidence through practice",
        professionalism: "Maintain professional demeanor",
        adaptability: "Stay flexible and open to learning",
      },
      shortTermGoals: [],
      mediumTermGoals: [],
      longTermGoals: [],
      recommendedCourses: [],
      practiceResources: [],
    };
  }
  // services/resultsGenerator.js - UPDATE generateResults method
  // Add this section to your existing generateResults method

  // async generateResults(interview) {
  //   try {
  //     const round = interview.rounds[0];
  //     const allAnswers = round.answers;
  //     const validAnswers = allAnswers.filter(a => !a.skipped);

  //     // ... existing code for summary, etc. ...

  //     // CRITICAL FIX: Generate performanceChart data in correct format
  //     const performanceChart = round.questions.map((question, index) => {
  //       const answer = allAnswers.find(a => a.questionId === question.questionId);

  //       return {
  //         questionNumber: index + 1,
  //         score: answer?.evaluation?.weightedScore || 0,
  //         timeTaken: answer?.timeTaken || 0,
  //         skipped: answer?.skipped || false,
  //         hintsUsed: answer?.hintsUsed || 0
  //       };
  //     });

  //     // Question analysis with proper data structure
  //     const questionAnalysis = round.questions.map((q, idx) => {
  //       const answer = allAnswers.find(a => a.questionId === q.questionId);
  //       return {
  //         questionId: q.questionId,
  //         questionNumber: idx + 1,
  //         question: q.question,
  //         yourAnswer: answer?.answer || 'Not answered',
  //         score: answer?.evaluation?.weightedScore || 0,
  //         maxScore: 100,
  //         timeTaken: answer?.timeTaken || 0,
  //         hintsUsed: answer?.hintsUsed || 0,
  //         feedback: answer?.evaluation?.feedback || '',
  //         strengths: answer?.evaluation?.strengths || [],
  //         improvements: answer?.evaluation?.improvements || [],
  //         modelAnswer: q.expectedAnswer || '',
  //         tags: q.tags || [],
  //         skipped: answer?.skipped || false
  //       };
  //     });

  //     console.log("Questions analysis : ",questionAnalysis)
  //     // ... rest of your existing code ...

  //     return {
  //       summary: {
  //         overallScore,
  //         grade,
  //         percentile,
  //         passed: overallScore >= 60,
  //         totalQuestions: round.questions.length,
  //         questionsAnswered: validAnswers.length,
  //         questionsSkipped: allAnswers.length - validAnswers.length,
  //         correctAnswers,
  //         partialAnswers,
  //         incorrectAnswers,
  //         averageTimePerQuestion: avgTimePerQuestion,
  //         totalHintsUsed: interview.performance.hintsUsed || 0
  //       },

  //       categoryBreakdown: {
  //         technical: {
  //           score: interview.performance.categoryScores.technical || 0,
  //           questionsAnswered: validAnswers.length,
  //           strengths: detailedFeedback.strengths.slice(0, 3),
  //           weaknesses: detailedFeedback.weaknesses.slice(0, 3)
  //         },
  //         communication: {
  //           score: interview.performance.categoryScores.communication || 0,
  //           clarity: interview.performance.categoryScores.communication || 0,
  //           articulation: interview.performance.categoryScores.communication || 0,
  //           confidence: interview.performance.categoryScores.confidence || 0
  //         },
  //         problemSolving: {
  //           score: interview.performance.categoryScores.problemSolving || 0,
  //           analyticalThinking: interview.performance.categoryScores.problemSolving || 0,
  //           creativity: Math.min(100, (interview.performance.categoryScores.problemSolving || 0) + 5),
  //           efficiency: Math.min(100, (interview.performance.categoryScores.problemSolving || 0) - 5)
  //         }
  //       },

  //       detailedFeedback: {
  //         overallAssessment: detailedFeedback.overallAssessment,
  //         strengths: detailedFeedback.strengths,
  //         weaknesses: detailedFeedback.weaknesses,
  //         keyHighlights: detailedFeedback.keyHighlights,
  //         areasOfConcern: detailedFeedback.areasOfConcern,
  //         technicalAnalysis: detailedFeedback.technicalAnalysis,
  //         behavioralAnalysis: detailedFeedback.behavioralAnalysis
  //       },

  //       improvementPlan: {
  //         shortTerm: detailedFeedback.shortTermGoals || [],
  //         mediumTerm: detailedFeedback.mediumTermGoals || [],
  //         longTerm: detailedFeedback.longTermGoals || [],
  //         recommendedCourses: detailedFeedback.recommendedCourses || [],
  //         practiceResources: detailedFeedback.practiceResources || []
  //       },

  //       comparisonData,
  //       questionAnalysis,
  //       certificateData,

  //       // CRITICAL: Add performanceChart array
  //       performanceChart,

  //       timeline: allAnswers.map((a, idx) => ({
  //         timestamp: new Date(interview.startTime.getTime() + (a.timeTaken || 0) * 1000),
  //         event: `Question ${idx + 1} ${a.skipped ? 'Skipped' : 'Answered'}`,
  //         description: round.questions[idx]?.question.substring(0, 50) + '...',
  //         score: a.evaluation?.score || 0
  //       }))
  //     };

  //   } catch (error) {
  //     console.error('Generate results error:', error);
  //     throw error;
  //   }
  // }

  async generateResults(interview) {
    try {
      console.log("Starting results generation...");
      // Validate interview data
      if (!interview || !interview.rounds || interview.rounds.length === 0) {
        throw new Error("Invalid interview data - no rounds found");
      }

      const round = interview.rounds[0];

      if (!round.answers || round.answers.length === 0) {
        console.warn("No answers found in interview");
      }

      const allAnswers = round.answers || [];
      const validAnswers = allAnswers.filter((a) => !a.skipped);

      // Calculate summary metrics
      const overallScore = interview.performance?.overallScore || 0;
      const grade = this.calculateGrade(overallScore);
      const percentile = this.calculatePercentile(overallScore);

      const correctAnswers = validAnswers.filter(
        (a) => (a.evaluation?.score || 0) >= 80,
      ).length;
      const partialAnswers = validAnswers.filter((a) => {
        const score = a.evaluation?.score || 0;
        return score >= 50 && score < 80;
      }).length;
      const incorrectAnswers = validAnswers.filter(
        (a) => (a.evaluation?.score || 0) < 50,
      ).length;

      const totalTime = validAnswers.reduce(
        (sum, a) => sum + (a.timeTaken || 0),
        0,
      );
      const avgTimePerQuestion =
        validAnswers.length > 0
          ? Math.round(totalTime / validAnswers.length)
          : 0;

      console.log("Generating AI feedback...");
      // Generate detailed feedback using AI (or fallback)
      const detailedFeedback = await this.generateDetailedFeedback(interview);
      console.log("Feedback generated successfully");

      // Question-by-question analysis
      const questionAnalysis = (round.questions || []).map((q, index) => {
        const answer = allAnswers.find((a) => a.questionId === q.questionId);
        return {
          questionId: q.questionId,
          question: q.question || "Question not available",
          yourAnswer: answer?.answer || "Not answered",
          score: answer?.evaluation?.score || 0,
          maxScore: 100,
          timeTaken: answer?.timeTaken || 0,
          hintsUsed: answer?.hintsUsed || 0,
          feedback: answer?.evaluation?.feedback || "No feedback available",
          strengths: answer?.evaluation?.strengths || [],
          improvements: answer?.evaluation?.improvements || [],
          modelAnswer: q.expectedAnswer || "Model answer not available",
          tags: q.tags || [],
          difficulty: q.difficulty || interview.config?.difficulty || "medium",
        };
      });

      // Performance chart data
      const performanceChart = questionAnalysis.map((qa, index) => ({
        questionNumber: index + 1,
        score: qa.score,
        timeTaken: qa.timeTaken,
        avgScore: overallScore,
      }));

      // Comparison data
      const comparisonData = {
        averageScore: 65,
        topPercentile: 95,
        yourRank: Math.max(1, Math.floor((100 - percentile) * 10)),
        totalCandidates: 1000,
        betterThan: percentile,
      };

      // Timeline
      let cumulativeTime = 0;
      const timeline = allAnswers.map((a, index) => {
        cumulativeTime += a.timeTaken || 0;
        const question = round.questions?.[index];
        return {
          timestamp: new Date(
            (interview.startTime?.getTime() || Date.now()) +
              cumulativeTime * 1000,
          ),
          event: a.skipped ? "Skipped" : "Answered",
          description:
            question?.question?.substring(0, 60) + "..." || "Question",
          score: a.evaluation?.score || 0,
          questionNumber: index + 1,
        };
      });

      // Certificate data
      const certificateData = {
        certificateId: `CERT-${interview._id
          .toString()
          .substring(0, 8)
          .toUpperCase()}-${Date.now()}`,
        issuedAt: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        shareableLink: `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/certificate/${interview._id}`,
        verificationCode: Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase(),
      };

      console.log("Compiling final results...");

      // Compile complete results
      const results = {
        summary: {
          overallScore,
          grade,
          percentile,
          passed: overallScore >= 60,
          totalQuestions: round.questions?.length || 0,
          questionsAnswered: validAnswers.length,
          questionsSkipped: allAnswers.length - validAnswers.length,
          correctAnswers,
          partialAnswers,
          incorrectAnswers,
          averageTimePerQuestion: avgTimePerQuestion,
          totalHintsUsed: interview.performance?.hintsUsed || 0,
          timeTaken: totalTime,
        },

        categoryBreakdown: {
          technical: {
            score: interview.performance?.categoryScores?.technical || 0,
            questionsAnswered: validAnswers.length,
            strengths: detailedFeedback.strengths?.slice(0, 3) || [],
            weaknesses: detailedFeedback.weaknesses?.slice(0, 3) || [],
          },
          communication: {
            score: interview.performance?.categoryScores?.communication || 0,
            clarity: interview.performance?.categoryScores?.communication || 0,
            articulation: Math.max(
              0,
              (interview.performance?.categoryScores?.communication || 0) - 5,
            ),
            confidence: interview.performance?.categoryScores?.confidence || 0,
          },
          problemSolving: {
            score: interview.performance?.categoryScores?.problemSolving || 0,
            analyticalThinking:
              interview.performance?.categoryScores?.problemSolving || 0,
            creativity: Math.min(
              100,
              (interview.performance?.categoryScores?.problemSolving || 0) + 5,
            ),
            efficiency: Math.max(
              0,
              (interview.performance?.categoryScores?.problemSolving || 0) - 3,
            ),
          },
        },

        detailedFeedback: {
          overallAssessment: detailedFeedback.overallAssessment || "",
          strengths: detailedFeedback.strengths || [],
          weaknesses: detailedFeedback.weaknesses || [],
          keyHighlights: detailedFeedback.keyHighlights || [],
          areasOfConcern: detailedFeedback.areasOfConcern || [],
          technicalAnalysis: detailedFeedback.technicalAnalysis || {},
          behavioralAnalysis: detailedFeedback.behavioralAnalysis || {},
        },

        improvementPlan: {
          shortTerm: detailedFeedback.shortTermGoals || [],
          mediumTerm: detailedFeedback.mediumTermGoals || [],
          longTerm: detailedFeedback.longTermGoals || [],
          recommendedCourses: detailedFeedback.recommendedCourses || [],
          practiceResources: detailedFeedback.practiceResources || [],
        },

        comparisonData,
        questionAnalysis,
        certificateData,
        timeline,
        performanceChart,
      };

      console.log("✅ Results generated successfully");
      return results;
    } catch (error) {
      console.error("❌ Generate results error:", error);
      throw error;
    }
  }
}

export default new ResultsGenerator();
