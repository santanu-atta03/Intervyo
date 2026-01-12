// controllers/RealTimeAiInterview.controller.js - CREATE NEW FILE

import Interview from "../models/Interview.model.js";
import groqService from "../services/groqService.js";
import questionGenerator from "../services/questionGenerator.js";

class RealTimeAiInterviewController {
  // Start conversation with greeting
  async startConversation(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res
          .status(404)
          .json({ success: false, message: "Interview not found" });
      }

      // Generate questions
      const questions = await questionGenerator.generateQuestions(
        interview.config,
      );

      // Generate AI greeting
      const greetingPrompt = `You are an expert interviewer conducting a ${interview.config.interviewType} interview for ${interview.config.domain} - ${interview.config.subDomain} position at ${interview.config.targetCompany}.

Start the interview naturally with:
1. Warm greeting
2. Brief introduction of yourself
3. Quick overview of interview format (conversational, ${interview.config.duration} minutes)
4. Tell them you'll ask questions one by one
5. Mention they can speak naturally and you'll guide them
6. Ask if they're ready to begin

DO NOT ask the first question yet. Just greet and prepare them.

Return ONLY valid JSON:
{
  "message": "Your complete greeting message (3-4 sentences)",
  "shouldSpeak": true
}`;

      const greeting = await groqService.generateJSON([
        { role: "user", content: greetingPrompt },
      ]);

      const updated = await Interview.findByIdAndUpdate(
        interviewId,
        {
          $set: {
            rounds: [
              {
                roundNumber: 1,
                roundType: interview.config.interviewType,
                questions,
                answers: [],
                conversationHistory: [
                  {
                    role: "assistant",
                    content: greeting.message,
                    timestamp: new Date(),
                  },
                ],
              },
            ],
            status: "in-progress",
            startTime: new Date(),
            "performance.totalQuestions": questions.length,
          },
        },
        { new: true }, // Return the updated document
      );

