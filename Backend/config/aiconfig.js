// backend/config/ai.config.js - FREE AI SERVICES VERSION
import fetch from 'node-fetch';

// FREE AI Configuration using Hugging Face
export const AI_CONFIG = {
  // Hugging Face - Completely FREE
  huggingface: {
    apiUrl: 'https://api-inference.huggingface.co/models/',
    // Choose a free model (no credit card required)
    models: {
      // Option 1: Fast and conversational (Recommended)
      primary: 'microsoft/DialoGPT-large',
      // Option 2: Better quality, slower
      alternative: 'facebook/blenderbot-400M-distill',
      // Option 3: Most capable
      advanced: 'mistralai/Mistral-7B-Instruct-v0.2'
    },
    maxTokens: 250,
    temperature: 0.7,
  },

  // Groq - FREE and FAST (100 requests/min free tier)
  groq: {
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    model: "llama-3.1-70b-versatile", // Free model
    maxTokens: 1024,
    temperature: 0.7,
  },

  // Together AI - FREE tier available
  together: {
    apiUrl: 'https://api.together.xyz/v1/chat/completions',
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    maxTokens: 512,
    temperature: 0.7,
  },

  // System prompts for different contexts
  systemPrompts: {
    general: `You are a helpful AI assistant for an interview preparation platform. Help users with interview preparation, technical questions, career advice, and platform features. Be concise, friendly, and professional. Keep responses under 200 words.`,
    
    'interview-prep': `You are an interview coach. Provide practical interview tips, common questions, and best practices. Give actionable advice to help users succeed in interviews. Be encouraging and specific.`,
    
    'technical-help': `You are a programming mentor. Help with coding questions, algorithms, data structures, and technical concepts. Explain clearly with examples when needed. Keep it practical.`,
    
    'career-advice': `You are a career counselor. Provide guidance on career paths, skill development, job search strategies, and professional growth. Be supportive and realistic.`
  }
};

// Rate limiting configuration
export const RATE_LIMITS = {
  maxMessagesPerHour: 50,
  maxMessagesPerDay: 200,
  maxConversationsPerDay: 20
};

// Hugging Face API call
export async function callHuggingFace(messages, context, apiKey) {
  const systemPrompt = AI_CONFIG.systemPrompts[context] || AI_CONFIG.systemPrompts.general;
  
  // Get the last user message
  const lastMessage = messages[messages.length - 1];
  const conversationHistory = messages.slice(-5); // Last 5 messages for context
  
  // Build context-aware prompt
  let prompt = systemPrompt + '\n\n';
  conversationHistory.forEach(msg => {
    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
  });
  
  const model = AI_CONFIG.huggingface.models.advanced;
  const response = await fetch(AI_CONFIG.huggingface.apiUrl + model, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: AI_CONFIG.huggingface.maxTokens,
        temperature: AI_CONFIG.huggingface.temperature,
        return_full_text: false
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const data = await response.json();
  
  // Handle response format
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text.trim();
  } else if (data.generated_text) {
    return data.generated_text.trim();
  }
  
  throw new Error('Unexpected response format from Hugging Face');
}

// Groq API call (FREE and FAST)
export async function callGroq(messages, context, apiKey) {
  const systemPrompt = AI_CONFIG.systemPrompts[context] || AI_CONFIG.systemPrompts.general;
  
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
  ];

  const response = await fetch(AI_CONFIG.groq.apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_CONFIG.groq.model,
      messages: formattedMessages,
      max_tokens: AI_CONFIG.groq.maxTokens,
      temperature: AI_CONFIG.groq.temperature,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Together AI API call
export async function callTogether(messages, context, apiKey) {
  const systemPrompt = AI_CONFIG.systemPrompts[context] || AI_CONFIG.systemPrompts.general;
  
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
  ];

  const response = await fetch(AI_CONFIG.together.apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_CONFIG.together.model,
      messages: formattedMessages,
      max_tokens: AI_CONFIG.together.maxTokens,
      temperature: AI_CONFIG.together.temperature,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together AI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}