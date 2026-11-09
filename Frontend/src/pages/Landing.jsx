import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Check,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  Search,
  ExternalLink,
  Mic,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/shared/SEO";
import Footer from "../components/shared/Footer";
import BrandLogo from "../components/shared/BrandLogo";
import { warmUpAuthService } from "../services/operations/authAPI";
import "../pages/Landing.css";
gsap.registerPlugin(ScrollTrigger);


// ─── Visual Assets ─────────────────────────────────────────────────────────────
const ASSETS = {
  heroPoster: "https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/7193d190-pasted-image-1775832091224.webp",
  announcementThumb: "https://i.ytimg.com/vi/NONVS2IoDQE/mqdefault.jpg",
  balloonGreen: "https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/dda2ec24-green-balloon-poster.webp",
  balloonPink: "https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/f7d53b84-pink-balloon-poster.webp",
  balloonYellow: "https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/d3abd16c-yellow-balloon-poster.webp",
  balloonBlue: "https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/0666fd88-blue-balloon-poster.webp",
  macbookMockup: "/intervyo-macbook.jpg",
  micImage: "/podcast_mic_clean.png",
  logos: [
    { name: "Google" },
    { name: "Meta" },
    { name: "Stripe" },
    { name: "Amazon" },
    { name: "Apple" },
    { name: "Netflix" },
    { name: "OpenAI" },
    { name: "Uber" },
    { name: "Datadog" },
    { name: "Microsoft" },
    { name: "Hex" },
    { name: "CodeCrafters" },
  ],
};

// ─── IntervyoBooks (Curated Interview Playbooks) ───────────────────────────────
const INTERVYO_BOOKS = [
  {
    title: "Meta E5 System Design Blitz",
    author: "Bryant Chou",
    role: "Former Webflow CTO & Systems Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    desc: "A composition-obsessed workflow for defending high-throughput systems under real interviewer pushback — partition strategies, write-through caches, and failure isolation.",
    accent: "bg-[#D1F48C] text-[#273416]",
    badge: "System Design",
  },
  {
    title: "Google L5 AST Hard Gauntlet",
    author: "Corey Haines",
    role: "Algorithm & Optimization Lead",
    avatar: "https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/87f82a81-corey-haines.webp",
    desc: "Two-phase workflow for shipping production-grade algorithmic code. Automatically evaluates cyclomatic AST complexity, boundary fuzzing, and hidden edge cases.",
    accent: "bg-[#C3DBFF] text-[#0A0D27]",
    badge: "Algorithms",
  },
  {
    title: "Stripe Idempotent API Architecture",
    author: "Julian Shapiro",
    role: "Systems & Conversion Specialist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    desc: "Audit and defend critical financial state machines. Single-flight request coalescing, distributed lock leases, and webhook delivery guarantees.",
    accent: "bg-[#FFFA64] text-[#441F16]",
    badge: "Financial APIs",
  },
  {
    title: "Amazon 16 Leadership Principles & STAR",
    author: "Eliana Atia",
    role: "Executive Talent Bar Raiser",
    avatar: "https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/12c26ff8-ployee-eliana-atia.webp",
    desc: "Turn messy work history into structured, executive-grade STAR answers. Measures vocal brevity, inflection, and cadence without fluff.",
    accent: "bg-[#FFB8FC] text-[#9A0103]",
    badge: "Behavioral",
  },
  {
    title: "Executive Brevity & Communication",
    author: "Lorenzo Gentile",
    role: "Staff Engineering Director",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80",
    desc: "Learn to answer Staff+ tradeoff questions in 45 seconds or less. Eliminates rambling, circular explanations, and unprompted monologues.",
    accent: "bg-[#D1F48C] text-[#273416]",
    badge: "Communication",
  },
  {
    title: "Staff+ Architecture & Tradeoff Defense",
    author: "Neel Murthy",
    role: "Principal Infrastructure Lead",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
    desc: "The full architectural review gauntlet — multi-region disaster recovery, CAP concessions, and justifying tech debt to hiring committees.",
    accent: "bg-[#C3DBFF] text-[#0A0D27]",
    badge: "Principal",
  },
  {
    title: "Distributed Consensus: Raft vs Paxos",
    author: "Omid Ghiam",
    role: "Distributed Storage Architect",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80",
    desc: "Deep-dive drill covering leader election failures, log compaction, network partitions, and quorum leases with simulated split-brain attacks.",
    accent: "bg-[#FFB8FC] text-[#9A0103]",
    badge: "Consensus",
  },
  {
    title: "High-Concurrency Deadlock Defense",
    author: "Emre Kavaloglu",
    role: "Senior Performance Engineer",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
    desc: "Live code debugging session exposing race conditions, thread starvation, lock contention, and optimistic concurrency ceilings under load.",
    accent: "bg-[#FFFA64] text-[#441F16]",
    badge: "Concurrency",
  },
  {
    title: "Event-Driven Microservices at Scale",
    author: "Jack Gashi",
    role: "Cloud Infrastructure Architect",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    desc: "Architect outbox patterns, Kafka consumer rebalancing, dead-letter queues, and exactly-once processing semantics for enterprise systems.",
    accent: "bg-[#D1F48C] text-[#273416]",
    badge: "Microservices",
  },
];

// ─── Overnight Activity Feed ───────────────────────────────────────────────────
const OVERNIGHT_FEED = [
  {
    time: "11:42 PM",
    tag: "Performance",
    tagColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    agent: "@performance",
    action: "Your system design answers improved by 18%",
    detail: "Distributed caching and CAP concessions defended crisply without circular rambling.",
  },
  {
    time: "01:15 AM",
    tag: "Communication",
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    agent: "@voice",
    action: "AI detected hesitation during behavioral questions",
    detail: "Vocal hesitation stall on conflict resolution lasted 3.1s. Generated a 25-second STAR pacing drill.",
  },
  {
    time: "03:08 AM",
    tag: "Communication",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    agent: "@telemetry",
    action: "Your communication score increased to 86",
    detail: "Filler words decreased from 4.2/min to 0.9/min across 3 consecutive mock sessions.",
  },
  {
    time: "04:33 AM",
    tag: "Technical",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    agent: "@compiler",
    action: "Three technical weaknesses identified",
    detail: "Flagged lock contention ceiling and memory allocation overhead in concurrent worker pool.",
  },
  {
    time: "06:22 AM",
    tag: "Readiness",
    tagColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    agent: "@evaluator",
    action: "Your frontend interview readiness has improved",
    detail: "Virtual DOM diffing and state hydration scored 95/100 against Meta Staff Engineer rubrics.",
  },
  {
    time: "07:55 AM",
    tag: "Intelligence",
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    agent: "@intel",
    action: "Updated Google L5 question banks from 2026 reports",
    detail: "Integrated 8 new distributed consensus scenarios reported by candidates this week.",
  },
];

// ─── Ecosystem Partners ────────────────────────────────────────────────────────
const INTEGRATIONS_LIST = [
  "LeetCode", "GitHub", "VS Code", "HackerRank", "Codeforces", "Terminal", "Docker",
  "PostgreSQL", "Redis", "Kafka", "Kubernetes", "TypeScript", "Python", "Go",
  "Java", "C++", "Rust", "Claude", "ChatGPT", "Cursor", "Notion", "Linear", "Slack",
  "Stripe", "Supabase", "Datadog", "AWS", "Google Cloud", "Azure", "GraphQL"
];

const NUMBER_ROLL_BASE = 40;
const NUMBER_ROLL_DURATION = 700;
const NUMBER_ROLL_STAGGER = 80;

