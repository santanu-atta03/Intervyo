// src/slices/interviewSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentInterview: null,
  interviewConfig: {
    domain: "",
    subDomain: "",
    interviewType: "technical",
    difficulty: "medium",
    duration: 30,
    targetCompany: "",
    customQuestions: false,
    resume: null,
    questions: [],
  },
  interviewData: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  answers: [],
  metrics: {
    eyeContact: {
      timeline: [],
    },
    confidence: [],
    emotionTimeline: [],
  },
  performance: {
    categoryScores: {
      technical: 0,
      communication: 0,
      problemSolving: 0,
      confidence: 0,
    },
    overallScore: 0,
    percentile: 0,
    totalQuestions: 0,
    questionsAnswered: 0,
    questionsSkipped: 0,
    hintsUsed: 0,
  },
  progress: {
    answered: 0,
    total: 0,
    percentage: 0,
  },
  isRecording: false,
  timeRemaining: 0,
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setInterviewConfig(state, action) {
      state.interviewConfig = { ...state.interviewConfig, ...action.payload };
    },
    setCurrentInterview(state, action) {
      state.currentInterview = action.payload;
    },
    setInterviewData(state, action) {
      state.interviewData = action.payload;
      state.currentQuestion = action.payload?.currentQuestion || null;
      state.timeRemaining = action.payload?.timeRemaining || 0;
      state.currentQuestionIndex = 0;

      // Initialize metrics from DB structure
      if (action.payload?.metrics) {
        state.metrics = {
          eyeContact: action.payload.metrics.eyeContact || { timeline: [] },
          confidence: action.payload.metrics.confidence || [],
          emotionTimeline: action.payload.metrics.emotionTimeline || [],
        };
      }

      // Initialize performance from DB
      // Initialize performance from DB
      // Initialize performance from DB
      if (action.payload?.performance) {
        state.performance = {
          ...state.performance,
          ...action.payload.performance,
        };
        state.progress = {
          answered: action.payload.performance.questionsAnswered || 0,
          total: action.payload.performance.totalQuestions || 0,
          percentage: action.payload.performance.totalQuestions
            ? Math.round(
                (action.payload.performance.questionsAnswered /
                  action.payload.performance.totalQuestions) *
                  100,
              )
            : 0,
        };
      }
    },
    setCurrentQuestion(state, action) {
      state.currentQuestion = action.payload;
    },
    setCurrentQuestionIndex(state, action) {
      state.currentQuestionIndex = action.payload;
    },
    addAnswer(state, action) {
      state.answers.push(action.payload);
    },
    updateAnswer(state, action) {
      const index = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId,
      );
      if (index !== -1) {
        state.answers[index] = { ...state.answers[index], ...action.payload };
      } else {
        state.answers.push(action.payload);
      }
    },
    updateMetrics(state, action) {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    updatePerformance(state, action) {
      state.performance = { ...state.performance, ...action.payload };
    },
    updateCategoryScores(state, action) {
      state.performance.categoryScores = {
        ...state.performance.categoryScores,
        ...action.payload,
      };
    },
    updateProgress(state, action) {
      state.progress = {
        answered: action.payload.answered || state.progress.answered,
        total: action.payload.total || state.progress.total,
        percentage: action.payload.percentage || state.progress.percentage,
      };
    },
    setIsRecording(state, action) {
      state.isRecording = action.payload;
    },
    setTimeRemaining(state, action) {
      state.timeRemaining = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetInterview(state) {
      return initialState;
    },
  },
});

export const {
  setInterviewConfig,
  setCurrentInterview,
  setInterviewData,
  setCurrentQuestion,
  setCurrentQuestionIndex,
  addAnswer,
  updateAnswer,
  updateMetrics,
  updatePerformance,
  updateCategoryScores,
  updateProgress,
  setIsRecording,
  setTimeRemaining,
  setLoading,
  setError,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
