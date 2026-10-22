import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Bell,
  Menu,
  X,
  Crown,
  Settings,
  LogOut,
  Search,
  ArrowUpRight,
  ChevronDown,
  BookOpen,
  Globe,
  Code2,
  Server,
  Layers,
  Network,
  BarChart3,
  Rocket,
  Smartphone,
  BrainCircuit,
} from "lucide-react";
import {
  siDiagramsdotnet,
  siDocker,
  siExpress,
  siJavascript,
  siKubernetes,
  siLeetcode,
  siMongodb,
  siMysql,
  siNodedotjs,
  siPytorch,
  siPython,
  siReact,
  siTensorflow,
  siTypescript,
} from "simple-icons";
import ModuleContentPage from "./ModuleContentPage";
import { TopicDetailPage } from "./TopicDetailPage";
import { logout } from "../../services/operations/authAPI";
import ThemeToggle from "../ThemeToggle";
import { ThemeContext } from "../shared/ThemeContext";
import logo from "../../assets/intervyologo.png";
import { BASE_URL } from "../../services/apis.js";

const API_BASE_URL = `${BASE_URL}/learning-hub`;

async function getResponseError(response, fallback) {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

/* ─── Nike Design System ─────────────────────────────────────────── */
const NIKE_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500&display=swap");

.nk-root {
  --nk-ink: #111111;
  --nk-on-ink: #ffffff;
  --nk-canvas: #ffffff;
  --nk-cloud: #f5f5f5;
  --nk-hairline: #cacacb;
  --nk-hairline-soft: #e5e5e5;
  --nk-charcoal: #39393b;
  --nk-mute: #707072;
  --nk-stone: #9e9ea0;
  --nk-success: #007d48;
  --nk-sale: #d30005;
  --nk-ease: cubic-bezier(0.22, 1, 0.36, 1);
  font-family: "Helvetica Now Text", "Helvetica Neue", "Inter", Helvetica, Arial, sans-serif;
  font-size: 16px; font-weight: 400; line-height: 1.5; letter-spacing: 0;
  background: var(--nk-canvas); color: var(--nk-ink);
  -webkit-font-smoothing: antialiased; min-height: 100vh; overflow-x: hidden;
}
.nk-root[data-nk-theme="dark"] {
  --nk-ink: #ffffff; --nk-on-ink: #111111; --nk-canvas: #111111; --nk-cloud: #1f1f21;
  --nk-hairline: #39393b; --nk-hairline-soft: #2a2a2c; --nk-charcoal: #cacacb;
  --nk-mute: #9e9ea0; --nk-success: #1eaa52;
}
.nk-root *, .nk-root *::before, .nk-root *::after { box-sizing: border-box; }
.nk-root button { font: inherit; color: inherit; cursor: pointer; }
.nk-root a { color: inherit; text-decoration: none; }

/* Typography */
.nk-h-xl { font-family: "Helvetica Now Display", "Helvetica Neue", "Inter", sans-serif; font-size: 32px; font-weight: 500; line-height: 1.2; text-transform: uppercase; }
.nk-h-lg { font-size: 24px; font-weight: 500; line-height: 1.2; }
.nk-h-md { font-size: 16px; font-weight: 500; line-height: 1.75; }
.nk-body-strong { font-size: 16px; font-weight: 500; line-height: 1.5; }
.nk-caption { font-size: 14px; font-weight: 500; line-height: 1.5; }
.nk-caption-sm { font-size: 12px; font-weight: 500; line-height: 1.5; }
.nk-mute { color: var(--nk-mute); }

/* Layout */
.nk-container { width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 48px; }
.nk-section { padding-top: 48px; }
.nk-section-last { padding-bottom: 80px; }
.nk-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 24px; }

/* Utility bar */
.nk-utility { background: var(--nk-cloud); height: 36px; font-size: 12px; font-weight: 500; }
.nk-utility .nk-container { height: 100%; display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
.nk-utility a, .nk-utility button { background: none; border: 0; padding: 0; font-size: 12px; font-weight: 500; }
.nk-utility a:hover, .nk-utility button:hover { color: var(--nk-mute); }

/* Nav */
.nk-nav { position: sticky; top: 0; z-index: 60; height: 60px; background: var(--nk-canvas); transition: box-shadow .3s ease; }
.nk-nav[data-scrolled="true"] { box-shadow: inset 0 -1px 0 var(--nk-hairline-soft); }
.nk-nav .nk-container { height: 100%; display: flex; align-items: center; justify-content: space-between; }
.nk-nav-links { display: flex; align-items: center; gap: 28px; height: 100%; }
.nk-nav-link { position: relative; height: 100%; display: inline-flex; align-items: center; font-size: 16px; font-weight: 500; }
.nk-nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: 8px; height: 2px; background: var(--nk-ink); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--nk-ease); }
.nk-nav-link:hover::after, .nk-nav-link[aria-current="page"]::after { transform: scaleX(1); }
.nk-nav-right { display: flex; align-items: center; gap: 8px; }