function RollingDigit({
  digit,
  previousDigit,
  direction,
  shouldAnimate,
  isDigitPresent,
  positionFromRight,
}) {
  const [position, setPosition] = useState(
    NUMBER_ROLL_BASE + (shouldAnimate ? previousDigit : digit),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(isDigitPresent);
  const animationFrameRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  useLayoutEffect(() => {
    if (!shouldAnimate) return undefined;

    const digitDelta =
      direction > 0
        ? (digit - previousDigit + 10) % 10
        : -((previousDigit - digit + 10) % 10);
    if (digitDelta === 0) return undefined;

    setIsAnimating(true);
    setIsVisible(true);
    animationFrameRef.current = window.requestAnimationFrame(() => {
      setPosition(
        (currentPosition) => currentPosition + direction * 20 + digitDelta,
      );
      animationTimeoutRef.current = window.setTimeout(() => {
        setPosition(NUMBER_ROLL_BASE + digit);
        setIsAnimating(false);
        setIsVisible(isDigitPresent);
      }, NUMBER_ROLL_DURATION + positionFromRight * NUMBER_ROLL_STAGGER + 40);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(animationTimeoutRef.current);
    };
  }, [
    digit,
    direction,
    isDigitPresent,
    positionFromRight,
    previousDigit,
    shouldAnimate,
  ]);

  return (
    <span
      className={`number-roll-digit${isVisible ? "" : " is-hidden"}`}
      aria-hidden="true"
    >
      <span
        className={`number-roll-track${isAnimating ? " is-animating" : ""}`}
        style={{
          transform: `translateY(-${position}em)`,
          transitionDelay: `${positionFromRight * NUMBER_ROLL_STAGGER}ms`,
        }}
      >
        {Array.from({ length: 80 }, (_, index) => (
          <span className="number-roll-glyph" key={index}>
            {index % 10}
          </span>
        ))}
      </span>
    </span>
  );
}

function RollingNumber({ value, prefix = "", suffix = "", minDigits = 1 }) {
  const previousValueRef = useRef(value);
  const previousDigits = String(Math.abs(previousValueRef.current))
    .split("")
    .reverse();
  const digits = String(Math.abs(value)).split("").reverse();
  const direction = value >= previousValueRef.current ? 1 : -1;
  const numberChanged = value !== previousValueRef.current;
  const digitCount = Math.max(digits.length, minDigits);

  useLayoutEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return (
    <span className="number-roll" aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      <span className="number-roll-digits">
        {Array.from({ length: digitCount }, (_, positionFromRight) => {
          const digit = Number(digits[positionFromRight] ?? 0);
          const previousDigit = previousDigits[positionFromRight];
          const isNewDigit = previousDigit === undefined;

          return (
            <RollingDigit
              key={positionFromRight}
              digit={digit}
              previousDigit={previousDigit ?? 0}
              direction={direction}
              shouldAnimate={
                numberChanged &&
                (isNewDigit || previousDigit !== digit)
              }
              isDigitPresent={positionFromRight < digits.length}
              positionFromRight={positionFromRight}
            />
          );
        }).reverse()}
      </span>
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activePunchcard, setActivePunchcard] = useState(0);
  const heroRef = useRef(null);
  const scrollFillRef = useRef(null);
  const playbooksScrollRef = useRef(null);

  useEffect(() => {
    warmUpAuthService();
  }, []);

  const scrollPlaybooks = (direction) => {
    if (playbooksScrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      playbooksScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Dynamic live metrics ticker for Section 2 (Interview Stats)
  const [liveMetrics, setLiveMetrics] = useState({
    interviews: 42,
    avgScore: 91,
    questions: 340,
    trend: 28,
    analysisScore: 88,
    techAccuracy: 94,
    confidence: 88,
    weaknesses: 2,
    offerBump: 54,
    skills: 14,
    streak: 18,
    readiness: 96,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMetrics((prev) => ({
        interviews: prev.interviews >= 99 ? 42 : prev.interviews + 1,
        avgScore: Math.min(98, prev.avgScore + (Math.random() > 0.6 ? 1 : 0)),
        questions: prev.questions + Math.floor(Math.random() * 3) + 1,
        trend: Math.min(38, prev.trend + (Math.random() > 0.65 ? 1 : 0)),
        analysisScore: Math.min(99, prev.analysisScore + (Math.random() > 0.5 ? 1 : 0)),
        techAccuracy: Math.min(99, prev.techAccuracy + (Math.random() > 0.7 ? 1 : 0)),
        confidence: Math.min(96, prev.confidence + (Math.random() > 0.5 ? 1 : 0)),
        weaknesses: 2,
        offerBump: prev.offerBump + (Math.random() > 0.7 ? 1 : 0),
        skills: Math.min(24, prev.skills + (Math.random() > 0.8 ? 1 : 0)),
        streak: prev.streak,
        readiness: Math.min(99, prev.readiness + (Math.random() > 0.75 ? 1 : 0)),
      }));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Silky-smooth GPU conveyor ticker for Section 5B (zero lag, 60/120fps compositor)
  const [feedIndex, setFeedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let animTimeout;
    const interval = setInterval(() => {
      setIsAnimating(true);
      animTimeout = setTimeout(() => {
        setFeedIndex((prev) => (prev + 1) % OVERNIGHT_FEED.length);
        setIsAnimating(false);
      }, 650);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(animTimeout);
    };
  }, [isPaused]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Scroll-Triggered Text Fill Scrub for Headline
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!scrollFillRef.current || prefersReducedMotion) return undefined;
    const lines = scrollFillRef.current.querySelectorAll(".scroll-fill-line");

    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        ScrollTrigger.create({
          trigger: line,
          start: "top 80%",
          end: "bottom 45%",
          scrub: 0.5,
          onUpdate: (self) => {
            const pct = Math.min(100, Math.max(0, self.progress * 100));
            line.style.setProperty("--progress", `${pct}%`);
          },
        });
      });
    }, scrollFillRef);

    return () => ctx.revert();
  }, []);

  const handleStartDrill = (e) => {
    e?.preventDefault();
    const query = urlInput.trim() || "Staff Software Engineer";
    navigate(`/interview-setup?role=${encodeURIComponent(query)}`);
  };

  // Dynamic interview performance graph
  const interviewHistory = liveMetrics.interviewHistory || [];

  // Generate fallback data if historical data is unavailable
  const graphData =
    interviewHistory.length >= 2
      ? interviewHistory
      : Array.from({ length: 12 }, (_, i) => {
        const progress = (i + 1) / 12;
        return liveMetrics.interviews * progress;
      });

  const maxValue = Math.max(...graphData, 1);
  const minValue = Math.min(...graphData);

  const points = graphData.map((value, index) => ({
    x: (index / (graphData.length - 1)) * 100,
    y: 35 - ((value - minValue) / (maxValue - minValue || 1)) * 29,
  }));

  // Smooth curve using cubic Bézier
  const createSmoothPath = (points) => {
    if (points.length < 2) return "";

    return points.reduce((path, point, index, arr) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = arr[index - 1];
      const controlX = (previous.x + point.x) / 2;

      return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    }, "");
  };

  const sparklineLinePath = createSmoothPath(points);

  const sparklineAreaPath = `
  ${sparklineLinePath}
  L 100 40
  L 0 40
  Z
`;

  // Dynamic Career Progress Sparkline
  const careerHistory = liveMetrics.careerHistory || [];

  const careerGraphData =
    careerHistory.length >= 2
      ? careerHistory
      : Array.from({ length: 12 }, (_, i) => {
        const progress = (i + 1) / 12;
        return liveMetrics.offerBump * progress;
      });

  const careerMaxValue = Math.max(...careerGraphData, 1);
  const careerMinValue = Math.min(...careerGraphData);

  const careerPoints = careerGraphData.map((value, index) => ({
    x: (index / (careerGraphData.length - 1)) * 100,
    y:
      35 -
      ((value - careerMinValue) /
        (careerMaxValue - careerMinValue || 1)) *
      29,
  }));

  const createCareerPath = (points) => {
    if (points.length < 2) return "";

    return points.reduce((path, point, index, arr) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = arr[index - 1];
      const controlX = (previous.x + point.x) / 2;

      return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    }, "");
  };

  const careerLinePath = createCareerPath(careerPoints);

  const careerAreaPath = `
  ${careerLinePath}
  L 100 40
  L 0 40
  Z
`;
  // Dynamic AI Analysis Sparkline
  const analysisHistory = liveMetrics.analysisHistory || [];

  const analysisGraphData =
    analysisHistory.length >= 2
      ? analysisHistory
      : Array.from({ length: 12 }, (_, i) => {
        const progress = (i + 1) / 12;
        return liveMetrics.analysisScore * progress;
      });

  const analysisMaxValue = Math.max(...analysisGraphData, 1);
  const analysisMinValue = Math.min(...analysisGraphData);

  const analysisPoints = analysisGraphData.map((value, index) => ({
    x: (index / (analysisGraphData.length - 1)) * 100,
    y:
      35 -
      ((value - analysisMinValue) /
        (analysisMaxValue - analysisMinValue || 1)) *
      29,
  }));

  const createAnalysisPath = (points) => {
    if (points.length < 2) return "";

    return points.reduce((path, point, index, arr) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = arr[index - 1];
      const controlX = (previous.x + point.x) / 2;

      return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    }, "");
  };

  const analysisLinePath = createAnalysisPath(analysisPoints);

  const analysisAreaPath = `
  ${analysisLinePath}
  L 100 40
  L 0 40
  Z
`;
  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#F3F4F6] font-sans antialiased selection:bg-white selection:text-black">
      <SEO
        title="Intervyo | Autonomous AI Interview & Career Growth Platform"
        description="Your interview prep should be working harder than you are. Intervyo is the autonomous platform that turns your prep into an unfair career advantage."
        canonical="/"
      />

      {/* ── FK Screamer & Micro Styles ── */}
      <style>{`
        @font-face {
          font-family: 'FK Screamer';
          src: url('https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2') format('woff2');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }

        .font-heading {
          font-family: 'FK Screamer', 'Impact', -apple-system, sans-serif;
          letter-spacing: -0.02em;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        .char-btn:hover .c-char {
          transform: translateY(-2px);
        }

        .scroll-fill-line {
          --progress: 0%;
          color: transparent;
          background-color: rgba(255, 255, 255, 0.18);
          background-image: linear-gradient(
            90deg,
            #FFFFFF 0%,
            #FFFFFF var(--progress),
            transparent var(--progress)
          );
          -webkit-background-clip: text;
          background-clip: text;
          display: inline-block;
          will-change: background-image;
        }

        @keyframes waveformPulse {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.85;
          }
        }
        .animate-waveform-pulse {
          animation: waveformPulse 4s ease-in-out infinite;
        }

        @keyframes micFloat {
          0%, 100% {
            transform: translateY(0px) rotate(-3deg) scale(1);
          }
          50% {
            transform: translateY(-14px) rotate(3deg) scale(1.05);
          }
        }
        .animate-mic-float {
          animation: micFloat 4.8s ease-in-out infinite;
        }
      `}</style>

      {/* ── 1. FIXED FLOATING CAPSULE NAVIGATION (DARK MODE) ── */}
      <nav className="fixed left-1/2 top-3 z-50 w-[calc(100vw-24px)] max-w-[1400px] -translate-x-1/2 px-2 sm:top-10 sm:w-[99%] sm:px-6 md:px-[10px]">
        <div className="flex items-center justify-between gap-2">

          {/* LEFT: Brand + Navigation Pill */}
          <div className="flex min-w-0 items-center gap-3 rounded-full bg-white px-3 py-2.5 shadow-sm sm:gap-7 sm:px-5">

            {/* Intervyo Brand */}
            <Link to="/" className="flex shrink-0 items-center">
              <BrandLogo className="!rounded-none !bg-transparent !px-0 !py-0 !shadow-none text-[24px] sm:text-[35px]" />
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-[16px] font-medium text-[#555555]">

              <a
                href="#platform"
                className="hover:text-black transition-colors duration-200"
              >
                Platform
              </a>

              <a
                href="#engines"
                className="hover:text-black transition-colors duration-200"
              >
                Engines
              </a>

              <a
                href="#playbooks"
                className="hover:text-black transition-colors duration-200"
              >
                Playbooks
              </a>

              <a
                href="#migrations"
                className="hover:text-black transition-colors duration-200 whitespace-nowrap"
              >
                Candidate Stories
              </a>

              <Link
                to="/pricing"
                className="hover:text-black transition-colors duration-200"
              >
                Pricing
              </Link>

            </div>
          </div>


          {/* RIGHT: Action Buttons */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">

            {/* Login */}
            <Link
              to="/login"
              className="char-btn hidden items-center justify-center gap-1.5 rounded-full bg-[#dcd7d7] px-7 py-3 text-[15px] font-semibold text-black shadow-sm transition-all duration-200 hover:bg-[#9b9494] active:scale-[0.97] sm:flex"
            >
              <span className="inline-flex">
                {"Log in".split("").map((c, i) => (
                  <span
                    key={i}
                    className="c-char inline-block transition-transform duration-200"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    {c === " " ? "\u00A0" : c}
                  </span>
                ))}
              </span>
            </Link>


            {/* Get Demo */}
            <Link
              to="/interview-setup"
              className="hidden sm:flex items-center justify-center bg-white text-[#171717] text-[15px] font-semibold px-7 py-3 rounded-full hover:bg-zinc-100 transition-all duration-200 shadow-sm"
            >
              Get Demo
            </Link>


            {/* Start Free */}
            <Link
              to="/interview-setup"
              className="char-btn flex flex-row items-center gap-1.5  rounded-full bg-[#171717] px-3 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#333333] active:scale-[0.97] sm:px-7 sm:py-3 sm:text-[15px]"
            >

              <span className="inline-flex">
                {"Start Free".split("").map((c, i) => (
                  <span
                    key={i}
                    className="c-char inline-block transition-transform duration-200"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    {c === " " ? "\u00A0" : c}
                  </span>
                ))}
              </span>

              <ArrowRight className="w-4 h-4" />

            </Link>

            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-white text-[#171717] shadow-sm transition-colors hover:bg-zinc-100 lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="landing-mobile-navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>

        {mobileMenuOpen && (
          <div
            id="landing-mobile-navigation"
            className="mt-2 rounded-2xl border border-black/10 bg-white p-3 text-sm font-medium text-zinc-700 shadow-xl lg:hidden"
          >
            {[
              ["Platform", "#platform"],
              ["Engines", "#engines"],
              ["Playbooks", "#playbooks"],
              ["Candidate Stories", "#migrations"],
              ["Pricing", "/pricing"],
            ].map(([label, href]) =>
              href.startsWith("/") ? (
                <Link
                  key={label}
                  to={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 transition-colors hover:bg-zinc-100"
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 transition-colors hover:bg-zinc-100"
                >
                  {label}
                </a>
              ),
            )}
          </div>
        )}
      </nav>

      {/* ── 2. HERO SECTION WITH EMBEDDED STAGE (DARK MODE) ── */}
      <section className="relative  px-4 pt-28 pb-12 sm:px-6 lg:px-8 max-w-[10/12] mx-auto">
        <div
          ref={heroRef}
          className="relative mx-auto flex h-[calc(100vh-9rem+110px)] min-h-[750px] max-h-[1090px] w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#0E121A] border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-center text-white"
        >
          {/* Background Loop Video/Poster */}
          <img
            src={ASSETS.heroPoster}
            alt="Intervyo Autonomous Stage"
            className="absolute inset-0 h-full w-full object-cover opacity-50 scale-105"
            width={1600}
            height={900}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0A0D12]/70 backdrop-blur-[2px]" />

          {/* Floating Announcement Badge (Bottom-Left) */}
          {/* <Link
            to="/interview-setup"
            className="group absolute left-6 sm:left-12 bottom-6 z-20 flex w-[min(380px,calc(100%-48px))] items-center gap-3.5 rounded-[12px] bg-[#141824]/95 border border-white/15 p-3 text-white shadow-2xl backdrop-blur-md hover:border-white/30 transition-all text-left"
          >
            <img
              src={ASSETS.announcementThumb}
              alt="Intervyo 2.0 announcement"
              className="size-[54px] shrink-0 rounded-[8px] object-cover"
              width={54}
              height={54}
              loading="lazy"
              decoding="async"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Announcement
              </span>
              <span className="mt-0.5 text-xs font-semibold leading-tight text-white line-clamp-2">
                Intervyo 2.0 launches: The first autonomous platform that guarantees your offer.
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-auto" />
          </Link> */}

          {/* Hero Content Center */}
          <div className="relative z-10 max-w-[1100px] px-4 flex flex-col items-center">
            <h1 className="w-full font-heading font-bold uppercase leading-[0.86] tracking-wide text-balance text-[56px] sm:text-[84px] md:text-[110px] lg:text-[132px] text-white">
              Your interview prep should be working harder than you are.
            </h1>

            <p className="mt-8 max-w-md text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Intervyo is the autonomous platform that turns your interview preparation into your unfair career advantage.
            </p>

            <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-3.5 sm:mt-10 sm:flex-nowrap">
              <Link
                to="/interview-setup"
                className="rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-[#0A0D12] shadow-xl transition-all hover:bg-zinc-200 active:scale-[0.98] sm:px-8 sm:py-4"
              >
                Start Free
              </Link>
              <Link
                to="/interview-setup"
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/15 sm:px-8 sm:py-4"
              >
                Get Demo
              </Link>
              {/* <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                aria-label="Watch Product Tour"
                className="size-[52px] rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white flex items-center justify-center transition-all group"
              >
                <Play className="w-4 h-4 fill-white ml-0.5 group-hover:scale-110 transition-transform" />
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. LOGO WALL (TOP TECH HIRING MARQUEE - DARK MODE) ── */}
      <section className="py-16 overflow-hidden border-y border-white/10 bg-[#0E121A]/50">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-zinc-400 mb-10">
            Trusted by high-horsepower engineers landing offers at
          </p>
          <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
            <div className="animate-marquee flex items-center gap-16 text-zinc-300 font-[Geist] hover:text-white transition-all">
              {[...ASSETS.logos, ...ASSETS.logos, ...ASSETS.logos].map((logo, idx) => (
                <div key={idx} className="flex items-center gap-2.5 shrink-0">
                  <span className=" font-bold text-xl  text-zinc-300 hover:text-white transition-colors cursor-default">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. "YOUR PREP LAUNCHED. THEN IT STOPPED." (DARK MODE WITH 3D MACBOOK MOCKUP) ── */}
      <section id="platform" className="py-20 sm:py-30 px-4 sm:px-6 max-w-[1400px] mx-auto relative overflow-visible">
        {/* Subtle Tech Lattice Behind Mockup */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black_40%,transparent_100%)] pointer-events-none z-0" />

        {/* 3D Floating MacBook with 'intervyo' typed on screen */}
        <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-[440px] max-w-[98vw] sm:-top-[130px] sm:left-[300px] sm:w-[540px] lg:w-[780px]
        aspect-square z-0 pointer-events-none opacity-55 select-none 
        drop-shadow-[0_25px_70px_rgba(0,0,0,0.9)] 
        [mask-image:radial-gradient(ellipse_100%_75%_at_35%_45%,black_15%,rgba(0,0,0,0.9)_40%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,0.25)_80%,transparent_100%)]
[-webkit-mask-image:radial-gradient(ellipse_100%_75%_at_35%_45%,black_15%,rgba(0,0,0,0.9)_40%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,0.25)_80%,transparent_100%)]">
          <img
            src={ASSETS.macbookMockup}
            alt="Intervyo Platform MacBook Mockup"
            className="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>

        {/* Headline with Continuous Scroll-Triggered Text Fill */}
        <div className="relative z-10 text-center max-w-5xl mx-auto mb-20">
          <h2
            ref={scrollFillRef}
            className="w-full font-heading font-bold uppercase leading-[0.86] text-balance text-[56px] sm:text-[96px] md:text-[120px] lg:text-[144px] text-center select-none"
          >
            <span className="scroll-fill-line">Your prep launched.</span>
            <br />
            <span className="scroll-fill-line">Then it stopped.</span>
          </h2>
          <p className="mt-8 text-zinc-400 text-lg sm:text-xl font-normal max-w-xl mx-auto">
            Intervyo takes what you have and puts it on autopilot.
          </p>
        </div>

        {/* 3-Column Split Card with Dark Background & Fine Dividers */}
        <div className="p-8 sm:p-12 bg-black rounded-[16px] border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 gap-8 md:gap-0">
          {/* Monitor */}
          <div className="flex flex-col justify-between md:pr-10">
            <div>
              <div className="w-10 h-10 rounded-[8px] bg-black border border-white/15 flex items-center justify-center mb-8 shadow-sm overflow-hidden relative">

                <svg
                  viewBox="0 0 40 40"
                  className="w-full h-full"
                  fill="none"
                >
                  <g className="chain-animation">

                    {[0, 32, 64].map((offset) => (
                      <g key={offset} transform={`translate(${offset}, 0)`}>

                        {/* Connecting Chain Lines */}
                        <g
                          stroke="#FFFA64"
                          strokeWidth="1"
                          strokeOpacity="0.45"
                        >
                          <path d="
              M0 11 L4 27
              M8 11 L4 27 L12 11
              M16 11 L12 27 L20 11
              M24 11 L20 27 L28 11
              M32 11 L28 27
            " />
                        </g>

                        {/* Top Layer Dots */}
                        {[0, 8, 16, 24, 32].map((x) => (
                          <circle
                            key={`top-${x}`}
                            cx={x}
                            cy="11"
                            r="2"
                            fill="#FFFA64"
                          />
                        ))}

                        {/* Bottom Layer Dots */}
                        {[4, 12, 20, 28].map((x) => (
                          <circle
                            key={`bottom-${x}`}
                            cx={x}
                            cy="27"
                            r="2"
                            fill="#FFFA64"
                          />
                        ))}

                      </g>
                    ))}

                  </g>
                </svg>

              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                Monitor
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
                Intervyo watches your interview performance and target hiring bars — continuously. Vocal hesitation, AST algorithmic flaws, filler words, rubric gaps. Nothing slips through.
              </p>
            </div>
          </div>

          {/* Act */}
          <div className="flex flex-col justify-between pt-8 md:pt-0 md:px-10">
            <div>
              <div className="w-10 h-10 rounded-[8px] bg-black border border-white/15 flex items-center justify-center font-mono text-sm mb-8 text-[#D1F48C] shadow-sm">
                :::
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                Act
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
                Intervyo doesn't just report back. Its agents generate targeted micro-drills, fix what's broken in your reasoning, and run pressure simulations — automatically, while you focus on life.
              </p>
            </div>
          </div>

          {/* Surface */}
          <div className="flex flex-col justify-between pt-8 md:pt-0 md:pl-10">
            <div>
              <div className="w-10 h-10 rounded-[8px] bg-black border border-white/15 flex items-center justify-center font-mono text-sm mb-8 text-[#FFB8FC] shadow-sm">
                :::
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                Surface
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
                Every mock session becomes a clear next step. Know your percentile ranking across Google and Meta rubrics, what's working, and where your highest compensation opportunities are.
              </p>
            </div>
          </div>
        </div>

        {/* Integration Callout (Dark Mode) */}
        <div className="mt-8 p-6 rounded-[14px] bg-[#131722] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-200">
              Works with <strong>LeetCode, GitHub, VS Code and Terminal</strong> too.
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer">
            Ship offer-ready answers from any workflow →
          </span>
        </div>
      </section>

      {/* ── 5. REDESIGNED INTERVYO SECTIONS (FOLLOWING IMAGE 1 LAYOUT DNA IN INTERVYO DARK THEME) ── */}
      <section className=" px-4 sm:px-6 max-w-[10/12] mx-auto py-4">
        {/* ── SECTION 1: HERO / MAIN HEADING (PRIMARY SECTION BACKGROUND #11121A) ── */}
        <div className="relative rounded-[10px] bg-gradient-to-b from-[#FFB8FC] to-[#E270DB]  p-8 sm:p-14 lg:p-10 pb-10 sm:pb-16 text-white shadow-2xl overflow-visible mb-6 sm:mb-8">
          {/* Subtle Electric Violet Ambient Radial Lighting */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-purple-600/10 blur-3xl pointer-events-none rounded-t-[36px]" />

          <div className="flex flex-col lg:flex-row items-start justify-between md:gap-8 md:mb-14 relative z-10">
            <div>
              <h2 className="font-heading font-bold uppercase leading-[0.88] text-6xl sm:text-8xl lg:text-[100px] text-black">
                <span>YOU SLEPT 8 HOURS.</span>
                <br />
                <span className="flex items-center flex-wrap gap-2 sm:gap-3 mt-2">
                  {/* Floating Studio Microphone */}
                  <span className="inline-block relative w-16 sm:w-24 lg:w-32 h-14 sm:h-20 lg:h-24 align-middle mx-1 sm:mx-3 select-none shrink-0">
                    <img
                      src={ASSETS.micImage}
                      alt="Intervyo Studio Microphone"
                      className="w-full h-full object-contain animate-mic-float drop-shadow-[0_10px_35px_rgba(139,92,246,0.5)]"
                    />
                  </span>
                  <span>INTERVYO DIDN'T.</span>
                </span>
              </h2>
            </div>

            <div className="max-w-lg pt-[160px] lg:mt-6 text-[#11121A] text-sm sm:text-base leading-relaxed font-normal">
              Intervyo continuously evaluates your mock interview performance, catches blind spots, and calibrates your answers against top-tier tech hiring bars — even while you sleep.
            </div>
          </div>

          {/* ── SECTION 2: THREE FLOATING STATISTIC CARDS (OVERLAPPING SECTION BOUNDARIES) ── */}
          <div className="relative z-30 translate-y-10 sm:translate-y-26 -mb-15 sm:-mb-36 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-3 max-w-[1150px] mx-auto">
              {/* Card 1: Interview Performance */}
              <div className="relative p-5 bg-white rounded-[12px] border border-black/[0.06] shadow-[0_12px_35px_rgba(0,0,0,0.12)] flex flex-col justify-around h-[400px]  min-h-[200px] overflow-hidden transition-all">

                <div className="flex flex-col justify-center">

                  {/* Header + Graph */}
                  <div className="relative flex items-center justify-between gap-2">

                    <div className="relative z-10 flex items-center gap-2">
                      <span className="font-heading font-bold text-3xl text-[#212121]">
                        intervyo
                      </span>

                      <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-black text-white border border-violet-500/30">
                        Performance
                      </span>
                    </div>

                    {/* Dynamic Sparkline - Right Side */}
                    <div className="absolute right-0 top-[25px] w-[42%] h-[65px] pointer-events-none">

                      <svg
                        viewBox="0 0 100 40"
                        preserveAspectRatio="none"
                        className="w-full h-full overflow-visible"
                      >
                        <defs>
                          <linearGradient
                            id="perfGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#E879F9"
                              stopOpacity="0.35"
                            />

                            <stop
                              offset="100%"
                              stopColor="#E879F9"
                              stopOpacity="0.02"
                            />
                          </linearGradient>
                        </defs>

                        {/* Gradient Area */}
                        <path
                          d={sparklineAreaPath}
                          fill="url(#perfGrad)"
                        />

                        {/* Smooth Graph Line */}
                        <path
                          d={sparklineLinePath}
                          stroke="#E879F9"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />

                      </svg>

                    </div>
                  </div>


                  {/* Main Interview Count */}
                  <div className="font-heading text-6xl sm:text-7xl font-bold text-[#212121] mt-4 tracking-tight leading-none transition-all duration-300">
                    <RollingNumber value={liveMetrics.interviews} minDigits={3} />
                  </div>

                  <div className="text-xs sm:text-sm text-[#A1A1AA] font-medium mt-1">
                    mock interviews completed
                  </div>


                  {/* Description */}
                  <p className="mt-4 p-3.5 rounded-xl bg-[#F5F5F5] border border-black/[0.04] text-xs sm:text-[13px] text-black/80 leading-relaxed font-sans">
                    Analyzed distributed system trade-offs and STAR behavioral frameworks across FAANG rubrics.
                  </p>

                </div>


                {/* Bottom Metrics */}
                <div>

                  <div className="grid grid-cols-3 gap-2 text-center">

                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase">
                        Avg Score
                      </span>

                      <span className="font-heading font-bold text-base sm:text-2xl text-[#222222] mt-0.5">
                        <RollingNumber value={liveMetrics.avgScore} suffix="%" minDigits={2} />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase tracking-wider">
                        Questions
                      </span>

                      <span className="font-heading font-bold text-2xl text-[#222222] mt-0.5">
                        <RollingNumber value={liveMetrics.questions} minDigits={4} />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase tracking-wider">
                        Trend
                      </span>

                      <span className="font-heading font-bold text-base sm:text-2xl text-violet-400 mt-0.5">
                        <RollingNumber value={liveMetrics.trend} prefix="+" suffix="%" minDigits={2} />
                      </span>
                    </div>

                  </div>


                  {/* Status */}
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono font-medium text-violet-500">
                    <span className="size-2 rounded-full bg-violet-400 animate-pulse" />
                    <span>Calibrating system design rubric</span>
                  </div>

                </div>

              </div>

              {/* Card 2: AI Analysis */}

              <div className="relative overflow-hidden p-5 bg-white rounded-[12px] border border-black/[0.06] shadow-[0_12px_35px_rgba(0,0,0,0.12)] flex flex-col justify-around h-[400px] min-h-[300px] transition-all">
                <div>
                  {/* Brand Pill + Sparkline Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-3xl text-[#212121]">
                        intervyo
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-black text-white border border-emerald-500/30">
                        AI Analysis
                      </span>
                    </div>

                    {/* Soft Green Sparkline Chart SVG */}
                    {/* Dynamic Emerald Green Sparkline */}
                    <svg
                      className="absolute right-0 top-[50px] w-28 sm:w-[150px] h-[70px] shrink-0 overflow-visible"
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      fill="none"
                    >
                      <defs>
                        <linearGradient
                          id="aiGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Gradient Area */}
                      <path
                        d={analysisAreaPath}
                        fill="url(#aiGrad)"
                      />

                      {/* Smooth Graph Line */}
                      <path
                        d={analysisLinePath}
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Big Numerical Metric */}
                  <div className="font-heading text-6xl sm:text-7xl font-bold text-[#212121] mt-4 tracking-tight leading-none transition-all duration-300">
                    <RollingNumber value={liveMetrics.analysisScore} suffix="%" minDigits={3} />
                  </div>

                  <div className="text-xs sm:text-sm text-[#A1A1AA] font-medium mt-1">
                    communication & speech rating
                  </div>

                  {/* Supporting Description */}
                  <p className="mt-4 p-3.5 rounded-xl bg-[#F5F5F5] border border-white/[0.08] text-xs sm:text-[13px] text-black/80 leading-relaxed font-sans">
                    Detected cadence stalls during complexity defense → auto-generated 3 targeted STAR drills.
                  </p>
                </div>

                <div>
                  {/* Bottom Supporting Metrics */}
                  <div className=" grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase">
                        Accuracy
                      </span>
                      <span className="font-heading font-bold text-base sm:text-2xl text-[#222222] mt-0.5">
                        <RollingNumber value={liveMetrics.techAccuracy} suffix="%" minDigits={3} />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase tracking-wider">
                        Confidence
                      </span>
                      <span className="font-heading font-bold text-base sm:text-2xl text-[#222222] mt-0.5">
                        <RollingNumber value={liveMetrics.confidence} suffix="%" minDigits={3} />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase tracking-wider">
                        Weaknesses
                      </span>
                      <span className="font-heading font-bold text-base sm:text-2xl text-emerald-500 mt-0.5">
                        <RollingNumber value={liveMetrics.weaknesses} suffix=" flagged" minDigits={2} />
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono font-medium text-emerald-500">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Synthesizing vocal pacing drill</span>
                  </div>
                </div>
              </div>


              {/* Card 3: Career Progress */}

              <div className="relative overflow-hidden p-5 bg-white rounded-[12px] border border-black/[0.06] shadow-[0_12px_35px_rgba(0,0,0,0.12)] flex flex-col justify-around h-[400px] min-h-[300px] transition-all">
                <div>
                  {/* Brand Pill + Sparkline Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-3xl text-[#212121]">
                        intervyo
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-black text-white border border-cyan-500/30">
                        Career Progress
                      </span>
                    </div>

                    {/* Cyan Sparkline Chart SVG */}
                    {/* Dynamic Cyan Career Progress Sparkline */}
                    <svg
                      className="absolute right-0 top-[50px] w-28 sm:w-[160px] h-[70px] shrink-0 overflow-visible"
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      fill="none"
                    >
                      <defs>
                        <linearGradient
                          id="careerGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Gradient Area */}
                      <path
                        d={careerAreaPath}
                        fill="url(#careerGrad)"
                      />

                      {/* Smooth Cyan Graph */}
                      <path
                        d={careerLinePath}
                        stroke="#06B6D4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Big Numerical Metric */}
                  <div className="font-heading text-6xl sm:text-7xl font-bold text-[#212121] mt-4 tracking-tight leading-none transition-all duration-300">
                    <RollingNumber value={liveMetrics.offerBump} prefix="+$" suffix="K" minDigits={3} />
                  </div>

                  <div className="text-xs sm:text-sm text-[#A1A1AA] font-medium mt-1">
                    projected offer increase
                  </div>

                  {/* Supporting Description */}
                  <p className="mt-4 p-3.5 rounded-xl bg-[#F5F5F5] border border-white/[0.08] text-xs sm:text-[13px] text-black/80 leading-relaxed font-sans">
                    Promoted to L5 Strong Hire consensus based on Raft consensus defense and concise delivery.
                  </p>
                </div>

                <div>
                  {/* Bottom Supporting Metrics */}
                  <div className="grid grid-cols-3  text-center">
                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase">
                        Skills
                      </span>
                      <span className="font-heading font-bold text-base sm:text-2xl text-[#222222] mt-0.5">
                        <RollingNumber value={liveMetrics.skills} minDigits={2} />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase tracking-wider">
                        Streak
                      </span>
                      <span className="font-heading font-bold text-base sm:text-2xl text-[#222222] mt-0.5">
                        <RollingNumber value={liveMetrics.streak} suffix="d" minDigits={2} />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[13px] text-[#A1A1AA] block font-mono uppercase tracking-wider">
                        Readiness
                      </span>
                      <span className="font-heading font-bold text-base sm:text-2xl text-cyan-500 mt-0.5">
                        <RollingNumber value={liveMetrics.readiness} suffix="th" minDigits={3} />
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono font-medium text-cyan-500">
                    <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Calibrating L6 Bar Raiser</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── SECTION 3: ACTIVITY / AI INTELLIGENCE FEED (SECONDARY SECTION BACKGROUND #171824) ── */}
        <div className="relative rounded-[28px] sm:rounded-[12px] bg-[#FFFA64] border border-white/[0.12] p-8 sm:p-14 lg:p-20 pt-30 sm:pt-30 overflow-hidden text-white shadow-2xl">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:h-[350px] bg-purple-600/10 blur-3xl pointer-events-none" />

          {/* Top-Left Editorial Heading */}
          <h2 className="mt-16 font-heading font-bold uppercase text-6xl sm:text-8xl md:text-[108px] text-black leading-none relative z-10">
            AN AI
          </h2>

          {/* Central Area with 3D Floating Real Studio Microphone & Activity Intelligence Feed */}
          <div className="relative my-8 sm:my-14 flex items-center justify-center">
            {/* Real Studio Microphone Visual Floating in Place of the Balloon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-80 aspect-square z-0 pointer-events-none select-none opacity-40 flex items-center justify-center">
              <img
                src={ASSETS.micImage}
                alt="Studio Microphone"
                className="w-full h-full object-contain animate-mic-float drop-shadow-[0_10px_45px_rgba(139,92,246,0.4)]"
              />
            </div>

            {/* Silky-Smooth GPU Activity Stream (Zero-Lag, 1-by-1 Flow, Full Text Shown) */}
            <div
              className="w-full max-w-xl sm:max-w-2xl h-[400px] sm:h-[455px] overflow-hidden relative z-10 py-1"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="flex flex-col gap-3.5 will-change-transform"
                style={{
                  transform: isAnimating ? "translateY(-142px)" : "translateY(0px)",
                  transition: isAnimating ? "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                }}
              >
                {[0, 1, 2, 3].map((offset) => {
                  const cardIndex = (feedIndex + offset) % OVERNIGHT_FEED.length;
                  const card = OVERNIGHT_FEED[cardIndex];
                  const isExiting = isAnimating && offset === 0;
                  const isEntering = isAnimating && offset === 3;

                  return (
                    <div
                      key={`${feedIndex}-${offset}`}
                      style={{
                        opacity: isExiting ? 0 : isEntering ? 1 : 1,
                        transform: isExiting ? "scale(0.96)" : isEntering ? "scale(1)" : "scale(1)",
                        transition: isAnimating
                          ? "opacity 550ms ease, transform 650ms cubic-bezier(0.16, 1, 0.3, 1)"
                          : "none",
                      }}
                      className="h-[138px] p-10 sm:p-5 rounded-[12px] bg-white hover:border-violet-500/40 transition-colors select-none flex flex-col justify-between shrink-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono font-bold text-zinc-400">{card.time}</span>
                        <span
                          className={`text-[11px] font-semibold px-3 py-0.5 rounded-full border ${card.tagColor || "bg-violet-500/20 text-black border-violet-500/30"
                            }`}
                        >
                          {card.tag}
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white leading-snug">
                        <span className="text-black font-bold mr-1.5">{card.agent}</span>
                        <span>{card.action}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-black/60 leading-relaxed font-sans">
                        {card.detail}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom-Right Editorial Heading */}
          <h2 className="font-heading font-bold uppercase text-5xl sm:text-7xl md:text-[96px] text-black leading-none text-right relative z-10">
            THAT NEVER STOPS IMPROVING YOU.
          </h2>
        </div>
      </section>

      {/* ── 6. INTERVYO BOOKS (EXACT REPLICA: LIGHT BLUE CONTAINER, ASYMMETRIC HEADER, TWO-TONE HORIZONTAL CARDS) ── */}
      <section id="playbooks" className="py-12 sm:py-16 px-4 sm:px-6 max-w-[10/12] mx-auto">
        <div className="relative  rounded-[12px] bg-[#C3DBFF] p-8 sm:p-12 lg:p-16 shadow-xl overflow-hidden text-black">
          {/* Header Row: Left-aligned bold headline, Right-aligned paragraph + black arrow buttons */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-12 relative z-10">
            <div className="max-w-2xl">
              <h2 className="font-heading font-bold uppercase leading-[0.88] text-5xl sm:text-7xl md:text-8xl lg:text-[90px] text-black tracking-tight select-none">
                <span>EXPERT STRATEGIES,</span>
                <br />
                <span className="flex items-center flex-wrap gap-2 sm:gap-3 mt-1.5">
                  <span>DEPLOYED</span>
                  {/* Floating Microphone in place of flower/balloon icon */}
                  <span className="inline-block relative w-12 sm:w-16 lg:w-20 h-10 sm:h-14 lg:h-16 align-middle mx-1 sm:mx-2 select-none shrink-0">
                    <img
                      src={ASSETS.micImage}
                      alt="Intervyo Icon"
                      className="w-full h-full object-contain animate-mic-float drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                    />
                  </span>
                  <span>FOR YOU.</span>
                </span>
              </h2>
            </div>

            {/* Right Column: Paragraph + Solid Black Navigation Buttons */}
            <div className="max-w-md flex flex-col items-start lg:items-start lg:pb-2">
              <p className="text-black/80 font-normal text-xs sm:text-sm leading-relaxed">
                IntervyoBooks are pre-built interview workflows executed by specialized agents. Run them on a schedule, trigger them from an event, or let Intervyo decide.
              </p>

              {/* Two Solid Black Circular Buttons with White Arrows */}
              <div className="flex items-center gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => scrollPlaybooks("left")}
                  aria-label="Scroll Left"
                  className="size-8 sm:size-9 rounded-full bg-black hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollPlaybooks("right")}
                  aria-label="Scroll Right"
                  className="size-8 sm:size-9 rounded-full bg-black hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontally Scrollable Two-Tone Cards Row */}
          <div
            ref={playbooksScrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1 select-none relative z-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {INTERVYO_BOOKS.map((book, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/interview-setup?role=${encodeURIComponent(book.title)}`)}
                className="w-[275px] sm:w-[310px] shrink-0 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col bg-white border border-black/5"
              >
                {/* Top Zone: Light Ice Blue Header with intervyo Logo + Large Title */}
                <div className="p-6 bg-[#D7E9FE] flex flex-col justify-between h-[210px] rounded-t-[20px]">
                  <span className="font-heading font-bold text-2xl tracking-tight text-black">
                    intervyo
                  </span>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-black leading-tight line-clamp-3">
                    {book.title}
                  </h3>
                </div>

                {/* Bottom Zone: Pure White Surface with Author + Description */}
                <div className="p-6 bg-white rounded-b-[20px] flex flex-col justify-between min-h-[165px] grow">
                  <div className="flex items-center gap-2">
                    <img
                      src={book.avatar}
                      alt={book.author}
                      className="size-6 rounded-full object-cover shrink-0"
                    />
                    <span className="text-xs font-semibold text-black/85">
                      by {book.author}
                    </span>
                  </div>
                  <p className="text-xs text-black/65 leading-relaxed font-sans line-clamp-4 mt-3">
                    {book.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ONE PLATFORM THREE ENGINES (DARK MODE) ── */}
      <section id="engines" className="py-12 sm:py-16 px-4 sm:px-6 max-w-[97%] mx-auto bg-[#131722] rounded-[12px] ">
        <div className="max-w-2xl mb-16 relative">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Unified Architecture
          </span>
          <h2 className="font-heading font-bold uppercase leading-[0.86] text-5xl sm:text-7xl text-white mt-2">
            One platform three engines.
          </h2>
        </div>

        {/* Intervyo Features Card */}
        <div className="md:w-[80%]  mx-auto bg-white rounded-[5px] border border-black/[0.04] px-5 py-6 md:px-[22px] md:py-[22px]">

          <div className="grid grid-cols-1 md:grid-cols-3">

            {/* VOICE */}
            <div className="space-y-5 md:pr-6 md:border-r md:border-black/[0.12]">

              {/* Brand + Pill */}
              <div className="flex items-center gap-2">
                <span className="font-heading text-[32px] font-extrabold tracking-tight text-[#212121] leading-none">
                  intervyo
                </span>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black text-fuchsia-400">
                  Voice
                </span>
              </div>

              {/* Heading */}
              <div className="text-base font-semibold text-[#171717]">
                Build. Converse. Clarify.
              </div>

              {/* Features */}
              <ul className="space-y-4 text-sm text-[#777777]">

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-fuchsia-400 mt-[8px] shrink-0" />
                  Sub-150ms bidirectional speech streaming
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-fuchsia-400 mt-[8px] shrink-0" />
                  Natural conversational interruptions
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-fuchsia-400 mt-[8px] shrink-0" />
                  Tone, inflection, and cadence analysis
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-fuchsia-400 mt-[8px] shrink-0" />
                  Real-time filler word detection
                </li>

              </ul>
            </div>


            {/* CODE */}
            <div className="space-y-5 pt-8 mt-8 border-t border-black/[0.12] md:pt-0 md:mt-0 md:px-6 md:border-t-0 md:border-r">

              {/* Brand + Pill */}
              <div className="flex items-center gap-2">
                <span className="font-heading text-[32px] font-extrabold tracking-tight text-[#212121] leading-none">
                  intervyo
                </span>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black text-lime-400">
                  Code
                </span>
              </div>

              {/* Heading */}
              <div className="text-base font-semibold text-[#171717]">
                Compile. Fuzz. Optimize.
              </div>

              {/* Features */}
              <ul className="space-y-4 text-sm text-[#777777]">

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-lime-400 mt-[8px] shrink-0" />
                  Isolated WebAssembly compiler
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-lime-400 mt-[8px] shrink-0" />
                  Support for 20+ languages
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-lime-400 mt-[8px] shrink-0" />
                  Real-time AST Big-O cyclomatic audit
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-lime-400 mt-[8px] shrink-0" />
                  Hidden boundary test case injection
                </li>

              </ul>
            </div>


            {/* TELEMETRY */}
            <div className="space-y-5 pt-8 mt-8 border-t border-black/[0.12] md:pt-0 md:mt-0 md:pl-6 md:border-t-0">

              {/* Brand + Pill */}
              <div className="flex items-center gap-2">
                <span className="font-heading text-[32px] font-extrabold tracking-tight text-[#212121] leading-none">
                  intervyo
                </span>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black text-cyan-400">
                  AI
                </span>
              </div>

              {/* Heading */}
              <div className="text-base font-semibold text-[#171717]">
                Evaluate. Benchmark. Win.
              </div>

              {/* Features */}
              <ul className="space-y-4 text-sm text-[#777777]">

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-cyan-400 mt-[8px] shrink-0" />
                  Official FAANG hiring committee rubrics
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-cyan-400 mt-[8px] shrink-0" />
                  Level calibration from L3 to Staff L6+
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-cyan-400 mt-[8px] shrink-0" />
                  STAR behavioral scoring matrix
                </li>

                <li className="flex items-start gap-3">
                  <span className="size-[4px] rounded-full bg-cyan-400 mt-[8px] shrink-0" />
                  Line-by-line transcript recommendations
                </li>

              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. SEAMLESS ONBOARDING / MIGRATIONS SECTION (LIME ACCENT CONTAINER) ── */}
      <section id="migrations" className="py-9 px-4 sm:px-6 max-w-[10/12] mx-auto">
        <div className="relative w-full rounded-[12px] sm:rounded-[12px] bg-[#D1F48C] text-[#0A0D12] p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl">
          {/* Top Row: Badge + Massive Title Block */}
          <div className="w-full flex flex-col lg:flex-row items-start justify-around gap-20 mb-16 sm:mb-20">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-black text-[#D1F48C] font-mono font-bold text-xs tracking-wider uppercase shadow-sm">
                Onboarding
              </span>
            </div>

            <div className="max-w-3xl lg:mr-auto lg:ml-12">
              <h2 className="font-heading font-bold uppercase sm:leading-[10px] md:leading-[68px] text-5xl sm:text-2xl lg:text-[84px] text-black">
                Bring any background. Intervyo turns it into your growth engine.
              </h2>
              <p className="mt-6 text-sm sm:text-base text-black/85 leading-relaxed font-medium max-w-2xl">
                Junior, Senior, Staff, or Engineering Director. Intervyo maps your current level, calibrates your dream hiring bar, and keeps working with you every day.
              </p>
            </div>
          </div>

          {/* 5-Step Timeline with Connected Horizontal Line */}
          <div className="relative mt-12 sm:mt-16">
            {/* Horizontal Line behind nodes for desktop */}
            <div className="hidden md:block absolute top-[14px] left-4 right-4 h-[1px] bg-black/25 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 relative z-10">
              {[
                {
                  num: "01",
                  title: "Paste your role.",
                  desc: "Intervyo reads any tech stack, resume, or target JD, and maps level expectations from L3 to Staff L6+.",
                },
                {
                  num: "02",
                  title: "Approve the plan.",
                  desc: "Intervyo recommends what to practice and where your gaps are. Nothing changes until you say so.",
                },
                {
                  num: "03",
                  title: "Run live loops.",
                  desc: "Experience real-time voice interruptions, AST code fuzzing, and system design whiteboards.",
                },
                {
                  num: "04",
                  title: "Patch at your pace.",
                  desc: "Autonomous overnight agents synthesize targeted 5-minute drills for hesitation and weak spots.",
                },
                {
                  num: "05",
                  title: "Start winning offers.",
                  desc: "The same rubrics evaluate your performance before you face the real hiring committee.",
                },
              ].map((step) => (
                <div key={step.num} className="flex flex-col">
                  {/* Circle Step Number */}
                  <div className="size-7 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-bold mb-4 shadow-sm">
                    {step.num}
                  </div>
                  {/* Step Title */}
                  <h3 className="font-bold text-base text-black mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  {/* Step Description */}
                  <p className="text-xs sm:text-[13px] text-black/80 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Divider & Success Story */}
          <div className="mt-16 pt-8 border-t border-black/20 text-xs sm:text-sm text-black/85 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          </div>
        </div>
      </section>

      {/* ── 9. WHO'S INTERVYO FOR? (STICKY LEFT + ACCORDION PUNCHCARDS) ── */}
      <section className="py-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          {/* Left Column (Sticky on scroll) */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 self-start">
            <span className="inline-block px-4 py-1.5 rounded-full bg-black border border-white/20 text-white font-semibold text-xs tracking-wide mb-6 shadow-sm">
              Who's Intervyo for?
            </span>
            <h2 className="font-heading font-bold uppercase leading-[0.88] text-5xl sm:text-6xl lg:text-7xl text-white">
              For engineers that ship, measure, and win.
            </h2>
            <p className="mt-6 text-zinc-400 text-base leading-relaxed max-w-md">
              Whether you are defending distributed consensus at L6+ or writing your first recursive backtracking algorithms, Intervyo adapts to your exact career stage.
            </p>
          </div>

          {/* Right Column (Clickable Accordion Punchcards) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {[
              {
                id: "staff",
                title: "Staff+",
                subtitle: "Scale without the fluff.",
                activeBg: "bg-[#C3DBFF] text-black border-transparent",
                activeDot: "bg-white",
                btnText: "Explore Staff+",
                btnAction: "Launch Staff+ Track",
                roleQuery: "Staff Software Engineer",
                bullets: [
                  "Stress test distributed systems under high-concurrency failure modes",
                  "Defend CAP concessions and trade-offs with executive brevity",
                  "Real-time whiteboard topology benchmarks & failure isolation",
                  "L6 and Principal level compensation calibration",
                ],
              },
              {
                id: "seniors",
                title: "Seniors",
                subtitle: "Production-grade craft.",
                activeBg: "bg-[#D1F48C] text-black border-transparent",
                activeDot: "bg-black",
                btnText: "Explore Senior",
                btnAction: "Launch Senior Track",
                roleQuery: "Senior Software Engineer",
                bullets: [
                  "Full AST code fuzzing and stress testing across 20+ languages",
                  "Amazon 16 Leadership Principles & STAR behavioral mastery",
                  "Eliminate verbal hesitation, filler words, and cadence stalls",
                  "Real-time Big Tech hiring committee bar raiser rubrics",
                ],
              },
              {
                id: "grads",
                title: "Grads",
                subtitle: "Growth from day one.",
                activeBg: "bg-[#FFFA64] text-black border-transparent",
                activeDot: "bg-black",
                btnText: "Explore Grads",
                btnAction: "Launch Grads Free",
                roleQuery: "Junior Software Engineer",
                bullets: [
                  "Master algorithmic foundations and data structures without anxiety",
                  "120,000+ completed interview loops to benchmark and learn from",
                  "Personalized overnight micro-drill generation for weak spots",
                  "Startup-friendly credit pricing with unlimited practice loops",
                ],
              },
            ].map((card, idx) => {
              const isActive = activePunchcard === idx;

              return (
                <div
                  key={card.id}
                  onClick={() => setActivePunchcard(isActive ? -1 : idx)}
                  className={`relative rounded-sm p-8 transition-all duration-300 cursor-pointer shadow-lg select-none ${isActive
                    ? card.activeBg
                    : "bg-[#131722] text-white border border-white/10 hover:border-white/25"
                    }`}
                >
                  {/* 4 Corner Punchcard Dots */}
                  <span
                    className={`absolute w-2.5 h-2.5 rounded-full top-3 left-3 transition-colors ${isActive ? card.activeDot : "bg-zinc-600"
                      }`}
                  />
                  <span
                    className={`absolute w-2.5 h-2.5 rounded-full top-3 right-3 transition-colors ${isActive ? card.activeDot : "bg-zinc-600"
                      }`}
                  />
                  <span
                    className={`absolute w-2.5 h-2.5 rounded-full bottom-3 left-3 transition-colors ${isActive ? card.activeDot : "bg-zinc-600"
                      }`}
                  />
                  <span
                    className={`absolute w-2.5 h-2.5 rounded-full bottom-3 right-3 transition-colors ${isActive ? card.activeDot : "bg-zinc-600"
                      }`}
                  />

                  {/* Header Row: Title + Subtitle */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pr-6">
                    <h3 className="font-heading text-5xl sm:text-6xl font-bold uppercase tracking-tight">
                      {card.title}
                    </h3>
                    <span
                      className={`text-sm sm:text-base font-normal ${isActive ? "text-black/80" : "text-zinc-400"
                        }`}
                    >
                      {card.subtitle}
                    </span>
                  </div>

                  {/* Expandable Accordion Body */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8">
                          {/* Bulleted List */}
                          <ul className="space-y-3 text-sm text-black/85 mb-8">
                            {card.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2.5">
                                <span className="font-bold select-none text-base leading-tight">•</span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Action Buttons */}
                          <div
                            className="flex flex-wrap items-center gap-5 pt-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/interview-setup?role=${encodeURIComponent(card.roleQuery)}`)
                              }
                              className="px-6 py-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-md"
                            >
                              {card.btnAction}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/interview-setup?role=${encodeURIComponent(card.roleQuery)}`)
                              }
                              className="text-xs font-semibold text-black underline underline-offset-4 hover:text-black/70 transition-colors"
                            >
                              {card.btnText}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 10. PRE-FOOTER CTA (THE 60-SECOND SLURP - DARK MODE) ── */}
      <section className="py-24 px-4 sm:px-6 max-w-[1400px] mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold uppercase leading-[0.86] text-5xl sm:text-7xl md:text-8xl text-white">
            Stop guessing your interview readiness.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto">
            Plug in your dream role and run a full autonomous mock session in 60 seconds.
          </p>

          <form
            onSubmit={handleStartDrill}
            className="mt-10 max-w-xl mx-auto p-2 bg-[#131722] rounded-2xl sm:rounded-full border border-white/15 shadow-xl flex flex-col items-stretch sm:flex-row sm:items-center gap-2 sm:gap-3"
          >
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. Senior Backend Engineer at Stripe..."
              className="w-full min-w-0 px-4 py-2 text-sm bg-transparent outline-none text-white placeholder-zinc-500 font-medium sm:flex-1 sm:px-5"
            />
            <button
              type="submit"
              className="w-full justify-center px-4 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-[#0A0D12] font-semibold text-sm transition-all shadow-md flex items-center gap-2 sm:w-auto sm:px-8 sm:shrink-0"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 text-xs font-mono text-zinc-500">
            Free tier · No credit card required · 60-second setup
          </div>
        </div>
      </section>

      {/* ── 11. "WANT THE SHORT VERSION? ASK AI" (DARK MODE) ── */}
      <section className="py-16 border-t border-white/10 bg-[#0E121A]/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h4 className="font-heading text-4xl font-bold text-white">
              Want the short version?
            </h4>
            <p className="text-xs text-zinc-400 max-w-xl mt-1">
              Ask AI for a summary of Intervyo, comparable mock platforms, and the value of running your interview prep on autonomous voice and AST feedback.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["ChatGPT", "Claude", "Google AI Mode", "Grok", "Perplexity"].map((ai) => (
              <a
                key={ai}
                href={`https://www.google.com/search?q=${encodeURIComponent(ai + " Intervyo AI mock interview platform review")}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-[#131722] hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
              >
                {ai} ↗
              </a>
            ))}
          </div>
        </div>
      </section>



      {/* ── 13. FOOTER ── */}
      <Footer />

      {/* ── VIDEO MODAL ── */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/NONVS2IoDQE?autoplay=1"
                title="Intervyo Platform Tour"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
