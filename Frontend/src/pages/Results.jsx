// pages/Results.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { completeInterview } from '../services/operations/aiInterviewApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Clock, CheckCircle, AlertCircle, Activity, 
  BarChart3, Lightbulb, Target, BookOpen, Award,
  Download, Brain
} from 'lucide-react';

// Import components (you'll need to create these)
import ScoreCard from '../components/Results/ScoreCard';
import PerformanceChart from '../components/Results/PerformanceChart';
import CategoryBreakdown from '../components/Results/CategoryBreakdown';
import DetailedFeedback from '../components/Results/DetailedFeedback';
import ImprovementPlan from '../components/Results/ImprovementPlan';
import QuestionAnalysis from '../components/Results/QuestionAnalysis';
import CertificateSection from '../components/Results/CertificateSection';

const Results = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [currentResults, setCurrentResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    console.log('Results Component - interviewId:', interviewId);
    
    if (!interviewId) {
      console.error('No interviewId provided');
      navigate('/dashboard');
      return;
    }
    
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await completeInterview(interviewId, token);
        console.log('Complete interview response:', response);
        
        // Transform the response to match the expected structure
        const transformedResults = transformResultsData(response);
        setCurrentResults(transformedResults);
        setError(null);
        
        // Show confetti if passed
        if (transformedResults?.results?.summary?.passed) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [interviewId, token, navigate]);

  // Transform your backend response to match the component's expected structure
  // const transformResultsData = (response) => {
  //   if (!response) return null;

  //   const { session, feedback } = response;
    
  //   // Calculate metrics
  //   const overallScore = feedback?.overallScore || 0;
  //   const passed = overallScore >= 60;
    
  //   return {
  //     results: {
  //       summary: {
  //         overallScore: overallScore,
  //         grade: calculateGrade(overallScore),
  //         percentile: calculatePercentile(overallScore),
  //         passed: passed,
  //         totalQuestions: session?.questionEvaluations?.length || 0,
  //         questionsAnswered: session?.questionEvaluations?.filter(q => q.answer)?.length || 0,
  //         questionsSkipped: session?.questionEvaluations?.filter(q => !q.answer)?.length || 0,
  //         correctAnswers: session?.questionEvaluations?.filter(q => q.score >= 8)?.length || 0,
  //         partialAnswers: session?.questionEvaluations?.filter(q => q.score >= 5 && q.score < 8)?.length || 0,
  //         incorrectAnswers: session?.questionEvaluations?.filter(q => q.score < 5)?.length || 0,
  //       },
  //       categoryBreakdown: {
  //         technical: {
  //           score: (feedback?.technicalScore || 0) * 10,
  //           questionsAnswered: session?.questionEvaluations?.filter(q => q.category === 'technical')?.length || 0,
  //           strengths: feedback?.strengths?.slice(0, 3) || [],
  //           weaknesses: feedback?.improvements?.slice(0, 3) || []
  //         },
  //         communication: {
  //           score: (feedback?.communicationScore || 0) * 10,
  //           clarity: (feedback?.communicationScore || 0) * 10,
  //           articulation: Math.max(0, (feedback?.communicationScore || 0) * 10 - 5),
  //           confidence: (feedback?.communicationScore || 0) * 10
  //         },
  //         problemSolving: {
  //           score: (feedback?.problemSolvingScore || 0) * 10,
  //           analyticalThinking: (feedback?.problemSolvingScore || 0) * 10,
  //           creativity: Math.min(100, (feedback?.problemSolvingScore || 0) * 10 + 5),
  //           efficiency: Math.max(0, (feedback?.problemSolvingScore || 0) * 10 - 3)
  //         }
  //       },
  //       detailedFeedback: {
  //         overallAssessment: feedback?.summary || '',
  //         strengths: feedback?.strengths || [],
  //         weaknesses: feedback?.improvements || [],
  //         keyHighlights: feedback?.strengths || [],
  //         areasOfConcern: feedback?.improvements || []
  //       },
  //       improvementPlan: {
  //         shortTerm: feedback?.improvements?.slice(0, 2) || [],
  //         mediumTerm: feedback?.improvements?.slice(2, 4) || [],
  //         longTerm: []
  //       },
  //       questionAnalysis: session?.questionEvaluations?.map((q, idx) => ({
  //         questionId: q._id,
  //         questionNumber: idx + 1,
  //         question: q.question,
  //         yourAnswer: q.answer || 'Not answered',
  //         score: q.score * 10, // Convert 0-10 to 0-100
  //         maxScore: 100,
  //         feedback: q.feedback || '',
  //         strengths: [],
  //         improvements: []
  //       })) || [],
  //       performanceChart: session?.questionEvaluations?.map((q, idx) => ({
  //         questionNumber: idx + 1,
  //         score: q.score * 10,
  //         avgScore: overallScore
  //       })) || []
  //     },
  //     config: {
  //       domain: session?.interviewId?.role || 'Interview',
  //       subDomain: '',
  //       difficulty: session?.interviewId?.difficulty || 'medium'
  //     },
  //     duration: session?.interviewId?.duration || 0,
  //     completedAt: session?.updatedAt || new Date()
  //   };
  // };

  // pages/Results.jsx - Key Updates

