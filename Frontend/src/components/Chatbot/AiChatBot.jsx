// frontend/src/components/Chatbot/AIChatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Trash2, 
  Plus,
  Menu,
  Settings,
  Minimize2
} from 'lucide-react';
import {
  createConversation,
  getUserConversations,
  getConversation,
  sendMessage,
  deleteConversation,
  clearMessages
} from '../../services/operations/chatbotAPI';
import toast from 'react-hot-toast';
import './AIChatbot.css';

const AIChatbot = ({ defaultContext = 'general' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [context, setContext] = useState(defaultContext);

  // Refs for scrolling behavior
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Track whether user is viewing the latest messages
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom of messages using sentinel element
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  // Auto-scroll only when new messages are added AND user is already near the bottom
  useEffect(() => {
    if (!isAtBottom) return;
    if (!messages.length) return;

    scrollToBottom('smooth');
  }, [messages.length, isAtBottom]);

  // Keep scroll position stable while user is reading older messages
  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 80; // px from bottom considered "at bottom"
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setIsAtBottom(distanceFromBottom <= threshold);
  };

  // Load conversations when chatbot opens
  useEffect(() => {
    if (isOpen) {
      loadConversations();
      // When chat opens, consider user at bottom so first messages auto-scroll
      setIsAtBottom(true);
    }
  }, [isOpen]);

  const loadConversations = async () => {
    try {
      const response = await getUserConversations({ limit: 20, isActive: true });
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversation history');
    }
  };

  const loadConversation = async (sessionId) => {
    try {
      setIsLoading(true);
      const response = await getConversation(sessionId);
      setCurrentConversation(response.data);
      setMessages(response.data.messages);
      setContext(response.data.context);
      // After loading a conversation, jump directly to the latest message
      setIsAtBottom(true);
      // Use next tick to ensure DOM has rendered before scrolling
      requestAnimationFrame(() => scrollToBottom('auto'));
    } catch (error) {
      console.error('Failed to load conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = async () => {
    try {
      const response = await createConversation({
        context,
        title: 'New Conversation'
      });
      setCurrentConversation(response.data);
      setMessages([]);
      setConversations([response.data, ...conversations]);
      toast.success('New conversation started');
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to start new conversation');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to UI immediately
    const tempUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      setIsLoading(true);

      // Create conversation if it doesn't exist
      let sessionId = currentConversation?.sessionId;
      if (!sessionId) {
        const newConv = await createConversation({ context });
        sessionId = newConv.data.sessionId;
        setCurrentConversation(newConv.data);
        setConversations([newConv.data, ...conversations]);
      }

      // Send message and get AI response
      const response = await sendMessage(sessionId, userMessage, context);

      // Add AI response to messages
      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update conversation in list
      loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
      // Remove the temporary user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await deleteConversation(sessionId);
      setConversations(conversations.filter(c => c.sessionId !== sessionId));
      if (currentConversation?.sessionId === sessionId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      toast.success('Conversation deleted');
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };

  const handleClearMessages = async () => {
    if (!currentConversation || !confirm('Clear all messages?')) return;

    try {
      await clearMessages(currentConversation.sessionId);
      setMessages([]);
      toast.success('Messages cleared');
    } catch (error) {
      console.error('Failed to clear messages:', error);
      toast.error('Failed to clear messages');
    }
  };

  const contextOptions = [
    { value: 'general', label: 'General Help', icon: '💬' },
    { value: 'interview-prep', label: 'Interview Prep', icon: '🎯' },
    { value: 'technical-help', label: 'Technical Help', icon: '💻' },
    { value: 'career-advice', label: 'Career Advice', icon: '📈' }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="chatbot-toggle-btn"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="chatbot-icon-btn"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="chatbot-header-info">
            <h3>AI Assistant</h3>
            <span className="chatbot-status">Online</span>
          </div>
        </div>
        <div className="chatbot-header-right">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="chatbot-icon-btn"
            aria-label="Minimize"
          >
            <Minimize2 size={20} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="chatbot-icon-btn"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="chatbot-body">
        {/* Sidebar */}
        {showSidebar && (
          <div className="chatbot-sidebar">
            <div className="chatbot-sidebar-header">
              <button
                onClick={startNewConversation}
                className="chatbot-new-btn"
              >
                <Plus size={18} />
                New Chat
              </button>
            </div>

            {/* Context Selector */}
            <div className="chatbot-context-selector">
              <label>Mode:</label>
              <select 
                value={context} 
                onChange={(e) => setContext(e.target.value)}
                className="chatbot-select"
              >
                {contextOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Conversations List */}
            <div className="chatbot-conversations">
              {conversations.map(conv => (
                <div
                  key={conv.sessionId}
                  className={`chatbot-conversation-item ${
                    currentConversation?.sessionId === conv.sessionId ? 'active' : ''
                  }`}
                  onClick={() => loadConversation(conv.sessionId)}
                >
                  <div className="conversation-content">
                    <span className="conversation-title">
                      {conv.title}
                    </span>
                    <span className="conversation-time">
                      {new Date(conv.lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.sessionId);
                    }}
                    className="conversation-delete"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="chatbot-messages-container">
          <div
            className="chatbot-messages"
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
          >
            {messages.length === 0 ? (
              <div className="chatbot-welcome">
                <h2>👋 Welcome to AI Assistant!</h2>
                <p>I'm here to help you with:</p>
                <ul>
                  <li>🎯 Interview preparation and tips</li>
                  <li>💻 Technical questions and coding help</li>
                  <li>📈 Career advice and guidance</li>
                  <li>❓ Any questions about the platform</li>
                </ul>
                <p>What would you like to know?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chatbot-message ${msg.role}`}
                >
                  <div className="message-avatar">
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="chatbot-message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-loading">
                    <Loader2 className="spinner" size={20} />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="chatbot-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="spinner" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;