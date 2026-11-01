import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Terminal,
  Volume2,
  ShieldCheck,
  Building2,
  TrendingUp,
  Cpu,
  Play,
  Pause,
} from "lucide-react";

// ─── Waveform Bar animated component ────────────────────────────────────────
function WaveBar({ height, delay, isActive }) {
  return (
    <motion.span
      className="w-[3px] bg-[#0071e3] rounded-full inline-block"
      animate={
        isActive
          ? {
              scaleY: [1, height / 10, 1, height / 7, 1],
              opacity: [0.6, 1, 0.7, 1, 0.6],
            }
          : { scaleY: 0.3, opacity: 0.3 }
      }
      transition={
        isActive
          ? {
              duration: 1.2,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.4 }
      }
      style={{ height: `${height}px`, transformOrigin: "bottom" }}
    />
  );
}

// ─── Rubric Score Bar ─────────────────────────────────────────────────────────
function RubricBar({ label, value, color = "#0071e3", delay = 0, animate }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-[#f5f5f7] mb-1">
        <span>{label}</span>
        <motion.span
          className="font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.4 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="w-full h-1 bg-[#22242a] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={animate ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Typing cursor for code lines ────────────────────────────────────────────
function CodeLine({ children, delay, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LaptopScrollStage() {
  const containerRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0=closed, 1=opening, 2=simulation, 3=placed

  // ── Scroll tracking ────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring for a natural feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.0005,
  });

  // Track phase transitions
  useMotionValueEvent(smoothProgress, "change", (val) => {
    if (val < 0.15) setPhase(0);
    else if (val < 0.38) setPhase(1);
    else if (val < 0.65) setPhase(2);
    else setPhase(3);
  });

  // ── Lid angle: -72deg (closed) → -2deg (open) ─────────────────────────────
  const lidRotation = useTransform(smoothProgress, [0, 0.45], [-72, -2]);
  const lidSpring = useSpring(lidRotation, { stiffness: 80, damping: 22 });

  // ── Laptop scale: grow as it opens ────────────────────────────────────────
  const laptopScale = useTransform(smoothProgress, [0, 0.5], [0.82, 1.06]);
  const laptopScaleSpring = useSpring(laptopScale, {
    stiffness: 70,
    damping: 20,
  });

  // ── Y lift ─────────────────────────────────────────────────────────────────
  const laptopY = useTransform(smoothProgress, [0, 0.5], [20, -8]);
  const laptopYSpring = useSpring(laptopY, { stiffness: 70, damping: 22 });

  // ── Screen brightness ──────────────────────────────────────────────────────
  const screenOpacity = useTransform(smoothProgress, [0.12, 0.38], [0, 1]);
  const screenOpacitySpring = useSpring(screenOpacity, {
    stiffness: 90,
    damping: 24,
  });

  // ── Blue glow intensity ────────────────────────────────────────────────────
  const glowOpacity = useTransform(smoothProgress, [0.25, 0.55], [0, 0.4]);

  // ── Ambient background glow behind laptop ─────────────────────────────────
  const bgGlowScale = useTransform(smoothProgress, [0.1, 0.6], [0.6, 1.2]);

  // ── Section header parallax ────────────────────────────────────────────────
  const headerY = useTransform(smoothProgress, [0, 0.3], [0, -30]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.08, 0.35], [1, 1, 0]);

  // ── Phase indicator label ──────────────────────────────────────────────────
  const phaseLabels = [
    "Scroll to open the chamber ↓",
    "Powering up simulation…",
    "Interview in progress",
    "🎉 Offer Extended — Strong Hire",
  ];

  const phaseColors = ["#86868b", "#ffd500", "#2997ff", "#22c55e"];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#000000] text-[#f5f5f7] border-t border-b border-[#1d1d1f]"
      style={{ minHeight: "260vh" }}
    >
      {/* ── Sticky viewport ──────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between py-6 px-4 overflow-hidden">

        {/* ── Ambient radial glow ──────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 65%, rgba(0,113,227,0.12) 0%, transparent 70%)",
            scale: bgGlowScale,
            opacity: glowOpacity,
          }}
        />

        {/* ── Section Header (parallax out on scroll) ───────────────────── */}
        <motion.div
          className="text-center z-20 max-w-2xl px-4 flex-shrink-0"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1f] border border-[#333336] mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffd500]" />
            <span className="text-[11px] font-semibold text-[#f5f5f7] uppercase tracking-[1.5px]">
              Interactive Demo — Scroll to Reveal
            </span>
          </motion.div>

          <motion.h2
            className="text-[28px] sm:text-[40px] font-semibold text-[#f5f5f7] tracking-[-0.84px] leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            From first prompt to signed offer.
          </motion.h2>
          <motion.p
            className="text-[13px] sm:text-[15px] text-[#86868b] tracking-[-0.224px] mt-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Scroll down to unfold the simulation chamber
          </motion.p>
        </motion.div>

        {/* ── 3D Laptop Stage ───────────────────────────────────────────── */}
        <div
          className="relative w-full max-w-[900px] flex-1 flex items-center justify-center"
          style={{ perspective: "1600px" }}
        >
          {/* Blue glow halo behind laptop */}
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{ opacity: glowOpacity }}
          >
            <div className="w-[500px] h-[200px] bg-[#0071e3] rounded-full blur-[120px] opacity-30" />
          </motion.div>

          {/* Laptop wrapper — scale + Y float */}
          <motion.div
            className="relative w-full max-w-[780px] aspect-[16/10] flex flex-col items-center"
            style={{
              scale: laptopScaleSpring,
              y: laptopYSpring,
              transformStyle: "preserve-3d",
            }}
          >
            {/* ─── LID / SCREEN ──────────────────────────────────────────── */}
            <motion.div
              className="relative w-full h-[86%] rounded-t-[20px] rounded-b-[4px] p-[10px] border-2 border-[#2a2a2e] origin-bottom"
              style={{
                rotateX: lidSpring,
                transformStyle: "preserve-3d",
                background: "linear-gradient(160deg, #1c1c1e 0%, #111113 100%)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.95)",
              }}
            >
              {/* Webcam pill */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-[10px] bg-[#141416] rounded-b-md flex items-center justify-center gap-1.5 z-30">
                <div className="w-[5px] h-[5px] rounded-full bg-[#0e0e0e] border border-[#333336]" />
                <motion.div
                  className="w-[5px] h-[5px] rounded-full"
                  animate={
                    phase >= 2
                      ? { backgroundColor: "#22c55e", scale: [1, 1.3, 1] }
                      : { backgroundColor: "#333336", scale: 1 }
                  }
                  transition={
                    phase >= 2
                      ? { duration: 1.5, repeat: Infinity }
                      : { duration: 0.3 }
                  }
                />
              </div>

              {/* Screen Glass */}
              <motion.div
                className="relative w-full h-full bg-[#000000] rounded-[14px] overflow-hidden border border-[#282828] flex flex-col"
                style={{ opacity: screenOpacitySpring }}
              >
                {/* Glossy sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none z-20" />

                {/* macOS-style topbar */}
                <div className="h-7 bg-[#141416] border-b border-[#282828] px-3 flex items-center justify-between flex-shrink-0 z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[10px] font-medium text-[#86868b] tracking-wider flex items-center gap-1.5">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"
                      animate={
                        phase >= 2
                          ? { opacity: [1, 0.3, 1] }
                          : { opacity: 0.4 }
                      }
                      transition={
                        phase >= 2
                          ? { duration: 1.2, repeat: Infinity }
                          : {}
                      }
                    />
                    Intervyo Simulation Room · Session #8429
                  </div>
                  <div className="text-[10px] text-[#86868b]">Meta E6 Bar</div>
                </div>

                {/* Main screen content */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col bg-[#090a0c] overflow-hidden relative">

                  {/* ── PHASE 1–2: Code + Rubric panel ─────────────────── */}
                  <div className="grid grid-cols-12 gap-3 h-full">

                    {/* Code workspace */}
                    <div className="col-span-8 bg-[#111215] rounded-[10px] p-3 border border-[#22242a] flex flex-col justify-between overflow-hidden">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#86868b] border-b border-[#22242a] pb-2 mb-2">
                          <span className="flex items-center gap-1 text-[#f5f5f7] font-mono">
                            <Terminal className="w-3 h-3 text-[#2997ff]" />
                            consensus_raft_leader.go
                          </span>
                          <motion.span
                            className="text-[#22c55e]"
                            animate={
                              phase >= 2
                                ? { opacity: 1 }
                                : { opacity: 0 }
                            }
                            transition={{ duration: 0.4 }}
                          >
                            ✓ Passed 12/12 tests
                          </motion.span>
                        </div>

                        {/* Animated code lines */}
                        <div className="font-mono text-[9px] sm:text-[10px] space-y-[5px] leading-relaxed">
                          <CodeLine delay={0} visible={phase >= 1}>
                            <span className="text-[#f5f5f7]">
                              <span className="text-[#2997ff]">func</span>{" "}
                              (s *RaftCluster){" "}
                              <span className="text-[#ffd500]">
                                HandlePartitionRecovery
                              </span>
                              (term uint64) error &#123;
                            </span>
                          </CodeLine>
                          <CodeLine delay={0.12} visible={phase >= 1}>
                            <span className="pl-3 text-[#86868b]">
                              // High-availability election quorum barrier
                            </span>
                          </CodeLine>
                          <CodeLine delay={0.22} visible={phase >= 2}>
                            <span className="pl-3 text-[#f5f5f7]">
                              <span className="text-[#2997ff]">if</span>{" "}
                              s.currentTerm &lt; term &#123;
                            </span>
                          </CodeLine>
                          <CodeLine delay={0.32} visible={phase >= 2}>
                            <span className="pl-6 text-[#f5f5f7]">
                              s.state = StateFollower; s.votedFor = 0
                            </span>
                          </CodeLine>
                          <CodeLine delay={0.42} visible={phase >= 2}>
                            <span className="pl-6 text-[#22c55e]">
                              atomic.StoreUint64(&amp;s.commitIndex, term)
                            </span>
                          </CodeLine>
                          <CodeLine delay={0.52} visible={phase >= 2}>
                            <span className="pl-3 text-[#f5f5f7]">&#125;</span>
                          </CodeLine>
                          <CodeLine delay={0.62} visible={phase >= 2}>
                            <span className="pl-3 text-[#2997ff]">
                              return s.replicateLogAcrossRegions(ctx)
                            </span>
                          </CodeLine>
                          <CodeLine delay={0.72} visible={phase >= 2}>
                            <span className="text-[#f5f5f7]">&#125;</span>
                          </CodeLine>
                        </div>
                      </div>

                      {/* Live audio waveform */}
                      <div className="mt-2 pt-2 border-t border-[#22242a] flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2 text-[#f5f5f7]">
                          <Volume2 className="w-3.5 h-3.5 text-[#0071e3]" />
                          <span>
                            AI Latency:{" "}
                            <strong className="text-[#ffd500]">142ms</strong>
                          </span>
                        </div>
                        <div className="flex items-end gap-[2px]">
                          {[16, 28, 12, 34, 22, 18, 30, 14, 26, 18, 32, 12].map(
                            (h, idx) => (
                              <WaveBar
                                key={idx}
                                height={h}
                                delay={idx * 0.06}
                                isActive={phase >= 2}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rubric panel */}
                    <div className="col-span-4 bg-[#111215] rounded-[10px] p-3 border border-[#22242a] flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                          Live Rubric
                        </div>
                        <div className="space-y-3">
                          <RubricBar
                            label="Algorithmic AST"
                            value={99}
                            color="#0071e3"
                            delay={0}
                            animate={phase >= 2}
                          />
                          <RubricBar
                            label="System Scale"
                            value={98}
                            color="#0071e3"
                            delay={0.15}
                            animate={phase >= 2}
                          />
                          <RubricBar
                            label="Vocal Cadence"
                            value={97}
                            color="#2997ff"
                            delay={0.3}
                            animate={phase >= 2}
                          />
                        </div>
                      </div>

                      <motion.div
                        className="bg-[#181a1f] p-2 rounded border border-[#2a2d35] text-[10px] text-[#86868b] flex items-center justify-between mt-2"
                        animate={
                          phase >= 2 ? { opacity: 1 } : { opacity: 0 }
                        }
                        transition={{ duration: 0.5 }}
                      >
                        <span>Hiring Bar:</span>
                        <span className="text-[#22c55e] font-semibold">
                          Strong Hire
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* ─── PHASE 3: PLACEMENT SUCCESS OVERLAY ─────────────── */}
                  <AnimatePresence>
                    {phase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.88, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{
                          duration: 0.55,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="absolute inset-2 sm:inset-3 bg-[#0a0c0f]/96 backdrop-blur-2xl rounded-[12px] border-2 border-[#0071e3] p-4 sm:p-6 flex flex-col items-center justify-center text-center z-30"
                        style={{
                          boxShadow: "0 0 60px rgba(0,113,227,0.4)",
                        }}
                      >
                        {/* Confetti particle burst */}
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                            style={{
                              backgroundColor: [
                                "#0071e3",
                                "#ffd500",
                                "#22c55e",
                                "#2997ff",
                              ][i % 4],
                            }}
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{
                              x:
                                Math.cos((i / 8) * Math.PI * 2) *
                                (60 + Math.random() * 40),
                              y:
                                Math.sin((i / 8) * Math.PI * 2) *
                                (40 + Math.random() * 30),
                              scale: [0, 1.5, 0],
                              opacity: [1, 1, 0],
                            }}
                            transition={{
                              duration: 0.9,
                              delay: i * 0.06,
                              ease: "easeOut",
                            }}
                          />
                        ))}

                        {/* Badge */}
                        <motion.div
                          className="flex items-center gap-2 px-3 py-1 bg-[#0071e3]/20 border border-[#0071e3] rounded-full text-[#2997ff] text-[10px] font-semibold uppercase tracking-wider mb-4"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hiring Committee: Verified Strong Hire</span>
                        </motion.div>

                        {/* Offer label */}
                        <motion.div
                          className="text-[#ffd500] text-[11px] font-semibold uppercase tracking-[2px] mb-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25 }}
                        >
                          Official Offer Extended
                        </motion.div>

                        {/* Role title */}
                        <motion.h3
                          className="text-[18px] sm:text-[24px] font-semibold text-[#f5f5f7] tracking-tight mb-3"
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 120,
                          }}
                        >
                          Staff Software Engineer (L6)
                        </motion.h3>

                        {/* Meta / Comp / Location chips */}
                        <motion.div
                          className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] my-2"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {[
                            {
                              icon: Building2,
                              text: "Meta Platforms Inc.",
                              color: "#2997ff",
                            },
                            {
                              icon: TrendingUp,
                              text: "$460k TC",
                              color: "#22c55e",
                            },
                            {
                              icon: ShieldCheck,
                              text: "Zurich, CH",
                              color: "#ffd500",
                            },
                          ].map(({ icon: Icon, text, color }, i) => (
                            <motion.span
                              key={i}
                              className="flex items-center gap-1.5 text-[#f5f5f7] font-semibold bg-[#1d1d1f] px-2.5 py-1 rounded-full border border-[#333336]"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: 0.45 + i * 0.08,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              <Icon
                                className="w-3.5 h-3.5"
                                style={{ color }}
                              />
                              {text}
                            </motion.span>
                          ))}
                        </motion.div>

                        <motion.p
                          className="text-[10px] sm:text-[11px] text-[#86868b] max-w-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          Placed in 14 days · 6 Intervyo sessions · 0 anxiety
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* ─── LAPTOP BASE ──────────────────────────────────────────── */}
            <div
              className="relative w-[104%] h-[15%] rounded-b-[18px] border-x-2 border-b-2 border-[#2a2a2e] flex flex-col items-center justify-between pt-1 pb-1 px-4"
              style={{
                background:
                  "linear-gradient(180deg, #1a1b1e 0%, #111113 100%)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.95)",
              }}
            >
              <div className="w-20 h-[6px] bg-[#0e0e0e] rounded-b-md border-b border-[#282828]" />
              <div className="w-32 h-4 bg-[#141517] rounded-[4px] border border-[#282828]" />
            </div>
          </motion.div>
        </div>

        {/* ── Phase indicator bar ───────────────────────────────────────── */}
        <div className="z-20 w-full max-w-lg flex-shrink-0">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-3 mb-3">
            {[0, 1, 2, 3].map((p) => (
              <motion.div
                key={p}
                className="rounded-full border border-[#333336]"
                animate={{
                  width: phase === p ? 32 : 8,
                  height: 8,
                  backgroundColor: phase >= p ? phaseColors[p] : "#282828",
                  borderColor: phase >= p ? phaseColors[p] : "#333336",
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          {/* Phase label */}
          <motion.div className="text-center" key={phase}>
            <motion.span
              className="text-[12px] font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: phaseColors[phase] }}
            >
              {phaseLabels[phase]}
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