const transformResultsData = (response) => {
  if (!response) return null;

  const { session, feedback, certificate } = response;
  
  // Calculate metrics from session data
  const overallScore = session?.overallScore || feedback?.overallScore || 0;
  const passed = overallScore >= 60;
  
  // Get question evaluations with proper structure
  const questionEvaluations = session?.questionEvaluations || [];
  
  return {
    results: {
      summary: {
        overallScore: overallScore,
        grade: calculateGrade(overallScore),
        percentile: calculatePercentile(overallScore),
        passed: passed,
        totalQuestions: questionEvaluations.length || 0,
        questionsAnswered: questionEvaluations.filter(q => q.userAnswer && q.userAnswer.trim()).length || 0,
        questionsSkipped: questionEvaluations.filter(q => !q.userAnswer || !q.userAnswer.trim()).length || 0,
        correctAnswers: questionEvaluations.filter(q => q.score >= 8).length || 0,
        partialAnswers: questionEvaluations.filter(q => q.score >= 5 && q.score < 8).length || 0,
        incorrectAnswers: questionEvaluations.filter(q => q.score < 5).length || 0,
      },
      
      categoryBreakdown: {
        technical: {
          score: (session?.technicalScore || feedback?.technicalScore || 0) * 10,
          questionsAnswered: questionEvaluations.filter(q => q.category === 'technical').length || 0,
          strengths: feedback?.strengths?.filter((_, i) => i < 3) || [],
          weaknesses: feedback?.improvements?.filter((_, i) => i < 3) || []
        },
        communication: {
          score: (session?.communicationScore || feedback?.communicationScore || 0) * 10,
          clarity: (session?.communicationScore || feedback?.communicationScore || 0) * 10,
          articulation: Math.max(0, (session?.communicationScore || feedback?.communicationScore || 0) * 10 - 5),
          confidence: (session?.communicationScore || feedback?.communicationScore || 0) * 10
        },
        problemSolving: {
          score: (session?.problemSolvingScore || feedback?.problemSolvingScore || 0) * 10,
          analyticalThinking: (session?.problemSolvingScore || feedback?.problemSolvingScore || 0) * 10,
          creativity: Math.min(100, (session?.problemSolvingScore || feedback?.problemSolvingScore || 0) * 10 + 5),
          efficiency: Math.max(0, (session?.problemSolvingScore || feedback?.problemSolvingScore || 0) * 10 - 3)
        }
      },
      
      detailedFeedback: {
        overallAssessment: feedback?.summary || session?.feedback?.summary || '',
        strengths: feedback?.strengths || session?.feedback?.strengths || [],
        weaknesses: feedback?.improvements || session?.feedback?.improvements || [],
        keyHighlights: feedback?.keyHighlights || session?.feedback?.keyHighlights || [],
        areasOfConcern: feedback?.areasOfConcern || session?.feedback?.areasOfConcern || [],
        technicalAnalysis: feedback?.technicalAnalysis || session?.feedback?.technicalAnalysis || {
          coreConcepts: 'Not available',
          problemSolvingApproach: 'Not available',
          codeQuality: 'Not available',
          bestPractices: 'Not available'
        },
        behavioralAnalysis: feedback?.behavioralAnalysis || session?.feedback?.behavioralAnalysis || {
          communication: 'Not available',
          confidence: 'Not available',
          professionalism: 'Not available',
          adaptability: 'Not available'
        }
      },
      
      improvementPlan: {
        shortTerm: generateImprovementGoals(feedback?.improvements, 'short'),
        mediumTerm: generateImprovementGoals(feedback?.improvements, 'medium'),
        longTerm: generateImprovementGoals(feedback?.improvements, 'long'),
        recommendedCourses: generateCourseRecommendations(session?.interviewId?.role),
        practiceResources: generatePracticeResources(session?.interviewId?.role)
      },
      
      questionAnalysis: questionEvaluations.map((q, idx) => ({
        questionId: q._id || `q-${idx}`,
        questionNumber: q.questionNumber || idx + 1,
        question: q.question,
        yourAnswer: q.userAnswer || 'Not answered',
        score: q.score * 10, // Convert 0-10 to 0-100
        maxScore: 100,
        feedback: q.feedback || '',
        category: q.category || 'general',
        strengths: q.strengths || [],
        improvements: q.improvements || [],
        timeSpent: q.timeSpent || 0
      })),
      
      performanceChart: questionEvaluations.map((q, idx) => ({
        questionNumber: q.questionNumber || idx + 1,
        score: q.score * 10,
        avgScore: overallScore,
        category: q.category
      })),
      
      certificate: certificate || null
    },
    
    config: {
      domain: session?.interviewId?.role || 'Interview',
      subDomain: '',
      difficulty: session?.interviewId?.difficulty || 'medium',
      interviewType: 'AI'
    },
    
    duration: session?.interviewId?.duration || 0,
    completedAt: session?.updatedAt || new Date()
  };
};

