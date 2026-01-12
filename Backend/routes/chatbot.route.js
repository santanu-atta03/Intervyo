// backend/routes/chatbot.routes.js
import express from 'express';
import {
  createConversation,
  getUserConversations,
  getConversation,
  sendMessage,
  deleteConversation,
  updateConversation,
  clearMessages
} from '../controllers/Chatbot.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Conversation management
router.post('/conversations', createConversation);
router.get('/conversations', getUserConversations);
router.get('/conversations/:sessionId', getConversation);
router.patch('/conversations/:sessionId', updateConversation);
router.delete('/conversations/:sessionId', deleteConversation);
router.delete('/conversations/:sessionId/messages', clearMessages);

// Message handling
router.post('/conversations/:sessionId/messages', sendMessage);

export default router;