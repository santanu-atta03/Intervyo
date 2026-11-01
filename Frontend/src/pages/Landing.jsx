import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import SEO from "../components/shared/SEO";
import LaptopScrollStage from "../components/Landing/LaptopScrollStage";

// ─── Shared animation variants ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Animated counter hook ───────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", prefix = "", decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useState(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const duration = 1800;
    const step = 16;
    const increment = end / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  });

  return (
    <span ref={ref}>
      {prefix}{isInView ? count.toFixed(decimals) : 0}{suffix}
    </span>
  );
}

// Curated high-resolution editorial photography (Studio dark hardware & tech imagery)
const IMAGES = {
  heroStage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1800&q=85",
  voiceEngine: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1400&q=85",
  codeSandbox: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=85",
  systemArch: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85",
  candidateStudio: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85",
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState("pro");
  const [openFaq, setOpenFaq] = useState(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const heroText = gsap.utils.toArray(".hero-reveal");
      gsap.from(heroText, {
        y: 42,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: Ease,
      });

      gsap.from(".hero-image", {
        scale: 1.08,
        opacity: 0,
        duration: 1.15,
        ease: Ease,
      });

      gsap.to(".hero-image", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      const localSteps = gsap.utils.toArray(".timeline-step");
      if (pinRef.current && localSteps.length > 0) {
        ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              localSteps.length - 1,
              Math.floor(self.progress * localSteps.length)
            );
            setStepIndex(idx);
          },
        });

        gsap.from(localSteps, {
          opacity: 0,
          y: 32,
          stagger: 0.2,
          duration: 0.9,
          ease: Ease,
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top 60%",
          },
        });
      }

      if (horizontalRef.current && trackRef.current) {
        const cards = gsap.utils.toArray(".story-card");
        if (cards.length > 1) {
          gsap.to(trackRef.current, {
            xPercent: -100 * (cards.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: horizontalRef.current,
              start: "top top",
              end: () => `+=${cards.length * 420}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });
        }
      }

      gsap.from(".fade-up", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: Ease,
        scrollTrigger: {
          trigger: ".fade-up-wrap",
          start: "top 70%",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const currentStep = steps[stepIndex] || steps[0];

  const highlights = [
    {
      title: "Conversational Voice Engine.",
      subtitle: "Zero-latency acoustic turn-taking.",
      desc: "An ultra-low latency (<180ms) bidirectional audio pipeline that simulates real interviewer pressure. It listens, interrupts when arguments falter, and probes deeper into architectural trade-offs.",
      image: IMAGES.voiceEngine,
      tag: "Neural Speech Architecture",
    },
    {
      title: "Real-time AST Code Compiler.",
      subtitle: "Instant edge-case & complexity analysis.",
      desc: "Execute code across 20+ programming languages inside a hermetically isolated WebAssembly container. Evaluates cyclomatic complexity O(n), memory allocation ceilings, and hidden boundary conditions.",
      image: IMAGES.codeSandbox,
      tag: "Execution Sandbox",
    },
    {
      title: "Distributed System Whiteboard.",
      subtitle: "Architectures measured at scale.",
      desc: "Simulate multi-region fault tolerance, distributed cache synchronization, and CAP theorem trade-offs. Calibrated directly to the rubric sheets used by Big Tech hiring committees.",
      image: IMAGES.systemArch,
      tag: "System Modeling",
    },
  ];

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroScroll, [0, 1], [0, -60]);
  const heroTextOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroImageY = useTransform(heroScroll, [0, 1], [0, 50]);
  const heroImageSpring = useSpring(heroImageY, { stiffness: 50, damping: 18 });

  return (
    <div className="apple-root bg-[#000000] text-[#f5f5f7] selection:bg-[#0071e3] selection:text-white antialiased font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif]">
      <SEO
        title="Intervyo Pro | The Midnight Hardware Gallery for AI Interview Mastery"
        description="Master tech interviews on an exhibition-grade black stage. Sub-180ms voice simulation, live AST code execution, and Big Tech rubric telemetry on Intervyo."
        canonical="/"
      />

      {/* Apple Design Tokens & Micro Styles */}
      <style>{`
        :root {
          --color-obsidian: #000000;
          --color-graphite: #0e0e0e;
          --color-carbon: #1d1d1f;
          --color-steel: #333336;
          --color-slate: #6e6e73;
          --color-ash: #86868b;
          --color-porcelain: #f5f5f7;
          --color-white: #ffffff;
          --color-apple-blue: #0071e3;
          --color-electric-link: #2997ff;
          --color-cobalt-link: #0066cc;
          --color-copper-new: #b64400;
          --color-optical-yellow: #ffd500;
        }

        /* Apple SF Pro Display Typography with compact negative tracking */
        .apple-display-xl {
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 600;
          line-height: 1.04;
          letter-spacing: -1.44px;
        }

        .apple-display {
          font-size: clamp(40px, 6vw, 80px);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -1.2px;
        }

        .apple-display-md {
          font-size: clamp(32px, 4.5vw, 56px);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.84px;
        }

        .apple-product-name {
          font-size: 32px;
          font-weight: 600;
          line-height: 1.13;
          letter-spacing: 0.128px;
        }

        .apple-product-label {
          font-size: 19px;
          font-weight: 600;
          line-height: 1.21;
          letter-spacing: 0.228px;
        }

        .apple-feature-stat {
          font-size: 28px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.196px;
        }

        .apple-body {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.29;
          letter-spacing: -0.224px;
        }

        .apple-utility {
          font-size: 12px;
          font-weight: 400;
          line-height: 1.33;
          letter-spacing: -0.12px;
        }

        /* Apple Blue Buy Pill (170px radius) */
        .apple-btn-buy {
          background-color: var(--color-apple-blue);
          color: #ffffff;
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          letter-spacing: -0.12px;
          border-radius: 170px;
          padding: 8px 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          text-decoration: none;
        }
        .apple-btn-buy:hover {
          background-color: #0077ed;
        }
        .apple-btn-buy:active {
          transform: scale(0.98);
        }

        /* Large Action Pill */
        .apple-btn-large {
          background-color: var(--color-apple-blue);
          color: #ffffff;
          font-size: 17px;
          font-weight: 400;
          letter-spacing: -0.374px;
          border-radius: 9999px;
          padding: 12px 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.15s ease;
          text-decoration: none;
        }
        .apple-btn-large:hover {
          background-color: #0077ed;
        }
        .apple-btn-large:active {
          transform: scale(0.98);
        }

        /* Outlined Explore Pill (9999px radius) */
        .apple-btn-outline {
          background-color: transparent;
          color: var(--color-porcelain);
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          letter-spacing: -0.12px;
          border-radius: 9999px;
          padding: 7px 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-slate);
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
          text-decoration: none;
        }
        .apple-btn-outline:hover {
          border-color: var(--color-porcelain);
          background-color: rgba(255, 255, 255, 0.06);
        }

        /* Dark Pricing Capsule */
        .apple-pricing-capsule {
          background-color: rgba(66, 66, 69, 0.72);
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 400;
          border-radius: 36px;
          padding: 8px 16px;
          display: inline-flex;
          align-items: center;
          letter-spacing: -0.12px;
        }

        /* Electric Link */
        .apple-electric-link {
          color: var(--color-electric-link);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: -0.224px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .apple-electric-link:hover {
          text-decoration: underline;
        }

        /* 28px Geometry Cards */
        .apple-card-28 {
          border-radius: 28px;
        }

        /* Subtle shadow keyline */
        .apple-keyline {
          box-shadow: rgb(40, 40, 40) 0px 0px 0px 1px;
        }
      `}</style>

      {/* =========================================================================
          1. GLOBAL UTILITY NAVIGATION (44px height, #000000, 12px/400 SF Pro Text)
      ========================================================================= */}
      <div className="h-11 bg-[#000000] border-b border-[#1d1d1f] flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-[1024px] mx-auto w-full flex items-center justify-between text-[12px] text-[rgba(255,255,255,0.8)] tracking-[-0.12px]">
          
          {/* Logo / Glyph */}
          <Link to="/" className="flex items-center gap-2 text-white font-semibold text-[14px] no-underline">
            <span className="w-4 h-4 rounded-full bg-[#f5f5f7] inline-block flex-shrink-0"></span>
            <span>Intervyo</span>
          </Link>

          {/* Center Utility Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#highlights" className="hover:text-white transition-colors">Highlights</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#compare" className="hover:text-white transition-colors">Compare</a>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-white transition-colors">Methodology</Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="apple-btn-buy">
              Try Free
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. UPGRADE ANNOUNCEMENT STRIP (72px, #1d1d1f Carbon Band)
      ========================================================================= */}
      <section className="bg-[#1d1d1f] border-b border-[#333336] py-3.5 px-4 text-center">
        <div className="max-w-[1024px] mx-auto text-[14px] text-[#f5f5f7] leading-[20px] tracking-[-0.224px]">
          <span>Get 3 full-length AI mock interviews calibrated to Google L5–L7 and Meta E5–E7 hiring bars. </span>
          <Link to="/interview-setup" className="apple-electric-link inline-flex ml-1">
            Configure your session <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          3. PRODUCT SECTION NAVIGATION (Contained #0e0e0e bar, 20px radius, 1px keyline)
      ========================================================================= */}
      <div className="py-4 px-4 sticky top-11 z-40 pointer-events-none">
        <div className="max-w-[980px] mx-auto bg-[#0e0e0e]/95 backdrop-blur-md rounded-[20px] border border-[#282828] px-6 py-3 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.8)] pointer-events-auto">
          
          <div className="flex items-center gap-3">
            <span className="text-[19px] font-semibold text-[#f5f5f7] tracking-[0.228px]">
              Intervyo Pro
            </span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6 text-[14px] text-[#86868b]">
              <a href="#overview" className="hover:text-[#f5f5f7] transition-colors">Overview</a>
              <a href="#highlights" className="hover:text-[#f5f5f7] transition-colors">Tech Specs</a>
              <a href="#compare" className="hover:text-[#f5f5f7] transition-colors">Compare</a>
            </nav>
            <button
              onClick={() => navigate("/interview-setup")}
              className="apple-btn-buy"
            >
              Start Free
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. HERO PRODUCT STAGE — with parallax scroll
      ========================================================================= */}
      <section
        id="overview"
        ref={heroRef}
        className="bg-[#000000] pt-12 pb-24 px-6 text-center relative overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">

          {/* Hero copy — parallax upward on scroll */}
          <motion.div
            style={{ y: heroTextY, opacity: heroTextOpacity }}
            className="flex flex-col items-center"
          >
            {/* Status badge */}
            <motion.div
              className="text-[#b64400] text-[12px] font-semibold tracking-[-0.12px] mb-3 uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              New • Winter 2026 Release
            </motion.div>

            {/* Product name */}
            <motion.h2
              className="apple-product-name text-[#f5f5f7] mb-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              Intervyo Pro
            </motion.h2>

            {/* Headline */}
            <motion.h1
              className="apple-display text-[#f5f5f7] max-w-4xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Engineered for the final round.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-[17px] sm:text-[20px] font-normal text-[#86868b] max-w-2xl leading-[1.4] tracking-[-0.374px] mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              The world's first autonomous AI interview gallery. Real-time acoustic voice turn-taking, isolated AST code compilation, and Big Tech rubric telemetry.
            </motion.p>

            {/* CTA cluster */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="apple-pricing-capsule">From $0/mo. or free trial</div>
              <button
                onClick={() => navigate("/register")}
                className="apple-btn-buy text-[13px] py-2 px-5"
              >
                Start Practicing Free
              </button>
              <a href="#highlights" className="apple-btn-outline text-[13px] py-2 px-5">
                Explore Highlights ↓
              </a>
            </motion.div>
          </motion.div>

          {/* Hero image — parallax slower than text */}
          <motion.div
            className="w-full max-w-[1100px] aspect-[16/9] bg-[#0e0e0e] rounded-[28px] border border-[#333336] overflow-hidden relative shadow-[0_0_80px_rgba(0,113,227,0.08)]"
            style={{ y: heroImageSpring }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={IMAGES.heroStage}
              alt="Intervyo Pro Exhibition Stage"
              className="w-full h-full object-cover object-center filter contrast-110 brightness-95"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-left">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <span className="text-[11px] font-semibold text-[#ffd500] uppercase tracking-[1px] block mb-1">
                  Active Exhibition Chamber
                </span>
                <h3 className="text-[22px] sm:text-[26px] font-semibold text-[#f5f5f7] tracking-tight">
                  Distributed System Telemetry • Meta E6
                </h3>
                <p className="text-[13px] text-[#86868b] mt-1 max-w-lg">
                  Sub-180ms conversational turn-taking actively probing sharded database failovers.
                </p>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 bg-[#1d1d1f]/90 border border-[#333336] rounded-full px-4 py-2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-[#2997ff] animate-ping" />
                <span className="text-[12px] text-[#f5f5f7] font-medium">99.4% Calibrated</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          4B. 3D SCROLL-TRIGGERED LAPTOP CHAMBER & PLACEMENT ANIMATION STAGE
      ========================================================================= */}
      <LaptopScrollStage />

      {/* =========================================================================
          5. HIGHLIGHTS MEDIA FRAME
      ========================================================================= */}
      <section id="highlights" className="bg-gradient-to-b from-[#1d1d1f] to-[#000000] py-24 px-6 border-t border-[#333336]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-[1100px] mx-auto"
        >
          
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12"
          >
            <div>
              <h2 className="apple-display-md text-[#f5f5f7]">
                Get the highlights.
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-[#333336]/60 backdrop-blur-md p-1.5 rounded-full border border-[#6e6e73]/40 mt-4 sm:mt-0">
              {highlights.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHighlight(idx)}
                  className={`px-4 py-1.5 text-[12px] rounded-full transition-all ${
                    activeHighlight === idx
                      ? "bg-[#0071e3] text-white font-medium"
                      : "text-[#86868b] hover:text-[#f5f5f7]"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Highlights Contained Media Frame */}
          <motion.div
            variants={staggerItem}
            className="bg-[#000000] border border-[#333336] rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]"
          >
            {/* Text details */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
              <motion.div
                key={activeHighlight}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[12px] font-semibold text-[#2997ff] uppercase tracking-[1px] block mb-2">
                  {highlights[activeHighlight].tag}
                </span>
                <h3 className="text-[28px] sm:text-[34px] font-semibold text-[#f5f5f7] leading-tight mb-2">
                  {highlights[activeHighlight].title}
                </h3>
                <h4 className="text-[18px] font-medium text-[#86868b] mb-6">
                  {highlights[activeHighlight].subtitle}
                </h4>
                <p className="text-[14px] text-[#86868b] leading-[1.5] tracking-[-0.224px]">
                  {highlights[activeHighlight].desc}
                </p>
              </motion.div>

              <div className="pt-8 border-t border-[#1d1d1f]">
                <button
                  onClick={() => navigate("/interview-setup")}
                  className="apple-electric-link text-[14px]"
                >
                  Launch this simulation module <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Visual media with cross-fade */}
            <div className="lg:col-span-7 bg-[#0e0e0e] relative overflow-hidden flex items-center justify-center p-6">
              <motion.img
                key={activeHighlight}
                src={highlights[activeHighlight].image}
                alt={highlights[activeHighlight].title}
                className="w-full h-full object-cover rounded-[20px] filter contrast-105"
                loading="lazy"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-transparent opacity-40" />
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* =========================================================================
          6. FEATURE METRIC TILES (4-up Grid, Obsidian #000000, 28px radius, no shadow)
      ========================================================================= */}
      <section id="capabilities" className="bg-[#000000] py-24 px-6 border-t border-[#1d1d1f]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-[1100px] mx-auto"
        >
          
          <motion.div variants={staggerItem} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[12px] font-semibold text-[#b64400] uppercase tracking-[1px] block mb-2">
              Performance Architecture
            </span>
            <h2 className="apple-display-md text-[#f5f5f7]">
              Engineered with extreme tolerances.
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                accent: "#ffd500",
                label: "Acoustic Engine",
                stat: "<180ms",
                title: "Voice Roundtrip",
                desc: "Real-time neural audio streaming handles sudden interjections and deep follow-ups without latency.",
                footer: "Bidirectional WebRTC",
              },
              {
                accent: "#2997ff",
                label: "Rubric Calibration",
                stat: "99.4%",
                title: "Committee Parity",
                desc: "Calibrated directly against official L4–L7 hiring rubric sheets from Google, Meta, and Apple.",
                footer: "48 Rubric Dimensions",
              },
              {
                accent: "#f5f5f7",
                label: "Execution Sandbox",
                stat: "20+",
                title: "Languages Compiled",
                desc: "Isolated WebAssembly compiler profiles memory ceiling, cyclomatic load, and boundary defense.",
                footer: "Zero Edge-Case Leakage",
              },
              {
                accent: "#ffd500",
                label: "Proven Trajectory",
                stat: "12k+",
                title: "Offers Landed",
                desc: "Engineers verified into tier-1 tech institutions with 2.4x higher interview pass velocity.",
                footer: "87% Conversion Rate",
              },
            ].map((tile, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,113,227,0.12)" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bg-[#0e0e0e] border border-[#333336] rounded-[28px] p-8 flex flex-col justify-between cursor-default"
              >
                <div>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[1px] block mb-4"
                    style={{ color: tile.accent }}
                  >
                    {tile.label}
                  </span>
                  <div className="text-[44px] font-semibold text-[#f5f5f7] tracking-tight leading-none mb-2">
                    {tile.stat}
                  </div>
                  <div className="text-[14px] font-semibold text-[#f5f5f7] mb-2">
                    {tile.title}
                  </div>
                  <p className="text-[13px] text-[#86868b] leading-relaxed">
                    {tile.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#1d1d1f]">
                  <span className="text-[12px] text-[#2997ff]">{tile.footer}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </section>

      {/* =========================================================================
          7. UPGRADE COMPARISON PANEL (Carbon #1d1d1f, 28px corners, Pale White Card)
      ========================================================================= */}
      <section id="compare" className="bg-[#1d1d1f] py-24 px-6 border-t border-[#333336]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-[1100px] mx-auto"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[12px] font-semibold text-[#2997ff] uppercase tracking-[1px] block mb-2">
              Compare Environments
            </span>
            <h2 className="apple-display-md text-[#f5f5f7] mb-4">
              Choose your practice chamber.
            </h2>
            <p className="text-[14px] text-[#86868b]">
              Every tier delivers uncompromised accuracy. Select the depth required for your target engineering bar.
            </p>
          </div>

          {/* Device Selector Input (rgba(255,255,255,0.04), 980px radius, 1px #6e6e73 border) */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/[0.04] border border-[#6e6e73] rounded-[980px] p-1.5 flex items-center gap-2">
              <button
                onClick={() => setSelectedTrack("starter")}
                className={`px-6 py-2 rounded-[980px] text-[13px] transition-all ${
                  selectedTrack === "starter"
                    ? "bg-[#0071e3] text-white font-medium"
                    : "text-[#86868b] hover:text-[#f5f5f7]"
                }`}
              >
                Diagnostic Standard
              </button>
              <button
                onClick={() => setSelectedTrack("pro")}
                className={`px-6 py-2 rounded-[980px] text-[13px] transition-all ${
                  selectedTrack === "pro"
                    ? "bg-[#0071e3] text-white font-medium"
                    : "text-[#86868b] hover:text-[#f5f5f7]"
                }`}
              >
                Intervyo Pro Studio
              </button>
              <button
                onClick={() => setSelectedTrack("enterprise")}
                className={`px-6 py-2 rounded-[980px] text-[13px] transition-all ${
                  selectedTrack === "enterprise"
                    ? "bg-[#0071e3] text-white font-medium"
                    : "text-[#86868b] hover:text-[#f5f5f7]"
                }`}
              >
                Executive Chamber
              </button>
            </div>
          </div>

          {/* 3-Column Comparison Workspace */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tile 1: Obsidian Starter Tile */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-[#000000] border border-[#333336] rounded-[28px] p-8 flex flex-col justify-between"
            >
              <div>
                <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-[1px] block mb-2">
                  Basic Entry
                </span>
                <h3 className="text-[24px] font-semibold text-[#f5f5f7] mb-1">
                  Starter Lab
                </h3>
                <div className="text-[28px] font-semibold text-[#f5f5f7] mb-4">
                  Free
                </div>
                <p className="text-[13px] text-[#86868b] mb-6">
                  Essential algorithmic verification for junior and mid-level roles.
                </p>

                <div className="space-y-3 border-t border-[#1d1d1f] pt-4 text-[13px] text-[#f5f5f7]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2997ff]" /> 3 Mock Sessions / Month
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2997ff]" /> Standard AST Compilation
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2997ff]" /> Text Feedback Summary
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1d1d1f]">
                <button
                  onClick={() => navigate("/register")}
                  className="apple-btn-outline w-full text-center"
                >
                  Get Started
                </button>
              </div>
            </motion.div>

            {/* Tile 2: Obsidian Pro Tile with Apple Blue Accent */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, boxShadow: "0 0 60px rgba(0,113,227,0.25)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-[#000000] border-2 border-[#0071e3] rounded-[28px] p-8 flex flex-col justify-between relative shadow-[0_0_40px_rgba(0,113,227,0.15)]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0071e3] text-white text-[11px] font-semibold uppercase tracking-[1px] px-3 py-0.5 rounded-full">
                Most Popular
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#2997ff] uppercase tracking-[1px] block mb-2">
                  Full Experience
                </span>
                <h3 className="text-[24px] font-semibold text-[#f5f5f7] mb-1">
                  Intervyo Pro
                </h3>
                <div className="text-[28px] font-semibold text-[#f5f5f7] mb-4">
                  $19 <span className="text-[14px] text-[#86868b] font-normal">/ month</span>
                </div>
                <p className="text-[13px] text-[#86868b] mb-6">
                  The complete suite calibrated to Google, Meta, and Apple L5–L7 standards.
                </p>

                <div className="space-y-3 border-t border-[#1d1d1f] pt-4 text-[13px] text-[#f5f5f7]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0071e3]" /> Unlimited Voice AI Simulations
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0071e3]" /> Sub-180ms Neural Interruptions
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0071e3]" /> Distributed System Whiteboard
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0071e3]" /> 48-Dimension Rubric Scoring
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1d1d1f]">
                <button
                  onClick={() => navigate("/register")}
                  className="apple-btn-buy w-full text-center py-2.5"
                >
                  Start 7-Day Free Trial
                </button>
              </div>
            </motion.div>

            {/* Tile 3: White Comparison Card */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-[#ffffff] text-[#1d1d1f] rounded-[28px] p-8 flex flex-col justify-between"
            >
              <div>
                <span className="text-[12px] font-semibold text-[#0066cc] uppercase tracking-[1px] block mb-2">
                  White Comparison Card
                </span>
                <h3 className="text-[24px] font-semibold text-[#1d1d1f] mb-1">
                  Executive Suite
                </h3>
                <div className="text-[28px] font-semibold text-[#1d1d1f] mb-4">
                  $49 <span className="text-[14px] text-[#6e6e73] font-normal">/ month</span>
                </div>
                <p className="text-[13px] text-[#333336] mb-6">
                  For Staff, Principal, and Director-level candidates managing org-scale trade-offs.
                </p>

                <div className="space-y-3 border-t border-[#e5e5e7] pt-4 text-[13px] text-[#1d1d1f]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0066cc]" /> Everything in Pro
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0066cc]" /> 1-on-1 Human Staff Review
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0066cc]" /> Compensation Negotiation Lab
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0066cc]" /> Priority Dedicated Cluster
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e5e5e7]">
                <a
                  href="/contact"
                  className="text-[#0066cc] font-medium text-[13px] flex items-center justify-between no-underline hover:underline"
                >
                  <span>Contact Sales for Enterprise</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

          </motion.div>

        </motion.div>
      </section>

      {/* =========================================================================
          8. TESTIMONIALS / OUTCOMES (Midnight Hardware Plinths)
      ========================================================================= */}
      <section className="bg-[#000000] py-24 px-6 border-t border-[#1d1d1f]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-[1100px] mx-auto"
        >
          
          <motion.div variants={staggerItem} className="mb-16">
            <span className="text-[12px] font-semibold text-[#ffd500] uppercase tracking-[1px] block mb-2">
              Verified Candidate Outlines
            </span>
            <h2 className="apple-display-md text-[#f5f5f7]">
              Real candidates. Authentic offers.
            </h2>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "“The voice interruption engine challenged my database partition assumptions the exact same way my Meta interviewer did. I walked in calm because I had already lived it.”",
                name: "Senior Infrastructure Engineer",
                offer: "Offered Meta E6 • Seattle",
              },
              {
                quote: "“Instead of memorizing LeetCode solutions, Intervyo forced me to narrate time-space trade-offs while writing clean syntax. The rubric feedback is scary accurate.”",
                name: "Staff Software Engineer",
                offer: "Offered Google L6 • Zurich",
              },
              {
                quote: "“The distributed system whiteboard identified three single-points-of-failure in my cache architecture that no human peer had ever flagged. Landed my dream staff role.”",
                name: "Principal Systems Architect",
                offer: "Offered Stripe L5 • San Francisco",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -5, borderColor: "#0071e3" }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="bg-[#0e0e0e] border border-[#333336] rounded-[28px] p-8 flex flex-col justify-between"
              >
                <p className="text-[15px] text-[#f5f5f7] leading-relaxed mb-8">{t.quote}</p>
                <div>
                  <div className="text-[14px] font-semibold text-[#f5f5f7]">{t.name}</div>
                  <div className="text-[12px] text-[#2997ff] mt-0.5">{t.offer}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </section>

      {/* =========================================================================
          9. FREQUENTLY ASKED QUESTIONS (28px Accordion Modules)
      ========================================================================= */}
      <section className="bg-[#0e0e0e] py-24 px-6 border-t border-[#1d1d1f]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[800px] mx-auto"
        >
          
          <div className="text-center mb-16">
            <h2 className="apple-display-md text-[#f5f5f7] mb-3">
              Questions & Answers.
            </h2>
            <p className="text-[14px] text-[#86868b]">
              Everything you need to know about the Intervyo autonomous interview chamber.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the voice AI interruption model work?",
                a: "Intervyo runs a sub-180ms neural speech pipeline. If you make an ungrounded assumption or introduce algorithmic regression, the model politely cuts in with clarifying questions, precisely reflecting real interview pressure.",
              },
              {
                q: "Are the coding challenges executed in a real sandbox?",
                a: "Yes. Every solution executes in an isolated WebAssembly sandbox against hidden test suites, memory constraints, and time complexity benchmarks.",
              },
              {
                q: "Can I use Intervyo for behavioral & leadership rounds?",
                a: "Yes. Our executive behavioral track analyzes STAR responses, vocal cadence, conciseness, and stakeholder management alignment.",
              },
              {
                q: "What tech levels are supported?",
                a: "Calibrated rubrics span L3 (Junior), L4 (Mid-Level), L5 (Senior), L6 (Staff), and L7 (Principal/Director) across engineering domains.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#000000] border border-[#333336] rounded-[20px] p-6 transition-colors hover:border-[#555558]"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-[16px] font-semibold text-[#f5f5f7] group-hover:text-[#2997ff] transition-colors pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 ${
                        openFaq === idx ? "text-[#2997ff]" : "text-[#86868b]"
                      }`}
                    />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-[14px] text-[#86868b] leading-relaxed pt-2 border-t border-[#1d1d1f]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* =========================================================================
          10. CLOSING HERO REVEAL
      ========================================================================= */}
      <section className="bg-[#000000] py-28 px-6 text-center border-t border-[#1d1d1f] relative overflow-hidden">
        {/* Radial glow behind CTA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[600px] h-[300px] rounded-full bg-[#0071e3] blur-[140px] opacity-10"
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-[900px] mx-auto relative z-10"
        >
          <motion.span
            variants={staggerItem}
            className="text-[12px] font-semibold text-[#b64400] uppercase tracking-[1px] block mb-4"
          >
            The Exhibition Closes. Your Career Begins.
          </motion.span>
          <motion.h2 variants={staggerItem} className="apple-display text-[#f5f5f7] mb-6">
            Step onto the stage with total conviction.
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-[17px] text-[#86868b] max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Eliminate interview anxiety through mathematical precision and high-fidelity simulation.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => navigate("/register")}
              className="apple-btn-large"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Practicing Free Now
            </motion.button>
            <Link
              to="/pricing"
              className="apple-btn-outline text-[14px] py-3 px-6"
            >
              View Pricing Tiers
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Apple-Style Dark Footer (Graphite / Charcoal, 4-Column Directory) */}
      <footer className="bg-[#0e0e0e] text-[#86868b] text-[12px] py-16 px-6 border-t border-[#1d1d1f]">
        <div className="max-w-[1024px] mx-auto">
          
          {/* Legal Fine Print */}
          <div className="border-b border-[#1d1d1f] pb-6 mb-8 text-[11px] leading-relaxed space-y-2">
            <p>
              1. Latency measurements benchmarked across US-East and EU-Central cloud clusters running bidirectional WebRTC audio streams with neural speech classification.
            </p>
            <p>
              2. Hiring rubric calibrations are independent models synthesized from publicly disclosed hiring committee standards and are not endorsed by Google LLC, Meta Platforms Inc., or Apple Inc.
            </p>
          </div>

          {/* 4-Column Directory */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-[#f5f5f7] font-semibold text-[12px] mb-3">
                Practice Tracks
              </h4>
              <ul className="space-y-2">
                <li><Link to="/interview-setup" className="hover:text-white transition-colors">Distributed Systems</Link></li>
                <li><Link to="/interview-setup" className="hover:text-white transition-colors">Algorithms & AST</Link></li>
                <li><Link to="/interview-setup" className="hover:text-white transition-colors">Voice Simulation</Link></li>
                <li><Link to="/interview-setup" className="hover:text-white transition-colors">Executive Behavioral</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#f5f5f7] font-semibold text-[12px] mb-3">
                Platform
              </h4>
              <ul className="space-y-2">
                <li><Link to="/practice-lab" className="hover:text-white transition-colors">Interactive Practice Lab</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Telemetry Analytics</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">Candidate Standings</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#f5f5f7] font-semibold text-[12px] mb-3">
                Company
              </h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition-colors">About Intervyo</Link></li>
                <li><Link to="/career" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Engineering</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">Support & FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#f5f5f7] font-semibold text-[12px] mb-3">
                Legal & Privacy
              </h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
                <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright & Country/Region */}
          <div className="border-t border-[#1d1d1f] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
            <div>
              Copyright © {new Date().getFullYear()} Intervyo Inc. All rights reserved. Apple Style Dark Gallery Edition.
            </div>
            <div className="flex items-center gap-4 text-[#86868b]">
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <span>|</span>
              <span className="text-[#f5f5f7]">United States (English)</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}