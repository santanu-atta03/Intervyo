// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, BookOpen, Clock, Target, CheckCircle, Lock, Play, ChevronRight, TrendingUp, Lightbulb, Share2, Bookmark, Download, AlertCircle, FileText, Code, HelpCircle, Brain } from 'lucide-react';
// import { useSelector } from 'react-redux';

// const API_BASE_URL = 'http://localhost:5000/api';

// export function TopicDetailPage({ topicId, onModuleSelect, onBack }) {
//   const { token } = useSelector((state) => state.auth);
//   // const [topic, setTopic] = useState(null);
//   // const [modules, setModules] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState(null);
//   const [enrolling, setEnrolling] = useState(false);

//   // useEffect(() => {
//   //   fetchTopicData();
//   // }, [topicId]);

//   // const fetchTopicData = async () => {
//   //   setLoading(true);
//   //   setError(null);
    
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/learning-hub/topics/${topicId}`, {
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`
//   //       }
//   //     });

//   //     if (!response.ok) throw new Error('Failed to fetch topic');

//   //     const data = await response.json();
//   //     setTopic(data.data.topic);
//   //     setModules(data.data.modules || []);
      
//   //     // If enrolled but no modules, they're being generated
//   //     if (data.data.isEnrolled && (!data.data.modules || data.data.modules.length === 0)) {
//   //       setError('AI is generating your course content. Please refresh in a moment...');
//   //     }
//   //   } catch (err) {
//   //     console.error('Error fetching topic:', err);
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleEnroll = async () => {
//     setEnrolling(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/learning-hub/topics/${topicId}/enroll`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         alert(`✅ ${data.message}\n🎉 You earned ${data.data.xpAwarded} XP!\n🤖 AI is generating your personalized course modules...`);
        
//         // Wait 2 seconds then refresh
//         setTimeout(() => {
//           fetchTopicData();
//         }, 2000);
//       } else {
//         const error = await response.json();
//         alert(error.message || 'Failed to enroll');
//       }
//     } catch (err) {
//       console.error('Error enrolling:', err);
//       alert('Failed to enroll. Please try again.');
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   const [topic, setTopic] = useState(null);
//   const [modules, setModules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEnrolled, setIsEnrolled] = useState(false);
 
//   useEffect(() => {
//     fetchTopicData();
//   }, [topicId]);

//   const fetchTopicData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/learning-hub/topics/${topicId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) throw new Error('Failed to fetch topic');
//       const data = await response.json();
//       console.log("Dta : ",data);
//       setIsEnrolled(data.data.isEnrolled)
//       setTopic(data.data.topic);
//       setModules(data.data.modules || []);
      
//       if (data.data.isEnrolled && (!data.data.modules || data.data.modules.length === 0)) {
//         setError('AI is generating your course content. Please refresh in a moment...');
//       }
//     } catch (err) {
//       console.error('Error fetching topic:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getContentTypeIcon = (type) => {
//     switch(type) {
//       case 'text': return <FileText className="w-5 h-5" />;
//       case 'code': return <Code className="w-5 h-5" />;
//       case 'quiz': return <HelpCircle className="w-5 h-5" />;
//       case 'project': return <Target className="w-5 h-5" />;
//       default: return <BookOpen className="w-5 h-5" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-400">Loading course content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!topic) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400 mb-4">Topic not found</p>
//           <button onClick={onBack} className="text-purple-400 hover:text-purple-300">
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const userProgress = topic.userProgress;
  
//   const completedCount = modules.filter(m => 
//     userProgress?.completedModules?.some(cm => cm.moduleId === m._id)
//   ).length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
//       <div className="max-w-7xl mx-auto">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>Back to Learning Hub</span>
//         </button>

//         {error && (
//           <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
//             <p className="text-yellow-300 text-sm">{error}</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             {/* Topic Header */}
//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
//               <div className="flex items-start gap-6 mb-6">
//                 <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-5xl shadow-lg flex-shrink-0">
//                   {topic.icon}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-center gap-3 mb-3">
//                     <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
//                       {topic.domain}
//                     </span>
//                     <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
//                       {topic.difficulty}
//                     </span>
//                   </div>
//                   <h1 className="text-4xl font-bold text-white mb-3">{topic.title}</h1>
//                   <p className="text-gray-300 text-lg leading-relaxed">{topic.description}</p>
//                 </div>
//               </div>

//               {isEnrolled && userProgress && (
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium text-gray-400">Course Progress</span>
//                     <span className="text-sm font-bold text-purple-400">{userProgress.progressPercentage || 0}%</span>
//                   </div>
//                   <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
//                       style={{ width: `${userProgress.progressPercentage || 0}%` }}
//                     ></div>
//                   </div>
//                   <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
//                     <div className="flex items-center gap-2">
//                       <CheckCircle className="w-4 h-4 text-emerald-400" />
//                       <span>{completedCount}/{modules.length} modules completed</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-blue-400" />
//                       <span>{Math.floor((userProgress.totalTimeSpent || 0) / 60)}h {(userProgress.totalTimeSpent || 0) % 60}m invested</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-3 gap-4">
//                 <div className="bg-gray-700/30 rounded-xl p-4 text-center">
//                   <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
//                   <div className="text-2xl font-bold text-white mb-1">{topic.estimatedHours}h</div>
//                   <div className="text-xs text-gray-400">Total Duration</div>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-xl p-4 text-center">
//                   <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
//                   <div className="text-2xl font-bold text-white mb-1">{modules.length}</div>
//                   <div className="text-xs text-gray-400">Modules</div>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-xl p-4 text-center">
//                   <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
//                   <div className="text-2xl font-bold text-white mb-1">{topic.difficulty}</div>
//                   <div className="text-xs text-gray-400">Level</div>
//                 </div>
//               </div>

//               {!isEnrolled && (
//                 <div className="mt-6">
//                   <button
//                     onClick={handleEnroll}
//                     disabled={enrolling}
//                     className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {enrolling ? '🤖 Enrolling & Generating Content...' : '✨ Enroll Now & Start Learning'}
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Course Curriculum */}
//             {modules.length > 0 && (
//               <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <BookOpen className="w-6 h-6 text-purple-400" />
//                   <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
//                   <span className="ml-auto text-sm text-gray-400">{modules.length} modules</span>
//                 </div>

//                 <div className="space-y-3">
//                   {modules.map((module, index) => {
//                     const isCompleted = userProgress?.completedModules?.some(
//                       cm => cm.moduleId === module._id
//                     );
//                     const isLocked = !isEnrolled || (index > 0 && !modules.slice(0, index).every(m => 
//                       userProgress?.completedModules?.some(cm => cm.moduleId === m._id)
//                     ));
//                     const isCurrent = isEnrolled && !isCompleted && !isLocked;

//                     return (
//                       <div
//                         key={module._id}
//                         className={`bg-gray-700/30 rounded-xl border transition ${
//                           isLocked
//                             ? 'border-gray-700/30 opacity-60'
//                             : isCurrent
//                             ? 'border-purple-500/50 bg-purple-500/10'
//                             : isCompleted
//                             ? 'border-emerald-500/30'
//                             : 'border-gray-700/30 hover:border-gray-600/50'
//                         }`}
//                       >
//                         <div className="p-4">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4 flex-1">
//                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                                 isCompleted
//                                   ? 'bg-emerald-500/20 text-emerald-400'
//                                   : isCurrent
//                                   ? 'bg-purple-500/20 text-purple-400'
//                                   : isLocked
//                                   ? 'bg-gray-700/30 text-gray-500'
//                                   : 'bg-gray-700/50 text-gray-400'
//                               }`}>
//                                 {isCompleted ? (
//                                   <CheckCircle className="w-6 h-6" />
//                                 ) : isLocked ? (
//                                   <Lock className="w-5 h-5" />
//                                 ) : (
//                                   getContentTypeIcon(module.contentType)
//                                 )}
//                               </div>

