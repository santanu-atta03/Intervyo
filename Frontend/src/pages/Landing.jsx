import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/shared/SEO";

gsap.registerPlugin(ScrollTrigger);

const palette = {
  white: "#FFFFFF",
  soft: "#F5F5F7",
  black: "#1D1D1F",
  grey: "#86868B",
  charcoal: "#101010",
  blue: "#0071E3",
};

const showcaseImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80";
const heroImage =
  "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=2000&q=80";
const splitImage =
  "https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=1800&q=80";

const featureStories = [
  {
    title: "AI Interview Simulation",
    body: "Technical and behavioral sessions that mirror real interview pacing.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Adaptive Questions",
    body: "Follow-up prompts adapt to what you just said, just like live interviewers.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Personalized Feedback",
    body: "Clear strengths, weaknesses, and actionable coaching after each practice run.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Performance Tracking",
    body: "Compare recent sessions and watch your communication and technical depth improve.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Body Language Coaching",
    body: "Practice delivery, confidence, and executive presence with visual guidance.",
    image:
      "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Interview Replay",
    body: "Revisit key moments from past interviews and refine your next attempt with precision.",
    image:
      "https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&w=1800&q=80",
  },
];

const steps = [
  {
    label: "Interview question",
    title: "Tell me about a time you improved app performance.",
    supporting: "Structured prompts keep responses focused and relevant.",
  },
  {
    label: "Candidate response",
    title: "I reduced dashboard load time by 42% through API batching and memoization.",
    supporting: "Transcripts capture every response for review.",
  },
  {
    label: "Evaluation",
    title: "Clarity 8.8 · Technical depth 8.5 · Structure 9.0",
    supporting: "Balanced scoring across communication and technical quality.",
  },
  {
    label: "Actionable feedback",
    title: "Quantify business impact earlier and tighten your closing summary.",
    supporting: "Concrete improvement tasks for your next session.",
  },
];

const faqs = [
  {
    q: "Can I practice both technical and behavioral interviews?",
    a: "Yes. Intervyo supports role-specific technical scenarios and behavioral interview simulations in one workflow.",
  },
  {
    q: "Is my interview data saved for review?",
    a: "Yes. Sessions include transcripts, evaluation summaries, and replay access so you can track progress over time.",
  },
  {
    q: "Does Intervyo provide feedback after every interview?",
    a: "Every completed practice interview includes targeted, actionable feedback with strengths and improvements.",
  },
];

const Ease = "power3.out";

