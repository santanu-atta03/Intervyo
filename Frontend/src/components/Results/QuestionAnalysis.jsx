import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, CheckCircle, XCircle, AlertCircle, ChevronDown,
  Clock, Lightbulb, TrendingUp, TrendingDown, Award, Tag
} from 'lucide-react';

// --- Skeleton Component for Loading State ---
const AnalysisSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-slate-200 h-12 w-12"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-48"></div>
        <div className="h-3 bg-slate-200 rounded w-64"></div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
      ))}
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-slate-100 rounded-lg w-full"></div>
      ))}
    </div>
  </div>
);

const QuestionAnalysis = ({ questions, isLoading }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [filterScore, setFilterScore] = useState('all');

  // Handle Loading State
  if (isLoading) {
    return (
      <div className="question-analysis p-6">
        <AnalysisSkeleton />
      </div>
    );
  }

  // Handle Empty State
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No interview data found.</p>
      </div>
    );
  }

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
  };

  return (
    <div className="question-analysis">
      {/* Header */}
      <motion.div 
        className="analysis-header flex items-center gap-4 mb-8"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <div className="p-3 bg-blue-50 rounded-full">
            <HelpCircle className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Question-by-Question Analysis</h2>
          <p className="text-slate-500">Detailed breakdown of your answers and performance</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
            { label: 'Total', value: stats.total, icon: HelpCircle, color: 'text-slate-500', bg: 'bg-slate-50' },
            { label: 'Excellent', value: stats.excellent, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Good', value: stats.good, icon: Award, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Fair', value: stats.fair, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Needs Work', value: stats.poor, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Avg Time', value: `${stats.avgTime}s`, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((item, idx) => (
            <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${item.bg} p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center`}
            >
                <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                <span className="text-xl font-bold text-slate-800">{item.value}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</span>
            </motion.div>
        ))}
      </div>

      {/* ... Rest of your filtering and mapping logic remains the same ... */}
      
      {/* Filtering UI */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm font-medium text-slate-600">Filter by performance:</span>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['all', 'excellent', 'good', 'fair', 'needs-improvement'].map((option) => (
            <button
              key={option}
              onClick={() => setFilterScore(option)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterScore === option 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question, index) => {
            const isExpanded = expandedQuestion === index;
            const ScoreIcon = getScoreIcon(question.score);
            const scoreColor = getScoreColor(question.score);

            return (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button 
                        onClick={() => setExpandedQuestion(isExpanded ? null : index)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-sm font-bold text-slate-600">
                                {index + 1}
                            </span>
                            <h3 className="font-semibold text-slate-800 text-left line-clamp-1">{question.question}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="px-3 py-1 rounded-full flex items-center gap-2" style={{ backgroundColor: `${scoreColor}15`, color: scoreColor }}>
                                <ScoreIcon className="w-4 h-4" />
                                <span className="text-sm font-bold">{question.score}%</span>
                             </div>
                             <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden border-t border-slate-100"
                            >
                                <div className="p-6 bg-slate-50/50 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Your Answer</h4>
                                            <div className="p-4 bg-white rounded-lg border border-slate-200 text-slate-600 text-sm italic">
                                                "{question.yourAnswer}"
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">AI Feedback</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{question.feedback}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default QuestionAnalysis;