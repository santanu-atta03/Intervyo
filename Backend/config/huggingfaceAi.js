import fetch from 'node-fetch';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

// Updated model - using a more reliable one
const MODEL_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// Helper to call Hugging Face inference API with retry logic
async function queryModel(prompt, maxTokens = 300, temperature = 0.7, retries = 3) {
  if (!HUGGINGFACE_API_TOKEN) {
    console.error('HUGGINGFACE_API_KEY not configured');
    throw new Error('Hugging Face API key not configured');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Querying Hugging Face model...`);
      
      const response = await fetch(MODEL_URL, {
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
            top_p: 0.9,
            do_sample: true,
          },
          options: {
            wait_for_model: true, // Wait if model is loading
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Hugging Face API error (attempt ${attempt}):`, response.status, errorText);
        
        // If model is loading, wait and retry
        if (response.status === 503 && attempt < retries) {
          console.log('Model is loading, waiting 10 seconds...');
          await new Promise(resolve => setTimeout(resolve, 10000));
          continue;
        }
        
        // If not found, try alternative approach
        if (response.status === 404) {
          throw new Error('Model not found. Please check your Hugging Face API configuration.');
        }
        
        throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Hugging Face response received');
      
      // Handle different response formats
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
      } else if (data.generated_text) {
        return data.generated_text;
      } else if (typeof data === 'string') {
        return data;
      }
      
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format from Hugging Face');
      
    } catch (error) {
      console.error(`Query attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
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
    const prompt = `${getInterviewSystemPrompt(role, difficulty, resumeText)}

Generate a list of ${difficulty === 'easy' ? 7 : difficulty === 'medium' ? 10 : 12} interview questions for a ${role} position. Include a mix of technical, coding, and behavioral questions. 

IMPORTANT: Respond ONLY with valid JSON array. No markdown, no explanation.
Format: [{"question": "...", "type": "technical|coding|behavioral", "expectedAnswer": "brief guideline"}]`;

    const output = await queryModel(prompt, 800, 0.7);

    // Try to extract JSON from output
    const jsonStart = output.indexOf('[');
    const jsonEnd = output.lastIndexOf(']') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonString = output.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    }
    
    // Fallback: Return default questions
    console.warn('Could not parse questions, using fallback');
    return getDefaultQuestions(role, difficulty);
    
  } catch (error) {
    console.error('Generate questions error:', error);
    return getDefaultQuestions(role, difficulty);
  }
};

// Evaluate answer with better error handling
export const evaluateAnswer = async (question, answer, context, codeSubmitted = null) => {
  try {
    const prompt = `You are an expert technical interviewer. Evaluate the candidate's answer objectively.

Question: ${question}

Candidate's Answer: ${answer}

${codeSubmitted ? `Code Submitted:\n${codeSubmitted}` : ''}

Context: ${context}

IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation.
Format: {"review": "2-3 sentence natural feedback", "score": 7, "strength": "one key strength", "improvement": "one area to improve"}`;

    const output = await queryModel(prompt, 400, 0.7);

    // Parse JSON from output
    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonString = output.substring(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);
      
      // Validate required fields
      if (parsed.review && typeof parsed.score === 'number') {
        return {
          review: parsed.review,
          score: Math.min(Math.max(parsed.score, 0), 10),
          strength: parsed.strength || 'Good understanding',
          improvement: parsed.improvement || 'Keep practicing'
        };
      }
    }
    
    // Fallback evaluation
    console.warn('Could not parse evaluation, using fallback');
    return getFallbackEvaluation(answer, codeSubmitted);
    
  } catch (error) {
    console.error('Evaluate answer error:', error);
    return getFallbackEvaluation(answer, codeSubmitted);
  }
};

// Generate next question
export const generateNextQuestion = async (conversationHistory, role, difficulty) => {
  try {
    const historyText = conversationHistory.slice(-3).map(entry => 
      `Q: ${entry.question}\nA: ${entry.answer}`
    ).join('\n\n');

    const prompt = `You are conducting a ${difficulty} level interview for a ${role} position.

Previous conversation:
${historyText}

Generate the next appropriate interview question. 

IMPORTANT: Respond ONLY with valid JSON. No markdown.
Format: {"question": "your question here", "type": "technical|coding|behavioral", "requiresCode": false}`;

    const output = await queryModel(prompt, 300, 0.8);

    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonString = output.substring(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);
      
      if (parsed.question) {
        return {
          question: parsed.question,
          type: parsed.type || 'technical',
          requiresCode: parsed.requiresCode || false
        };
      }
    }
    
    // Fallback question
    return getNextDefaultQuestion(conversationHistory.length, role, difficulty);
    
  } catch (error) {
    console.error('Generate next question error:', error);
    return getNextDefaultQuestion(conversationHistory.length, role, difficulty);
  }
};

// Generate overall feedback
export const generateOverallFeedback = async (session) => {
  try {
    const prompt = `You are an expert interviewer providing final feedback.

Interview session data:
- Total questions: ${session.conversation?.length || 0}
- Average scores: Technical: ${session.technicalScore || 0}, Communication: ${session.communicationScore || 0}

Provide comprehensive feedback.

IMPORTANT: Respond ONLY with valid JSON. No markdown.
Format: {"summary": "overall summary", "strengths": ["strength1", "strength2"], "improvements": ["improvement1"], "overallScore": 75, "communicationScore": 8, "problemSolvingScore": 7}`;

    const output = await queryModel(prompt, 500, 0.7);

    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonString = output.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    }
    
    return getDefaultFeedback(session);
    
  } catch (error) {
    console.error('Generate feedback error:', error);
    return getDefaultFeedback(session);
  }
};

// FALLBACK FUNCTIONS

function getDefaultQuestions(role, difficulty) {
  const questions = {
    easy: [
      { question: `Tell me about your experience with ${role} technologies.`, type: 'technical', expectedAnswer: 'Experience overview' },
      { question: 'What interests you about this role?', type: 'behavioral', expectedAnswer: 'Motivation' },
      { question: 'Describe a project you\'re proud of.', type: 'behavioral', expectedAnswer: 'Project details' },
      { question: 'How do you stay updated with technology trends?', type: 'technical', expectedAnswer: 'Learning approach' },
      { question: 'Write a function to reverse a string.', type: 'coding', expectedAnswer: 'Code solution' },
      { question: 'How do you handle tight deadlines?', type: 'behavioral', expectedAnswer: 'Time management' },
      { question: 'What are your career goals?', type: 'behavioral', expectedAnswer: 'Future plans' },
    ],
    medium: [
      { question: `Explain your understanding of ${role} best practices.`, type: 'technical', expectedAnswer: 'Best practices' },
      { question: 'Tell me about a challenging bug you fixed.', type: 'technical', expectedAnswer: 'Problem solving' },
      { question: 'How do you approach code reviews?', type: 'behavioral', expectedAnswer: 'Collaboration' },
      { question: 'Write a function to find duplicates in an array.', type: 'coding', expectedAnswer: 'Code solution' },
      { question: 'Describe your experience with version control.', type: 'technical', expectedAnswer: 'Git knowledge' },
      { question: 'How do you handle disagreements in a team?', type: 'behavioral', expectedAnswer: 'Conflict resolution' },
      { question: 'Explain a time you optimized code performance.', type: 'technical', expectedAnswer: 'Optimization skills' },
      { question: 'What testing strategies do you use?', type: 'technical', expectedAnswer: 'Testing approach' },
      { question: 'Implement a simple caching mechanism.', type: 'coding', expectedAnswer: 'Code solution' },
      { question: 'How do you prioritize tasks?', type: 'behavioral', expectedAnswer: 'Organization' },
    ],
    hard: [
      { question: `Design a scalable architecture for ${role} application.`, type: 'technical', expectedAnswer: 'System design' },
      { question: 'Explain your approach to microservices.', type: 'technical', expectedAnswer: 'Architecture knowledge' },
      { question: 'How do you ensure code quality at scale?', type: 'technical', expectedAnswer: 'Quality assurance' },
      { question: 'Implement a rate limiter.', type: 'coding', expectedAnswer: 'Algorithm' },
      { question: 'Describe a system you designed from scratch.', type: 'technical', expectedAnswer: 'Design experience' },
      { question: 'How do you handle technical debt?', type: 'behavioral', expectedAnswer: 'Strategy' },
      { question: 'Explain database optimization techniques you\'ve used.', type: 'technical', expectedAnswer: 'DB knowledge' },
      { question: 'Design a distributed caching system.', type: 'technical', expectedAnswer: 'System design' },
      { question: 'Write a thread-safe singleton pattern.', type: 'coding', expectedAnswer: 'Code solution' },
      { question: 'How do you mentor junior developers?', type: 'behavioral', expectedAnswer: 'Leadership' },
      { question: 'Describe your CI/CD experience.', type: 'technical', expectedAnswer: 'DevOps knowledge' },
      { question: 'How do you approach security in your code?', type: 'technical', expectedAnswer: 'Security practices' },
    ]
  };

  return questions[difficulty] || questions.easy;
}

function getFallbackEvaluation(answer, codeSubmitted) {
  const answerLength = answer?.length || 0;
  const hasCode = !!codeSubmitted;
  
  let score = 5;
  if (answerLength > 100) score += 2;
  if (answerLength > 200) score += 1;
  if (hasCode) score += 1;
  
  return {
    review: `Thank you for your answer. You provided ${answerLength > 150 ? 'a detailed' : 'an'} response${hasCode ? ' with code' : ''}. ${answerLength > 100 ? 'Your explanation shows good understanding.' : 'Consider providing more details in your responses.'}`,
    score: Math.min(score, 10),
    strength: hasCode ? 'Provided code implementation' : 'Clear communication',
    improvement: answerLength < 100 ? 'Provide more detailed explanations' : 'Continue with this level of detail'
  };
}

function getNextDefaultQuestion(questionIndex, role, difficulty) {
  const questions = getDefaultQuestions(role, difficulty);
  const index = questionIndex % questions.length;
  
  return {
    question: questions[index].question,
    type: questions[index].type,
    requiresCode: questions[index].type === 'coding'
  };
}

function getDefaultFeedback(session) {
  const avgScore = Math.round(
    ((session.technicalScore || 5) + 
     (session.communicationScore || 5) + 
     (session.problemSolvingScore || 5)) / 3
  );

  return {
    summary: `You completed the interview with an average score of ${avgScore}/10. Overall, you demonstrated ${avgScore >= 7 ? 'strong' : 'good'} capabilities.`,
    strengths: [
      'Completed all questions',
      'Maintained good communication',
      'Showed problem-solving ability'
    ],
    improvements: [
      'Practice more coding challenges',
      'Provide more detailed explanations',
      'Review technical fundamentals'
    ],
    overallScore: avgScore * 10,
    communicationScore: session.communicationScore || 7,
    problemSolvingScore: session.problemSolvingScore || 6
  };
}

export default {
  queryModel,
  getInterviewSystemPrompt,
  generateInterviewQuestions,
  evaluateAnswer,
  generateNextQuestion,
  generateOverallFeedback
};