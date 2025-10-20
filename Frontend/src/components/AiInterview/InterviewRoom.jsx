import React, { useState, useEffect, useRef } from "react";
import { Code2, X, Play } from "lucide-react";
import Editor from "@monaco-editor/react";

const InterviewRoom = ({
  interviewId,
  token,
  navigate,
  getInterviewById,
  getInterviewSession,
  startInterview,
  io,
}) => {
  // States
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const switchCount = useRef(0);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userTranscript, setUserTranscript] = useState("");

  // Code editor states
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeOutput, setCodeOutput] = useState("");

  const [showXPAnimation, setShowXPAnimation] = useState(false);
const [xpData, setXPData] = useState(null);
const [showLevelUp, setShowLevelUp] = useState(false);
const [levelUpData, setLevelUpData] = useState(null);
const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
const [badgeQueue, setBadgeQueue] = useState([]);

  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);
  const transcriptAccumulatorRef = useRef("");
  const shouldRestartRecognition = useRef(false);

  const languages = [
    {
      value: "javascript",
      label: "JavaScript",
      default: "// Write your code here\n\n",
    },
    { value: "python", label: "Python", default: "# Write your code here\n\n" },
    { value: "java", label: "Java", default: "// Write your code here\n\n" },
    { value: "cpp", label: "C++", default: "// Write your code here\n\n" },
  ];

  // Auto-start interview on component mount
  useEffect(() => {
    const init = async () => {
      try {
        const interviewData = await getInterviewById(interviewId, token);
        setInterview(interviewData);

        if (interviewData.status === "in-progress") {
          const sessionData = await getInterviewSession(interviewId, token);
          setSession(sessionData);
          setInterviewStarted(true);
        } else {
          // Auto-start interview
          const result = await startInterview(interviewId, setLoading, token);
          setSession(result.session);
          setInterviewStarted(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Init error:", error);
        alert("Failed to load interview");
        navigate("/dashboard");
      }
    };
    init();
  }, [interviewId, token, navigate]);

  useEffect(() => {
    const enterFullscreen = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        /* Safari */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        /* IE11 */
        element.msRequestFullscreen();
      }
    };

    enterFullscreen();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        switchCount.current += 1;
        console.log("Tab switch count:", switchCount.current);

        if (switchCount.current > 1) {
          // 👇 You can call your submission API or redirect
          alert(
            "You switched tabs more than once. Interview will be submitted."
          );

          if (socket && session) {
            socket.emit("end-interview", {
              sessionId: session._id,
              interviewId: interviewId,
            });
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  // Setup media automatically
  useEffect(() => {
    let mounted = true;
    let localStream = null;

    const setupMedia = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        });

        if (!mounted) {
          localStream.getTracks().forEach((t) => t.stop());
          return;
        }

        setStream(localStream);

        setTimeout(() => {
          if (videoRef.current && localStream && mounted) {
            videoRef.current.srcObject = localStream;
            videoRef.current.play().catch(console.error);
          }
        }, 100);
      } catch (error) {
        console.error("Media error:", error);
        alert(
          "Camera/microphone access required. Please allow permissions and refresh."
        );
      }
    };

    setupMedia();
    return () => {
      mounted = false;
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Setup speech recognition
  useEffect(() => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech recognition not supported. Please use Chrome.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("🎤 Listening started");
      setIsListening(true);
      transcriptAccumulatorRef.current = "";
      setUserTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (final) {
        transcriptAccumulatorRef.current += final;
      }

      setUserTranscript(transcriptAccumulatorRef.current + interim);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert("Microphone access denied");
        setIsListening(false);
        shouldRestartRecognition.current = false;
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      if (shouldRestartRecognition.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
            shouldRestartRecognition.current = false;
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRecognition.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Setup socket and auto-start interview
  useEffect(() => {
    if (!session || !interviewStarted) return;

    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setSocketConnected(true);

      // Auto join room and start
      newSocket.emit("join-room", {
        roomId: interviewId,
        userId: session.userId,
      });

      setTimeout(() => {
        newSocket.emit("candidate-ready", {
          sessionId: session._id,
          interviewId,
        });
      }, 1000);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setSocketConnected(false);
    });

    newSocket.on("ai-message", (data) => {
      console.log("📨 AI message:", data.type);
      handleAIMessage(data);
    });

    newSocket.on("ai-status", (data) => {
      setCurrentMessage(data.message);
    });

    newSocket.on("interview-ready", () => {
      console.log("✅ Interview ready");
    });

    newSocket.on("interview-ended", () => {
      console.log("Interview ended, navigating to results...");
  
  // Stop all media
  stopListening();
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
  
  // Navigate to results
  navigate(`/results/${interviewId}`);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [session, interviewStarted, interviewId, navigate]);

  useEffect(() => {
  if (!socket) return;

  // Listen for gamification updates
  socket.on('gamification-update', (data) => {
    console.log('🎮 Gamification Update:', data);
    
    // Show XP notification
    if (data.xpEarned > 0) {
      showNotification(`+${data.xpEarned} XP Earned!`, 'success');
    }
    
    // Show level up notification
    if (data.leveledUp) {
      showLevelUpNotification(data.newLevel);
    }
    
    // Show badge notifications
    if (data.newBadges && data.newBadges.length > 0) {
      data.newBadges.forEach(badge => {
        showAchievementNotification(badge, badge.xp);
      });
    }
    
    // Show streak notification
    if (data.streakIncreased) {
      showNotification(`🔥 ${data.streak} Day Streak!`, 'success');
    }
  });

  return () => {
    socket.off('gamification-update');
  };
}, [socket]);


useEffect(() => {
  if (!socket) return;

  socket.on('gamification-update', (data) => {
    console.log('🎮 Gamification Update Received:', data);
    
    // Show XP animation
    if (data.xpEarned > 0) {
      setXPData(data);
      setShowXPAnimation(true);
      
      setTimeout(() => {
        setShowXPAnimation(false);
      }, 3000);
    }
    
    // Show level up animation
    if (data.leveledUp) {
      setTimeout(() => {
        setLevelUpData({
          oldLevel: data.oldLevel,
          newLevel: data.newLevel
        });
        setShowLevelUp(true);
        
        setTimeout(() => {
          setShowLevelUp(false);
        }, 4000);
      }, 3500); // Show after XP animation
    }
    
    // Queue badge animations
    if (data.newBadges && data.newBadges.length > 0) {
      setBadgeQueue(data.newBadges);
    }
  });

  return () => {
    socket.off('gamification-update');
  };
}, [socket]);

// Badge animation effect
useEffect(() => {
  if (badgeQueue.length === 0) return;

  setShowBadgeAnimation(true);
  const currentBadge = badgeQueue[0];

  setTimeout(() => {
    setShowBadgeAnimation(false);
    setBadgeQueue(prev => prev.slice(1));
  }, 4000);
}, [badgeQueue]);

  // Handle AI message
  const handleAIMessage = async (data) => {
    console.log("Handling:", data.type);

    setCurrentMessage(data.message);
    setAiSpeaking(true);

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (data.hasAudio && data.audioBase64) {
      try {
        await playAudioFromBase64(data.audioBase64);
      } catch (error) {
        speakText(data.message);
      }
    } else {
      speakText(data.message);
    }

    if (data.type === "question") {
      console.log("📝 New question received");
      setCurrentQuestion(data);
      setUserTranscript("");
      transcriptAccumulatorRef.current = "";

      // Show code editor if requiresCode is true
      if (data.requiresCode) {
        setTimeout(() => {
          setShowCodeEditor(true);
          const langData = languages.find((l) => l.value === codeLanguage);
          setCode(langData?.default || "");
        }, 2000);
      }
    } else if (data.type === "review" || data.type === "code-review") {
      console.log("📊 Review received");
      setCurrentQuestion(null);
      setShowCodeEditor(false);
    }
  };

  const playAudioFromBase64 = (base64Data) => {
    return new Promise((resolve, reject) => {
      try {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => {
          setAiSpeaking(false);
          URL.revokeObjectURL(url);
          resolve();
        };

        audio.onerror = () => {
          setAiSpeaking(false);
          URL.revokeObjectURL(url);
          reject();
        };

        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };

  const speakText = (text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setAiSpeaking(false);
      utterance.onerror = () => setAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setAiSpeaking(false);
    }
  };

  const startListening = () => {
    if (!session || !socket || !currentQuestion || isListening || aiSpeaking) {
      console.log("Cannot start listening");
      return;
    }

    try {
      transcriptAccumulatorRef.current = "";
      setUserTranscript("");
      shouldRestartRecognition.current = true;
      recognitionRef.current.start();
      console.log("🎤 Started listening");
    } catch (error) {
      console.error("Start error:", error);
    }
  };

  const stopListening = () => {
    shouldRestartRecognition.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleSubmitAnswer = () => {
    const answer =
      transcriptAccumulatorRef.current.trim() || userTranscript.trim();

    if (!answer || answer.length < 5) {
      alert("Please provide a longer answer (at least 5 characters)");
      return;
    }

    if (!socket || !session || !currentQuestion) {
      console.error("Cannot submit");
      return;
    }

    console.log("📤 Submitting answer");

    stopListening();

    socket.emit("candidate-answer", {
      sessionId: session._id,
      question: currentQuestion.message,
      answer: answer,
      questionIndex: currentQuestion.questionIndex,
    });

    setCurrentMessage(`You: ${answer.substring(0, 100)}...`);
    setCurrentQuestion(null);
    setUserTranscript("");
    transcriptAccumulatorRef.current = "";
  };

  const handleCodeLanguageChange = (e) => {
    const newLang = e.target.value;
    setCodeLanguage(newLang);
    const langData = languages.find((l) => l.value === newLang);
    setCode(langData?.default || "");
  };

  const handleRunCode = () => {
    setCodeOutput(
      "Code execution simulated. In production, this would run on a secure backend."
    );
  };

  const handleSubmitCode = () => {
    if (!code.trim()) {
      alert("Please write some code before submitting");
      return;
    }

    if (!socket || !session || !currentQuestion) {
      console.error("Cannot submit code");
      return;
    }

    console.log("📤 Submitting code");

    socket.emit("submit-code", {
      sessionId: session._id,
      question: currentQuestion.message,
      code: code,
      language: codeLanguage,
    });

    setShowCodeEditor(false);
    setCode("");
    setCodeOutput("");
  };

  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      stopListening();
      if (socket && session) {
        socket.emit("end-interview", {
          sessionId: session._id,
          interviewId: interviewId,
        });
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsVideoOn(track.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const track = stream.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsAudioOn(track.enabled);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading interview...</div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                socketConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-white font-semibold">{interview?.role}</span>
          </div>
          <div className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full border border-orange-500/30">
            {interview?.difficulty?.toUpperCase()}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-400 text-sm">{interview?.duration} min</div>
          {interviewStarted && (
            <button
              onClick={handleEndInterview}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              End Interview
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative bg-black">
        {/* Video */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              opacity: isVideoOn ? 1 : 0,
              display: stream ? "block" : "none",
            }}
          />

          {(!isVideoOn || !stream) && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-400">
                  {interview?.role?.charAt(0) || "U"}
                </span>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-6 px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-lg text-white font-semibold">
            You {isVideoOn && stream ? "📹" : ""}
          </div>
        </div>

        {/* AI Avatar */}
        <div className="absolute top-6 right-6 w-64 h-48 bg-gray-800 rounded-2xl border-2 border-gray-700 overflow-hidden shadow-2xl">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🤖</span>
              </div>
              <div className="text-white font-semibold">AI Interviewer</div>
              {aiSpeaking && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
                  <div
                    className="w-1 h-5 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-4 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-6 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1 text-center">
              {aiSpeaking ? (
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <span>🔊</span>
                  <span>Speaking...</span>
                </div>
              ) : (
                <div className="text-gray-400 text-sm flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Display */}
        {currentMessage && interviewStarted && !showCodeEditor && (
          <div className="absolute bottom-32 left-6 right-6 max-w-3xl mx-auto">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">
                    {currentMessage.startsWith("You:") ? "👤" : "🤖"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">
                    {currentMessage.startsWith("You:")
                      ? "You"
                      : "AI Interviewer"}
                  </div>
                  <p className="text-white text-lg leading-relaxed">
                    {currentMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {isListening && userTranscript && !showCodeEditor && (
          <div className="absolute top-24 left-6 right-6 max-w-2xl mx-auto z-50">
            <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 border-2 border-blue-500/50">
              <div className="text-blue-300 text-sm font-semibold mb-2">
                Your Answer (Live):
              </div>
              <p className="text-white text-lg leading-relaxed">
                {userTranscript}
              </p>
              <div className="mt-3 text-blue-200 text-sm">
                💡 Click "Submit Answer" when done or keep speaking...
              </div>
            </div>
          </div>
        )}

        {/* Listening Indicator */}
        {isListening && !showCodeEditor && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div className="bg-red-500/90 backdrop-blur-sm rounded-full px-8 py-4 flex items-center gap-3 shadow-2xl">
              <div className="relative">
                <div className="w-4 h-4 bg-white rounded-full"></div>
                <div className="w-4 h-4 bg-white rounded-full absolute inset-0 animate-ping"></div>
              </div>
              <span className="text-white font-semibold text-lg">
                🎤 Listening... Speak now!
              </span>
            </div>
          </div>
        )}

        {/* Code Editor Overlay */}
        {showCodeEditor && currentQuestion && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700 shadow-2xl">
              {/* Code Editor Header */}
              <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Coding Challenge
                    </h3>
                    <p className="text-sm text-gray-400">
                      Write your solution below
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCodeEditor(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Code Editor Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Problem Statement */}
                <div className="w-2/5 border-r border-gray-700 overflow-y-auto bg-gray-800/30 p-6">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Problem Statement
                  </h4>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-300 leading-relaxed">
                      {currentQuestion.message}
                    </p>
                  </div>
                </div>

                {/* Editor Panel */}
                <div className="flex-1 flex flex-col">
                  <div className="px-6 py-3 border-b border-gray-700 flex items-center justify-between bg-gray-800/30">
                    <div className="flex items-center gap-4">
                      <select
                        value={codeLanguage}
                        onChange={handleCodeLanguageChange}
                        className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      >
                        {languages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleRunCode}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30"
                      >
                        <Play className="w-4 h-4" />
                        <span className="font-semibold">Run Code</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <Editor
                      height="100%"
                      language={codeLanguage}
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                      }}
                    />
                  </div>

                  {codeOutput && (
                    <div className="border-t border-gray-700 bg-gray-800/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white font-semibold text-sm">
                          Output
                        </span>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                        {codeOutput}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Editor Footer */}
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between bg-gray-800/50">
                <button
                  onClick={() => setShowCodeEditor(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-semibold"
                >
                  Close Editor
                </button>
                <button
                  onClick={handleSubmitCode}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Control Bar */}
        {interviewStarted && !showCodeEditor && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 border border-gray-700 shadow-2xl">
              <button
                onClick={toggleAudio}
                disabled={isListening}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isAudioOn
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } ${isListening ? "opacity-50 cursor-not-allowed" : ""}`}
                title={
                  isListening
                    ? "Cannot toggle while listening"
                    : isAudioOn
                    ? "Mute"
                    : "Unmute"
                }
              >
                {isAudioOn ? (
                  <span className="text-2xl">🎤</span>
                ) : (
                  <span className="text-2xl">🔇</span>
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isVideoOn
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {isVideoOn ? (
                  <span className="text-2xl">📹</span>
                ) : (
                  <span className="text-2xl">📷</span>
                )}
              </button>

              {!aiSpeaking && currentQuestion && !isListening && (
                <button
                  onClick={startListening}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-white transition-all flex items-center gap-2"
                >
                  <span className="text-xl">🎤</span>
                  <span>Start Answering</span>
                </button>
              )}

              {isListening && (
                <>
                  <button
                    onClick={stopListening}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold text-white transition-all flex items-center gap-2"
                  >
                    <span className="text-xl">⏸️</span>
                    <span>Stop Speaking</span>
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={
                      !userTranscript.trim() || userTranscript.trim().length < 3
                    }
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl">✅</span>
                    <span>Submit Answer</span>
                  </button>
                </>
              )}

              {aiSpeaking && (
                <div className="px-6 py-3 bg-gray-700 rounded-xl text-gray-300 flex items-center gap-2">
                  <span className="text-xl animate-pulse">🔊</span>
                  <span>AI is speaking...</span>
                </div>
              )}

              <button
                onClick={handleEndInterview}
                className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all ml-2"
                title="End interview"
              >
                <span className="text-2xl">📞</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {showXPAnimation && xpData && (
  <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
    <div className="animate-bounce-in">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-60 animate-pulse"></div>
        
        {/* Card */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl min-w-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <div className="text-purple-400 text-sm font-semibold mb-2">XP EARNED!</div>
            <div className="text-6xl font-bold text-white mb-4">
              +{xpData.xpEarned}
            </div>
            
            {/* XP Breakdown */}
            {xpData.xpBreakdown && (
              <div className="space-y-2 text-sm">
                {xpData.xpBreakdown.baseXP > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Base XP:</span>
                    <span className="text-purple-400">+{xpData.xpBreakdown.baseXP}</span>
                  </div>
                )}
                {xpData.xpBreakdown.scoreBonus > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Score Bonus:</span>
                    <span className="text-blue-400">+{xpData.xpBreakdown.scoreBonus}</span>
                  </div>
                )}
                {xpData.xpBreakdown.perfectBonus > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Perfect Score:</span>
                    <span className="text-yellow-400">+{xpData.xpBreakdown.perfectBonus}</span>
                  </div>
                )}
                {xpData.xpBreakdown.codeBonus > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Code Submission:</span>
                    <span className="text-green-400">+{xpData.xpBreakdown.codeBonus}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 text-gray-400 text-sm">
              Total XP: {xpData.totalXP?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Level Up Animation */}
{showLevelUp && levelUpData && (
  <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="animate-scale-in">
      <div className="relative">
        {/* Rays */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Card */}
        <div className="relative bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-12 border-4 border-yellow-500/50 shadow-2xl">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">👑</div>
            <div className="text-yellow-400 text-2xl font-bold mb-4 animate-pulse">
              LEVEL UP!
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-4xl font-bold text-white">{levelUpData.oldLevel}</div>
              <div className="text-4xl text-yellow-400">→</div>
              <div className="text-6xl font-bold text-yellow-400">{levelUpData.newLevel}</div>
            </div>
            <div className="text-purple-200 text-lg">
              🎉 Congratulations! Keep up the great work! 🎉
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Badge Unlocked Animation */}
{showBadgeAnimation && badgeQueue.length > 0 && (
  <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
      
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border-2 border-yellow-500/50 shadow-2xl min-w-[350px]">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{badgeQueue[0].icon}</div>
          <div className="flex-1">
            <div className="text-yellow-400 text-sm font-semibold flex items-center gap-2 mb-1">
              <span>🏆</span>
              BADGE UNLOCKED!
            </div>
            <div className="text-white font-bold text-lg mb-2">
              {badgeQueue[0].name}
            </div>
            {badgeQueue[0].xp > 0 && (
              <div className="text-purple-400 font-semibold text-sm">
                +{badgeQueue[0].xp} XP Bonus!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
  <style>{`
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
 } `}
  </style>
    </div>
  );
};

export default InterviewRoom;
