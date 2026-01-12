// backend/middlewares/chatbot.middleware.js
import ChatbotConversation from '../models/Chatbot.model.js';
import { RATE_LIMITS } from '../config/aiconfig.js';

// Rate limiting for chatbot messages
export const chatbotRateLimit = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    // Count messages in the last hour
    const hourlyMessages = await ChatbotConversation.aggregate([
      {
        $match: {
          userId,
          'messages.timestamp': { $gte: oneHourAgo }
        }
      },
      {
        $unwind: '$messages'
      },
      {
        $match: {
          'messages.role': 'user',
          'messages.timestamp': { $gte: oneHourAgo }
        }
      },
      {
        $count: 'total'
      }
    ]);

    const hourlyCount = hourlyMessages[0]?.total || 0;

    if (hourlyCount >= RATE_LIMITS.maxMessagesPerHour) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please wait before sending more messages.',
        retryAfter: 3600 // seconds
      });
    }

    // Count messages in the last day
    const dailyMessages = await ChatbotConversation.aggregate([
      {
        $match: {
          userId,
          'messages.timestamp': { $gte: oneDayAgo }
        }
      },
      {
        $unwind: '$messages'
      },
      {
        $match: {
          'messages.role': 'user',
          'messages.timestamp': { $gte: oneDayAgo }
        }
      },
      {
        $count: 'total'
      }
    ]);

    const dailyCount = dailyMessages[0]?.total || 0;

    if (dailyCount >= RATE_LIMITS.maxMessagesPerDay) {
      return res.status(429).json({
        success: false,
        message: 'Daily message limit reached. Please try again tomorrow.',
        retryAfter: 86400 // seconds
      });
    }

    // Add usage info to request
    req.chatbotUsage = {
      hourlyCount,
      dailyCount,
      hourlyLimit: RATE_LIMITS.maxMessagesPerHour,
      dailyLimit: RATE_LIMITS.maxMessagesPerDay
    };

    next();
  } catch (error) {
    console.error('Rate limit check error:', error);
    next(); // Continue even if rate limit check fails
  }
};

// Validate message content
export const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }

  if (typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Message must be a string'
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Message cannot be empty'
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Message is too long (max 5000 characters)'
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

  const containsProhibited = prohibitedPatterns.some(pattern => 
    pattern.test(message)
  );

  if (containsProhibited) {
    return res.status(400).json({
      success: false,
      message: 'Message contains prohibited content'
    });
  }

  next();
};