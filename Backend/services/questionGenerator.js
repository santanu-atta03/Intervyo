// // services/questionGenerator.js
// import groqService from "./groqService.js";
// import aiConfig from "../config/ai.config.js";

// class QuestionGenerator {
//   async generateQuestions(config) {
//     const { domain, subDomain, interviewType, difficulty, targetCompany } =
//       config;
//     const questionCount = aiConfig.questionCounts[difficulty][interviewType];

//     const systemPrompt = this._buildSystemPrompt(
//       interviewType,
//       domain,
//       subDomain
//     );
//     const userPrompt = this._buildUserPrompt(
//       domain,
//       subDomain,
//       interviewType,
//       difficulty,
//       questionCount,
//       targetCompany
//     );

//     try {
//       const questions = await groqService.generateJSON([
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt },
//       ]);

//       return this._formatQuestions(questions, interviewType);
//     } catch (error) {
//       console.error("Question generation error:", error);
//       // Fallback to template questions if AI fails
//       return this._getFallbackQuestions(
//         interviewType,
//         difficulty,
//         questionCount
//       );
//     }
//   }

//   _buildSystemPrompt(interviewType, domain, subDomain) {
//     const prompts = {
//       behavioral: `You are an expert HR interviewer for ${domain} positions, specifically ${subDomain}.
// Generate STAR-method questions that assess problem-solving, teamwork, leadership, conflict resolution, and adaptability.
// Focus on getting specific examples from candidates' past experiences.`,

//       technical: `You are a senior ${domain} engineer interviewing for ${subDomain} positions.
// Generate questions testing core concepts, best practices, problem-solving, and real-world application.
// Questions should be clear, focused, and require demonstration of deep understanding.`,

//       coding: `You are a coding interview expert for ${domain} focusing on ${subDomain}.
// Generate algorithmic problems testing problem-solving, code quality, optimization, and clean code principles.
// Include problems of varying complexity with clear input/output examples.`,

//       "system-design": `You are a system design expert for ${domain} positions in ${subDomain}.
// Generate questions about scalability, architecture, database design, APIs, and trade-off analysis.
// Questions should encourage discussion of multiple approaches and their trade-offs.`,
//     };

//     return prompts[interviewType] || prompts.technical;
//   }

//   _buildUserPrompt(
//     domain,
//     subDomain,
//     interviewType,
//     difficulty,
//     count,
//     targetCompany
//   ) {
//     let prompt = `Generate exactly ${count} ${difficulty} difficulty ${interviewType} interview questions for a ${subDomain} ${domain} position.`;

//     if (targetCompany) {
//       prompt += `\n\nTailor questions to ${targetCompany}'s interview style and technical focus.`;
//     }

//     prompt += `\n\nIMPORTANT: Return ONLY valid JSON with NO markdown formatting, NO code blocks, NO backticks.

// Structure:
// {
//   "questions": [
//     {
//       "id": "q1",
//       "question": "The actual question text here",
//       "type": "${interviewType}",
//       "difficulty": "${difficulty}",
//       "expectedAnswer": "Brief outline of what a good answer should cover",
//       "hints": ["First hint to help candidate", "Second hint with more guidance", "Third hint revealing more details"],
//       "evaluationCriteria": ["criteria1", "criteria2", "criteria3"],
//       "tags": ["relevant", "tags", "here"]
//     }
//   ]
// }`;

//     if (interviewType === "coding") {
//       prompt += `\n\nFor coding questions, include:
// - Clear problem statement
// - Input/output examples
// - Constraints
// - Expected time/space complexity`;
//     }

//     if (interviewType === "system-design") {
//       prompt += `\n\nFor system design questions, include:
// - Scale requirements (users, requests/sec)
// - Key features to design
// - Non-functional requirements (latency, availability)`;
//     }

//     return prompt;
//   }

//   _formatQuestions(rawQuestions, interviewType) {
//     if (!rawQuestions || !rawQuestions.questions) {
//       throw new Error("Invalid questions format from AI");
//     }

