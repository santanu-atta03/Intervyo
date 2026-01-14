import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompanyRecommendations } from "../services/operations/recommendationAPI";
import { getUserCalendars } from "../services/operations/calendarAPI";
import { getTrendingQuestions } from "../services/operations/questionAPI";
import { findBuddies } from "../services/operations/buddyAPI";
import {
  Target,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdvancedFeaturesDashboard() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [trendingQuestions, setTrendingQuestions] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [recsData, calsData, questionsData, buddiesData] =
        await Promise.allSettled([
          getCompanyRecommendations(token),
          getUserCalendars("active", token),
          getTrendingQuestions(5),
          findBuddies({}, token),
        ]);

      if (recsData.status === "fulfilled") {
        setRecommendations(recsData.value.data);
      }
      if (calsData.status === "fulfilled") {
        setCalendars(calsData.value.data || []);
      }
      if (questionsData.status === "fulfilled") {
        setTrendingQuestions(questionsData.value.data || []);
      }
      if (buddiesData.status === "fulfilled") {
        setBuddies(buddiesData.value.data?.buddies || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading advanced features...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Advanced Features
              </h1>
              <p className="text-white/60">AI-powered preparation tools</p>
            </div>
          </div>
        </div>

        {/* Speech Practice Lab CTA */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Speech Practice Lab</h2>
            </div>
            <p className="text-white/70">Practice interview answers with live transcript, WPM, and filler-word coaching — right in your browser.</p>
          </div>
          <button
            onClick={() => navigate('/practice-lab')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Try It Now
          </button>
        </div>

        {/* Company Recommendations */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                Recommended Companies
              </h2>
            </div>
            <button
              onClick={() => navigate("/recommendations")}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recommendations?.bestFit && recommendations.bestFit.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.bestFit.map((company, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() =>
                    navigate(`/recommendations/${company.company}`)
                  }
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">
                      {company.companyInfo?.logo || "🏢"}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {company.fitScore}%
                      </div>
                      <div className="text-xs text-white/60">Fit Score</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {company.company}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`px-3 py-1 rounded-full ${
                        company.readinessLevel === "Excellent"
                          ? "bg-green-500/20 text-green-400"
                          : company.readinessLevel === "Good"
                            ? "bg-blue-500/20 text-blue-400"
                            : company.readinessLevel === "Moderate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {company.readinessLevel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/60">
              <p>
                Complete some interviews to get personalized company
                recommendations!
              </p>
            </div>
          )}
        </div>

        {/* Interview Calendars */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                Upcoming Interviews
              </h2>
            </div>
            <button
              onClick={() => navigate("/calendar")}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              Manage <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {calendars.length > 0 ? (
            <div className="space-y-4">
              {calendars.slice(0, 3).map((cal) => {
                const daysRemaining = Math.ceil(
                  (new Date(cal.interviewDate) - new Date()) /
                    (1000 * 60 * 60 * 24),
                );
                return (
                  <div
                    key={cal._id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {cal.targetCompany}
                        </h3>
                        <p className="text-white/60">{cal.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Clock className="w-5 h-5" />
                          <span className="text-2xl font-bold">
                            {daysRemaining}
                          </span>
                        </div>
                        <div className="text-xs text-white/60">
                          days remaining
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-white/60">
              <p>
                No upcoming interviews scheduled. Add one to start preparing!
              </p>
              <button
                onClick={() => navigate("/calendar/new")}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Schedule Interview
              </button>
            </div>
          )}
        </div>

        {/* Trending Questions & Buddy Matching */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trending Questions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-bold text-white">
                  Trending Questions
                </h2>
              </div>
              <button
                onClick={() => navigate("/questions")}
                className="text-orange-400 hover:text-orange-300 flex items-center gap-2 text-sm"
              >
                Browse <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {trendingQuestions.length > 0 ? (
              <div className="space-y-3">
                {trendingQuestions.map((q, idx) => (
                  <div
                    key={q._id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{idx + 1}</div>
                      <div className="flex-1">
                        <p className="text-white text-sm line-clamp-2">
                          {q.question}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                            {q.company}
                          </span>
                          <span className="text-xs text-white/60">
                            {q.upvotes?.length || 0} upvotes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60 text-sm">
                <p>Complete interviews to find compatible study buddies!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
