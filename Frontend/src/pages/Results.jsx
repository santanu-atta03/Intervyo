import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle,
  Clock3,
  Download,
  Lightbulb,
  Target,
  Trophy,
  TrendingUp,
  ArrowLeft,
  Printer,
  RefreshCw,
} from "lucide-react";

import { completeInterview } from "../services/operations/aiInterviewApi";
import { ThemeContext } from "../components/shared/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

import ScoreCard from "../components/Results/ScoreCard";
import PerformanceChart from "../components/Results/PerformanceChart";
import CategoryBreakdown from "../components/Results/CategoryBreakdown";
import DetailedFeedback from "../components/Results/DetailedFeedback";
import ImprovementPlan from "../components/Results/ImprovementPlan";
import QuestionAnalysis from "../components/Results/QuestionAnalysis";
import CertificateSection from "../components/Results/CertificateSection";

const RESULTS_CSS = `
.results-root {
  --rs-ink: #111111;
  --rs-on-ink: #ffffff;
  --rs-canvas: #ffffff;
  --rs-cloud: #f5f5f5;
  --rs-hairline: #cacacb;
  --rs-hairline-soft: #e5e5e5;
  --rs-charcoal: #39393b;
  --rs-mute: #707072;
  --rs-success: #007d48;
  --rs-danger: #d30005;
  --rs-warning: #a16207;
  --rs-ease: cubic-bezier(0.22, 1, 0.36, 1);

  min-height: 100vh;
  background: var(--rs-canvas);
  color: var(--rs-ink);
  font-family: "Helvetica Now Text", "Helvetica Neue", Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.results-root[data-rs-theme="dark"] {
  --rs-ink: #ffffff;
  --rs-on-ink: #111111;
  --rs-canvas: #111111;
  --rs-cloud: #1f1f21;
  --rs-hairline: #39393b;
  --rs-hairline-soft: #2a2a2c;
  --rs-charcoal: #cacacb;
  --rs-mute: #9e9ea0;
  --rs-success: #1eaa52;
  --rs-danger: #ff5b61;
  --rs-warning: #e5ad36;
}

.results-root *,
.results-root *::before,
.results-root *::after {
  box-sizing: border-box;
}

.results-root button {
  font: inherit;
  cursor: pointer;
}

.results-root button:disabled {
  cursor: not-allowed;
}

.results-root :is(button, a):focus-visible {
  outline: 2px solid var(--rs-ink);
  outline-offset: 3px;
}

.results-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px 80px;
}

.results-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 72px;
  display: flex;
  align-items: center;
  background: color-mix(in srgb, var(--rs-canvas) 90%, transparent);
  border-bottom: 1px solid var(--rs-hairline-soft);
  backdrop-filter: blur(18px);
}

.results-header-inner {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.results-header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.results-brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--rs-ink);
  color: var(--rs-on-ink);
  font-size: 12px;
  font-weight: 500;
}

.results-header-title {
  font-size: 15px;
  font-weight: 500;
}

.results-header-subtitle {
  margin-top: 2px;
  color: var(--rs-mute);
  font-size: 12px;
}

.results-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.results-btn {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  transition:
    transform .2s var(--rs-ease),
    background-color .25s ease,
    opacity .25s ease;
}

.results-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.results-btn:active:not(:disabled) {
  transform: scale(.97);
}

.results-btn-primary {
  background: var(--rs-ink);
  color: var(--rs-on-ink);
}

.results-btn-primary:hover:not(:disabled) {
  background: var(--rs-charcoal);
}

.results-btn-secondary {
  background: var(--rs-cloud);
  color: var(--rs-ink);
}

.results-btn-secondary:hover:not(:disabled) {
  background: var(--rs-hairline-soft);
}

.results-btn:disabled {
  opacity: .45;
}

.results-main {
  padding-top: 48px;
}

.results-hero {
  position: relative;
  overflow: hidden;
  padding: 48px;
  background: var(--rs-canvas);
  border: 1px solid var(--rs-hairline-soft);
  box-shadow: 0 22px 70px rgba(17, 17, 17, .07);
}

.results-hero::after {
  content: "";
  position: absolute;
  right: -130px;
  bottom: -180px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: rgba(124, 58, 237, .08);
  filter: blur(55px);
  pointer-events: none;
}

.results-hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  align-items: center;
  gap: 36px;
}

.results-score-ring {
  width: 168px;
  height: 168px;
  display: grid;
  place-items: center;
  border: 1px solid var(--rs-hairline);
  border-radius: 50%;
  background: var(--rs-cloud);
}

.results-score-ring.is-passed {
  border-color: var(--rs-success);
}

.results-score-ring.is-failed {
  border-color: var(--rs-warning);
}

.results-score-number {
  display: block;
  text-align: center;
  font-size: 48px;
  font-weight: 500;
  line-height: .95;
  letter-spacing: -.05em;
}

.results-score-total {
  display: block;
  margin-top: 7px;
  color: var(--rs-mute);
  text-align: center;
  font-size: 13px;
}

.results-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  padding: 0 13px;
  border: 1px solid var(--rs-hairline);
  border-radius: 999px;
  color: var(--rs-mute);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.results-hero h1 {
  max-width: 760px;
  margin: 18px 0 0;
  font-size: clamp(32px, 5vw, 58px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -.05em;
  text-transform: uppercase;
}

.results-hero-description {
  max-width: 720px;
  margin: 14px 0 0;
  color: var(--rs-mute);
  font-size: 17px;
  line-height: 1.55;
}

.results-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}

.results-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid var(--rs-hairline);
  border-radius: 999px;
  color: var(--rs-mute);
  font-size: 13px;
}

.results-meta-item strong {
  color: var(--rs-ink);
  font-weight: 500;
}

.results-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  color: var(--rs-success);
  font-size: 14px;
  font-weight: 500;
}

.results-status.is-failed {
  color: var(--rs-warning);
}

.results-tabs {
  position: sticky;
  top: 72px;
  z-index: 30;
  display: flex;
  gap: 5px;
  overflow-x: auto;
  margin: 24px 0;
  padding: 6px;
  background: color-mix(in srgb, var(--rs-canvas) 94%, transparent);
  border: 1px solid var(--rs-hairline-soft);
  backdrop-filter: blur(18px);
}

.results-tab {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 0 0 auto;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--rs-mute);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color .25s ease, color .25s ease;
}

.results-tab:hover {
  background: var(--rs-cloud);
  color: var(--rs-ink);
}

.results-tab.is-active {
  background: var(--rs-ink);
  color: var(--rs-on-ink);
}

.results-tab:disabled {
  opacity: .38;
}

.results-content {
  min-height: 320px;
}

.results-content > div {
  animation: results-enter .45s var(--rs-ease) both;
}

.results-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
}

.results-loading,
.results-error {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--rs-canvas);
}

.results-state-card {
  width: min(100%, 480px);
  padding: 40px;
  text-align: center;
  background: var(--rs-canvas);
  border: 1px solid var(--rs-hairline-soft);
  box-shadow: 0 22px 70px rgba(17, 17, 17, .08);
}

.results-state-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: var(--rs-cloud);
  color: var(--rs-ink);
}

.results-state-card h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 500;
}

.results-state-card p {
  margin: 12px 0 24px;
  color: var(--rs-mute);
  line-height: 1.55;
}

.results-spinner {
  width: 54px;
  height: 54px;
  margin: 0 auto 20px;
  border: 3px solid var(--rs-hairline-soft);
  border-top-color: var(--rs-ink);
  border-radius: 50%;
  animation: results-spin 1s linear infinite;
}

.results-confetti {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  pointer-events: none;
}

.results-confetti-piece {
  position: absolute;
  top: -16px;
  width: 7px;
  height: 15px;
  background: var(--rs-ink);
  animation: results-fall 4s linear both;
}

.results-confetti-piece:nth-child(3n) {
  background: var(--rs-success);
}

.results-confetti-piece:nth-child(4n) {
  background: var(--rs-warning);
}

@keyframes results-enter {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes results-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes results-fall {
  from {
    opacity: 0;
    transform: translateY(-20px) rotate(0);
  }

  15% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translateY(105vh) rotate(540deg);
  }
}

@media (max-width: 900px) {
  .results-container,
  .results-header-inner {
    padding-left: 32px;
    padding-right: 32px;
  }

  .results-hero {
    padding: 36px 28px;
  }
}

@media (max-width: 640px) {
  .results-container,
  .results-header-inner {
    padding-left: 16px;
    padding-right: 16px;
  }

  .results-header {
    height: auto;
    min-height: 68px;
  }

  .results-header-inner {
    min-height: 68px;
  }

  .results-header-subtitle {
    display: none;
  }

  .results-main {
    padding-top: 24px;
  }

  .results-hero {
    padding: 28px 20px;
  }

  .results-hero-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .results-score-ring {
    width: 140px;
    height: 140px;
    margin: 0 auto;
  }

  .results-score-number {
    font-size: 40px;
  }

  .results-hero h1 {
    font-size: 34px;
  }

  .results-hero-description {
    font-size: 15px;
  }

  .results-tabs {
    top: 68px;
  }

  .results-tab {
    padding: 0 13px;
  }

  .results-tab span {
    display: none;
  }

  .results-state-card {
    padding: 30px 20px;
  }
}

@media print {
  .results-header,
  .results-tabs,
  .results-actions,
  .results-confetti {
    display: none !important;
  }

  .results-container {
    max-width: none;
    padding: 0;
  }

  .results-hero {
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .results-root *,
  .results-root *::before,
  .results-root *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "feedback", label: "Feedback", icon: Lightbulb },
  { id: "improvement", label: "Improvement Plan", icon: Target },
  { id: "questions", label: "Questions", icon: BookOpen },
  { id: "certificate", label: "Certificate", icon: Award },
];

const calculateGrade = (score) => {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 75) return "C+";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const calculatePercentile = (score) => {
  if (score >= 90) return 95;
  if (score >= 80) return 85;
  if (score >= 70) return 70;
  if (score >= 60) return 55;
  if (score >= 50) return 40;
  return 25;
};

const generateImprovementGoals = (improvements, timeframe) => {
  if (!improvements?.length) return [];

  const config = {
    short: { period: "1–2 weeks", count: 2 },
    medium: { period: "1–2 months", count: 3 },
    long: { period: "3–6 months", count: 2 },
  }[timeframe];

  const priorities = ["high", "medium", "low"];

  return improvements.slice(0, config.count).map((improvement, index) => ({
    title: improvement,
    description: `Focus on: ${improvement}`,
    priority: priorities[index % priorities.length],
    estimatedTime: config.period,
    resources: [
      "Online tutorials and documentation",
      "Practice problems and exercises",
      "Code review and peer feedback",
    ],
  }));
};

const generateCourseRecommendations = (role) => {
  const courses = {
    "Software Engineer": [
      {
        title: "Advanced Data Structures",
        platform: "Coursera",
        level: "Intermediate",
        duration: "6 weeks",
        url: "#",
      },
      {
        title: "System Design Fundamentals",
        platform: "Udemy",
        level: "Advanced",
        duration: "8 weeks",
        url: "#",
      },
    ],
    "Frontend Developer": [
      {
        title: "React Advanced Patterns",
        platform: "Frontend Masters",
        level: "Advanced",
        duration: "4 weeks",
        url: "#",
      },
      {
        title: "Modern CSS and Design Systems",
        platform: "Udemy",
        level: "Intermediate",
        duration: "5 weeks",
        url: "#",
      },
    ],
  };

  return courses[role] || courses["Software Engineer"];
};

const generatePracticeResources = () => [
  {
    title: "LeetCode Practice Problems",
    type: "Coding Platform",
    description:
      "Daily coding challenges to improve problem-solving skills.",
    url: "https://leetcode.com",
  },
  {
    title: "System Design Primer",
    type: "GitHub Repository",
    description: "A comprehensive guide to system design concepts.",
    url: "https://github.com/donnemartin/system-design-primer",
  },
  {
    title: "Interview Practice Sessions",
    type: "Mock Interviews",
    description:
      "Practice with peers or mentors for realistic interview experience.",
    url: "#",
  },
];

const transformResultsData = (response) => {
  if (!response) return null;

  const { session, feedback, certificate } = response;
  const interviewConfig = session?.interviewId?.config || {};

  const interviewRole =
    session?.interviewId?.role ||
    interviewConfig.subDomain ||
    interviewConfig.domain ||
    "Interview";

  const overallScore = Number(
    session?.overallScore ?? feedback?.overallScore ?? 0,
  );

  const questionEvaluations = session?.questionEvaluations || [];
  const answeredEvaluations = questionEvaluations.filter(
    (question) =>
      typeof question.userAnswer === "string" &&
      question.userAnswer.trim().length > 0,
  );
  const totalQuestions =
    session?.stats?.totalQuestions ??
    session?.conversation?.filter((message) => message.type === "question")
      .length ??
    questionEvaluations.length;
  const passed = overallScore >= 60;

  const technicalScore =
    session?.technicalScore ?? feedback?.technicalScore ?? 0;

  const communicationScore =
    session?.communicationScore ?? feedback?.communicationScore ?? 0;

  const problemSolvingScore =
    session?.problemSolvingScore ?? feedback?.problemSolvingScore ?? 0;

  return {
    results: {
      summary: {
        overallScore,
        grade: calculateGrade(overallScore),
        percentile: calculatePercentile(overallScore),
        passed,
        totalQuestions,
        questionsAnswered: answeredEvaluations.length,
        questionsSkipped: Math.max(
          0,
          totalQuestions - answeredEvaluations.length,
        ),
        correctAnswers: answeredEvaluations.filter(
          (question) => question.score >= 8,
        ).length,
        partialAnswers: answeredEvaluations.filter(
          (question) => question.score >= 5 && question.score < 8,
        ).length,
        incorrectAnswers: answeredEvaluations.filter(
          (question) => question.score < 5,
        ).length,
      },

      categoryBreakdown: {
        technical: {
          score: technicalScore * 10,
          questionsAnswered: answeredEvaluations.filter(
            (question) => question.category === "technical",
          ).length,
          strengths: feedback?.strengths?.slice(0, 3) || [],
          weaknesses: feedback?.improvements?.slice(0, 3) || [],
        },
        communication: {
          score: communicationScore * 10,
          clarity: communicationScore * 10,
          articulation: Math.max(0, communicationScore * 10 - 5),
          confidence: communicationScore * 10,
        },
        problemSolving: {
          score: problemSolvingScore * 10,
          analyticalThinking: problemSolvingScore * 10,
          creativity: Math.min(100, problemSolvingScore * 10 + 5),
          efficiency: Math.max(0, problemSolvingScore * 10 - 3),
        },
      },

      detailedFeedback: {
        overallAssessment:
          feedback?.summary || session?.feedback?.summary || "",
        strengths:
          feedback?.strengths || session?.feedback?.strengths || [],
        weaknesses:
          feedback?.improvements ||
          session?.feedback?.improvements ||
          [],
        keyHighlights:
          feedback?.keyHighlights ||
          session?.feedback?.keyHighlights ||
          [],
        areasOfConcern:
          feedback?.areasOfConcern ||
          session?.feedback?.areasOfConcern ||
          [],
        technicalAnalysis:
          feedback?.technicalAnalysis ||
          session?.feedback?.technicalAnalysis || {
            coreConcepts: "Not available",
            problemSolvingApproach: "Not available",
            codeQuality: "Not available",
            bestPractices: "Not available",
          },
        behavioralAnalysis:
          feedback?.behavioralAnalysis ||
          session?.feedback?.behavioralAnalysis || {
            communication: "Not available",
            confidence: "Not available",
            professionalism: "Not available",
            adaptability: "Not available",
          },
      },

      improvementPlan: {
        shortTerm: generateImprovementGoals(
          feedback?.improvements,
          "short",
        ),
        mediumTerm: generateImprovementGoals(
          feedback?.improvements,
          "medium",
        ),
        longTerm: generateImprovementGoals(
          feedback?.improvements,
          "long",
        ),
        recommendedCourses: generateCourseRecommendations(interviewRole),
        practiceResources: generatePracticeResources(),
      },

      questionAnalysis: questionEvaluations.map((question, index) => ({
        questionId: question._id || `question-${index}`,
        questionNumber: question.questionNumber || index + 1,
        question: question.question || "Question unavailable",
        yourAnswer: question.userAnswer || "Not answered",
        score: (question.score || 0) * 10,
        maxScore: 100,
        feedback: question.feedback || "",
        category: question.category || "general",
        strengths: question.strengths || [],
        improvements: question.improvements || [],
        timeSpent: question.timeSpent || 0,
      })),

      performanceChart: questionEvaluations.map((question, index) => ({
        questionNumber: question.questionNumber || index + 1,
        score: (question.score || 0) * 10,
        avgScore: overallScore,
        category: question.category,
      })),

      certificate: certificate || null,
    },

    config: {
      domain: interviewConfig.domain || interviewRole,
      subDomain: interviewConfig.subDomain || "",
      difficulty:
        session?.interviewId?.difficulty ||
        interviewConfig.difficulty ||
        "medium",
      interviewType: interviewConfig.interviewType || "AI",
    },

    duration:
      session?.interviewId?.duration ||
      interviewConfig.duration ||
      0,

    completedAt: session?.updatedAt || new Date(),
  };
};

const Results = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { theme } = useContext(ThemeContext);

  const [currentResults, setCurrentResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showConfetti, setShowConfetti] = useState(false);

  const rsTheme = theme === "dark" ? "dark" : "light";

  const loadResults = async () => {
    if (!interviewId) {
      navigate("/dashboard");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await completeInterview(interviewId, token);
      const transformedResults = transformResultsData(response);

      setCurrentResults(transformedResults);

      if (transformedResults?.results?.summary?.passed) {
        setShowConfetti(true);

        window.setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } catch (requestError) {
      console.error("Error loading interview results:", requestError);
      setError(
        requestError.message || "Failed to load interview results.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [interviewId, token]);

  const resultData = currentResults?.results;
  const summary = resultData?.summary;
  const config = currentResults?.config;
  const duration = currentResults?.duration;
  const completedAt = currentResults?.completedAt;

  const currentTab = useMemo(
    () => TABS.find((tab) => tab.id === activeTab),
    [activeTab],
  );

  if (loading) {
    return (
      <div className="results-root" data-rs-theme={rsTheme}>
        <style>{RESULTS_CSS}</style>

        <div className="results-loading">
          <div className="results-state-card">
            <div className="results-spinner" />
            <h1>Analyzing your performance</h1>
            <p>
              We are preparing your interview report and personalized
              feedback.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-root" data-rs-theme={rsTheme}>
        <style>{RESULTS_CSS}</style>

        <div className="results-error">
          <div className="results-state-card">
            <div className="results-state-icon">
              <AlertCircle size={28} />
            </div>

            <h1>Unable to load results</h1>
            <p>{error}</p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="results-btn results-btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft size={16} />
                Dashboard
              </button>

              <button
                type="button"
                className="results-btn results-btn-primary"
                onClick={loadResults}
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentResults || !resultData || !summary) {
    return (
      <div className="results-root" data-rs-theme={rsTheme}>
        <style>{RESULTS_CSS}</style>

        <div className="results-error">
          <div className="results-state-card">
            <div className="results-state-icon">
              <AlertCircle size={28} />
            </div>

            <h1>No results available</h1>
            <p>Please complete the interview before viewing the report.</p>

            <button
              type="button"
              className="results-btn results-btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <ScoreCard summary={summary} />

            {resultData.categoryBreakdown && (
              <CategoryBreakdown
                categories={resultData.categoryBreakdown}
              />
            )}
          </div>
        );

      case "performance":
        return (
          <div className="space-y-6">
            {resultData.performanceChart?.length > 0 ? (
              <PerformanceChart data={resultData.performanceChart} />
            ) : (
              <EmptyTabState message="Performance data is not available yet." />
            )}
          </div>
        );

      case "feedback":
        return (
          <div className="space-y-6">
            {resultData.detailedFeedback ? (
              <DetailedFeedback feedback={resultData.detailedFeedback} />
            ) : (
              <EmptyTabState message="Detailed feedback is not available yet." />
            )}
          </div>
        );

      case "improvement":
        return (
          <div className="space-y-6">
            {resultData.improvementPlan ? (
              <ImprovementPlan plan={resultData.improvementPlan} />
            ) : (
              <EmptyTabState message="Your improvement plan is not available yet." />
            )}
          </div>
        );

      case "questions":
        return (
          <div className="space-y-6">
            {resultData.questionAnalysis?.length > 0 ? (
              <QuestionAnalysis
                questions={resultData.questionAnalysis}
              />
            ) : (
              <EmptyTabState message="Question analysis is not available yet." />
            )}
          </div>
        );

      case "certificate":
        return resultData.certificate ? (
          <div className="space-y-6">
            <CertificateSection
              certificate={resultData.certificate}
              summary={summary}
              config={config}
              completedAt={completedAt}
            />
          </div>
        ) : (
          <EmptyTabState message="A certificate is not available for this interview." />
        );

      default:
        return null;
    }
  };

  return (
    <div className="results-root" data-rs-theme={rsTheme}>
      <style>{RESULTS_CSS}</style>

      {showConfetti && (
        <div className="results-confetti" aria-hidden="true">
          {Array.from({ length: 42 }).map((_, index) => (
            <span
              key={index}
              className="results-confetti-piece"
              style={{
                left: `${(index * 23) % 100}%`,
                animationDelay: `${(index % 8) * 120}ms`,
                animationDuration: `${3.2 + (index % 4) * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      <header className="results-header">
        <div className="results-header-inner">
          <div className="results-header-brand">
            <button
              type="button"
              className="results-btn results-btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">
                Back to dashboard
              </span>
            </button>

            <div className="results-brand-mark">IR</div>

            <div className="hidden sm:block">
              <div className="results-header-title">
                Interview results
              </div>
              <div className="results-header-subtitle">
                Review your performance and next steps
              </div>
            </div>
          </div>

          <div className="results-header-actions">
            <ThemeToggle />

            <button
              type="button"
              className="results-btn results-btn-secondary"
              onClick={() => window.print()}
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </header>

      <main className="results-container results-main">
        <Motion.section
          className="results-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="results-hero-content">
            <div
              className={`results-score-ring ${
                summary.passed ? "is-passed" : "is-failed"
              }`}
            >
              <div>
                <span className="results-score-number">
                  {Math.round(summary.overallScore || 0)}
                </span>
                <span className="results-score-total">out of 100</span>
              </div>
            </div>

            <div>
              <span className="results-kicker">
                {summary.passed ? (
                  <CheckCircle size={14} />
                ) : (
                  <Activity size={14} />
                )}
                Interview complete
              </span>

              <h1>
                {summary.passed
                  ? "Strong work. Keep building."
                  : "Good foundation. Keep improving."}
              </h1>

              <p className="results-hero-description">
                Your performance report is ready. Review your strengths,
                identify improvement areas, and use the plan below to
                prepare for your next interview.
              </p>

              <div className="results-meta">
                <span className="results-meta-item">
                  <Target size={15} />
                  <strong>
                    {config.domain || "Interview"}
                    {config.subDomain
                      ? ` · ${config.subDomain}`
                      : ""}
                  </strong>
                </span>

                <span className="results-meta-item">
                  <Clock3 size={15} />
                  <strong>{duration || 0} min</strong>
                </span>

                <span className="results-meta-item">
                  <Check size={15} />
                  <strong>
                    {summary.questionsAnswered || 0} answered
                  </strong>
                </span>

                <span className="results-meta-item">
                  <Trophy size={15} />
                  <strong>Grade {summary.grade || "N/A"}</strong>
                </span>
              </div>

              <div
                className={`results-status ${
                  !summary.passed ? "is-failed" : ""
                }`}
              >
                {summary.passed ? (
                  <>
                    <CheckCircle size={17} />
                    You reached the passing score.
                  </>
                ) : (
                  <>
                    <TrendingUp size={17} />
                    Your next attempt can improve from here.
                  </>
                )}
              </div>
            </div>
          </div>
        </Motion.section>

        <nav
          className="results-tabs"
          aria-label="Results sections"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCertificate =
              tab.id === "certificate" && !resultData.certificate;

            return (
              <button
                key={tab.id}
                type="button"
                className={`results-tab ${
                  isActive ? "is-active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
                disabled={isCertificate}
                aria-current={isActive ? "page" : undefined}
                title={
                  isCertificate
                    ? "Certificate unavailable"
                    : tab.label
                }
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="results-content" aria-live="polite">
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentTab?.id || activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {renderTabContent()}
            </Motion.div>
          </AnimatePresence>
        </section>

        <div className="results-actions">
          <button
            type="button"
            className="results-btn results-btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            <Activity size={16} />
            Dashboard
          </button>

          <button
            type="button"
            className="results-btn results-btn-primary"
            onClick={() => window.print()}
          >
            <Download size={16} />
            Download report
          </button>
        </div>
      </main>
    </div>
  );
};

function EmptyTabState({ message }) {
  return (
    <div
      style={{
        minHeight: 220,
        display: "grid",
        placeItems: "center",
        padding: 32,
        border: "1px solid var(--rs-hairline-soft)",
        background: "var(--rs-cloud)",
        color: "var(--rs-mute)",
        textAlign: "center",
      }}
    >
      <div>
        <Activity
          size={28}
          style={{ margin: "0 auto 12px", opacity: 0.6 }}
        />
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

export default Results;