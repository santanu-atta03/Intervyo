import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BarChart3,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  Menu,
  Settings,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  X,
} from "lucide-react";

import { logout } from "../services/operations/authAPI";
import { getAllInterviews } from "../services/operations/aiInterviewApi";
import { getUserProfile } from "../services/operations/profileAPI";
import { LightningLoader } from "../components/Loader/Loader";
import ContributionGraph from "../components/Dashboard/ContributionGraph";
import TextType from "../components/shared/TextType";
import ThemeToggle from "../components/ThemeToggle";
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

import { ThemeContext } from "../components/shared/ThemeContext";
import logo from "../assets/intervyologo.png";

const APPLE = {
  primary: "#0066cc",
  primaryFocus: "#0071e3",
  ink: "#1d1d1f",
  canvas: "#ffffff",
  parchment: "#f5f5f7",
  tileDark: "#272729",
  tileDark2: "#2a2a2c",
  tileDark3: "#252527",
  borderHair: "rgba(0,0,0,0.08)",
  productShadow: "rgba(0, 0, 0, 0.22) 3px 5px 30px 0",
};

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function scoreBg(score) {
  if (score >= 90) return "rgba(16,185,129,0.30)";
  if (score >= 75) return "rgba(34,211,238,0.22)";
  if (score >= 60) return "rgba(250,204,21,0.22)";
  return "rgba(244,63,94,0.20)";
}

function difficultyChip(difficulty) {
  const lower = difficulty?.toLowerCase();
  if (lower === "easy") return { bg: "rgba(16,185,129,0.14)", border: "rgba(16,185,129,0.22)", color: "rgba(16,185,129,1)" };
  if (lower === "medium") return { bg: "rgba(250,204,21,0.14)", border: "rgba(250,204,21,0.22)", color: "rgba(250,204,21,1)" };
  return { bg: "rgba(244,63,94,0.14)", border: "rgba(244,63,94,0.22)", color: "rgba(244,63,94,1)" };
}

function PillButton({ variant = "primary", className = "", children, onClick, type = "button" }) {
  const styles =
    variant === "ghost"
      ? {
          background: "transparent",
          border: `1px solid ${APPLE.primary}`,
          color: APPLE.primary,
        }
      : {
          background: APPLE.primary,
          border: "1px solid transparent",
          color: "#fff",
        };

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "11px 22px",
        borderRadius: 9999,
        fontSize: 17,
        lineHeight: 1,
        fontWeight: 400,
        letterSpacing: "-0.374px",
        cursor: "pointer",
        userSelect: "none",
        ...styles,
      }}
    >
      {children}
    </button>
  );
}

