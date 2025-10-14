import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  startInterview,
  submitAnswer,
  completeInterview,
} from "../services/operations/interviewAPI";
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
  Send,
  SkipForward,
  Lightbulb,
  Pause,
  Play,
  LogOut,
  Camera,
  Volume2,
  VolumeX,
} from "lucide-react";
import LiveMetrics from "../components/Interview/LiveMetrics";

export default function InterviewRoom() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const webcamRef = useRef(null);

  // Redux state
  const { token } = useSelector((state) => state.auth);
  const { interviewData, currentQuestion,currentQuestionIndex, loading, metrics } = useSelector(
    (state) => state.interview
  );
  console.log("interview data : ",interviewData)
  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Local state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

  // Initialize interview
  useEffect(() => {
    const initializeInterview = async () => {
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      if (interviewId) {
        await dispatch(startInterview(interviewId, token));
      }
    };

    initializeInterview();
  }, [interviewId, token, dispatch, navigate]);

  // Set timer when interview starts
  useEffect(() => {
    if (interviewData && interviewData.timeRemaining) {
      setTimeRemaining(interviewData.timeRemaining);
    }
  }, [interviewData]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
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
  }, [timeRemaining, isPaused]);
  

  // Calculate progress
  useEffect(() => {
    if (interviewData?.totalQuestions) {
      const answered = interviewData.rounds?.[0]?.answers?.length || 0;
      setProgress((answered / interviewData.totalQuestions) * 100);
    }
  }, [interviewData]);
  const actualQuestionNumber = interviewData?.performance?.questionsAnswered + 1 || 1;

  // Speak question using Web Speech API (FREE)
  useEffect(() => {
    if (currentQuestion && currentQuestion.question) {
      speakQuestion(currentQuestion.question);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion]);

  // Update answer from speech recognition
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  

  // FREE Text-to-Speech using Web Speech API
  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      setIsAvatarSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsAvatarSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsAvatarSpeaking(false);
    }
  };


  // Get hint
  const handleGetHint = () => {
    if (!currentQuestion || !currentQuestion.hints) return;

    if (hintsUsed >= currentQuestion.hints.length) {
      toast.error("No more hints available");
      return;
    }

    const hint = currentQuestion.hints[hintsUsed];
    setCurrentHint(hint);
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
    toast.success("Hint revealed! (-5 points)");
  };

  // Submit answer
  // In InterviewRoom.jsx - UPDATE handleSubmitAnswer

