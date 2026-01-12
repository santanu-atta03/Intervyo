// frontend/src/api/chatbot.api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://intervyo.onrender.com/api';

const chatbotAPI = axios.create({
  baseURL: `${API_URL}/chatbot`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
chatbotAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Conversation management
export const createConversation = async (data) => {
  const response = await chatbotAPI.post('/conversations', data);
  return response.data;
};

export const getUserConversations = async (params) => {
  const response = await chatbotAPI.get('/conversations', { params });
  return response.data;
};

export const getConversation = async (sessionId) => {
  const response = await chatbotAPI.get(`/conversations/${sessionId}`);
  return response.data;
};

export const updateConversation = async (sessionId, data) => {
  const response = await chatbotAPI.patch(`/conversations/${sessionId}`, data);
  return response.data;
};

export const deleteConversation = async (sessionId) => {
  const response = await chatbotAPI.delete(`/conversations/${sessionId}`);
  return response.data;
};

export const clearMessages = async (sessionId) => {
  const response = await chatbotAPI.delete(`/conversations/${sessionId}/messages`);
  return response.data;
};

// Message handling
export const sendMessage = async (sessionId, message, context) => {
  const response = await chatbotAPI.post(`/conversations/${sessionId}/messages`, {
    message,
    context
  });
  return response.data;
};

export default chatbotAPI;