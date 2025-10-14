// components/results/ImprovementPlan.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Clock, TrendingUp, BookOpen, ExternalLink,
  CheckCircle, AlertCircle, Zap, Calendar, Award,
  Play, ChevronRight, Filter
} from 'lucide-react';

const ImprovementPlan = ({ plan }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('shortTerm');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const timeframes = [
    { id: 'shortTerm', label: 'Short Term', icon: Zap, color: '#ef4444', period: '1-2 weeks' },
    { id: 'mediumTerm', label: 'Medium Term', icon: TrendingUp, color: '#f59e0b', period: '1-2 months' },
    { id: 'longTerm', label: 'Long Term', icon: Target, color: '#10b981', period: '3-6 months' }
  ];

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#3b82f6'
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const filterGoals = (goals) => {
    if (selectedPriority === 'all') return goals;
    return goals.filter(goal => goal.priority === selectedPriority);
  };

  const currentGoals = plan[activeTimeframe] || [];
  const filteredGoals = filterGoals(currentGoals);

  return (
    <div className="improvement-plan">
      {/* Header */}
      <motion.div
        className="plan-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <Target className="w-8 h-8 text-blue-500" />
          <div>
            <h2>Your Personalized Improvement Plan</h2>
            <p>Structured roadmap to enhance your skills and knowledge</p>
          </div>
        </div>
      </motion.div>

      {/* Timeframe Tabs */}
      <motion.div
        className="timeframe-tabs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {timeframes.map((timeframe, index) => {
          const Icon = timeframe.icon;
          const isActive = activeTimeframe === timeframe.id;
          
          return (
            <motion.button
              key={timeframe.id}
              className={`timeframe-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTimeframe(timeframe.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                borderBottom: isActive ? `3px solid ${timeframe.color}` : '3px solid transparent'
              }}
            >
              <Icon style={{ color: timeframe.color }} />
              <div className="tab-content">
                <span className="tab-label">{timeframe.label}</span>
                <span className="tab-period">{timeframe.period}</span>
              </div>
              {isActive && (
                <motion.div
                  className="tab-badge"
                  layoutId="activeTab"
                  style={{ background: timeframe.color }}
                >
                  {currentGoals.length}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Priority Filter */}
      <motion.div
        className="priority-filter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Filter className="w-5 h-5" />
        <span>Priority:</span>
        <div className="filter-buttons">
          {['all', 'high', 'medium', 'low'].map(priority => (
            <button
              key={priority}
              className={`filter-btn ${selectedPriority === priority ? 'active' : ''}`}
              onClick={() => setSelectedPriority(priority)}
              style={{
                background: selectedPriority === priority 
                  ? (priority === 'all' ? '#6366f1' : priorityColors[priority]) 
                  : 'transparent',
                color: selectedPriority === priority ? 'white' : '#6b7280'
              }}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Goals List */}
      <div className="goals-container">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal, index) => {
            const PriorityIcon = getPriorityIcon(goal.priority);
            
            return (
              <motion.div
                key={index}
                className="goal-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="goal-header">
                  <div className="goal-title-section">
                    <h3>{goal.title}</h3>
                    <div 
                      className="priority-badge"
                      style={{ 
                        background: `${priorityColors[goal.priority]}20`,
                        color: priorityColors[goal.priority]
                      }}
                    >
                      <PriorityIcon className="w-4 h-4" />
                      {goal.priority}
                    </div>
                  </div>
                  <div className="goal-time">
                    <Clock className="w-4 h-4" />
                    {goal.estimatedTime}
                  </div>
                </div>

                <p className="goal-description">{goal.description}</p>

                {goal.resources && goal.resources.length > 0 && (
                  <div className="goal-resources">
                    <h4>
                      <BookOpen className="w-4 h-4" />
                      Resources
                    </h4>
                    <ul>
                      {goal.resources.map((resource, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx }}
                        >
                          <ChevronRight className="w-4 h-4" />
                          {resource}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <motion.div
            className="no-goals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
            <p>No {selectedPriority !== 'all' ? selectedPriority + ' priority' : ''} goals for this timeframe</p>
          </motion.div>
        )}
      </div>

      {/* Recommended Courses */}
      {plan.recommendedCourses && plan.recommendedCourses.length > 0 && (
        <motion.div
          className="courses-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="section-title">
            <Award className="w-6 h-6" />
            Recommended Courses
          </h3>
          <div className="courses-grid">
            {plan.recommendedCourses.map((course, index) => (
              <motion.div
                key={index}
                className="course-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="course-header">
                  <Play className="w-5 h-5 text-blue-500" />
                  <span className="course-level">{course.level}</span>
                </div>
                <h4>{course.title}</h4>
                <div className="course-meta">
                  <span className="course-platform">{course.platform}</span>
                  <span className="course-duration">
                    <Calendar className="w-4 h-4" />
                    {course.duration}
                  </span>
                </div>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-link"
                >
                  View Course
                  <ExternalLink className="w-4 h-4" />
                </a>
                
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Practice Resources */}
      {plan.practiceResources && plan.practiceResources.length > 0 && (
        <motion.div
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="section-title">
            <BookOpen className="w-6 h-6" />
            Practice Resources
          </h3>
          <div className="resources-list">
            {plan.practiceResources.map((resource, index) => (
              <motion.div
                key={index}
                className="resource-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5 }}
              >
                <div className="resource-icon">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="resource-content">
                  <h4>{resource.title}</h4>
                  <span className="resource-type">{resource.type}</span>
                  <p>{resource.description}</p>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      Access Resource <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImprovementPlan;