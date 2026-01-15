import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Award,
  Star,
  Calendar,
  Clock,
  BarChart3,
  BookOpen,
  Code,
  MessageSquare,
  Brain,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Flame,
  Crown,
} from "lucide-react";
import { logout } from "../services/operations/authAPI";
import { getAllInterviews } from "../services/operations/aiInterviewApi";
import { getUserProfile } from "../services/operations/profileAPI";
import { LightningLoader } from "../components/Loader/Loader";
import ContributionGraph from "../components/Dashboard/ContributionGraph";
import TextType from "../components/shared/TextType";
import { ThemeContext } from "../components/shared/ThemeContext";
import AchievementModal from "../components/Dashboard/AchievementModal";
import { achievementService } from "../services/operations/achievementsAPI";
import { getLearningProgress } from "../services/operations/learningHubAPI";
import { useNotifications } from "../components/shared/NotificationContext";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
} from "../services/operations/notificationAPI";
import logo from "../assets/intervyologo.jpg"

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const {
    notifications,
    unreadCount,
    refreshNotifications,
    setNotifications,
    setUnreadCount,
  } = useNotifications();

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
        console.error("Error checking achievements:", error);
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

        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (notification.link) {
        setShowNotifications(false);
        navigate(notification.link);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();

    try {
      await deleteNotification(notificationId, token);

      const deletedNotification = notifications.find(
        (n) => n._id === notificationId,
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClearRead = async () => {
    try {
      await clearReadNotifications(token);

      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Error clearing read notifications:", error);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationColor = (type) => {
    const colors = {
      achievement: "from-purple-500 to-pink-500",
      streak: "from-orange-500 to-red-500",
      level_up: "from-yellow-500 to-orange-500",
      resource: "from-blue-500 to-cyan-500",
      badge: "from-yellow-400 to-orange-500",
      subscription: "from-purple-600 to-pink-600",
      interview: "from-emerald-500 to-green-500",
    };
    return colors[type] || "from-gray-500 to-gray-600";
  };

  const handleAchievementModalClose = async () => {
    if (
      newAchievements.length > 0 &&
      currentAchievementIndex < newAchievements.length
    ) {
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
          getAllInterviews(setLoading, token),
        ]);

        const interviewsArray = Array.isArray(interviewsResult)
          ? interviewsResult
          : [];

        setDashboardData({
          recentInterviews: interviewsArray,
          stats: user?.stats || null,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
        console.error("Error fetching learning progress data:", error);
        setLearningProgress([]);
      }
    };

    fetchLearningProgress();
  }, [token]);

  // Update dashboard data when user stats change
  useEffect(() => {
    if (user?.stats && dashboardData.recentInterviews.length > 0) {
      setDashboardData((prev) => ({
        ...prev,
        stats: user.stats,
      }));
    }
  }, [user?.stats]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate level progress
  const levelProgress = user?.stats
    ? ((user.stats.xpPoints % 500) / 500) * 100
    : 0;
  const xpToNextLevel = user?.stats ? 500 - (user.stats.xpPoints % 500) : 500;

  // Calculate average score
  const calculateAverageScore = () => {
    if (
      !dashboardData.recentInterviews ||
      dashboardData.recentInterviews.length === 0
    ) {
      return 0;
    }

    const validScores = dashboardData.recentInterviews.filter(
      (i) => i.overallScore !== undefined && i.overallScore !== null,
    );

    if (validScores.length === 0) return 0;

    const sum = validScores.reduce(
      (acc, interview) => acc + interview.overallScore,
      0,
    );
    return Math.round((sum / validScores.length) * 10) / 10;
  };

  // Calculate trend
  const calculateTrend = () => {
    if (
      !dashboardData.recentInterviews ||
      dashboardData.recentInterviews.length < 2
    ) {
      return "+0%";
    }

    const validInterviews = dashboardData.recentInterviews.filter(
      (i) => i.overallScore !== undefined && i.overallScore !== null,
    );

    if (validInterviews.length < 2) return "+0%";

    const recent = validInterviews.slice(
      0,
      Math.min(3, validInterviews.length),
    );
    const older = validInterviews.slice(3, Math.min(6, validInterviews.length));

    if (older.length === 0) return "+0%";

    const recentAvg =
      recent.reduce((acc, i) => acc + i.overallScore, 0) / recent.length;
    const olderAvg =
      older.reduce((acc, i) => acc + i.overallScore, 0) / older.length;

    if (olderAvg === 0) return "+0%";

    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    return trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;
  };

  const stats = [
    {
      label: "Total Interviews",
      value:
        user?.stats?.totalInterviews ||
        dashboardData.recentInterviews.length ||
        0,
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      trend:
        dashboardData.recentInterviews.length > 0
          ? `+${dashboardData.recentInterviews.length}`
          : "0",
    },
    {
      label: "Average Score",
      value: calculateAverageScore() > 0 ? `${calculateAverageScore()}%` : "0%",
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500",
      trend: calculateTrend(),
    },
    {
      label: "Current Streak",
      value: `${user?.stats?.streak || 0} days`,
      icon: Flame,
      color: "from-orange-500 to-red-500",
      trend: user?.stats?.streak > 0 ? "Active" : "Start now",
    },
    {
      label: "XP Points",
      value: (user?.stats?.xpPoints || 0).toLocaleString(),
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      trend: "+340",
    },
  ];

  const quickActions = [
    {
      title: "Start Interview",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      description: "Begin practice session",
      action: () => navigate("/interview-setup"),
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      color: "from-violet-500 to-purple-500",
      description: "View your stats",
      action: () => navigate("/analytics"),
    },
    {
      title: "Review History",
      icon: BarChart3,
      color: "from-emerald-500 to-green-500",
      description: "Analyze performance",
      action: () => navigate("/history"),
    },
    {
      title: "Leaderboard",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      description: "View rankings",
      action: () => navigate("/leaderboard"),
    },
  ];

  const getScoreGradient = (score) => {
    if (score >= 90) return "from-emerald-400 to-green-500";
    if (score >= 75) return "from-blue-400 to-cyan-500";
    if (score >= 60) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-pink-500";
  };

  const getDifficultyColor = (difficulty) => {
    const lowerDiff = difficulty?.toLowerCase();
    if (lowerDiff === "easy")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (lowerDiff === "medium")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 20
            ? "bg-gray-900/95 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <img src={logo} alt="logo" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Intervyo
                </span>
                <div className="text-xs text-gray-500 font-medium hidden sm:block">
                  AI-Powered Practice
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-gray-800/50 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div
                  className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                ></div>
                <div
                  className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
                ></div>
                <div
                  className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                ></div>
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
                      <h3 className="text-white font-semibold">
                        Notifications
                      </h3>
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
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 hover:bg-gray-700/50 transition cursor-pointer border-l-4 ${
                            !notif.isRead
                              ? "border-l-purple-500 bg-gray-800/50"
                              : "border-l-transparent"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-300">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTimeAgo(notif.createdAt)}
                              </p>
                            </div>
                            <button
                              onClick={(e) =>
                                handleDeleteNotification(e, notif._id)
                              }
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
                        <p className="text-gray-400 text-sm">
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to={"/blog"}
                className="p-3 text-white hover:bg-gray-800/50 rounded-xl transition font-medium"
              >
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
                        <img
                          src={user.profilePicture}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-semibold text-white">
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {user?.subscription?.plan?.toUpperCase() || "FREE"}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${showProfileMenu ? "rotate-90" : ""}`}
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <div className="text-sm font-semibold text-white">
                        {user?.name || "User"}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {user?.email || "email@example.com"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 transition group w-full text-left"
                    >
                      <Settings className="w-4 h-4 group-hover:text-purple-400" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate("/subscription");
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
        {/* Welcome Header - More Personal & Motivational */}
        <div className="mb-8 sm:mb-10 animate-fadeIn">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white flex items-center gap-3">
                  <span
                    className={`inline-block ${isHovering ? "animate-wave" : ""}`}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    👋
                  </span>
                  <TextType
                    text={[
                      `Hey ${user?.name?.split(" ")[0] || "there"}!`,
                      "Ready to shine?",
                      "Let's ace this!",
                    ]}
                    typingSpeed={11}
                    pauseDuration={3500}
                    showCursor={true}
                    cursorCharacter="|"
                  />
                </h1>
              </div>
              <p className="text-gray-400 text-base sm:text-xl leading-relaxed">
                {user?.stats?.totalInterviews > 0
                  ? `You've completed ${user.stats.totalInterviews} interview${user.stats.totalInterviews > 1 ? "s" : ""} so far. Keep up the momentum! 🚀`
                  : "Your journey to interview mastery starts here. Let's make today count! 💪"}
              </p>
            </div>
            {user?.stats?.streak > 0 && (
              <div className="hidden lg:flex items-center gap-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl px-6 py-4">
                <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                <div>
                  <div className="text-3xl font-bold text-white">
                    {user.stats.streak}
                  </div>
                  <div className="text-sm text-orange-300">day streak!</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Level & XP Progress - Gamified & Engaging */}
        <div className="relative mb-8 sm:mb-10 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl sm:rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
          <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl"></div>

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
              {/* Level Badge */}
              <div className="flex items-center gap-6">
                <div className="relative group/badge">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 group-hover/badge:opacity-100 transition"></div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 transform group-hover/badge:scale-110 transition-all duration-300">
                    <div className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">
                      {user?.stats?.level || 1}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center border-4 border-gray-900 shadow-lg transform group-hover/badge:rotate-12 transition-all duration-300">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>

                <div>
                  <div className="text-sm sm:text-base text-gray-400 mb-2 font-medium">
                    Your Level
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                    Level {user?.stats?.level || 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-base sm:text-lg text-purple-400 font-bold">
                      {(user?.stats?.xpPoints || 0).toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar - Asymmetric placement */}
              <div className="flex-1 w-full lg:max-w-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm sm:text-base text-gray-300 font-semibold">
                    Progress to Level {(user?.stats?.level || 1) + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {Math.round(levelProgress)}%
                    </span>
                  </div>
                </div>
                <div className="relative h-4 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-600/30">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full transition-all duration-700 ease-out shadow-lg shadow-purple-500/50 overflow-hidden"
                    style={{ width: `${levelProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {xpToNextLevel} XP to go
                  </span>
                  <span className="text-xs sm:text-sm text-emerald-400 font-semibold">
                    Almost there! 🎯
                  </span>
                </div>
              </div>

              {/* Streak - Only on mobile/tablet */}
              {user?.stats?.streak > 0 && (
                <div className="flex lg:hidden items-center gap-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl px-6 py-4 w-full sm:w-auto">
                  <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {user.stats.streak}
                    </div>
                    <div className="text-sm text-orange-300">day streak!</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid - Asymmetric & Dynamic Layout */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Your Stats at a Glance
          </h2>

          {/* Asymmetric Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Featured Stat - Larger Card */}
            <div
              className="lg:col-span-7 group relative"
              style={{ animationDelay: "0ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                    <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stats[0].trend}
                  </div>
                </div>
                <div className="text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight">
                  {user?.stats?.totalInterviews ||
                    dashboardData.recentInterviews.length ||
                    0}
                </div>
                <div className="text-base sm:text-lg text-gray-300 font-semibold mb-2">
                  Total Interviews
                </div>
                <div className="text-sm text-gray-400">
                  {user?.stats?.totalInterviews > 0
                    ? `You're building great momentum! 🎯`
                    : `Start your first interview to begin tracking! 🚀`}
                </div>
              </div>
            </div>

            {/* Secondary Stats - Stacked */}
            <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
              {stats.slice(1, 3).map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group relative"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition duration-300`}
                    ></div>
                    <div className="relative bg-gray-800/70 backdrop-blur-xl rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                          {stat.trend}
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* XP Points - Wide Card */}
            <div
              className="lg:col-span-12 group relative"
              style={{ animationDelay: "300ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/50 group-hover:rotate-12 transition-all duration-300">
                      <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                        {(user?.stats?.xpPoints || 0).toLocaleString()} XP
                      </div>
                      <div className="text-sm text-purple-300 font-semibold">
                        Experience Points Earned
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                    <Sparkles className="w-4 h-4" />
                    +340 this week
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - More Intentional & Engaging */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
              What would you like to do?
            </h2>
            <div className="hidden sm:block text-sm text-gray-400">
              Choose your path →
            </div>
          </div>

          {/* Asymmetric Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Primary Action - Emphasized */}
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                onClick={quickActions[0].action}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 sm:p-8 border border-blue-400/30 hover:border-blue-400/50 transition-all text-left shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-2 hover:scale-[1.02] w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="font-black text-white mb-2 text-xl sm:text-2xl">
                    {quickActions[0].title}
                  </h3>
                  <p className="text-sm sm:text-base text-blue-100 mb-4">
                    {quickActions[0].description}
                  </p>
                  <div className="flex items-center gap-2 text-base font-bold text-white bg-white/20 px-4 py-2 rounded-xl w-fit group-hover:bg-white/30 transition">
                    <span>Let's Go!</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            {/* Secondary Actions */}
            {quickActions.slice(1).map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative overflow-hidden bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all text-left shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition duration-300`}
                  ></div>
                  <div className="relative">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-1.5 text-base sm:text-lg">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Recent Interviews - More prominent */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-5 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  Your Interview Journey
                </h2>
                <button
                  onClick={() => navigate("/history")}
                  className="text-sm text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:gap-2 transition-all group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.recentInterviews.length > 0 ? (
                  dashboardData.recentInterviews
                    .slice(0, 3)
                    .map((interview, idx) => (
                      <div
                        key={interview._id}
                        onClick={() => navigate(`/results/${interview._id}`)}
                        className="group relative bg-gradient-to-br from-gray-900/70 to-gray-800/70 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${getScoreGradient(interview.overallScore || 0)} opacity-0 group-hover:opacity-[0.07] transition-all duration-300`}
                        ></div>
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-4 flex-1">
                              {/* Score Badge */}
                              <div
                                className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${getScoreGradient(interview.overallScore || 0)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                              >
                                <span className="text-xl font-black text-white">
                                  {interview.overallScore || 0}
                                </span>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                                  <Star className="w-2.5 h-2.5 text-white" />
                                </div>
                              </div>

                              {/* Interview Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white text-base sm:text-lg mb-1.5 truncate group-hover:text-purple-300 transition">
                                  {interview.role || "Interview"}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-xs px-2.5 py-1 rounded-lg border ${getDifficultyColor(interview.difficulty)} font-semibold`}
                                  >
                                    {interview.difficulty || "Medium"}
                                  </span>
                                  <span className="text-xs text-gray-400 capitalize font-medium">
                                    {interview.status || "completed"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(
                                  interview.completedAt || interview.createdAt,
                                )}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {interview.duration || 30}min
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreGradient(interview.overallScore || 0)} rounded-full transition-all duration-700 shadow-lg relative`}
                              style={{
                                width: `${interview.overallScore || 0}%`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
                      🎯
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                      Ready to Begin?
                    </h3>
                    <p className="text-gray-400 text-base sm:text-lg mb-6 max-w-md mx-auto">
                      Take your first step towards interview mastery. Every
                      expert was once a beginner!
                    </p>
                    <button
                      onClick={() => navigate("/interview-setup")}
                      className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 text-base sm:text-lg"
                    >
                      Start Your First Interview 🚀
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <ContributionGraph interviews={dashboardData.recentInterviews} />
            </div>
          </div>

          {/* Sidebar - Enhanced with personality */}
          <div className="space-y-5 sm:space-y-6">
            {/* Learning Progress */}
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-5 sm:p-6 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Learning Path
              </h2>
              <div className="space-y-4">
                {learningProgress?.length > 0 ? (
                  learningProgress.map((topic, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl transform group-hover:scale-125 transition-transform">
                            {topic.topic?.icon || "📚"}
                          </span>
                          <span className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition">
                            {topic.topic?.title || "Untitled"}
                          </span>
                        </div>
                        <span className="text-sm font-black text-purple-400">
                          {topic.progress || 0}%
                        </span>
                      </div>
                      <div className="relative h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 rounded-full transition-all duration-700 group-hover:shadow-lg group-hover:shadow-emerald-500/50"
                          style={{ width: `${topic.progress || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5 text-xs text-gray-500">
                        <span className="font-medium">
                          {topic.totalTimeSpent || "0"} invested
                        </span>
                        {topic.progress === 100 && (
                          <span className="text-emerald-400 font-bold">
                            ✓ Complete
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">📚</div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Your learning journey starts with your first interview
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements - More celebratory */}
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-5 sm:p-6 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Hall of Fame
              </h2>
              <div className="space-y-3">
                {user?.stats?.badges && user.stats.badges.length > 0 ? (
                  user.stats.badges.slice(0, 3).map((badge, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all"></div>
                      <div className="relative flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all transform group-hover:scale-[1.02]">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:rotate-12 transition-transform">
                          {badge.icon || "🏆"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm mb-1 truncate">
                            {badge.name || "Achievement"}
                          </div>
                          <div className="text-xs text-yellow-300/80 font-medium">
                            Earned {formatDate(badge.earnedAt)}
                          </div>
                        </div>
                        <Sparkles className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">🏆</div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">
                      Your trophy case is ready!
                    </p>
                    <p className="text-xs text-gray-500">
                      Complete interviews to unlock badges
                    </p>
                  </div>
                )}
                {user?.stats?.badges && user.stats.badges.length > 0 && (
                  <button
                    onClick={() => navigate("/achievements")}
                    className="w-full py-3 text-sm text-purple-400 hover:text-purple-300 font-bold hover:bg-purple-500/10 rounded-xl transition-all flex items-center justify-center gap-2 border border-purple-500/20 hover:border-purple-500/40"
                  >
                    <span>
                      View All {user.stats.badges.length} Badge
                      {user.stats.badges.length > 1 ? "s" : ""}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Subscription Status - More engaging */}
            <div className="relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-all"></div>
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-300 animate-pulse" />
                    <h3 className="font-black text-white text-xl">
                      {user?.subscription?.plan?.toUpperCase() || "FREE"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                    <span className="text-2xl">👑</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-purple-100 mb-2 font-semibold">
                    Interviews This Month
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-black text-white">
                      {user?.subscription?.interviewsRemaining || 0}
                    </span>
                    <span className="text-purple-200 text-base font-medium">
                      of{" "}
                      {user?.subscription?.plan === "pro"
                        ? "25"
                        : user?.subscription?.plan === "enterprise"
                          ? "∞"
                          : "2"}{" "}
                      left
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-gradient-to-r from-white via-yellow-200 to-white rounded-full transition-all duration-700 relative overflow-hidden"
                      style={{
                        width: `${user?.subscription?.plan === "enterprise" ? 100 : ((user?.subscription?.interviewsRemaining || 0) / (user?.subscription?.plan === "pro" ? 25 : 2)) * 100}%`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/subscription")}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn transform hover:scale-[1.02]"
                >
                  <span>Manage Plan</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
            transform: translateY(30px);
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
            transform: translateX(200%);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-wave {
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(168, 85, 247), rgb(236, 72, 153));
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(147, 51, 234), rgb(219, 39, 119));
        }

        /* Enhanced gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Card hover effects */
        .card-hover-effect {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover-effect:hover {
          transform: translateY(-4px) scale(1.01);
        }

        /* Pulsing effect for important elements */
        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
