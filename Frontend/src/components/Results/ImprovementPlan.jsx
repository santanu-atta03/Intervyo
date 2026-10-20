import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock3,
  ExternalLink,
  Filter,
  Play,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import "../../styles/resultsComponents.css";

const TIMEFRAMES = [
  {
    id: "shortTerm",
    label: "Short term",
    period: "1–2 weeks",
    icon: Zap,
  },
  {
    id: "mediumTerm",
    label: "Medium term",
    period: "1–2 months",
    icon: TrendingUp,
  },
  {
    id: "longTerm",
    label: "Long term",
    period: "3–6 months",
    icon: Target,
  },
];

const PRIORITIES = ["all", "high", "medium", "low"];

const priorityLabels = {
  all: "All",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const priorityIcons = {
  high: AlertCircle,
  medium: Clock3,
  low: CheckCircle,
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const ImprovementPlan = ({ plan = {} }) => {
  const [activeTimeframe, setActiveTimeframe] = useState("shortTerm");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const currentGoals = safeArray(plan[activeTimeframe]);

  const filteredGoals = useMemo(() => {
    if (selectedPriority === "all") {
      return currentGoals;
    }

    return currentGoals.filter(
      (goal) => goal.priority === selectedPriority,
    );
  }, [currentGoals, selectedPriority]);

  return (
    <motion.section
      className="results-component improvement-plan"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="improvement-plan-heading"
    >
      <div className="results-component-header">
        <span className="results-component-header-icon">
          <Target size={18} />
        </span>

        <div>
          <h3 id="improvement-plan-heading">
            Your improvement plan
          </h3>
          <p className="results-component-subtitle">
            A structured roadmap for turning your feedback into progress.
          </p>
        </div>
      </div>

      <div className="improvement-timeframes">
        {TIMEFRAMES.map((timeframe, index) => {
          const Icon = timeframe.icon;
          const isActive = activeTimeframe === timeframe.id;
          const goalCount = safeArray(plan[timeframe.id]).length;

          return (
            <motion.button
              key={timeframe.id}
              type="button"
              className={`improvement-timeframe ${
                isActive ? "is-active" : ""
              }`}
              onClick={() => {
                setActiveTimeframe(timeframe.id);
                setSelectedPriority("all");
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isActive}
            >
              <span className="improvement-timeframe-icon">
                <Icon size={17} />
              </span>

              <span className="improvement-timeframe-copy">
                <strong>{timeframe.label}</strong>
                <small>{timeframe.period}</small>
              </span>

              <span className="improvement-timeframe-count">
                {goalCount}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="improvement-filter">
        <div className="improvement-filter-label">
          <Filter size={15} />
          <span>Priority</span>
        </div>

        <div className="improvement-filter-buttons">
          {PRIORITIES.map((priority) => (
            <button
              key={priority}
              type="button"
              className={`improvement-filter-button ${
                selectedPriority === priority ? "is-active" : ""
              }`}
              onClick={() => setSelectedPriority(priority)}
              aria-pressed={selectedPriority === priority}
            >
              {priorityLabels[priority]}
            </button>
          ))}
        </div>
      </div>

      <div className="improvement-goals">
        <div className="improvement-section-heading">
          <div>
            <h4>Focus areas</h4>
            <p>
              {filteredGoals.length} goal
              {filteredGoals.length === 1 ? "" : "s"} in this timeframe
            </p>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal, index) => (
              <ImprovementGoal
                key={`${goal.title || "goal"}-${index}`}
                goal={goal}
                index={index}
              />
            ))
          ) : (
            <motion.div
              className="improvement-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle size={28} />
              <strong>No matching goals</strong>
              <span>
                There are no{" "}
                {selectedPriority === "all"
                  ? ""
                  : `${selectedPriority} priority `}
                goals for this timeframe.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {safeArray(plan.recommendedCourses).length > 0 && (
        <ResourceSection
          icon={Award}
          title="Recommended courses"
          subtitle="Structured learning options to deepen your skills."
          className="improvement-courses"
        >
          <div className="improvement-course-grid">
            {plan.recommendedCourses.map((course, index) => (
              <motion.article
                key={`${course.title || "course"}-${index}`}
                className="improvement-course"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="improvement-course-top">
                  <span className="improvement-resource-icon">
                    <Play size={15} />
                  </span>

                  {course.level && (
                    <span className="improvement-label">
                      {course.level}
                    </span>
                  )}
                </div>

                <h4>{course.title}</h4>

                <div className="improvement-course-meta">
                  {course.platform && <span>{course.platform}</span>}

                  {course.duration && (
                    <span>
                      <CalendarDays size={13} />
                      {course.duration}
                    </span>
                  )}
                </div>

                {course.url && course.url !== "#" && (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="improvement-resource-link"
                  >
                    View course
                    <ExternalLink size={14} />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </ResourceSection>
      )}

      {safeArray(plan.practiceResources).length > 0 && (
        <ResourceSection
          icon={BookOpen}
          title="Practice resources"
          subtitle="Use these resources to reinforce your preparation."
          className="improvement-resources"
        >
          <div className="improvement-resource-list">
            {plan.practiceResources.map((resource, index) => (
              <motion.article
                key={`${resource.title || "resource"}-${index}`}
                className="improvement-resource"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ x: 4 }}
              >
                <span className="improvement-resource-icon">
                  <BookOpen size={16} />
                </span>

                <div className="improvement-resource-content">
                  <div className="improvement-resource-heading">
                    <h4>{resource.title}</h4>

                    {resource.type && (
                      <span className="improvement-label">
                        {resource.type}
                      </span>
                    )}
                  </div>

                  <p>{resource.description}</p>

                  {resource.url && resource.url !== "#" && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="improvement-resource-link"
                    >
                      Access resource
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </ResourceSection>
      )}
    </motion.section>
  );
};

function ImprovementGoal({ goal = {}, index }) {
  const PriorityIcon =
    priorityIcons[goal.priority] || CheckCircle;

  return (
    <motion.article
      className="improvement-goal"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.07 }}
      layout
    >
      <div className="improvement-goal-header">
        <div>
          <h4>{goal.title || "Improvement goal"}</h4>

          <div className="improvement-goal-meta">
            {goal.priority && (
              <span
                className={`improvement-priority improvement-priority-${goal.priority}`}
              >
                <PriorityIcon size={13} />
                {goal.priority}
              </span>
            )}

            {goal.estimatedTime && (
              <span className="improvement-time">
                <Clock3 size={13} />
                {goal.estimatedTime}
              </span>
            )}
          </div>
        </div>

        <span className="improvement-goal-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {goal.description && (
        <p className="improvement-goal-description">
          {goal.description}
        </p>
      )}

      {safeArray(goal.resources).length > 0 && (
        <div className="improvement-goal-resources">
          <div className="improvement-goal-resources-title">
            <BookOpen size={14} />
            Resources
          </div>

          <ul>
            {goal.resources.map((resource, resourceIndex) => (
              <motion.li
                key={`${resource}-${resourceIndex}`}
                initial={{ opacity: 0, x: -7 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.07 + resourceIndex * 0.05,
                }}
              >
                <ChevronRight size={14} />
                <span>{resource}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.article>
  );
}

function ResourceSection({
  icon: Icon,
  title,
  subtitle,
  className = "",
  children,
}) {
  return (
    <section className={`improvement-resource-section ${className}`}>
      <div className="improvement-section-heading">
        <div className="improvement-section-heading-title">
          <span className="improvement-heading-icon">
            <Icon size={16} />
          </span>

          <div>
            <h4>{title}</h4>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}

export default ImprovementPlan;