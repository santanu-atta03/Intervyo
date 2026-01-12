// services/groqService.js - ENSURE THIS METHOD EXISTS

import Groq from 'groq-sdk';
import config from '../config/ai.config.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

class GroqService {
  async generateJSON(messages, temperature = 0.7) {
    try {
      const completion = await groq.chat.completions.create({
        model: config.groq.defaultModel,
        messages: messages,
        temperature: temperature,
        max_tokens: config.groq.maxTokens,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Groq JSON generation error:', error);
      throw error;
    }
  }

  async generateText(messages, temperature = 0.7) {
    try {
      const completion = await groq.chat.completions.create({
        model: config.groq.defaultModel,
        messages: messages,
        temperature: temperature,
        max_tokens: config.groq.maxTokens
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq text generation error:', error);
      throw error;
    }
  }
}

export default new GroqService();