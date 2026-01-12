// ============================================
// AI CONTENT GENERATOR SERVICE
// File: services/aiContentGenerator.js
// ============================================

import { Module, AIContentCache } from '../models/LearningHub.model.js';
import OpenAI from "openai";
import { Topic } from '../models/LearningHub.model.js';

let openai = null;

try {
  if (process.env.GROQ_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    console.log('✅ AI Content Generator enabled');
  } else {
    console.log('⚠️  AI Content Generator disabled (missing GROQ_API_KEY)');
  }
} catch (error) {
  console.log('⚠️  AI Content Generator initialization failed:', error.message);
}

export { openai };



// ============================================
// GENERATE TEXT CONTENT
// ============================================
async function generateTextContent(module) {
  const topic = await Topic.findById(module.topicId);

  const prompt = `You are an expert technical educator. Create comprehensive learning content for this module:

Topic: ${topic.title}
Module: ${module.title}
Description: ${module.description}

Create detailed, well-structured content that includes:
1. Introduction (Why this matters)
2. Core Concepts (Explain thoroughly with examples)
3. Practical Applications
4. Best Practices
5. Common Pitfalls
6. Summary & Key Takeaways

Use markdown formatting with:
- Clear headings (##, ###)
- Code blocks when relevant
- Bullet points for lists
- **Bold** for important terms
- Real-world examples

Make it engaging, practical, and suitable for someone learning this topic.`;

  const message = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return {
    type: 'markdown',
    content: message.choices[0].message.content,
    resources: []
  };
}

// ============================================
// GENERATE CODE CONTENT
// ============================================
async function generateCodeContent(module) {
  const topic = await Topic.findById(module.topicId);

  const prompt = `Create a hands-on coding lesson for:

Module: ${module.title}
Topic: ${topic.title}
Description: ${module.description}

Include:
1. **Concept Explanation** (brief)
2. **Code Example** (well-commented, production-quality)
3. **Step-by-Step Breakdown**
4. **Practice Exercise** (with hints)
5. **Solution** (with explanation)
6. **Common Mistakes** to avoid

Format as markdown with code blocks. Make it practical and hands-on.`;

  const message = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return {
    type: 'code',
    content: message.choices[0].message.content,
    language: determineLanguage(topic.domain)
  };
}

// ============================================
// GENERATE QUIZ CONTENT
// ============================================
async function generateQuizContent(module) {
  const topic = await Topic.findById(module.topicId);

  const prompt = `Create a quiz to test understanding of:

Module: ${module.title}
Topic: ${topic.title}

Generate 8-10 questions with:
- Mix of multiple choice, true/false, and short answer
- Varying difficulty levels
- Practical, scenario-based questions
- Detailed explanations for each answer

Return as JSON array:
[
  {
    "question": "Question text",
    "type": "multiple_choice",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "B",
    "explanation": "Why this is correct",
    "difficulty": "medium"
  }
]`;

  const message = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const responseText = message.choices[0].message.content;
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

  return {
    type: 'quiz',
    questions: questions,
    passingScore: 70
  };
}

// ============================================
// GENERATE PROJECT CONTENT
// ============================================
async function generateProjectContent(module) {
  const topic = await Topic.findById(module.topicId);

  const prompt = `Create a hands-on project for:

Module: ${module.title}
Topic: ${topic.title}

Include:
1. **Project Overview** (What we'll build)
2. **Learning Objectives**
3. **Requirements & Setup**
4. **Step-by-Step Instructions** (detailed)
5. **Code Snippets** (for each step)
6. **Testing & Verification**
7. **Bonus Challenges**
8. **Solution Repository** (structure)

Make it practical, industry-relevant, and portfolio-worthy.`;

  const message = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: 'user',
      content: prompt
    }],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return {
    type: 'project',
    content: message.choices[0].message.content,
    estimatedHours: Math.ceil(module.estimatedMinutes / 60)
  };
}

