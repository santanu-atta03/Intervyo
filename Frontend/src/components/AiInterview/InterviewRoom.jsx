// ============================================
// COMPLETE DYNAMIC INTERVIEW ROOM
// File: src/components/AiInterview/InterviewRoom.jsx
// ============================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import {
  Code2, X, Play, Clock, Mic, MicOff, Video, VideoOff,
  Phone, Send, ChevronDown, Maximize2, Minimize2, AlertCircle,
  CheckCircle, TrendingUp, Award, Zap, Target, Brain, MessageSquare,
  FileCode, Activity, BarChart3
} from "lucide-react";
import {
  getInterviewById,
  getInterviewSession,
  startInterview,
} from "../../services/operations/aiInterviewApi";

/* ================= CONSTANTS ================= */
const MAX_ANSWER_CHARS = 500;
const SOCKET_URL = "https://intervyo.onrender.com";

const InterviewRoom = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  /* ================= CORE STATE ================= */
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  /* ================= INTERVIEW STATE ================= */
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("ready");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);

  /* ================= TIMER ================= */
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef(null);

  /* ================= MEDIA ================= */
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const videoRef = useRef(null);

  /* ================= SPEECH ================= */
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const recognitionRef = useRef(null);
  const transcriptAccumulatorRef = useRef("");
  const shouldRestartRecognition = useRef(false);

  /* ================= INIT ================= */
  useEffect(() => {
    init();
    return () => cleanup();
  }, [interviewId]);

  const init = async () => {
    const data = await getInterviewById(interviewId, token);
    setInterview(data);
    setTimeRemaining(data.duration * 60);
    setLoading(false);
  };

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (socket) socket.disconnect();
  };

  /* ================= SPEECH RECOGNITION ================= */
  useEffect(() => {
    if (!window.webkitSpeechRecognition) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      transcriptAccumulatorRef.current = "";
      setUserTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        event.results[i].isFinal ? final += transcript : interim += transcript;
      }

      if (final) transcriptAccumulatorRef.current += final;

      const combined = (transcriptAccumulatorRef.current + interim).slice(0, MAX_ANSWER_CHARS);
      setUserTranscript(combined);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  /* ================= SUBMIT ANSWER ================= */
  const handleSubmitAnswer = () => {
    const answer = transcriptAccumulatorRef.current.trim() || userTranscript.trim();

    if (!answer || answer.length < 5) return;
    if (answer.length > MAX_ANSWER_CHARS) {
      alert(`Maximum ${MAX_ANSWER_CHARS} characters allowed`);
      return;
    }

    socket.emit("candidate-answer", {
      sessionId: session._id,
      interviewId,
      answer,
    });

    setUserTranscript("");
    transcriptAccumulatorRef.current = "";
    setIsListening(false);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="h-screen bg-gray-950 text-white relative">
      {/* ================= TRANSCRIPT ================= */}
      {isListening && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-2/3 bg-blue-500/20 p-4 rounded-xl">
          <p className="text-lg break-words">{userTranscript}</p>

          <div className="flex justify-between mt-2 text-sm">
            <span className={userTranscript.length >= MAX_ANSWER_CHARS ? "text-red-400" : "text-blue-300"}>
              {userTranscript.length}/{MAX_ANSWER_CHARS} characters
            </span>

            {userTranscript.length >= MAX_ANSWER_CHARS && (
              <span className="text-red-400 font-semibold">
                Character limit reached
              </span>
            )}
          </div>
        </div>
      )}

      {/* ================= CONTROLS ================= */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        {!isListening && (
          <button
            onClick={() => recognitionRef.current.start()}
            className="px-6 py-3 bg-blue-600 rounded-xl"
          >
            Start Answering
          </button>
        )}

        {isListening && (
          <button
            onClick={handleSubmitAnswer}
            disabled={
              userTranscript.length < 5 ||
              userTranscript.length > MAX_ANSWER_CHARS
            }
            className="px-6 py-3 bg-green-600 rounded-xl disabled:opacity-50"
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;
