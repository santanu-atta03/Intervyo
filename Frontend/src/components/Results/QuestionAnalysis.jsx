// components/results/QuestionAnalysis.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, CheckCircle, XCircle, AlertCircle, ChevronDown,
  Clock, Lightbulb, TrendingUp, TrendingDown, Award, Tag
} from 'lucide-react';

const QuestionAnalysis = ({ questions }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [filterScore, setFilterScore] = useState('all');

  const getScoreCategory = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'needs-improvement';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return Award;
    if (score >= 40) return AlertCircle;
    return XCircle;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const filterQuestions = () => {
    if (filterScore === 'all') return questions;
    return questions.filter(q => {
      const category = getScoreCategory(q.score);
      return category === filterScore;
    });
  };

  const filteredQuestions = filterQuestions();

  const stats = {
    total: questions.length,
    excellent: questions.filter(q => q.score >= 80).length,
    good: questions.filter(q => q.score >= 60 && q.score < 80).length,
    fair: questions.filter(q => q.score >= 40 && q.score < 60).length,
    poor: questions.filter(q => q.score < 40).length,
    avgTime: Math.round(
      questions.reduce((sum, q) => sum + q.timeTaken, 0) / questions.length
    ),
    totalHints: questions.reduce((sum, q) => sum + q.hintsUsed, 0)
  };

  return (
    <div className="question-analysis">
      {/* Header */}
      <motion.div
        className="analysis-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <HelpCircle className="w-8 h-8 text-blue-500" />
        <div>
          <h2>Question-by-Question Analysis</h2>
          <p>Detailed breakdown of your answers and performance</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="stats-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stat-box">
          <div className="stat-icon total">
            <HelpCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Questions</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon excellent">
            <CheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.excellent}</span>
            <span className="stat-label">Excellent (80+)</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon good">
            <Award />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.good}</span>
            <span className="stat-label">Good (60-79)</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon fair">
            <AlertCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.fair}</span>
            <span className="stat-label">Fair (40-59)</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon poor">
            <XCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.poor}</span>
            <span className="stat-label">Needs Work (&lt;40)</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon time">
            <Clock />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.avgTime}s</span>
            <span className="stat-label">Avg Time</span>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        className="question-filter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span>Filter by performance:</span>
        <div className="filter-options">
          {[
            { value: 'all', label: 'All Questions' },
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'needs-improvement', label: 'Needs Work' }
          ].map(option => (
            <button
              key={option.value}
              className={`filter-option ${filterScore === option.value ? 'active' : ''}`}
              onClick={() => setFilterScore(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Questions List */}
      <div className="questions-list">
        {filteredQuestions.map((question, index) => {
          const isExpanded = expandedQuestion === index;
          const ScoreIcon = getScoreIcon(question.score);
          const scoreColor = getScoreColor(question.score);
          const scoreCategory = getScoreCategory(question.score);

          return (
            <motion.div
              key={question.questionId}
              className={`question-card ${scoreCategory}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                className="question-header"
                onClick={() => setExpandedQuestion(isExpanded ? null : index)}
              >
                <div className="header-left">
                  <span className="question-number">Q{index + 1}</span>
                  <div className="question-title">
                    <h3>{question.question}</h3>
                    {question.tags && question.tags.length > 0 && (
                      <div className="question-tags">
                        {question.tags.map((tag, idx) => (
                          <span key={idx} className="tag">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="header-right">
                  <div className="score-badge" style={{ background: `${scoreColor}20`, color: scoreColor }}>
                    <ScoreIcon className="w-5 h-5" />
                    <span>{question.score}/{question.maxScore}</span>
                  </div>
                  <ChevronDown
                    className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="question-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Metadata */}
                    <div className="question-metadata">
                      <div className="metadata-item">
                        <Clock className="w-4 h-4" />
                        <span>Time Taken: {question.timeTaken}s</span>
                      </div>
                      {question.hintsUsed > 0 && (
                        <div className="metadata-item">
                          <Lightbulb className="w-4 h-4" />
                          <span>Hints Used: {question.hintsUsed}</span>
                        </div>
                      )}
                    </div>

                    {/* Your Answer */}
                    <div className="answer-section">
                      <h4>Your Answer</h4>
                      <div className="answer-box">
                        <p>{question.yourAnswer}</p>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="feedback-section">
                      <h4>Feedback</h4>
                      <p className="feedback-text">{question.feedback}</p>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="strengths-improvements">
                      {question.strengths && question.strengths.length > 0 && (
                        <div className="strengths-box">
                          <h4>
                            <TrendingUp className="w-5 h-5" />
                            Strengths
                          </h4>
                          <ul>
                            {question.strengths.map((strength, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {strength}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {question.improvements && question.improvements.length > 0 && (
                        <div className="improvements-box">
                          <h4>
                            <TrendingDown className="w-5 h-5" />
                            Areas to Improve
                          </h4>
                          <ul>
                            {question.improvements.map((improvement, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                {improvement}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Model Answer */}
                    {question.modelAnswer && (
                      <div className="model-answer-section">
                        <h4>
                          <Award className="w-5 h-5" />
                          Model Answer
                        </h4>
                        <div className="model-answer-box">
                          <p>{question.modelAnswer}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <motion.div
          className="no-questions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HelpCircle className="w-16 h-16 text-gray-400" />
          <p>No questions match the selected filter</p>
        </motion.div>
      )}
    </div>
  );
};

export default QuestionAnalysis;