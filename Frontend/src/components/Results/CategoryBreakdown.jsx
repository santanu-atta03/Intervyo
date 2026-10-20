import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle,
  Code2,
  MessageSquare,
  XCircle,
  Zap,
} from "lucide-react";

import "../../styles/resultsComponents.css";

const clamp = (value) =>
  Math.max(0, Math.min(100, Number(value) || 0));

const CircularProgress = ({ percentage }) => {
  const safePercentage = clamp(percentage);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (circumference * safePercentage) / 100;

  return (
    <div
      style={{
        position: "relative",
        width: 100,
        height: 100,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100"
        height="100"
        style={{ transform: "rotate(-90deg)" }}
        aria-label={`${Math.round(safePercentage)}%`}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--rc-hairline-soft)"
          strokeWidth="8"
        />

        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--rc-ink)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          color: "var(--rc-ink)",
          fontSize: 17,
          fontWeight: 500,
        }}
      >
        {Math.round(safePercentage)}%
      </div>
    </div>
  );
};

const SubScore = ({ label, value, delay = 0 }) => {
  const safeValue = clamp(value);

  return (
    <div className="results-sub-score">
      <span>{label}</span>
      <span className="results-sub-score-value">
        {Math.round(safeValue)}%
      </span>

      <div className="results-sub-score-bar">
        <motion.div
          className="results-sub-score-fill"
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.9, delay }}
        />
      </div>
    </div>
  );
};

const StrengthList = ({ title, items = [], type = "strength" }) => {
  if (!items.length) return null;

  const isStrength = type === "strength";

  return (
    <div className="results-strength-section">
      <div className="results-strength-heading">
        {isStrength ? (
          <CheckCircle size={15} color="var(--rc-success)" />
        ) : (
          <XCircle size={15} color="var(--rc-danger)" />
        )}
        <span>{title}</span>
      </div>

      <ul className="results-strength-list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const CategoryBreakdown = ({
  categories = {},
  detailed = false,
}) => {
  const categoryData = [
    {
      key: "technical",
      title: "Technical skills",
      icon: Code2,
      data: categories.technical || {},
    },
    {
      key: "communication",
      title: "Communication",
      icon: MessageSquare,
      data: categories.communication || {},
    },
    {
      key: "problemSolving",
      title: "Problem solving",
      icon: Brain,
      data: categories.problemSolving || {},
    },
  ];

  return (
    <motion.section
      className="results-component"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="category-breakdown-heading"
    >
      <div className="results-component-header">
        <span className="results-component-header-icon">
          <Zap size={18} />
        </span>

        <div>
          <h3 id="category-breakdown-heading">
            Category breakdown
          </h3>
          <p className="results-component-subtitle">
            See how your interview performance was distributed across key skills.
          </p>
        </div>
      </div>

      <div className="results-categories">
        {categoryData.map((category, index) => {
          const Icon = category.icon;
          const data = category.data;
          const score = clamp(data.score);

          return (
            <motion.article
              key={category.key}
              className="results-category"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="results-category-header">
                <Icon size={18} />
                <h4>{category.title}</h4>
              </div>

              <div className="results-category-body">
                <div className="results-category-score">
                  <CircularProgress percentage={score} />

                  <div>
                    <strong>{Math.round(score)}%</strong>
                    <span style={{ display: "block", marginTop: 5 }}>
                      Overall score
                    </span>
                  </div>
                </div>

                <div className="results-category-progress">
                  <motion.div
                    className="results-category-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                    }}
                  />
                </div>

                {category.key === "technical" && (
                  <>
                    <div className="results-category-meta">
                      <span>Questions answered</span>
                      <strong>
                        {data.questionsAnswered ?? 0}
                      </strong>
                    </div>

                    {detailed && (
                      <div className="results-category-details">
                        <StrengthList
                          title="Strengths"
                          items={data.strengths || []}
                          type="strength"
                        />

                        <StrengthList
                          title="Areas to improve"
                          items={data.weaknesses || []}
                          type="weakness"
                        />
                      </div>
                    )}
                  </>
                )}

                {detailed && category.key === "communication" && (
                  <div className="results-sub-scores">
                    <SubScore
                      label="Clarity"
                      value={data.clarity}
                      delay={0.25}
                    />
                    <SubScore
                      label="Articulation"
                      value={data.articulation}
                      delay={0.35}
                    />
                    <SubScore
                      label="Confidence"
                      value={data.confidence}
                      delay={0.45}
                    />
                  </div>
                )}

                {detailed && category.key === "problemSolving" && (
                  <div className="results-sub-scores">
                    <SubScore
                      label="Analytical thinking"
                      value={data.analyticalThinking}
                      delay={0.25}
                    />
                    <SubScore
                      label="Creativity"
                      value={data.creativity}
                      delay={0.35}
                    />
                    <SubScore
                      label="Efficiency"
                      value={data.efficiency}
                      delay={0.45}
                    />
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
};

export default CategoryBreakdown;