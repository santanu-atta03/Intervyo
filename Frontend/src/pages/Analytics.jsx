import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Award,
  ChevronLeft,
  Calendar,
  Zap,
  Brain,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getUserAnalytics,
  getSkillRadar,
} from "../services/operations/analyticsAPI";
import { ThemeContext } from "../components/shared/ThemeContext";

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function Analytics() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [skillData, setSkillData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [token, timeRange]);

  const fetchAnalytics = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [analyticsRes, skillsRes] = await Promise.all([
        getUserAnalytics(token, timeRange),
        getSkillRadar(token),
      ]);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (skillsRes.success) setSkillData(skillsRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-gray-800/50" : "bg-white";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
            >
              <ChevronLeft className={textPrimary} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${textPrimary}`}>
                Performance Analytics
              </h1>
              <p className={textSecondary}>Track your interview progress</p>
            </div>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className={`px-4 py-2 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BarChart3 />}
            label="Total Interviews"
            value={analytics?.summary?.totalInterviews || 0}
            color="purple"
            isDark={isDark}
          />
          <StatCard
            icon={<Target />}
            label="Avg Score"
            value={`${analytics?.summary?.avgScore || 0}%`}
            color="cyan"
            isDark={isDark}
          />
          <StatCard
            icon={<Award />}
            label="Best Score"
            value={`${analytics?.summary?.bestScore || 0}%`}
            color="green"
            isDark={isDark}
          />
          <StatCard
            icon={<Clock />}
            label="Total Time"
            value={`${Math.round((analytics?.summary?.totalTime || 0) / 60)}m`}
            color="amber"
            isDark={isDark}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trend */}
          <div
            className={`${cardBg} rounded-xl p-6 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics?.performanceTrend || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  stroke={isDark ? "#9ca3af" : "#6b7280"}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke={isDark ? "#9ca3af" : "#6b7280"}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Radar */}
          <div
            className={`${cardBg} rounded-xl p-6 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>
              Skill Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillData}>
                <PolarGrid stroke={isDark ? "#374151" : "#e5e7eb"} />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Scores */}
          <div
            className={`${cardBg} rounded-xl p-6 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>
              Category Scores
            </h3>
            <div className="space-y-4">
              {Object.entries(analytics?.categoryScores || {}).map(
                ([cat, score]) => (
                  <div key={cat}>
                    <div className="flex justify-between mb-1">
                      <span className={`capitalize ${textSecondary}`}>
                        {cat}
                      </span>
                      <span className={textPrimary}>{score}%</span>
                    </div>
                    <div
                      className={`h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div
            className={`${cardBg} rounded-xl p-6 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>
              Difficulty Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Easy",
                      value: analytics?.difficultyDistribution?.easy || 0,
                    },
                    {
                      name: "Medium",
                      value: analytics?.difficultyDistribution?.medium || 0,
                    },
                    {
                      name: "Hard",
                      value: analytics?.difficultyDistribution?.hard || 0,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.slice(0, 3).map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {["Easy", "Medium", "Hard"].map((d, i) => (
                <div key={d} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span className={textSecondary}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div
            className={`${cardBg} rounded-xl p-6 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics?.weeklyActivity || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#374151" : "#e5e7eb"}
                />
                <XAxis dataKey="day" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`${cardBg} rounded-xl p-6 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textPrimary}`}
            >
              <Zap className="text-green-500" size={20} /> Strengths
            </h3>
            {analytics?.strengths?.length > 0 ? (
              <ul className="space-y-2">
                {analytics.strengths.map((s, i) => (
                  <li
                    key={i}
                    className={`flex justify-between p-3 rounded-lg ${isDark ? "bg-green-500/10" : "bg-green-50"}`}
                  >
                    <span className={`capitalize ${textPrimary}`}>
                      {s.category}
                    </span>
                    <span className="text-green-500 font-semibold">
                      {s.score}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={textSecondary}>
                Complete more interviews to see strengths
              </p>
            )}
          </div>

          <div
            className={`${cardBg} rounded-xl p-6 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textPrimary}`}
            >
              <Brain className="text-amber-500" size={20} /> Areas to Improve
            </h3>
            {analytics?.weaknesses?.length > 0 ? (
              <ul className="space-y-2">
                {analytics.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className={`flex justify-between p-3 rounded-lg ${isDark ? "bg-amber-500/10" : "bg-amber-50"}`}
                  >
                    <span className={`capitalize ${textPrimary}`}>
                      {w.category}
                    </span>
                    <span className="text-amber-500 font-semibold">
                      {w.score}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={textSecondary}>No weak areas identified yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, isDark }) {
  const colors = {
    purple: "from-purple-500 to-purple-600",
    cyan: "from-cyan-500 to-cyan-600",
    green: "from-green-500 to-green-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <div
      className={`${isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} rounded-xl p-5 border`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]} text-white`}
        >
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {label}
          </p>
          <p
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
