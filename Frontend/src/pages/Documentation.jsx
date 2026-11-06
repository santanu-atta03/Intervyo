import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  CircleHelp,
  Command,
  Mail,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/shared/SEO";
import "./Documentation.css";

const GUIDE_IMAGES = {
  welcome:
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
  "first-session":
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85",
  "voice-video":
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=85",
  feedback:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
  progress:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
  account:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85",
};

const guideIcons = {
  welcome: Sparkles,
  "first-session": Target,
  "voice-video": Mic,
  feedback: BookOpen,
  progress: ChartNoAxesCombined,
  account: ShieldCheck,
};

const guides = [
  {
    id: "welcome",
    number: "01",
    title: "Meet your new practice partner",
    summary:
      "A quick orientation to Intervyo and how to get the most out of your preparation.",
    accent: "lime",
    steps: [
      {
        title: "Make practice intentional",
        description:
          "Choose the role or interview skill you want to work on before starting a session.",
      },
      {
        title: "Treat each session like the real thing",
        description:
          "Answer in your own words, explain your reasoning, and speak aloud when practicing voice delivery.",
      },
      {
        title: "Turn feedback into your next drill",
        description:
          "Review the feedback after each interview and use one specific improvement as the focus for your next attempt.",
      },
    ],
    note: "Short, consistent sessions make it easier to spot progress and build confidence.",
    keywords: "overview getting started preparation",
  },
  {
    id: "first-session",
    number: "02",
    title: "Start your first practice interview",
    summary:
      "Get from the setup screen to a focused mock interview in a few steps.",
    accent: "blue",
    steps: [
      {
        title: "Open Interview Setup",
        description:
          "Choose Start Free on the landing page or go directly to Interview Setup.",
      },
      {
        title: "Follow the setup prompts",
        description:
          "Select the options that best match the role and practice session you want to prepare for.",
      },
      {
        title: "Settle in and begin",
        description:
          "Check your audio and video permissions if you plan to use them, then focus on answering each prompt clearly.",
      },
    ],
    link: { to: "/interview-setup", label: "Open Interview Setup" },
    note: "For the most realistic practice, use a quiet space and allow microphone or camera access when prompted.",
    keywords: "mock interview setup role begin session",
  },
  {
    id: "voice-video",
    number: "03",
    title: "Make voice practice work for you",
    summary:
      "Prepare your setup and build the delivery habits that are hard to practice silently.",
    accent: "pink",
    steps: [
      {
        title: "Check your browser permissions",
        description:
          "Allow microphone or camera access when your chosen practice mode requests it. You can review site permissions in your browser settings.",
      },
      {
        title: "Keep your setup simple",
        description:
          "Use a quiet, well-lit space, position your microphone comfortably, and close apps that may interrupt your session.",
      },
      {
        title: "Practice your delivery",
        description:
          "Speak at a natural pace, organize your answer before you begin, and pause briefly when you need to gather your thoughts.",
      },
    ],
    note: "A webcam and microphone are recommended for a realistic experience; some practice modes may work without video.",
    keywords: "microphone camera permissions audio speaking video",
  },
  {
    id: "feedback",
    number: "04",
    category: "Improve",
    summary:
      "Use interview feedback as a clear next step, not just a score to glance at.",
    accent: "lime",
    steps: [
      {
        title: "Look beyond the overall score",
        description:
          "Review the details of your response, including its clarity, structure, completeness, and technical depth.",
      },
      {
        title: "Choose one improvement",
        description:
          "Pick the most useful piece of feedback and make it your focus for the next answer or practice session.",
      },
      {
        title: "Try again and compare",
        description:
          "Retake a session to practice your response and see how your performance changes over time.",
      },
    ],
    note: "AI feedback is a practice aid. It is not a hiring decision or a guarantee of interview or employment outcomes.",
    keywords: "AI scores feedback analytics structure clarity accuracy",
  },
  {
    id: "progress",
    number: "05",
    category: "Improve",
    summary:
      "Use your analytics to notice patterns, celebrate improvements, and plan what to practice next.",
    accent: "blue",
    steps: [
      {
        title: "Review your recent sessions",
        description:
          "Look for recurring strengths and areas to improve across your completed interviews.",
      },
      {
        title: "Notice changes over time",
        description:
          "Compare your results across attempts to understand which practice habits are helping.",
      },
      {
        title: "Plan the next session",
        description:
          "Turn a pattern you noticed into one focused goal for your next interview.",
      },
    ],
    link: { to: "/analytics", label: "View Analytics" },
    note: "Your analytics are available after signing in and completing practice sessions.",
    keywords: "progress history trends dashboard scores results",
  },
  {
    id: "account",
    number: "06",
    title: "Plans, privacy, and account help",
    summary:
      "Find answers about plans, your information, and where to go when you need a hand.",
    accent: "pink",
    steps: [
      {
        title: "Explore plans",
        description:
          "Review the current features and plan details on the Pricing page before choosing an option.",
      },
      {
        title: "Understand your data",
        description:
          "Read the Privacy Policy and Cookie Policy to learn how Intervyo describes its data and cookie practices.",
      },
      {
        title: "Get more help",
        description:
          "Browse frequently asked questions or contact the support team if you need assistance.",
      },
    ],
    links: [
      { to: "/pricing", label: "View plans" },
      { to: "/privacy", label: "Privacy policy" },
      { to: "/cookie-policy", label: "Cookie policy" },
      { to: "/faq", label: "Visit FAQ" },
      { to: "/contact", label: "Contact support" },
    ],
    note: "Questions about billing or access? Contact support with the email address associated with your account.",
    keywords: "pricing plans billing privacy cookies support account",
  },
];