//     return rawQuestions.questions.map((q, index) => ({
//       questionId: `q_${Date.now()}_${index}`,
//       question: q.question,
//       type: interviewType,
//       difficulty: q.difficulty,
//       expectedAnswer:
//         q.expectedAnswer || "Provide a detailed response with examples",
//       hints: q.hints || [
//         "Think about the problem systematically",
//         "Consider edge cases",
//         "Explain your reasoning",
//       ],
//       evaluationCriteria: q.evaluationCriteria || [
//         "Clarity",
//         "Completeness",
//         "Technical accuracy",
//       ],
//       tags: q.tags || [interviewType, q.difficulty],
//       metadata: {
//         timeLimit: this._getTimeLimit(interviewType),
//         maxHints: 3,
//         skippable: index > 0, // First question cannot be skipped
//       },
//     }));
//   }

//   _getTimeLimit(interviewType) {
//     const timeLimits = {
//       behavioral: 5, // 5 minutes
//       technical: 7, // 7 minutes
//       coding: 15, // 15 minutes
//       "system-design": 20, // 20 minutes
//     };
//     return (timeLimits[interviewType] || 5) * 60; // Convert to seconds
//   }

//   // Fallback questions if AI fails
//   _getFallbackQuestions(interviewType, difficulty, count) {
//     const templates = {
//       technical: [
//         {
//           question:
//             "Explain the concept of closures in JavaScript and provide a practical use case",
//           expectedAnswer:
//             "Explain lexical scoping, inner functions, and use cases like data privacy",
//           hints: [
//             "Think about functions returning functions",
//             "Consider variable accessibility",
//             "Data privacy is a key benefit",
//           ],
//         },
//         {
//           question:
//             "What is the difference between SQL and NoSQL databases? When would you choose one over the other?",
//           expectedAnswer:
//             "Compare structure, scalability, ACID vs BASE, use cases",
//           hints: [
//             "Consider data structure requirements",
//             "Think about scalability needs",
//             "ACID properties matter",
//           ],
//         },
//         {
//           question:
//             "Describe the SOLID principles in software design with examples",
//           expectedAnswer:
//             "Explain each principle with code examples and benefits",
//           hints: [
//             "Single Responsibility is first",
//             "Open/Closed principle for extensions",
//             "Liskov substitution for inheritance",
//           ],
//         },
//       ],
//       behavioral: [
//         {
//           question:
//             "Tell me about a time when you faced a significant technical challenge at work. How did you approach it?",
//           expectedAnswer: "Use STAR method: Situation, Task, Action, Result",
//           hints: [
//             "Describe the specific situation clearly",
//             "Explain your thought process",
//             "Quantify the results if possible",
//           ],
//         },
//         {
//           question:
//             "Describe a situation where you had to work with a difficult team member. How did you handle it?",
//           expectedAnswer:
//             "Show conflict resolution, empathy, and problem-solving skills",
//           hints: [
//             "Focus on understanding their perspective",
//             "Explain communication strategies used",
//             "Highlight positive outcomes",
//           ],
//         },
//         {
//           question:
//             "Give an example of when you had to learn a new technology or skill quickly for a project",
//           expectedAnswer:
//             "Demonstrate learning ability, resourcefulness, application",
//           hints: [
//             "Explain your learning approach",
//             "Mention resources you used",
//             "Show how you applied the knowledge",
//           ],
//         },
//       ],
//       coding: [
//         {
//           question:
//             "Write a function to reverse a linked list. Explain your approach and analyze time/space complexity.",
//           expectedAnswer:
//             "Iterative or recursive solution with O(n) time, O(1) or O(n) space",
//           hints: [
//             "Consider using pointers",
//             "Think about iterative vs recursive",
//             "Edge cases: empty list, single node",
//           ],
//         },
//         {
//           question:
//             "Implement a function to find the first non-repeating character in a string",
//           expectedAnswer:
//             "Use hash map for counting, single pass solution preferred",
//           hints: [
//             "Hash map can help track frequencies",
//             "Two passes might be needed",
//             "Consider string length constraints",
//           ],
//         },
//       ],
//       "system-design": [
//         {
//           question:
//             "Design a URL shortening service like bit.ly. Consider scalability for 100M users.",
//           expectedAnswer:
//             "Hash generation, database design, caching, load balancing",
//           hints: [
//             "Think about unique ID generation",
//             "Consider database sharding",
//             "Caching frequently accessed URLs",
//           ],
//         },
//       ],
//     };

