// services/groqService.js
import Groq from 'groq-sdk';
import aiConfig from '../config/ai.config.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

class GroqService {
  constructor() {
    this.models = aiConfig.groq.models;
    this.currentModel = aiConfig.groq.defaultModel;
  }

  async generateCompletion(messages, options = {}) {
    const modelsToTry = [
      options.model || this.currentModel,
      this.models.primary,
      this.models.fast,
      this.models.fallback
    ];

    let lastError = null;

    // Try each model until one works
    for (const model of modelsToTry) {
      try {
        console.log(`🤖 Trying Groq model: ${model}`);
        
        const response = await groq.chat.completions.create({
          model: model,
          messages: messages,
          temperature: options.temperature || aiConfig.groq.temperature,
          max_tokens: options.maxTokens || aiConfig.groq.maxTokens,
        });

        console.log(`✅ Success with model: ${model}`);
        this.currentModel = model; // Remember working model
        return response.choices[0].message.content;

      } catch (error) {
        console.error(`❌ Model ${model} failed:`, error.message);
        lastError = error;
        
        // If it's a rate limit, wait and retry
        if (error.status === 429) {
          console.log('⏳ Rate limited, waiting 2 seconds...');
          await this._sleep(2000);
          continue;
        }
        
        // If model is decommissioned or not found, try next model
        if (error.status === 400 || error.status === 404) {
          continue;
        }
        
        // For other errors, try next model
        continue;
      }
    }

    // All models failed
    console.error('❌ All Groq models failed');
    throw new Error(`AI service unavailable: ${lastError?.message || 'Unknown error'}`);
  }

  async generateJSON(messages, options = {}) {
    try {
      // Add JSON instruction to system message
      const jsonMessages = [
        ...messages,
        { 
          role: 'system', 
          content: 'CRITICAL: You must respond with ONLY valid JSON. No markdown, no code blocks, no explanation. Just pure JSON object starting with { and ending with }.'
        }
      ];

      const result = await this.generateCompletion(jsonMessages, options);
      
      // Clean up response
      let cleanResult = result.trim();
      
      // Remove markdown code blocks if present
      if (cleanResult.includes('```')) {
        cleanResult = cleanResult
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
      }
      
      // Remove any text before first { and after last }
      const firstBrace = cleanResult.indexOf('{');
      const lastBrace = cleanResult.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanResult = cleanResult.substring(firstBrace, lastBrace + 1);
      }

      // Try to parse
      try {
        const parsed = JSON.parse(cleanResult);
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Raw response:', cleanResult);
        throw new Error('Failed to parse AI response as JSON');
      }

    } catch (error) {
      console.error('JSON Generation Error:', error.message);
      throw new Error('Failed to generate valid JSON: ' + error.message);
    }
  }

  // Stream completion for real-time responses
  async *streamCompletion(messages, options = {}) {
    try {
      const stream = await groq.chat.completions.create({
        model: options.model || this.currentModel,
        messages: messages,
        temperature: options.temperature || aiConfig.groq.temperature,
        max_tokens: options.maxTokens || aiConfig.groq.maxTokens,
        stream: true
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('Stream Error:', error.message);
      throw new Error('Streaming failed: ' + error.message);
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get list of available models
  async getAvailableModels() {
    try {
      const models = await groq.models.list();
      console.log('📋 Available Groq models:', models.data.map(m => m.id));
      return models.data;
    } catch (error) {
      console.error('Failed to fetch models:', error.message);
      return [];
    }
  }
}

export default new GroqService();