// // Results.jsx - ADD these defensive checks at the top

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchInterviewResults } from '../services/operations/resultsAPI';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Trophy, Clock, CheckCircle, AlertCircle, Activity, 
//   BarChart3, Lightbulb, Target, BookOpen, Award,
//   Download, Share2, ArrowRight, Sparkles, Calendar, Brain
// } from 'lucide-react';

// // Import components
// import ScoreCard from '../components/results/ScoreCard';
// import PerformanceChart from '../components/results/PerformanceChart';
// import CategoryBreakdown from '../components/results/CategoryBreakdown';
// import DetailedFeedback from '../components/results/DetailedFeedback';
// import ImprovementPlan from '../components/results/ImprovementPlan';
// import QuestionAnalysis from '../components/results/QuestionAnalysis';
// import ComparisonStats from '../components/results/ComparisonStats';
// import CertificateSection from '../components/results/CertificateSection';

// const Results = () => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { currentResults, loading, error } = useSelector((state) => state.results);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showConfetti, setShowConfetti] = useState(false);

//   useEffect(() => {
//     console.log('Results Component - interviewId:', interviewId);
    
//     if (!interviewId) {
//       console.error('No interviewId provided');
//       navigate('/dashboard');
//       return;
//     }
    
//     dispatch(fetchInterviewResults(interviewId));
//   }, [dispatch, interviewId, navigate]);

//   useEffect(() => {
//     console.log('Current Results:', currentResults);
    
//     if (currentResults?.results?.summary?.passed) {
//       setShowConfetti(true);
//       setTimeout(() => setShowConfetti(false), 5000);
//     }
//   }, [currentResults]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <motion.div
//           className="relative"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//         >
//           <Brain className="w-16 h-16 text-blue-500" />
//         </motion.div>
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="text-xl mt-4 text-gray-600 font-medium"
//         >
//           Analyzing your performance...
//         </motion.p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
//         <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Results</h2>
//         <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   // CRITICAL: Validate data structure before rendering
//   if (!currentResults) {
//     console.log('No results data available');
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//         <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Available</h2>
//         <p className="text-gray-600 mb-4">Please complete the interview first.</p>
//         <button
//           onClick={() => navigate('/dashboard')}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   // Destructure with fallbacks
//   const { 
//     results = {}, 
//     config = {}, 
//     duration = 0, 
//     completedAt = new Date() 
//   } = currentResults;

//   // CRITICAL: Validate results object structure
//   if (!results.summary) {
//     console.error('Results summary is missing:', results);
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
//         <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Incomplete Results</h2>
//         <p className="text-gray-600 mb-4">Results are being generated. Please refresh in a moment.</p>
//         <div className="flex gap-3">
//           <button
//             onClick={() => dispatch(fetchInterviewResults(interviewId))}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Refresh Results
//           </button>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Destructure nested results with fallbacks
//   const { 
//     summary = {}, 
//     categoryBreakdown = {}, 
//     detailedFeedback = {}, 
//     improvementPlan = {}, 
//     comparisonData = {}, 
//     questionAnalysis = [], 
//     certificateData = {}, 
//     performanceChart = {} 
//   } = results;

//   // Rest of your component code continues...
//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: Activity },
//     { id: 'performance', label: 'Performance', icon: BarChart3 },
//     { id: 'feedback', label: 'Feedback', icon: Lightbulb },
//     { id: 'improvement', label: 'Improvement Plan', icon: Target },
//     { id: 'questions', label: 'Questions', icon: BookOpen },
//     { id: 'certificate', label: 'Certificate', icon: Award }
//   ];

//   return (
//     <div className="results-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
//       {/* Your existing JSX continues here... */}
//       <div className="max-w-7xl mx-auto">
//         {/* Hero Section */}
//         <motion.div
//           className="bg-white rounded-2xl shadow-xl p-8 mb-6"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <div className="text-center">
//             <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
//               summary.passed ? 'bg-green-100' : 'bg-yellow-100'
//             }`}>
//               <span className="text-4xl font-bold">{summary.overallScore || 0}</span>
//               <span className="text-lg text-gray-500">/100</span>
//             </div>
            
//             <h1 className="text-3xl font-bold mb-2">
//               {summary.passed ? (
//                 <>
//                   <Sparkles className="inline w-8 h-8 text-yellow-400 mr-2" />
//                   Congratulations! You Passed!
//                 </>
//               ) : (
//                 'Interview Completed'
//               )}
//             </h1>
            
//             <p className="text-gray-600 mb-4">
//               {config.domain} - {config.subDomain} ({config.difficulty})
//             </p>
            
//             <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span>{Math.floor((duration || 0) / 60)} min</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4" />
//                 <span>{summary.questionsAnswered || 0} Answered</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Trophy className="w-4 h-4" />
//                 <span>Grade: {summary.grade || 'N/A'}</span>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-xl shadow-lg p-2 mb-6 flex gap-2 overflow-x-auto">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//               >
//                 <Icon className="w-4 h-4" />
//                 <span className="text-sm font-medium">{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Content Area */}
//         <AnimatePresence mode="wait">
//           {activeTab === 'overview' && (
//             <motion.div
//               key="overview"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="space-y-6"
//             >
//               <ScoreCard summary={summary} />
//               {comparisonData && <ComparisonStats data={comparisonData} summary={summary} />}
//               {categoryBreakdown && <CategoryBreakdown categories={categoryBreakdown} />}
//             </motion.div>
//           )}
//           {activeTab === 'performance' && (
//             <motion.div
//               key="performance"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="space-y-6"
//             >
//               {performanceChart && <PerformanceChart data={performanceChart} />}
//             </motion.div>
//           )}
//           {activeTab === 'feedback' && (
//             <motion.div
//               key="feedback"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="space-y-6"
//             >
//               {detailedFeedback && <DetailedFeedback feedback={detailedFeedback} /> }
              
//             </motion.div>
//           )}
//           {activeTab === 'improvement' && (
//             <motion.div
//               key="improvement"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="space-y-6"
//             >
//               {improvementPlan && <ImprovementPlan plan={improvementPlan} />}
              
//             </motion.div>
//           )}
//           {activeTab === 'questions' && (
//             <motion.div
//               key="questions"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="space-y-6"
//             >
//               {questionAnalysis && <QuestionAnalysis questions={questionAnalysis} />}
              
//             </motion.div>
//           )}
//           {activeTab === 'certificate' && (
//             <motion.div
//               key="certificate"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="space-y-6"
//             >
//               {certificateData && <CertificateSection certificate={certificateData} config={config} summary={summary} completedAt={completedAt} />}
//             </motion.div>
//           )}

          
//           {/* Add other tabs similarly... */}
          
//         </AnimatePresence>

//         {/* Action Buttons */}
//         <div className="mt-6 flex flex-wrap gap-3 justify-center">
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
//           >
//             <Activity className="w-5 h-5" />
//             Dashboard
//           </button>
//           <button 
//             onClick={() => window.print()}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//           >
//             <Download className="w-5 h-5" />
//             Download Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Results;

// File: src/pages/Results.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { completeInterview } from '../services/operations/aiInterviewApi';
import ResultsPage from '../components/Result/ResultsPage';

const Results = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleCompleteInterview = async (sessionId, interviewId) => {
    try {
      const response = await completeInterview(sessionId, interviewId, token);
      return response;
    } catch (error) {
      console.error('Error completing interview:', error);
      throw error;
    }
  };

  return (
    <ResultsPage
      interviewId={interviewId}
      sessionId={interviewId} // Or get from route if different
      completeInterview={handleCompleteInterview}
      navigate={navigate}
    />
  );
};

export default Results;