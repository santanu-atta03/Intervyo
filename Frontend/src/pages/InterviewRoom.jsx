import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { apiConnector } from "../services/apiconnector";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Mic, MicOff, Video, VideoOff, Volume2, VolumeX,
  Code, Send, MessageSquare, Clock, Brain, Zap,
  TrendingUp, Award, Target, BookOpen, ChevronRight,
  AlertCircle, CheckCircle, XCircle, Loader2, Play,
  Pause, Maximize2, Minimize2, Download, Type,
  RotateCcw // Added Retry Icon
} from 'lucide-react';

const REACT_APP_BASE_URL = 'https://intervyo.onrender.com';

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  // Redux state
  const { token } = useSelector((state) => state.auth);

  // Speech recognition (From Fix Branch - Essential for real input)
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // --- Core States ---
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isListening, setIsListening] = useState(false); 
  
  // --- Interview States ---
  const [interviewStatus, setInterviewStatus] = useState('waiting');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [showQuestion, setShowQuestion] = useState(false);

  // --- AI & Processing States ---
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  // --- ERROR HANDLING & RETRY STATES (NEW) ---
  const [hasError, setHasError] = useState(false);
  const [lastSpokenAnswer, setLastSpokenAnswer] = useState('');

  // --- Emotion & Stats (From Main Branch) ---
  const [emotionData, setEmotionData] = useState(null);
  const [confidenceData, setConfidenceData] = useState(null);
  const [stats, setStats] = useState({
    responseTime: 0,
    wordsSpoken: 0,
    questionsSkipped: 0,
    hintsUsed: 0
  });
  const [speechBars, setSpeechBars] = useState([0, 0, 0, 0, 0]);
  const [notifications, setNotifications] = useState([]);

  // --- Code Editor States ---
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [testResults, setTestResults] = useState(null);

  // Initialize WebSocket (From Main Branch - Kept for Presence/Emotion)
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const socket = io(REACT_APP_BASE_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      auth: { token: token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
      socket.emit('join-interview', { interviewId: interviewId });
      addNotification('Connected to interview server', 'success');
    });

    socket.on('interview-ready', (data) => {
      setInterviewStatus('ready');
      addNotification('Interview room ready! Click Start when you\'re prepared.', 'success');
    });

    socket.on('error', (error) => {
      addNotification(`Error: ${error.message}`, 'error');
    });

    return () => {
      socket.disconnect();
    };
  }, [interviewId, token, navigate]);

  // Initialize Interview Logic (Check Speech Support)
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition");
    }
  }, [browserSupportsSpeechRecognition]);

  // Start Interview Session (REST API approach from Fix Branch for stability)
  const startInterviewSession = async () => {
    try {
      setInterviewStatus('active');
      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/start-conversation`,
        {},
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const data = response.data.data;
        
        setAiMessage(data.aiMessage);
        setTotalQuestions(data.totalQuestions || 15);
        setCurrentQuestionIndex(0);
        setInterviewStarted(true);

        // Notify Socket of start
        socketRef.current?.emit('start-interview', { interviewId });

        // AI speaks greeting
        speakText(data.aiMessage, () => {
          toast.success("Say 'I'm ready' when you want to start!");
          setIsMicEnabled(true);
          setIsListening(true);
          SpeechRecognition.startListening({ continuous: true });
        });
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast.error('Failed to start interview');
    }
  };

  // --- AUDIO & SPEECH LOGIC ---

  // Text-to-Speech
  const speakText = (text, onEndCallback) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAISpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsAISpeaking(false);
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => setIsAISpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAISpeaking(false);
    }
  };

  // Toggle Microphone (Modified to use real SpeechRecognition)
  const toggleMicrophone = () => {
    if (isMicEnabled) {
      SpeechRecognition.stopListening();
      setIsMicEnabled(false);
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsMicEnabled(true);
      setIsListening(true);
      setHasError(false); // Reset error on manual toggle
    }
  };

  // Detect Silence & Process Answer (From Fix Branch logic)
  useEffect(() => {
    if (transcript && isMicEnabled && !isProcessingAnswer && !hasError) {
      const silenceTimer = setTimeout(() => {
        const lowerTranscript = transcript.toLowerCase().trim();
        
        // Check "Ready" command
        if (!currentQuestion && (
          lowerTranscript.includes("ready") || 
          lowerTranscript.includes("yes") || 
          lowerTranscript.includes("start")
        )) {
          handleUserReady();
          resetTranscript();
          return;
        }

        // Process actual answer
        const wordCount = transcript.trim().split(/\s+/).length;
        if (wordCount >= 3 && currentQuestion) {
          setLastSpokenAnswer(transcript); 
          handleUserAnswer(transcript);
          resetTranscript();
        }
      }, 2500); // 2.5s silence

      return () => clearTimeout(silenceTimer);
    }
  }, [transcript, isMicEnabled, isProcessingAnswer, currentQuestion, hasError, resetTranscript]);

  // --- CORE INTERACTION HANDLERS (With Error Handling) ---

  const handleUserReady = async () => {
    try {
      setIsProcessingAnswer(true);
      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/ask-next-question`,
        {},
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const data = response.data.data;
        updateQuestionState(data);
        speakText(data.aiMessage, () => {
          setIsProcessingAnswer(false);
        });
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setIsProcessingAnswer(false);
    }
  };

  const handleUserAnswer = async (spokenAnswer) => {
    if (isProcessingAnswer || !currentQuestion) return;

    setHasError(false);
    setIsProcessingAnswer(true);
    setIsAIThinking(true);
    
    SpeechRecognition.stopListening();
    setIsMicEnabled(false);
    setIsListening(false);

    try {
      const newConversation = [...conversationHistory, { role: 'user', content: spokenAnswer }];
      setConversationHistory(newConversation);

      // Call Backend
      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/evaluate-answer`,
        {
          sessionId: currentQuestion.sessionId,
          question: currentQuestion.question,
          answer: spokenAnswer,
          questionNumber: currentQuestionIndex + 1,
          category: currentQuestion.type || 'general'
        },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const aiReply = response.data.data.evaluation.review;
        const evaluation = response.data.data.evaluation;

        setAiMessage(aiReply);
        setIsAIThinking(false);

        speakText(aiReply, () => {
          setIsProcessingAnswer(false);
          setTimeout(() => moveToNextQuestion(evaluation), 2000);
        });
      }

    } catch (error) {
      console.error('Error processing answer:', error);
      setIsAIThinking(false);
      setIsProcessingAnswer(false);
      setHasError(true); // Enable Retry Mode

      if (error.response?.status === 504 || error.response?.data?.error === 'AI_TIMEOUT') {
        toast.error("AI response timed out.", { icon: '⏳' });
      } else {
        toast.error("Failed to process answer. Please retry.");
      }
    }
  };

  // Retry Function
  const handleRetry = () => {
    if (!lastSpokenAnswer) {
        toast.error("No answer to retry. Please speak again.");
        toggleMicrophone();
        setHasError(false);
        return;
    }
    toast.loading("Retrying previous answer...");
    handleUserAnswer(lastSpokenAnswer);
  };

  // Submit Code (With Error Handling)
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsAIThinking(true);
    setHasError(false);

    try {
      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/evaluate-answer`,
        {
          sessionId: currentQuestion.sessionId,
          question: currentQuestion.question,
          answer: `Here is my code solution: ${code}`,
          codeSubmitted: code,
          category: 'coding'
        },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const evaluation = response.data.data.evaluation;
        speakText(evaluation.review, () => {
          setIsAIThinking(false);
          setTimeout(() => {
             moveToNextQuestion(evaluation);
             setShowCodeEditor(false);
          }, 1500);
        });
      }
    } catch (error) {
      console.error('Code evaluation error:', error);
      toast.error('Failed to evaluate code');
      setIsAIThinking(false);
      setHasError(true);
      setLastSpokenAnswer(`Here is my code solution: ${code}`); 
    }
  };

  const moveToNextQuestion = async (previousEvaluation) => {
    try {
      if (currentQuestionIndex + 1 >= totalQuestions) {
        handleCompleteInterview();
        return;
      }

      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/ask-next-question`,
        { sessionId: currentQuestion.sessionId || interviewId },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const data = response.data.data;
        updateQuestionState(data);
        
        speakText(data.aiMessage, () => {
             setIsMicEnabled(true);
             setIsListening(true);
             SpeechRecognition.startListening({ continuous: true });
        });
      }
    } catch (error) {
      console.error('Error moving to next question:', error);
      toast.error('Failed to move to next question');
    }
  };

  const updateQuestionState = (data) => {
      setAiMessage(data.aiMessage);
      setCurrentQuestionIndex(prev => prev + 1);
      if (data.question) {
        setCurrentQuestion({ 
            ...data.question,
            sessionId: data.sessionId 
        });
        setShowQuestion(true);
      } else {
        setShowQuestion(false);
      }
  };

  const handleCompleteInterview = async () => {
    stopSpeaking();
    SpeechRecognition.stopListening();
    speakText("Thank you for completing the interview! Generating your feedback now.");

    try {
        await apiConnector(
            'POST',
            `${REACT_APP_BASE_URL}/api/interview/${interviewId}/complete`,
            { interviewId },
            { Authorization: `Bearer ${token}` }
        );
        setTimeout(() => navigate(`/interview-results/${interviewId}`), 3000);
    } catch (error) {
        console.error("Completion error", error);
        navigate(`/dashboard`);
    }
  };

  // --- Helper Functions ---
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer
  useEffect(() => {
    if (interviewStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [interviewStarted, timeRemaining]);

  // --- RENDER COMPONENTS ---

  const AudioVisualizer = () => {
    if (!isListening && !isProcessingAnswer) return null;
    return (
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/50 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isProcessingAnswer ? 'Thinking...' : 'Listening...'}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!token) return <Loader2 className="w-16 h-16 animate-spin" />;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ERROR BANNER (New) */}
      {hasError && (
        <div className="bg-red-900/80 border-b border-red-500 p-3 text-center animate-fade-in flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-200" />
            <span className="font-semibold text-red-100">
                Connection Timeout. AI did not respond.
            </span>
            <button 
                onClick={handleRetry}
                className="ml-4 px-3 py-1 bg-white text-red-900 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
            >
                Retry Last Answer
            </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm font-medium">Live Interview</span>
            {currentQuestion && (
              <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded text-orange-400 text-xs font-bold uppercase">
                {currentQuestion.type || 'INTERVIEW'}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative flex">
        {/* Left: Avatar/Webcam */}
        <div className="flex-1 bg-gray-900 relative p-6 flex flex-col items-center justify-center">
             {!interviewStarted ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Welcome</h2>
                    <button 
                        onClick={startInterviewSession}
                        className="px-8 py-3 bg-blue-600 rounded-full hover:bg-blue-700 font-bold"
                    >
                        Start Interview
                    </button>
                </div>
             ) : (
                <>
                    <AudioVisualizer />
                    {/* Placeholder for 3D Avatar or Video */}
                    <div className="w-full max-w-2xl aspect-video bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 relative overflow-hidden">
                         {isVideoEnabled && (
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                className="w-full h-full object-cover"
                            />
                         )}
                    </div>
                </>
             )}
        </div>

        {/* Right: Question/Code */}
        <div className={`w-1/3 bg-gray-800 border-l border-gray-700 p-6 flex flex-col ${showCodeEditor ? 'w-1/2' : ''}`}>
             {currentQuestion && (
                 <div className="mb-6">
                     <h3 className="text-lg font-bold text-blue-400 mb-2">Current Question</h3>
                     <p className="text-white text-lg leading-relaxed">{currentQuestion.question}</p>
                 </div>
             )}
             
             {showCodeEditor && (
                 <div className="flex-1 flex flex-col">
                     <Editor
                        height="400px"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        theme="vs-dark"
                     />
                     <button 
                        onClick={handleSubmitCode}
                        className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold flex items-center justify-center gap-2"
                     >
                        <Code className="w-5 h-5" /> Submit Code
                     </button>
                 </div>
             )}

             {/* Transcript Log (Optional) */}
             <div className="mt-auto p-4 bg-gray-900 rounded-lg max-h-40 overflow-y-auto">
                 <p className="text-gray-400 text-sm italic">
                    {transcript || "Listening..."}
                 </p>
             </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-gray-900 border-t border-gray-800 p-4 flex justify-center gap-4">
          {hasError ? (
               <button 
                onClick={handleRetry}
                className="p-4 bg-orange-600 rounded-full hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105"
               >
                 <RotateCcw className="w-6 h-6 text-white" />
               </button>
          ) : (
               <button 
                onClick={toggleMicrophone}
                className={`p-4 rounded-full transition-all transform hover:scale-105 ${isMicEnabled ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-gray-700 hover:bg-gray-600'}`}
               >
                 {isMicEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
               </button>
          )}

          <button 
            onClick={() => setShowCodeEditor(!showCodeEditor)}
            className="p-4 bg-gray-700 rounded-full hover:bg-gray-600"
          >
            <Code className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleCompleteInterview}
            className="px-6 py-2 bg-red-600/20 text-red-500 border border-red-600/50 rounded-lg hover:bg-red-600 hover:text-white transition-all ml-8"
          >
            End Interview
          </button>
      </div>
    </div>
  );
}