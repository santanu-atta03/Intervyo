import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/shared/SEO";
import Lenis from "@studio-freight/lenis";
import {
  Target,
  Eye,
  Heart,
  Users,
  Sparkles,
  Shield,
  Zap,
  Mail,
  Github,
  MessageSquare,
  BarChart,
  Lightbulb,
  Star,
} from "lucide-react";

function Arrow({ className = "" }) {
  return (
    <span className={`inline-block text-lg leading-none ${className}`}>
      ↗
    </span>
  );
}

function SectionLabel({ children, light = false }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-px w-8 ${light ? "bg-[#403F3C]" : "bg-[#878377]"}`}
      />
      <span
        className={`nk-caption-sm uppercase tracking-[0.22em] ${
          light ? "text-[#8D8A82]" : "text-[#69665F]"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

export default function AboutUs() {
  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/santanu-atta03/Intervyo/contributors"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setContributors(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching contributors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const stats = [
    { value: "5K+", label: "Active Users" },
    { value: "50+", label: "Tech Roles" },
    { value: "87%", label: "Success Rate" },
    { value: "24/7", label: "AI Support" },
  ];

  const coreValues = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Innovation",
      description:
        "Continuously improving our AI to provide cutting-edge interview preparation experiences.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Accessibility",
      description:
        "Making quality interview preparation available to everyone, regardless of background.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Trust & Privacy",
      description:
        "Protecting your data and maintaining transparency in everything we do.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "User-Centric",
      description:
        "Building features that truly matter and help our users succeed in their careers.",
    },
  ];

  const featureCards = [
    {
      title: "AI Mock Interviews",
      description:
        "Practice with realistic, role-specific interview simulations powered by advanced AI.",
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      className: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      title: "Instant Feedback",
      description:
        "Receive detailed performance analysis and actionable improvement suggestions.",
      icon: <Zap className="h-6 w-6 text-white" />,
      className: "bg-gradient-to-br from-amber-400 to-yellow-500",
    },
    {
      title: "Progress Analytics",
      description:
        "Track your improvement over time with comprehensive dashboards and insights.",
      icon: <BarChart className="h-6 w-6 text-white" />,
      className: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
  ];

  const team = {
    creator: {
      name: "Santanu Atta",
      role: "Full-Stack Developer & Creator",
      description:
        "Passionate developer dedicated to building AI-powered tools that make career growth more accessible, realistic, and effective.",
      github: "https://github.com/santanu-atta03",
      email: "intervyo@team.gmail.com",
      avatar: "https://github.com/santanu-atta03.png",
      skills: ["React", "Node.js", "MongoDB", "Express.js"],
    },
    values: [
      {
        name: "Innovation",
        role: "Core Principle",
        description:
          "Continuously pushing boundaries with cutting-edge technology solutions.",
        icon: Lightbulb,
      },
      {
        name: "Reliability",
        role: "Foundation",
        description: "Building robust systems that users can depend on every day.",
        icon: Shield,
      },
      {
        name: "User-Centric",
        role: "Design Philosophy",
        description:
          "Every feature designed with user experience and accessibility in mind.",
        icon: Heart,
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#191A1C] text-[#E8E3D8] nk-root">
      <SEO
        title="About Us"
        description="Learn about Intervyo's mission to democratize interview preparation and help job seekers worldwide unlock their full potential with AI."
        canonical="/about"
      />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap");

        .nk-root {
          font-family: "Helvetica Now Text", "Helvetica Neue", "Inter", Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .nk-display {
          font-family: "Nike Futura ND", "Bebas Neue", Anton, Impact, "Helvetica Neue", sans-serif;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .nk-h-xl {
          font-family: "Helvetica Now Display", "Helvetica Neue", "Inter", sans-serif;
          font-weight: 500;
          letter-spacing: -0.02em;
        }

        .nk-caption-sm {
          font-family: "Inter", -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 500;
        }

        @keyframes editorialReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .editorial-reveal {
          animation: editorialReveal 900ms cubic-bezier(.2,.7,.2,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <section className="border-b border-[#3B3B39] bg-[#242526]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="max-w-5xl editorial-reveal">
            <SectionLabel light>About Intervyo</SectionLabel>

            <h1 className="mt-7 max-w-5xl nk-display text-5xl leading-[0.92] text-[#F1EEE6] sm:text-7xl lg:text-[7.5rem]">
              Empowering careers through AI-powered interview prep.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#B5B3AC] sm:text-lg">
              We&apos;re on a mission to democratize interview preparation and help
              job seekers worldwide unlock their full potential with personalized,
              realistic, and confidence-building practice.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D7D1C5]/20 bg-[#E8E3D8] text-[#1D1E20]">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.7fr_1fr] lg:px-12 lg:py-28">
          <div>
            <SectionLabel>Who we are</SectionLabel>

            <h2 className="mt-7 max-w-md nk-display text-4xl leading-[0.95] text-[#1D1E20] sm:text-6xl">
              Building the future of interview preparation.
            </h2>

            <p className="mt-7 max-w-md text-base leading-8 text-[#68655E]">
              Intervyo is an AI-powered interview preparation platform designed to
              help tech professionals and job seekers excel in real interviews.
              We blend cutting-edge AI with proven interview techniques to deliver
              realistic, personalized mock interview experiences.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#A8A196] bg-[#F4F0E8] p-5 shadow-sm"
                >
                  <div className="nk-display text-3xl text-[#1D1E20]">
                    {item.value}
                  </div>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#6B665E]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative -translate-y-1 border border-[#B6B0A4] bg-[#724133] p-6 sm:p-8 shadow-[0_20px_45px_rgba(0,0,0,0.38)]">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="nk-caption-sm uppercase tracking-[0.2em] font-semibold text-emerald-200">
                Mission & Vision
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#A98F82]/60 bg-[#7B4C3E] p-5">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-[#F3EDE3]" />
                  <p className="nk-caption-sm uppercase tracking-[0.18em] text-[#E8DFD2]">
                    Our Mission
                  </p>
                </div>
                <p className="mt-4 text-base leading-7 text-[#F5EFE8]">
                  To revolutionize interview preparation by providing accessible,
                  AI-driven coaching that empowers individuals to confidently
                  showcase their skills and land their dream jobs.
                </p>
              </div>

              <div className="rounded-2xl border border-[#A98F82]/60 bg-[#7B4C3E] p-5">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-[#F3EDE3]" />
                  <p className="nk-caption-sm uppercase tracking-[0.18em] text-[#E8DFD2]">
                    Our Vision
                  </p>
                </div>
                <p className="mt-4 text-base leading-7 text-[#F5EFE8]">
                  To become the world&apos;s most trusted AI interview coach, helping
                  millions of professionals unlock career opportunities and achieve
                  their full potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#191A1C]">
        <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-12 text-center">
            <SectionLabel light>Our values</SectionLabel>
            <h2 className="mt-7 nk-display text-4xl leading-[0.95] text-[#F1EEE6] sm:text-6xl">
              What we stand for.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#41423F] bg-[#242526] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#D7D1C5] text-[#1D1E20]">
                  {value.icon}
                </div>

                <h3 className="text-xl font-semibold text-[#F1EEE6]">
                  {value.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#B5B3AC]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D7D1C5]/20 bg-[#E8E3D8] text-[#1D1E20]">
        <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-12 text-center">
            <SectionLabel>Features</SectionLabel>
            <h2 className="mt-7 nk-display text-4xl leading-[0.95] text-[#1D1E20] sm:text-6xl">
              What we offer.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((feature, index) => (
              <div
                key={index}
                className={`${feature.className} rounded-3xl border border-[#D7D1C5]/20 p-8 text-white shadow-[0_20px_45px_rgba(0,0,0,0.18)]`}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold leading-tight">
                  {feature.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-white/90">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#191A1C]">
        <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-12 text-center">
            <SectionLabel light>Our team</SectionLabel>
            <h2 className="mt-7 nk-display text-4xl leading-[0.95] text-[#F1EEE6] sm:text-6xl">
              Meet the people behind Intervyo.
            </h2>
          </div>

          <div className="mb-12 rounded-[28px] border border-[#41423F] bg-[#242526] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img
                  src={team.creator.avatar}
                  alt={team.creator.name}
                  className="h-32 w-32 rounded-[22px] object-cover border border-[#D7D1C5]/30"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${team.creator.name}&background=10b981&color=ffffff&size=128`;
                  }}
                />
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8E3D8] text-[#1D1E20]">
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>

              <h3 className="nk-display text-4xl leading-none text-[#F1EEE6]">
                Meet the creator
              </h3>

              <div className="mt-5">
                <h4 className="text-2xl font-semibold text-[#E8C47A]">
                  {team.creator.name}
                </h4>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#B5B3AC]">
                  {team.creator.role}
                </p>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#B5B3AC]">
                {team.creator.description}
              </p>

              <div className="mt-6 flex items-center gap-4">
                <a
                  href={team.creator.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#D7D1C5]/30 bg-[#191A1C] text-[#F1EEE6] transition hover:border-[#E8E3D8] hover:text-[#E8E3D8]"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${team.creator.email}`}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#D7D1C5] text-[#1D1E20] transition hover:bg-[#E8E3D8]"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>

              <div className="mt-8 w-full max-w-2xl">
                <p className="text-sm uppercase tracking-[0.18em] text-[#B5B3AC]">
                  Tech stack expertise
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {team.creator.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-[#D7D1C5]/25 bg-[#191A1C] px-3 py-1.5 text-sm font-medium text-[#E8E3D8]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#41423F] bg-[#242526] p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D7D1C5] text-[#1D1E20]">
                <Github className="h-5 w-5" />
              </div>
              <h3 className="nk-display text-3xl leading-none text-[#F1EEE6]">
                Project contributors
              </h3>
            </div>

            {loading ? (
              <div className="flex min-h-[140px] items-center justify-center text-base text-[#B5B3AC]">
                Loading contributors...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#4A4843] bg-[#191A1C] p-6 text-center">
                <p className="text-[#D7D1C5]">Error loading contributors: {error}</p>
                <p className="mt-3 text-[#B5B3AC]">
                  Visit our <a href="https://github.com/santanu-atta03/Intervyo" target="_blank" rel="noreferrer" className="underline">GitHub repository</a> to see contributors.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {contributors.map((contributor) => (
                  <a
                    key={contributor.id}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block rounded-2xl border border-[#41423F] bg-[#191A1C] p-4 text-center transition hover:border-[#D7D1C5]/50"
                    title={`${contributor.login} (${contributor.contributions} contributions)`}
                  >
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="mx-auto h-16 w-16 rounded-full border-2 border-transparent object-cover transition group-hover:border-[#E8C47A]"
                    />
                    <h4 className="mt-3 truncate text-sm font-semibold text-[#F1EEE6]">
                      {contributor.login}
                    </h4>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#B5B3AC]">
                      {contributor.contributions} contributions
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#191A1C]">
        <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <SectionLabel light>Before you reach out</SectionLabel>

              <h2 className="mt-7 max-w-3xl nk-display text-4xl leading-[0.95] text-[#F1EEE6] sm:text-6xl">
                Tell us the interview you want to master.
              </h2>
            </div>

            <div className="border-t border-[#41423F] pt-6">
              <p className="text-base leading-8 text-[#96938B]">
                Whether you are preparing for tech, product, behavioral rounds, or
                system design, let us know your target role and timeline so we can
                assist you effectively.
              </p>

              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="mt-8 inline-flex items-center gap-4 border-b border-[#8E8B83]/50 pb-1 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#D8D3C8] transition hover:border-[#E8E3D8] hover:text-[#E8E3D8]"
              >
                Contact Support Directly
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
