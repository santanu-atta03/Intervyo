import OpenAI from 'openai';

// ✅ Use GROQ API key and endpoint
export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Set this in your .env or environment
  baseURL: 'https://api.groq.com/openai/v1',
});

// System prompt
export const getInterviewSystemPrompt = (role, difficulty, resumeText) => {
  return `You are a professional technical interviewer conducting a ${difficulty} level interview for a ${role} position.

RESUME CONTEXT:
${resumeText || 'No resume provided'}

YOUR ROLE:
- Conduct a natural, conversational interview
- Ask relevant technical and behavioral questions based on the role and difficulty level
- Evaluate answers objectively and provide constructive feedback
- Ask follow-up questions based on candidate responses
- Maintain a professional yet friendly tone
- For coding questions, ask the candidate to write code and review their submission

INTERVIEW FLOW:
1. Start with a warm greeting and brief introduction
2. Ask about the candidate's background (if not covered in resume)
3. Ask ${difficulty === 'easy' ? '5-7' : difficulty === 'medium' ? '7-10' : '10-12'} technical questions
4. Include 2-3 behavioral questions
5. For at least 2 questions, ask the candidate to write code
6. Provide brief feedback after each answer
7. End with closing remarks

EVALUATION CRITERIA:
- Technical accuracy and depth
- Problem-solving approach
- Communication clarity
- Code quality (if applicable)
- Cultural fit

Keep your responses concise and natural, as if speaking in a real interview.`;
};

// Generate interview questions
export const generateInterviewQuestions = async (role, difficulty, resumeText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ Groq-supported model
      messages: [
        {
          role: "system",
          content: getInterviewSystemPrompt(role, difficulty, resumeText)
        },
        {
          role: "user",
          content: `Generate a list of ${difficulty === 'easy' ? 7 : difficulty === 'medium' ? 10 : 12} interview questions for a ${role} position. Include a mix of technical, coding, and behavioral questions. Format as JSON array with structure: [{"question": "...", "type": "technical|coding|behavioral", "expectedAnswer": "brief guideline"}]`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};

// Evaluate candidate answer
export const evaluateAnswer = async (question, answer, context, codeSubmitted = null) => {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Evaluate the candidate's answer objectively and provide constructive feedback. Keep feedback concise (2-3 sentences) and natural."
        },
        {
          role: "user",
          content: `Question: ${question}
          
Candidate's Answer: ${answer}

${codeSubmitted ? `Code Submitted:\n${codeSubmitted}` : ''}

Context: ${context}

Provide:
1. A brief review (2-3 sentences, speak naturally as an interviewer)
2. A score out of 10
3. One key strength
4. One area for improvement (if any)

Format as JSON: {"review": "...", "score": 0-10, "strength": "...", "improvement": "..."}` }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
};

// Generate next question
export const generateNextQuestion = async (conversationHistory, role, difficulty) => {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are conducting a ${difficulty} level interview for a ${role} position. Generate the next appropriate question based on the conversation flow.`
        },
        {
          role: "user",
          content: `Conversation so far:\n${JSON.stringify(conversationHistory, null, 2)}\n\nGenerate the next interview question as a JSON object ONLY with the keys: "question" (string), "type" ("technical", "coding", or "behavioral"), and "requiresCode" (true or false). No extra text, no explanation.`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    // Safe parse function
    const safeParseJSON = (text) => {
      try {
        return JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (err) {
            console.error('Failed to parse extracted JSON:', err);
            throw err;
          }
        }
        throw new Error('No valid JSON found');
      }
    };

    return safeParseJSON(content);

  } catch (error) {
    console.error('Error generating next question:', error);
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
          content: "You are an expert interviewer providing final feedback. Be constructive, specific, and encouraging."
        },
        {
          role: "user",
          content: `Interview session data:\n${JSON.stringify(session, null, 2)}\n\nProvide comprehensive feedback including:\n1. Overall summary\n2. Top 3 strengths\n3. Top 3 areas for improvement\n4. Overall score (0-100)\n\nFormat as JSON: {"summary": "...", "strengths": [], "improvements": [], "overallScore": 0-100, "communicationScore": 0-10, "problemSolvingScore": 0-10}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw error;
  }
};
