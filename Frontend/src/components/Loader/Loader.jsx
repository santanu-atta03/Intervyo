import React from "react";
import { Sparkles, Zap, Trophy, Target, Brain } from "lucide-react";

// ============================================
// OPTION 1: AI Brain Pulse Loader (Recommended)
// ============================================
export const AIBrainLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-24">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>

        {/* Middle rotating ring (opposite direction) */}
        <div className="absolute inset-2 border-4 border-transparent border-b-blue-500 border-l-cyan-500 rounded-full animate-spin-reverse"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2"
            style={{
              animation: `orbit 2s linear infinite`,
              animationDelay: `${i * 0.66}s`,
            }}
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-white font-semibold text-lg mb-1">
          Loading Dashboard
        </p>
        <p className="text-gray-400 text-sm">Analyzing your progress...</p>
      </div>
    </div>
  );
};

// ============================================
// OPTION 2: XP Crystal Loader
// ============================================
export const XPCrystalLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20">
        {/* Diamond shape loader */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-500 rotate-45"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 rotate-45"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rotate-45"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rotate-45"></div>
        </div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse-scale">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>

      <p className="text-white font-semibold">Loading your dashboard...</p>
    </div>
  );
};

// ============================================
// OPTION 3: Trophy Achievement Loader
// ============================================
export const TrophyLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-24">
        {/* Rotating gradient ring */}
        <div className="absolute inset-0">
          <div className="w-full h-full border-8 border-transparent border-t-yellow-400 border-r-orange-400 rounded-full animate-spin"></div>
        </div>

        {/* Inner circle with trophy */}
        <div className="absolute inset-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce-gentle">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        {/* Sparkle effects */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-sparkle"
            style={{
              top: `${25 + Math.sin((i * Math.PI) / 2) * 40}%`,
              left: `${50 + Math.cos((i * Math.PI) / 2) * 40}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-white font-semibold">Loading Dashboard</p>
        <div className="flex items-center gap-1 justify-center mt-1">
          <span className="text-xs text-gray-400">Calculating your stats</span>
          <span className="text-yellow-400 animate-pulse">...</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// OPTION 4: Target Focus Loader
// ============================================
export const TargetFocusLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-28 h-28">
        {/* Concentric circles */}
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping-slow"></div>
        <div
          className="absolute inset-3 border-4 border-purple-500/40 rounded-full animate-ping-slow"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute inset-6 border-4 border-pink-500/50 rounded-full animate-ping-slow"
          style={{ animationDelay: "0.6s" }}
        ></div>

        {/* Center target */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-scale">
            <Target className="w-8 h-8 text-white animate-spin-slow" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white font-semibold text-lg">Loading Dashboard</p>
        <div className="flex gap-1 justify-center mt-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-wave"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// OPTION 5: Lightning Speed Loader
// ============================================
export const LightningLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20">
        {/* Rotating arcs */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="60 200"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Lightning bolt */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap
            className="w-10 h-10 text-yellow-400 animate-pulse"
            fill="currentColor"
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-white font-semibold">Loading at light speed</p>
        <div className="h-1 w-32 bg-gray-700 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CSS Animations
// ============================================
const LoaderStyles = () => (
  <style jsx>{`
    @keyframes spin-reverse {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }

    @keyframes orbit {
      0% {
        transform: translate(-50%, -50%) rotate(0deg) translateX(45px)
          rotate(0deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(360deg) translateX(45px)
          rotate(-360deg);
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

    @keyframes pulse-scale {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    @keyframes bounce-gentle {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @keyframes sparkle {
      0%,
      100% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes ping-slow {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    @keyframes wave {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @keyframes progress-bar {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .animate-spin-reverse {
      animation: spin-reverse 1.5s linear infinite;
    }

    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }

    .animate-pulse-scale {
      animation: pulse-scale 2s ease-in-out infinite;
    }

    .animate-bounce-gentle {
      animation: bounce-gentle 2s ease-in-out infinite;
    }

    .animate-sparkle {
      animation: sparkle 1.5s ease-in-out infinite;
    }

    .animate-ping-slow {
      animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    .animate-wave {
      animation: wave 1s ease-in-out infinite;
    }

    .animate-progress-bar {
      animation: progress-bar 1.5s ease-in-out infinite;
    }
  `}</style>
);

// ============================================
// USAGE IN YOUR DASHBOARD COMPONENT
// ============================================
export default function DashboardLoadingDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <LoaderStyles />

      {/* Choose ONE of these: */}

      {/* <AIBrainLoader /> */}
      {/* <XPCrystalLoader /> */}
      {/* <TrophyLoader /> */}
      {/* <TargetFocusLoader /> */}
      <LightningLoader />
    </div>
  );
}

// ============================================
// HOW TO USE IN YOUR DASHBOARD
// ============================================

/*
// In Dashboard.jsx, replace the loading section:

if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <AIBrainLoader />  {/* or any other loader */ /*}
    </div>
  );
}
*/