export default function LandingPage() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const pinRef = useRef(null);
  const horizontalRef = useRef(null);
  const trackRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

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

  return (
    <div
      ref={rootRef}
      className="overflow-x-hidden"
      style={{ backgroundColor: palette.white, color: palette.black }}
    >
      <SEO
        title="Intervyo | Premium Interview Practice"
        description="Prepare for interviews with realistic simulations, meaningful feedback, and progress analytics in Intervyo."
        canonical="/"
      />

      <section
        ref={heroRef}
        className="min-h-screen pt-28 pb-16 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: palette.soft }}
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          <div className="lg:col-span-6 space-y-8">
            <p
              className="hero-reveal text-sm tracking-[0.24em] uppercase"
              style={{ color: palette.grey }}
            >
              Intervyo
            </p>
            <h1
              className="hero-reveal text-[2.45rem] sm:text-5xl lg:text-7xl leading-[1.04] font-semibold"
              style={{ color: palette.charcoal }}
            >
              Your next interview deserves your best.
            </h1>
            <p className="hero-reveal text-lg max-w-xl" style={{ color: palette.grey }}>
              Prepare with realistic AI-powered interviews, receive meaningful feedback,
              and walk into every opportunity with confidence.
            </p>
            <div className="hero-reveal flex flex-wrap gap-4">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => navigate("/register")}
                className="rounded-full px-7 py-3.5 text-white font-medium"
                style={{ backgroundColor: palette.blue }}
              >
                Start Practicing
              </motion.button>
              <motion.a
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                href="#features"
                className="rounded-full px-7 py-3.5 border font-medium"
                style={{ borderColor: "#D2D2D7", color: palette.black }}
              >
                Explore Intervyo
              </motion.a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="hero-image relative overflow-hidden rounded-[2rem] shadow-[0_40px_90px_rgba(0,0,0,0.14)]">
              <img
                src={heroImage}
                alt="Professional preparing for an interview in a modern workspace"
                className="w-full h-[64vh] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: palette.grey }}>
              Product showcase
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              A smarter way to prepare.
            </h2>
            <p className="text-lg max-w-md" style={{ color: palette.grey }}>
              Experience realistic interview prompts, live transcripts, precise timing,
              and evaluation summaries in one focused workspace.
            </p>
          </div>

          <div className="lg:col-span-7 rounded-[2.2rem] border p-6 md:p-8 shadow-[0_28px_80px_rgba(15,15,15,0.08)]" style={{ borderColor: "#E8E8ED", backgroundColor: palette.soft }}>
            <div className="rounded-3xl bg-white border border-[#E2E2E8] p-5 md:p-7 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#F0F6FF] text-[#1357C5]">
                  Senior Frontend Interview
                </span>
                <span className="text-sm" style={{ color: palette.grey }}>12:34</span>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-[#E9E9EE] p-4 space-y-4">
                  <p className="text-xs uppercase tracking-wide" style={{ color: palette.grey }}>
                    AI question
                  </p>
                  <p className="text-[1.04rem] leading-relaxed">
                    How would you optimize a dashboard with high-frequency API updates?
                  </p>
                  <div className="space-y-2">
                    <div className="h-2.5 rounded-full bg-[#EDEDF2] w-full" />
                    <div className="h-2.5 rounded-full bg-[#EDEDF2] w-[92%]" />
                    <div className="h-2.5 rounded-full bg-[#EDEDF2] w-[76%]" />
                  </div>
                </div>
                <div className="rounded-2xl border border-[#E9E9EE] p-4 space-y-4">
                  <p className="text-xs uppercase tracking-wide" style={{ color: palette.grey }}>
                    Evaluation dashboard
                  </p>
                  {["Clarity", "Technical depth", "Confidence"].map((item, i) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm">{item}</span>
                      <span className="text-sm" style={{ color: palette.grey }}>
                        {88 - i * 4}%
                      </span>
                    </div>
                  ))}
                  <p className="text-sm leading-relaxed" style={{ color: palette.grey }}>
                    Demo interface · Final feedback suggests adding business-impact framing.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={showcaseImage}
                  alt="Intervyo interface in a premium editorial setting"
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={pinRef} className="min-h-screen px-6 md:px-10 lg:px-16 py-24" style={{ backgroundColor: palette.soft }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 rounded-[2rem] overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,0.12)]">
            <img
              src={splitImage}
              alt="Professional in interview preparation session"
              className="w-full h-[65vh] object-cover"
              loading="lazy"
            />
          </div>

          <div className="lg:col-span-6 space-y-8">
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: palette.grey }}>
              Interview experience
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              Practice for the moments that matter.
            </h2>

            <div className="grid gap-3">
              {steps.map((step, idx) => (
                <div
                  key={step.label}
                  className="timeline-step rounded-2xl border p-4 transition-all duration-300"
                  style={{
                    borderColor: idx === stepIndex ? "#BFD7F4" : "#E2E2E8",
                    backgroundColor: idx === stepIndex ? "#F6FAFF" : "#FFFFFF",
                  }}
                >
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: palette.grey }}>
                    {step.label}
                  </p>
                  <p className="font-medium text-base">{step.title}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#E2E2E8] bg-white p-5">
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: palette.grey }}>
                Current reveal
              </p>
              <p className="font-medium">{currentStep.title}</p>
              <p className="mt-2 text-sm" style={{ color: palette.grey }}>
                {currentStep.supporting}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" ref={horizontalRef} className="py-24 px-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 mb-10">
          <p className="text-sm uppercase tracking-[0.2em]" style={{ color: palette.grey }}>
            Feature storytelling
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Designed for deliberate improvement.</h2>
        </div>

        <div
          ref={trackRef}
          className="flex w-[600vw] md:w-[420vw] lg:w-[600vw]"
          style={{ width: `${featureStories.length * 100}vw` }}
        >
          {featureStories.map((feature) => (
            <article
              key={feature.title}
              className="story-card w-screen px-6 md:px-10 lg:px-16"
            >
              <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <h3 className="text-3xl md:text-4xl font-semibold leading-tight">{feature.title}</h3>
                  <p className="text-lg max-w-xl" style={{ color: palette.grey }}>{feature.body}</p>
                </div>
                <div className="lg:col-span-6 rounded-[1.8rem] overflow-hidden shadow-[0_22px_60px_rgba(0,0,0,0.12)]">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-[56vh] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fade-up-wrap py-24 px-6 md:px-10 lg:px-16" style={{ backgroundColor: palette.soft }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 fade-up">
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: palette.grey }}>
              Analytics
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mt-3">
              See your progress. Understand your potential.
            </h2>
            <p className="text-lg mt-5" style={{ color: palette.grey }}>
              Visualize communication strength, technical correctness, and confidence trends with focused recommendations.
            </p>
          </div>

          <div className="lg:col-span-7 fade-up rounded-[2rem] border border-[#E2E2E8] bg-white p-6 md:p-8 shadow-[0_24px_65px_rgba(0,0,0,0.08)]">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["Performance score", "89"],
                ["Communication", "86"],
                ["Technical correctness", "91"],
                ["Confidence assessment", "84"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#ECECF1] p-4">
                  <p className="text-sm" style={{ color: palette.grey }}>{label}</p>
                  <p className="text-3xl font-semibold mt-2">
                    {value}
                    <span className="text-lg" style={{ color: palette.grey }}>/100</span>
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[#ECECF1] p-4">
              <p className="text-sm mb-3" style={{ color: palette.grey }}>Improvement history</p>
              <div className="h-36 flex items-end gap-3">
                {[44, 56, 62, 68, 74, 82, 89].map((bar) => (
                  <div key={bar} className="flex-1 rounded-t-xl" style={{ height: `${bar}%`, backgroundColor: "#CCE0F8" }} />
                ))}
              </div>
              <p className="mt-3 text-sm" style={{ color: palette.grey }}>
                Demo visualization · Suggestions adapt after each interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto text-center rounded-[2.2rem] border border-[#E2E2E8] p-10 md:p-14">
          <p className="text-sm uppercase tracking-[0.2em]" style={{ color: palette.grey }}>
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Choose the pace that fits your goal.</h2>
          <p className="text-lg mt-5" style={{ color: palette.grey }}>
            Start with guided practice and upgrade when you need deeper analytics, more interview tracks, and replay coaching.
          </p>
          <motion.div
            className="mt-8 flex justify-center"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Link
              to="/pricing"
              className="inline-flex rounded-full px-7 py-3.5 text-white font-medium"
              style={{ backgroundColor: palette.black }}
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="py-24 px-6 md:px-10 lg:px-16" style={{ backgroundColor: palette.soft }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em]" style={{ color: palette.grey }}>
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Answers for focused preparation.</h2>

          <div className="mt-10 space-y-4">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={item.q}
                  className="rounded-2xl border border-[#E2E2E8] bg-white overflow-hidden"
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  >
                    <span className="font-medium text-lg">{item.q}</span>
                    <span style={{ color: palette.grey }}>{isOpen ? "−" : "+"}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      >
                        <p className="px-6 pb-6 text-base leading-relaxed" style={{ color: palette.grey }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold leading-tight">
            Walk into every interview with clarity.
          </h2>
          <p className="text-lg mt-5" style={{ color: palette.grey }}>
            Build repeatable confidence with realistic practice, measured improvement,
            and premium guidance from Intervyo.
          </p>
          <div className="mt-9 flex justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => navigate("/register")}
              className="rounded-full px-8 py-3.5 text-white font-medium"
              style={{ backgroundColor: palette.blue }}
            >
              Start Practicing
            </motion.button>
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => navigate("/dashboard")}
              className="rounded-full px-8 py-3.5 border font-medium"
              style={{ borderColor: "#D2D2D7", color: palette.black }}
            >
              Go to Dashboard
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
