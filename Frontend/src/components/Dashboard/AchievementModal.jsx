import React, { useEffect, useState } from "react";
import { Trophy, X, Sparkles, Star, Crown, Zap } from "lucide-react";

const AchievementModal = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      generateConfetti();

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const generateConfetti = () => {
    const pieces = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      });
    }
    setConfetti(pieces);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getRarityConfig = (rarity) => {
    const configs = {
      common: {
        gradient: "from-gray-500 to-gray-600",
        glow: "shadow-gray-500/50",
        border: "border-gray-400",
        bg: "from-gray-500/20 to-gray-600/20",
        text: "text-gray-300",
      },
      rare: {
        gradient: "from-blue-500 to-cyan-500",
        glow: "shadow-blue-500/50",
        border: "border-blue-400",
        bg: "from-blue-500/20 to-cyan-500/20",
        text: "text-blue-300",
      },
      epic: {
        gradient: "from-purple-500 to-pink-500",
        glow: "shadow-purple-500/50",
        border: "border-purple-400",
        bg: "from-purple-500/20 to-pink-500/20",
        text: "text-purple-300",
      },
      legendary: {
        gradient: "from-yellow-400 to-orange-500",
        glow: "shadow-yellow-500/50",
        border: "border-yellow-400",
        bg: "from-yellow-500/20 to-orange-500/20",
        text: "text-yellow-300",
      },
    };
    return configs[rarity] || configs.common;
  };

  if (!achievement) return null;

  const rarityConfig = getRarityConfig(achievement.rarity);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-confetti"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Modal Content */}
      <div
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border-2 ${rarityConfig.border} shadow-2xl ${rarityConfig.glow} max-w-md w-full transform transition-all duration-300 ${
          isVisible ? "scale-100 rotate-0" : "scale-50 rotate-12"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition group z-10"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>

        {/* Animated Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.bg} rounded-3xl opacity-50 animate-pulse`}
        ></div>

        {/* Content */}
        <div className="relative p-8">
          {/* Rarity Badge */}
          <div className="absolute top-6 left-6">
            <div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${rarityConfig.gradient} text-white text-xs font-bold uppercase flex items-center gap-1 shadow-lg`}
            >
              {achievement.rarity === "legendary" && (
                <Crown className="w-3 h-3" />
              )}
              {achievement.rarity === "epic" && <Star className="w-3 h-3" />}
              {achievement.rarity === "rare" && (
                <Sparkles className="w-3 h-3" />
              )}
              {achievement.rarity}
            </div>
          </div>

          {/* Achievement Icon */}
          <div className="flex justify-center mb-6 mt-8">
            <div className="relative">
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.gradient} rounded-full blur-2xl opacity-60 animate-pulse`}
              ></div>

              {/* Icon Container */}
              <div
                className={`relative w-32 h-32 bg-gradient-to-br ${rarityConfig.gradient} rounded-full flex items-center justify-center shadow-2xl ${rarityConfig.glow} transform hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-6xl animate-bounce">
                  {achievement.icon}
                </span>

                {/* Sparkle Effects */}
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-spin-slow" />
                <Star className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Achievement Info */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 animate-fadeIn">
              Achievement Unlocked!
            </h2>
            <h3 className={`text-2xl font-bold mb-3 ${rarityConfig.text}`}>
              {achievement.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {achievement.description}
            </p>

            {/* XP Reward */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">
                +{achievement.xpReward} XP
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300 capitalize">
                {achievement.category}
              </span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
            >
              Awesome!
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${rarityConfig.gradient} rounded-full blur-3xl opacity-30 animate-pulse`}
          ></div>
          <div
            className={`absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br ${rarityConfig.gradient} rounded-full blur-3xl opacity-30 animate-pulse`}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AchievementModal;