/* Buttons */
.nk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 32px; border-radius: 30px; border: 0; font-size: 16px; font-weight: 500; line-height: 1.5; white-space: nowrap; transition: transform .18s var(--nk-ease), opacity .18s ease, background-color .25s ease; }
.nk-btn-primary { background: var(--nk-ink); color: var(--nk-on-ink) !important; }
.nk-btn-secondary { background: var(--nk-cloud); color: var(--nk-ink); }
.nk-btn-sm { height: 40px; padding: 0 20px; font-size: 14px; }
.nk-btn:hover { opacity: 0.88; }
.nk-btn-primary:hover { background: var(--nk-charcoal); opacity: 1; }
.nk-btn-secondary:hover { background: var(--nk-hairline-soft); opacity: 1; }
.nk-btn:active { transform: scale(0.96); }
.nk-icon-btn { position: relative; width: 40px; height: 40px; border-radius: 9999px; border: 0; background: transparent; display: inline-flex; align-items: center; justify-content: center; transition: background-color .25s ease, transform .18s var(--nk-ease); }
.nk-icon-btn:hover { background: var(--nk-cloud); }
.nk-icon-btn:active { transform: scale(0.85); }
.nk-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); border-radius: 30px; padding: 4px 12px; font-size: 12px; font-weight: 500; line-height: 1.5; color: var(--nk-ink); }
.nk-avatar { width: 32px; height: 32px; border-radius: 9999px; background: var(--nk-ink); color: var(--nk-on-ink); display: inline-flex; align-items: center; justify-content: center; overflow: hidden; font-size: 14px; font-weight: 500; }

/* Tiles */
.nk-tile { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; transition: background-color .3s ease, transform .25s var(--nk-ease); border: 1px solid var(--nk-hairline); }
.nk-tile:hover { background: var(--nk-hairline-soft); }
.nk-stat-card { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--nk-hairline); transition: background-color .25s ease; }
.nk-stat-card:hover { background: var(--nk-hairline-soft); }

/* Search & Select */
.nk-search-wrap { position: relative; }
.nk-search-wrap input { width: 100%; height: 48px; padding: 0 20px 0 48px; border: 1px solid var(--nk-hairline); border-radius: 30px; background: var(--nk-canvas); color: var(--nk-ink); font: inherit; font-size: 15px; outline: none; transition: border-color .25s ease; }
.nk-search-wrap input::placeholder { color: var(--nk-stone); }
.nk-search-wrap input:focus { border-color: var(--nk-ink); }
.nk-search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--nk-mute); }

/* Menus & Drawer */
.nk-menu { position: absolute; right: 0; top: calc(100% + 8px); width: 340px; max-height: 440px; overflow-y: auto; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); z-index: 80; animation: nk-menu-in .28s var(--nk-ease) both; transform-origin: top right; }
.nk-menu-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; font-size: 14px; font-weight: 500; background: none; border: 0; text-align: left; transition: background-color .2s ease; }
.nk-menu-item:hover { background: var(--nk-cloud); }
.nk-drawer-scrim { position: fixed; inset: 0; background: rgba(17,17,17,0.5); z-index: 90; animation: nk-fade .3s ease both; }
.nk-drawer { position: fixed; top: 0; bottom: 0; left: 0; width: min(88vw, 360px); background: var(--nk-canvas); z-index: 95; overflow-y: auto; padding: 16px 24px 48px; animation: nk-drawer-in .4s var(--nk-ease) both; }
.nk-drawer a, .nk-drawer .nk-drawer-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 24px 0 0; background: none; border: 0; text-align: left; font-size: 24px; font-weight: 500; line-height: 1.2; }

