import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, BookOpen, Clock, TrendingUp, CheckCircle, Play, ChevronRight, Sparkles, Brain, Target, AlertCircle, ArrowLeft, FileText, Code, HelpCircle, Bookmark, Share2, Download, Eye, BarChart3, MessageSquare, Lightbulb, Lock } from 'lucide-react';
import ModuleContentPage from './ModuleContentPage';
import { TopicDetailPage } from './TopicDetailPage';

const API_BASE_URL = 'https://intervyo.onrender.com/api';

export default function LearningHub() {
  const { token } = useSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState('hub'); // 'hub', 'topic', 'module'
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    enrolledCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    totalTimeSpent: 0
  });

  // Topic Detail State
  const [topic, setTopic] = useState(null);
  const [modules, setModules] = useState([]);

  // Module Content State
  const [module, setModule] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState('');
  const [completing, setCompleting] = useState(false);
  const [startTime] = useState(Date.now());

  const domains = [
    { name: 'All Topics', value: 'all', icon: '🌐' },
    { name: 'Frontend', value: 'Frontend', icon: '⚛️' },
    { name: 'Backend', value: 'Backend', icon: '🔧' },
    { name: 'Fullstack', value: 'Fullstack', icon: '🌟' },
    { name: 'System Design', value: 'System Design', icon: '🏗️' },
    { name: 'Data Science', value: 'Data Science', icon: '📊' },
    { name: 'DevOps', value: 'DevOps', icon: '🚀' },
    { name: 'Mobile', value: 'Mobile', icon: '📱' },
    { name: 'ML', value: 'ML', icon: '🤖' }
  ];

  // ==========================================
  // FETCH FUNCTIONS
  // ==========================================
  React.useEffect(() => {
    if (currentView === 'hub') {
      fetchTopics();
      fetchStats();
    }
  }, [currentView, selectedDomain, activeTab, searchQuery]);

  React.useEffect(() => {
    if (currentView === 'topic' && selectedTopicId) {
      fetchTopicData();
    }
  }, [currentView, selectedTopicId]);

  React.useEffect(() => {
    if (currentView === 'module' && selectedModuleId) {
      fetchModuleData();
    }
  }, [currentView, selectedModuleId]);

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (selectedDomain !== 'all') params.append('domain', selectedDomain);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`${API_BASE_URL}/learning-hub/topics?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch topics');
      const data = await response.json();
      
      let filteredTopics = data.data || [];
      if (activeTab === 'enrolled') {
        filteredTopics = filteredTopics.filter(t => t.isEnrolled);
      }
      setTopics(filteredTopics);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-hub/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchTopicData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/learning-hub/topics/${selectedTopicId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch topic');
      const data = await response.json();
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

  const fetchModuleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/learning-hub/modules/${selectedModuleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch module');
      const data = await response.json();
      setModule(data.data);
    } catch (err) {
      console.error('Error fetching module:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACTION HANDLERS
  // ==========================================
  const handleEnroll = async (topicId) => {
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
        alert(`✅ ${data.message}\n🎉 You earned ${data.data.xpAwarded} XP!`);
        fetchTopics();
        fetchStats();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to enroll');
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Failed to enroll. Please try again.');
    }
  };

  const handleTopicSelect = (topicId) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic');
    window.scrollTo(0, 0);
  };

  const handleModuleSelect = (moduleId) => {
    setSelectedModuleId(moduleId);
    setCurrentView('module');
    window.scrollTo(0, 0);
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setSelectedTopicId(null);
    setSelectedModuleId(null);
    window.scrollTo(0, 0);
  };

  const handleBackToTopic = () => {
    setCurrentView('topic');
    setSelectedModuleId(null);
    window.scrollTo(0, 0);
  };

   const handleNextModule = (moduleId) => {
    setSelectedModuleId(moduleId);
    window.scrollTo(0, 0);
  };

  const handlePrevModule = (moduleId) => {
    setSelectedModuleId(moduleId);
    window.scrollTo(0, 0);
  };

  const handleComplete = async () => {
    setCompleting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 60000);

    try {
      const response = await fetch(`${API_BASE_URL}/learning-hub/modules/${selectedModuleId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ timeSpent: Math.max(timeSpent, 1) })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}\n🎉 You earned ${data.data.xpAwarded} XP!`);
        await fetchModuleData();
      }
    } catch (err) {
      console.error('Error marking complete:', err);
    } finally {
      setCompleting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Beginner') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (difficulty === 'Intermediate') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-emerald-500/20 text-emerald-400';
    if (status === 'in_progress') return 'bg-blue-500/20 text-blue-400';
    return 'bg-gray-500/20 text-gray-400';
  };


  

  // if (currentView === 'module' && module) {
  //   const content = module.content?.content || module.content || '';
  //   const isCompleted = module.isCompleted || false;

  //   return (
  //     // <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
  //     //   <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
  //     //     <div className="max-w-6xl mx-auto px-6 py-4">
  //     //       <div className="flex items-center justify-between">
  //     //         <div className="flex items-center gap-4">
  //     //           <button onClick={handleBackToTopic} className="text-gray-400 hover:text-white">
  //     //             <ArrowLeft className="w-6 h-6" />
  //     //           </button>
  //     //           <h1 className="text-xl font-bold text-white">{module.title}</h1>
  //     //         </div>
  //     //         <div className="flex items-center gap-3">
  //     //           <button
  //     //             onClick={() => setShowNotes(!showNotes)}
  //     //             className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
  //     //           >
  //     //             <MessageSquare className="w-5 h-5" />
  //     //           </button>
  //     //           {!isCompleted && (
  //     //             <button
  //     //               onClick={handleComplete}
  //     //               disabled={completing}
  //     //               className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold"
  //     //             >
  //     //               Mark Complete
  //     //             </button>
  //     //           )}
  //     //         </div>
  //     //       </div>
  //     //     </div>
  //     //   </div>

  //     //   <div className="max-w-4xl mx-auto px-6 py-8">
  //     //     <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
  //     //       <div className="prose prose-invert prose-lg max-w-none">
  //     //         <div className="text-gray-300 whitespace-pre-wrap">{content}</div>
  //     //       </div>
  //     //     </div>

  //     //     {module.nextModule && (
  //     //       <button
  //     //         onClick={() => handleModuleSelect(module.nextModule._id)}
  //     //         className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
  //     //       >
  //     //         Next: {module.nextModule.title}
  //     //         <ChevronRight className="w-5 h-5" />
  //     //       </button>
  //     //     )}
  //     //   </div>
  //     // </div>
  //     <ModuleContentPage content={content}/>
  //   );
  // }

  if (currentView === 'module' && selectedModuleId) {
    return (
      <ModuleContentPage
        moduleId={selectedModuleId}
        token={token}
        onBack={handleBackToTopic}
        onNextModule={handleNextModule}
        onPrevModule={handlePrevModule}
      />
    );
  }



  // if (currentView === 'topic' && topic) {
  //   const userProgress = topic.userProgress;

  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
  //       <div className="max-w-7xl mx-auto">
  //         <button
  //           onClick={handleBackToHub}
  //           className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
  //         >
  //           <ArrowLeft className="w-5 h-5" />
  //           Back to Learning Hub
  //         </button>

  //         {error && (
  //           <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
  //             <p className="text-yellow-300 text-sm">{error}</p>
  //           </div>
  //         )}

  //         <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 mb-6">
  //           <div className="flex items-start gap-6 mb-6">
  //             <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-5xl">
  //               {topic.icon}
  //             </div>
  //             <div className="flex-1">
  //               <h1 className="text-4xl font-bold text-white mb-3">{topic.title}</h1>
  //               <p className="text-gray-300 text-lg">{topic.description}</p>
  //             </div>
  //           </div>

  //           {isEnrolled && userProgress && (
  //             <div className="mb-6">
  //               <div className="flex justify-between mb-2">
  //                 <span className="text-sm text-gray-400">Progress</span>
  //                 <span className="text-sm font-bold text-purple-400">{userProgress.progressPercentage || 0}%</span>
  //               </div>
  //               <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
  //                 <div
  //                   className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
  //                   style={{ width: `${userProgress.progressPercentage || 0}%` }}
  //                 ></div>
  //               </div>
  //             </div>
  //           )}

  //           {!isEnrolled && (
  //             <button
  //               onClick={() => handleEnroll(topic._id)}
  //               className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg"
  //             >
  //               ✨ Enroll Now & Start Learning
  //             </button>
  //           )}
  //         </div>

  //         {modules.length > 0 && (
  //           <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
  //             <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum ({modules.length} modules)</h2>
  //             <div className="space-y-3">
  //               {modules.map((mod, index) => {
  //                 const isCompleted = userProgress?.completedModules?.some(cm => cm.moduleId === mod._id);
  //                 const isLocked = !isEnrolled;

  //                 return (
  //                   // <div
  //                   //   key={mod._id}
  //                   //   className="bg-gray-700/30 rounded-xl border border-gray-700/30 p-4"
  //                   // >
  //                   //   <div className="flex items-center justify-between">
  //                   //     <div className="flex items-center gap-4 flex-1">
  //                   //       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
  //                   //         isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400'
  //                   //       }`}>
  //                   //         {isCompleted ? <CheckCircle className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
  //                   //       </div>
  //                   //       <div className="flex-1">
  //                   //         <h3 className="text-white font-semibold">{mod.title}</h3>
  //                   //         <p className="text-sm text-gray-400">{mod.description}</p>
  //                   //       </div>
  //                   //     </div>
  //                   //     <div className="flex items-center gap-4">
  //                   //       <span className="text-sm text-gray-400">{mod.estimatedMinutes} min</span>
  //                   //       {!isLocked && (
  //                   //         <button
  //                   //           onClick={() => handleModuleSelect(mod._id)}
  //                   //           className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold"
  //                   //         >
  //                   //           {isCompleted ? 'Review' : 'Start'}
  //                   //         </button>
  //                   //       )}
  //                   //     </div>
  //                   //   </div>
  //                   // </div>
  //                   <ModuleContentPage moduleId={mod._id} />
  //                 );
  //               })}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  if (currentView === 'topic' && selectedTopicId) {
    return (
      <TopicDetailPage
        topicId={selectedTopicId}
        token={token}
        onBack={handleBackToHub}
        onModuleSelect={handleModuleSelect}
      />
    );
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Learning Hub</h1>
              <p className="text-gray-400">Expand your skills with AI-powered courses</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <Brain className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">{stats.enrolledCount}</div>
              <p className="text-sm text-gray-400">Enrolled</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
              <div className="text-2xl font-bold text-white">{stats.completedCount}</div>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">{stats.inProgressCount}</div>
              <p className="text-sm text-gray-400">In Progress</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <Clock className="w-8 h-8 text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-white">{Math.floor(stats.totalTimeSpent / 60)}h</div>
              <p className="text-sm text-gray-400">Time Invested</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3 text-white"
              />
            </div>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-xl font-semibold ${activeTab === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-800/50 text-gray-400'}`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`px-6 py-3 rounded-xl font-semibold ${activeTab === 'enrolled' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-800/50 text-gray-400'}`}
            >
              My Learning
            </button>
          </div>

          <div className="flex gap-3 mb-6 overflow-x-auto">
            {domains.map((domain) => (
              <button
                key={domain.value}
                onClick={() => setSelectedDomain(domain.value)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap ${
                  selectedDomain === domain.value
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-gray-800/30 text-gray-400'
                }`}
              >
                {domain.icon} {domain.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic._id}
              onClick={() => handleTopicSelect(topic._id)}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 cursor-pointer hover:border-gray-600/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl">
                  {topic.icon}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{topic.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{topic.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span><Clock className="w-4 h-4 inline" /> {topic.estimatedHours}h</span>
                <span>{topic.domain}</span>
              </div>
              {topic.isEnrolled ? (
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold">
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(topic._id);
                  }}
                  className="w-full bg-gray-700/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-semibold"
                >
                  Enroll Now
                </button>
              )}
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">No topics found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}