const handleSubmitAnswer = async () => {
  if (!answer.trim()) {
    toast.error('Please provide an answer');
    return;
  }

  const timeTaken = questionStartTime 
    ? Math.floor((Date.now() - questionStartTime) / 1000) 
    : 0;

    console.log("Current question : ",currentQuestion)
  const answerData = {
    questionId: currentQuestion.questionId,
    answer: answer.trim(),
    timeTaken: timeTaken,
    hintsUsed: hintsUsed,
    skipped: false
  };

  try {
    const result = await dispatch(submitAnswer(interviewId, answerData, token,navigate));
    
    // Reset for next question
    setAnswer('');
    resetTranscript();
    setHintsUsed(0);
    setShowHint(false);
    setCurrentHint('');
    setQuestionStartTime(Date.now());
    
    // Stop speaking if avatar is talking
    stopSpeaking();
    
  } catch (error) {
    console.error('Error submitting answer:', error);
  }
};

  // Skip question
  const handleSkipQuestion = async () => {
    const answerData = {
      questionId: currentQuestion.questionId,
      answer: "",
      timeTaken: 0,
      hintsUsed: hintsUsed,
      skipped: true,
    };

    try {
      await dispatch(submitAnswer(interviewId, answerData, token));

      // Reset for next question
      setAnswer("");
      resetTranscript();
      setHintsUsed(0);
      setShowHint(false);
      setCurrentHint("");
      setQuestionStartTime(Date.now());

      toast.success("Question skipped");
    } catch (error) {
      console.error("Error skipping question:", error);
    }
  };

  // Complete interview
  const handleCompleteInterview = async () => {
    if (window.confirm("Are you sure you want to end the interview?")) {
      stopSpeaking();
      SpeechRecognition.stopListening();
      await dispatch(completeInterview(interviewId, navigate, token));
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (metrics) {
      console.log("Metrics updated:", metrics);
    }
  }, [metrics]);
  // Loading state
  if (loading && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Preparing Your Interview...
          </h2>
          <p className="text-white/60">
            AI is generating personalized questions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <nav className="relative bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Live Interview</h1>
                <p className="text-xs text-white/60">AI-Powered Assessment</p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white font-mono">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-white/60">Time Remaining</div>
              </div>

              {/* Progress */}
              <div className="hidden md:block">
                <div className="text-sm text-white/80 mb-1">
                  Progress: {Math.round(progress)}%
                </div>
                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Exit Button */}
              <button
                onClick={handleCompleteInterview}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/30"
              >
                <LogOut size={18} />
                <span className="hidden sm:block">End Interview</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-[1920px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Video & AI Avatar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Video Feed */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera className="text-purple-400" size={24} />
                  Your Video
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isVideoEnabled
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-white/60">
                    {isVideoEnabled ? "Camera Active" : "Camera Off"}
                  </span>
                </div>
              </div>

              <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden">
                {isVideoEnabled ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover mirror"
                    mirrored={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff
                        size={64}
                        className="text-white/20 mx-auto mb-4"
                      />
                      <p className="text-white/40">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Emotion Overlay (Mock) */}
                {isVideoEnabled && (
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20">
                    <div className="text-xs text-white/60 mb-1">
                      Emotion Analysis
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😊</span>
                      <span className="text-white font-semibold">
                        Confident
                      </span>
                    </div>
                  </div>
                )}

                {/* Mic Indicator */}
                {isMicEnabled && listening && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-red-500/90 backdrop-blur-xl px-4 py-2 rounded-xl">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">
                      Recording...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Avatar */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI Interviewer
                </h3>
                <button
                  onClick={
                    isAvatarSpeaking
                      ? stopSpeaking
                      : () => speakQuestion(currentQuestion?.question)
                  }
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  {isAvatarSpeaking ? (
                    <VolumeX size={20} className="text-white" />
                  ) : (
                    <Volume2 size={20} className="text-white" />
                  )}
                </button>
              </div>

              <div className="relative aspect-video bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Animated AI Avatar */}
                <div
                  className={`text-9xl transition-transform duration-300 ${
                    isAvatarSpeaking ? "scale-110" : "scale-100"
                  }`}
                >
                  🤖
                </div>

                {/* Speaking Animation */}
                {isAvatarSpeaking && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 bg-white rounded-full animate-wave"
                        style={{
                          height: "20px",
                          animationDelay: `${i * 0.1}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Question Display */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Question {currentQuestionIndex + 1} of {interviewData?.performance?.totalQuestions || 0}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm text-purple-200 font-semibold border border-purple-500/50">
                    {currentQuestion?.difficulty || "Medium"}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm text-blue-200 font-semibold border border-blue-500/50">
                    {currentQuestion?.type || "Technical"}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mb-4 border border-white/10">
                <p className="text-white text-lg leading-relaxed">
                  {currentQuestion?.question || "Loading question..."}
                </p>
              </div>

              {/* Hint Section */}
              {showHint && currentHint && (
                <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-4 mb-4 animate-slideDown">
                  <div className="flex items-start gap-3">
                    <Lightbulb
                      className="text-yellow-400 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <div className="text-yellow-400 font-bold mb-1">
                        Hint {hintsUsed}
                      </div>
                      <p className="text-white/90">{currentHint}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleGetHint}
                  disabled={
                    !currentQuestion?.hints ||
                    hintsUsed >= currentQuestion?.hints?.length
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all border border-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lightbulb size={18} />
                  Get Hint (-5 pts)
                </button>
                <span className="text-white/60 text-sm">
                  {currentQuestion?.hints?.length - hintsUsed || 0} hints
                  remaining
                </span>
              </div>
            </div>

            {/* Answer Input */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Your Answer</h3>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use voice input..."
                className="w-full h-40 bg-white/5 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none resize-none"
              ></textarea>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-white/60">
                  {answer.split(" ").filter((w) => w).length} words
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSkipQuestion}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl transition-all border border-orange-500/30"
                  >
                    <SkipForward size={18} />
                    Skip
                  </button>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Send size={18} />
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Metrics Sidebar */}
          
          <LiveMetrics />
          
        </div>
      </div>
    </div>
  );
}
