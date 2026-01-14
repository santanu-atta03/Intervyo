import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, Save, History, Gauge, Sparkles } from "lucide-react";

const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "basically",
  "actually",
  "literally",
  "so",
  "well",
  "right",
  "okay",
];

function useSpeechRecognition() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          finalText += result[0].transcript;
        }
        setTranscript((prev) => (prev + " " + finalText).trim());
      };
      recognition.onerror = () => {
        setListening(false);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognitionRef.current = recognition;
      setSupported(true);
    } else {
      setSupported(false);
    }
  }, []);

  const start = () => {
    if (!supported || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (_) {}
  };

  const stop = () => {
    if (!supported || !recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setListening(false);
    } catch (_) {}
  };

  const reset = () => setTranscript("");

  return { supported, listening, transcript, start, stop, reset };
}

function analyzeMetrics(text, elapsedMs) {
  const words = text.trim().length ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;
  const minutes = Math.max(elapsedMs / 60000, 0.001);
  const wpm = Math.round(wordCount / minutes);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length);
  const avgSentenceLength = sentences.length
    ? Math.round(wordCount / sentences.length)
    : 0;

  const lowerText = text.toLowerCase();
  let fillerCount = 0;
  for (const f of FILLER_WORDS) {
    const regex = new RegExp(`\\b${f.replace(/\s+/g, "\\s+")}\\b`, "g");
    const matches = lowerText.match(regex);
    if (matches) fillerCount += matches.length;
  }

  const fillerDensity = wordCount ? +(fillerCount / wordCount).toFixed(3) : 0;
  return { wordCount, wpm, avgSentenceLength, fillerCount, fillerDensity };
}

function suggestionsFromMetrics(m) {
  const tips = [];
  if (m.wpm < 90) tips.push("Speak a bit faster to stay engaging.");
  if (m.wpm > 160) tips.push("Slow down for clarity and precision.");
  if (m.fillerDensity > 0.04)
    tips.push("Reduce filler words like ‘um’, ‘like’, and ‘you know’.");
  if (m.avgSentenceLength > 22)
    tips.push("Shorten sentences; aim for concise, punchy answers.");
  if (tips.length === 0)
    tips.push("Great pace and clarity. Keep practicing for consistency!");
  return tips;
}

export default function PracticeLab() {
  const { supported, listening, transcript, start, stop, reset } = useSpeechRecognition();
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("practiceSessions");
    if (stored) setSessions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    let timer;
    if (listening) {
      if (!startTime) setStartTime(Date.now());
      timer = setInterval(() => {
        setElapsed(Date.now() - (startTime || Date.now()));
      }, 200);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [listening, startTime]);

  const metrics = useMemo(() => analyzeMetrics(transcript, elapsed), [transcript, elapsed]);
  const tips = useMemo(() => suggestionsFromMetrics(metrics), [metrics]);

  const handleStart = () => {
    setStartTime(Date.now());
    setElapsed(0);
    start();
  };

  const handleStop = () => {
    stop();
  };

  const saveSession = () => {
    const entry = {
      id: `${Date.now()}`,
      at: new Date().toISOString(),
      durationMs: elapsed,
      transcript,
      metrics,
    };
    const next = [entry, ...sessions].slice(0, 20);
    setSessions(next);
    localStorage.setItem("practiceSessions", JSON.stringify(next));
  };

  const formatDuration = (ms) => {
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Speech Practice Lab</h1>
              <p className="text-white/70">Real-time coaching from your browser microphone</p>
            </div>
          </div>
          {!supported && (
            <div className="mt-3 text-red-300 text-sm">
              Your browser does not support the Web Speech API. Try Chrome.
            </div>
          )}
        </div>

        {/* Controls & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Session</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={handleStart}
                disabled={!supported || listening}
                className="px-4 py-2 rounded-xl bg-green-600 text-white flex items-center gap-2 disabled:opacity-50"
              >
                <Mic className="w-4 h-4" /> Start
              </button>
              <button
                onClick={handleStop}
                disabled={!supported || !listening}
                className="px-4 py-2 rounded-xl bg-red-600 text-white flex items-center gap-2 disabled:opacity-50"
              >
                <Square className="w-4 h-4" /> Stop
              </button>
              <button
                onClick={() => { reset(); setElapsed(0); setStartTime(null); }}
                className="px-4 py-2 rounded-xl bg-slate-700 text-white"
              >
                Reset
              </button>
              <div className="ml-auto text-white/80">
                Duration: <span className="font-mono">{formatDuration(elapsed)}</span>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4 min-h-[160px] border border-white/10">
              <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                {transcript || "Your transcript will appear here as you speak..."}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={saveSession} disabled={!transcript}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> Save Session
              </button>
              <span className="text-white/60 text-sm">Stored locally, up to 20 sessions</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="w-6 h-6 text-blue-300" />
              <h2 className="text-xl font-semibold text-white">Metrics</h2>
            </div>
            <ul className="space-y-2 text-white/90">
              <li className="flex justify-between"><span>Words</span><span className="font-mono">{metrics.wordCount}</span></li>
              <li className="flex justify-between"><span>WPM</span><span className="font-mono">{metrics.wpm}</span></li>
              <li className="flex justify-between"><span>Avg words / sentence</span><span className="font-mono">{metrics.avgSentenceLength}</span></li>
              <li className="flex justify-between"><span>Filler words</span><span className="font-mono">{metrics.fillerCount}</span></li>
            </ul>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-white/80 mb-2">Coaching Tips</h3>
              <ul className="space-y-2">
                {tips.map((t, i) => (
                  <li key={i} className="text-white/80 text-sm">• {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-6 h-6 text-orange-300" />
            <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
          </div>
          {sessions.length === 0 ? (
            <div className="text-white/70 text-sm">No saved sessions yet.</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 text-sm">
                      {new Date(s.at).toLocaleString()} • {formatDuration(s.durationMs)} • {s.metrics.wpm} WPM
                    </div>
                    <details className="text-white/80 text-sm">
                      <summary className="cursor-pointer">View</summary>
                      <p className="mt-2 whitespace-pre-wrap">{s.transcript}</p>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
