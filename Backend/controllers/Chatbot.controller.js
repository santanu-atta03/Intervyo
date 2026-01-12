// backend/controllers/chatbot.controller.js - FREE AI VERSION
import ChatbotConversation from '../models/Chatbot.model.js';
import { callHuggingFace, callGroq, callTogether, AI_CONFIG } from '../config/aiconfig.js';
import { v4 as uuidv4 } from 'uuid';

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { context = 'general', title, metadata } = req.body;
    const userId = req.user.id;

    const conversation = new ChatbotConversation({
      userId,
      sessionId: uuidv4(),
      title: title || `${context} conversation`,
      context,
      metadata: metadata || {},
      messages: []
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create conversation',
      error: error.message
    });
  }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, page = 1, isActive } = req.query;

    const query = { userId };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const conversations = await ChatbotConversation
      .find(query)
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-messages');

    const total = await ChatbotConversation.countDocuments(query);

    res.json({
      success: true,
      data: conversations,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// Get a specific conversation with messages
export const getConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const conversation = await ChatbotConversation.findOne({
      sessionId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message
    });
  }
};

// Send a message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, context } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    // Find or create conversation
    let conversation = await ChatbotConversation.findOne({
      sessionId,
      userId
    });

    if (!conversation) {
      conversation = new ChatbotConversation({
        userId,
        sessionId,
        context: context || 'general',
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate AI response using FREE service
    const aiResponse = await generateFreeAIResponse(
      conversation.messages,
      conversation.context
    );

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Update title if it's the first message
    if (conversation.messages.length === 2) {
      conversation.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
    }

    await conversation.save();

    res.json({
      success: true,
      data: {
        message: aiResponse,
        conversation: {
          sessionId: conversation.sessionId,
          title: conversation.title,
          messageCount: conversation.messages.length
        }
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    });
  }
};

// Generate AI response using FREE services
const generateFreeAIResponse = async (messages, context) => {
  const provider = process.env.FREE_AI_PROVIDER || 'groq'; // Default to Groq (fastest free option)
  
  try {
    let response;
    
    switch (provider) {
      case 'huggingface':
        if (!process.env.HUGGINGFACE_API_KEY) {
          throw new Error('Hugging Face API key not configured');
        }
        response = await callHuggingFace(messages, context, process.env.HUGGINGFACE_API_KEY);
        break;
        
      case 'groq':
        if (!process.env.GROQ_API_KEY) {
          throw new Error('Groq API key not configured');
        }
        response = await callGroq(messages, context, process.env.GROQ_API_KEY);
        break;
        
      case 'together':
        if (!process.env.TOGETHER_API_KEY) {
          throw new Error('Together AI API key not configured');
        }
        response = await callTogether(messages, context, process.env.TOGETHER_API_KEY);
        break;
        
      default:
        // Fallback to a simple response if no provider configured
        response = getFallbackResponse(messages, context);
    }
    
    return response;
    
  } catch (error) {
    console.error('AI generation error:', error);
    
    // Return a helpful fallback response instead of failing
    return getFallbackResponse(messages, context);
  }
};

// Fallback response when AI services are unavailable
const getFallbackResponse = (messages, context) => {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();
  
  // Simple pattern matching for common queries
  if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
    return "Hello! I'm here to help you with interview preparation, technical questions, and career advice. What would you like to know?";
  }
  
  if (lastMessage.includes('interview')) {
    return "For interview preparation, I recommend: 1) Research the company thoroughly, 2) Practice common questions, 3) Prepare specific examples from your experience, 4) Dress professionally, and 5) Arrive early. Would you like more specific advice?";
  }
  
  if (lastMessage.includes('technical') || lastMessage.includes('coding')) {
    return "For technical interviews, focus on: data structures, algorithms, system design, and coding best practices. Practice on platforms like LeetCode and HackerRank. Would you like specific problem-solving strategies?";
  }
  
  if (lastMessage.includes('resume') || lastMessage.includes('cv')) {
    return "A great resume should: 1) Be concise (1-2 pages), 2) Highlight achievements with metrics, 3) Use action verbs, 4) Be tailored to each job, and 5) Be error-free. Would you like tips on any specific section?";
  }
  
  // Generic helpful response
  return "I'm here to help! I can assist with interview preparation, technical questions, resume advice, and career guidance. What specific area would you like to explore?";
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const conversation = await ChatbotConversation.findOneAndDelete({
      sessionId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
      error: error.message
    });
  }
};

// Update conversation
export const updateConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { title, isActive } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (isActive !== undefined) updateData.isActive = isActive;

    const conversation = await ChatbotConversation.findOneAndUpdate(
      { sessionId, userId },
      updateData,
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update conversation',
      error: error.message
    });
  }
};

// Clear all messages in a conversation
export const clearMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const conversation = await ChatbotConversation.findOneAndUpdate(
      { sessionId, userId },
      { messages: [] },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Messages cleared successfully',
      data: conversation
    });
  } catch (error) {
    console.error('Clear messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear messages',
      error: error.message
    });
  }
};