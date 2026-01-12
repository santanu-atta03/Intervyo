import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Editor from '@monaco-editor/react';
import { apiConnector } from "../services/apiconnector";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Code,
  Volume2,
  VolumeX,
  Check,
  Loader,
  RotateCcw, // Added for Retry icon
  AlertCircle // Added for Error icon
} from "lucide-react";

const REACT_APP_BASE_URL = 'http://localhost:5000';

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const webcamRef = useRef(null);

  // Redux state
  const { token } = useSelector((state) => state.auth);

  // Speech recognition
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Core states
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  // Error & Retry States (NEW)
  const [hasError, setHasError] = useState(false);
  const [lastSpokenAnswer, setLastSpokenAnswer] = useState('');

  // Interview data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 mins default

  // Conversation states
  const [aiMessage, setAiMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [transcriptionText, setTranscriptionText] = useState('');

  // Question states
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  // Code editor states
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  const programmingLanguages = [
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
  ];

  // Initialize interview on mount
  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition");
      return;
    }

    startInterviewSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start interview session
  const startInterviewSession = async () => {
    try {
      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/start-conversation`,
        {},
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const data = response.data.data;
        
        setAiMessage(data.aiMessage);
        setTotalQuestions(data.totalQuestions);
        setCurrentQuestionIndex(0);
        setInterviewStarted(true);

        // AI speaks greeting
        speakText(data.aiMessage, () => {
          // After greeting, wait for user to say "ready"
          toast.success("Say 'I'm ready' when you want to start!");
          setIsMicEnabled(true);
          SpeechRecognition.startListening({ continuous: true });
        });
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast.error('Failed to start interview');
      navigate('/dashboard');
    }
  };

  // Text-to-Speech
  const speakText = (text, onEndCallback) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      setIsAvatarSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      utterance.onend = () => {
        setIsAvatarSpeaking(false);
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        setIsAvatarSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAvatarSpeaking(false);
    }
  };

  // Update transcription in real-time
  useEffect(() => {
    if (transcript && isMicEnabled) {
      setTranscriptionText(transcript);
    }
  }, [transcript, isMicEnabled]);

  // Detect silence and process answer
  useEffect(() => {
    if (transcript && isMicEnabled && !isProcessingAnswer && !hasError) {
      const silenceTimer = setTimeout(() => {
        const lowerTranscript = transcript.toLowerCase().trim();
        
        // Check if user is ready to start (first interaction)
        if (!currentQuestion && (
          lowerTranscript.includes("ready") || 
          lowerTranscript.includes("yes") || 
          lowerTranscript.includes("start") ||
          lowerTranscript.includes("begin")
        )) {
          handleUserReady();
          resetTranscript();
          return;
        }

        // Process regular answer
        const wordCount = transcript.trim().split(/\s+/).length;
        if (wordCount >= 3 && currentQuestion) {
          // Save the transcript before resetting, so we can retry if needed
          setLastSpokenAnswer(transcript); 
          handleUserAnswer(transcript);
          resetTranscript();
        }
      }, 2500); // 2.5 seconds silence

      return () => clearTimeout(silenceTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isMicEnabled, isProcessingAnswer, currentQuestion, hasError]);

  // User says they're ready
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
          if (data.questionType === 'coding') {
            setTimeout(() => {
              const editorPrompt = "You can open the code editor whenever you're ready to write code.";
              speakText(editorPrompt);
            }, 1000);
          }
        });
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setIsProcessingAnswer(false);
      toast.error('Failed to get question');
    }
  };

  // --- CORE ANSWER HANDLING WITH TIMEOUT LOGIC ---
  const handleUserAnswer = async (spokenAnswer) => {
    if (isProcessingAnswer || !currentQuestion) return;

    // Reset error state on new attempt
    setHasError(false);
    setIsProcessingAnswer(true);
    setIsAIThinking(true);
    
    // Stop listening while processing
    SpeechRecognition.stopListening();
    setIsMicEnabled(false);

    try {
      const newConversation = [
        ...conversationHistory,
        { role: 'user', content: spokenAnswer }
      ];
      setConversationHistory(newConversation);

      // Call Backend
      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/evaluate-answer`, // Matches your backend controller
        {
          sessionId: currentQuestion.sessionId, // Ensure backend sends sessionId
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
        setConversationHistory([
          ...newConversation,
          { role: 'assistant', content: aiReply }
        ]);

        setIsAIThinking(false);

        // AI speaks response
        speakText(aiReply, () => {
          setIsProcessingAnswer(false);
          
          // Move to next question automatically
          setTimeout(() => {
            moveToNextQuestion(evaluation);
          }, 2000);
        });
      }

    } catch (error) {
      console.error('Error processing answer:', error);
      setIsAIThinking(false);
      setIsProcessingAnswer(false);
      setHasError(true); // Enable Retry Mode

      // Handle Timeout specifically
      if (error.response?.status === 504 || error.response?.data?.error === 'AI_TIMEOUT') {
        toast.error("AI response timed out.", { icon: '⏳' });
      } else {
        toast.error("Failed to process answer. Please retry.");
      }
    }
  };

  // --- RETRY FUNCTION ---
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

  // Move to next question
  const moveToNextQuestion = async (previousEvaluation) => {
    try {
      if (currentQuestionIndex + 1 >= totalQuestions) {
        handleCompleteInterview();
        return;
      }

      const response = await apiConnector(
        'POST',
        `${REACT_APP_BASE_URL}/api/interview/${interviewId}/ask-next-question`, // Or next-question
        { sessionId: currentQuestion.sessionId || interviewId }, // Adjust based on your backend ID needs
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const data = response.data.data;
        updateQuestionState(data);
        
        speakText(data.aiMessage, () => {
             // Restart listening
             setIsMicEnabled(true);
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
      setCurrentQuestionIndex(prev => prev + 1); // Or use data.index
      
      if (data.question) {
        setCurrentQuestion({ 
            ...data.question,
            sessionId: data.sessionId // Ensure we store session ID
        });
        setShowQuestion(true);
      } else {
        setShowQuestion(false);
      }
      setQuestionStartTime(Date.now());
  };

  // Handle code submission
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsAIThinking(true);
    setHasError(false);

    try {
      // Use the evaluate endpoint but with code
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
      setLastSpokenAnswer(`Here is my code solution: ${code}`); // For retry logic
    }
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (isMicEnabled) {
      SpeechRecognition.stopListening();
      setIsMicEnabled(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsMicEnabled(true);
      setHasError(false);
    }
  };

  // Complete interview
  const handleCompleteInterview = async () => {
    stopSpeaking();
    SpeechRecognition.stopListening();
    
    const farewell = "Thank you for completing the interview! Generating your feedback now.";
    speakText(farewell);

    try {
        await apiConnector(
            'POST',
            `${REACT_APP_BASE_URL}/api/interview/${interviewId}/complete`,
            { interviewId }, // Ensure ID is sent
            { Authorization: `Bearer ${token}` }
        );
        setTimeout(() => {
            navigate(`/interview-results/${interviewId}`);
        }, 3000);
    } catch (error) {
        console.error("Completion error", error);
        navigate(`/dashboard`);
    }
  };

  // Timer countdown
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewStarted, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Starting Interview...
          </h2>
          <p className="text-gray-400">
            Please wait while AI prepares your interview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm font-medium">Live Interview</span>
            </div>
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
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded">
              <div className={`w-2 h-2 rounded-full ${isMicEnabled ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm">{isMicEnabled ? 'Rec' : 'Mic Off'}</span>
            </div>
            <button
              onClick={handleCompleteInterview}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-medium text-sm"
            >
              End Interview
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Question Sidebar (Only shows for coding questions or if text heavy) */}
        {showQuestion && currentQuestion && (
          <div className="w-96 bg-gray-900 border-r border-gray-800 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
              
              {currentQuestion.examples && (
                <div className="space-y-4 mt-6">
                  {currentQuestion.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-800 rounded p-3">
                      <div className="text-sm font-bold text-gray-300 mb-2">
                        Example {idx + 1}
                      </div>
                      <div className="text-sm font-mono space-y-1">
                        <div>
                          <span className="text-gray-400">Input:</span>{' '}
                          <span className="text-blue-400">{example.input}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Output:</span>{' '}
                          <span className="text-green-400">{example.output}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.constraints && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-300 mb-2">Constraints</h3>
                  <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                    {currentQuestion.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center - Video or Code Editor */}
        <div className="flex-1 flex flex-col relative">
          {showCodeEditor ? (
            <>
              {/* Code Editor */}
              <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm border border-gray-700"
                >
                  {programmingLanguages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.icon} {lang.label}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-gray-400">
                  Write your code below
                </div>
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language={selectedLanguage}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => setShowCodeEditor(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                >
                  Close Editor
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isAIThinking || !code.trim()}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Check size={16} />
                  Submit Code
                </button>
              </div>
            </>
          ) : (
            /* Video View */
            <div className="flex-1 relative">
              {/* Candidate Video */}
              <div className="w-full h-full bg-gray-900">
                {isVideoEnabled ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    mirrored={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff size={64} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">Camera is off</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Avatar */}
              <div className="absolute bottom-6 right-6 w-64 h-48 rounded-lg overflow-hidden border-2 border-gray-700 bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className={`text-7xl transition-transform ${isAvatarSpeaking ? 'scale-110' : 'scale-100'}`}>
                    👩‍💼
                  </div>
                  
                  {isMicEnabled && !isAIThinking && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500/90 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">Listening</span>
                    </div>
                  )}

                  {isAvatarSpeaking && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-wave"
                          style={{ height: '16px', animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Transcription */}
              {isMicEnabled && transcriptionText && !isAIThinking && (
                <div className="absolute bottom-64 left-6 right-80 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 animate-slide-up">
                  <div className="flex items-start gap-3">
                    <Mic className="text-red-500 mt-1" size={20} />
                    <div>
                      <div className="text-xs text-gray-400 mb-1">You're saying:</div>
                      <p className="text-white">{transcriptionText}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Thinking Indicator */}
              {isAIThinking && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-purple-600/90 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-400 flex items-center gap-3 shadow-lg z-50">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-white font-medium">AI is evaluating...</span>
                </div>
              )}

              {/* Error & Retry Alert */}
              {hasError && (
                 <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-red-600/90 backdrop-blur-sm px-6 py-4 rounded-lg border border-red-400 flex items-center gap-3 shadow-lg z-50 max-w-md">
                   <AlertCircle size={24} className="text-white flex-shrink-0" />
                   <div>
                     <p className="font-bold text-white">Connection Issue</p>
                     <p className="text-sm text-red-100">The AI took too long to respond or there was a network error. Click retry to send your answer again.</p>
                   </div>
                 </div>
              )}

              {/* AI Message Display */}
              {aiMessage && !isAIThinking && !hasError && (
                <div className="absolute top-6 left-6 right-80 bg-blue-600/90 backdrop-blur-sm rounded-lg p-4 border border-blue-400 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-blue-100 mb-1 font-medium">AI Interviewer</div>
                      <p className="text-white text-sm md:text-base leading-relaxed">{aiMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                {/* Retry Button (Only shows on error) */}
                {hasError ? (
                   <button
                   onClick={handleRetry}
                   className="h-12 px-6 rounded-full flex items-center gap-2 bg-orange-600 hover:bg-orange-700 shadow-lg transition-all animate-pulse font-bold"
                 >
                   <RotateCcw size={20} />
                   <span>Retry Answer</span>
                 </button>
                ) : (
                  <button
                    onClick={toggleMicrophone}
                    disabled={isProcessingAnswer}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isMicEnabled
                        ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isMicEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                )}

                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isVideoEnabled
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                <button
                  onClick={isAvatarSpeaking ? stopSpeaking : () => speakText(aiMessage)}
                  className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                >
                  {isAvatarSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                {!showCodeEditor && currentQuestion?.type === 'coding' && (
                  <button
                    onClick={() => setShowCodeEditor(true)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 font-medium ml-2"
                  >
                    <Code size={20} />
                    <span>Open Code Editor</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }
        .animate-wave {
          animation: wave 0.6s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}