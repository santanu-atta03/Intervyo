import fetch from 'node-fetch';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

// Helper to call Hugging Face inference API for text generation
async function queryModel(prompt, maxTokens = 300, temperature = 0.7) {
  const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3'
, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: temperature,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const data = await response.json();
  return data[0]?.generated_text ?? '';
}

// System prompt generator
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
  const prompt = `${getInterviewSystemPrompt(role, difficulty, resumeText)}

Generate a list of ${difficulty === 'easy' ? 7 : difficulty === 'medium' ? 10 : 12} interview questions for a ${role} position. Include a mix of technical, coding, and behavioral questions. Format as JSON array with structure: [{"question": "...", "type": "technical|coding|behavioral", "expectedAnswer": "brief guideline"}]`;

  const output = await queryModel(prompt);

  // Try to extract JSON from output
  const jsonStart = output.indexOf('[');
  const jsonEnd = output.lastIndexOf(']') + 1;
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = output.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  }
  throw new Error('Failed to parse interview questions JSON');
};

// Evaluate answer
export const evaluateAnswer = async (question, answer, context, codeSubmitted = null) => {
  const prompt = `You are an expert technical interviewer. Evaluate the candidate's answer objectively and provide constructive feedback. Keep feedback concise (2-3 sentences) and natural.

Question: ${question}

Candidate's Answer: ${answer}

${codeSubmitted ? `Code Submitted:\n${codeSubmitted}` : ''}

Context: ${context}

Provide:
1. A brief review (2-3 sentences, speak naturally as an interviewer)
2. A score out of 10
3. One key strength
4. One area for improvement (if any)

Format as JSON: {"review": "...", "score": 0-10, "strength": "...", "improvement": "..."}`;

  const output = await queryModel(prompt);

  // Parse JSON from output
  const jsonStart = output.indexOf('{');
  const jsonEnd = output.lastIndexOf('}') + 1;
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = output.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  }
  throw new Error('Failed to parse evaluation JSON');
};

// Generate next question based on conversation history
export const generateNextQuestion = async (conversationHistory, role, difficulty) => {
  const prompt = `You are conducting a ${difficulty} level interview for a ${role} position. Generate the next appropriate question based on the conversation flow.

Conversation so far:
${JSON.stringify(conversationHistory, null, 2)}

Generate the next interview question. If appropriate, this could be a coding question. Respond naturally as an interviewer would.

Format as JSON: {"question": "...", "type": "technical|coding|behavioral", "requiresCode": true|false}`;

  const output = await queryModel(prompt);

  const jsonStart = output.indexOf('{');
  const jsonEnd = output.lastIndexOf('}') + 1;
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = output.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  }
  throw new Error('Failed to parse next question JSON');
};

// Generate overall feedback
export const generateOverallFeedback = async (session) => {
  const prompt = `You are an expert interviewer providing final feedback. Be constructive, specific, and encouraging.

Interview session data:
${JSON.stringify(session, null, 2)}

Provide comprehensive feedback including:
1. Overall summary
2. Top 3 strengths
3. Top 3 areas for improvement
4. Overall score (0-100)

Format as JSON: {"summary": "...", "strengths": [], "improvements": [], "overallScore": 0-100, "communicationScore": 0-10, "problemSolvingScore": 0-10}`;

  const output = await queryModel(prompt);

  const jsonStart = output.indexOf('{');
  const jsonEnd = output.lastIndexOf('}') + 1;
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = output.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  }
  throw new Error('Failed to parse feedback JSON');
};