//     const questions = (templates[interviewType] || templates.behavioral).slice(
//       0,
//       count
//     );

//     return questions.map((q, i) => ({
//       questionId: `fallback_${interviewType}_${i}`,
//       question: q.question,
//       type: interviewType,
//       difficulty,
//       expectedAnswer: q.expectedAnswer,
//       hints: q.hints,
//       evaluationCriteria: ["Clarity", "Relevance", "Detail", "Examples"],
//       tags: [interviewType, difficulty, "fallback"],
//       metadata: {
//         timeLimit: this._getTimeLimit(interviewType),
//         maxHints: 3,
//         skippable: i > 0,
//         isFallback: true,
//       },
//     }));
//   }

//   async generateFollowUp(question, answer, context) {
//     const prompt = `Based on this interview exchange, generate ONE relevant follow-up question.

// Original Question: ${question}
// Candidate's Answer: ${answer}
// Interview Type: ${context.interviewType}
// Domain: ${context.domain}

// Generate a follow-up that probes deeper or tests practical application.

// Return ONLY valid JSON with NO markdown:
// {
//   "followUp": "The follow-up question text",
//   "reason": "Why this follow-up is relevant"
// }`;

//     try {
//       const result = await groqService.generateJSON([
//         { role: "user", content: prompt },
//       ]);
//       return result;
//     } catch (error) {
//       console.error("Follow-up generation error:", error);
//       return {
//         followUp:
//           "Can you provide a specific example of how you've applied this concept in a real project?",
//         reason: "To assess practical experience",
//       };
//     }
//   }
// }

// export default new QuestionGenerator();

// services/questionGenerator.js
import groqService from "./groqService.js";
import aiConfig from "../config/ai.config.js";

