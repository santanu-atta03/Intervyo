import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trophy, Target, Zap, TrendingUp, Award, Star, Calendar, Clock, BarChart3, BookOpen, Code, MessageSquare, Brain, Menu, X, Bell, Settings, LogOut, Sparkles, Flame, Crown } from 'lucide-react';
import { logout } from '../services/operations/authAPI';
import { getAllInterviews } from '../services/operations/aiInterviewApi';
import { getUserProfile } from '../services/operations/profileAPI'; // IMPORTANT: Add this import
import { AIBrainLoader, LightningLoader, TargetFocusLoader, XPCrystalLoader } from '../components/Loader/Loader';
import ContributionGraph from '../components/Dashboard/ContributionGraph'; // Add this import
import TextType from '../components/shared/TextType';


export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth)
  // console.log("user : ",user);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    recentInterviews: [],
    stats: null,
    learningProgress: []
  });

  // FIX: Refetch user profile on mount to get latest stats
  useEffect(() => {
    const refreshUserProfile = async () => {
      if (token) {
        await dispatch(getUserProfile(token));
      }
    };
    refreshUserProfile();
  }, [token, dispatch]); // This will refresh user data when component mounts

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const interviews = await getAllInterviews(setLoading, token);
      console.log("Interviews fetched:", interviews);

      const interviewsArray = Array.isArray(interviews) ? interviews : [];

      setDashboardData({
        recentInterviews: interviewsArray,
        stats: user?.stats || null,
        learningProgress: calculateLearningProgress(interviewsArray)
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        recentInterviews: [],
        stats: user?.stats || null,
        learningProgress: []
      });
      setLoading(false);
    }
  };

  if (user) {
    fetchDashboardData();
  }
}, [user, token]);

  // Calculate learning progress based on recent interviews
  const calculateLearningProgress = (interviews) => {
  if (!interviews || interviews.length === 0) {
    return [];
  }

  const skillMap = {};
  
  interviews.forEach(interview => {
    const domain = interview.role || 'General';
    if (!skillMap[domain]) {
      skillMap[domain] = {
        total: 0,
        count: 0,
        scores: []
      };
    }
    skillMap[domain].total += interview.overallScore || 0;
    skillMap[domain].count += 1;
    skillMap[domain].scores.push(interview.overallScore || 0);
  });

  return Object.entries(skillMap).map(([domain, data]) => {
    const avgScore = data.count > 0 ? Math.round(data.total / data.count) : 0;
    return {
      topic: domain,
      progress: avgScore,
      icon: getIconForDomain(domain),
      timeSpent: `${data.count * 30}min`,
      nextMilestone: `${(data.count + 1) * 30}min`
    };
  }).slice(0, 4);
};

  const getIconForDomain = (domain) => {
    const icons = {
      'Frontend': '⚛️',
      'Backend': '🔧',
      'Fullstack': '🌐',
      'System Design': '🏗️',
      'Data Science': '📊',
      'DevOps': '🚀',
      'Mobile': '📱',
      'ML': '🤖',
      'Blockchain': '⛓️'
    };
    return icons[domain] || '💻';
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate level progress
  const levelProgress = user?.stats ? ((user.stats.xpPoints % 500) / 500) * 100 : 0;
  const xpToNextLevel = user?.stats ? 500 - (user.stats.xpPoints % 500) : 500;

  // Calculate average score from recent interviews
  const calculateAverageScore = () => {
  if (!dashboardData.recentInterviews || dashboardData.recentInterviews.length === 0) {
    return 0;
  }
  
  const validScores = dashboardData.recentInterviews.filter(i => 
    i.overallScore !== undefined && i.overallScore !== null
  );
  
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((acc, interview) => acc + interview.overallScore, 0);
  return Math.round((sum / validScores.length) * 10) / 10;
};

  // Calculate trend
  const calculateTrend = () => {
  if (!dashboardData.recentInterviews || dashboardData.recentInterviews.length < 2) {
    return '+0%';
  }
  
  const validInterviews = dashboardData.recentInterviews.filter(i => 
    i.overallScore !== undefined && i.overallScore !== null
  );
  
  if (validInterviews.length < 2) return '+0%';
  
  const recent = validInterviews.slice(0, Math.min(3, validInterviews.length));
  const older = validInterviews.slice(3, Math.min(6, validInterviews.length));
  
  if (older.length === 0) return '+0%';
  
  const recentAvg = recent.reduce((acc, i) => acc + i.overallScore, 0) / recent.length;
  const olderAvg = older.reduce((acc, i) => acc + i.overallScore, 0) / older.length;
  
  if (olderAvg === 0) return '+0%';
  
  const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
  return trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;
};

  const stats = [
  { 
    label: 'Total Interviews', 
    value: user?.stats?.totalInterviews || dashboardData.recentInterviews.length || 0, 
    icon: BarChart3, 
    color: 'from-blue-500 to-cyan-500', 
    trend: dashboardData.recentInterviews.length > 0 ? `+${dashboardData.recentInterviews.length}` : '0'
  },
  { 
    label: 'Average Score', 
    value: calculateAverageScore() > 0 ? `${calculateAverageScore()}%` : '0%', 
    icon: TrendingUp, 
    color: 'from-emerald-500 to-green-500', 
    trend: calculateTrend() 
  },
  { 
    label: 'Current Streak', 
    value: `${user?.stats?.streak || 0} days`, 
    icon: Flame, 
    color: 'from-orange-500 to-red-500', 
    trend: user?.stats?.streak > 0 ? 'Active' : 'Start now' 
  },
  { 
    label: 'XP Points', 
    value: (user?.stats?.xpPoints || 0).toLocaleString(), 
    icon: Sparkles, 
    color: 'from-purple-500 to-pink-500', 
    trend: '+340' 
  }
];

  const quickActions = [
    { title: 'Start Interview', icon: Target, color: 'from-blue-500 to-cyan-500', description: 'Begin practice session', action: () => navigate('/interview-setup') },
    { title: 'Review History', icon: BarChart3, color: 'from-emerald-500 to-green-500', description: 'Analyze performance', action: () => navigate('/history') },
    { title: 'Learning Hub', icon: BookOpen, color: 'from-purple-500 to-pink-500', description: 'Study resources', action: () => navigate('/resources') },
    { title: 'Leaderboard', icon: Trophy, color: 'from-yellow-500 to-orange-500', description: 'View rankings', action: () => navigate('/leaderboard') }
  ];

  const notifications = [
    { id: 1, text: 'New achievement unlocked!', time: '2h ago', type: 'achievement' },
    { id: 2, text: `Your streak is at ${user?.stats?.streak || 0} days. Keep going!`, time: '1d ago', type: 'streak' },
    { id: 3, text: '5 new learning resources added', time: '2d ago', type: 'resource' }
  ];

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-emerald-400 to-green-500';
    if (score >= 75) return 'from-blue-400 to-cyan-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getDifficultyColor = (difficulty) => {
    const lowerDiff = difficulty?.toLowerCase();
    if (lowerDiff === 'easy') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (lowerDiff === 'medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <LightningLoader />
      
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(45px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(45px) rotate(-360deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 20 ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Intervyo
                </span>
                <div className="text-xs text-gray-500 font-medium">AI-Powered Practice</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 hover:bg-gray-800/50 rounded-xl transition group"
                >
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    {notifications.map(notif => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-gray-700/50 transition cursor-pointer">
                        <p className="text-sm text-gray-300">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* <button 
                onClick={() => navigate('/settings')}
                className="p-3 hover:bg-gray-800/50 rounded-xl transition group"
              >
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
              </button> */}
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 hover:bg-gray-800/50 px-3 py-2 rounded-xl transition group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-semibold text-white">{user?.name || 'User'}</div>
                    <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {user?.subscription?.plan?.toUpperCase() || 'FREE'}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-90' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <div className="text-sm font-semibold text-white">{user?.name || 'User'}</div>
                      <div className="text-xs text-gray-400">{user?.email || 'email@example.com'}</div>
                    </div>
                    <button 
                      onClick={() => navigate('/settings')}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 transition group w-full text-left"
                    >
                      <Settings className="w-4 h-4 group-hover:text-purple-400" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => navigate('/subscription')}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 transition group w-full text-left"
                    >
                      <Crown className="w-4 h-4 group-hover:text-yellow-400" />
                      Subscription
                    </button>
                    <hr className="my-2 border-gray-700/50" />
                    <button 
                      onClick={() => dispatch(logout(navigate))}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition group w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Welcome Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 flex items-center gap-3">
            {/* Welcome back, {user?.name?.split(' ')[0] || 'User'} */}
            

<TextType
  text={[`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`, "Let's Start interview", "Good Luck!"]}
  typingSpeed={175}
  pauseDuration={3500}
  showCursor={true}
  cursorCharacter="|"
/>
            <span className={`inline-block ${isHovering ? 'animate-wave' : ''}`} onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}>👋</span>
          </h1>
          <p className="text-gray-400 text-lg">Ready to level up your interview skills?</p>
        </div>

        {/* Level & XP Progress */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
          <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <div className="text-3xl font-bold text-white">{user?.stats?.level || 1}</div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Level</div>
                  <div className="text-3xl font-bold text-white mb-1">Level {user?.stats?.level || 1}</div>
                  <div className="text-sm text-purple-400 font-medium">{(user?.stats?.xpPoints || 0).toLocaleString()} XP</div>
                </div>
              </div>

              <div className="flex-1 max-w-md w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress to Level {(user?.stats?.level || 1) + 1}</span>
                  <span className="text-sm font-semibold text-purple-400">{Math.round(levelProgress)}%</span>
                </div>
                <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                    style={{ width: `${levelProgress}%` }}
                  >
                    {/* <div className="absolute inset-0 bg-white/20 animate-shimmer"></div> */}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {xpToNextLevel} XP needed
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                    <div className="text-3xl font-bold text-white">{user?.stats?.streak || 0}</div>
                  </div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition duration-300`}></div>
                <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                      {stat.trend}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition text-left shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition`}></div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1 text-lg">{action.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{action.description}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-400">
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Interviews */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  Recent Interviews
                </h2>
                <button 
                  onClick={() => navigate('/history')}
                  className="text-sm text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.recentInterviews.length > 0 ? (
                  dashboardData.recentInterviews.slice(0, 3).map((interview) => (
                    <div 
                      key={interview._id}
                      onClick={() => navigate(`/results/${interview._id}`)}
                      className="group relative bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition cursor-pointer overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${getScoreGradient(interview.overallScore || 0)} opacity-0 group-hover:opacity-5 transition`}></div>
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreGradient(interview.overallScore || 0)} flex items-center justify-center shadow-lg`}>
                                <span className="text-2xl font-bold text-white">{interview.overallScore || 0}</span>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                                  <Star className="w-3 h-3 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-white text-lg mb-1">{interview.role || 'Interview'}</h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm text-gray-400">{interview.status || 'completed'}</span>
                                  <span className="text-gray-600">•</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(interview.difficulty)}`}>
                                    {interview.difficulty || 'Medium'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(interview.completedAt || interview.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {interview.duration || 30}min
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreGradient(interview.overallScore || 0)} rounded-full transition-all duration-500 shadow-lg`}
                            style={{ width: `${interview.overallScore || 0}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-400 text-lg mb-4">No interviews yet</p>
                    <button 
                      onClick={() => navigate('/interview-setup')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                    >
                      Start Your First Interview
                    </button>
                  </div>
                )}
              </div>
            </div>
          {/* <ContributionGraph interviews={dashboardData.recentInterviews}/> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Learning Progress
              </h2>
              <div className="space-y-4">
                {dashboardData.learningProgress.length > 0 ? (
                  dashboardData.learningProgress.map((topic, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{topic.icon}</span>
                          <span className="text-sm font-semibold text-gray-300">{topic.topic}</span>
                        </div>
                        <span className="text-xs font-bold text-purple-400">{topic.progress}%</span>
                      </div>
                      <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"
                          style={{ width: `${topic.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                        <span>{topic.timeSpent} spent</span>
                        <span>Goal: {topic.nextMilestone}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📚</div>
                    <p className="text-sm text-gray-400">Complete interviews to track progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Recent Achievements
              </h2>
              <div className="space-y-3">
                {user?.stats?.badges && user.stats.badges.length > 0 ? (
                  user.stats.badges.slice(0, 3).map((badge, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition"></div>
                      <div className="relative flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm mb-0.5">{badge.name}</div>
                          <div className="text-xs text-gray-400">
                            {formatDate(badge.earnedAt)}
                          </div>
                        </div>
                        <Award className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-sm text-gray-400">Earn badges by completing interviews</p>
                  </div>
                )}
                {user?.stats?.badges && user.stats.badges.length > 0 && (
                  <button 
                    onClick={() => navigate('/achievements')}
                    className="w-full py-3 text-sm text-purple-400 hover:text-purple-300 font-semibold hover:bg-purple-500/10 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>View All Badges</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {/* Subscription Status */}
            <div className="relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-300" />
                    <h3 className="font-bold text-white text-xl">{user?.subscription?.plan?.toUpperCase() || 'FREE'} Plan</h3>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-purple-100 mb-2">Monthly Interviews</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{user?.subscription?.interviewsRemaining || 0}</span>
                    <span className="text-purple-200">
                      /{user?.subscription?.plan === 'pro' ? '25' : user?.subscription?.plan === 'enterprise' ? 'Unlimited' : '2'} remaining
                    </span>
                  </div>
                  <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white to-yellow-200 rounded-full transition-all"
                      style={{ 
                        width: `${user?.subscription?.plan === 'enterprise' ? 100 : ((user?.subscription?.interviewsRemaining || 0) / (user?.subscription?.plan === 'pro' ? 25 : 2)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 group"
                >
                  <span>Manage Subscription</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-wave {
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}