import React, { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BrandLogo from "../components/shared/BrandLogo";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content: (
      <>
        <p>
          We collect information to provide, improve, and secure our services.
          The types of information we may collect include:
        </p>

        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, profile
            details, and authentication credentials.
          </li>
          <li>
            <strong>Interview Data:</strong> Responses, transcripts, audio/video
            recordings if enabled, performance metrics, and AI-generated
            feedback.
          </li>
          <li>
            <strong>Usage Information:</strong> Pages visited, features used,
            session duration, and interaction logs.
          </li>
          <li>
            <strong>Device Information:</strong> Browser type, operating system,
            IP address, and device identifiers.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "02",
    title: "How We Use Your Information",
    content: (
      <>
        <p>
          Your information is used strictly for legitimate business and platform
          functionality purposes, including:
        </p>

        <ul>
          <li>Providing AI-powered interview simulations</li>
          <li>Generating performance analytics and improvement insights</li>
          <li>Improving model accuracy and user experience</li>
          <li>Managing subscriptions, authentication, and security</li>
          <li>Communicating updates, alerts, and support responses</li>
        </ul>
      </>
    ),
  },
  {
    number: "03",
    title: "AI & Automated Processing",
    content: (
      <p>
        Intervyo uses artificial intelligence and machine learning models to
        analyze interview responses and generate feedback. These processes are
        automated and designed solely to assist learning and preparation. AI
        outputs should not be considered professional hiring advice.
      </p>
    ),
  },
  {
    number: "04",
    title: "Data Storage & Security",
    content: (
      <>
        <p>
          We implement industry-standard technical and organizational security
          measures to protect your data, including encryption, access control,
          and secure cloud infrastructure.
        </p>

        <p>
          However, no system is completely secure. By using Intervyo, you
          acknowledge and accept this risk.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Data Retention",
    content: (
      <p>
        We retain your data only for as long as necessary to provide services,
        comply with legal obligations, resolve disputes, and enforce policies.
        You may request deletion of your data at any time.
      </p>
    ),
  },
  {
    number: "06",
    title: "Third-Party Services",
    content: (
      <>
        <p>We may integrate trusted third-party services for:</p>

        <ul>
          <li>Cloud hosting and storage</li>
          <li>Analytics and performance monitoring</li>
          <li>Authentication and security</li>
          <li>AI inference and processing</li>
        </ul>

        <p>These providers are contractually obligated to protect your data.</p>
      </>
    ),
  },
  {
    number: "07",
    title: "Cookies & Tracking",
    content: (
      <p>
        Intervyo may use cookies or similar technologies to maintain sessions,
        enhance user experience, and analyze platform usage. You can control
        cookie settings through your browser.
      </p>
    ),
  },
  {
    number: "08",
    title: "User Rights",
    content: (
      <>
        <p>Depending on your jurisdiction, you may have the right to:</p>

        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent for data processing</li>
        </ul>
      </>
    ),
  },
  {
    number: "09",
    title: "Children's Privacy",
    content: (
      <p>
        Intervyo is not intended for children under the age of 13. We do not
        knowingly collect personal information from minors.
      </p>
    ),
  },
  {
    number: "10",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated revision date.
      </p>
    ),
  },
  {
    number: "11",
    title: "Contact Information",
    content: (
      <>
        <p>
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us at:
        </p>

        <a href="mailto:support@intervyo.ai" className="privacy-email">
          support@intervyo.ai
        </a>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("01");

  useEffect(() => {
    const policySections = Array.from(
      document.querySelectorAll(".privacy-section"),
    );

    if (policySections.length === 0) return undefined;

    let lastActiveSection = "";
    const updateActiveSection = () => {
      const activationLine = window.innerHeight * 0.28;
      let currentSection = policySections[0].dataset.section || "01";

      for (const section of policySections) {
        if (section.getBoundingClientRect().top > activationLine) break;
        currentSection = section.dataset.section || currentSection;
      }

      if (currentSection !== lastActiveSection) {
        lastActiveSection = currentSection;
        setActiveSection(currentSection);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <main className="privacy-page">
      <style>{`

      @font-face {
          font-family: "FK Screamer";
          src: url("https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2") format("woff2");
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
        .privacy-page {
          --privacy-bg: #0A0D12;
          --privacy-text: #F3F4F6;
          --privacy-muted: #9CA3AF;
          --privacy-border: rgba(255,255,255,0.11);
          --privacy-blue: #C3DBFF;
          --privacy-green: #D1F48C;

          min-height: 100vh;
          overflow-x: clip;
          color: var(--privacy-text);
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(195,219,255,0.14),
              transparent 32%
            ),
            radial-gradient(
              circle at 90% 30%,
              rgba(209,244,140,0.05),
              transparent 25%
            ),
            var(--privacy-bg);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif, Geist;
          -webkit-font-smoothing: antialiased;
        }

        .privacy-page *,
        .privacy-page *::before,
        .privacy-page *::after {
          box-sizing: border-box;
        }

        .privacy-topbar {
          position: fixed;
          inset: 0 0 auto;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 76px;
          padding: 0 clamp(20px, 3.2vw, 48px);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: linear-gradient(
            110deg,
            rgba(24,29,39,0.98),
            rgba(12,15,22,0.98)
          );
        }

        .privacy-brand {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          color: #111318;
          background: #ffffff;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: 20px;
          letter-spacing: -0.07em;
          line-height: 1;
          text-decoration: none;
        }

        .privacy-home-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #A8ADB7;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .privacy-home-link:hover {
          color: #ffffff;
        }

        .nav-heading{
          font-family: "FK Screamer", Impact, sans-serif;
        }

        .privacy-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.6;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 4rem 4rem;
          mask-image: radial-gradient(
            ellipse at center,
            black 0%,
            transparent 78%
          );
          -webkit-mask-image: radial-gradient(
            ellipse at center,
            black 0%,
            transparent 78%
          );
        }

        .privacy-shell {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1440px);
          margin: 0 auto;
          padding: 90px 0 88px;
        }

        .privacy-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(180px, 240px);
          gap: clamp(28px, 5vw, 44px);
          align-items: center;
          padding: clamp(28px, 5vw, 56px);
          overflow: hidden;
          border: 1px solid var(--privacy-border);
          border-radius: 16px;
          background:
            linear-gradient(
              120deg,
              rgba(14,18,26,0.96),
              rgba(17,22,31,0.76)
            ),
            radial-gradient(
              circle at 80% 10%,
              rgba(195,219,255,0.16),
              transparent 35%
            );
          box-shadow: 0 24px 80px rgba(0,0,0,0.28);
        }

        .privacy-title {
          margin: 0;
          color: #fff;
          font-size: clamp(48px, 7vw, 78px);
          font-weight: 700;
          letter-spacing: -0.06em;
          line-height: 0.98;
          text-transform: uppercase;
          text-wrap: balance;
          overflow-wrap: anywhere;
        }

        .privacy-intro {
          max-width: 66ch;
          margin: 24px 0 0;
          color: #C7CBD3;
          font-size: 16px;
          line-height: 1.75;
        }

        .privacy-meta {
          align-self: end;
          padding-left: 24px;
          border-left: 1px solid var(--privacy-border);
        }

        .privacy-meta-label {
          margin-bottom: 9px;
          color: var(--privacy-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .privacy-meta-value {
          color: #fff;
          font-size: 15px;
          line-height: 1.6;
        }

        .privacy-layout {
          display: flex;

          margin-top: clamp(50px, 6vw, 80px);
        }

        .privacy-index {
          position: sticky;
          top: 112px;
          align-self: start;
          max-height: calc(100vh - 136px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.18) transparent;
        }

        .privacy-index-title {
          margin: 0 0 16px;
          color: var(--privacy-muted);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .privacy-index-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .privacy-index-link {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          align-items: start;
          gap: 8px;
          padding: 9px 10px;
          color: #9299A5;
          border-left: 2px solid transparent;
          font-size: 13px;
          line-height: 1.45;
          text-decoration: none;
          overflow-wrap: anywhere;
          transition:
            color 0.2s ease,
            background-color 0.2s ease,
            border-color 0.2s ease;
        }

        .privacy-index-link:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.04);
        }

        .privacy-index-link.is-active {
          color: #ffffff;
          background: rgba(195,219,255,0.08);
          border-left-color: var(--privacy-green);
        }

        .privacy-index-link.is-active .privacy-index-number {
          color: var(--privacy-green);
        }

        .privacy-index-number {
          color: var(--privacy-blue);
          font-variant-numeric: tabular-nums;
          transition: color 0.2s ease;
        }

        .privacy-content {
          min-width: 0;
        }

        .privacy-section {
          scroll-margin-top: 112px;
          padding: 0 0 36px;
          margin: 0 0 36px;
          border-bottom: 1px solid var(--privacy-border);
        }

        .privacy-section:last-child {
          margin-bottom: 0;
          border-bottom: 0;
        }

        .privacy-section-heading {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin: 0 0 18px;
          color: #ffffff;
          font-size: clamp(23px, 2.4vw, 32px);
          font-weight: 650;
          letter-spacing: -0.035em;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .privacy-section-number {
          flex: 0 0 auto;
          color: var(--privacy-green);
          font-size: 0.62em;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.06em;
        }

        .privacy-section p {
          max-width: 72ch;
          margin: 0 0 16px;
          color: #C7CBD3;
          font-size: 16px;
          line-height: 1.75;
          overflow-wrap: anywhere;
        }

        .privacy-section p:last-child {
          margin-bottom: 0;
        }

        .privacy-section ul {
          display: grid;
          gap: 10px;
          max-width: 72ch;
          margin: 18px 0 0;
          padding-left: 22px;
          color: #C7CBD3;
        }

        .privacy-section li {
          padding-left: 4px;
          font-size: 16px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .privacy-section li::marker {
          color: var(--privacy-green);
        }

        .privacy-section strong {
          color: #F3F4F6;
        }

        .privacy-email {
          display: inline-block;
          color: var(--privacy-blue);
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: rgba(195,219,255,0.45);
          text-underline-offset: 4px;
          overflow-wrap: anywhere;
        }

        .privacy-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 24px;
          color: var(--privacy-muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .privacy-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .privacy-back:hover {
          color: var(--privacy-green);
        }

        @media (max-width: 900px) {
          .privacy-shell {
            padding-top: 104px;
          }

          .privacy-hero {
            grid-template-columns: minmax(0, 1fr) minmax(160px, 200px);
            gap: 28px;
            padding: 32px;
          }

          .privacy-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 32px;
            margin-top: 48px;
          }

          .privacy-index {
            position: static;
            max-height: none;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--privacy-border);
          }

          .privacy-index-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 4px 12px;
          }
        }

        @media (max-width: 560px) {
          .privacy-shell {
            width: min(100% - 28px, 1240px);
            padding: 96px 0 56px;
          }

          .privacy-topbar {
            min-height: 68px;
            padding: 0 16px;
          }

          .privacy-brand {
            min-height: 42px;
            padding: 0 16px;
            font-size: 18px;
          }

          .privacy-hero {
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
            padding: 26px 22px;
            border-radius: 12px;
          }

          .privacy-title {
            font-size: clamp(44px, 13vw, 64px);
          }

          .privacy-intro {
            margin-top: 18px;
            font-size: 15px;
          }

          .privacy-meta {
            padding: 18px 0 0;
            border-top: 1px solid var(--privacy-border);
            border-left: 0;
          }

          .privacy-index-list {
            grid-template-columns: minmax(0, 1fr);
          }

          .privacy-layout {
            margin-top: 40px;
          }

          .privacy-section {
            padding-bottom: 28px;
            margin-bottom: 28px;
          }

          .privacy-section-heading {
            gap: 10px;
            font-size: 23px;
          }

          .privacy-section p,
          .privacy-section li {
            font-size: 15px;
          }

          .privacy-footer {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }

          .privacy-page *,
          .privacy-page *::before,
          .privacy-page *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="privacy-grid" />

      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12"
      >
        <Link
          to="/"
          className="inline-flex"
        >
          <BrandLogo className="text-[30px]" />
        </Link>

        <Link
          to="/"
          className="group flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back to home
        </Link>
      </motion.nav>

      <div className="privacy-shell">
        <header className="privacy-hero">
          <div>
            <h1 className="privacy-title">Privacy policy.</h1>

            <p className="privacy-intro">
              We believe your preparation data belongs to you. This policy
              explains how Intervyo collects, uses, stores, and protects your
              information while you build your unfair career advantage.
            </p>
          </div>

          <div className="privacy-meta">
            <div className="privacy-meta-label">Last updated</div>
            <div className="privacy-meta-value">
              7 January 2026
              <br />
              Version 1.0
            </div>

            <div className="mt-6 flex items-center gap-2 text-[#D1F48C]">
              <ShieldCheck size={18} />
              <span className="text-xs font-semibold">Your data matters</span>
            </div>
          </div>
        </header>

        <div className="privacy-layout flex-row mx-auto justify-around max-w-[1240px]">
          <aside className="privacy-index" aria-label="Privacy policy sections">
            <h2 className="privacy-index-title">On this page</h2>

            <ol className="privacy-index-list">
              {sections.map((section) => {
                const isActive = activeSection === section.number;

                return (
                  <li key={section.number}>
                    <a
                      href={`#privacy-section-${section.number}`}
                      className={`privacy-index-link ${
                        isActive ? "is-active" : ""
                      }`}
                      aria-current={isActive ? "location" : undefined}
                    >
                      <span className="privacy-index-number">
                        {section.number}
                      </span>

                      <span>{section.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </aside>

          <article className="privacy-content">
            {sections.map((section) => (
              <section
                key={section.number}
                id={`privacy-section-${section.number}`}
                data-section={section.number}
                className="privacy-section"
              >
                <h2 className="privacy-section-heading">
                  <span className="privacy-section-number">
                    {section.number}
                  </span>

                  {section.title}
                </h2>

                {section.content}
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
