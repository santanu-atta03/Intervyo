import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle,
  ChevronDown,
  Code2,
  Lightbulb,
  MessageSquare,
  ShieldAlert,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

import "../../styles/resultsComponents.css";

const safeArray = (value) => (Array.isArray(value) ? value : []);

const DetailedFeedback = ({ feedback = {} }) => {
  const [expandedSection, setExpandedSection] = useState("overall");

  const strengths = safeArray(feedback.strengths);
  const weaknesses = safeArray(feedback.weaknesses);
  const keyHighlights = safeArray(feedback.keyHighlights);
  const areasOfConcern = safeArray(feedback.areasOfConcern);

  const technicalAnalysis = feedback.technicalAnalysis || {};
  const behavioralAnalysis = feedback.behavioralAnalysis || {};

  const sections = [
    {
      id: "overall",
      title: "Overall assessment",
      icon: Star,
      content: feedback.overallAssessment,
      items: [],
    },
    {
      id: "technical",
      title: "Technical analysis",
      icon: Code2,
      content: "",
      items: [
        {
          label: "Core concepts",
          value: technicalAnalysis.coreConcepts,
        },
        {
          label: "Problem-solving approach",
          value: technicalAnalysis.problemSolvingApproach,
        },
        {
          label: "Code quality",
          value: technicalAnalysis.codeQuality,
        },
        {
          label: "Best practices",
          value: technicalAnalysis.bestPractices,
        },
      ],
    },
    {
      id: "behavioral",
      title: "Behavioral analysis",
      icon: MessageSquare,
      content: "",
      items: [
        {
          label: "Communication",
          value: behavioralAnalysis.communication,
        },
        {
          label: "Confidence",
          value: behavioralAnalysis.confidence,
        },
        {
          label: "Professionalism",
          value: behavioralAnalysis.professionalism,
        },
        {
          label: "Adaptability",
          value: behavioralAnalysis.adaptability,
        },
      ],
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection((current) =>
      current === sectionId ? null : sectionId,
    );
  };

  return (
    <motion.section
      className="results-component detailed-feedback"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="detailed-feedback-heading"
    >
      <div className="results-component-header">
        <span className="results-component-header-icon">
          <Lightbulb size={18} />
        </span>

        <div>
          <h3 id="detailed-feedback-heading">
            Detailed performance analysis
          </h3>

          <p className="results-component-subtitle">
            Review what went well and where your next improvement can come from.
          </p>
        </div>
      </div>

      <div className="feedback-summary-grid">
        <FeedbackListCard
          title="Key strengths"
          icon={TrendingUp}
          items={strengths}
          type="strength"
          delay={0.1}
        />

        <FeedbackListCard
          title="Areas for improvement"
          icon={AlertTriangle}
          items={weaknesses}
          type="improvement"
          delay={0.18}
        />
      </div>

      {keyHighlights.length > 0 && (
        <motion.section
          className="feedback-section-block"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <SectionHeading
            icon={Star}
            title="Key highlights"
          />

          <div className="feedback-highlight-grid">
            {keyHighlights.map((highlight, index) => (
              <motion.div
                key={`${highlight}-${index}`}
                className="feedback-highlight"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                whileHover={{ y: -3 }}
              >
                <span className="feedback-highlight-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{highlight}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {areasOfConcern.length > 0 && (
        <motion.section
          className="feedback-section-block"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
        >
          <SectionHeading
            icon={ShieldAlert}
            title="Critical areas needing attention"
          />

          <div className="feedback-concerns">
            {areasOfConcern.map((concern, index) => (
              <motion.div
                key={`${concern}-${index}`}
                className="feedback-concern"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * index }}
              >
                <span className="feedback-concern-number">
                  {index + 1}
                </span>

                <p>{concern}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <section className="feedback-analysis">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <motion.div
              key={section.id}
              className={`feedback-analysis-section ${
                isExpanded ? "is-expanded" : ""
              }`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <button
                type="button"
                className="feedback-section-toggle"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isExpanded}
                aria-controls={`feedback-section-${section.id}`}
              >
                <span className="feedback-section-toggle-left">
                  <span className="feedback-section-icon">
                    <Icon size={17} />
                  </span>

                  <span>
                    <strong>{section.title}</strong>

                    <small>
                      {section.id === "overall"
                        ? "Summary of your interview performance"
                        : section.id === "technical"
                          ? "Technical capability and execution"
                          : "Communication and professional presence"}
                    </small>
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  className={`feedback-chevron ${
                    isExpanded ? "is-rotated" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    id={`feedback-section-${section.id}`}
                    className="feedback-section-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    {section.content ? (
                      <p className="feedback-analysis-text">
                        {section.content}
                      </p>
                    ) : (
                      <div className="feedback-analysis-grid">
                        {section.items.map((item) => (
                          <div
                            key={item.label}
                            className="feedback-analysis-item"
                          >
                            <div className="feedback-analysis-label">
                              {item.label}
                            </div>

                            <p>
                              {item.value || "Not available"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>
    </motion.section>
  );
};

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="feedback-section-heading">
      <span className="feedback-heading-icon">
        <Icon size={16} />
      </span>

      <h4>{title}</h4>
    </div>
  );
}

function FeedbackListCard({
  title,
  icon: Icon,
  items,
  type,
  delay,
}) {
  const isStrength = type === "strength";

  return (
    <motion.div
      className={`feedback-list-card ${
        isStrength ? "is-strength" : "is-improvement"
      }`}
      initial={{ opacity: 0, x: isStrength ? -14 : 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="feedback-list-card-header">
        <span className="feedback-heading-icon">
          <Icon size={16} />
        </span>

        <h4>{title}</h4>
      </div>

      {items.length > 0 ? (
        <ul className="feedback-list">
          {items.map((item, index) => (
            <motion.li
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: isStrength ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.07 }}
            >
              <span className="feedback-list-marker">
                {isStrength ? (
                  <CheckCircle size={14} />
                ) : (
                  <Zap size={14} />
                )}
              </span>

              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="feedback-empty">
          No specific items were provided for this section.
        </p>
      )}
    </motion.div>
  );
}

export default DetailedFeedback;