import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  CheckCircle,
  ChevronDown,
  Clock3,
  HelpCircle,
  XCircle,
} from "lucide-react";

import "../../styles/resultsComponents.css";

const SCORE_FILTERS = [
  { id: "all", label: "All" },
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
  { id: "needs-improvement", label: "Needs work" },
];

const safeNumber = (value) => Number(value) || 0;

const getScoreCategory = (score) => {
  const value = safeNumber(score);

  if (value >= 80) return "excellent";
  if (value >= 60) return "good";
  if (value >= 40) return "fair";
  return "needs-improvement";
};

const getScoreIcon = (score) => {
  const category = getScoreCategory(score);

  if (category === "excellent") return CheckCircle;
  if (category === "good") return Award;
  if (category === "fair") return AlertCircle;
  return XCircle;
};

const getScoreLabel = (score) => {
  const category = getScoreCategory(score);

  return {
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    "needs-improvement": "Needs work",
  }[category];
};

const QuestionAnalysis = ({
  questions = [],
  isLoading = false,
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [filterScore, setFilterScore] = useState("all");

  const normalizedQuestions = useMemo(
    () =>
      (Array.isArray(questions) ? questions : []).map(
        (question, index) => ({
          ...question,
          questionNumber:
            question.questionNumber || index + 1,
          score: safeNumber(question.score),
          timeTaken: safeNumber(
            question.timeTaken ?? question.timeSpent,
          ),
          question:
            question.question || "Question unavailable",
          yourAnswer:
            question.yourAnswer || "Not answered",
          feedback:
            question.feedback || "No feedback available.",
        }),
      ),
    [questions],
  );

  const filteredQuestions = useMemo(() => {
    if (filterScore === "all") {
      return normalizedQuestions;
    }

    return normalizedQuestions.filter(
      (question) =>
        getScoreCategory(question.score) === filterScore,
    );
  }, [filterScore, normalizedQuestions]);

  const stats = useMemo(() => {
    const total = normalizedQuestions.length;

    if (!total) {
      return {
        total: 0,
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0,
        averageScore: 0,
        averageTime: 0,
      };
    }

    const totalTime = normalizedQuestions.reduce(
      (sum, question) => sum + question.timeTaken,
      0,
    );

    const totalScore = normalizedQuestions.reduce(
      (sum, question) => sum + question.score,
      0,
    );

    return {
      total,
      excellent: normalizedQuestions.filter(
        (question) => question.score >= 80,
      ).length,
      good: normalizedQuestions.filter(
        (question) =>
          question.score >= 60 && question.score < 80,
      ).length,
      fair: normalizedQuestions.filter(
        (question) =>
          question.score >= 40 && question.score < 60,
      ).length,
      poor: normalizedQuestions.filter(
        (question) => question.score < 40,
      ).length,
      averageScore: Math.round(totalScore / total),
      averageTime: Math.round(totalTime / total),
    };
  }, [normalizedQuestions]);

  if (isLoading) {
    return <QuestionAnalysisSkeleton />;
  }

  if (!normalizedQuestions.length) {
    return (
      <section className="results-component question-analysis">
        <div className="question-empty-state">
          <span className="question-empty-icon">
            <HelpCircle size={28} />
          </span>
          <h3>No interview data found</h3>
          <p>
            Complete an interview to see your question-by-question analysis.
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="results-component question-analysis"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="question-analysis-heading"
    >
      <div className="results-component-header">
        <span className="results-component-header-icon">
          <HelpCircle size={18} />
        </span>

        <div>
          <h3 id="question-analysis-heading">
            Question-by-question analysis
          </h3>
          <p className="results-component-subtitle">
            Review each answer, score, timing, and feedback.
          </p>
        </div>
      </div>

      <div className="question-stats-grid">
        <QuestionStat
          label="Total"
          value={stats.total}
          icon={HelpCircle}
        />

        <QuestionStat
          label="Excellent"
          value={stats.excellent}
          icon={CheckCircle}
        />

        <QuestionStat
          label="Good"
          value={stats.good}
          icon={Award}
        />

        <QuestionStat
          label="Fair"
          value={stats.fair}
          icon={AlertCircle}
        />

        <QuestionStat
          label="Needs work"
          value={stats.poor}
          icon={XCircle}
        />

        <QuestionStat
          label="Avg. time"
          value={`${stats.averageTime}s`}
          icon={Clock3}
        />
      </div>

      <div className="question-summary-row">
        <span>
          Average score: <strong>{stats.averageScore}%</strong>
        </span>
        <span>
          Showing <strong>{filteredQuestions.length}</strong> of{" "}
          <strong>{normalizedQuestions.length}</strong>
        </span>
      </div>

      <div className="question-filter">
        <span className="question-filter-label">
          Filter performance
        </span>

        <div className="question-filter-buttons">
          {SCORE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`question-filter-button ${
                filterScore === filter.id ? "is-active" : ""
              }`}
              onClick={() => {
                setFilterScore(filter.id);
                setExpandedQuestion(null);
              }}
              aria-pressed={filterScore === filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="question-list">
        <AnimatePresence mode="popLayout">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question, index) => (
              <QuestionRow
                key={question.questionId || `${question.question}-${index}`}
                question={question}
                index={index}
                expanded={
                  expandedQuestion ===
                  (question.questionId || index)
                }
                onToggle={() =>
                  setExpandedQuestion((current) =>
                    current ===
                    (question.questionId || index)
                      ? null
                      : question.questionId || index,
                  )
                }
              />
            ))
          ) : (
            <motion.div
              className="question-filter-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={25} />
              <strong>No questions match this filter</strong>
              <span>Try selecting another performance category.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

function QuestionRow({
  question,
  index,
  expanded,
  onToggle,
}) {
  const ScoreIcon = getScoreIcon(question.score);
  const scoreCategory = getScoreCategory(question.score);

  return (
    <motion.article
      className={`question-row ${
        expanded ? "is-expanded" : ""
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04 }}
      layout
    >
      <button
        type="button"
        className="question-row-toggle"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`question-detail-${index}`}
      >
        <span className="question-number">
          {String(question.questionNumber).padStart(2, "0")}
        </span>

        <span className="question-row-title">
          <strong>{question.question}</strong>

          <small>
            {question.category &&
              question.category !== "general" &&
              `${question.category} · `}
            {question.timeTaken > 0
              ? `${question.timeTaken}s`
              : "Timing unavailable"}
          </small>
        </span>

        <span className={`question-score question-score-${scoreCategory}`}>
          <ScoreIcon size={15} />
          {Math.round(question.score)}%
        </span>

        <ChevronDown
          size={18}
          className={`question-chevron ${
            expanded ? "is-rotated" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`question-detail-${index}`}
            className="question-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="question-detail-grid">
              <div className="question-answer-block">
                <div className="question-detail-label">
                  Your answer
                </div>

                <div className="question-answer">
                  {question.yourAnswer}
                </div>
              </div>

              <div className="question-feedback-block">
                <div className="question-detail-label">
                  Interview feedback
                </div>

                <p>{question.feedback}</p>
              </div>
            </div>

            {(question.strengths?.length > 0 ||
              question.improvements?.length > 0) && (
              <div className="question-insights">
                {question.strengths?.length > 0 && (
                  <InsightList
                    title="Strengths"
                    items={question.strengths}
                    type="strength"
                  />
                )}

                {question.improvements?.length > 0 && (
                  <InsightList
                    title="Improvements"
                    items={question.improvements}
                    type="improvement"
                  />
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function InsightList({ title, items, type }) {
  return (
    <div className="question-insight">
      <div className="question-insight-title">
        {type === "strength" ? (
          <CheckCircle size={14} />
        ) : (
          <TrendingDownIcon size={14} />
        )}
        {title}
      </div>

      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TrendingDownIcon(props) {
  return <AlertCircle {...props} />;
}

function QuestionStat({ label, value, icon: Icon }) {
  return (
    <motion.div
      className="question-stat"
      whileHover={{ y: -3 }}
    >
      <span className="question-stat-icon">
        <Icon size={16} />
      </span>

      <strong>{value}</strong>
      <small>{label}</small>
    </motion.div>
  );
}

function QuestionAnalysisSkeleton() {
  return (
    <section className="results-component question-analysis">
      <div className="question-skeleton-header">
        <span />
        <div>
          <span />
          <span />
        </div>
      </div>

      <div className="question-stats-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="question-skeleton-stat" key={index} />
        ))}
      </div>

      <div className="question-skeleton-list">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="question-skeleton-row" key={index} />
        ))}
      </div>
    </section>
  );
}

export default QuestionAnalysis;