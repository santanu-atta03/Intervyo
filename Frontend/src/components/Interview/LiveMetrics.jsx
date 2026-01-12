// src/components/interview/LiveMetrics.jsx

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { motion } from "framer-motion";
import {
  BarChart3,
  MessageSquare,
  Zap,
  Brain,
  Clock,
  Lightbulb,
  Video,
  Mic,
} from "lucide-react";
import {
  MicOff,
  VideoOff,
  Send,
  SkipForward,
  Pause,
  Play,
  Camera,
  Volume2,
  VolumeX,
} from "lucide-react";

const LiveMetrics = () => {
  const { interviewData, metrics, progress } = useSelector(
    (state) => state.interview
  );
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const webcamRef = useRef(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const metricsData = [
    {
      label: "Technical",
      value: metrics.technical,
      icon: BarChart3,
      color: "#667eea",
    },
    {
      label: "Communication",
      value: metrics.communication,
      icon: MessageSquare,
      color: "#10b981",
    },
    {
      label: "Confidence",
      value: metrics.confidence,
      icon: Zap,
      color: "#f59e0b",
    },
    {
      label: "Problem Solving",
      value: metrics.problemSolving,
      icon: Brain,
      color: "#ef4444",
    },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (interviewData && interviewData.timeRemaining) {
      setTimeRemaining(interviewData.timeRemaining);
    }
  }, [interviewData]);

  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeElapsed((prevElapsed) => prevElapsed + 1);
        setTimeRemaining((prevRemaining) => {
          if (prevRemaining <= 1) {
            clearInterval(timer);
            // Optional: Trigger end-of-interview logic here
          }
          return prevRemaining - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isPaused]);

  // Toggle microphone
  const toggleMic = () => {
    if (isMicEnabled) {
      SpeechRecognition.stopListening();
      setIsMicEnabled(false);
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      setIsMicEnabled(true);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(
        "Browser does not support speech recognition. Please use Chrome."
      );
    }
  }, [browserSupportsSpeechRecognition]);

  return (
    <div className="live-metrics">
      <div className="metrics-header">
        <BarChart3 className="w-5 h-5" />
        <h3>Live Metrics</h3>
      </div>

      <div className="metrics-list">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              className="metric-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="metric-label">
                <Icon className="w-4 h-4" style={{ color: metric.color }} />
                <span>{metric.label}</span>
              </div>
              <div className="metric-bar">
                <motion.div
                  className="metric-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ background: metric.color }}
                />
              </div>
              <span className="metric-value">{metric.value}%</span>
            </motion.div>
          );
        })}
      </div>

      <div className="statistics-section">
        <h4>Statistics</h4>
        <div className="stat-item">
          <span>Questions Answered</span>
          <span className="stat-value">
            {progress.answered} / {progress.total}
          </span>
        </div>
        <div className="stat-item">
          <span>Hints Used</span>
          <span className="stat-value hint-value">
            <Lightbulb className="w-4 h-4" />
            {interviewData?.performance?.hintsUsed}
          </span>
        </div>
        <div className="stat-item">
          <span>Time Elapsed</span>
          <span className="stat-value time-value">
            <Clock className="w-4 h-4" />
            {formatTime(timeElapsed || 0)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Progress</span>
          <span>{progress.percentage}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {/* <p className="progress-text">
          {progress.answered} of {progress.total} questions completed
        </p> */}
      </div>
      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Controls</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
              isVideoEnabled
                ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                : "bg-red-500/20 border-2 border-red-500/50 text-red-400"
            }`}
          >
            {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            <span className="text-sm font-semibold">
              {isVideoEnabled ? "Camera On" : "Camera Off"}
            </span>
          </button>

          <button
            onClick={toggleMic}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
              isMicEnabled
                ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                : "bg-red-500/20 border-2 border-red-500/50 text-red-400"
            }`}
          >
            {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            <span className="text-sm font-semibold">
              {isMicEnabled ? "Mic On" : "Mic Off"}
            </span>
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex flex-col items-center gap-2 p-4 bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-400 rounded-xl transition-all col-span-2"
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
            <span className="text-sm font-semibold">
              {isPaused ? "Resume" : "Pause"}
            </span>
          </button>
        </div>

        {!browserSupportsSpeechRecognition && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-300 text-xs">
              ⚠️ Speech recognition not supported. Please use Chrome browser.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMetrics;