// Helper function to generate improvement goals
const generateImprovementGoals = (improvements, timeframe) => {
  if (!improvements || improvements.length === 0) return [];
  
  const priorities = ['high', 'medium', 'low'];
  const timeframes = {
    short: { period: '1-2 weeks', count: 2 },
    medium: { period: '1-2 months', count: 3 },
    long: { period: '3-6 months', count: 2 }
  };
  
  const config = timeframes[timeframe];
  
  return improvements.slice(0, config.count).map((improvement, idx) => ({
    title: improvement,
    description: `Focus on: ${improvement}`,
    priority: priorities[idx % priorities.length],
    estimatedTime: config.period,
    resources: [
      'Online tutorials and documentation',
      'Practice problems and exercises',
      'Code review and peer feedback'
    ]
  }));
};

// Helper function to generate course recommendations
const generateCourseRecommendations = (role) => {
  const courses = {
    'Software Engineer': [
      { title: 'Advanced Data Structures', platform: 'Coursera', level: 'Intermediate', duration: '6 weeks', url: '#' },
      { title: 'System Design Fundamentals', platform: 'Udemy', level: 'Advanced', duration: '8 weeks', url: '#' }
    ],
    'Frontend Developer': [
      { title: 'React Advanced Patterns', platform: 'Frontend Masters', level: 'Advanced', duration: '4 weeks', url: '#' },
      { title: 'Modern CSS & Design Systems', platform: 'Udemy', level: 'Intermediate', duration: '5 weeks', url: '#' }
    ],
    // Add more roles as needed
  };
  
  return courses[role] || courses['Software Engineer'];
};