export default function DashboardApple() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Keep theme logic (even though design is fixed)
  useContext(ThemeContext);

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const { notifications, unreadCount, setNotifications, setUnreadCount } = useNotifications();

  const profileMenuRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const [learningProgress, setLearningProgress] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    recentInterviews: [],
    stats: null,
  });

  const [newAchievements, setNewAchievements] = useState([]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showProfileMenu) return;

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    const checkForNewAchievements = async () => {
      if (!token) return;
      try {
        const result = await achievementService.checkAchievements(token);
        if (result?.success && result?.data?.newAchievements?.length > 0) {
          setNewAchievements(result.data.newAchievements);
          setCurrentAchievementIndex(0);
          setShowAchievementModal(true);
        }
      } catch (e) {
        console.error("Error checking achievements:", e);
      }
    };

    if (!loading && token) {
      const t = setTimeout(checkForNewAchievements, 1000);
      return () => clearTimeout(t);
    }
  }, [loading, token]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id, token);
        setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (notification.link) {
        setShowNotifications(false);
        navigate(notification.link);
      }
    } catch (e) {
      console.error("Error handling notification click:", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Error marking all as read:", e);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId, token);
      const deletedNotification = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleClearRead = async () => {
    try {
      await clearReadNotifications(token);
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (e) {
      console.error("Error clearing read notifications:", e);
    }
  };

  const handleAchievementModalClose = async () => {
    if (!(newAchievements.length > 0 && currentAchievementIndex < newAchievements.length)) {
      setShowAchievementModal(false);
      return;
    }

    const currentAchievement = newAchievements[currentAchievementIndex];

    try {
      await achievementService.markAsNotified(currentAchievement._id, token);

      if (currentAchievementIndex + 1 < newAchievements.length) {
        setCurrentAchievementIndex(currentAchievementIndex + 1);
      } else {
        setShowAchievementModal(false);
        setNewAchievements([]);
        setCurrentAchievementIndex(0);
        dispatch(getUserProfile(token));
      }
    } catch (e) {
      console.error(e);
      setShowAchievementModal(false);
    }
  };

  // dashboard data
  useEffect(() => {
    const fetchAllDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await dispatch(getUserProfile(token));
        const interviewsResult = await getAllInterviews(setLoading, token);
        const interviewsArray = Array.isArray(interviewsResult) ? interviewsResult : [];

        setDashboardData({
          recentInterviews: interviewsArray,
          stats: user?.stats || null,
        });
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
        setDashboardData({ recentInterviews: [], stats: user?.stats || null });
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // learning progress
  useEffect(() => {
    const fetchLearningProgress = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await getLearningProgress(token);
        setLearningProgress(response || []);
      } catch (e) {
        console.error("Error fetching learning progress data:", e);
        setLearningProgress([]);
      }
    };

    fetchLearningProgress();
  }, [token]);

  useEffect(() => {
    if (user?.stats) {
      setDashboardData((prev) => ({ ...prev, stats: user.stats }));
    }
  }, [user?.stats]);

  const levelProgress = user?.stats ? ((user.stats.xpPoints % 500) / 500) * 100 : 0;
  const xpToNextLevel = user?.stats ? 500 - (user.stats.xpPoints % 500) : 500;

  const calculateAverageScore = () => {
    if (!dashboardData.recentInterviews?.length) return 0;
    const validScores = dashboardData.recentInterviews.filter(
      (i) => i.overallScore !== undefined && i.overallScore !== null,
    );
    if (!validScores.length) return 0;

    const sum = validScores.reduce((acc, i) => acc + i.overallScore, 0);
    return Math.round((sum / validScores.length) * 10) / 10;
  };

  const calculateTrend = () => {
    if (!dashboardData.recentInterviews || dashboardData.recentInterviews.length < 2) return "+0%";

    const validInterviews = dashboardData.recentInterviews.filter(
      (i) => i.overallScore !== undefined && i.overallScore !== null,
    );

    if (validInterviews.length < 2) return "+0%";

    const recent = validInterviews.slice(0, Math.min(3, validInterviews.length));
    const older = validInterviews.slice(3, Math.min(6, validInterviews.length));
    if (!older.length) return "+0%";

    const recentAvg = recent.reduce((acc, i) => acc + i.overallScore, 0) / recent.length;
    const olderAvg = older.reduce((acc, i) => acc + i.overallScore, 0) / older.length;
    if (olderAvg === 0) return "+0%";

    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    return trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;
  };

  const stats = useMemo(() => {
    return [
      {
        label: "Total Interviews",
        value: user?.stats?.totalInterviews || dashboardData.recentInterviews.length || 0,
        icon: BarChart3,
        trend: dashboardData.recentInterviews.length > 0 ? `+${dashboardData.recentInterviews.length}` : "0",
      },
      {
        label: "Average Score",
        value: calculateAverageScore() > 0 ? `${calculateAverageScore()}%` : "0%",
        icon: TrendingUp,
        trend: calculateTrend(),
      },
      {
        label: "Current Streak",
        value: `${user?.stats?.streak || 0} days`,
        icon: Flame,
        trend: user?.stats?.streak > 0 ? "Active" : "Start now",
      },
      {
        label: "XP Points",
        value: (user?.stats?.xpPoints || 0).toLocaleString(),
        icon: Sparkles,
        trend: "+340",
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData.recentInterviews, user?.stats]);

  const quickActions = useMemo(() => {
    return [
      {
        title: "Start Interview",
        icon: Target,
        description: "Begin practice session",
        action: () => navigate("/interview-setup"),
      },
      {
        title: "Analytics",
        icon: TrendingUp,
        description: "View your stats",
        action: () => navigate("/analytics"),
      },
      {
        title: "Review History",
        icon: BarChart3,
        description: "Analyze performance",
        action: () => navigate("/history"),
      },
      {
        title: "Leaderboard",
        icon: Trophy,
        description: "View rankings",
        action: () => navigate("/leaderboard"),
      },
    ];
  }, [navigate]);

  const Tile = ({ variant, children }) => {
    const bg =
      variant === "light"
        ? APPLE.canvas
        : variant === "parchment"
          ? APPLE.parchment
          : variant === "dark"
            ? APPLE.tileDark
            : variant === "dark2"
              ? APPLE.tileDark2
              : APPLE.tileDark3;

    return (
      <section
        style={{
          background: bg,
          minHeight: "92vh",
          padding: "80px 0",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 18px" }}>{children}</div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: APPLE.tileDark, color: "#fff" }}>
        <LightningLoader />
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "SF Pro Text", "SF Pro Display"',
        color: APPLE.ink,
        background: APPLE.canvas,
      }}
    >
      <style>{`
        .apple-tile-title{ font-size:40px; line-height:1.10; letter-spacing:0px; font-weight:600; margin:0; }
        .apple-h1{ font-size:56px; line-height:1.07; letter-spacing:-0.28px; font-weight:600; margin:0; }
        .apple-tagline{ margin-top:12px; font-size:28px; line-height:1.14; font-weight:400; letter-spacing:0.196px; color: rgba(0,0,0,0.68); }
        .apple-body{ font-size:17px; line-height:1.47; font-weight:400; letter-spacing:-0.374px; }
        .apple-pill:active{ transform: scale(0.95); }
        .apple-sub-nav{ position:fixed; top:44px; left:0; right:0; height:52px; z-index:55; background: rgba(245,245,247,0.82); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.06); }
        .apple-sub-nav-inner{ height:100%; max-width:1200px; margin:0 auto; padding: 0 18px; display:flex; align-items:center; justify-content:space-between; gap:14px; }
        .apple-global-nav{ position:fixed; top:0; left:0; right:0; height:44px; z-index:60; background:#000; transition: background 200ms ease; }
        .apple-grid-4{ margin-top:26px; display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; }
        @media(max-width:900px){
          .apple-h1{ font-size:34px; }
          .apple-tagline{ font-size:24px; }
          .apple-grid-4{ grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
        @media(max-width:560px){
          .apple-sub-links{ display:none; }
        }
        .apple-card{ border-radius:18px; border:1px solid ${APPLE.borderHair}; }
        .apple-card-light{ background: rgba(255,255,255,0.66); border:1px solid rgba(0,0,0,0.08); }
        .apple-card-dark{ background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.10); }
        .apple-action-row{ display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
      `}</style>

      {/* Global nav */}
      <nav className="apple-global-nav" aria-label="Global navigation" style={{ opacity: isScrolled ? 1 : 1 }}>
        <div style={{ height: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={logo} alt="logo" style={{ width: 22, height: 22 }} />
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-0.12px" }}>Intervyo</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="hidden sm:flex" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ThemeToggle />
              <Link to="/blog" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "-0.12px", padding: "6px 8px", borderRadius: 10 }}>
                Blog
              </Link>
            </div>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setShowNotifications((v) => !v)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                <Bell size={18} color="rgba(255,255,255,0.92)" />
                {unreadCount > 0 ? (
                  <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: 999, background: "#ff3b30" }} />
                ) : null}
              </button>

              {showNotifications ? (
                <div
                  role="dialog"
                  aria-label="Notifications"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 44,
                    width: 320,
                    background: "rgba(0,0,0,0.85)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                    maxHeight: 380,
                    overflow: "auto",
                    padding: 0,
                    zIndex: 80,
                  }}
                >
                  <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>Notifications</div>
                    {unreadCount > 0 ? (
                      <button type="button" onClick={handleMarkAllAsRead} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(178,165,255,1)", fontWeight: 700, fontSize: 12 }}>
                        Mark all read
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClearRead}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.80)", fontWeight: 700, fontSize: 12 }}
                      >
                        Clear read
                      </button>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleNotificationClick(notif)}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, opacity: 0.92, color: "rgba(255,255,255,0.92)" }}>{notif.message}</div>
                          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>{formatTimeAgo(notif.createdAt)}</div>
                        </div>
                        <button
                          type="button"
                          aria-label="Delete notification"
                          onClick={(e) => handleDeleteNotification(e, notif._id)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ff3b30", fontSize: 18, lineHeight: 1, padding: 0 }}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 28, textAlign: "center", opacity: 0.72, color: "#fff" }}>
                      <Bell size={22} style={{ marginBottom: 8 }} />
                      <div>No notifications yet</div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div ref={profileMenuRef} style={{ position: "relative" }} className="hidden sm:block">
              <button
                type="button"
                aria-label="Profile"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu((v) => !v);
                }}
                style={{
                  width: 44,
                  height: 34,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" style={{ width: 22, height: 22, borderRadius: 10, objectFit: "cover" }} />
                ) : (
                  <span style={{ fontWeight: 900, fontSize: 12 }}>{user?.name?.charAt(0) || "U"}</span>
                )}
              </button>

              {showProfileMenu ? (
                <div style={{ position: "absolute", right: 0, top: 44, width: 240, background: "rgba(0,0,0,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 10, boxShadow: "0 24px 60px rgba(0,0,0,0.35)", zIndex: 90 }}>
                  <div style={{ padding: "10px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>{user?.name || "User"}</div>
                    <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{user?.email || "Email not available"}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/settings");
                      setShowProfileMenu(false);
                    }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 10px", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.92)", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 10, borderRadius: 12 }}
                  >
                    <Settings size={16} />
                    Profile Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/subscription");
                      setShowProfileMenu(false);
                    }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 10px", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.92)", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 10, borderRadius: 12 }}
                  >
                    <Crown size={16} />
                    Subscription
                  </button>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />

                  <button
                    type="button"
                    onClick={() => dispatch(logout(navigate))}
                    style={{ width: "100%", textAlign: "left", padding: "10px 10px", background: "transparent", border: "none", cursor: "pointer", color: "#ff4d4f", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 10, borderRadius: 12 }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>⎋</span>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="sm:hidden"
              style={{ width: 40, height: 34, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", cursor: "pointer", color: "#fff" }}
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Sub-nav */}
      <div className="apple-sub-nav" role="navigation" aria-label="Dashboard sub-navigation">
        <div className="apple-sub-nav-inner">
          <div className="apple-sub-title">Dashboard</div>

          <div className="apple-sub-links" style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link to="/history">History</Link>
            <Link to="/analytics">Analytics</Link>
          </div>

          <PillButton variant="primary" onClick={() => navigate("/interview-setup")}>
            Start
          </PillButton>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen ? (
        <div style={{ position: "fixed", top: 96, left: 0, right: 0, zIndex: 70, background: "rgba(0,0,0,0.92)", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}>
          <div style={{ maxWidth: 520, margin: "0 auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, opacity: 0.7 }}>Theme</span>
              <ThemeToggle />
            </div>

            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
              Blog
            </Link>

            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
              Profile Settings
            </Link>

            <Link to="/subscription" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
              Subscription
            </Link>

            <button
              type="button"
              onClick={() => dispatch(logout(navigate))}
              style={{ padding: "12px 14px", borderRadius: 14, background: "rgba(255,77,79,0.10)", border: "1px solid rgba(255,77,79,0.25)", color: "#ff4d4f", fontWeight: 900, cursor: "pointer", textAlign: "left" }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}

      {/* Main tiles */}
      <main style={{ paddingTop: 96 }}>
        <Tile variant="light">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 22, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 560px", minWidth: 280 }}>
              <h1 className="apple-h1">
                <TextType
                  text={[`Hey ${user?.name?.split(" ")?.[0] || "there"}!`, "Ready to shine?", "Let's ace this!"]}
                  typingSpeed={11}
                  pauseDuration={3500}
                  showCursor
                  cursorCharacter="|"
                />
              </h1>

              <div className="apple-tagline">
                {user?.stats?.totalInterviews > 0
                  ? `You've completed ${user.stats.totalInterviews} interview${user.stats.totalInterviews > 1 ? "s" : ""} so far.`
                  : "Your journey to interview mastery starts here."}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
                <PillButton variant="ghost" onClick={() => navigate("/history")}>
                  Learn more
                </PillButton>
                <PillButton onClick={() => navigate("/interview-setup")}>Buy</PillButton>
              </div>

              <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "22px 0" }} />

              <div className="apple-body" style={{ maxWidth: 520, color: "rgba(0,0,0,0.60)" }}>
                Level {user?.stats?.level || 1} • {(user?.stats?.xpPoints || 0).toLocaleString()} XP
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.48)", fontWeight: 800 }}>
                    Progress to Level {(user?.stats?.level || 1) + 1}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>{Math.round(levelProgress)}%</div>
                </div>

                <div style={{ height: 10, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden", marginTop: 12 }}>
                  <div style={{ height: "100%", width: `${levelProgress}%`, background: APPLE.primary }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: "rgba(0,0,0,0.52)" }}>
                  <span>{xpToNextLevel} XP to go</span>
                  <span>Almost there</span>
                </div>
              </div>
            </div>

            {user?.stats?.streak > 0 ? (
              <div style={{ width: 320, alignSelf: "stretch" }}>
                <div style={{ borderRadius: 18, border: "1px solid rgba(0,0,0,0.08)", background: APPLE.parchment, padding: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(0,0,0,0.55)" }}>Streak</div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
                    <Flame size={20} color={APPLE.primary} />
                    <div>
                      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.02em" }}>{user.stats.streak}</div>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 900 }}>days</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 13, color: "rgba(0,0,0,0.55)" }}>Practice consistently to keep momentum.</div>
                </div>
              </div>
            ) : null}
          </div>
        </Tile>

        <Tile variant="dark">
          <div style={{ color: "#fff" }}>
            <h2 className="apple-section-title" style={{ fontSize: 21, lineHeight: 1.19, letterSpacing: "0.231px", fontWeight: 800, margin: 0 }}>
              Your Stats at a Glance
            </h2>

            <div className="apple-grid-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="apple-card apple-card-dark" style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,102,204,0.14)" }}>
                        <Icon size={18} color="#fff" />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(255,255,255,0.80)" }}>{s.trend}</div>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em" }}>{s.value}</div>
                    <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.70)" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 21, lineHeight: 1.19, letterSpacing: "0.231px", fontWeight: 800, margin: 0 }}>
                    What would you like to do?
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13, opacity: 0.65, color: "rgba(255,255,255,0.70)" }}>Choose your path →</div>
                </div>
              </div>

              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.title}
                      type="button"
                      onClick={a.action}
                      className="apple-card apple-card-dark"
                      style={{ padding: 16, textAlign: "left", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 18, background: "rgba(0,102,204,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={18} color="#fff" />
                          </div>
                          <div style={{ fontWeight: 900, letterSpacing: "-0.12px" }}>{a.title}</div>
                        </div>
                        <ChevronRight size={18} color={APPLE.primary} />
                      </div>
                      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.70 }}>{a.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Tile>

        <Tile variant="parchment">
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ fontSize: 21, lineHeight: 1.19, letterSpacing: "0.231px", fontWeight: 800, margin: 0 }}>Your Interview Journey</h2>
                <div style={{ marginTop: 10 }} className="apple-body">
                  Recent sessions and a year view.
                </div>
              </div>

              <PillButton variant="ghost" onClick={() => navigate("/history")}>
                View All
                <span style={{ marginLeft: 8, display: "inline-flex", alignItems: "center" }}>
                  <ChevronRight size={14} color={APPLE.primary} />
                </span>
              </PillButton>
            </div>

            <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
              {dashboardData.recentInterviews.length ? (
                dashboardData.recentInterviews.slice(0, 4).map((interview) => {
                  const score = interview.overallScore || 0;
                  const chip = difficultyChip(interview.difficulty);
                  return (
                    <button
                      key={interview._id}
                      type="button"
                      onClick={() => navigate(`/results/${interview._id}`)}
                      className="apple-card"
                      style={{
                        padding: 16,
                        borderRadius: 18,
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "rgba(255,255,255,0.70)",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 18, background: scoreBg(score), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, letterSpacing: "-0.02em" }}>
                            {score}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{interview.role || "Interview"}</div>
                            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 12, fontWeight: 800, borderRadius: 999, padding: "8px 12px", background: chip.bg, border: `1px solid ${chip.border}`, color: chip.color }}>
                                {interview.difficulty || "Medium"}
                              </span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(0,0,0,0.45)" }}>{interview.status || "completed"}</span>
                            </div>
                          </div>
                        </div>
                        <Crown size={18} color={APPLE.primary} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, color: "rgba(0,0,0,0.52)", fontSize: 12 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Calendar size={14} />
                          {formatDate(interview.completedAt || interview.createdAt)}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Clock size={14} />
                          {interview.duration || 30}min
                        </span>
                      </div>

                      <div style={{ height: 8, borderRadius: 999, background: "rgba(0,0,0,0.10)", overflow: "hidden", marginTop: 12 }}>
                        <div style={{ width: `${score}%`, height: "100%", background: APPLE.primary }} />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "42px 0" }}>
                  <div style={{ fontSize: 60, marginBottom: 6 }}>🎯</div>
                  <div style={{ fontSize: 26, fontWeight: 900 }}>Ready to Begin?</div>
                  <div style={{ marginTop: 12, color: "rgba(0,0,0,0.55)", fontSize: 16, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                    Take your first step towards interview mastery.
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <PillButton onClick={() => navigate("/interview-setup")}>Start Your First Interview 🚀</PillButton>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 18 }}>
              <ContributionGraph interviews={dashboardData.recentInterviews} />
            </div>
          </div>
        </Tile>

        <Tile variant="dark2">
          <div style={{ color: "#fff", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="apple-card apple-card-dark" style={{ padding: 16 }}>
                <div style={{ fontSize: 21, lineHeight: 1.19, letterSpacing: "0.231px", fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
                  <Brain size={18} color={APPLE.primary} />
                  Learning Path
                </div>

                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {learningProgress.length ? (
                    learningProgress.map((topic, index) => (
                      <div
                        key={index}
                        style={{
                          padding: 12,
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(0,0,0,0.10)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 14, background: "rgba(0,102,204,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 16 }}>{topic.topic?.icon || "📚"}</span>
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 900, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{topic.topic?.title || "Untitled"}</div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 900, opacity: 0.9 }}>{topic.progress || 0}%</div>
                        </div>

                        <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.10)", overflow: "hidden", marginTop: 10 }}>
                          <div style={{ height: "100%", width: `${topic.progress || 0}%`, background: APPLE.primary }} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, opacity: 0.65 }}>
                          <span>{topic.totalTimeSpent || "0"} invested</span>
                          {topic.progress === 100 ? <span style={{ opacity: 1, fontWeight: 900 }}>✓ Complete</span> : <span />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "22px 0", textAlign: "center", opacity: 0.75 }}>
                      <div style={{ fontSize: 42, marginBottom: 6 }}>📚</div>
                      <div style={{ fontSize: 14 }}>Your learning journey starts with your first interview</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="apple-card apple-card-dark" style={{ padding: 16 }}>
                <div style={{ fontSize: 21, lineHeight: 1.19, letterSpacing: "0.231px", fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
                  <Trophy size={18} color="#ffd60a" />
                  Hall of Fame
                </div>

                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {user?.stats?.badges && user.stats.badges.length > 0 ? (
                    user.stats.badges.slice(0, 3).map((badge, index) => (
                      <div
                        key={index}
                        style={{
                          padding: 12,
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.10)",
                          background: "rgba(0,0,0,0.10)",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 16, background: "rgba(255,214,10,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                          {badge.icon || "🏆"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 900, fontSize: 13, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{badge.name || "Achievement"}</div>
                          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>Earned {formatDate(badge.earnedAt)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "18px 0", textAlign: "center", opacity: 0.85 }}>
                      <div style={{ fontSize: 42, marginBottom: 6 }}>🏆</div>
                      <div style={{ fontSize: 14, fontWeight: 900 }}>Your trophy case is ready!</div>
                      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>Complete interviews to unlock badges</div>
                    </div>
                  )}

                  {user?.stats?.badges && user.stats.badges.length > 0 ? (
                    <PillButton variant="ghost" onClick={() => navigate("/achievements")}
                      className="" >
                      View All {user.stats.badges.length} Badge
                      <span style={{ marginLeft: 8, display: "inline-flex", alignItems: "center" }}>
                        <ChevronRight size={14} color={APPLE.primary} />
                      </span>
                    </PillButton>
                  ) : null}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="apple-card apple-card-dark" style={{ padding: 16 }}>
                <div style={{ fontSize: 21, lineHeight: 1.19, letterSpacing: "0.231px", fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
                  <Crown size={18} color="#ffd60a" />
                  {user?.subscription?.plan?.toUpperCase() || "FREE"}
                </div>

                <div style={{ marginTop: 16, opacity: 0.7, fontSize: 13, fontWeight: 800 }}>Interviews This Month</div>

                <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-0.02em" }}>{user?.subscription?.interviewsRemaining || 0}</div>
                  <div style={{ fontSize: 14, opacity: 0.78, fontWeight: 800 }}>
                    of {user?.subscription?.plan === "pro" ? "25" : user?.subscription?.plan === "enterprise" ? "∞" : "2"} left
                  </div>
                </div>

                <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.10)", overflow: "hidden", marginTop: 14 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${
                        user?.subscription?.plan === "enterprise"
                          ? 100
                          : ((user?.subscription?.interviewsRemaining || 0) / (user?.subscription?.plan === "pro" ? 25 : 2)) * 100
                      }%`,
                      background: APPLE.primary,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/subscription")}
                  style={{
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 16,
                    padding: "11px 18px",
                    borderRadius: 9999,
                    background: APPLE.primary,
                    border: "1px solid transparent",
                    color: "#fff",
                    fontSize: 17,
                    lineHeight: 1,
                    fontWeight: 400,
                    letterSpacing: "-0.374px",
                    cursor: "pointer",
                  }}
                >
                  Manage Plan
                  <ChevronRight size={16} color="#fff" />
                </button>
              </div>
            </div>
          </div>
        </Tile>
      </main>

      {showAchievementModal && newAchievements.length > 0 ? (
        <AchievementModal achievement={newAchievements[currentAchievementIndex]} onClose={handleAchievementModalClose} />
      ) : null}
    </div>
  );
}
