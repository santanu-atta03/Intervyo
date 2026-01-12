import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Award, Star, Crown, Sparkles, Lock, 
  TrendingUp, Flame, Target, Brain, ChevronLeft,
  Filter, Search, CheckCircle
} from 'lucide-react';
import { LightningLoader } from '../Loader/Loader';
import AchievementModal from '../Dashboard/AchievementModal';

export default function Achievements() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [groupedAchievements, setGroupedAchievements] = useState({});
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    fetchAchievements();
    fetchStats();
  }, [token]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.REACT_APP_BASE_URL}/achievements/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAchievements(data.data.all);
        setGroupedAchievements(data.data.grouped);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BASE_URL}/achievements/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching achievement stats:', error);
    }
  };

  const getRarityConfig = (rarity) => {
    const configs = {
      common: {
        gradient: 'from-gray-500 to-gray-600',
        glow: 'shadow-gray-500/30',
        border: 'border-gray-500/30',
        bg: 'from-gray-500/10 to-gray-600/10',
        text: 'text-gray-400',
        icon: Star
      },
      rare: {
        gradient: 'from-blue-500 to-cyan-500',
        glow: 'shadow-blue-500/30',
        border: 'border-blue-500/30',
        bg: 'from-blue-500/10 to-cyan-500/10',
        text: 'text-blue-400',
        icon: Sparkles
      },
      epic: {
        gradient: 'from-purple-500 to-pink-500',
        glow: 'shadow-purple-500/30',
        border: 'border-purple-500/30',
        bg: 'from-purple-500/10 to-pink-500/10',
        text: 'text-purple-400',
        icon: Award
      },
      legendary: {
        gradient: 'from-yellow-400 to-orange-500',
        glow: 'shadow-yellow-500/30',
        border: 'border-yellow-500/30',
        bg: 'from-yellow-500/10 to-orange-500/10',
        text: 'text-yellow-400',
        icon: Crown
      }
    };
    return configs[rarity] || configs.common;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      milestone: Target,
      streak: Flame,
      performance: TrendingUp,
      mastery: Brain,
      special: Sparkles
    };
    return icons[category] || Trophy;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRarity && matchesSearch;
  });

  const categories = ['all', 'milestone', 'streak', 'performance', 'mastery', 'special'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-800/50 rounded-xl transition group"
              >
                <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Achievements</h1>
                  <p className="text-sm text-gray-400">Track your progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-8 h-8 text-blue-400" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {stats.earnedCount}/{stats.totalAchievements}
                    </div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-purple-400" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.completionPercentage}%</div>
                    <div className="text-sm text-gray-400">Complete</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.rarityCount.legendary}</div>
                    <div className="text-sm text-gray-400">Legendary</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 text-emerald-400" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stats.rarityCount.epic}</div>
                    <div className="text-sm text-gray-400">Epic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search achievements..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category === 'all' ? Filter : getCategoryIcon(category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{category}</span>
                  </button>
                );
              })}
            </div>

            {/* Rarity Filter */}
            <div className="flex gap-2 flex-wrap">
              {rarities.map((rarity) => {
                const config = rarity !== 'all' ? getRarityConfig(rarity) : null;
                return (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity)}
                    className={`px-4 py-2 rounded-xl font-semibold transition capitalize ${
                      selectedRarity === rarity
                        ? config
                          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.glow}`
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-700/50'
                    }`}
                  >
                    {rarity}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const rarityConfig = getRarityConfig(achievement.rarity);
            const CategoryIcon = getCategoryIcon(achievement.category);
            const RarityIcon = rarityConfig.icon;

            return (
              <div
                key={achievement._id}
                onClick={() => achievement.earned && setSelectedAchievement(achievement)}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  achievement.earned
                    ? `cursor-pointer hover:scale-105 bg-gray-800/50 border-2 ${rarityConfig.border} ${rarityConfig.glow}`
                    : 'bg-gray-800/30 border border-gray-700/30'
                }`}
              >
                {/* Animated Background */}
                {achievement.earned && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.bg} opacity-50`}></div>
                )}

                {/* Lock Overlay for Locked Achievements */}
                {!achievement.earned && (
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <Lock className="w-12 h-12 text-gray-600" />
                  </div>
                )}

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${rarityConfig.gradient} flex items-center justify-center shadow-lg ${rarityConfig.glow} ${achievement.earned ? 'group-hover:scale-110' : 'grayscale opacity-50'} transition-transform`}>
                      <span className="text-3xl">{achievement.icon}</span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {achievement.earned && (
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${achievement.earned ? rarityConfig.text : 'text-gray-600'}`}>
                        {achievement.rarity}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className={`font-bold text-lg mb-2 ${achievement.earned ? 'text-white' : 'text-gray-600'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm mb-4 ${achievement.earned ? 'text-gray-400' : 'text-gray-700'}`}>
                    {achievement.earned ? achievement.description : '???'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={`w-4 h-4 ${achievement.earned ? 'text-gray-400' : 'text-gray-700'}`} />
                      <span className={`text-xs capitalize ${achievement.earned ? 'text-gray-400' : 'text-gray-700'}`}>
                        {achievement.category}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${achievement.earned ? 'bg-purple-500/20' : 'bg-gray-700/30'}`}>
                      <Sparkles className={`w-4 h-4 ${achievement.earned ? 'text-yellow-400' : 'text-gray-700'}`} />
                      <span className={`text-xs font-bold ${achievement.earned ? 'text-white' : 'text-gray-700'}`}>
                        +{achievement.xpReward}
                      </span>
                    </div>
                  </div>

                  {achievement.earned && achievement.earnedAt && (
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Glow Effect on Hover */}
                {achievement.earned && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`}></div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">No achievements found</p>
          </div>
        )}
      </div>

      {/* Achievement Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
}