//                               <div className="flex-1">
//                                 <h3 className="text-white font-semibold mb-1">{module.title}</h3>
//                                 <p className="text-sm text-gray-400">{module.description}</p>
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-4">
//                               <div className="text-right">
//                                 <div className="text-sm text-gray-400 flex items-center gap-1">
//                                   <Clock className="w-4 h-4" />
//                                   {module.estimatedMinutes} min
//                                 </div>
//                               </div>
                              
//                               {!isLocked && (
//                                 <button
//                                   onClick={() => onModuleSelect(module._id)}
//                                   className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
//                                     isCompleted
//                                       ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
//                                       : isCurrent
//                                       ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
//                                       : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
//                                   }`}
//                                 >
//                                   {isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'}
//                                   <ChevronRight className="w-4 h-4" />
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Prerequisites */}
//             {topic.prerequisites && topic.prerequisites.length > 0 && (
//               <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                   <Lightbulb className="w-5 h-5 text-yellow-400" />
//                   Prerequisites
//                 </h3>
//                 <ul className="space-y-2">
//                   {topic.prerequisites.map((prereq, idx) => (
//                     <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
//                       <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
//                       {prereq}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Tags */}
//             {topic.tags && topic.tags.length > 0 && (
//               <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//                 <h3 className="text-lg font-bold text-white mb-4">Topics Covered</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {topic.tags.map((tag, idx) => (
//                     <span key={idx} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-sm border border-gray-600/30">
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Actions */}
//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 space-y-3">
//               <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
//                 <Bookmark className="w-5 h-5" />
//                 Save for Later
//               </button>
//               <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
//                 <Share2 className="w-5 h-5" />
//                 Share Course
//               </button>
//               <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
//                 <Download className="w-5 h-5" />
//                 Download Resources
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// export function TopicDetailPage({ topicId, onBack, onModuleSelect }) {
//   const [topic, setTopic] = useState(null);
//   const [modules, setModules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [enrolling, setEnrolling] = useState(false);

//   React.useEffect(() => {
//     fetchTopicData();
//   }, [topicId]);

//   const fetchTopicData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Simulated API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Mock data
//       setTopic({
//         _id: topicId,
//         icon: '⚛️',
//         title: 'React Fundamentals',
//         description: 'Master the core concepts of React including components, state, and props',
//         domain: 'Frontend',
//         difficulty: 'Intermediate',
//         estimatedHours: 12,
//         isEnrolled: true,
//         userProgress: {
//           progressPercentage: 30,
//           completedModules: ['module-1'],
//           totalTimeSpent: 180
//         },
//         prerequisites: ['JavaScript ES6', 'HTML & CSS'],
//         tags: ['React', 'Components', 'Hooks', 'State Management']
//       });

