import React, { useState, useEffect } from 'react';

// Mock data structure - replace with your actual API calls
const ResultsPage = ({ interviewId,result, navigate }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
  const fetchResults = async () => {
    try {
      if (!result) {
        setLoading(false);
        return;
      }

      // Set data from props
      setSession(result.session);
      setFeedback(result.feedback);
      setLoading(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
    }
  };

  fetchResults();
}, [result]);

  const generatePDF = () => {
    const printContent = document.getElementById('pdf-content');
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-600';
    if (score >= 60) return 'from-blue-400 to-cyan-600';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-600';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { text: 'Excellent', emoji: '🌟', color: 'text-green-400' };
    if (score >= 60) return { text: 'Good', emoji: '👍', color: 'text-blue-400' };
    if (score >= 40) return { text: 'Average', emoji: '📈', color: 'text-yellow-400' };
    return { text: 'Needs Improvement', emoji: '💪', color: 'text-orange-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl text-white font-bold mb-2">Analyzing Your Performance</h2>
          <p className="text-gray-400">Generating your detailed feedback report...</p>
        </div>
      </div>
    );
  }

  const overallScore = feedback?.overallScore || 0;
  const performance = getPerformanceLevel(overallScore);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Interview Results</h1>
            <p className="text-gray-400">Here's your detailed performance analysis</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
            >
              Back to Dashboard
            </button>
            <button
              onClick={generatePDF}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <span>📄</span>
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div id="pdf-content">
          {/* Overall Score Section */}
          <div className="mb-12 text-center">
            <div className="inline-block relative">
              {/* Animated Circle */}
              <svg className="w-80 h-80 transform -rotate-90">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="160"
                  cy="160"
                  r="120"
                  stroke="#1f2937"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="120"
                  stroke="url(#scoreGradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-2000 ease-out"
                  style={{ animation: 'drawCircle 2s ease-out forwards' }}
                />
              </svg>
              
              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-7xl font-bold text-white mb-2">{overallScore}</div>
                <div className="text-2xl text-gray-400 mb-2">out of 100</div>
                <div className={`text-3xl font-bold ${performance.color} flex items-center gap-2`}>
                  <span>{performance.emoji}</span>
                  <span>{performance.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">Overall Summary</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {feedback?.summary || "Great job completing the interview! You demonstrated strong communication skills and technical knowledge."}
                </p>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Technical Score */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Technical</h3>
                </div>
                <div className="text-3xl font-bold text-blue-400">
                  {feedback?.technicalScore || 0}/10
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(feedback?.technicalScore || 0) * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Communication Score */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Communication</h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {feedback?.communicationScore || 0}/10
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(feedback?.communicationScore || 0) * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Problem Solving Score */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🧩</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Problem Solving</h3>
                </div>
                <div className="text-3xl font-bold text-purple-400">
                  {feedback?.problemSolvingScore || 0}/10
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(feedback?.problemSolvingScore || 0) * 10}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Strengths and Improvements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Strengths */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Key Strengths</h2>
              </div>
              <div className="space-y-4">
                {(feedback?.strengths || [
                  "Strong technical knowledge",
                  "Clear communication skills",
                  "Good problem-solving approach"
                ]).map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-400 font-bold">✓</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Areas to Improve</h2>
              </div>
              <div className="space-y-4">
                {(feedback?.improvements || [
                  "Practice more coding challenges",
                  "Provide more detailed explanations",
                  "Review technical fundamentals"
                ]).map((improvement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-400 font-bold">→</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question by Question Breakdown */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Question Analysis</h2>
            </div>
            <div className="space-y-4">
              {(session?.questionEvaluations || []).map((evaluation, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-blue-400 font-bold">Q{index + 1}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          evaluation.category === 'technical' ? 'bg-blue-500/20 text-blue-400' :
                          evaluation.category === 'behavioral' ? 'bg-green-500/20 text-green-400' :
                          evaluation.category === 'coding' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {evaluation.category}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{evaluation.question}</p>
                      <p className="text-gray-400 text-sm italic">"{evaluation.answer?.substring(0, 100)}..."</p>
                    </div>
                    <div className="flex flex-col items-center ml-4">
                      <div className={`text-3xl font-bold ${
                        evaluation.score >= 8 ? 'text-green-400' :
                        evaluation.score >= 6 ? 'text-blue-400' :
                        evaluation.score >= 4 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {evaluation.score}
                      </div>
                      <div className="text-xs text-gray-500">/10</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 mt-3">
                    <p className="text-gray-300 text-sm">{evaluation.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Next Steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/50 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-white font-semibold mb-2">Keep Learning</h3>
                <p className="text-gray-400 text-sm">Continue building your skills with practice</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-white font-semibold mb-2">Practice More</h3>
                <p className="text-gray-400 text-sm">Take more interviews to improve</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-white font-semibold mb-2">Apply Learnings</h3>
                <p className="text-gray-400 text-sm">Use feedback in real interviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/interview-setup')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            Take Another Interview
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105"
          >
            View All Interviews
          </button>
        </div>
      </div>

      <style>{`
        @keyframes drawCircle {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear infinite;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-content, #pdf-content * {
            visibility: visible;
          }
          #pdf-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;