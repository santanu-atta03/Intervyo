// components/results/ComparisonStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, Target } from 'lucide-react';


const ComparisonStats = ({ data, summary }) => {
  const stats = [
    {
      icon: Users,
      label: 'Total Candidates',
      value: data.totalCandidates.toLocaleString(),
      color: '#6366f1'
    },
    {
      icon: Target,
      label: 'Your Rank',
      value: `#${data.yourRank}`,
      color: '#8b5cf6'
    },
    {
      icon: TrendingUp,
      label: 'Better Than',
      value: `${data.betterThan}%`,
      color: '#10b981'
    },
    {
      icon: Award,
      label: 'Percentile',
      value: `${summary.percentile}th`,
      color: '#f59e0b'
    }
  ];

  return (
    <motion.div
      className="comparison-stats-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="card-header">
        <h3 className="card-title">
          <Users className="w-6 h-6" />
          How You Compare
        </h3>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="stat-box"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon" style={{ background: `${stat.color}20` }}>
                <Icon style={{ color: stat.color }} />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="comparison-chart">
        <div className="chart-label">Score Distribution</div>
        <div className="distribution-bar">
          <motion.div
            className="your-position"
            initial={{ left: 0 }}
            animate={{ left: `${summary.percentile}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="position-marker">
              <span>You</span>
            </div>
          </motion.div>
          <div className="distribution-segments">
            <div className="segment low"></div>
            <div className="segment medium"></div>
            <div className="segment high"></div>
          </div>
        </div>
        <div className="chart-labels">
          <span>0</span>
          <span>Average: {data.averageScore}</span>
          <span>100</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonStats;