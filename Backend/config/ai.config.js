// // config/ai.config.js - FREE VERSION
// module.exports = {
//   groq: {
//     apiKey: process.env.GROQ_API_KEY, // FREE!
//     model: 'llama-3.1-70b-versatile',
//     temperature: 0.7,
//     maxTokens: 2000
//   },
//   // Fallback options
//   huggingface: {
//     apiKey: process.env.HUGGINGFACE_API_KEY, // FREE!
//     model: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
//   },
//   questionCounts: {
//     easy: { behavioral: 5, technical: 8, coding: 3, 'system-design': 2 },
//     medium: { behavioral: 6, technical: 10, coding: 5, 'system-design': 3 },
//     hard: { behavioral: 7, technical: 12, coding: 7, 'system-design': 5 }
//   }
// };

// config/ai.config.js
// config/ai.config.js
export default {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    // Updated models (as of Oct 2024)
    models: {
      primary: 'llama-3.3-70b-versatile',      // Latest & best
      fast: 'llama-3.1-8b-instant',            // Fastest
      fallback: 'mixtral-8x7b-32768'           // Backup option
    },
    defaultModel: 'llama-3.3-70b-versatile',   // Use this by default
    temperature: 0.7,
    maxTokens: 2000
  },
  questionCounts: {
    easy: { 
      behavioral: 2, 
      technical: 2, 
      coding: 2, 
      'system-design': 2 
    },
    medium: { 
      behavioral: 2, 
      technical: 2, 
      coding: 2, 
      'system-design': 2
    },
    hard: { 
      behavioral: 7, 
      technical: 12, 
      coding: 7, 
      'system-design': 5 
    }
  },
  evaluationCriteria: {
    behavioral: ['clarity', 'structure', 'examples', 'relevance'],
    technical: ['accuracy', 'depth', 'explanation', 'examples'],
    coding: ['correctness', 'efficiency', 'readability', 'edge-cases'],
    'system-design': ['scalability', 'components', 'trade-offs', 'justification']
  }
};