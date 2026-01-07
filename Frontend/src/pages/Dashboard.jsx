import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Trophy, Target, Zap, TrendingUp, Award, Star, Calendar, Clock, BarChart3, BookOpen, Code, MessageSquare, Brain, Menu, X, Bell, Settings, LogOut, Sparkles, Flame, Crown } from 'lucide-react';
import { logout } from '../services/operations/authAPI';
import { getAllInterviews } from '../services/operations/aiInterviewApi';
import { getUserProfile } from '../services/operations/profileAPI';
import { LightningLoader } from '../components/Loader/Loader';
import ContributionGraph from '../components/Dashboard/ContributionGraph';
import TextType from '../components/shared/TextType';
import { ThemeContext } from '../components/shared/ThemeContext';
import AchievementModal from '../components/Dashboard/AchievementModal'
import { achievementService } from '../services/operations/achievementsAPI';
import { getLearningProgress } from '../services/operations/learningHubAPI';
import { useNotifications } from '../components/shared/NotificationContext';
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, clearReadNotifications } from '../services/operations/notificationAPI';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { notifications, unreadCount, refreshNotifications, setNotifications, setUnreadCount } = useNotifications();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [learningProgress, setLearningProgress] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    recentInterviews: [],
    stats: null,
  });

  const [newAchievements, setNewAchievements] = useState([]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for new achievements
  useEffect(() => {
    const checkForNewAchievements = async () => {
      if (!token) return;

      try {
        const result = await achievementService.checkAchievements(token);
        
        if (result.success && result.data.newAchievements.length > 0) {
          setNewAchievements(result.data.newAchievements);
          setCurrentAchievementIndex(0);
          setShowAchievementModal(true);
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
    };

    if (!loading && token) {
      setTimeout(() => {
        checkForNewAchievements();
      }, 1000);
    }
  }, [loading, token]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id, token);
        
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      if (notification.link) {
        setShowNotifications(false);
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    
    try {
      await deleteNotification(notificationId, token);
      
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearRead = async () => {
    try {
      await clearReadNotifications(token);
      
      setNotifications(prev => prev.filter(n => !n.isRead));
    } catch (error) {
      console.error('Error clearing read notifications:', error);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationColor = (type) => {
    const colors = {
      achievement: 'from-purple-500 to-pink-500',
      streak: 'from-orange-500 to-red-500',
      level_up: 'from-yellow-500 to-orange-500',
      resource: 'from-blue-500 to-cyan-500',
      badge: 'from-yellow-400 to-orange-500',
      subscription: 'from-purple-600 to-pink-600',
      interview: 'from-emerald-500 to-green-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const handleAchievementModalClose = async () => {
    if (newAchievements.length > 0 && currentAchievementIndex < newAchievements.length) {
      const currentAchievement = newAchievements[currentAchievementIndex];
      
      await achievementService.markAsNotified(currentAchievement._id, token);
      
      if (currentAchievementIndex + 1 < newAchievements.length) {
        setCurrentAchievementIndex(currentAchievementIndex + 1);
      } else {
        setShowAchievementModal(false);
        setNewAchievements([]);
        setCurrentAchievementIndex(0);
        
        dispatch(getUserProfile(token));
      }
    } else {
      setShowAchievementModal(false);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchAllDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const [profileResult, interviewsResult] = await Promise.all([
          dispatch(getUserProfile(token)),
          getAllInterviews(setLoading, token)
        ]);

        const interviewsArray = Array.isArray(interviewsResult) ? interviewsResult : [];

        setDashboardData({
          recentInterviews: interviewsArray,
          stats: user?.stats || null,
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData({
          recentInterviews: [],
          stats: user?.stats || null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, [token]);

  // Fetch learning progress
  useEffect(() => {
    const fetchLearningProgress = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getLearningProgress(token);
        setLearningProgress(response || []);
      } catch (error) {
        console.error('Error fetching learning progress data:', error);
        setLearningProgress([]);
      }
    };

    fetchLearningProgress();
  }, [token]);

  // Update dashboard data when user stats change
  useEffect(() => {
    if (user?.stats && dashboardData.recentInterviews.length > 0) {
      setDashboardData(prev => ({
        ...prev,
        stats: user.stats
      }));
    }
  }, [user?.stats]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate level progress
  const levelProgress = user?.stats ? ((user.stats.xpPoints % 500) / 500) * 100 : 0;
  const xpToNextLevel = user?.stats ? 500 - (user.stats.xpPoints % 500) : 500;

  // Calculate average score
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
    { title: 'Analytics', icon: TrendingUp, color: 'from-violet-500 to-purple-500', description: 'View your stats', action: () => navigate('/analytics') },
    { title: 'Review History', icon: BarChart3, color: 'from-emerald-500 to-green-500', description: 'Analyze performance', action: () => navigate('/history') },
    { title: 'Leaderboard', icon: Trophy, color: 'from-yellow-500 to-orange-500', description: 'View rankings', action: () => navigate('/leaderboard') }
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
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white font-bold text-lg sm:text-xl">AI</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Intervyo
                </span>
                <div className="text-xs text-gray-500 font-medium hidden sm:block">AI-Powered Practice</div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="sm:hidden p-2 rounded-lg hover:bg-gray-800/50 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 hover:bg-gray-800/50 rounded-xl transition group"
                >
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 max-h-96 overflow-y-auto z-50">
                    <div className="px-4 py-3 border-b border-gray-700/50 flex justify-between items-center">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif._id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 hover:bg-gray-700/50 transition cursor-pointer border-l-4 ${
                            !notif.isRead ? 'border-l-purple-500 bg-gray-800/50' : 'border-l-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-300">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                            </div>
                            <button 
                              onClick={(e) => handleDeleteNotification(e, notif._id)}
                              className="ml-2 text-gray-500 hover:text-red-400 transition"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Link to={'/blog'} className='p-3 text-white hover:bg-gray-800/50 rounded-xl transition font-medium'>
                Blog
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 sm:gap-3 hover:bg-gray-800/50 px-2 sm:px-3 py-2 rounded-xl transition group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-semibold text-white">{user?.name || 'User'}</div>
                    <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {user?.subscription?.plan?.toUpperCase() || 'FREE'}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${showProfileMenu ? 'rotate-90' : ''}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <div className="text-sm font-semibold text-white">{user?.name || 'User'}</div>
                      <div className="text-xs text-gray-400 truncate">{user?.email || 'email@example.com'}</div>
                    </div>
                    <button 
                      onClick={() => {
                        navigate('/settings');
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 transition group w-full text-left"
                    >
                      <Settings className="w-4 h-4 group-hover:text-purple-400" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/subscription');
                        setShowProfileMenu(false);
                      }}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-gray-900/95 backdrop-blur-xl shadow-lg border-t border-gray-700/50">
            <div className="px-4 py-3 space-y-2">
              {/* Mobile Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition w-full text-left"
                >
                  <Bell className="w-5 h-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              
              <Link 
                to="/blog" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition"
              >
                <MessageSquare className="w-5 h-5" />
                Blog
              </Link>
              
              <Link 
                to="/settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition"
              >
                <Settings className="w-5 h-5" />
                Profile Settings
              </Link>
              
              <Link 
                to="/subscription" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition"
              >
                <Crown className="w-5 h-5" />
                Subscription
              </Link>
              
              <hr className="my-2 border-gray-700/50" />
              
              <button 
                onClick={() => dispatch(logout(navigate))}
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-24 sm:pt-28 pb-8 sm:pb-16">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 animate-fadeIn">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
            <TextType
              text={[`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`, "Let's Start interview", "Good Luck!"]}
              typingSpeed={11}
              pauseDuration={3500}
              showCursor={true}
              cursorCharacter="|"
            />
            <span className={`inline-block ${isHovering ? 'animate-wave' : ''}`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>👋</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg">Ready to level up your interview skills?</p>
        </div>

        {/* Level & XP Progress */}
        <div className="relative mb-6 sm:mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
          <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{user?.stats?.level || 1}</div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">Current Level</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">Level {user?.stats?.level || 1}</div>
                  <div className="text-xs sm:text-sm text-purple-400 font-medium">{(user?.stats?.xpPoints || 0).toLocaleString()} XP</div>
                </div>
              </div>

              <div className="flex-1 max-w-md w-full mt-4 sm:mt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">Progress to Level {(user?.stats?.level || 1) + 1}</span>
                  <span className="text-xs sm:text-sm font-semibold text-purple-400">{Math.round(levelProgress)}%</span>
                </div>
                <div className="relative h-2 sm:h-3 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {xpToNextLevel} XP needed
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 animate-pulse" />
                    <div className="text-2xl sm:text-3xl font-bold text-white">{user?.stats?.streak || 0}</div>
                  </div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition duration-300`}></div>
                <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700/50 hover:border-gray-600/50 transition shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-2 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-emerald-400/20">
                      {stat.trend}
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-1 sm:gap-2">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700/50 hover:border-gray-600/50 transition text-left shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition`}></div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${action.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-0.5 sm:mb-1 text-sm sm:text-base md:text-lg">{action.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">{action.description}</p>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-purple-400">
                    <span>Get Started</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Interviews */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-1 sm:gap-2">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  Recent Interviews
                </h2>
                <button 
                  onClick={() => navigate('/history')}
                  className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {dashboardData.recentInterviews.length > 0 ? (
                  dashboardData.recentInterviews.slice(0, 3).map((interview) => (
                    <div 
                      key={interview._id}
                      onClick={() => navigate(`/results/${interview._id}`)}
                      className="group relative bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-gray-700/50 hover:border-gray-600/50 transition cursor-pointer overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${getScoreGradient(interview.overallScore || 0)} opacity-0 group-hover:opacity-5 transition`}></div>
                      <div className="relative">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${getScoreGradient(interview.overallScore || 0)} flex items-center justify-center shadow-lg`}>
                                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">{interview.overallScore || 0}</span>
                                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                                  <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-white text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 truncate">{interview.role || 'Interview'}</h3>
                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                  <span className="text-xs sm:text-sm text-gray-400 capitalize">{interview.status || 'completed'}</span>
                                  <span className="text-gray-600 text-xs">•</span>
                                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full border ${getDifficultyColor(interview.difficulty)}`}>
                                    {interview.difficulty || 'Medium'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {formatDate(interview.completedAt || interview.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {interview.duration || 30}min
                            </span>
                          </div>
                        </div>
                        <div className="relative h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
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
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📋</div>
                    <p className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">No interviews yet</p>
                    <button 
                      onClick={() => navigate('/interview-setup')}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition text-sm sm:text-base"
                    >
                      Start Your First Interview
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-6">
              <ContributionGraph interviews={dashboardData.recentInterviews}/>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Learning Progress */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 sm:p-6 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Learning Progress
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {learningProgress?.length > 0 ? (
                  learningProgress.map((topic, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl">{topic.topic?.icon || '📚'}</span>
                          <span className="text-xs sm:text-sm font-semibold text-gray-300 truncate">{topic.topic?.title || 'Untitled'}</span>
                        </div>
                        <span className="text-xs font-bold text-purple-400">{topic.progress || 0}%</span>
                      </div>
                      <div className="relative h-1.5 sm:h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"
                          style={{ width: `${topic.progress || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                        <span>{topic.totalTimeSpent || '0'} spent</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 sm:py-8">
                    <div className="text-3xl sm:text-4xl mb-2">📚</div>
                    <p className="text-xs sm:text-sm text-gray-400">Complete interviews to track progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 sm:p-6 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                Recent Achievements
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {user?.stats?.badges && user.stats.badges.length > 0 ? (
                  user.stats.badges.slice(0, 3).map((badge, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition"></div>
                      <div className="relative flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg sm:rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                          {badge.icon || '🏆'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-xs sm:text-sm mb-0.5 truncate">{badge.name || 'Achievement'}</div>
                          <div className="text-xs text-gray-400">
                            {formatDate(badge.earnedAt)}
                          </div>
                        </div>
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 sm:py-8">
                    <div className="text-3xl sm:text-4xl mb-2">🏆</div>
                    <p className="text-xs sm:text-sm text-gray-400">Earn badges by completing interviews</p>
                  </div>
                )}
                {user?.stats?.badges && user.stats.badges.length > 0 && (
                  <button 
                    onClick={() => navigate('/achievements')}
                    className="w-full py-2 sm:py-3 text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-semibold hover:bg-purple-500/10 rounded-lg sm:rounded-xl transition flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <span>View All Badges</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Subscription Status */}
            <div className="relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                    <h3 className="font-bold text-white text-base sm:text-xl">{user?.subscription?.plan?.toUpperCase() || 'FREE'} Plan</h3>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">👑</span>
                  </div>
                </div>
                <div className="mb-3 sm:mb-4">
                  <div className="text-xs sm:text-sm text-purple-100 mb-1.5 sm:mb-2">Monthly Interviews</div>
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{user?.subscription?.interviewsRemaining || 0}</span>
                    <span className="text-purple-200 text-xs sm:text-sm">
                      /{user?.subscription?.plan === 'pro' ? '25' : user?.subscription?.plan === 'enterprise' ? 'Unlimited' : '2'} remaining
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
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
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition flex items-center justify-center gap-1 sm:gap-2 group text-sm sm:text-base"
                >
                  <span>Manage Subscription</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition" />
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

      {/* Achievement Modal */}
      {showAchievementModal && newAchievements.length > 0 && (
        <AchievementModal
          achievement={newAchievements[currentAchievementIndex]}
          onClose={handleAchievementModalClose}
        />
      )}
    </div>
  );
}