// ============================================
// HELPER: DETERMINE LANGUAGE
// ============================================
function determineLanguage(domain) {
  const languageMap = {
    'Frontend': 'javascript',
    'Backend': 'javascript',
    'Fullstack': 'javascript',
    'Data Science': 'python',
    'ML': 'python',
    'DevOps': 'bash',
    'Mobile': 'javascript',
    'Blockchain': 'solidity'
  };
  return languageMap[domain] || 'javascript';
}
// ============================================
// GENERATE TOPIC CONTENT (Modules Structure)
// ============================================
export async function generateTopicContent(topic) {
  try {
    console.log(`🤖 Generating content for topic: ${topic.title}`);

    // Check cache first
    const cached = await AIContentCache.findOne({
      topicId: topic._id,
      moduleTitle: 'course_structure'
    });

    let moduleStructure;

    if (cached && cached.expiresAt > new Date()) {
      console.log('✅ Using cached content');
      moduleStructure = cached.content;
      cached.usageCount += 1;
      await cached.save();
    } else {
      // Generate new content
      const prompt = `You are an expert technical educator. Create a comprehensive learning module structure for the topic: "${topic.title}".

Domain: ${topic.domain}
Difficulty: ${topic.difficulty}
Description: ${topic.description}
Estimated Hours: ${topic.estimatedHours}

Generate a well-structured course outline with 2-3 modules. Each module should include:
1. Module title (clear and descriptive)
2. Brief description (2-3 sentences)
3. Estimated time in minutes
4. Content type (text, video, code, quiz, project)
5. Key learning objectives (3-5 points)

Return ONLY a valid JSON array of modules with this structure:
[
  {
    "title": "Module Title",
    "description": "Module description",
    "order": 1,
    "contentType": "text",
    "estimatedMinutes": 30,
    "objectives": ["objective 1", "objective 2"]
  }
]

Make it practical, industry-relevant, and suitable for ${topic.difficulty.toLowerCase()} level learners.`;

      const message = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.8,
        max_tokens: 1000,
      });

      console.log("Message : ", message)
      const responseText = message.choices[0].message.content;

      // Extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      moduleStructure = JSON.parse(jsonMatch[0]);

      // Cache the structure
      await AIContentCache.create({
        topicId: topic._id,
        moduleTitle: 'course_structure',
        content: moduleStructure,
        usageCount: 1
      });
    }

    // Save modules to database
    const savedModules = [];
    for (const moduleData of moduleStructure) {
      const module = await Module.create({
        topicId: topic._id,
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        contentType: moduleData.contentType || 'text',
        estimatedMinutes: moduleData.estimatedMinutes || 30,
        content: null // Will be generated on-demand
      });
      savedModules.push(module);
    }

    console.log(`✅ Generated ${savedModules.length} modules`);
    return savedModules;

  } catch (error) {
    console.error('Error generating topic content:', error);
    throw error;
  }
}

// ============================================
// GENERATE MODULE CONTENT (Detailed Content)
// ============================================
export async function generateModuleContent(module) {
  try {
    console.log(`🤖 Generating content for module: ${module.title}`);

    // Check cache first
    const cached = await AIContentCache.findOne({
      topicId: module.topicId,
      moduleTitle: module.title
    });

    if (cached && cached.expiresAt > new Date()) {
      console.log('✅ Using cached module content');
      cached.usageCount += 1;
      await cached.save();
      return cached.content;
    }

    // Generate new content based on type
    let content;

    if (module.contentType === 'text') {
      content = await generateTextContent(module);
    } else if (module.contentType === 'code') {
      content = await generateCodeContent(module);
    } else if (module.contentType === 'quiz') {
      content = await generateQuizContent(module);
    } else if (module.contentType === 'project') {
      content = await generateProjectContent(module);
    } else {
      content = await generateTextContent(module);
    }

    // Cache the content
    await AIContentCache.create({
      topicId: module.topicId,
      moduleTitle: module.title,
      content: content,
      usageCount: 1
    });

    console.log('✅ Module content generated and cached');
    return content;

  } catch (error) {
    console.error('Error generating module content:', error);
    throw error;
  }
}

// ============================================
// GENERATE TEXT CONTENT
// ============================================
// async function generateTextContent(module) {
//   const topic = await module.populate('topicId');

//   const prompt = `You are an expert technical educator. Create comprehensive learning content for this module:

// Topic: ${topic.topicId.title}
// Module: ${module.title}
// Description: ${module.description}

// Create detailed, well-structured content that includes:
// 1. Introduction (Why this matters)
// 2. Core Concepts (Explain thoroughly with examples)
// 3. Practical Applications
// 4. Best Practices
// 5. Common Pitfalls
// 6. Summary & Key Takeaways

// Use markdown formatting with:
// - Clear headings (##, ###)
// - Code blocks when relevant
// - Bullet points for lists
// - **Bold** for important terms
// - Real-world examples

// Make it engaging, practical, and suitable for someone learning this topic.`;

//   const message = await openai.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{
//       role: 'user',
//       content: prompt
//     }],
//     temperature: 0.8,
//     max_tokens: 1000,
//   });

//   return {
//     type: 'markdown',
//     content: message.content[0].text,
//     resources: []
//   };
// }

// ============================================
// GENERATE CODE CONTENT
// ============================================
// async function generateCodeContent(module) {
//   const topic = await module.populate('topicId');

//   const prompt = `Create a hands-on coding lesson for:

// Module: ${module.title}
// Topic: ${topic.topicId.title}
// Description: ${module.description}

// Include:
// 1. **Concept Explanation** (brief)
// 2. **Code Example** (well-commented, production-quality)
// 3. **Step-by-Step Breakdown**
// 4. **Practice Exercise** (with hints)
// 5. **Solution** (with explanation)
// 6. **Common Mistakes** to avoid

// Format as markdown with code blocks. Make it practical and hands-on.`;

//   const message = await openai.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{
//       role: 'user',
//       content: prompt
//     }],
//     temperature: 0.8,
//     max_tokens: 1000,
//   });

//   return {
//     type: 'code',
//     content: message.content[0].text,
//     language: determineLanguage(topic.topicId.domain)
//   };
// }

