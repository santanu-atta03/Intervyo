import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, TrendingUp, Award, ChevronRight, Star, Play, CheckCircle, Lock, Zap, Brain, Code, Target, Sparkles } from 'lucide-react';

export default function LearningHub() {
  const [topics, setTopics] = useState([]);
  const [myLearning, setMyLearning] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'enrolled'
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    enrolledCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    totalTimeSpent: 0
  });

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

  // Mock data - Replace with actual API calls
  useEffect(() => {
    fetchData();
  }, [selectedDomain, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock topics data
      const mockTopics = [
        {
          _id: '1',
          title: 'JavaScript Fundamentals',
          description: 'Master the core concepts of JavaScript including ES6+ features',
          domain: 'Frontend',
          difficulty: 'Beginner',
          icon: '⚡',
          estimatedHours: 15,
          tags: ['javascript', 'es6', 'fundamentals'],
          isEnrolled: true,
          userProgress: {
            progressPercentage: 45,
            status: 'in_progress',
            lastAccessedAt: new Date()
          }
        },
        {
          _id: '2',
          title: 'React.js Complete Guide',
          description: 'Build modern web applications with React, Hooks, and Context API',
          domain: 'Frontend',
          difficulty: 'Intermediate',
          icon: '⚛️',
          estimatedHours: 25,
          tags: ['react', 'hooks', 'components'],
          isEnrolled: false
        },
        {
          _id: '3',
          title: 'Node.js & Express',
          description: 'Create scalable backend applications with Node.js and Express',
          domain: 'Backend',
          difficulty: 'Intermediate',
          icon: '🟢',
          estimatedHours: 20,
          tags: ['nodejs', 'express', 'backend'],
          isEnrolled: true,
          userProgress: {
            progressPercentage: 100,
            status: 'completed'
          }
        },
        {
          _id: '4',
          title: 'System Design Principles',
          description: 'Learn how to design scalable and reliable systems',
          domain: 'System Design',
          difficulty: 'Advanced',
          icon: '🏗️',
          estimatedHours: 30,
          tags: ['system-design', 'scalability', 'architecture'],
          isEnrolled: false
        },
        {
          _id: '5',
          title: 'Data Structures & Algorithms',
          description: 'Master DSA for coding interviews',
          domain: 'General',
          difficulty: 'Intermediate',
          icon: '🧮',
          estimatedHours: 40,
          tags: ['dsa', 'algorithms', 'problem-solving'],
          isEnrolled: true,
          userProgress: {
            progressPercentage: 20,
            status: 'in_progress'
          }
        },
        {
          _id: '6',
          title: 'AWS Cloud Fundamentals',
          description: 'Get started with AWS services and cloud computing',
          domain: 'DevOps',
          difficulty: 'Intermediate',
          icon: '☁️',
          estimatedHours: 22,
          tags: ['aws', 'cloud', 'devops'],
          isEnrolled: false
        }
      ];

      const filteredTopics = mockTopics.filter(topic => {
        const domainMatch = selectedDomain === 'all' || topic.domain === selectedDomain;
        const searchMatch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchQuery.toLowerCase());
        const tabMatch = activeTab === 'all' || (activeTab === 'enrolled' && topic.isEnrolled);
        return domainMatch && searchMatch && tabMatch;
      });

      setTopics(filteredTopics);
      setMyLearning(mockTopics.filter(t => t.isEnrolled));
      
      setStats({
        enrolledCount: 3,
        completedCount: 1,
        inProgressCount: 2,
        totalTimeSpent: 1250
      });
      
      setLoading(false);
    }, 800);
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

  const handleEnroll = (topicId) => {
    // API call to enroll
    console.log('Enrolling in topic:', topicId);
    // Update UI optimistically
  };

  const handleContinueLearning = (topicId) => {
    // Navigate to topic detail page
    console.log('Continue learning:', topicId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Learning Hub</h1>
              <p className="text-gray-400">Expand your skills with curated learning paths</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">{stats.enrolledCount}</span>
              </div>
              <p className="text-sm text-gray-400">Enrolled Courses</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold text-white">{stats.completedCount}</span>
              </div>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">{stats.inProgressCount}</span>
              </div>
              <p className="text-sm text-gray-400">In Progress</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-400" />
                <span className="text-2xl font-bold text-white">{Math.floor(stats.totalTimeSpent / 60)}h</span>
              </div>
              <p className="text-sm text-gray-400">Time Invested</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50'
                }`}
              >
                All Topics
              </button>
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === 'enrolled'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50'
                }`}
              >
                My Learning
              </button>
            </div>
          </div>

          {/* Domain Filter */}
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {domains.map((domain) => (
              <button
                key={domain.value}
                onClick={() => setSelectedDomain(domain.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  selectedDomain === domain.value
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-gray-800/30 text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700/30'
                }`}
              >
                <span>{domain.icon}</span>
                <span>{domain.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="group relative bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition overflow-hidden"
            >
              {/* Progress Overlay for Enrolled */}
              {topic.isEnrolled && topic.userProgress && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${topic.userProgress.progressPercentage}%` }}
                  ></div>
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                    {topic.icon}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                    {topic.isEnrolled && topic.userProgress && (
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(topic.userProgress.status)}`}>
                        {topic.userProgress.status === 'completed' ? '✓ Completed' : 
                         topic.userProgress.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {topic.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{topic.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{topic.domain}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-700/50 text-gray-400 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Progress Bar for Enrolled */}
                {topic.isEnrolled && topic.userProgress && topic.userProgress.status !== 'completed' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{topic.userProgress.progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${topic.userProgress.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {topic.isEnrolled ? (
                  <button
                    onClick={() => handleContinueLearning(topic._id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center justify-center gap-2"
                  >
                    {topic.userProgress?.status === 'completed' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Review Course</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Continue Learning</span>
                      </>
                    )}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(topic._id)}
                    className="w-full bg-gray-700/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Enroll Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {topics.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">No topics found</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'enrolled' 
                ? 'You haven\'t enrolled in any courses yet' 
                : 'Try adjusting your filters'}
            </p>
            {activeTab === 'enrolled' && (
              <button
                onClick={() => setActiveTab('all')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                Browse All Topics
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}