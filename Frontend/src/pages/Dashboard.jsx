import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/operations/authAPI';


export default function Dashboard() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.profile);

  console.log("user details : ",user);
  const [recentInterviews, setRecentInterviews] = useState([
    {
      id: 1,
      domain: 'Frontend',
      type: 'Technical',
      score: 85,
      date: '2024-03-01',
      status: 'completed',
      difficulty: 'Medium'
    },
    {
      id: 2,
      domain: 'Frontend',
      type: 'Behavioral',
      score: 92,
      date: '2024-02-28',
      status: 'completed',
      difficulty: 'Easy'
    },
    {
      id: 3,
      domain: 'Frontend',
      type: 'System Design',
      score: 78,
      date: '2024-02-25',
      status: 'completed',
      difficulty: 'Hard'
    }
  ]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Interviews', value: user?.stats?.totalInterviews, icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { label: 'Average Score', value: '85%', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { label: 'Current Streak', value: `${user?.stats?.streak} days`, icon: '🔥', color: 'from-red-500 to-pink-500' },
    { label: 'XP Points', value: user?.stats?.xpPoints, icon: '💎', color: 'from-purple-500 to-indigo-500' }
  ];

  const quickActions = [
    { 
      title: 'Start New Interview', 
      icon: '🎯', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Begin your practice session',
      action: 'start-interview'
    },
    { 
      title: 'Review Past Interviews', 
      icon: '📝', 
      color: 'from-green-500 to-emerald-500',
      description: 'Analyze your performance',
      action: 'review'
    },
    { 
      title: 'Learning Resources', 
      icon: '📚', 
      color: 'from-purple-500 to-pink-500',
      description: 'Study recommended topics',
      action: 'resources'
    },
    { 
      title: 'Leaderboard', 
      icon: '🏆', 
      color: 'from-yellow-500 to-orange-500',
      description: 'See your ranking',
      action: 'leaderboard'
    }
  ];

  const upcomingTopics = [
    { topic: 'React Hooks', progress: 75, icon: '⚛️' },
    { topic: 'System Design', progress: 45, icon: '🏗️' },
    { topic: 'Algorithms', progress: 60, icon: '🧮' },
    { topic: 'Behavioral Questions', progress: 90, icon: '💬' }
  ];

  const handleAction = (action) => {
  if (action === 'start-interview') {
    navigate('/interview-setup');
  } else {
    alert(`${action} clicked!`);
  }
};

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const levelProgress = ((user?.stats?.xpPoints % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Intervyo</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {
                      user?.profilePicture ? (<img src={user?.profilePicture} className='w-10 h-10 rounded-full flex items-center justify-center'/>) : user?.name.charAt(0)
                    }
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.subscription?.plan.toUpperCase()}</div>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Subscription</a>
                    <hr className="my-2" />
                    <a onClick={() => dispatch(logout(navigate))}  href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Ready to ace your next interview?</p>
        </div>

        {/* Level & Streak Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Current Level</div>
              <div className="text-4xl font-bold flex items-center gap-2">
                Level {user?.stats?.level}
                <span className="text-2xl">🎖️</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Daily Streak</div>
              <div className="text-4xl font-bold flex items-center gap-2">
                {user?.stats?.streak}
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <div className="text-sm mt-2 opacity-90">
            {500 - (user?.stats?.xpPoints % 500)} XP to Level {user?.stats?.level + 1}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats?.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-2xl mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.action)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition transform hover:scale-105 text-left"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-3xl mb-3`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Interviews */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Interviews</h2>
              <div className="space-y-4">
                {recentInterviews?.map((interview) => (
                  <div 
                    key={interview.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{interview.domain} - {interview.type}</h3>
                          <p className="text-sm text-gray-600">{new Date(interview.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        interview.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        interview.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {interview.difficulty}
                      </span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
                        style={{ width: `${interview.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 text-purple-600 font-semibold hover:bg-purple-50 rounded-lg transition">
                  View All Interviews →
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Learning Progress</h2>
              <div className="space-y-4">
                {upcomingTopics?.map((topic, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{topic.icon}</span>
                        <span className="text-sm font-semibold text-gray-700">{topic.topic}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{topic.progress}%</span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all"
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h2>
              <div className="space-y-3">
                {user?.stats?.badges.slice(0, 3).map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <span className="text-3xl">{badge.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{badge.name}</div>
                      <div className="text-xs text-gray-600">{new Date(badge.earnedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 text-sm text-purple-600 font-semibold hover:bg-purple-50 rounded-lg transition">
                  View All Badges →
                </button>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">PRO Plan</h3>
                <span className="text-2xl">👑</span>
              </div>
              <p className="text-sm opacity-90 mb-4">
                {user?.subscription?.interviewsRemaining} interviews remaining this month
              </p>
              <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}