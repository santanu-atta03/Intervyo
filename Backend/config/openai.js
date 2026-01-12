import OpenAI from "openai";

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI API enabled');
} else {
  console.log('⚠️  OpenAI API disabled (missing API key)');
}

export default openai;

// System prompt
export const getInterviewSystemPrompt = (role, difficulty, resumeText) => {
  return `You are a professional technical interviewer conducting a ${difficulty} level interview for a ${role} position.

RESUME CONTEXT:
${resumeText || "No resume provided"}

YOUR ROLE:
- Conduct a natural, conversational interview like a real human interviewer
- Speak naturally without using numerical ratings (no "5/10", "7 out of 10", etc.)
- Give feedback using words like "excellent", "great", "good", "needs improvement"
- Ask relevant technical and behavioral questions based on the role and difficulty level
- Provide constructive, conversational feedback
- Ask follow-up questions based on candidate responses
- Maintain a professional yet friendly, encouraging tone
- For coding questions, ask the candidate to write code and review their submission naturally

FEEDBACK STYLE:
Instead of: "I'd rate that 7 out of 10"
Say: "Great answer! That shows solid understanding."

Instead of: "That's a 5/10"
Say: "Good start! Let me hear more about..."

INTERVIEW FLOW:
1. Start with a warm greeting and brief introduction
2. Ask about the candidate's background (if not covered in resume)
3. Ask ${difficulty === "easy" ? "5-7" : difficulty === "medium" ? "7-10" : "10-12"
    } technical questions
4. Include 2-3 behavioral questions
5. For at least 2 questions, ask the candidate to write code
6. Provide brief, natural feedback after each answer (1-2 sentences max)
7. End with closing remarks

EVALUATION CRITERIA:
- Technical accuracy and depth
- Problem-solving approach
- Communication clarity
- Code quality (if applicable)
- Cultural fit

Keep your responses concise, natural, and conversational. Talk like a friendly professional, not a scoring machine.`;
};

// Evaluate candidate answer
export const evaluateAnswer = async (
  question,
  answer,
  context,
  codeSubmitted = null
) => {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer. Evaluate the candidate's answer objectively and provide constructive feedback in a NATURAL, CONVERSATIONAL way.

CRITICAL RULES:
- DO NOT use numerical scores like "7/10", "5 out of 10", or any rating numbers in your review
- Speak like a real interviewer: use words like "excellent", "great", "good", "solid", "needs work"
- Be encouraging and constructive
- Keep feedback concise (2-3 sentences max)
- Sound natural and human

GOOD EXAMPLES:
"That's an excellent answer! You clearly understand the fundamentals and I like how you connected it to real-world applications."
"Good start! I can see you grasp the concept. Could you elaborate more on the implementation details next time?"
"Thanks for sharing that. I'd love to hear more specific examples from your experience."

BAD EXAMPLES (NEVER DO THIS):
"I'd rate that 7 out of 10"
"That's a 5/10 answer"
"Score: 8/10"`,
        },
        {
          role: "user",
          content: `Question: ${question}
          
Candidate's Answer: ${answer}

${codeSubmitted ? `Code Submitted:\n${codeSubmitted}` : ""}

Context: ${context}

Provide conversational feedback as JSON with these fields:
{
  "review": "Natural conversational feedback (1-2 sentences, NO NUMBERS, NO RATINGS)",
  "score": <internal score 0-10 for system use only, NOT shown to user>,
  "strength": "One specific thing they did well",
  "improvement": "One constructive suggestion (optional)"
}

Remember: The "review" field should sound like natural human speech with NO numerical ratings!`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    // Double-check: remove any numerical ratings that might have slipped through
    parsed.review = parsed.review
      .replace(/\d+(\.\d+)?\/10/g, "")
      .replace(/\d+(\.\d+)?\s*out\s*of\s*10/gi, "")
      .replace(/score:?\s*\d+/gi, "")
      .replace(/rating:?\s*\d+/gi, "");

    return parsed;
  } catch (error) {
    console.error("Error evaluating answer:", error);
    throw error;
  }
};

// Generate next question
export const generateNextQuestion = async (
  conversationHistory,
  role,
  difficulty
) => {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are conducting a ${difficulty} level interview for a ${role} position. Generate the next appropriate question based on the conversation flow.

Mix different types of questions:
- Technical questions about skills and knowledge
- Behavioral questions about past experiences
- Problem-solving scenarios
- Coding challenges (requiresCode: true) every 3-4 questions

Make questions natural and conversational.`,
        },
        {
          role: "user",
          content: `Previous questions and evaluations:\n${JSON.stringify(
            conversationHistory,
            null,
            2
          )}\n\nGenerate the next interview question as a JSON object with these keys:
{
  "question": "Your conversational question here",
  "type": "technical" or "coding" or "behavioral",
  "requiresCode": true or false
}

Return ONLY the JSON object, no extra text.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    const safeParseJSON = (text) => {
      try {
        return JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (err) {
            console.error("Failed to parse extracted JSON:", err);
            throw err;
          }
        }
        throw new Error("No valid JSON found");
      }
    };

    return safeParseJSON(content);
  } catch (error) {
    console.error("Error generating next question:", error);
    throw error;
  }
};

// Generate interview questions
export const generateInterviewQuestions = async (
  role,
  difficulty,
  resumeText
) => {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: getInterviewSystemPrompt(role, difficulty, resumeText),
        },
        {
          role: "user",
          content: `Generate a list of ${difficulty === "easy" ? 7 : difficulty === "medium" ? 10 : 12
            } interview questions for a ${role} position. Include a mix of technical, coding, and behavioral questions. 

Format as JSON array with structure: 
[
  {
    "question": "Your question here",
    "type": "technical" or "coding" or "behavioral",
    "expectedAnswer": "Brief guideline for what makes a good answer"
  }
]

Return ONLY the JSON array, no extra text.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    // Safe parse
    try {
      return JSON.parse(content);
    } catch {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error("No valid JSON array found");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

// Generate overall feedback
export const generateOverallFeedback = async (session) => {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert interviewer providing final feedback. Be constructive, specific, encouraging, and conversational. NO numerical ratings in the summary text.",
        },
        {
          role: "user",
          content: `
Interview session data:
${JSON.stringify(session, null, 2)}

Provide comprehensive feedback in this exact JSON format:

{
  "summary": "Conversational summary with no numbers or ratings.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "overallScore": ,  // 0-10
  "communicationScore": ,  // 0-10
  "problemSolvingScore": ,  // 0-10
}

Only return valid JSON. No extra commentary.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw error;
  }
};
