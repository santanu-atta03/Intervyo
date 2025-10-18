
import React, { useState, useEffect, useRef } from "react";

const InterviewRoom = ({ interviewId, token, navigate, getInterviewById, getInterviewSession, startInterview, io }) => {
  // States
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [mediaReady, setMediaReady] = useState(false);
  const videoRef = useRef(null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userTranscript, setUserTranscript] = useState("");

  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);
  const transcriptAccumulatorRef = useRef("");
  const shouldRestartRecognition = useRef(false);

  // Initialize interview
  useEffect(() => {
    const init = async () => {
      try {
        const interviewData = await getInterviewById(interviewId, token);
        setInterview(interviewData);

        if (interviewData.status === "in-progress") {
          const sessionData = await getInterviewSession(interviewId, token);
          setSession(sessionData);
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

  // Setup media
  useEffect(() => {
    let mounted = true;
    let localStream = null;

    const setupMedia = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true }
        });

        if (!mounted) {
          localStream.getTracks().forEach(t => t.stop());
          return;
        }

        setStream(localStream);
        setMediaReady(true);

        setTimeout(() => {
          if (videoRef.current && localStream && mounted) {
            videoRef.current.srcObject = localStream;
            videoRef.current.play().catch(console.error);
          }
        }, 100);
      } catch (error) {
        console.error("Media error:", error);
        alert("Camera/microphone access required");
        setMediaReady(false);
      }
    };

    setupMedia();
    return () => {
      mounted = false;
      if (localStream) localStream.getTracks().forEach(t => t.stop());
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

  // Setup socket
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnection: true
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setSocketConnected(true);
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
      navigate(`/results/${interviewId}`);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [interviewId, navigate]);

  // Handle AI message
  const handleAIMessage = async (data) => {
    console.log("Handling:", data.type);
    
    setCurrentMessage(data.message);
    setAiSpeaking(true);

    // Stop current audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Play audio
    if (data.hasAudio && data.audioBase64) {
      try {
        await playAudioFromBase64(data.audioBase64);
      } catch (error) {
        speakText(data.message);
      }
    } else {
      speakText(data.message);
    }

    // Update question state
    if (data.type === "question") {
      console.log("📝 New question received");
      setCurrentQuestion(data);
      setUserTranscript("");
      transcriptAccumulatorRef.current = "";
    } else if (data.type === "review" || data.type === "code-review") {
      console.log("📊 Review received, clearing question");
      setCurrentQuestion(null);
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
    const answer = (transcriptAccumulatorRef.current.trim() || userTranscript.trim());
    
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

  const handleStartInterview = async () => {
    if (!socketConnected || !mediaReady) {
      alert("Please wait for connection");
      return;
    }

    try {
      const result = await startInterview(interviewId, setLoading, token);
      setSession(result.session);
      setInterviewStarted(true);

      socket.emit("join-room", {
        roomId: interviewId,
        userId: result.session.userId,
      });

      setTimeout(() => {
        socket.emit("candidate-ready", {
          sessionId: result.session._id,
          interviewId,
        });
      }, 1000);
    } catch (error) {
      console.error("Start error:", error);
      alert("Failed to start");
    }
  };

  const handleEndInterview = () => {
    if (window.confirm("End interview?")) {
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
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${socketConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
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
            style={{ opacity: isVideoOn ? 1 : 0, display: stream ? 'block' : 'none' }}
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
                  <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
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
        {currentMessage && interviewStarted && (
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
                    {currentMessage.startsWith("You:") ? "You" : "AI Interviewer"}
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
        {isListening && userTranscript && (
          <div className="absolute top-24 left-6 right-6 max-w-2xl mx-auto z-50">
            <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 border-2 border-blue-500/50">
              <div className="text-blue-300 text-sm font-semibold mb-2">Your Answer (Live):</div>
              <p className="text-white text-lg leading-relaxed">{userTranscript}</p>
              <div className="mt-3 text-blue-200 text-sm">
                💡 Click "Submit Answer" when done or keep speaking...
              </div>
            </div>
          </div>
        )}

        {/* Listening Indicator */}
        {isListening && (
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

        {/* Control Bar */}
        {interviewStarted && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 border border-gray-700 shadow-2xl">
              <button
                onClick={toggleAudio}
                disabled={isListening}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isAudioOn
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } ${isListening ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isListening ? "Cannot toggle while listening" : (isAudioOn ? "Mute" : "Unmute")}
              >
                {isAudioOn ? <span className="text-2xl">🎤</span> : <span className="text-2xl">🔇</span>}
              </button>

              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isVideoOn
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                title={isVideoOn ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoOn ? <span className="text-2xl">📹</span> : <span className="text-2xl">📷</span>}
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
                    disabled={!userTranscript.trim() || userTranscript.trim().length < 3}
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

      {/* Start Interview Overlay */}
      {!interviewStarted && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
              <p className="text-gray-300 mb-6">
                Make sure your camera and microphone are working properly before starting.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                  <span className="text-gray-300">Connection</span>
                  <span className={`font-semibold ${socketConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {socketConnected ? '✓ Connected' : '⏳ Connecting...'}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                  <span className="text-gray-300">Camera & Mic</span>
                  <span className={`font-semibold ${mediaReady ? 'text-green-400' : 'text-yellow-400'}`}>
                    {mediaReady ? '✓ Ready' : '⏳ Requesting...'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={loading || !socketConnected || !mediaReady}
                className="w-full px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-2xl"
              >
                {loading
                  ? "Starting..."
                  : !socketConnected
                  ? "Connecting..."
                  : !mediaReady
                  ? "Waiting for permissions..."
                  : "Start Interview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;