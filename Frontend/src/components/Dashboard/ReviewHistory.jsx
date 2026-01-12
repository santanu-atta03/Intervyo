// ============================================
// REVIEW HISTORY PAGE
// File: src/pages/ReviewHistory.jsx
// ============================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  Download,
  Eye,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getAllInterviews } from "../../services/operations/aiInterviewApi";

export default function ReviewHistory() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [interviews, searchTerm, selectedFilter, selectedDifficulty, sortBy]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await getAllInterviews(setLoading, token);
      setInterviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...interviews];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((interview) =>
        interview.role?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (interview) => interview.status === selectedFilter,
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (interview) =>
          interview.difficulty?.toLowerCase() ===
          selectedDifficulty.toLowerCase(),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.completedAt || b.createdAt) -
            new Date(a.completedAt || a.createdAt)
          );
        case "oldest":
          return (
            new Date(a.completedAt || a.createdAt) -
            new Date(b.completedAt || b.createdAt)
          );
        case "score-high":
          return (b.overallScore || 0) - (a.overallScore || 0);
        case "score-low":
          return (a.overallScore || 0) - (b.overallScore || 0);
        default:
          return 0;
      }
    });

    setFilteredInterviews(filtered);
  };

  const calculateStats = () => {
    const completed = interviews.filter((i) => i.status === "completed");
    const totalScore = completed.reduce(
      (sum, i) => sum + (i.overallScore || 0),
      0,
    );
    const avgScore = completed.length > 0 ? totalScore / completed.length : 0;

    const lastMonth = completed.filter((i) => {
      const date = new Date(i.completedAt || i.createdAt);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    });

    return {
      total: interviews.length,
      completed: completed.length,
      avgScore: Math.round(avgScore * 10) / 10,
      thisMonth: lastMonth.length,
      highestScore: Math.max(...completed.map((i) => i.overallScore || 0), 0),
    };
  };

  const stats = calculateStats();

  const getScoreColor = (score) => {
    if (score >= 90) return "from-emerald-400 to-green-500";
    if (score >= 75) return "from-blue-400 to-cyan-500";
    if (score >= 60) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-pink-500";
  };

  const getDifficultyColor = (difficulty) => {
    const diff = difficulty?.toLowerCase();
    if (diff === "easy")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (diff === "medium")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            Loading your interview history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                Interview History
              </h1>
              <p className="text-gray-400">
                Review and analyze your past interviews
              </p>
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Interviews",
              value: stats.total,
              icon: BarChart3,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: Target,
              color: "from-emerald-500 to-green-500",
            },
            {
              label: "Average Score",
              value: `${stats.avgScore}%`,
              icon: Star,
              color: "from-yellow-500 to-orange-500",
            },
            {
              label: "This Month",
              value: stats.thisMonth,
              icon: Calendar,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Highest Score",
              value: `${stats.highestScore}%`,
              icon: Award,
              color: "from-pink-500 to-red-500",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition`}
                ></div>
                <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition">
                  <Icon
                    className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg p-1.5 text-white mb-2`}
                  />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by role or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option value="all">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="score-high">Highest Score</option>
                <option value="score-low">Lowest Score</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm ||
            selectedFilter !== "all" ||
            selectedDifficulty !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedFilter !== "all" && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  Status: {selectedFilter}
                </span>
              )}
              {selectedDifficulty !== "all" && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                  Difficulty: {selectedDifficulty}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                  setSelectedDifficulty("all");
                }}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm transition"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Interview List */}
        <div className="space-y-4">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview) => (
              <div
                key={interview._id}
                className="group relative bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getScoreColor(interview.overallScore || 0)} opacity-0 group-hover:opacity-5 transition`}
                ></div>

                <div className="relative p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Side - Interview Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Score Badge */}
                      <div
                        className={`relative w-20 h-20 rounded-xl bg-gradient-to-br ${getScoreColor(interview.overallScore || 0)} flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <span className="text-3xl font-bold text-white">
                          {interview.overallScore || 0}
                        </span>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      {/* Interview Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {interview.role || "Interview"}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(interview.difficulty)}`}
                          >
                            {interview.difficulty || "Medium"}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(
                              interview.completedAt || interview.createdAt,
                            )}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {interview.duration || 30} min
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreColor(interview.overallScore || 0)} rounded-full transition-all`}
                            style={{ width: `${interview.overallScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/results/${interview._id}`)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2 group"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No interviews found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ||
                selectedFilter !== "all" ||
                selectedDifficulty !== "all"
                  ? "Try adjusting your filters"
                  : "Start your first interview to see it here"}
              </p>
              <button
                onClick={() => navigate("/interview-setup")}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition inline-flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Start New Interview
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredInterviews.length > 0 && (
          <div className="mt-6 text-center text-gray-400 text-sm">
            Showing {filteredInterviews.length} of {interviews.length}{" "}
            interviews
          </div>
        )}
      </div>
    </div>
  );
}
