// backend/middlewares/chatbot.middleware.js
import ChatbotConversation from "../models/Chatbot.model.js";
import { RATE_LIMITS } from "../config/aiconfig.js";
import mongoose from "mongoose";

const getUserObjectId = (req) => {
  const userId = req.user?.id || req.user?._id;
  return mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : null;
};

const makeUsage = (hourlyCount, dailyCount) => ({
  hourlyCount,
  dailyCount,
  hourlyLimit: RATE_LIMITS.maxMessagesPerHour,
  dailyLimit: RATE_LIMITS.maxMessagesPerDay,
});

// Rate limiting for chatbot messages
export const chatbotRateLimit = async (req, res, next) => {
  try {
    const userId = getUserObjectId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    const [counts = { hourlyCount: 0, dailyCount: 0 }] =
      await ChatbotConversation.aggregate([
      {
        $match: {
          userId,
          "messages.timestamp": { $gte: oneDayAgo },
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $match: {
          "messages.role": "user",
          "messages.timestamp": { $gte: oneDayAgo },
        },
      },
      {
        $group: {
          _id: null,
          dailyCount: { $sum: 1 },
          hourlyCount: {
            $sum: {
              $cond: [{ $gte: ["$messages.timestamp", oneHourAgo] }, 1, 0],
            },
          },
        },
      },
    ]);

    const hourlyCount = counts.hourlyCount;
    const dailyCount = counts.dailyCount;
    req.chatbotUsage = makeUsage(hourlyCount, dailyCount);

    if (hourlyCount >= RATE_LIMITS.maxMessagesPerHour) {
      res.set("Retry-After", "3600");
      return res.status(429).json({
        success: false,
        message:
          "Rate limit exceeded. Please wait before sending more messages.",
        retryAfter: 3600, // seconds
        usage: req.chatbotUsage,
      });
    }

    if (dailyCount >= RATE_LIMITS.maxMessagesPerDay) {
      res.set("Retry-After", "86400");
      return res.status(429).json({
        success: false,
        message: "Daily message limit reached. Please try again tomorrow.",
        retryAfter: 86400, // seconds
        usage: req.chatbotUsage,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit check error:", error);
    return res.status(503).json({
      success: false,
      message: "Chat usage could not be verified. Please try again shortly.",
    });
  }
};

export const chatbotConversationRateLimit = async (req, res, next) => {
  try {
    const userId = getUserObjectId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const conversationCount = await ChatbotConversation.countDocuments({
      userId,
      createdAt: { $gte: dayAgo },
    });

    if (conversationCount >= RATE_LIMITS.maxConversationsPerDay) {
      res.set("Retry-After", "86400");
      return res.status(429).json({
        success: false,
        message:
          "You've reached today's new conversation limit. Please try again tomorrow.",
        retryAfter: 86400,
      });
    }

    next();
  } catch (error) {
    console.error("Conversation rate limit check error:", error);
    return res.status(503).json({
      success: false,
      message: "Chat usage could not be verified. Please try again shortly.",
    });
  }
};

// Validate message content
export const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  if (typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Message must be a string",
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Message cannot be empty",
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Message is too long (max 5000 characters)",
    });
  }

  next();
};

// Content moderation (basic implementation)
export const moderateContent = (req, res, next) => {
  const { message } = req.body;

  // List of prohibited patterns (expand as needed)
  const prohibitedPatterns = [
    /\b(spam|scam)\b/i,
    // Add more patterns as needed
  ];

  const containsProhibited = prohibitedPatterns.some((pattern) =>
    pattern.test(message),
  );

  if (containsProhibited) {
    return res.status(400).json({
      success: false,
      message: "Message contains prohibited content",
    });
  }

  next();
};
