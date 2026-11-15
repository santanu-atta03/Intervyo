// frontend/src/components/Chatbot/AIChatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  X,
  Send,
  Trash2,
  Plus,
  Menu,
  Minimize2,
  Sparkles,
  Copy,
  PanelLeftClose,
} from "lucide-react";
import { LoadingMark } from "../Loader/Loader";
import BrandLogo from "../shared/BrandLogo";
import {
  createConversation,
  getUserConversations,
  getConversation,
  sendMessage,
  updateConversation,
  deleteConversation,
  clearMessages,
} from "../../services/operations/chatbotAPI";
import { notify } from "../../utils/sileoNotifications";
import "./AIChatbot.css";

const AIChatbot = ({ defaultContext = "general" }) => {
  const token = useSelector((state) => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(() =>
    window.matchMedia("(min-width: 601px)").matches,
  );
  const [context, setContext] = useState(defaultContext);
  const [usage, setUsage] = useState(null);
  const [messageError, setMessageError] = useState("");

  // Refs for scrolling behavior
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Track whether user is viewing the latest messages
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom of messages using sentinel element
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  // Auto-scroll only when new messages are added AND user is already near the bottom
  useEffect(() => {
    if (!isAtBottom) return;
    if (!messages.length) return;

    scrollToBottom("smooth");
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
    if (isOpen && token) {
      loadConversations();
      // When chat opens, consider user at bottom so first messages auto-scroll
      setIsAtBottom(true);
    }
  }, [isOpen, token]);

  const loadConversations = async () => {
    try {
      const response = await getUserConversations({
        limit: 20,
        isActive: true,
      });
      setConversations(response.data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      notify.error("Failed to load conversation history");
    }
  };

  const loadConversation = async (sessionId) => {
    try {
      setIsLoading(true);
      const response = await getConversation(sessionId);
      setCurrentConversation(response.data);
      setMessages(response.data.messages);
      setContext(response.data.context);
      if (window.matchMedia("(max-width: 600px)").matches) {
        setShowSidebar(false);
      }
      // After loading a conversation, jump directly to the latest message
      setIsAtBottom(true);
      // Use next tick to ensure DOM has rendered before scrolling
      requestAnimationFrame(() => scrollToBottom("auto"));
    } catch (error) {
      console.error("Failed to load conversation:", error);
      notify.error("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = async () => {
    try {
      const response = await createConversation({
        context,
        title: "New Conversation",
      });
      setCurrentConversation(response.data);
      setMessages([]);
      setConversations([response.data, ...conversations]);
      setMessageError("");
      if (window.matchMedia("(max-width: 600px)").matches) {
        setShowSidebar(false);
      }
      notify.success("New conversation started");
    } catch (error) {
      console.error("Failed to create conversation:", error);
      notify.error(
        error.response?.data?.message || "Failed to start new conversation",
      );
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    const localId = `${Date.now()}-${Math.random()}`;
    setInputMessage("");
    setMessageError("");

    // Add user message to UI immediately
    const tempUserMessage = {
      localId,
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

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
      setUsage(response.data.usage || null);

      // Add AI response to messages
      const aiMessage = {
        role: "assistant",
        content: response.data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Update conversation in list
      loadConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorData = error.response?.data;
      if (errorData?.usage) setUsage(errorData.usage);
      setMessageError(
        errorData?.message || "We couldn't send that. Please try again.",
      );
      setMessages((prev) =>
        prev.filter((message) => message.localId !== localId),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await deleteConversation(sessionId);
      setConversations(conversations.filter((c) => c.sessionId !== sessionId));
      if (currentConversation?.sessionId === sessionId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      notify.success("Conversation deleted");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      notify.error("Failed to delete conversation");
    }
  };

  const handleClearMessages = async () => {
    if (!currentConversation || !confirm("Clear all messages?")) return;

    try {
      await clearMessages(currentConversation.sessionId);
      setMessages([]);
      notify.success("Messages cleared");
    } catch (error) {
      console.error("Failed to clear messages:", error);
      notify.error("Failed to clear messages");
    }
  };

  const handleContextChange = async (event) => {
    const nextContext = event.target.value;
    const previousContext = context;
    setContext(nextContext);

    if (!currentConversation || currentConversation.context === nextContext) {
      return;
    }

    try {
      const response = await updateConversation(currentConversation.sessionId, {
        context: nextContext,
      });
      setCurrentConversation(response.data);
    } catch (error) {
      console.error("Failed to update coaching mode:", error);
      setContext(previousContext);
      notify.error(
        error.response?.data?.message || "Couldn't update coaching mode",
      );
    }
  };

  const contextOptions = [
    { value: "general", label: "General help" },
    { value: "interview-prep", label: "Interview practice" },
    { value: "technical-help", label: "Technical questions" },
    { value: "career-advice", label: "Career advice" },
  ];

  const starterPrompts = [
    "Help me prepare for an interview",
    "Improve my answer to “Tell me about yourself”",
    "Explain a technical concept",
  ];

  const handleCopyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      notify.success("Response copied");
    } catch (error) {
      console.error("Failed to copy chatbot response:", error);
      notify.error("Couldn't copy the response");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="chatbot-toggle-btn"
        aria-label="Open AI Assistant"
      >
        <Sparkles size={21} />
        <span>Ask Invyo AI</span>
      </button>
    );
  }

  return (
    <section
      className={`chatbot-container ${isMinimized ? "minimized" : ""}`}
      aria-label="Intervyo AI assistant"
    >
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          {token && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="chatbot-icon-btn"
              aria-label={
                showSidebar ? "Hide chat history" : "Show chat history"
              }
              title={showSidebar ? "Hide history" : "Show history"}
            >
              {showSidebar ? (
                <PanelLeftClose size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>
          )}
          <div className="chatbot-brand">
            <BrandLogo className="chatbot-brand-logo" />
            <div className="chatbot-header-info">
              <h3>AI coach</h3>
              <span className="chatbot-status">
                <span className="chatbot-status-dot" />
                {token ? "Ready when you are" : "Personal interview coaching"}
              </span>
            </div>
          </div>
        </div>
        <div className="chatbot-header-right">
          {currentConversation && messages.length > 0 && (
            <button
              onClick={handleClearMessages}
              className="chatbot-icon-btn"
              aria-label="Clear this chat"
              title="Clear this chat"
            >
              <Trash2 size={17} />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="chatbot-icon-btn"
            aria-label={isMinimized ? "Restore chat" : "Minimize chat"}
            title={isMinimized ? "Restore" : "Minimize"}
          >
            <Minimize2 size={20} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="chatbot-icon-btn"
            aria-label="Close"
            title="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="chatbot-body">
        {token && showSidebar && (
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

            <div className="chatbot-context-selector">
              <label htmlFor="chatbot-context">YOUR COACHING MODE</label>
              <select
                id="chatbot-context"
                value={context}
                onChange={handleContextChange}
                className="chatbot-select"
              >
                {contextOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="chatbot-conversations">
              <p className="chatbot-section-label">RECENT CHATS</p>
              {conversations.length === 0 && (
                <p className="chatbot-history-empty">
                  Your conversations will show up here.
                </p>
              )}
              {conversations.map((conv) => (
                <div
                  key={conv.sessionId}
                  className={`chatbot-conversation-item ${
                    currentConversation?.sessionId === conv.sessionId
                      ? "active"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="conversation-content"
                    onClick={() => loadConversation(conv.sessionId)}
                    aria-current={
                      currentConversation?.sessionId === conv.sessionId
                        ? "page"
                        : undefined
                    }
                  >
                    <span className="conversation-title">{conv.title}</span>
                    <span className="conversation-time">
                      {new Date(conv.lastActivity).toLocaleDateString()}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.sessionId);
                    }}
                    className="conversation-delete"
                    aria-label="Delete conversation"
                    title="Delete conversation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="chatbot-messages-container">
          <div
            className="chatbot-messages"
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div
                className={`chatbot-welcome ${
                  token ? "" : "chatbot-welcome-guest"
                }`}
              >
                <p className="chatbot-eyebrow">
                  {token ? "YOUR INTERVIEW PARTNER" : "INTERVIEW PREP, REIMAGINED"}
                </p>
                <h2>
                  {token
                    ? "Let’s get you ready."
                    : "Your next interview starts here."}
                </h2>
                <p className="chatbot-welcome-copy">
                  {token
                    ? "Practice answers, work through technical questions, or make your next career move with a little more confidence."
                    : "Get thoughtful, personalized coaching for interview practice, technical questions, and your next career move."}
                </p>
                {token ? (
                  <div className="chatbot-starter-prompts">
                    {starterPrompts.map((prompt) => (
                      <button
                        type="button"
                        key={prompt}
                        onClick={() => setInputMessage(prompt)}
                        className="chatbot-starter-prompt"
                      >
                        {prompt}
                        <Send size={14} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="chatbot-guest-actions">
                    <Link to="/login" className="chatbot-guest-primary">
                      Sign in to start chatting
                      <Send size={15} />
                    </Link>
                    <Link to="/register" className="chatbot-guest-secondary">
                      Create a free account
                    </Link>
                    <p>
                      Your chat history and coaching modes are saved to your
                      account.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id || msg.localId || `${msg.timestamp}-${index}`}
                  className={`chatbot-message ${msg.role}`}
                >
                  <div className="message-content">
                    <div className="message-author">
                      {msg.role === "user" ? "You" : "Intervyo AI"}
                    </div>
                    <div className="message-text">{msg.content}</div>
                    <div className="message-meta">
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {msg.role === "assistant" && (
                        <button
                          type="button"
                          className="message-copy-btn"
                          onClick={() => handleCopyMessage(msg.content)}
                          aria-label="Copy response"
                          title="Copy response"
                        >
                          <Copy size={13} />
                          <span>Copy</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="chatbot-message assistant">
                <div className="message-content">
                  <div className="message-loading">
                    <LoadingMark size={10} />
                    <span>Putting together a thoughtful answer…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {token ? (
            <form onSubmit={handleSendMessage} className="chatbot-input-form">
            {usage && (
              <div className="chatbot-usage" aria-live="polite">
                <span>
                  {usage.hourlyCount} / {usage.hourlyLimit} messages this hour
                </span>
                <span className="chatbot-usage-divider">·</span>
                <span>{usage.dailyCount} / {usage.dailyLimit} today</span>
              </div>
            )}
            {messageError && (
              <p className="chatbot-error" role="alert">
                {messageError}
              </p>
            )}
            <div className="chatbot-composer">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                maxLength={5000}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything about your next interview…"
                className="chatbot-input"
                disabled={isLoading}
                aria-label="Message Intervyo AI"
              />
              <button
                type="submit"
                className="chatbot-send-btn"
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message (Enter)"
                title="Send message"
              >
                {isLoading ? (
                  <LoadingMark size={10} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="chatbot-disclaimer">
              AI can make mistakes. Don’t share sensitive personal information.
            </p>
            </form>
          ) : (
            <div className="chatbot-input-form chatbot-guest-footer">
              <p>
                Sign in to unlock your personal AI coach, saved conversations,
                and tailored practice.
              </p>
              <Link to="/login" className="chatbot-guest-footer-link">
                Continue to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIChatbot;