// Helper function to generate practice resources
const generatePracticeResources = (role) => {
  return [
    {
      title: 'LeetCode Practice Problems',
      type: 'Coding Platform',
      description: 'Daily coding challenges to improve problem-solving skills',
      url: 'https://leetcode.com'
    },
    {
      title: 'System Design Primer',
      type: 'GitHub Repository',
      description: 'Comprehensive guide to system design concepts',
      url: 'https://github.com/donnemartin/system-design-primer'
    },
    {
      title: 'Interview Practice Sessions',
      type: 'Mock Interviews',
      description: 'Practice with peers or mentors for real interview experience',
      url: '#'
    }
  ];
};

  const calculateGrade = (score) => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 75) return "C+";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const calculatePercentile = (score) => {
    if (score >= 90) return 95;
    if (score >= 80) return 85;
    if (score >= 70) return 70;
    if (score >= 60) return 55;
    if (score >= 50) return 40;
    return 25;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-16 h-16 text-blue-500" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl mt-4 text-gray-600 font-medium"
        >
          Analyzing your performance...
        </motion.p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Results</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // CRITICAL: Validate data structure before rendering
  if (!currentResults || !currentResults.results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Available</h2>
        <p className="text-gray-600 mb-4">Please complete the interview first.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { results, config, duration, completedAt } = currentResults;
  const { summary, categoryBreakdown, detailedFeedback, improvementPlan, questionAnalysis, performanceChart } = results;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'feedback', label: 'Feedback', icon: Lightbulb },
    { id: 'improvement', label: 'Improvement Plan', icon: Target },
    { id: 'questions', label: 'Questions', icon: BookOpen },
    { id: 'certificate', label: 'Certificate', icon: Award }
  ];

  return (
    <div className="results-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `fall ${3 + Math.random() * 2}s linear ${Math.random() * 3}s infinite`
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
              summary.passed ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <span className="text-4xl font-bold">{summary.overallScore || 0}</span>
              <span className="text-lg text-gray-500">/100</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              {summary.passed ? '🎉 Congratulations! You Passed!' : 'Interview Completed'}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {config.domain} {config.subDomain && `- ${config.subDomain}`} ({config.difficulty})
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{summary.questionsAnswered || 0} Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Grade: {summary.grade || 'N/A'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <ScoreCard summary={summary} />
              {categoryBreakdown && <CategoryBreakdown categories={categoryBreakdown} />}
            </motion.div>
          )}
          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {performanceChart && <PerformanceChart data={performanceChart} />}
            </motion.div>
          )}
          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {detailedFeedback && <DetailedFeedback feedback={detailedFeedback} />}
            </motion.div>
          )}
          {activeTab === 'improvement' && (
            <motion.div
              key="improvement"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {improvementPlan && <ImprovementPlan plan={improvementPlan} />}
            </motion.div>
          )}
          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {questionAnalysis && <QuestionAnalysis questions={questionAnalysis} />}
            </motion.div>
          )}

          {activeTab === 'certificate' && results.certificate && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <CertificateSection
                certificate={results.certificate}
                summary={summary}
                config={config}
                completedAt={completedAt}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;

// File: src/pages/Results.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { completeInterview } from '../services/operations/aiInterviewApi';
// import ResultsPage from '../components/Result/ResultsPage';

// const Results = () => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const { token } = useSelector((state) => state.auth);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const handleCompleteInterview = async () => {
//       try {
//         setLoading(true);
//         const response = await completeInterview(interviewId, token);
//         console.log('Complete interview response:', response);
//         setResult(response);
//       } catch (error) {
//         console.error('Error completing interview:', error);
//         setError(error.message || 'Failed to load results');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (interviewId && token) {
//       handleCompleteInterview();
//     }
//   }, [interviewId, token]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
//           <h2 className="text-2xl text-white font-bold mb-2">Loading Results...</h2>
//           <p className="text-gray-400">Please wait while we fetch your interview results</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">❌</div>
//           <h2 className="text-2xl text-white font-bold mb-2">Error Loading Results</h2>
//           <p className="text-gray-400 mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ResultsPage
//       interviewId={interviewId}
//       result={result}
//       navigate={navigate}
//     />
//   );
// };

// export default Results;