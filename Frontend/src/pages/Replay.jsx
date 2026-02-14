import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  listClipsByInterview,
  downloadClip,
  blobToObjectUrl,
} from "../utils/recordingStore";
import * as faceapi from "face-api.js";
import {
  Play,
  Pause,
  Download,
  Eye,
  ChevronRight,
  Video,
  Monitor,
} from "lucide-react";

export default function Replay() {
  const { id: interviewId } = useParams();
  const [clips, setClips] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const videoRef = useRef(null);
  const [eyeContact, setEyeContact] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const activeClip = useMemo(
    () => clips.find((c) => c.id === activeId) || clips[0],
    [clips, activeId],
  );

  useEffect(() => {
    (async () => {
      const cs = await listClipsByInterview(interviewId);
      setClips(cs);
      if (cs.length > 0) setActiveId(cs[0].id);
    })();
  }, [interviewId]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const url = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(url),
          faceapi.nets.faceLandmark68Net.loadFromUri(url),
        ]);
        setModelsReady(true);
      } catch (e) {
        console.warn("Face models not loaded:", e);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !activeClip) return;
    const url = blobToObjectUrl(activeClip.blob);
    videoRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [activeClip]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const runEyeContact = async () => {
    if (!modelsReady || !videoRef.current) return;
    setAnalyzing(true);
    try {
      const detections = [];
      const el = videoRef.current;
      let samples = 0;
      for (let t = 0; t < el.duration; t += Math.max(0.5, el.duration / 20)) {
        el.currentTime = t;
        await new Promise((r) => {
          const onseek = () => {
            el.removeEventListener("seeked", onseek);
            r();
          };
          el.addEventListener("seeked", onseek);
        });
        const det = await faceapi
          .detectSingleFace(el, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        if (det) detections.push(det);
        samples++;
      }
      const facePresence = samples ? (detections.length / samples) * 100 : 0;
      setEyeContact(Math.round(facePresence));
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <h1 className="text-2xl text-white font-bold">
            Replay — Interview {interviewId}
          </h1>
          <p className="text-gray-400">Playback with AI insights</p>
        </div>

        {clips.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/60 p-10 text-center text-gray-300">
            No clips saved for this interview.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="relative bg-black rounded-xl overflow-hidden border border-gray-800">
                <video
                  ref={videoRef}
                  controls={false}
                  className="w-full aspect-video"
                  onEnded={() => setPlaying(false)}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20"
                  >
                    {playing ? <Pause /> : <Play />}
                  </button>
                  {activeClip && (
                    <button
                      onClick={() => downloadClip(activeClip)}
                      className="px-3 py-2 bg-white/10 text-white rounded-lg backdrop-blur hover:bg-white/20 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/60 p-4">
                <div className="text-gray-300 font-semibold mb-2">
                  Timeline
                </div>
                <div className="flex flex-wrap gap-2">
                  {clips.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveId(c.id)}
                      className={`px-3 py-2 rounded-lg border text-sm ${activeId === c.id ? "border-purple-500 bg-purple-500/20 text-white" : "border-gray-600 bg-gray-700/50 text-gray-200"}`}
                      title={`${c.type} ${c.questionIndex ?? ""}`}
                    >
                      {c.type === "camera" ? <Video className="w-4 h-4 inline" /> : <Monitor className="w-4 h-4 inline" />}{" "}
                      {c.type} {typeof c.questionIndex === "number" ? `Q${c.questionIndex + 1}` : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/60 p-4">
                <div className="text-gray-300 font-semibold mb-2">
                  AI Insights
                </div>
                {activeClip?.type === "camera" ? (
                  <>
                    <div className="text-sm text-gray-400">
                      Filler words:{" "}
                      <span className="text-white font-semibold">
                        {activeClip.metrics?.fillerCount ?? 0}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Confidence score:{" "}
                      <span className="text-white font-semibold">
                        {activeClip.metrics?.confidence ?? 70}
                      </span>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={runEyeContact}
                        disabled={!modelsReady || analyzing}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                      >
                        {analyzing ? "Analyzing..." : "Analyze Eye Contact"}
                      </button>
                      {eyeContact != null && (
                        <div className="mt-2 text-sm text-gray-300">
                          Eye contact (face presence):{" "}
                          <span className="text-white font-semibold">
                            {eyeContact}%
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-sm">
                    Screen clip. Use to review coding flow and switching.
                  </div>
                )}
                {activeClip?.transcript && (
                  <div className="mt-4">
                    <div className="text-gray-300 font-semibold mb-1">
                      Transcript
                    </div>
                    <div className="text-gray-200 bg-gray-900/60 border border-gray-700/60 rounded-lg p-3 max-h-40 overflow-auto">
                      {activeClip.transcript}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
