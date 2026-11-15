// backend/controllers/chatbot.controller.js - FREE AI VERSION
import ChatbotConversation from "../models/Chatbot.model.js";
import {
  callHuggingFace,
  callGroq,
  callTogether,
  AI_CONFIG,
} from "../config/aiconfig.js";
import { v4 as uuidv4 } from "uuid";

const CHATBOT_CONTEXTS = [
  "general",
  "interview-prep",
  "technical-help",
  "career-advice",
];

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { context = "general", title, metadata } = req.body;
    const userId = req.user.id;
    if (!CHATBOT_CONTEXTS.includes(context)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching mode",
      });
    }

    const conversation = new ChatbotConversation({
      userId,
      sessionId: uuidv4(),
      title: title || `${context} conversation`,
      context,
      metadata: metadata || {},
      messages: [],
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
      error: error.message,
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
      query.isActive = isActive === "true";
    }

    const conversations = await ChatbotConversation.find(query)
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select("-messages");

    const total = await ChatbotConversation.countDocuments(query);

    res.json({
      success: true,
      data: conversations,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
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
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
      error: error.message,
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
        message: "Message cannot be empty",
      });
    }
    if (context !== undefined && !CHATBOT_CONTEXTS.includes(context)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching mode",
      });
    }

    // Find or create conversation
    let conversation = await ChatbotConversation.findOne({
      sessionId,
      userId,
    });

    if (!conversation) {
      conversation = new ChatbotConversation({
        userId,
        sessionId,
        context: context || "general",
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Generate AI response using FREE service
    const aiResponse = await generateFreeAIResponse(
      conversation.messages,
      conversation.context,
    );

    // Add AI response
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    });

    // Update title if it's the first message
    if (conversation.messages.length === 2) {
      conversation.title =
        message.substring(0, 50) + (message.length > 50 ? "..." : "");
    }

    await conversation.save();

    res.json({
      success: true,
      data: {
        message: aiResponse,
        usage: {
          ...req.chatbotUsage,
          hourlyCount: req.chatbotUsage.hourlyCount + 1,
          dailyCount: req.chatbotUsage.dailyCount + 1,
        },
        conversation: {
          sessionId: conversation.sessionId,
          title: conversation.title,
          messageCount: conversation.messages.length,
        },
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(error.status || 500).json({
      success: false,
      message:
        error.status === 503
          ? error.message
          : "Failed to send message. Please try again.",
    });
  }
};

// Generate AI response using FREE services
const generateFreeAIResponse = async (messages, context) => {
  const provider = process.env.FREE_AI_PROVIDER || "groq";

  try {
    let response;

    switch (provider) {
      case "huggingface":
        if (!process.env.HUGGINGFACE_API_KEY) {
          throw new Error("Hugging Face API key not configured");
        }
        response = await callHuggingFace(
          messages,
          context,
          process.env.HUGGINGFACE_API_KEY,
        );
        break;

      case "groq":
        if (!process.env.GROQ_API_KEY) {
          throw new Error("Groq API key not configured");
        }
        response = await callGroq(messages, context, process.env.GROQ_API_KEY);
        break;

      case "together":
        if (!process.env.TOGETHER_API_KEY) {
          throw new Error("Together AI API key not configured");
        }
        response = await callTogether(
          messages,
          context,
          process.env.TOGETHER_API_KEY,
        );
        break;

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }

    return response;
  } catch (error) {
    console.error("AI generation error:", error);
    const unavailableError = new Error(
      "AI assistant is temporarily unavailable. Please try again shortly.",
    );
    unavailableError.status = 503;
    throw unavailableError;
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const conversation = await ChatbotConversation.findOneAndDelete({
      sessionId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
      error: error.message,
    });
  }
};

// Update conversation
export const updateConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { title, isActive } = req.body;
    const { context } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (context !== undefined) {
      if (!CHATBOT_CONTEXTS.includes(context)) {
        return res.status(400).json({
          success: false,
          message: "Invalid coaching mode",
        });
      }
      updateData.context = context;
    }

    const conversation = await ChatbotConversation.findOneAndUpdate(
      { sessionId, userId },
      updateData,
      { new: true },
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Update conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update conversation",
      error: error.message,
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
      { new: true },
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
      message: "Messages cleared successfully",
      data: conversation,
    });
  } catch (error) {
    console.error("Clear messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear messages",
      error: error.message,
    });
  }
};