// ============================================
// GENERATE QUIZ CONTENT
// ============================================
// async function generateQuizContent(module) {
//   const topic = await module.populate('topicId');

//   const prompt = `Create a quiz to test understanding of:

// Module: ${module.title}
// Topic: ${topic.topicId.title}

// Generate 8-10 questions with:
// - Mix of multiple choice, true/false, and short answer
// - Varying difficulty levels
// - Practical, scenario-based questions
// - Detailed explanations for each answer

// Return as JSON array:
// [
//   {
//     "question": "Question text",
//     "type": "multiple_choice",
//     "options": ["A", "B", "C", "D"],
//     "correctAnswer": "B",
//     "explanation": "Why this is correct",
//     "difficulty": "medium"
//   }
// ]`;

// //   const message = await anthropic.messages.create({
// //     model: 'claude-sonnet-4-20250514',
// //     max_tokens: 6000,
// //     messages: [{
// //       role: 'user',
// //       content: prompt
// //     }]
// //   });
// const message = await openai.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{
//       role: 'user',
//       content: prompt
//     }],
//     temperature: 0.8,
//     max_tokens: 1000,
//   });

//   const responseText = message.content[0].text;
//   const jsonMatch = responseText.match(/\[[\s\S]*\]/);
//   const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

//   return {
//     type: 'quiz',
//     questions: questions,
//     passingScore: 70
//   };
// }

// ============================================
// GENERATE PROJECT CONTENT
// ============================================
// async function generateProjectContent(module) {
//   const topic = await module.populate('topicId');

//   const prompt = `Create a hands-on project for:

// Module: ${module.title}
// Topic: ${topic.topicId.title}

// Include:
// 1. **Project Overview** (What we'll build)
// 2. **Learning Objectives**
// 3. **Requirements & Setup**
// 4. **Step-by-Step Instructions** (detailed)
// 5. **Code Snippets** (for each step)
// 6. **Testing & Verification**
// 7. **Bonus Challenges**
// 8. **Solution Repository** (structure)

// Make it practical, industry-relevant, and portfolio-worthy.`;

//   const message = await openai.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{
//       role: 'user',
//       content: prompt
//     }],
//     temperature: 0.8,
//     max_tokens: 1000,
//   });

//   return {
//     type: 'project',
//     content: message.content[0].text,
//     estimatedHours: Math.ceil(module.estimatedMinutes / 60)
//   };
// }

// ============================================
// HELPER: DETERMINE LANGUAGE
// ============================================
// function determineLanguage(domain) {
//   const languageMap = {
//     'Frontend': 'javascript',
//     'Backend': 'javascript',
//     'Fullstack': 'javascript',
//     'Data Science': 'python',
//     'ML': 'python',
//     'DevOps': 'bash',
//     'Mobile': 'javascript',
//     'Blockchain': 'solidity'
//   };
//   return languageMap[domain] || 'javascript';
// }

// ============================================
// GENERATE LEARNING PATH RECOMMENDATIONS
// ============================================
export async function generateLearningPath(userProfile, userGoals) {
  try {
    const prompt = `As a career advisor, recommend a learning path for:

User Profile:
- Current Skills: ${userProfile.skills?.join(', ') || 'Beginner'}
- Domain: ${userProfile.domain || 'General'}
- Goal: ${userGoals || 'Career advancement'}

Suggest 5-7 topics in order of learning, with reasoning.

Return as JSON:
[
  {
    "topicTitle": "Topic name",
    "reason": "Why learn this",
    "order": 1,
    "estimatedWeeks": 2
  }
]`;

    const message = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];

  } catch (error) {
    console.error('Error generating learning path:', error);
    throw error;
  }
}


// ============================================
// GENERATE MODULE CONTENT (Missing function)
// ============================================
// export async function generateModuleContent(module) {
//   try {
//     console.log(`🤖 Generating content for module: ${module.title}`);

//     // Check cache first
//     const cached = await AIContentCache.findOne({
//       topicId: module.topicId,
//       moduleTitle: module.title
//     });

//     if (cached && cached.expiresAt > new Date()) {
//       console.log('✅ Using cached module content');
//       cached.usageCount += 1;
//       await cached.save();
//       return cached.content;
//     }

//     // Generate new content based on type
//     let content;

//     if (module.contentType === 'text') {
//       content = await generateTextContent(module);
//     } else if (module.contentType === 'code') {
//       content = await generateCodeContent(module);
//     } else if (module.contentType === 'quiz') {
//       content = await generateQuizContent(module);
//     } else if (module.contentType === 'project') {
//       content = await generateProjectContent(module);
//     } else {
//       content = await generateTextContent(module);
//     }

//     // Cache the content
//     await AIContentCache.create({
//       topicId: module.topicId,
//       moduleTitle: module.title,
//       content: content,
//       usageCount: 1
//     });

//     console.log('✅ Module content generated and cached');
//     return content;

//   } catch (error) {
//     console.error('Error generating module content:', error);
//     throw error;
//   }
// }