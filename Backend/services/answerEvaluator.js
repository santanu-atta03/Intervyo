// services/answerEvaluator.js
import groqService from "./groqService.js";
import aiConfig from "../config/ai.config.js";

class AnswerEvaluator {
  async evaluateAnswer(question, answer, context) {
    const systemPrompt = this._buildEvaluationPrompt(question.type);
    const userPrompt = `Evaluate this interview answer thoroughly.

Question: ${question.question}
Expected Answer Outline: ${question.expectedAnswer}
Candidate's Answer: ${answer}
Difficulty Level: ${question.difficulty}
Evaluation Criteria: ${question.evaluationCriteria.join(", ")}

Provide a comprehensive evaluation with scores and feedback.

Return ONLY valid JSON with NO markdown:
{
  "overallScore": 85,
  "categoryScores": {
    "accuracy": 90,
    "clarity": 80,
    "completeness": 85,
    "depth": 80
  },
  "strengths": ["Specific strength point 1", "Specific strength point 2", "Specific strength point 3"],
  "improvements": ["Specific improvement point 1", "Specific improvement point 2"],
  "feedback": "Detailed paragraph of constructive feedback explaining scores",
  "isComplete": true,
  "missingPoints": ["Point not covered 1", "Point not covered 2"],
  "needsFollowUp": false
}`;

    try {
      const evaluation = await groqService.generateJSON([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      return this._enhanceEvaluation(evaluation, question, answer);
    } catch (error) {
      console.error("Evaluation error:", error);
      // Return basic evaluation if AI fails
      return this._getFallbackEvaluation(answer, question);
    }
  }

  _buildEvaluationPrompt(interviewType) {
    const prompts = {
      behavioral: `You are an expert HR interviewer evaluating behavioral interview answers.
Assess answers using the STAR method criteria:
- Situation: Is the context clearly described?
- Task: Is the responsibility/challenge well-defined?
- Action: Are specific actions taken explained?
- Result: Are outcomes measurable and clear?
Also evaluate communication clarity and relevance to the question.
Be constructive but honest in your feedback.`,

      technical: `You are a senior engineer evaluating technical interview answers.
Assess answers based on:
- Technical accuracy and correctness
- Depth of understanding (not just surface level)
- Clear explanation of concepts
- Practical examples or use cases
- Awareness of best practices
- Problem-solving approach
Provide specific, actionable feedback.`,

      coding: `You are a coding interview expert evaluating programming solutions.
Assess code and explanations based on:
- Correctness: Does it solve the problem?
- Time complexity: Is it optimal?
- Space complexity: Is it efficient?
- Code readability: Is it clean and well-structured?
- Edge case handling: Are corner cases considered?
- Best practices: Does it follow coding standards?
Provide technical feedback with specific improvements.`,

      "system-design": `You are a system architecture expert evaluating system design answers.
Assess designs based on:
- Scalability considerations and planning
- Component choices and justifications
- Trade-off analysis and understanding
- Feasibility of the proposed solution
- Completeness of the design
- Consideration of non-functional requirements
Focus on architectural thinking and problem-solving approach.`,
    };

    return prompts[interviewType] || prompts.technical;
  }

  _enhanceEvaluation(evaluation, question, answer) {
    // Ensure all required fields exist with defaults
    const enhanced = {
      overallScore: evaluation.overallScore || 0,
      categoryScores: evaluation.categoryScores || {
        accuracy: evaluation.overallScore || 0,
        clarity: evaluation.overallScore || 0,
        completeness: evaluation.overallScore || 0,
        depth: evaluation.overallScore || 0,
      },
      strengths: evaluation.strengths || [],
      improvements: evaluation.improvements || [],
      feedback: evaluation.feedback || "Evaluation completed.",
      isComplete: evaluation.isComplete !== false,
      missingPoints: evaluation.missingPoints || [],
      needsFollowUp: evaluation.needsFollowUp || false,
    };

    // Add metadata
    enhanced.metadata = {
      questionId: question.questionId,
      questionType: question.type,
      difficulty: question.difficulty,
      answerLength: answer.length,
      wordCount: answer.split(/\s+/).length,
      evaluatedAt: new Date(),
    };

    // Calculate weighted score based on difficulty
    const difficultyWeights = { easy: 0.8, medium: 1.0, hard: 1.2 };
    enhanced.weightedScore = Math.min(
      100,
      Math.round(
        enhanced.overallScore * difficultyWeights[question.difficulty],
      ),
    );

    return enhanced;
  }

  _getFallbackEvaluation(answer, question) {
    const wordCount = answer.split(/\s+/).length;
    const baseScore = Math.min(100, Math.max(30, wordCount * 2));

    // Create more realistic score distribution
    const score = Math.min(100, baseScore);
    const accuracy = Math.min(
      100,
      Math.max(30, score - Math.floor(Math.random() * 10)),
    );
    const clarity = Math.min(
      100,
      Math.max(30, score - Math.floor(Math.random() * 10)),
    );
    const completeness = Math.min(
      100,
      Math.max(30, score - Math.floor(Math.random() * 15)),
    );
    const depth = Math.min(
      100,
      Math.max(30, score - Math.floor(Math.random() * 12)),
    );

    return {
      overallScore: score,
      categoryScores: {
        accuracy,
        clarity,
        completeness,
        depth,
      },
      strengths:
        wordCount > 30
          ? [
              "Attempted the question with reasonable detail",
              "Provided structured response",
            ]
          : ["Provided a response"],
      improvements: [
        "Provide more specific details and examples",
        "Elaborate on key points",
        "Consider edge cases or alternatives",
      ],
      feedback:
        wordCount > 50
          ? "Your answer shows understanding. Consider elaborating with specific examples and more technical depth."
          : "Your answer is brief. Try to provide more detailed explanations with concrete examples.",
      isComplete: wordCount > 50,
      missingPoints:
        wordCount < 50
          ? ["More specific examples", "Deeper technical details"]
          : [],
      needsFollowUp: wordCount < 30,
      weightedScore: score,
      metadata: {
        evaluatedAt: new Date(),
        fallback: true,
        wordCount,
        questionType: question.type,
        questionId: question.questionId,
        difficulty: question.difficulty,
        answerLength: answer.length,
      },
    };
  }

  async evaluateInterview(interview) {
    const allAnswers = interview.rounds.flatMap((r) => r.answers);
    const validAnswers = allAnswers.filter((a) => !a.skipped && a.evaluation);

    // Calculate detailed statistics
    const totalQuestions = interview.performance.totalQuestions || 0;
    const questionsAnswered = interview.performance.questionsAnswered || 0;
    const questionsSkipped = interview.performance.questionsSkipped || 0;
    const hintsUsed = interview.performance.hintsUsed || 0;
    const overallScore = interview.performance.overallScore || 0;

    // Calculate average scores by category
    const avgAccuracy =
      validAnswers.length > 0
        ? validAnswers.reduce(
            (sum, a) => sum + (a.evaluation?.categoryScores?.accuracy || 0),
            0,
          ) / validAnswers.length
        : 0;

    const avgClarity =
      validAnswers.length > 0
        ? validAnswers.reduce(
            (sum, a) => sum + (a.evaluation?.categoryScores?.clarity || 0),
            0,
          ) / validAnswers.length
        : 0;

    const prompt = `Analyze this complete interview performance and provide comprehensive feedback.

Interview Details:
- Domain: ${interview.config.domain} - ${interview.config.subDomain}
- Interview Type: ${interview.config.interviewType}
- Difficulty: ${interview.config.difficulty}
- Target Company: ${interview.config.targetCompany || "General"}

Performance Metrics:
- Total Questions: ${totalQuestions}
- Questions Answered: ${questionsAnswered}
- Questions Skipped: ${questionsSkipped}
- Hints Used: ${hintsUsed}
- Overall Score: ${overallScore}%
- Average Accuracy: ${Math.round(avgAccuracy)}%
- Average Clarity: ${Math.round(avgClarity)}%

Category Scores:
${JSON.stringify(interview.performance.categoryScores, null, 2)}

Based on this comprehensive data, provide detailed analysis.

Return ONLY valid JSON with NO markdown:
{
  "strengths": ["Top strength 1", "Top strength 2", "Top strength 3", "Top strength 4", "Top strength 5"],
  "weaknesses": ["Area to improve 1", "Area to improve 2", "Area to improve 3"],
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3", "Specific recommendation 4", "Specific recommendation 5"],
  "studyPlan": [
    {
      "topic": "Topic name",
      "resources": ["FreeCodeCamp tutorial link", "YouTube video recommendation", "Documentation link"],
      "priority": "high",
      "estimatedHours": 10
    }
  ],
  "companyFit": [
    {
      "company": "Company name",
      "matchScore": 85,
      "reasons": ["Reason 1", "Reason 2", "Reason 3"]
    }
  ],
  "overallAssessment": "Detailed paragraph summarizing overall performance, key takeaways, and next steps"
}`;

    try {
      const analysis = await groqService.generateJSON([
        { role: "user", content: prompt },
      ]);

      // Ensure all required fields exist
      return {
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        recommendations: analysis.recommendations || [],
        studyPlan: analysis.studyPlan || [],
        companyFit: analysis.companyFit || [],
        overallAssessment: analysis.overallAssessment || "Analysis complete.",
      };
    } catch (error) {
      console.error("Interview evaluation error:", error);
      return this._getFallbackInterviewAnalysis(interview);
    }
  }

  _getFallbackInterviewAnalysis(interview) {
    const score = interview.performance.overallScore || 0;
    const questionsAnswered = interview.performance.questionsAnswered || 0;
    const questionsSkipped = interview.performance.questionsSkipped || 0;

    return {
      strengths: [
        "Completed the interview successfully",
        score > 70
          ? "Strong overall performance across categories"
          : "Showed effort and engagement throughout",
        "Demonstrated problem-solving approach",
        questionsSkipped === 0
          ? "Attempted all questions"
          : "Persistent in answering questions",
        score > 80
          ? "Excellent technical understanding"
          : "Good foundational knowledge",
      ],
      weaknesses: [
        score < 70
          ? "Technical depth needs improvement"
          : "Could provide more detailed explanations",
        questionsSkipped > 0
          ? "Time management could be optimized"
          : "Communication clarity needs enhancement",
        "Consider more practical examples in answers",
      ],
      recommendations: [
        "Practice STAR method for behavioral questions",
        `Review ${interview.config.subDomain} fundamentals and advanced topics`,
        "Work on more coding challenges daily",
        "Practice explaining technical concepts clearly and concisely",
        "Do regular mock interviews to build confidence",
      ],
      studyPlan: [
        {
          topic: `${interview.config.subDomain} Fundamentals`,
          resources: [
            "FreeCodeCamp comprehensive courses",
            "MDN Web Docs for reference",
            "Traversy Media YouTube channel",
          ],
          priority: "high",
          estimatedHours: 20,
        },
        {
          topic: "Interview Preparation",
          resources: [
            "LeetCode for daily coding practice",
            "Pramp for peer mock interviews",
            "InterviewBit for system design practice",
          ],
          priority: "high",
          estimatedHours: 15,
        },
        {
          topic: "Communication Skills",
          resources: [
            "Toastmasters for public speaking",
            "Technical blog writing",
            "Code review participation",
          ],
          priority: "medium",
          estimatedHours: 10,
        },
      ],
      companyFit: [
        {
          company: interview.config.targetCompany || "Tech Startups",
          matchScore: Math.max(50, Math.min(95, score + 5)),
          reasons: [
            "Technical skills align with core requirements",
            "Shows strong potential for growth and learning",
            "Problem-solving approach demonstrates analytical thinking",
          ],
        },
        {
          company: "Mid-size Tech Companies",
          matchScore: Math.max(45, Math.min(90, score)),
          reasons: [
            "Solid foundation in required technologies",
            "Good balance of technical and soft skills",
            "Ready for collaborative team environment",
          ],
        },
      ],
      overallAssessment: `You achieved an overall score of ${score}%. ${
        score >= 90
          ? "Outstanding performance! You demonstrated exceptional technical skills, clear communication, and strong problem-solving abilities. You're well-prepared for senior-level positions."
          : score >= 80
            ? "Excellent work! You showed strong technical competency and effective communication. With minor refinements, you'll excel in competitive interview processes."
            : score >= 70
              ? "Good performance! You have a solid foundation and clear understanding of core concepts. Focus on deepening your technical knowledge and providing more detailed examples in your responses."
              : score >= 60
                ? "Satisfactory effort! You've demonstrated basic competency. Focus on strengthening your fundamentals, practicing more problems, and improving your ability to articulate technical concepts clearly."
                : "Keep working hard! This interview highlighted areas that need improvement. Focus on building a stronger foundation, practicing regularly, and working through the personalized study plan provided. With dedicated effort, you'll see significant progress."
      } Continue practicing with mock interviews, work through the recommended study plan, and focus particularly on the areas highlighted in the weaknesses section. Your growth trajectory is promising with consistent practice.`,
    };
  }
}

export default new AnswerEvaluator();
