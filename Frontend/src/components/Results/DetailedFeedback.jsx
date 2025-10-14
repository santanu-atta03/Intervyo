// components/results/DetailedFeedback.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, TrendingUp, AlertTriangle, Star, 
  Code, MessageSquare, Briefcase, Zap, ChevronDown 
} from 'lucide-react';

const DetailedFeedback = ({ feedback }) => {
  const [expandedSection, setExpandedSection] = useState('overall');

  const sections = [
    {
      id: 'overall',
      title: 'Overall Assessment',
      icon: Star,
      content: feedback.overallAssessment,
      color: '#6366f1'
    },
    {
      id: 'technical',
      title: 'Technical Analysis',
      icon: Code,
      items: [
        { label: 'Core Concepts', value: feedback.technicalAnalysis.coreConcepts },
        { label: 'Problem Solving', value: feedback.technicalAnalysis.problemSolvingApproach },
        { label: 'Code Quality', value: feedback.technicalAnalysis.codeQuality },
        { label: 'Best Practices', value: feedback.technicalAnalysis.bestPractices }
      ],
      color: '#8b5cf6'
    },
    {
      id: 'behavioral',
      title: 'Behavioral Analysis',
      icon: MessageSquare,
      items: [
        { label: 'Communication', value: feedback.behavioralAnalysis.communication },
        { label: 'Confidence', value: feedback.behavioralAnalysis.confidence },
        { label: 'Professionalism', value: feedback.behavioralAnalysis.professionalism },
        { label: 'Adaptability', value: feedback.behavioralAnalysis.adaptability }
      ],
      color: '#10b981'
    }
  ];

  return (
    <div className="detailed-feedback">
      <motion.div
        className="feedback-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Lightbulb className="w-8 h-8 text-yellow-500" />
        <h2>Detailed Performance Analysis</h2>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="feedback-grid">
        <motion.div
          className="feedback-box strengths"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="box-header">
            <TrendingUp className="w-6 h-6" />
            <h3>Key Strengths</h3>
          </div>
          <ul className="feedback-list">
            {feedback.strengths.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Star className="w-4 h-4 text-green-500" />
                {strength}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="feedback-box weaknesses"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="box-header">
            <AlertTriangle className="w-6 h-6" />
            <h3>Areas for Improvement</h3>
          </div>
          <ul className="feedback-list">
            {feedback.weaknesses.map((weakness, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Zap className="w-4 h-4 text-orange-500" />
                {weakness}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Key Highlights */}
      <motion.div
        className="highlights-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="section-title">
          <Star className="w-5 h-5" />
          Key Highlights
        </h3>
        <div className="highlights-grid">
          {feedback.keyHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="highlight-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="highlight-icon">✨</div>
              <p>{highlight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Areas of Concern */}
      {feedback.areasOfConcern && feedback.areasOfConcern.length > 0 && (
        <motion.div
          className="concerns-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="section-title">
            <AlertTriangle className="w-5 h-5" />
            Critical Areas Needing Attention
          </h3>
          <div className="concerns-list">
            {feedback.areasOfConcern.map((concern, index) => (
              <motion.div
                key={index}
                className="concern-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="concern-marker">{index + 1}</div>
                <p>{concern}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Detailed Sections */}
      <div className="analysis-sections">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <motion.div
              key={section.id}
              className={`analysis-section ${isExpanded ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                style={{ borderLeft: `4px solid ${section.color}` }}
              >
                <div className="toggle-left">
                  <Icon style={{ color: section.color }} className="w-6 h-6" />
                  <h3>{section.title}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <motion.div
                  className="section-content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {section.content ? (
                    <p className="analysis-text">{section.content}</p>
                  ) : (
                    <div className="analysis-items">
                      {section.items.map((item, idx) => (
                        <div key={idx} className="analysis-item">
                          <h4>{item.label}</h4>
                          <p>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedFeedback;