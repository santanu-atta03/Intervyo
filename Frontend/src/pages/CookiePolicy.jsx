import React, { useEffect, useState } from "react";
import { ArrowLeft, Cookie, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import cookieIllustration from "../assets/cookie_img.png";
import BrandLogo from "../components/shared/BrandLogo";

const sections = [
  {
    number: "01",
    title: "What Are Cookies?",
    content: (
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help websites remember your preferences, maintain
        sessions, and improve overall user experience.
      </p>
    ),
  },
  {
    number: "02",
    title: "How We Use Cookies",
    content: (
      <>
        <p>Intervyo uses cookies for the following purposes:</p>
        <ul>
          <li>Maintaining secure user sessions and authentication</li>
          <li>Remembering user preferences and settings</li>
          <li>Analyzing platform usage and performance</li>
          <li>Improving features, reliability, and user experience</li>
        </ul>
      </>
    ),
  },
  {
    number: "03",
    title: "Types of Cookies We Use",
    content: (
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Required for core functionality
          such as login, security, and session management.
        </li>
        <li>
          <strong>Performance Cookies:</strong> Help us understand how users
          interact with the platform so we can improve it.
        </li>
        <li>
          <strong>Preference Cookies:</strong> Store your settings and
          preferences for a more personalized experience.
        </li>
      </ul>
    ),
  },
  {
    number: "04",
    title: "Third-Party Cookies",
    content: (
      <>
        <p>
          We may use trusted third-party services such as analytics or
          performance monitoring tools that place cookies on your device.
        </p>
        <p>
          These third parties are subject to their own privacy and cookie
          policies, and we do not control their cookie usage.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Managing Cookies",
    content: (
      <>
        <p>
          You can control or delete cookies at any time through your browser
          settings. Most browsers allow you to:
        </p>
        <ul>
          <li>View stored cookies</li>
          <li>Delete existing cookies</li>
          <li>Block cookies from specific or all websites</li>
        </ul>
        <p className="cookie-policy-note">
          Please note that disabling certain cookies may affect platform
          functionality.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Consent",
    content: (
      <p>
        By continuing to use Intervyo, you consent to the use of cookies as
        described in this policy unless you disable them through your browser
        settings.
      </p>
    ),
  },
  {
    number: "07",
    title: "Changes to This Cookie Policy",
    content: (
      <p>
        We may update this Cookie Policy from time to time. Any changes will be
        posted on this page with an updated revision date.
      </p>
    ),
  },
  {
    number: "08",
    title: "Contact Information",
    content: (
      <>
        <p>
          If you have any questions about our use of cookies, please contact
          us at:
        </p>
        <a className="cookie-policy-email" href="mailto:support@intervyo.ai">
          support@intervyo.ai
        </a>
      </>
    ),
  },
];

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState("01");

  useEffect(() => {
    const policySections = Array.from(
      document.querySelectorAll(".cookie-policy-section"),
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
    <main className="cookie-policy-page">
      <style>{`
        @font-face {
          font-family: "FK Screamer";
          src: url("https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2") format("woff2");
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }

        .cookie-policy-page {
          --policy-bg: #0A0D12;
          --policy-surface: #11161F;
          --policy-muted: #9CA3AF;
          --policy-border: rgba(255,255,255,0.11);
          --policy-blue: #C3DBFF;
          --policy-green: #D1F48C;
          --policy-pink: #FFB8FC;

          min-height: 100vh;
          overflow-x: clip;
          color: #F3F4F6;
          background:
            radial-gradient(circle at 12% 0%, rgba(195,219,255,0.12), transparent 30%),
            radial-gradient(circle at 88% 28%, rgba(209,244,140,0.045), transparent 25%),
            var(--policy-bg);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif, Geist;
          -webkit-font-smoothing: antialiased;
        }

        .cookie-policy-page *,
        .cookie-policy-page *::before,
        .cookie-policy-page *::after {
          box-sizing: border-box;
        }

        .cookie-policy-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.48;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 4rem 4rem;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
        }

        .cookie-policy-nav-heading {
          font-family: "FK Screamer", Impact, sans-serif;
        }

        .cookie-policy-shell {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1440px);
          margin: 0 auto;
          padding: 48px 0 96px;
        }

        .cookie-policy-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(210px, 300px);
          align-items: center;
          gap: clamp(32px, 6vw, 78px);
          min-height: 340px;
          padding: clamp(32px, 6vw, 64px);
          overflow: hidden;
          border: 1px solid var(--policy-border);
          border-radius: 16px;
          background:
            radial-gradient(circle at 88% 12%, rgba(195,219,255,0.13), transparent 33%),
            linear-gradient(120deg, rgba(14,18,26,0.98), rgba(17,22,31,0.86));
          box-shadow: 0 24px 80px rgba(0,0,0,0.24);
        }

        .cookie-policy-hero-copy {
          position: relative;
          z-index: 1;
          max-width: 700px;
        }

        .cookie-policy-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 20px;
          color: var(--policy-green);
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .cookie-policy-kicker svg {
          color: var(--policy-pink);
        }

        .cookie-policy-title {
          margin: 0;
          color: #fff;
          font-size: clamp(52px, 8vw, 82px);
          font-weight: 760;
          letter-spacing: -0.065em;
          line-height: 0.92;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .cookie-policy-intro {
          max-width: 66ch;
          margin: 24px 0 0;
          color: #C7CBD3;
          font-size: 16px;
          line-height: 1.75;
        }

        .cookie-policy-intro strong {
          color: var(--policy-blue);
          font-weight: 650;
        }

        .cookie-policy-visual {
          position: relative;
          display: grid;
          min-height: 220px;
          place-items: center;


        }

        .cookie-policy-visual::before,
        .cookie-policy-visual::after {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--policy-green);
          box-shadow: 0 0 24px rgba(209,244,140,0.5);
          content: "";
        }

        .cookie-policy-visual::before {
          top: 24px;
          right: 28px;
        }

        .cookie-policy-visual::after {
          bottom: 32px;
          left: 28px;
          width: 6px;
          height: 6px;
          background: var(--policy-pink);
          box-shadow: 0 0 20px rgba(255,184,252,0.5);
        }

        .cookie-policy-visual img {
          display: block;
          width: min(78%, 220px);
          height: auto;
          border-radius: 50%;
          object-fit: contain;
        }

        .cookie-policy-visual-label {
          position: absolute;
          right: 14px;
          bottom: 12px;
          left: 14px;
          color: #9CA3AF;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-align: center;
          text-transform: uppercase;
        }

        .cookie-policy-layout {
          gap: clamp(32px, 6vw, 80px);
          margin-top: clamp(48px, 7vw, 80px);
        }

        .cookie-policy-index {
          position: sticky;
          top: 28px;
          align-self: start;
          max-height: calc(100vh - 56px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.18) transparent;
        }

        .cookie-policy-index-title {
          margin: 0 0 16px;
          color: var(--policy-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .cookie-policy-index-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .cookie-policy-index-link {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          align-items: start;
          gap: 8px;
          padding: 9px 10px;
          border-left: 2px solid transparent;
          color: #9299A5;
          font-size: 12px;
          line-height: 1.45;
          text-decoration: none;
          overflow-wrap: anywhere;
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }

        .cookie-policy-index-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.04);
        }

        .cookie-policy-index-link.is-active {
          border-left-color: var(--policy-green);
          color: #fff;
          background: rgba(195,219,255,0.08);
        }

        .cookie-policy-index-link.is-active .cookie-policy-index-number {
          color: var(--policy-green);
        }

        .cookie-policy-index-number {
          color: var(--policy-blue);
          font-variant-numeric: tabular-nums;
        }

        .cookie-policy-content {
          min-width: 0;
        }

        .cookie-policy-section {
          scroll-margin-top: 40px;
          padding: 0 0 34px;
          margin: 0 0 34px;
          border-bottom: 1px solid var(--policy-border);
        }

        .cookie-policy-section:last-child {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: 0;
        }

        .cookie-policy-section-heading {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin: 0 0 17px;
          color: #fff;
          font-size: clamp(23px, 2.4vw, 32px);
          font-weight: 650;
          letter-spacing: -0.035em;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .cookie-policy-section-number {
          flex: 0 0 auto;
          color: var(--policy-green);
          font-size: 0.62em;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.06em;
        }

        .cookie-policy-section p {
          max-width: 72ch;
          margin: 0 0 15px;
          color: #C7CBD3;
          font-size: 16px;
          line-height: 1.75;
          overflow-wrap: anywhere;
        }

        .cookie-policy-section p:last-child {
          margin-bottom: 0;
        }

        .cookie-policy-section ul {
          display: grid;
          gap: 11px;
          max-width: 72ch;
          margin: 17px 0 0;
          padding-left: 22px;
          color: #C7CBD3;
        }

        .cookie-policy-section li {
          padding-left: 4px;
          font-size: 16px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .cookie-policy-section li::marker {
          color: var(--policy-green);
        }

        .cookie-policy-section strong {
          color: #F3F4F6;
          font-weight: 650;
        }

        .cookie-policy-section .cookie-policy-note {
          margin-top: 16px;
          padding: 13px 15px;
          border: 1px solid rgba(195,219,255,0.12);
          border-radius: 10px;
          background: rgba(195,219,255,0.045);
          color: #C3DBFF;
          font-size: 14px;
        }

        .cookie-policy-email {
          display: inline-block;
          margin-top: 6px;
          color: var(--policy-blue);
          font-weight: 650;
          text-decoration: underline;
          text-decoration-color: rgba(195,219,255,0.4);
          text-underline-offset: 4px;
          overflow-wrap: anywhere;
        }

        .cookie-policy-email:hover {
          color: var(--policy-green);
        }

        .cookie-policy-revision {
          margin: 30px 0 0;
          color: #777F8B;
          font-size: 12px;
          line-height: 1.5;
        }

        .cookie-policy-page :focus-visible {
          outline: 3px solid rgba(195,219,255,0.65);
          outline-offset: 3px;
        }

        @media (max-width: 900px) {
          .cookie-policy-shell {
            padding-top: 24px;
          }

          .cookie-policy-hero {
            grid-template-columns: minmax(0, 1fr) 220px;
            gap: 28px;
            min-height: 300px;
            padding: 34px;
          }

          .cookie-policy-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 30px;
            margin-top: 48px;
          }

          .cookie-policy-index {
            position: static;
            max-height: none;
            padding-bottom: 22px;
            border-bottom: 1px solid var(--policy-border);
          }

          .cookie-policy-index-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 4px 12px;
          }
        }

        @media (max-width: 600px) {
          .cookie-policy-shell {
            width: min(100% - 28px, 1240px);
            padding: 18px 0 64px;
          }

          .cookie-policy-hero {
            grid-template-columns: minmax(0, 1fr);
            gap: 22px;
            padding: 27px 22px 22px;
            border-radius: 12px;
          }

          .cookie-policy-kicker {
            margin-bottom: 15px;
          }

          .cookie-policy-title {
            font-size: clamp(48px, 14vw, 68px);
          }

          .cookie-policy-intro {
            margin-top: 18px;
            font-size: 15px;
          }

          .cookie-policy-visual {
            min-height: 190px;
          }

          .cookie-policy-visual img {
            width: min(62%, 185px);
          }

          .cookie-policy-index-list {
            grid-template-columns: minmax(0, 1fr);
          }

          .cookie-policy-layout {
            gap: 28px;
            margin-top: 38px;
          }

          .cookie-policy-section {
            padding-bottom: 27px;
            margin-bottom: 27px;
          }

          .cookie-policy-section-heading {
            gap: 10px;
            font-size: 23px;
          }

          .cookie-policy-section p,
          .cookie-policy-section li {
            font-size: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }

          .cookie-policy-page *,
          .cookie-policy-page *::before,
          .cookie-policy-page *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="cookie-policy-grid" />

      <Motion.nav
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
      </Motion.nav>

      <div className="cookie-policy-shell">
        <header className="cookie-policy-hero">
          <div className="cookie-policy-hero-copy">
            <h1 className="cookie-policy-title">Cookie Policy</h1>
            <p className="cookie-policy-intro">
              This Cookie Policy explains how <strong>Intervyo</strong> (“we”,
              “our”, or “us”) uses cookies and similar technologies when you
              visit or interact with our AI-powered interview preparation
              platform.
            </p>
          </div>
          <div className="cookie-policy-visual">
            <img src={cookieIllustration} alt="Illustration of cookies" />
 
          </div>
        </header>

        <div className="cookie-policy-layout flex flex-row justify-around mx-auto">
          <aside
            className="cookie-policy-index"
            aria-label="Cookie policy sections"
          >
            <h2 className="cookie-policy-index-title">On this page</h2>
            <ol className="cookie-policy-index-list">
              {sections.map((section) => {
                const isActive = activeSection === section.number;

                return (
                  <li key={section.number}>
                    <a
                      href={`#cookie-policy-section-${section.number}`}
                      className={`cookie-policy-index-link ${
                        isActive ? "is-active" : ""
                      }`}
                      aria-current={isActive ? "location" : undefined}
                    >
                      <span className="cookie-policy-index-number">
                        {section.number}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </aside>

          <article className="cookie-policy-content">
            {sections.map((section) => (
              <section
                key={section.number}
                id={`cookie-policy-section-${section.number}`}
                data-section={section.number}
                className="cookie-policy-section"
              >
                <h2 className="cookie-policy-section-heading">
                  <span className="cookie-policy-section-number">
                    {section.number}
                  </span>
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}

            <p className="cookie-policy-revision">
              Last updated: 31 January 2026
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
