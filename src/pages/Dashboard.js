import React, { useState, useEffect, useContext, useRef } from "react";
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
  Sparkles,
  Flame,
  Crown,
} from "lucide-react";
import { logout } from "../services/operations/authAPI";
import { getAllInterviews } from "../services/operations/aiInterviewApi";
import { getUserProfile } from "../services/operations/profileAPI";
import ContributionGraph from "../components/Dashboard/ContributionGraph";
import ThemeToggle from "../components/ThemeToggle";
import AchievementModal from "../components/Dashboard/AchievementModal";
import NotificationDropdown from "../components/NotificationDropdown";
import { useNotifications } from "../components/shared/NotificationContext";
import logo from "../assets/intervyologo.png";

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
  } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState([]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      await dispatch(getUserProfile(token));
      const interviews = await getAllInterviews(() => {}, token);
      setLoading(false);
    };

    fetchDashboardData();
  }, [token]);

  const levelProgress = user?.stats
    ? ((user.stats.xpPoints % 500) / 500) * 100
    : 0;
  const xpToNextLevel = user?.stats ? 500 - (user.stats.xpPoints % 500) : 500;

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-[rgba(255,255,255,0.95)] text-[#1d1d1f]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#000000] text-white z-10 flex h-12 px-8 items-center">
        <div className="flex-1 flex items-center">
          <img src={logo} alt="logo" className="h-6" />
          <span className="ml-3 font-bold text-lg">Intervyo</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            refreshNotifications={refreshNotifications}
          />
          <button onClick={() => navigate("/settings")}>Settings</button>
          <button
            className="bg-[#0066cc] text-white px-4 py-2 rounded-full"
            onClick={() => dispatch(logout(navigate))}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="bg-[#f5f5f7] py-16 text-center">
          <h1 className="text-5xl tracking-tight font-bold">Welcome, {user?.name}!</h1>
          <p className="text-xl mt-4 text-[#333333] font-light">
            Your interview practice dashboard
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-16">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold">Level</h3>
            <p className="text-lg mt-2">Current Progress: {levelProgress}%</p>
            <div
              className="h-2 bg-[#e0e0e0] rounded-full mt-4 relative"
              style={{ width: `${levelProgress}%`, backgroundColor: "#0066cc" }}
            ></div>
            <p>{xpToNextLevel} XP to Next Level</p>
          </div>

          <div className="bg-[#ffffff] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold">Total Interviews</h3>
            <p className="text-6xl mt-4">{user?.stats?.totalInterviews || 0}</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-[#f5f5f7] py-16 px-8">
          <h2 className="text-3xl font-semibold mb-8">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-6">
            <button
              className="p-6 bg-[#0066cc] text-white rounded-lg shadow"
              onClick={() => navigate("/interview-setup")}
            >
              Start New Interview
            </button>
            <button
              className="p-6 bg-gradient-to-r from-[#2a2a2c] to-[#3d3d3f] text-white rounded-lg"
              onClick={() => navigate("/history")}
            >
              Interview History
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}