      return res.json({
        success: true,
        data: {
          interviewId: updated._id,
          aiMessage: greeting.message,
          shouldSpeak: true,
          interviewStarted: true,
          totalQuestions: questions.length,
          currentQuestionIndex: 0,
          showQuestion: false,
          config: updated.config,
        },
      });
    } catch (error) {
      console.error("Start conversation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to start interview",
        error: error.message,
      });
    }
  }

  // Ask next question
  async askNextQuestion(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res
          .status(404)
          .json({ success: false, message: "Interview not found" });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      const currentQuestionIndex = round.answers.length;
      const currentQuestion = round.questions[currentQuestionIndex];

      if (!currentQuestion) {
        return res.status(404).json({
          success: false,
          message: "No more questions",
          allQuestionsCompleted: true,
        });
      }

      // AI introduces the question naturally
      const introPrompt = `You are conducting a ${interview.config.interviewType} interview.

Next Question Details:
- Type: ${currentQuestion.type}
- Question: "${currentQuestion.question}"
- Difficulty: ${currentQuestion.difficulty}

Introduce this question naturally:
1. If it's a coding question, tell them you'll ask them to solve a coding problem
2. If it's behavioral, ask it conversationally
3. If it's system design, explain they'll need to design a system
4. Be encouraging and natural

For CODING questions specifically:
- Tell them you're sharing a coding problem
- Mention they can open the code editor when ready
- Ask the question naturally

Return ONLY valid JSON:
{
  "message": "Your natural question introduction (2-3 sentences)",
  "shouldSpeak": true,
  "questionType": "${currentQuestion.type}",
  "shouldShowQuestion": ${currentQuestion.type === "coding" ? "true" : "false"}
}`;

      if (!round.conversationHistory) {
        round.conversationHistory = [];
      }

      const aiIntro = await groqService.generateJSON([
        { role: "user", content: introPrompt },
      ]);

      round.conversationHistory.push({
        role: "assistant",
        content: aiIntro.message,
        timestamp: new Date(),
        metadata: {
          type: "question_intro",
          questionId: currentQuestion.questionId,
        },
      });

      await interview.save();

      res.json({
        success: true,
        data: {
          aiMessage: aiIntro.message,
          shouldSpeak: true,
          currentQuestionIndex: currentQuestionIndex,
          questionType: currentQuestion.type,
          question: aiIntro.shouldShowQuestion ? currentQuestion : null,
          showQuestion: aiIntro.shouldShowQuestion,
          totalQuestions: round.questions.length,
        },
      });
    } catch (error) {
      console.error("Ask question error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to ask question",
          error: error.message,
        });
    }
  }

  // Real-time response during conversation
  async getRealTimeResponse(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, answer, conversationHistory, questionType } =
        req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res
          .status(404)
          .json({ success: false, message: "Interview not found" });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      const currentQuestion = round.questions.find(
        (q) => q.questionId === questionId,
      );

      if (!currentQuestion) {
        return res
          .status(404)
          .json({ success: false, message: "Question not found" });
      }

      // Build conversation context
      const conversationContext = conversationHistory
        .slice(-6)
        .map(
          (msg) =>
            `${msg.role === "user" ? "Candidate" : "Interviewer"}: ${msg.content}`,
        )
        .join("\n");

      // AI evaluates and responds
      const aiPrompt = `You are an expert ${questionType} interviewer conducting a live interview.

Current Question: "${currentQuestion.question}"
Expected Answer Focus: ${currentQuestion.expectedAnswer}

Recent Conversation:
${conversationContext}

Candidate's Latest Response: "${answer}"

Your Task:
1. Analyze if the answer is complete and satisfactory
2. If incomplete/unclear, ask natural follow-up questions
3. If satisfactory, provide brief encouraging feedback
4. For coding questions, ask them to write code if they haven't

Respond with ONLY valid JSON:
{
  "response": "Your natural conversational response",
  "isComplete": true/false,
  "needsFollowUp": true/false,
  "evaluation": {
    "score": 0-100,
    "strengths": ["point1", "point2"],
    "improvements": ["point1", "point2"],
    "feedback": "Brief feedback"
  },
  "suggestCodeEditor": true/false,
  "suggestDiagram": true/false
}`;

      const aiResponse = await groqService.generateJSON([
        {
          role: "system",
          content: "You are a professional, encouraging interviewer.",
        },
        { role: "user", content: aiPrompt },
      ]);

      if (!round.conversationHistory) {
        round.conversationHistory = [];
      }

      round.conversationHistory.push(
        { role: "user", content: answer, timestamp: new Date() },
        {
          role: "assistant",
          content: aiResponse.response,
          timestamp: new Date(),
        },
      );

      await interview.save();

      res.json({
        success: true,
        data: {
          response: aiResponse.response,
          isComplete: aiResponse.isComplete,
          needsFollowUp: aiResponse.needsFollowUp,
          evaluation: aiResponse.evaluation,
          suggestCodeEditor: aiResponse.suggestCodeEditor,
          suggestDiagram: aiResponse.suggestDiagram,
        },
      });
    } catch (error) {
      console.error("Real-time response error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to get AI response",
          error: error.message,
        });
    }
  }

  // Evaluate code submission
  async evaluateCode(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, code, language } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res
          .status(404)
          .json({ success: false, message: "Interview not found" });
      }

      const round = interview.rounds[interview.rounds.length - 1];
      const currentQuestion = round.questions.find(
        (q) => q.questionId === questionId,
      );

      if (!currentQuestion) {
        return res
          .status(404)
          .json({ success: false, message: "Question not found" });
      }

      const codeReviewPrompt = `You are a senior software engineer reviewing code in a live interview.

Question: "${currentQuestion.question}"
Language: ${language}

Code Submitted:
\`\`\`${language}
${code}
\`\`\`

Provide a conversational, encouraging code review:
1. Start with something positive
2. Evaluate correctness, efficiency, edge cases
3. Suggest improvements naturally
4. Give a score

Return ONLY valid JSON:
{
  "response": "Your verbal code review (natural conversation style)",
  "score": 0-100,
  "correctness": 0-100,
  "efficiency": 0-100,
  "readability": 0-100,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "needsClarification": false,
  "followUpQuestions": []
}`;

      const review = await groqService.generateJSON([
        { role: "user", content: codeReviewPrompt },
      ]);

      if (!round.conversationHistory) {
        round.conversationHistory = [];
      }

      round.conversationHistory.push({
        role: "user",
        content: `[Code Submitted in ${language}]`,
        timestamp: new Date(),
        metadata: { type: "code", language, code },
      });

      round.conversationHistory.push({
        role: "assistant",
        content: review.response,
        timestamp: new Date(),
        metadata: { type: "code_review", evaluation: review },
      });

      await interview.save();

      res.json({
        success: true,
        data: review,
      });
    } catch (error) {
      console.error("Code evaluation error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to evaluate code",
          error: error.message,
        });
    }
  }

  // Submit answer and move to next
  async submitAnswer(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, answer, timeTaken, hintsUsed, skipped, evaluation } =
        req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res
          .status(404)
          .json({ success: false, message: "Interview not found" });
      }

      const round = interview.rounds[interview.rounds.length - 1];

      // Save answer
      round.answers.push({
        questionId,
        answer,
        timeTaken: timeTaken || 0,
        hintsUsed: hintsUsed || 0,
        skipped: skipped || false,
        evaluation: evaluation || {
          score: 0,
          feedback: "Answer submitted",
        },
        timestamp: new Date(),
      });

      // Update performance
      interview.performance.questionsAnswered = round.answers.length;

      await interview.save();

      res.json({
        success: true,
        message: "Answer submitted successfully",
        data: {
          questionsAnswered: round.answers.length,
          totalQuestions: round.questions.length,
          isComplete: round.answers.length >= round.questions.length,
        },
      });
    } catch (error) {
      console.error("Submit answer error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to submit answer",
          error: error.message,
        });
    }
  }
}

export default new RealTimeAiInterviewController();