export default function Documentation() {
  const [query, setQuery] = useState("");
  const [activeGuide, setActiveGuide] = useState(guides[0].id);

  const visibleGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return guides;

    return guides.filter((guide) =>
      [
        guide.title,
        guide.summary,
        guide.category,
        guide.keywords,
        ...guide.steps.flatMap((step) => [step.title, step.description]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  useEffect(() => {
    const handleScroll = () => {
      const activationLine = window.innerHeight * 0.32;
      let currentGuide = visibleGuides[0]?.id || guides[0].id;

      visibleGuides.forEach((guide) => {
        const element = document.getElementById(`guide-${guide.id}`);

        if (element && element.getBoundingClientRect().top <= activationLine) {
          currentGuide = guide.id;
        }
      });

      setActiveGuide(currentGuide);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleGuides]);

  const scrollToGuide = (guideId) => {
    setActiveGuide(guideId);

    document.getElementById(`guide-${guideId}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <main className="documentation-page">
      <SEO
        title="Documentation | Intervyo"
        description="Learn how to get started with Intervyo, practice interviews, understand AI feedback, and make progress with focused guides."
        canonical="/docs"
      />

      <nav className="documentation-nav">
        <Link
          to="/"
          className="rounded-full px-5 py-2.5 text-[#171717] shadow-lg shadow-black/20 transition "
        >
          <span className="nav-heading font-[Fk Screamer] font-heading text-[30px] font-extrabold leading-none">
            Intervyo
          </span>
        </Link>

        <div className="documentation-nav__actions">
          <Link to="/" className="documentation-nav__back">
            <ArrowLeft size={15} />
            Back to site
          </Link>

          <Link to="/interview-setup" className="documentation-nav__cta">
            Start practicing
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <section className="documentation-hero">
        <div className="documentation-hero__grid" />
        <div className="documentation-hero__glow" />

        <div className="documentation-hero__content">
          <h1>
            Practice with
            <br />
            <em>purpose.</em>
          </h1>

          <p className="documentation-hero__summary">
            A guided path from your first practice session to confident,
            repeatable interview performance.
          </p>

          <div className="documentation-hero__actions">
            <button
              type="button"
              className="documentation-button documentation-button--primary"
              onClick={() => scrollToGuide("welcome")}
            >
              Begin the journey
              <ArrowDownRight size={16} />
            </button>

            <Link
              to="/interview-setup"
              className="documentation-button documentation-button--text"
            >
              Open Interview Setup
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        <div className="documentation-hero-card">
          <div className="documentation-hero-card__image">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85"
              alt="People collaborating around a table"
            />
          </div>

          <div className="documentation-hero-card__overlay" />

          <div className="documentation-hero-card__copy">
            <span>YOUR NEXT SESSION</span>
            <strong>
              Small reps.
              <br />
              <em>Real momentum.</em>
            </strong>

            <div className="documentation-hero-card__progress">
              <span />
            </div>

            <small>
              One focused goal at a time
              <Check size={14} />
            </small>
          </div>
        </div>
      </section>

      <section className="documentation-workspace">
        <aside className="documentation-sidebar">
          <div className="documentation-sidebar__heading">
            <div>
              <p className="documentation-overline">YOUR PATH</p>
              <h2>Read in order</h2>
            </div>

            <span>{visibleGuides.length.toString().padStart(2, "0")}</span>
          </div>

          <label className="documentation-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search guides"
              aria-label="Search documentation"
            />

            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={14} />
              </button>
            )}
          </label>

          <nav className="documentation-guide-nav">
            {visibleGuides.map((guide) => {
              const isActive = activeGuide === guide.id;

              return (
                <button
                  key={guide.id}
                  type="button"
                  className={`documentation-guide-link ${
                    isActive ? "is-active" : ""
                  }`}
                  onClick={() => scrollToGuide(guide.id)}
                >
                  <span>{guide.number}</span>

                  <strong>
                    {guide.title}
                    <small>{guide.category}</small>
                  </strong>

                  <ChevronRight size={14} />
                </button>
              );
            })}
          </nav>

          <div className="documentation-sidebar-card">
            <CircleHelp size={17} />
            <strong>Need a human?</strong>
            <p>We can help you keep moving.</p>

            <Link to="/contact">
              Talk to support
              <ArrowRight size={13} />
            </Link>
          </div>
        </aside>

        <div className="documentation-content">
          {visibleGuides.length > 0 ? (
            visibleGuides.map((guide, index) => {
              const Icon = guideIcons[guide.id] || Sparkles;

              return (
                <article
                  id={`guide-${guide.id}`}
                  key={guide.id}
                  className={`documentation-guide documentation-guide--${guide.accent}`}
                >
                  <div className="documentation-guide__chapter">
                    <span>CHAPTER {guide.number}</span>
                    <span>{guide.category}</span>
                  </div>

                  <div className="documentation-guide__visual">
                    <img src={GUIDE_IMAGES[guide.id]} alt="" loading="lazy" />

                    <div className="documentation-guide__visual-overlay" />

                    <div className="documentation-guide__visual-label">
                    
                      <span>{guide.category}</span>
                    </div>
                  </div>

                  <div className="documentation-guide__body">
                    <h2>{guide.title}</h2>

                    <p className="documentation-guide__summary">
                      {guide.summary}
                    </p>

                    <ol className="documentation-steps">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={step.title}>
                          <span>{String(stepIndex + 1).padStart(2, "0")}</span>

                          <div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className="documentation-guide__note">
                      <p>{guide.note}</p>
                    </div>

                    {guide.link && (
                      <Link
                        to={guide.link.to}
                        className="documentation-inline-link"
                      >
                        {guide.link.label}
                        <ArrowRight size={14} />
                      </Link>
                    )}

                    {guide.links && (
                      <div className="documentation-resource-links">
                        {guide.links.map((link) => (
                          <Link to={link.to} key={link.to}>
                            {link.label}
                            <ArrowRight size={13} />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="documentation-no-results">
              <Search size={22} />
              <h2>No guides found</h2>
              <p>Try a different search term.</p>
            </div>
          )}

          <section className="documentation-help">
            <div>
              <span>NEED A HUMAN?</span>
              <h2>Let&apos;s figure it out together.</h2>
              <p>
                If you cannot find what you are looking for, our support team
                can point you in the right direction.
              </p>
            </div>

            <Link to="/contact">
              Get in touch
              <ArrowRight size={15} />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
