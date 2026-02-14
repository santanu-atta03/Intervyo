import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAllInterviewsWithCounts } from "../utils/recordingStore";
import { BarChart3, Video, Monitor, ChevronRight, Trash2 } from "lucide-react";

export default function Recordings() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listAllInterviewsWithCounts();
        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Recordings</h1>
              <p className="text-gray-400 text-sm">
                Review your saved camera and screen recordings
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-300">Loading...</div>
        ) : items.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-10 text-center">
            <div className="text-6xl mb-3">🎥</div>
            <h3 className="text-xl font-bold text-white mb-2">No recordings yet</h3>
            <p className="text-gray-400">
              Start an interview and record your answers to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.interviewId}
                className="flex items-center justify-between bg-gray-800/50 border border-gray-700/60 rounded-xl p-4 hover:border-gray-600/60 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <Video className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      Interview {it.interviewId}
                    </div>
                    <div className="text-sm text-gray-400">
                      {it.count} clip{it.count === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/recordings/${it.interviewId}`)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2"
                >
                  Open
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
