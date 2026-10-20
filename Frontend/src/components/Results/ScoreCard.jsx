import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock3,
  Lightbulb,
  MinusCircle,
  Trophy,
  XCircle,
} from "lucide-react";

import "../../styles/resultsComponents.css";

const ScoreCard = ({ summary = {} }) => {
  const overallScore = Number(summary.overallScore || 0);
  const circumference = 2 * Math.PI * 52;
  const scoreOffset =
    circumference - (circumference * Math.max(0, Math.min(100, overallScore))) / 100;

  const stats = [
    {
      icon: CheckCircle,
      label: "Correct",
      value: summary.correctAnswers ?? 0,
    },
    {
      icon: MinusCircle,
      label: "Partial",
      value: summary.partialAnswers ?? 0,
    },
    {
      icon: XCircle,
      label: "Incorrect",
      value: summary.incorrectAnswers ?? 0,
    },
    {
      icon: Clock3,
      label: "Avg. time",
      value:
        summary.averageTimePerQuestion !== undefined
          ? `${summary.averageTimePerQuestion}s`
          : "—",
    },
  ];

  return (
    <motion.section
      className="results-component"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="performance-summary-heading"
    >
      <div className="results-component-header">
        <span className="results-component-header-icon">
          <Trophy size={18} />
        </span>

        <div>
          <h3 id="performance-summary-heading">
            Performance summary
          </h3>
          <p className="results-component-subtitle">
            A concise view of how you performed in this interview.
          </p>
        </div>
      </div>

      <div className="results-score-stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              className="results-stat"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <span className="results-stat-icon">
                <Icon size={17} />
              </span>

              <div>
                <span className="results-stat-value">
                  {stat.value}
                </span>
                <span className="results-stat-label">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="results-score-layout">
        <div className="results-detail-list">
          <div className="results-detail-row">
            <span>Total questions</span>
            <span className="results-detail-value">
              {summary.totalQuestions ?? 0}
            </span>
          </div>

          <div className="results-detail-row">
            <span>Questions answered</span>
            <span className="results-detail-value">
              {summary.questionsAnswered ?? 0}
            </span>
          </div>

          <div className="results-detail-row">
            <span>Questions skipped</span>
            <span className="results-detail-value">
              {summary.questionsSkipped ?? 0}
            </span>
          </div>

          <div className="results-detail-row">
            <span>Hints used</span>
            <span className="results-detail-value">
              <Lightbulb size={14} />
              {summary.totalHintsUsed ?? 0}
            </span>
          </div>
        </div>

        <div className="results-ring-wrap">
          <svg
            className="results-ring"
            viewBox="0 0 120 120"
            role="img"
            aria-label={`Overall score: ${overallScore}%`}
          >
            <circle
              className="results-ring-background"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="8"
            />

            <motion.circle
              className="results-ring-progress"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke={
                summary.passed
                  ? "var(--rc-success)"
                  : "var(--rc-danger)"
              }
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: scoreOffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>

          <div className="results-ring-center">
            <span className="results-ring-score">
              {Math.round(overallScore)}%
            </span>
            <span className="results-ring-label">Score</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ScoreCard;