//       setModules([
//         {
//           _id: 'module-1',
//           title: 'Introduction to React',
//           description: 'Learn what React is and why it matters',
//           estimatedMinutes: 30,
//           contentType: 'text'
//         },
//         {
//           _id: 'module-2',
//           title: 'React Components',
//           description: 'Understanding functional and class components',
//           estimatedMinutes: 45,
//           contentType: 'code'
//         },
//         {
//           _id: 'module-3',
//           title: 'State and Props',
//           description: 'Managing component state and passing data',
//           estimatedMinutes: 40,
//           contentType: 'text'
//         }
//       ]);
//     } catch (err) {
//       console.error('Error fetching topic:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnroll = async () => {
//     setEnrolling(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       alert(`✅ Successfully enrolled!\n🎉 You earned 100 XP!`);
//       fetchTopicData();
//     } catch (err) {
//       console.error('Error enrolling:', err);
//       alert('Failed to enroll. Please try again.');
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   const getContentTypeIcon = (type) => {
//     switch(type) {
//       case 'text': return <FileText className="w-5 h-5" />;
//       case 'code': return <Code className="w-5 h-5" />;
//       case 'quiz': return <HelpCircle className="w-5 h-5" />;
//       case 'project': return <Target className="w-5 h-5" />;
//       default: return <BookOpen className="w-5 h-5" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-400">Loading course content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!topic) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400 mb-4">Topic not found</p>
//           <button onClick={onBack} className="text-purple-400 hover:text-purple-300">
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const userProgress = topic.userProgress;
//   const isEnrolled = topic.isEnrolled;
//   const completedCount = modules.filter(m => 
//     userProgress?.completedModules?.includes(m._id)
//   ).length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
//       <div className="max-w-7xl mx-auto">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>Back to Learning Hub</span>
//         </button>

//         {error && (
//           <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
//             <p className="text-yellow-300 text-sm">{error}</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
//               <div className="flex items-start gap-6 mb-6">
//                 <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-5xl shadow-lg flex-shrink-0">
//                   {topic.icon}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-center gap-3 mb-3">
//                     <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
//                       {topic.domain}
//                     </span>
//                     <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
//                       {topic.difficulty}
//                     </span>
//                   </div>
//                   <h1 className="text-4xl font-bold text-white mb-3">{topic.title}</h1>
//                   <p className="text-gray-300 text-lg leading-relaxed">{topic.description}</p>
//                 </div>
//               </div>

//               {isEnrolled && userProgress && (
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium text-gray-400">Course Progress</span>
//                     <span className="text-sm font-bold text-purple-400">{userProgress.progressPercentage || 0}%</span>
//                   </div>
//                   <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
//                       style={{ width: `${userProgress.progressPercentage || 0}%` }}
//                     ></div>
//                   </div>
//                   <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
//                     <div className="flex items-center gap-2">
//                       <CheckCircle className="w-4 h-4 text-emerald-400" />
//                       <span>{completedCount}/{modules.length} modules completed</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-blue-400" />
//                       <span>{Math.floor((userProgress.totalTimeSpent || 0) / 60)}h {(userProgress.totalTimeSpent || 0) % 60}m invested</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-3 gap-4">
//                 <div className="bg-gray-700/30 rounded-xl p-4 text-center">
//                   <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
//                   <div className="text-2xl font-bold text-white mb-1">{topic.estimatedHours}h</div>
//                   <div className="text-xs text-gray-400">Total Duration</div>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-xl p-4 text-center">
//                   <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
//                   <div className="text-2xl font-bold text-white mb-1">{modules.length}</div>
//                   <div className="text-xs text-gray-400">Modules</div>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-xl p-4 text-center">
//                   <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
//                   <div className="text-2xl font-bold text-white mb-1">{topic.difficulty}</div>
//                   <div className="text-xs text-gray-400">Level</div>
//                 </div>
//               </div>

//               {!isEnrolled && (
//                 <div className="mt-6">
//                   <button
//                     onClick={handleEnroll}
//                     disabled={enrolling}
//                     className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
//                   >
//                     {enrolling ? '🤖 Enrolling...' : '✨ Enroll Now & Start Learning'}
//                   </button>
//                 </div>
//               )}
//             </div>

//             {modules.length > 0 && (
//               <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <BookOpen className="w-6 h-6 text-purple-400" />
//                   <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
//                   <span className="ml-auto text-sm text-gray-400">{modules.length} modules</span>
//                 </div>

//                 <div className="space-y-3">
//                   {modules.map((module, index) => {
//                     const isCompleted = userProgress?.completedModules?.includes(module._id);
//                     const isLocked = !isEnrolled;
//                     const isCurrent = isEnrolled && !isCompleted && !isLocked;

//                     return (
//                       <div
//                         key={module._id}
//                         className={`bg-gray-700/30 rounded-xl border transition ${
//                           isLocked
//                             ? 'border-gray-700/30 opacity-60'
//                             : isCurrent
//                             ? 'border-purple-500/50 bg-purple-500/10'
//                             : isCompleted
//                             ? 'border-emerald-500/30'
//                             : 'border-gray-700/30 hover:border-gray-600/50'
//                         }`}
//                       >
//                         <div className="p-4">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4 flex-1">
//                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                                 isCompleted
//                                   ? 'bg-emerald-500/20 text-emerald-400'
//                                   : isCurrent
//                                   ? 'bg-purple-500/20 text-purple-400'
//                                   : isLocked
//                                   ? 'bg-gray-700/30 text-gray-500'
//                                   : 'bg-gray-700/50 text-gray-400'
//                               }`}>
//                                 {isCompleted ? (
//                                   <CheckCircle className="w-6 h-6" />
//                                 ) : isLocked ? (
//                                   <Lock className="w-5 h-5" />
//                                 ) : (
//                                   getContentTypeIcon(module.contentType)
//                                 )}
//                               </div>

//                               <div className="flex-1">
//                                 <h3 className="text-white font-semibold mb-1">{module.title}</h3>
//                                 <p className="text-sm text-gray-400">{module.description}</p>
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-4">
//                               <div className="text-right">
//                                 <div className="text-sm text-gray-400 flex items-center gap-1">
//                                   <Clock className="w-4 h-4" />
//                                   {module.estimatedMinutes} min
//                                 </div>
//                               </div>
                              
//                               {!isLocked && (
//                                 <button
//                                   onClick={() => onModuleSelect(module._id)}
//                                   className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
//                                     isCompleted
//                                       ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
//                                       : isCurrent
//                                       ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
//                                       : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
//                                   }`}
//                                 >
//                                   {isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'}
//                                   <ChevronRight className="w-4 h-4" />
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="space-y-6">
//             {topic.prerequisites && topic.prerequisites.length > 0 && (
//               <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                   <Lightbulb className="w-5 h-5 text-yellow-400" />
//                   Prerequisites
//                 </h3>
//                 <ul className="space-y-2">
//                   {topic.prerequisites.map((prereq, idx) => (
//                     <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
//                       <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
//                       {prereq}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {topic.tags && topic.tags.length > 0 && (
//               <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//                 <h3 className="text-lg font-bold text-white mb-4">Topics Covered</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {topic.tags.map((tag, idx) => (
//                     <span key={idx} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-sm border border-gray-600/30">
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 space-y-3">
//               <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
//                 <Bookmark className="w-5 h-5" />
//                 Save for Later
//               </button>
//               <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
//                 <Share2 className="w-5 h-5" />
//                 Share Course
//               </button>
//               <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
//                 <Download className="w-5 h-5" />
//                 Download Resources
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, Target, CheckCircle, Lock, Play, ChevronRight, TrendingUp, Lightbulb, Share2, Bookmark, Download, AlertCircle, FileText, Code, HelpCircle, Brain } from 'lucide-react';
import { useSelector } from 'react-redux';
import { customToast } from '../../utils/toast';

