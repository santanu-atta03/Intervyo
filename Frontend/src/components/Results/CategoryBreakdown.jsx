import React from 'react';
import { motion } from 'framer-motion';
import { Code, MessageSquare, Brain, Zap, CheckCircle, XCircle } from 'lucide-react';


const CategoryBreakdown = ({ categories, detailed = false }) => {
  const categoryData = [
    {
      key: 'technical',
      title: 'Technical Skills',
      icon: Code,
      color: '#667eea',
      gradient: 'from-purple-500 to-indigo-600',
      data: categories.technical
    },
    {
      key: 'communication',
      title: 'Communication',
      icon: MessageSquare,
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-600',
      data: categories.communication
    },
    {
      key: 'problemSolving',
      title: 'Problem Solving',
      icon: Brain,
      color: '#f59e0b',
      gradient: 'from-yellow-500 to-orange-600',
      data: categories.problemSolving
    }
  ];

  const CircularProgress = ({ percentage, color }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg className="circular-progress" width="100" height="100">
        <circle
          className="progress-bg"
          cx="50"
          cy="50"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          className="progress-bar"
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <text x="50" y="50" textAnchor="middle" dy="7" className="progress-text">
          {percentage}%
        </text>
      </svg>
    );
  };

  return (
    <motion.div
      className={`category-breakdown ${detailed ? 'detailed' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <Zap className="w-6 h-6 text-yellow-500" />
        <h3>Category Breakdown</h3>
      </div>

      <div className="categories-grid">
        {categoryData.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.key}
              className="category-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`category-header bg-gradient-to-r ${category.gradient}`}>
                <Icon className="w-6 h-6 text-white" />
                <h4>{category.title}</h4>
              </div>

              <div className="category-body">
                <CircularProgress 
                  percentage={category.data.score} 
                  color={category.color}
                />

                {detailed && category.key === 'technical' && (
                  <div className="category-details">
                    <div className="detail-item">
                      <span>Questions Answered</span>
                      <span className="detail-value">{category.data.questionsAnswered}</span>
                    </div>
                    
                    {category.data.strengths.length > 0 && (
                      <div className="strengths-weaknesses">
                        <div className="sw-section">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="sw-title">Strengths</span>
                        </div>
                        <ul className="sw-list">
                          {category.data.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {category.data.weaknesses.length > 0 && (
                      <div className="strengths-weaknesses">
                        <div className="sw-section">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="sw-title">Areas to Improve</span>
                        </div>
                        <ul className="sw-list">
                          {category.data.weaknesses.map((weakness, idx) => (
                            <li key={idx}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {detailed && category.key === 'communication' && (
                  <div className="sub-scores">
                    <div className="sub-score-item">
                      <span>Clarity</span>
                      <div className="sub-score-bar">
                        <motion.div
                          className="sub-score-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.data.clarity}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          style={{ background: category.color }}
                        />
                      </div>
                      <span className="sub-score-value">{category.data.clarity}%</span>
                    </div>
                    <div className="sub-score-item">
                      <span>Articulation</span>
                      <div className="sub-score-bar">
                        <motion.div
                          className="sub-score-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.data.articulation}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          style={{ background: category.color }}
                        />
                      </div>
                      <span className="sub-score-value">{category.data.articulation}%</span>
                    </div>
                    <div className="sub-score-item">
                      <span>Confidence</span>
                      <div className="sub-score-bar">
                        <motion.div
                          className="sub-score-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.data.confidence}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                          style={{ background: category.color }}
                        />
                      </div>
                      <span className="sub-score-value">{category.data.confidence}%</span>
                    </div>
                  </div>
                )}

                {detailed && category.key === 'problemSolving' && (
                  <div className="sub-scores">
                    <div className="sub-score-item">
                      <span>Analytical Thinking</span>
                      <div className="sub-score-bar">
                        <motion.div
                          className="sub-score-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.data.analyticalThinking}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          style={{ background: category.color }}
                        />
                      </div>
                      <span className="sub-score-value">{category.data.analyticalThinking}%</span>
                    </div>
                    <div className="sub-score-item">
                      <span>Creativity</span>
                      <div className="sub-score-bar">
                        <motion.div
                          className="sub-score-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.data.creativity}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          style={{ background: category.color }}
                        />
                      </div>
                      <span className="sub-score-value">{category.data.creativity}%</span>
                    </div>
                    <div className="sub-score-item">
                      <span>Efficiency</span>
                      <div className="sub-score-bar">
                        <motion.div
                          className="sub-score-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.data.efficiency}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                          style={{ background: category.color }}
                        />
                      </div>
                      <span className="sub-score-value">{category.data.efficiency}%</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryBreakdown;