// frontend/src/components/InterviewPermissionCheck.jsx
import { useState, useEffect } from "react";
import { Camera, Mic, AlertCircle } from "lucide-react";

export default function InterviewPermissionCheck({ onPermissionsGranted }) {
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    speechRecognition: false,
  });

  const [loading, setLoading] = useState(true);
  const [startingInterview, setStartingInterview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    setLoading(true);
    setError("");

    // Speech recognition support
    const speechSupport =
      "webkitSpeechRecognition" in window ||
      "SpeechRecognition" in window;

    if (!speechSupport) {
      setError("Speech recognition not supported. Please use Chrome browser.");
      setLoading(false);
      return;
    }

    // Media device support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera/Microphone not supported on this device.");
      setLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Stop tracks immediately after permission check
      stream.getTracks().forEach((track) => track.stop());

      setPermissions({
        camera: true,
        microphone: true,
        speechRecognition: true,
      });
    } catch (err) {
      console.error("Media permission error:", err);
      setError(
        err.name === "NotAllowedError"
          ? "Camera/Microphone access denied. Please allow permissions and try again."
          : "Failed to access media devices. Please check your browser settings."
      );
    }

    setLoading(false);
  };

  const handleStartInterview = async () => {
    if (
      !permissions.camera ||
      !permissions.microphone ||
      !permissions.speechRecognition
    ) {
      return;
    }

    try {
      setStartingInterview(true);
      setError("");

      // 🔥 Place backend interview start call here if needed
      // await fetch("/api/interview/start");

      onPermissionsGranted();
    } catch (err) {
      console.error("Interview start failed:", err);
      setError("Failed to start interview. Please try again.");
    } finally {
      setStartingInterview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
            <span className="text-5xl">🎥</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Permission Check
          </h2>
          <p className="text-white/60">
            We need access to your camera and microphone for the interview
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Checking permissions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-400" size={32} />
              <h3 className="text-xl font-bold text-red-400">
                Permission Error
              </h3>
            </div>
            <p className="text-white/90 mb-6">{error}</p>
            <button
              onClick={checkPermissions}
              className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <PermissionItem
                icon={<Camera size={24} />}
                label="Camera Access"
                granted={permissions.camera}
              />
              <PermissionItem
                icon={<Mic size={24} />}
                label="Microphone Access"
                granted={permissions.microphone}
              />
              <PermissionItem
                icon={<span className="text-2xl">🎤</span>}
                label="Speech Recognition"
                granted={permissions.speechRecognition}
              />
            </div>

            <button
              onClick={handleStartInterview}
              disabled={
                startingInterview ||
                !permissions.camera ||
                !permissions.microphone ||
                !permissions.speechRecognition
              }
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              {startingInterview ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting Interview...
                </>
              ) : (
                "Start Interview"
              )}
            </button>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="text-sm text-blue-200">
                  <strong className="block mb-1">Tip:</strong>
                  Make sure you're in a quiet environment with good lighting for
                  the best interview experience.
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

function PermissionItem({ icon, label, granted }) {
  return (
    <div
      className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
        granted
          ? "bg-green-500/20 border-green-500/50"
          : "bg-red-500/20 border-red-500/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            granted
              ? "bg-green-500/30 text-green-400"
              : "bg-red-500/30 text-red-400"
          }`}
        >
          {icon}
        </div>
        <span className="text-white font-semibold text-lg">{label}</span>
      </div>
      <div
        className={`px-4 py-2 rounded-full text-sm font-bold ${
          granted ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {granted ? "✓ Granted" : "✗ Denied"}
      </div>
    </div>
  );
}