/* Reveal */
.nk-reveal { opacity: 0; transform: translateY(24px); transition: opacity .75s var(--nk-ease), transform .75s var(--nk-ease); }
.nk-reveal.is-in { opacity: 1; transform: none; }

@keyframes nk-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes nk-menu-in { from { opacity: 0; transform: translateY(-8px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes nk-drawer-in { from { transform: translateX(-100%); } to { transform: none; } }
@keyframes nk-spin { to { transform: rotate(360deg); } }

@media (max-width: 960px) { .nk-nav-links { display: none; } }
@media (min-width: 961px) { .nk-hamburger { display: none; } }
@media (max-width: 640px) {
  .nk-container { padding-left: 20px; padding-right: 20px; }
  .nk-head { align-items: flex-start; }
}
`;

/* ─── Reveal hook ────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}
function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, inView] = useInView();
  return React.createElement(
    Tag,
    {
      ref,
      className: `nk-reveal ${inView ? "is-in" : ""} ${className}`,
      style: { transitionDelay: `${delay}ms` },
      ...rest,
    },
    children,
  );
}

function getCourseIcons(topic) {
  const searchableText = [
    topic.title,
    topic.domain,
    ...(Array.isArray(topic.tags) ? topic.tags : []),
  ]
    .join(" ")
    .toLowerCase();

  if (/react[\s.-]*native/.test(searchableText)) return [siReact];
  if (/docker/.test(searchableText) && /kubernetes|k8s/.test(searchableText)) {
    return [siDocker, siKubernetes];
  }
  if (/machine[\s-]*learning|\bml\b/.test(searchableText)) {
    return [siTensorflow, siPytorch];
  }
  if (/full[\s-]*stack|\bmern\b/.test(searchableText)) {
    return [siReact, siNodedotjs, siMongodb];
  }
  if (/node(?:\.js|js)?/.test(searchableText) && /express/.test(searchableText)) {
    return [siNodedotjs, siExpress];
  }
  if (/system[\s-]*design/.test(searchableText)) return [siDiagramsdotnet];
  if (/mongo(?:db)?/.test(searchableText)) return [siMongodb];
  if (/\breact\b/.test(searchableText)) return [siReact];
  if (/typescript/.test(searchableText)) return [siTypescript];
  if (/javascript|\bes6\b/.test(searchableText)) return [siJavascript];
  if (/python/.test(searchableText)) return [siPython];
  if (/docker/.test(searchableText)) return [siDocker];
  if (/kubernetes|\bk8s\b/.test(searchableText)) return [siKubernetes];
  if (/leetcode|data[\s-]*structures|algorithms|\bdsa\b/.test(searchableText)) {
    return [siLeetcode];
  }
  if (/\bsql\b|database/.test(searchableText)) return [siMysql];

  return [];
}

function CourseBrandIcons({ topic }) {
  const icons = getCourseIcons(topic);

  if (icons.length === 0) {
    return <BookOpen size={24} aria-label={`${topic.title} course`} />;
  }

  return icons.map((icon) => (
    <svg
      key={icon.slug}
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill={`#${icon.hex}`}
      focusable="false"
    >
      <path d={icon.path} />
    </svg>
  ));
}

export default function LearningHub() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.profile);
  const { token } = useSelector((state) => state.auth);
  const { theme } = useContext(ThemeContext);
  const nkTheme = theme === "dark" ? "dark" : "light";

  const [currentView, setCurrentView] = useState("hub");
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [enrollingTopicId, setEnrollingTopicId] = useState(null);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    enrolledCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    totalTimeSpent: 0,
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = React.useRef(null);

  const subscriptionLabel = user?.subscription?.plan?.toUpperCase() || "FREE";

  const domains = [
    { name: "All Topics", value: "all", icon: Globe },
    { name: "Frontend", value: "Frontend", icon: Code2 },
    { name: "Backend", value: "Backend", icon: Server },
    { name: "Fullstack", value: "Fullstack", icon: Layers },
    { name: "System Design", value: "System Design", icon: Network },
    { name: "Data Science", value: "Data Science", icon: BarChart3 },
    { name: "DevOps", value: "DevOps", icon: Rocket },
    { name: "Mobile", value: "Mobile", icon: Smartphone },
    { name: "ML", value: "ML", icon: BrainCircuit },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setShowProfileMenu(false); setShowNotifications(false); setIsMobileMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (currentView !== "hub") return undefined;
    if (!token) {
      setError("Please sign in to view the Learning Hub.");
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedDomain !== "all") params.set("domain", selectedDomain);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const response = await fetch(
          `${API_BASE_URL}/topics?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          throw new Error(await getResponseError(response, "Failed to fetch topics."));
        }

        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || "The server returned invalid topic data.");
        }
        setTopics(data.data);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Failed to fetch topics.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, searchQuery ? 300 : 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [currentView, selectedDomain, searchQuery, token]);

  useEffect(() => {
    if (currentView !== "hub" || !token) return undefined;

    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(await getResponseError(response, "Failed to fetch learning stats."));
        }

        const data = await response.json();
        if (!data.success || !data.data) {
          throw new Error(data.message || "The server returned invalid learning stats.");
        }
        setStats((currentStats) => ({ ...currentStats, ...data.data }));
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Failed to fetch learning stats.");
        }
      }
    };

    fetchStats();
    return () => controller.abort();
  }, [currentView, token, statsRefreshKey]);

  const handleEnroll = async (topicId) => {
    if (!token || enrollingTopicId) return;
    setEnrollingTopicId(topicId);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`${API_BASE_URL}/topics/${topicId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(await getResponseError(response, "Failed to enroll. Please try again."));
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to enroll. Please try again.");
      }

      setNotice(`${data.message || "Successfully enrolled."} You earned ${data.data?.xpAwarded || 0} XP.`);
      setStatsRefreshKey((key) => key + 1);
      setTopics((currentTopics) =>
        currentTopics.map((topic) =>
          topic._id === topicId
            ? { ...topic, isEnrolled: true, userProgress: data.data?.progress || null }
            : topic,
        ),
      );
    } catch (enrollError) {
      setError(enrollError.message || "Failed to enroll. Please try again.");
    } finally {
      setEnrollingTopicId(null);
    }
  };

  const visibleTopics =
    activeTab === "enrolled" ? topics.filter((topic) => topic.isEnrolled) : topics;

  const handleTopicSelect = (topicId) => {
    setSelectedTopicId(topicId);
    setCurrentView("topic");
    window.scrollTo(0, 0);
  };

  const handleModuleSelect = (moduleId) => {
    setSelectedModuleId(moduleId);
    setCurrentView("module");
    window.scrollTo(0, 0);
  };

  const renderNotifications = () => (
    <div className="nk-menu" role="region" aria-label="Notifications">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--nk-hairline)" }}>
        <h3 className="nk-body-strong">Notifications</h3>
      </div>
      <div className="px-4 py-10 text-center">
        <Bell className="mx-auto mb-2 nk-mute" size={28} />
        <p className="nk-caption nk-mute">No notifications yet</p>
      </div>
    </div>
  );

  if (currentView === "module" && selectedModuleId) {
    return (
      <ModuleContentPage
        moduleId={selectedModuleId}
        token={token}
        onBack={() => setCurrentView("topic")}
        onNextModule={handleModuleSelect}
        onPrevModule={handleModuleSelect}
      />
    );
  }

  if (currentView === "topic" && selectedTopicId) {
    return (
      <TopicDetailPage
        topicId={selectedTopicId}
        token={token}
        onBack={() => setCurrentView("hub")}
        onModuleSelect={handleModuleSelect}
      />
    );
  }

  if (loading && topics.length === 0) {
    return (
      <div className="nk-root flex items-center justify-center" data-nk-theme={nkTheme} style={{ minHeight: "100vh" }}>
        <style>{NIKE_CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--nk-hairline)", borderTopColor: "var(--nk-ink)", borderRadius: "50%", animation: "nk-spin .8s linear infinite", margin: "0 auto 16px" }} />
          <p className="nk-caption nk-mute">Loading learning hub…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nk-root" data-nk-theme={nkTheme}>
      <style>{NIKE_CSS}</style>

      {/* ── Utility bar ── */}
      <div className="nk-utility">
        <div className="nk-container">
          <Link to="/blog">Blog</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/subscription">Subscription</Link>
          <button onClick={() => dispatch(logout(navigate))}>Logout</button>
        </div>
      </div>

      {/* ── Primary nav ── */}
      <header className="nk-nav" data-scrolled={isScrolled}>
        <div className="nk-container">
          <div className="flex items-center gap-2">
            <button className="nk-icon-btn nk-hamburger" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <Link to="/" aria-label="Intervyo home" className="flex items-center gap-2">
              <img src={logo} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
              <span className="nk-h-md hidden sm:inline" style={{ textTransform: "uppercase" }}>Intervyo</span>
            </Link>
          </div>

          <nav className="nk-nav-links" aria-label="Primary">
            <Link to="/dashboard" className="nk-nav-link">Dashboard</Link>
            <Link to="/interview-setup" className="nk-nav-link">Interview</Link>
            <Link to="/analytics" className="nk-nav-link">Analytics</Link>
            <Link to="/history" className="nk-nav-link">History</Link>
            <Link to="/leaderboard" className="nk-nav-link">Leaderboard</Link>
          </nav>

          <div className="nk-nav-right">
            <ThemeToggle />
            <div className="relative">
              <button className="nk-icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }} aria-label="Notifications" aria-expanded={showNotifications}>
                <Bell size={20} />
              </button>
              {showNotifications && renderNotifications()}
            </div>
            <div ref={profileMenuRef} className="relative hidden sm:block">
              <button className="nk-icon-btn" onClick={(e) => { e.stopPropagation(); setShowProfileMenu((p) => !p); setShowNotifications(false); }} aria-haspopup="menu" aria-expanded={showProfileMenu} aria-label="Account menu" style={{ width: "auto", padding: "0 8px 0 4px", gap: 6 }}>
                <span className="nk-avatar">
                  {user?.profilePicture ? <img src={user.profilePicture} className="h-full w-full object-cover" alt="Profile" /> : user?.name?.charAt(0) || "U"}
                </span>
                <ChevronDown size={16} style={{ transition: "transform .3s var(--nk-ease)", transform: showProfileMenu ? "rotate(180deg)" : "none" }} />
              </button>
              {showProfileMenu && (
                <div className="nk-menu" role="menu" style={{ width: 260 }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--nk-hairline)" }}>
                    <div className="nk-body-strong">{user?.name || "User"}</div>
                    <div className="nk-caption-sm nk-mute truncate">{user?.email || ""}</div>
                    <span className="nk-chip mt-2"><Crown size={12} /> {subscriptionLabel}</span>
                  </div>
                  <button role="menuitem" className="nk-menu-item" onClick={() => { navigate("/settings"); setShowProfileMenu(false); }}>
                    <Settings size={16} /> Profile Settings
                  </button>
                  <button role="menuitem" className="nk-menu-item" onClick={() => { navigate("/subscription"); setShowProfileMenu(false); }}>
                    <Crown size={16} /> Subscription
                  </button>
                  <button role="menuitem" className="nk-menu-item" style={{ borderTop: "1px solid var(--nk-hairline)" }} onClick={() => dispatch(logout(navigate))}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {isMobileMenuOpen && (
        <>
          <div className="nk-drawer-scrim" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="nk-drawer" aria-label="Menu">
            <div className="flex items-center justify-between">
              <span className="nk-h-md" style={{ textTransform: "uppercase" }}>Intervyo</span>
              <button className="nk-icon-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu"><X size={22} /></button>
            </div>
            {["/dashboard", "/interview-setup", "/analytics", "/history", "/leaderboard", "/blog", "/settings", "/subscription"].map((href, i) => (
              <Link key={href} to={href} onClick={() => setIsMobileMenuOpen(false)}>
                {["Dashboard","Interview","Analytics","History","Leaderboard","Blog","Profile Settings","Subscription"][i]}
              </Link>
            ))}
            <button className="nk-drawer-item" onClick={() => dispatch(logout(navigate))}>Logout</button>
          </aside>
        </>
      )}

      {/* ── Main Content ── */}
      <main className="nk-container nk-section nk-section-last">
        <Reveal>
          <div className="nk-head" style={{ marginBottom: 32 }}>
            <div>
              <h1 className="nk-h-xl">Learning Hub</h1>
              <p className="nk-mute mt-1">Expand your skills with AI-powered courses and modules</p>
            </div>
          </div>
        </Reveal>

        {error && (
          <div className="nk-tile mb-6" style={{ borderColor: "var(--nk-sale)" }}>
            <p className="nk-caption" style={{ color: "var(--nk-sale)" }}>{error}</p>
          </div>
        )}
        {notice && (
          <div className="nk-tile mb-6" role="status" style={{ borderColor: "var(--nk-success)" }}>
            <p className="nk-caption" style={{ color: "var(--nk-success)" }}>{notice}</p>
          </div>
        )}

        {/* Stats Strip */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Enrolled", value: stats.enrolledCount },
            { label: "Completed", value: stats.completedCount },
            { label: "In Progress", value: stats.inProgressCount },
            { label: "Time Invested", value: `${Math.floor(stats.totalTimeSpent / 60)}h` },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 60} className="nk-stat-card" style={{ borderRadius: 0 }}>
              <span className="nk-caption-sm nk-mute" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              <span className="nk-h-xl" style={{ marginTop: 12, textTransform: "none", fontSize: 28 }}>{s.value}</span>
            </Reveal>
          ))}
        </section>

        {/* Search & Tabs */}
        <Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 24 }}>
            <div className="nk-search-wrap" style={{ flex: "1 1 300px" }}>
              <Search size={16} className="nk-search-icon" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setActiveTab("all")}
                className={`nk-btn nk-btn-sm ${activeTab === "all" ? "nk-btn-primary" : "nk-btn-secondary"}`}
              >
                All Topics
              </button>
              <button
                onClick={() => setActiveTab("enrolled")}
                className={`nk-btn nk-btn-sm ${activeTab === "enrolled" ? "nk-btn-primary" : "nk-btn-secondary"}`}
              >
                My Learning
              </button>
            </div>
          </div>

          {/* Domain Chips */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 40 }} className="no-scrollbar">
            {domains.map((domain) => (
              <button
                key={domain.value}
                onClick={() => setSelectedDomain(domain.value)}
                className="nk-chip"
                aria-pressed={selectedDomain === domain.value}
                style={{
                  cursor: "pointer",
                  borderColor: selectedDomain === domain.value ? "var(--nk-ink)" : "var(--nk-hairline)",
                  background: selectedDomain === domain.value ? "var(--nk-ink)" : "var(--nk-canvas)",
                  color: selectedDomain === domain.value ? "var(--nk-on-ink)" : "var(--nk-ink)",
                }}
              >
                <domain.icon size={14} aria-hidden="true" />
                <span>{domain.name}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Topics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 24 }}>
          {visibleTopics.map((topic, idx) => (
            <Reveal key={topic._id} delay={idx * 50}>
              <div
                onClick={() => handleTopicSelect(topic._id)}
                className="nk-tile"
                style={{ cursor: "pointer", height: "100%", justifyContent: "space-between" }}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      aria-label={`${topic.title} course logo`}
                      style={{
                        width: 48,
                        height: 48,
                        background: "var(--nk-cloud)",
                        border: "1px solid var(--nk-hairline)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <CourseBrandIcons topic={topic} />
                    </div>
                    <span className="nk-chip" style={{ textTransform: "capitalize" }}>
                      {topic.difficulty || "All Levels"}
                    </span>
                  </div>
                  <h3 className="nk-h-lg mb-2">{topic.title}</h3>
                  <p className="nk-caption nk-mute mb-6" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {topic.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-4 nk-caption-sm nk-mute mb-4" style={{ borderTop: "1px solid var(--nk-hairline)", paddingTop: 12 }}>
                    <span>{topic.estimatedHours || 10}h curriculum</span>
                    <span>•</span>
                    <span>{topic.domain || "General"}</span>
                  </div>
                  {topic.isEnrolled ? (
                    <button className="nk-btn nk-btn-secondary w-full nk-btn-sm" style={{ width: "100%" }}>
                      Continue Learning <ArrowUpRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(topic._id);
                      }}
                      className="nk-btn nk-btn-primary w-full nk-btn-sm"
                      style={{ width: "100%" }}
                      disabled={Boolean(enrollingTopicId)}
                    >
                      {enrollingTopicId === topic._id ? "Enrolling..." : "Enroll Now"} <ArrowUpRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {visibleTopics.length === 0 && !loading && (
          <Reveal>
            <div className="nk-tile" style={{ alignItems: "center", textAlign: "center", padding: "80px 24px" }}>
              <h3 className="nk-h-xl mb-3">No topics found</h3>
              <p className="nk-mute mb-6">Try adjusting your search terms or domain filters.</p>
              <button
                className="nk-btn nk-btn-primary"
                onClick={() => { setSearchQuery(""); setSelectedDomain("all"); setActiveTab("all"); }}
              >
                Reset Filters
              </button>
            </div>
          </Reveal>
        )}
      </main>
    </div>
  );
}