const API_BASE_URL = 'https://intervyo.onrender.com/api';

export function TopicDetailPage({ topicId, onBack, onModuleSelect }) {
  const { token } = useSelector((state) => state.auth);
  const [topic, setTopic] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchTopicData();
  }, [topicId]);

  const fetchTopicData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/learning-hub/topics/${topicId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch topic');
      }

      const data = await response.json();
      console.log('Topic data received:', data);
      
      setIsEnrolled(data.data.isEnrolled);
      setTopic(data.data.topic);
      setModules(data.data.modules || []);
      
      if (data.data.isEnrolled && (!data.data.modules || data.data.modules.length === 0)) {
        setError('AI is generating your course content. Please refresh in a moment...');
      }
    } catch (err) {
      console.error('Error fetching topic:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const response = await fetch(`${API_BASE_URL}/learning-hub/topics/${topicId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        customToast.success(data.message);
        customToast.success(`You earned ${data.data.xpAwarded} XP!`);
        
        // Wait 2 seconds then refresh to show generated modules
        setTimeout(() => {
          fetchTopicData();
        }, 2000);
      } else {
        const error = await response.json();
        customToast.error(error.message || 'Failed to enroll');
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      customToast.error('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };


  const handleShareCourse = async (topic) => {
  const shareData = {
    title: topic.title,
    text: `Check out this course: ${topic.title} - ${topic.description}`,
    url: `${window.location.origin}/learning-hub/topics/${topic._id}`
  };

  try {
    // Check if Web Share API is supported
    if (navigator.share) {
      await navigator.share(shareData);
      customToast.success('Course shared successfully!');
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      customToast.success('Course link copied to clipboard!');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
      customToast.error('Failed to share course');
    }
  }
};


const handleDownloadResources = async (topic, modules, token) => {
  try {
    customToast.info('Preparing resources for download...');

    // Create markdown content with all modules
    let markdownContent = `# ${topic.title}\n\n`;
    markdownContent += `**Description:** ${topic.description}\n\n`;
    markdownContent += `**Domain:** ${topic.domain}\n`;
    markdownContent += `**Difficulty:** ${topic.difficulty}\n`;
    markdownContent += `**Estimated Hours:** ${topic.estimatedHours}h\n\n`;
    
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      markdownContent += `## Prerequisites\n`;
      topic.prerequisites.forEach(prereq => {
        markdownContent += `- ${prereq}\n`;
      });
      markdownContent += '\n';
    }

    markdownContent += `---\n\n`;
    markdownContent += `## Course Modules\n\n`;

    // Fetch and add each module's content
    for (const module of modules) {
      markdownContent += `### ${module.title}\n\n`;
      markdownContent += `**Duration:** ${module.estimatedMinutes} minutes\n`;
      markdownContent += `**Type:** ${module.contentType}\n\n`;
      
      try {
        // Fetch module content
        const response = await fetch(
          `https://intervyo.onrender.com/api/learning-hub/modules/${module._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const content = data.data.content;
          
          if (typeof content === 'object' && content.content) {
            markdownContent += content.content + '\n\n';
          } else if (typeof content === 'string') {
            markdownContent += content + '\n\n';
          }
        }
      } catch (err) {
        console.error(`Error fetching module ${module.title}:`, err);
        markdownContent += `_Content not available_\n\n`;
      }

      markdownContent += `---\n\n`;
    }

    // Add footer
    markdownContent += `\n\n---\n`;
    markdownContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
    markdownContent += `Course URL: ${window.location.origin}/learning-hub/topics/${topic._id}\n`;

    // Create blob and download
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.title.replace(/[^a-z0-9]/gi, '_')}_course_notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    customToast.success('Resources downloaded successfully!');
  } catch (error) {
    console.error('Error downloading resources:', error);
    customToast.error('Failed to download resources');
  }
};

 const handleDownloadModule = (module, content) => {
  try {
    let markdownContent = `# ${module.title}\n\n`;
    markdownContent += `**Duration:** ${module.estimatedMinutes} minutes\n`;
    markdownContent += `**Type:** ${module.contentType}\n\n`;
    markdownContent += `---\n\n`;

    if (typeof content === 'object' && content.content) {
      markdownContent += content.content;
    } else if (typeof content === 'string') {
      markdownContent += content;
    }

    markdownContent += `\n\n---\n`;
    markdownContent += `Downloaded on: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${module.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    customToast.success('Module downloaded successfully!');
  } catch (error) {
    console.error('Error downloading module:', error);
    customToast.error('Failed to download module');
  }
};

  const handleShareModule = async (module, topicId) => {
  const shareData = {
    title: module.title,
    text: `Check out this module: ${module.title}`,
    url: `${window.location.origin}/learning-hub/topics/${topicId}/modules/${module._id}`
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      customToast.success('Module shared successfully!');
    } else {
      await navigator.clipboard.writeText(shareData.url);
      customToast.success('Module link copied to clipboard!');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
      customToast.error('Failed to share module');
    }
  }
};

  const getContentTypeIcon = (type) => {
    switch(type) {
      case 'text': return <FileText className="w-5 h-5" />;
      case 'code': return <Code className="w-5 h-5" />;
      case 'quiz': return <HelpCircle className="w-5 h-5" />;
      case 'project': return <Target className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">Topic not found</p>
          <button 
            onClick={onBack} 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const userProgress = topic.userProgress;
  const completedCount = modules.filter(m => 
    userProgress?.completedModules?.some(cm => cm.moduleId === m._id)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Learning Hub</span>
        </button>

        {error && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-5xl shadow-lg flex-shrink-0">
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                      {topic.domain}
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
                      {topic.difficulty}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3">{topic.title}</h1>
                  <p className="text-gray-300 text-lg leading-relaxed">{topic.description}</p>
                </div>
              </div>

              {isEnrolled && userProgress && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-400">Course Progress</span>
                    <span className="text-sm font-bold text-purple-400">{userProgress.progressPercentage || 0}%</span>
                  </div>
                  <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${userProgress.progressPercentage || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>{completedCount}/{modules.length} modules completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>{Math.floor((userProgress.totalTimeSpent || 0) / 60)}h {(userProgress.totalTimeSpent || 0) % 60}m invested</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">{topic.estimatedHours}h</div>
                  <div className="text-xs text-gray-400">Total Duration</div>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                  <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">{modules.length}</div>
                  <div className="text-xs text-gray-400">Modules</div>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">{topic.difficulty}</div>
                  <div className="text-xs text-gray-400">Level</div>
                </div>
              </div>

              {!isEnrolled && (
                <div className="mt-6">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? '🤖 Enrolling & Generating Content...' : '✨ Enroll Now & Start Learning'}
                  </button>
                </div>
              )}
            </div>

            {modules.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
                  <span className="ml-auto text-sm text-gray-400">{modules.length} modules</span>
                </div>

                <div className="space-y-3">
                  {modules.map((module, index) => {
                    const isCompleted = userProgress?.completedModules?.some(
                      cm => cm.moduleId === module._id
                    );
                    const isLocked = !isEnrolled;
                    const isCurrent = isEnrolled && !isCompleted && !isLocked;

                    return (
                      <div
                        key={module._id}
                        className={`bg-gray-700/30 rounded-xl border transition ${
                          isLocked
                            ? 'border-gray-700/30 opacity-60'
                            : isCurrent
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : isCompleted
                            ? 'border-emerald-500/30'
                            : 'border-gray-700/30 hover:border-gray-600/50'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : isCurrent
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : isLocked
                                  ? 'bg-gray-700/30 text-gray-500'
                                  : 'bg-gray-700/50 text-gray-400'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-6 h-6" />
                                ) : isLocked ? (
                                  <Lock className="w-5 h-5" />
                                ) : (
                                  getContentTypeIcon(module.contentType)
                                )}
                              </div>

                              <div className="flex-1">
                                <h3 className="text-white font-semibold mb-1">{module.title}</h3>
                                <p className="text-sm text-gray-400">{module.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm text-gray-400 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {module.estimatedMinutes} min
                                </div>
                              </div>
                              
                              {!isLocked && (
                                <button
                                  onClick={() => onModuleSelect(module._id)}
                                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                                    isCompleted
                                      ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                      : isCurrent
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                  }`}
                                >
                                  {isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'}
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {topic.prerequisites && topic.prerequisites.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {topic.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {topic.tags && topic.tags.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-sm border border-gray-600/30">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 space-y-3">
              <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                <Bookmark className="w-5 h-5" />
                Save for Later
              </button>
              <button onClick={() => handleShareModule(module, module.topicId._id)} className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Course
              </button>
              <button onClick={() => handleDownloadModule(module, content)} className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}