class QuestionGenerator {
  async generateQuestions(config) {
    const { domain, subDomain, interviewType, difficulty, targetCompany } =
      config;

    // Validate interviewType - must be one of the valid types
    const validTypes = ["behavioral", "technical", "system-design", "coding"];
    if (!validTypes.includes(interviewType)) {
      console.error(
        `Invalid interview type: ${interviewType}. Using 'technical' as fallback.`,
      );
      config.interviewType = "technical";
    }

    const questionCount =
      aiConfig.questionCounts?.[difficulty]?.[interviewType] || 5;

    const systemPrompt = this._buildSystemPrompt(
      interviewType,
      domain,
      subDomain,
    );
    const userPrompt = this._buildUserPrompt(
      domain,
      subDomain,
      interviewType,
      difficulty,
      questionCount,
      targetCompany,
    );

    try {
      const questions = await groqService.generateJSON([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      return this._formatQuestions(questions, interviewType, difficulty);
    } catch (error) {
      console.error("Question generation error:", error);
      // Fallback to template questions if AI fails
      return this._getFallbackQuestions(
        interviewType,
        difficulty,
        questionCount,
      );
    }
  }

  _buildSystemPrompt(interviewType, domain, subDomain) {
    const prompts = {
      behavioral: `You are an expert HR interviewer for ${domain} positions, specifically ${subDomain}. 
Generate STAR-method questions that assess problem-solving, teamwork, leadership, conflict resolution, and adaptability.
Focus on getting specific examples from candidates' past experiences.`,

      technical: `You are a senior ${domain} engineer interviewing for ${subDomain} positions.
Generate questions testing core concepts, best practices, problem-solving, and real-world application.
Questions should be clear, focused, and require demonstration of deep understanding.`,

      coding: `You are a coding interview expert for ${domain} focusing on ${subDomain}.
Generate algorithmic problems testing problem-solving, code quality, optimization, and clean code principles.
Include problems of varying complexity with clear input/output examples.`,

      "system-design": `You are a system design expert for ${domain} positions in ${subDomain}.
Generate questions about scalability, architecture, database design, APIs, and trade-off analysis.
Questions should encourage discussion of multiple approaches and their trade-offs.`,
    };

    return prompts[interviewType] || prompts.technical;
  }

  _buildUserPrompt(
    domain,
    subDomain,
    interviewType,
    difficulty,
    count,
    targetCompany,
  ) {
    let prompt = `Generate exactly ${count} ${difficulty} difficulty ${interviewType} interview questions for a ${subDomain} ${domain} position.`;

    if (targetCompany && targetCompany !== "General") {
      prompt += `\n\nTailor questions to ${targetCompany}'s interview style and technical focus.`;
    }

    prompt += `\n\nIMPORTANT: Return ONLY valid JSON with NO markdown formatting, NO code blocks, NO backticks.

Structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "The actual question text here",
      "type": "${interviewType}",
      "difficulty": "${difficulty}",
      "expectedAnswer": "Brief outline of what a good answer should cover",
      "hints": ["First hint to help candidate", "Second hint with more guidance", "Third hint revealing more details"],
      "evaluationCriteria": ["criteria1", "criteria2", "criteria3"],
      "tags": ["relevant", "tags", "here"]
    }
  ]
}`;

    if (interviewType === "coding") {
      prompt += `\n\nFor coding questions, include:
- Clear problem statement
- Input/output examples
- Constraints
- Expected time/space complexity`;
      const questionsWithExamples = questions.map((q) => ({
        ...q,
        examples: [
          {
            input: "Example input based on question",
            output: "Expected output",
          },
        ],
        constraints: [
          "Time complexity: O(n)",
          "Space complexity: O(1)",
          "Input size: 1 <= n <= 1000",
        ],
      }));

      return questionsWithExamples;
    }

    if (interviewType === "system-design") {
      prompt += `\n\nFor system design questions, include:
- Scale requirements (users, requests/sec)
- Key features to design
- Non-functional requirements (latency, availability)`;
    }

    return prompt;
  }

  _formatQuestions(rawQuestions, interviewType, difficulty) {
    if (
      !rawQuestions ||
      !rawQuestions.questions ||
      !Array.isArray(rawQuestions.questions)
    ) {
      throw new Error("Invalid questions format from AI");
    }

    return rawQuestions.questions.map((q, index) => ({
      questionId: `q_${Date.now()}_${index}`,
      question: q.question || q.text || "Question not provided",
      type: interviewType, // Always use the passed interviewType to ensure it's valid
      difficulty: difficulty || q.difficulty || "medium",
      expectedAnswer:
        q.expectedAnswer || "Provide a detailed response with examples",
      hints:
        Array.isArray(q.hints) && q.hints.length > 0
          ? q.hints
          : [
              "Think about the problem systematically",
              "Consider edge cases and practical implications",
              "Explain your reasoning step by step",
            ],
      evaluationCriteria:
        Array.isArray(q.evaluationCriteria) && q.evaluationCriteria.length > 0
          ? q.evaluationCriteria
          : [
              "Clarity of explanation",
              "Completeness of answer",
              "Technical accuracy",
              "Practical examples",
            ],
      tags:
        Array.isArray(q.tags) && q.tags.length > 0
          ? q.tags
          : [interviewType, difficulty],
      metadata: {
        timeLimit: this._getTimeLimit(interviewType),
        maxHints: 3,
        skippable: index > 0, // First question cannot be skipped
      },
    }));
  }

  _getTimeLimit(interviewType) {
    const timeLimits = {
      behavioral: 5, // 5 minutes
      technical: 7, // 7 minutes
      coding: 15, // 15 minutes
      "system-design": 20, // 20 minutes
    };
    return (timeLimits[interviewType] || 5) * 60; // Convert to seconds
  }

  // Fallback questions if AI fails
  _getFallbackQuestions(interviewType, difficulty, count) {
    const templates = {
      technical: [
        {
          question:
            "Explain the concept of closures in JavaScript and provide a practical use case",
          expectedAnswer:
            "Explain lexical scoping, inner functions, and use cases like data privacy",
          hints: [
            "Think about functions returning functions",
            "Consider variable accessibility and scope chain",
            "Data privacy and encapsulation is a key benefit",
          ],
          evaluationCriteria: [
            "Understanding of scope",
            "Practical examples",
            "Clear explanation",
          ],
          tags: ["javascript", "fundamentals", "closures"],
        },
        {
          question:
            "What is the difference between SQL and NoSQL databases? When would you choose one over the other?",
          expectedAnswer:
            "Compare structure, scalability, ACID vs BASE, use cases",
          hints: [
            "Consider data structure requirements and schema flexibility",
            "Think about scalability needs and consistency models",
            "ACID properties vs eventual consistency",
          ],
          evaluationCriteria: [
            "Technical accuracy",
            "Use case understanding",
            "Trade-off analysis",
          ],
          tags: ["databases", "architecture", "design"],
        },
        {
          question:
            "Describe the SOLID principles in software design with examples",
          expectedAnswer:
            "Explain each principle with code examples and benefits",
          hints: [
            "Single Responsibility - one class, one purpose",
            "Open/Closed principle for extensions without modifications",
            "Liskov substitution for proper inheritance",
          ],
          evaluationCriteria: [
            "Knowledge of principles",
            "Practical examples",
            "Design thinking",
          ],
          tags: ["design-patterns", "best-practices", "oop"],
        },
        {
          question: "Explain how REST APIs work and what makes an API RESTful",
          expectedAnswer:
            "HTTP methods, stateless architecture, resource-based URLs, standard status codes",
          hints: [
            "Think about HTTP verbs and their purposes",
            "Consider stateless communication",
            "Resource representation and uniform interface",
          ],
          evaluationCriteria: [
            "REST principles",
            "HTTP knowledge",
            "API design",
          ],
          tags: ["api", "rest", "web-services"],
        },
        {
          question:
            "What is the difference between synchronous and asynchronous programming? Provide examples.",
          expectedAnswer:
            "Blocking vs non-blocking, callbacks, promises, async/await patterns",
          hints: [
            "Think about execution flow and blocking operations",
            "Consider callbacks and promises in JavaScript",
            "Async/await syntax and use cases",
          ],
          evaluationCriteria: [
            "Concept clarity",
            "Practical knowledge",
            "Examples",
          ],
          tags: ["async", "programming", "javascript"],
        },
      ],
      behavioral: [
        {
          question:
            "Tell me about a time when you faced a significant technical challenge at work. How did you approach it?",
          expectedAnswer: "Use STAR method: Situation, Task, Action, Result",
          hints: [
            "Describe the specific situation and context clearly",
            "Explain your thought process and approach",
            "Quantify the results and impact if possible",
          ],
          evaluationCriteria: [
            "STAR method",
            "Problem-solving",
            "Impact measurement",
          ],
          tags: ["problem-solving", "technical-challenges"],
        },
        {
          question:
            "Describe a situation where you had to work with a difficult team member. How did you handle it?",
          expectedAnswer:
            "Show conflict resolution, empathy, and problem-solving skills",
          hints: [
            "Focus on understanding their perspective first",
            "Explain communication strategies you used",
            "Highlight positive outcomes and learnings",
          ],
          evaluationCriteria: [
            "Conflict resolution",
            "Communication",
            "Teamwork",
          ],
          tags: ["teamwork", "conflict-resolution"],
        },
        {
          question:
            "Give an example of when you had to learn a new technology or skill quickly for a project",
          expectedAnswer:
            "Demonstrate learning ability, resourcefulness, application",
          hints: [
            "Explain your learning approach and strategy",
            "Mention specific resources you used",
            "Show how you applied the knowledge effectively",
          ],
          evaluationCriteria: [
            "Learning agility",
            "Resourcefulness",
            "Application",
          ],
          tags: ["learning", "adaptability"],
        },
        {
          question:
            "Tell me about a time when you disagreed with a technical decision. What did you do?",
          expectedAnswer:
            "Professional disagreement, data-driven approach, team collaboration",
          hints: [
            "Focus on the technical aspects, not personal conflict",
            "Explain your reasoning with evidence",
            "Show how you reached resolution",
          ],
          evaluationCriteria: [
            "Professional maturity",
            "Technical reasoning",
            "Collaboration",
          ],
          tags: ["decision-making", "collaboration"],
        },
      ],
      coding: [
        {
          question:
            "Write a function to reverse a linked list. Explain your approach and analyze time/space complexity.",
          expectedAnswer:
            "Iterative or recursive solution with O(n) time, O(1) or O(n) space",
          hints: [
            "Consider using three pointers for iterative approach",
            "Think about iterative vs recursive trade-offs",
            "Edge cases: empty list, single node, two nodes",
          ],
          evaluationCriteria: [
            "Correctness",
            "Complexity analysis",
            "Edge cases",
          ],
          tags: ["linked-list", "algorithms", "pointers"],
        },
        {
          question:
            "Implement a function to find the first non-repeating character in a string",
          expectedAnswer:
            "Use hash map for counting, single or two-pass solution",
          hints: [
            "Hash map can help track character frequencies",
            "Two passes might be needed - count then find",
            "Consider string length and character set constraints",
          ],
          evaluationCriteria: [
            "Algorithm choice",
            "Efficiency",
            "Implementation",
          ],
          tags: ["strings", "hash-map", "algorithms"],
        },
        {
          question:
            "Given an array of integers, find two numbers that add up to a target sum",
          expectedAnswer:
            "Two-pointer or hash map approach, O(n) time complexity",
          hints: [
            "Hash map can store complements for O(n) solution",
            "Two-pointer works if array is sorted",
            "Consider edge cases like duplicates",
          ],
          evaluationCriteria: [
            "Optimal solution",
            "Time complexity",
            "Code quality",
          ],
          tags: ["arrays", "two-pointer", "hash-map"],
        },
      ],
      "system-design": [
        {
          question:
            "Design a URL shortening service like bit.ly. Consider scalability for 100M users.",
          expectedAnswer:
            "Hash generation, database design, caching, load balancing, CDN",
          hints: [
            "Think about unique ID generation strategies",
            "Consider database sharding for horizontal scaling",
            "Caching frequently accessed URLs improves performance",
          ],
          evaluationCriteria: [
            "Scalability",
            "Database design",
            "Performance optimization",
          ],
          tags: ["system-design", "scalability", "databases"],
        },
        {
          question:
            "Design a real-time chat application that can handle millions of concurrent users",
          expectedAnswer:
            "WebSockets, message queues, database design, load balancing, microservices",
          hints: [
            "WebSockets for real-time bidirectional communication",
            "Message queues for reliability and decoupling",
            "Consider presence detection and typing indicators",
          ],
          evaluationCriteria: [
            "Real-time architecture",
            "Scalability",
            "Trade-offs",
          ],
          tags: ["real-time", "websockets", "distributed-systems"],
        },
        {
          question: "Design a distributed caching system like Redis",
          expectedAnswer:
            "Cache eviction policies, consistency, replication, sharding",
          hints: [
            "LRU/LFU eviction policies for memory management",
            "Consider consistency models and trade-offs",
            "Replication for high availability",
          ],
          evaluationCriteria: [
            "Caching strategies",
            "Distributed systems",
            "Trade-offs",
          ],
          tags: ["caching", "distributed-systems", "performance"],
        },
      ],
    };

    const questionTemplates = templates[interviewType] || templates.technical;
    const questions = questionTemplates.slice(0, count);

    return questions.map((q, i) => ({
      questionId: `fallback_${interviewType}_${i}_${Date.now()}`,
      question: q.question,
      type: interviewType,
      difficulty,
      expectedAnswer: q.expectedAnswer,
      hints: q.hints,
      evaluationCriteria: q.evaluationCriteria || [
        "Clarity",
        "Relevance",
        "Detail",
        "Examples",
      ],
      tags: [...q.tags, difficulty, "fallback"],
      metadata: {
        timeLimit: this._getTimeLimit(interviewType),
        maxHints: 3,
        skippable: i > 0,
        isFallback: true,
      },
    }));
  }

  async generateFollowUp(question, answer, context) {
    const prompt = `Based on this interview exchange, generate ONE relevant follow-up question.

Original Question: ${question}
Candidate's Answer: ${answer}
Interview Type: ${context.interviewType}
Domain: ${context.domain}

Generate a follow-up that probes deeper or tests practical application.

Return ONLY valid JSON with NO markdown:
{
  "followUp": "The follow-up question text",
  "reason": "Why this follow-up is relevant"
}`;

    try {
      const result = await groqService.generateJSON([
        { role: "user", content: prompt },
      ]);
      return {
        followUp:
          result.followUp ||
          result.question ||
          "Can you elaborate on that further?",
        reason: result.reason || "To gain deeper understanding",
      };
    } catch (error) {
      console.error("Follow-up generation error:", error);
      return {
        followUp:
          "Can you provide a specific example of how you've applied this concept in a real project?",
        reason: "To assess practical experience and application",
      };
    }
  }
}

export default new QuestionGenerator();
