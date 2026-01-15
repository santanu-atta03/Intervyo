import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Code,
  Send,
  MessageSquare,
  Clock,
  Brain,
  Zap,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Download,
  Type,
} from "lucide-react";

const REACT_APP_BASE_URL = "https://intervyo.onrender.com";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { interviewId } = useParams();

  // WebSocket
  const socketRef = useRef(null);
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  // Emotion & Confidence
  const [emotionData, setEmotionData] = useState(null);
  const [confidenceData, setConfidenceData] = useState(null);
  const [emotionMetrics, setEmotionMetrics] = useState(null);
  const [showEmotionPanel, setShowEmotionPanel] = useState(true);

  // Redux state
  const { token } = useSelector((state) => state.auth);

  // Core States
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isListening, setIsListening] = useState(false); // For speech recognition listening state

  // Interview States
  const [interviewStatus, setInterviewStatus] = useState("waiting"); // waiting, ready, active, paused, completed
  const [config, setConfig] = useState({
    role: "Full Stack Developer",
    difficulty: "medium",
    duration: 1800, // 30 minutes in seconds
    targetCompany: "Google",
    totalQuestions: 15,
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.duration);
  const [isPaused, setIsPaused] = useState(false);

  // AI States
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [userTranscript, setUserTranscript] = useState("");

  // Performance Tracking
  const [performance, setPerformance] = useState({
    questionsAnswered: 0,
    averageScore: 0,
    strengths: [],
    improvements: [],
    currentStreak: 0,
  });

  // Code Editor
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [testResults, setTestResults] = useState(null);

  // Chat/Conversation
  const [conversation, setConversation] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    responseTime: 0,
    wordsSpoken: 0,
    questionsSkipped: 0,
    hintsUsed: 0,
  });

  // Audio/Visual Feedback States
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);
  const [speechBars, setSpeechBars] = useState([0, 0, 0, 0, 0]);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Initialize WebSocket
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const socket = io(REACT_APP_BASE_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      auth: {
        token: token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
      socket.emit("join-interview", {
        interviewId: interviewId,
      });
      addNotification("Connected to interview server", "success");
    });

    socket.on("interview-ready", (data) => {
      setInterviewStatus("ready");
      addNotification(
        "Interview room ready! Click Start when you're prepared.",
        "success",
      );
    });

    socket.on("ai-message", (data) => {
      handleAIMessage(data);
    });

    socket.on("ai-status", (data) => {
      if (data.status === "processing") {
        setIsAIThinking(true);
      }
    });

    socket.on("interview-ended", () => {
      navigate(`/results/${interviewId}`);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      addNotification("Connection lost. Reconnecting...", "error");
    });

    socket.on("error", (error) => {
      addNotification(`Error: ${error.message}`, "error");
    });

    return () => {
      socket.disconnect();
    };
  }, [interviewId, token, navigate]);

  // Timer
  useEffect(() => {
    if (interviewStatus === "active" && !isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [interviewStatus, isPaused, timeRemaining]);

  // Emotion detection when interview is active
  useEffect(() => {
    if (interviewStatus === "active" && webcamRef.current && isVideoEnabled) {
      emotionDetector
        .loadModels()
        .catch((err) => console.error("Emotion model error:", err));
      emotionDetector.startDetection(
        webcamRef.current?.video || webcamRef.current,
        async (emotion) => {
          if (!emotion) return;
          setEmotionData(emotion);

          // Periodically send a subset to backend to reduce load
          if (Math.random() < 0.1 && token) {
            try {
              await apiConnector(
                "POST",
                `${REACT_APP_BASE_URL}/api/interviews/${interviewId}/emotion-metrics`,
                {
                  emotions: emotion.emotions,
                  confidenceScore: emotion.confidence,
                  timestamp: emotion.timestamp,
                },
                { Authorization: `Bearer ${token}` },
              );
            } catch (error) {
              console.error("Failed to store emotion:", error);
            }
          }
        },
        1000,
      );
    }

    return () => {
      emotionDetector.stopDetection();
    };
  }, [interviewStatus, isVideoEnabled, interviewId, token]);

  // Analyze user transcript for confidence
  useEffect(() => {
    if (userTranscript && userTranscript.length > 5) {
      const analysis = speechAnalyzer.analyzeTranscript(userTranscript);
      if (analysis) {
        setConfidenceData(analysis);
        speechAnalyzer.addSegment(analysis);
      }
    }
  }, [userTranscript]);
  // Simulate audio level animation for speech feedback
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setSpeechBars((prev) => prev.map(() => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  // Handle AI Message
  const handleAIMessage = (data) => {
    setIsAIThinking(false);
    setAiMessage(data.message);

    addToConversation({
      role: "assistant",
      content: data.message,
      timestamp: new Date(),
      type: data.type || "message",
    });

    if (data.type === "question") {
      setCurrentQuestion({
        text: data.message,
        type: data.questionType || "technical",
        index: data.questionIndex,
        requiresCode: data.requiresCode || false,
      });
      setQuestionIndex(data.questionIndex || questionIndex);
    }

    // Play audio if available
    if (data.hasAudio && data.audioBase64 && isAudioEnabled) {
      playAudio(data.audioBase64);
    } else if (isAudioEnabled) {
      speakText(data.message);
    }
  };

  // Speech Synthesis
  const speakText = (text) => {
    if ("speechSynthesis" in window && isAudioEnabled) {
      window.speechSynthesis.cancel();
      setIsAISpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => setIsAISpeaking(false);
      utterance.onerror = () => setIsAISpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsAISpeaking(false);
    }
  };

  // Play Audio
  const playAudio = (base64Audio) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    setIsAISpeaking(true);
    audio.play();
    audio.onended = () => setIsAISpeaking(false);
    audio.onerror = () => setIsAISpeaking(false);
  };

  // Add to Conversation
  const addToConversation = (message) => {
    setConversation((prev) => [...prev.slice(-50), message]); // Keep last 50 messages
  };

  // Add Notification
  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // Start Interview
  const handleStartInterview = () => {
    setInterviewStatus("active");
    socketRef.current?.emit("start-interview", {
      interviewId: interviewId,
    });
    addNotification("Interview started! Good luck! 🚀", "success");

    // Start listening for speech
    setIsListening(true);
  };

  // Toggle Microphone
  const toggleMicrophone = () => {
    setIsMicEnabled(!isMicEnabled);
    setIsListening(!isMicEnabled);

    if (!isMicEnabled) {
      // Simulate starting speech recognition
      addNotification(
        "Speech recognition activated. Start speaking...",
        "success",
      );
      setIsProcessingSpeech(true);

      // Simulate speech processing
      setTimeout(() => {
        setIsProcessingSpeech(false);
        const mockTranscript =
          "I think the solution involves using a hash map for constant time lookups...";
        setUserTranscript(mockTranscript);
      }, 2000);
    } else {
      addNotification("Speech recognition disabled", "info");
      setUserTranscript("");
    }
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!userTranscript.trim()) {
      addNotification("Please type or speak your answer first", "error");
      return;
    }

    addToConversation({
      role: "user",
      content: userTranscript,
      timestamp: new Date(),
      type: "answer",
    });

    socketRef.current?.emit("submit-answer", {
      interviewId: interviewId,
      questionId: currentQuestion?.questionId || `q-${questionIndex}`,
      answer: userTranscript,
      questionIndex: questionIndex,
    });

    setStats((prev) => ({
      ...prev,
      wordsSpoken: prev.wordsSpoken + userTranscript.split(" ").length,
      responseTime: Math.floor(Math.random() * 30) + 10, // Mock response time
    }));

    setUserTranscript("");
    setIsAIThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const mockAIResponse =
        "That's an interesting approach. Can you elaborate more on the time complexity of your solution?";
      handleAIMessage({
        message: mockAIResponse,
        type: "followup",
        questionIndex: questionIndex,
      });
    }, 3000);
  };

  // Submit Code
  const handleSubmitCode = () => {
    if (!code.trim()) {
      addNotification("Please write some code first", "error");
      return;
    }

    socketRef.current?.emit("submit-code", {
      interviewId: interviewId,
      questionId: currentQuestion?.questionId || `q-${questionIndex}`,
      code: code,
      language: language,
    });

    addNotification("Code submitted for review", "success");
    setIsAIThinking(true);

    // Simulate code evaluation
    setTimeout(() => {
      const mockEvaluation = {
        score: Math.floor(Math.random() * 40) + 60,
        feedback:
          "Your code works for basic cases but needs optimization for edge cases.",
        passedTests: Math.floor(Math.random() * 5) + 1,
        totalTests: 7,
      };

      setTestResults(mockEvaluation);
      setIsAIThinking(false);

      addNotification(
        `Code evaluated! Score: ${mockEvaluation.score}%`,
        "success",
      );
    }, 4000);
  };

  // End Interview
  const handleEndInterview = async () => {
    if (!confirm("Are you sure you want to end the interview?")) return;

    // Stop analysis
    try {
      emotionDetector.stopDetection();
      speechAnalyzer.reset();

      // Request server to generate feedback and store results
      if (token) {
        await apiConnector(
          "POST",
          `${REACT_APP_BASE_URL}/api/interviews/${interviewId}/emotion-feedback`,
          {},
          { Authorization: `Bearer ${token}` },
        );
      }
    } catch (err) {
      console.error("Error finishing analytics:", err);
    }

    socketRef.current?.emit("end-interview", {
      sessionId: "session-123",
      interviewId,
    });
  };

  // Format Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get time color
  const getTimeColor = () => {
    const percentRemaining = (timeRemaining / config.duration) * 100;
    if (percentRemaining > 50) return "text-green-400";
    if (percentRemaining > 20) return "text-yellow-400";
    return "text-red-400";
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Speech-to-Text Audio Visualizer Component
  const AudioVisualizer = () => {
    if (!isListening && !isProcessingSpeech) return null;

    return (
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/50 shadow-2xl shadow-purple-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6 text-white animate-pulse" />
              </div>
              {isListening && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-black">
                  <div className="w-full h-full rounded-full bg-red-400 animate-ping"></div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isProcessingSpeech ? "Processing Speech..." : "Listening..."}
              </h3>
              <p className="text-white/70 text-sm">
                {isProcessingSpeech
                  ? "Analyzing your speech..."
                  : "Speak clearly into your microphone"}
              </p>
            </div>
          </div>

          {/* Waveform Visualizer */}
          <div className="mb-4">
            <div className="flex items-end justify-center gap-1 h-16">
              {speechBars.map((height, index) => (
                <div
                  key={index}
                  className="w-3 bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg transition-all duration-150"
                  style={{ height: `${(isListening ? height : 10) + 20}%` }}
                />
              ))}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
              ></div>
              <span className="text-xs text-white/70">Mic Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isProcessingSpeech ? "bg-yellow-500 animate-pulse" : "bg-gray-500"}`}
              ></div>
              <span className="text-xs text-white/70">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-xs text-white/70">Real-time</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/50">
              Speak naturally. The AI will process your response when you pause.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left - Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="text-white/80 font-semibold">
                {isConnected ? "Live" : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-bold">
                {config.role}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-bold uppercase">
                {config.difficulty}
              </span>
            </div>
          </div>

          {/* Center - Timer */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-2 bg-black/40 backdrop-blur-xl rounded-xl border border-white/20">
              <Clock className={`w-5 h-5 ${getTimeColor()}`} />
              <span
                className={`text-2xl font-mono font-bold ${getTimeColor()}`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <span className="text-sm">Question</span>
              <span className="text-xl font-bold text-white">
                {questionIndex + 1}
              </span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">{config.totalQuestions}</span>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              disabled={interviewStatus !== "active"}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-white" />
              ) : (
                <Pause className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={handleEndInterview}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-sm text-white transition-all"
            >
              End Interview
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Sidebar - Performance Stats */}
        <div className="w-80 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Live Performance
          </h3>

          <div className="space-y-4">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Overall Score</span>
                <Award className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {performance.averageScore}%
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${performance.averageScore}%` }}
                ></div>
              </div>
            </div>

            {/* Questions Progress */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-sm">Questions</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {performance.questionsAnswered} / {config.totalQuestions}
              </div>
              <div className="text-xs text-white/40">
                {config.totalQuestions - performance.questionsAnswered}{" "}
                remaining
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Response Time</div>
                <div className="text-xl font-bold text-white">
                  {stats.responseTime}s
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Words Spoken</div>
                <div className="text-xl font-bold text-white">
                  {stats.wordsSpoken}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Current Streak</div>
                <div className="text-xl font-bold text-orange-400">
                  {performance.currentStreak} 🔥
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-white/60 text-xs mb-1">Hints Used</div>
                <div className="text-xl font-bold text-white">
                  {stats.hintsUsed}
                </div>
              </div>
            </div>

            {/* Strengths */}
            {performance.strengths.length > 0 && (
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 font-bold text-sm">
                    Strengths
                  </span>
                </div>
                <div className="space-y-2">
                  {performance.strengths.map((strength, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-green-200 flex items-start gap-2"
                    >
                      <span className="text-green-400">✓</span>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {performance.improvements.length > 0 && (
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 font-bold text-sm">
                    Areas to Improve
                  </span>
                </div>
                <div className="space-y-2">
                  {performance.improvements.map((improvement, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-yellow-200 flex items-start gap-2"
                    >
                      <span className="text-yellow-400">→</span>
                      <span>{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center - Video/Code Editor */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Audio Visualizer Component */}
          <AudioVisualizer />

          {/* Video Section */}
          <div className="flex-1 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden relative">
            {/* Candidate Video */}
            <div className="w-full h-full bg-gray-900 relative">
              {isVideoEnabled ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-6xl">👤</span>
                    </div>
                    <p className="text-white/60">Camera View</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Camera Off</p>
                  </div>
                </div>
              )}

              {/* AI Avatar */}
              <div className="absolute bottom-6 right-6 w-64 h-48 rounded-xl overflow-hidden border-2 border-purple-500/50 bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div
                    className={`text-7xl transition-transform duration-300 ${isAISpeaking ? "scale-110" : "scale-100"}`}
                  >
                    🤖
                  </div>

                  {isAISpeaking && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-wave"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            height: "20px",
                          }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {isListening && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-bold">
                        Listening
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Question Display */}
              {currentQuestion && (
                <div className="absolute top-6 left-6 right-80 bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-purple-300 font-bold uppercase">
                          {currentQuestion.type}
                        </span>
                        <span className="text-xs text-white/40">•</span>
                        <span className="text-xs text-white/60">
                          Question #{questionIndex + 1}
                        </span>
                      </div>
                      <p className="text-white text-lg leading-relaxed">
                        {currentQuestion.text}
                      </p>

                      {isAISpeaking && (
                        <div className="flex items-center gap-2 mt-3 text-purple-300 text-sm">
                          <Volume2 className="w-4 h-4 animate-pulse" />
                          <span>AI is speaking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Thinking Indicator */}
              {isAIThinking && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-purple-600 backdrop-blur-xl px-6 py-3 rounded-full border border-purple-400 flex items-center gap-3 shadow-2xl">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-white font-semibold">
                    AI is analyzing your response...
                  </span>
                </div>
              )}

              {/* Transcription Display */}
              {isListening && userTranscript && (
                <div className="absolute bottom-64 left-6 right-80 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <Mic className="w-5 h-5 text-red-500 mt-1 animate-pulse" />
                    <div className="flex-1">
                      <div className="text-xs text-white/60 mb-1">
                        You're saying:
                      </div>
                      <p className="text-white">{userTranscript}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <button
                  onClick={toggleMicrophone}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isMicEnabled
                      ? "bg-red-600 hover:bg-red-700 shadow-red-500/50"
                      : "bg-white/10 hover:bg-white/20 backdrop-blur-xl"
                  }`}
                >
                  {isMicEnabled ? (
                    <Mic className="w-6 h-6 text-white animate-pulse" />
                  ) : (
                    <MicOff className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isVideoEnabled
                      ? "bg-white/10 hover:bg-white/20 backdrop-blur-xl"
                      : "bg-red-600 hover:bg-red-700 shadow-red-500/50"
                  }`}
                >
                  {isVideoEnabled ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <VideoOff className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (isAISpeaking) {
                      stopSpeaking();
                    } else {
                      setIsAudioEnabled(!isAudioEnabled);
                    }
                  }}
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center transition-all shadow-lg"
                >
                  {isAudioEnabled ? (
                    <Volume2 className="w-6 h-6 text-white" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-white" />
                  )}
                </button>

                {currentQuestion?.requiresCode && (
                  <button
                    onClick={() => setShowCodeEditor(!showCodeEditor)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center gap-2 font-semibold text-white shadow-lg transition-all"
                  >
                    <Code className="w-5 h-5" />
                    <span>{showCodeEditor ? "Close" : "Open"} Code Editor</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor (if enabled) */}
          {showCodeEditor && (
            <div className="h-96 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-black/40 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm border border-white/20"
                >
                  <option value="python">🐍 Python</option>
                  <option value="javascript">📜 JavaScript</option>
                  <option value="java">☕ Java</option>
                  <option value="cpp">⚡ C++</option>
                  <option value="csharp">🔷 C#</option>
                </select>
                <button
                  onClick={handleSubmitCode}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-sm text-white flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Submit Code
                </button>
              </div>
              <Editor
                height="calc(100% - 60px)"
                language={language}
                value={code}
                onChange={setCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar - Chat/Transcript */}
        <div className="w-96 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Conversation
              </h3>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                {showTranscript ? "Hide" : "Show"} Details
              </button>
            </div>
          </div>

          {/* Emotion & Confidence Analysis Panel */}
          <div className="p-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Live Analysis
                </h3>
                <button
                  onClick={() => setShowEmotionPanel((prev) => !prev)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {showEmotionPanel ? "Hide" : "Show"}
                </button>
              </div>

              {showEmotionPanel && (
                <EmotionDisplay
                  emotionData={emotionData}
                  confidenceData={confidenceData}
                />
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">
                  Conversation will appear here
                </p>
              </div>
            ) : (
              conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-blue-500"
                        : "bg-gradient-to-r from-purple-600 to-pink-600"
                    }`}
                  >
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div
                    className={`flex-1 ${msg.role === "user" ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block px-4 py-3 rounded-xl ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white border border-white/20"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    {showTranscript && (
                      <div className="text-xs text-white/40 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={userTranscript}
                onChange={(e) => setUserTranscript(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
                placeholder="Type your answer or use voice..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:outline-none transition-all"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!userTranscript.trim()}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-white/40">
              <span>Press Enter to send</span>
              <span>{userTranscript.length} characters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Waiting Screen */}
      {interviewStatus === "waiting" && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Preparing Interview Room
            </h2>
            <p className="text-white/60 mb-6">
              Setting up AI interviewer and environment...
            </p>
            <div className="flex items-center gap-2 justify-center">
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Ready Screen */}
      {interviewStatus === "ready" && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-auto text-center px-6">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🎯</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Begin?
              </h2>
              <p className="text-white/60 text-lg mb-8">
                Your interview session is ready. When you click start, the timer
                will begin and AI will ask you questions.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Interview Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Role</div>
                  <div className="text-white font-bold">{config.role}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Difficulty</div>
                  <div className="text-white font-bold uppercase">
                    {config.difficulty}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Duration</div>
                  <div className="text-white font-bold">
                    {config.duration / 60} minutes
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Questions</div>
                  <div className="text-white font-bold">
                    {config.totalQuestions} questions
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-left bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-200 text-sm">
                  Microphone and camera ready
                </span>
              </div>
              <div className="flex items-center gap-3 text-left bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-blue-200 text-sm">
                  AI interviewer connected
                </span>
              </div>
              <div className="flex items-center gap-3 text-left bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-purple-200 text-sm">
                  Code editor available for the technical questions
                </span>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 rounded-xl font-bold text-xl text-white transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <Play className="w-6 h-6" />
                Start Interview
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-6 py-4 rounded-lg shadow-2xl backdrop-blur-xl border animate-slide-in-right ${
              notif.type === "success"
                ? "bg-green-500/90 border-green-400"
                : notif.type === "error"
                  ? "bg-red-500/90 border-red-400"
                  : "bg-blue-500/90 border-blue-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {notif.type === "success" && (
                <CheckCircle className="w-5 h-5 text-white" />
              )}
              {notif.type === "error" && (
                <XCircle className="w-5 h-5 text-white" />
              )}
              {notif.type === "info" && (
                <AlertCircle className="w-5 h-5 text-white" />
              )}
              <span className="text-white font-semibold">{notif.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        .animate-wave {
          animation: wave 0.6s ease-in-out infinite;
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        @keyframes pulse-wave {
          0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .animate-pulse-wave {
          animation: pulse-wave 0.8s ease-in-out infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}
