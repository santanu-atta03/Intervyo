import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  CheckCircle,
  Loader,
  Volume2,
} from 'lucide-react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import {
  getInterviewById,
  getInterviewSession,
  startInterview,
} from '../../services/operations/aiInterviewApi';

const InterviewRoom = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);

  // Video/Audio states
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  // Interview states
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Speech recognition and audio
  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);

  // Initialize interview data
  useEffect(() => {
    const initInterview = async () => {
      try {
        const interviewData = await getInterviewById(interviewId, token);
        setInterview(interviewData);

        if (interviewData.status === 'in-progress') {
          const sessionData = await getInterviewSession(interviewId, token);
          setSession(sessionData);
          setInterviewStarted(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Init error:', error);
        alert('Failed to load interview');
        navigate('/dashboard');
      }
    };

    initInterview();
  }, [interviewId, token, navigate]);

  // Setup media stream
  useEffect(() => {
    let mounted = true;
    
    const setupMedia = async () => {
      try {
        console.log('Requesting media permissions...');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        console.log('Media stream obtained:', mediaStream);
        setStream(mediaStream);
        setIsVideoOn(true);
        setIsAudioOn(true);

        // Set video element source
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
              console.error('Video play error:', err);
            });
          };
        }
        
        console.log('Media setup complete');
      } catch (error) {
        console.error('Media error:', error);
        if (mounted) {
          const errorMsg = error.name === 'NotAllowedError' 
            ? 'Camera/microphone access denied. Please allow access and reload.'
            : error.name === 'NotFoundError'
            ? 'No camera or microphone found.'
            : 'Failed to access media devices.';
          
          alert(errorMsg);
        }
      }
    };

    setupMedia();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Setup socket connection
  useEffect(() => {
    const SOCKET_URL = 'http://localhost:5000';
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setSocketConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    newSocket.on('ai-message', (data) => {
      console.log('Received AI message:', data);
      handleAIMessage(data);
    });

    newSocket.on('ai-status', (data) => {
      console.log('AI status:', data);
      setCurrentMessage(data.message);
    });

    newSocket.on('interview-ready', (data) => {
      console.log('Interview ready:', data);
    });

    newSocket.on('interview-ended', () => {
      console.log('Interview ended');
      // Navigate to dashboard instead of feedback (route doesn't exist)
      navigate(`/results/${interviewId}`);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      // Don't show alert for processing errors, just log them
      if (error.message && !error.message.includes('process')) {
        alert(error.message);
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [interviewId, navigate]);

  // Setup speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      console.log('Recognized:', transcript, 'Confidence:', confidence);
      
      if (transcript && transcript.trim().length > 0) {
        handleUserAnswer(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('Microphone access denied. Please allow microphone access and reload.');
      } else if (event.error === 'no-speech') {
        console.log('No speech detected, please try again');
      }
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Handle AI message with audio playback
  const handleAIMessage = async (data) => {
    setCurrentMessage(data.message);
    setAiSpeaking(true);

    // Stop any current audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    // Stop speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Play audio if available
    if (data.hasAudio && data.audioBase64) {
      try {
        await playAudioFromBase64(data.audioBase64);
      } catch (error) {
        console.error('Audio playback error:', error);
        speakText(data.message);
      }
    } else {
      speakText(data.message);
    }

    // Store question data
    if (data.type === 'question') {
      setCurrentQuestion(data);
    } else {
      setCurrentQuestion(null);
    }
  };

  // Play audio from base64
  const playAudioFromBase64 = (base64Data) => {
    return new Promise((resolve, reject) => {
      try {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => {
          console.log('Audio playback ended');
          setAiSpeaking(false);
          URL.revokeObjectURL(url);
          
          // Auto start listening after question
          if (currentQuestion && !currentQuestion.requiresCode) {
            setTimeout(() => {
              startListening();
            }, 500);
          }
          resolve();
        };

        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          setAiSpeaking(false);
          URL.revokeObjectURL(url);
          reject(error);
        };

        audio.play().catch(err => {
          console.error('Audio play failed:', err);
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Fallback text-to-speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        console.log('TTS ended');
        setAiSpeaking(false);
        
        if (currentQuestion && !currentQuestion.requiresCode) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };

      utterance.onerror = (error) => {
        console.error('TTS error:', error);
        setAiSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setAiSpeaking(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      return;
    }

    if (isListening || aiSpeaking) {
      console.log('Already listening or AI speaking');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      console.log('Started listening for answer');
    } catch (error) {
      console.error('Start listening error:', error);
      if (error.message.includes('already started')) {
        // Recognition already running, just update state
        setIsListening(true);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        console.log('Stopped listening');
      } catch (error) {
        console.error('Stop listening error:', error);
      }
      setIsListening(false);
    }
  };

  const handleUserAnswer = (answer) => {
    if (!socket || !session) {
      console.error('Socket or session not available');
      return;
    }

    if (!currentQuestion) {
      console.warn('No current question to answer');
      return;
    }

    console.log('Sending answer to server:', {
      answer,
      questionIndex: currentQuestion.questionIndex,
    });
    
    socket.emit('candidate-answer', {
      sessionId: session._id,
      question: currentQuestion.message,
      answer: answer.trim(),
      questionIndex: currentQuestion.questionIndex,
    });

    setCurrentMessage(`You: ${answer}`);
    setCurrentQuestion(null);
    stopListening();
  };

  const handleStartInterview = async () => {
    if (!socketConnected) {
      alert('Please wait for connection to establish');
      return;
    }

    if (!stream) {
      alert('Please allow camera and microphone access first');
      return;
    }

    try {
      const result = await startInterview(interviewId, setLoading, token);
      
      setSession(result.session);
      setInterviewStarted(true);

      // Join socket room
      socket.emit('join-room', {
        roomId: interviewId,
        userId: result.session.userId,
      });

      // Notify ready
      setTimeout(() => {
        socket.emit('candidate-ready', {
          sessionId: result.session._id,
          interviewId: interviewId,
        });
      }, 1000);
    } catch (error) {
      console.error('Start error:', error);
    }
  };

  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      if (socket && session) {
        socket.emit('end-interview', {
          sessionId: session._id,
          interviewId: interviewId,
        });
      } else {
        navigate('/dashboard');
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <div className="text-white text-xl">Loading interview room...</div>
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
            <div className={`w-3 h-3 rounded-full animate-pulse ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
        {/* Candidate Video */}
        <div className="absolute inset-0">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ display: isVideoOn ? 'block' : 'none' }}
            />
          ) : null}
          
          {!isVideoOn && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-400">
                  {interview?.role?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-6 px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-lg text-white font-semibold">
            You
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
                  <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1 text-center">
              {aiSpeaking ? (
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <Volume2 className="w-4 h-4" />
                  <span>Speaking...</span>
                </div>
              ) : (
                <div className="text-gray-400 text-sm flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Message */}
        {currentMessage && interviewStarted && (
          <div className="absolute bottom-24 left-6 right-6 max-w-3xl mx-auto">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🤖</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">
                    {currentMessage.startsWith('You:') ? 'You' : 'AI Interviewer'}
                  </div>
                  <p className="text-white text-lg leading-relaxed">{currentMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listening Indicator */}
        {isListening && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-red-500/90 backdrop-blur-sm rounded-full px-8 py-4 flex items-center gap-3 shadow-2xl animate-pulse">
              <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
              <span className="text-white font-semibold text-lg">Listening...</span>
            </div>
          </div>
        )}

        {/* Control Bar */}
        {interviewStarted && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 border border-gray-700 shadow-2xl">
              <button
                onClick={toggleAudio}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isAudioOn
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
                title={isAudioOn ? 'Mute' : 'Unmute'}
              >
                {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isVideoOn
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              {!aiSpeaking && currentQuestion && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isListening ? 'Stop Speaking' : 'Start Speaking'}
                </button>
              )}

              <button
                onClick={handleEndInterview}
                className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
                title="End interview"
              >
                <Phone className="w-6 h-6 text-white transform rotate-[135deg]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Start Interview Button */}
      {!interviewStarted && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={handleStartInterview}
            disabled={loading || !socketConnected || !stream}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-2xl"
          >
            {loading ? 'Starting...' : !socketConnected ? 'Connecting...' : !stream ? 'Waiting for media...' : 'Start Interview'}
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;