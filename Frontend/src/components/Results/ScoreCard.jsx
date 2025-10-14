import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, MinusCircle, Clock, Lightbulb } from 'lucide-react';

const ScoreCard = ({ summary }) => {
  const stats = [
    {
      icon: CheckCircle,
      label: 'Correct',
      value: summary.correctAnswers,
      color: 'green',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: MinusCircle,
      label: 'Partial',
      value: summary.partialAnswers,
      color: 'yellow',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: XCircle,
      label: 'Incorrect',
      value: summary.incorrectAnswers,
      color: 'red',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: Clock,
      label: 'Avg Time',
      value: `${summary.averageTimePerQuestion}s`,
      color: 'blue',
      gradient: 'from-blue-400 to-indigo-500'
    }
  ];

  return (
    <motion.div
      className="score-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3>Performance Summary</h3>
      </div>

      <div className="score-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`stat-icon bg-gradient-to-br ${stat.gradient}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="score-details">
        <div className="detail-row">
          <span>Total Questions</span>
          <span className="detail-value">{summary.totalQuestions}</span>
        </div>
        <div className="detail-row">
          <span>Questions Answered</span>
          <span className="detail-value">{summary.questionsAnswered}</span>
        </div>
        <div className="detail-row">
          <span>Questions Skipped</span>
          <span className="detail-value">{summary.questionsSkipped}</span>
        </div>
        <div className="detail-row">
          <span>Hints Used</span>
          <span className="detail-value">
            <Lightbulb className="w-4 h-4 inline mr-1" />
            {summary.totalHintsUsed}
          </span>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="progress-ring-container">
        <svg className="progress-ring" width="120" height="120">
          <circle
            className="progress-ring-circle-bg"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
          />
          <motion.circle
            className="progress-ring-circle"
            stroke={summary.passed ? '#10b981' : '#ef4444'}
            strokeWidth="8"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
            initial={{ strokeDashoffset: 327 }}
            animate={{ 
              strokeDashoffset: 327 - (327 * summary.overallScore) / 100 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="progress-text1">
          <span className="progress-score">{summary.overallScore}%</span>
          <span className="progress-label">Score</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreCard;