import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  Flame,
  Star,
  Award,
  ChevronLeft,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Leaderboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [period, setPeriod] = useState("all-time");
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/leaderboard?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setLeaderboard(data.leaderboard || []);
      setUserRank(data.userRank || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };

  const getRankBgColor = (rank) => {
    if (rank === 1)
      return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    if (rank === 2) return "from-gray-400/20 to-gray-500/20 border-gray-400/30";
    if (rank === 3)
      return "from-orange-400/20 to-orange-500/20 border-orange-400/30";
    return "from-gray-800/30 to-gray-900/30 border-gray-700/30";
  };

  const periods = [
    { value: "all-time", label: "All Time" },
    { value: "monthly", label: "This Month" },
    { value: "weekly", label: "This Week" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">
            Loading leaderboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-[25vh]">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10 text-yellow-400" />
                Leaderboard
              </h1>
              <p className="text-gray-400">
                Compete with others and climb the ranks
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-6 py-3 rounded-xl font-semibold transition ${period === p.value
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* User's Rank Card (if not in top 10) */}
        {userRank && userRank.rank > 10 && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-blue-400">
                    #{userRank.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        className="w-full h-full object-cover"
                        alt="You"
                      />
                    ) : (
                      user?.name?.charAt(0) || "Y"
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold">Your Rank</div>
                    <div className="text-sm text-gray-400">
                      {userRank.xpPoints.toLocaleString()} XP
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    Level {userRank.level}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userRank.badges} badges
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {leaderboard.slice(0, 3).map((entry, index) => {
            const heights = ["h-64", "h-72", "h-60"];
            const orders = [1, 0, 2]; // 2nd, 1st, 3rd
            const displayIndex = orders.indexOf(index);

            return (
              <div
                key={entry.userId}
                className={`relative ${heights[index]} flex flex-col items-center justify-end p-6`}
                style={{ order: orders[index] }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 to-transparent rounded-2xl border border-gray-700/50 backdrop-blur-sm"></div>

                <div className="relative z-10 flex flex-col items-center">
                  {/* Crown for 1st place */}
                  {index === 0 && (
                    <Crown className="w-12 h-12 text-yellow-400 absolute -top-16 animate-bounce" />
                  )}

                  {/* Avatar */}
                  <div
                    className={`relative mb-4 ${index === 0 ? "w-24 h-24" : "w-20 h-20"}`}
                  >
                    <div
                      className={`w-full h-full bg-gradient-to-br ${index === 0
                          ? "from-yellow-400 to-orange-500"
                          : index === 1
                            ? "from-gray-300 to-gray-400"
                            : "from-orange-400 to-orange-600"
                        } rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden border-4 border-gray-900 shadow-xl`}
                    >
                      {entry.profilePicture ? (
                        <img
                          src={entry.profilePicture}
                          className="w-full h-full object-cover"
                          alt={entry.name}
                        />
                      ) : (
                        entry.name.charAt(0)
                      )}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-700">
                      {getRankIcon(entry.rank)}
                    </div>
                  </div>

                  {/* Name & Stats */}
                  <div className="text-center">
                    <div
                      className={`font-bold text-white mb-1 ${index === 0 ? "text-xl" : "text-lg"}`}
                    >
                      {entry.name}
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {entry.xpPoints.toLocaleString()} XP
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <span className="text-gray-400">Lvl {entry.level}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-orange-400 flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {entry.streak}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-3">
          {leaderboard.slice(3).map((entry, index) => (
            <div
              key={entry.userId}
              className={`relative group bg-gradient-to-br ${getRankBgColor(entry.rank)} backdrop-blur-xl rounded-xl p-4 border transition hover:shadow-lg hover:shadow-purple-500/10`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                    {entry.profilePicture ? (
                      <img
                        src={entry.profilePicture}
                        className="w-full h-full object-cover"
                        alt={entry.name}
                      />
                    ) : (
                      entry.name.charAt(0)
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-white text-lg">
                      {entry.name}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">Level {entry.level}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">
                        {entry.totalInterviews} interviews
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {entry.xpPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">XP Points</div>
                  </div>

                  <div className="flex items-center gap-4">
                    {entry.streak > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 rounded-full border border-orange-500/30">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-semibold text-orange-400">
                          {entry.streak}
                        </span>
                      </div>
                    )}

                    {entry.badges > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-400">
                          {entry.badges}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No data yet
            </h3>
            <p className="text-gray-400">
              Complete interviews to appear on the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
