import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  X,
  Crown,
  Settings,
  Search,
  Calendar,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { getAllInterviews } from "../../services/operations/aiInterviewApi";
import { logout } from "../../services/operations/authAPI";
import ThemeToggle from "../../components/ThemeToggle";
import { ThemeContext } from "../../components/shared/ThemeContext";
import BrandLogo from "../../components/shared/BrandLogo";

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
.nk-link { background: none; border: 0; padding: 0; font-size: 16px; font-weight: 500; text-decoration: underline; text-underline-offset: 3px; display: inline-flex; align-items: center; gap: 4px; }
.nk-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); border-radius: 30px; padding: 4px 12px; font-size: 12px; font-weight: 500; line-height: 1.5; color: var(--nk-ink); }
.nk-badge-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 9999px; background: var(--nk-sale); }
.nk-badge-dot::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: var(--nk-sale); animation: nk-ping 1.8s ease-out infinite; }
.nk-avatar { width: 32px; height: 32px; border-radius: 9999px; background: var(--nk-ink); color: var(--nk-on-ink); display: inline-flex; align-items: center; justify-content: center; overflow: hidden; font-size: 14px; font-weight: 500; }

/* Tiles */
.nk-tile { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; transition: background-color .3s ease; }
.nk-track { height: 4px; background: var(--nk-hairline-soft); overflow: hidden; }
.nk-fill { height: 100%; background: var(--nk-ink); transition: width 1.1s var(--nk-ease); }
.nk-fill-success { background: var(--nk-success); }
.nk-fill-warn { background: #e0a900; }
.nk-fill-sale { background: var(--nk-sale); }

/* Rows */
.nk-row { display: flex; align-items: center; gap: 16px; padding: 24px 0; border-top: 1px solid var(--nk-hairline); cursor: pointer; transition: background-color .25s ease, padding .35s var(--nk-ease); }
.nk-row:hover { background: var(--nk-cloud); padding-left: 16px; padding-right: 16px; }
.nk-score { width: 72px; height: 72px; background: var(--nk-cloud); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 28px; font-weight: 500; transition: background-color .25s ease, color .25s ease; }
.nk-row:hover .nk-score { background: var(--nk-ink); color: var(--nk-on-ink); }

/* Menus */
.nk-menu { position: absolute; right: 0; top: calc(100% + 8px); width: 340px; max-height: 440px; overflow-y: auto; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); z-index: 80; animation: nk-menu-in .28s var(--nk-ease) both; transform-origin: top right; }
.nk-menu-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; font-size: 14px; font-weight: 500; background: none; border: 0; text-align: left; transition: background-color .2s ease; }
.nk-menu-item:hover { background: var(--nk-cloud); }
.nk-drawer-scrim { position: fixed; inset: 0; background: rgba(17,17,17,0.5); z-index: 90; animation: nk-fade .3s ease both; }
.nk-drawer { position: fixed; top: 0; bottom: 0; left: 0; width: min(88vw, 360px); background: var(--nk-canvas); z-index: 95; overflow-y: auto; padding: 16px 24px 48px; animation: nk-drawer-in .4s var(--nk-ease) both; }
.nk-drawer a, .nk-drawer .nk-drawer-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 24px 0 0; background: none; border: 0; text-align: left; font-size: 24px; font-weight: 500; line-height: 1.2; }

/* Reveal */
.nk-reveal { opacity: 0; transform: translateY(24px); transition: opacity .75s var(--nk-ease), transform .75s var(--nk-ease); }
.nk-reveal.is-in { opacity: 1; transform: none; }

/* Stat cards */
.nk-stat-card { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; transition: background-color .25s ease; }
.nk-stat-card:hover { background: var(--nk-hairline-soft); }

/* Search */
.nk-search-wrap { position: relative; }
.nk-search-wrap input { width: 100%; height: 48px; padding: 0 20px 0 48px; border: 1px solid var(--nk-hairline); border-radius: 30px; background: var(--nk-canvas); color: var(--nk-ink); font: inherit; font-size: 15px; outline: none; transition: border-color .25s ease; }
.nk-search-wrap input::placeholder { color: var(--nk-stone); }
.nk-search-wrap input:focus { border-color: var(--nk-ink); }
.nk-search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--nk-mute); }

/* Select */
.nk-select { height: 48px; padding: 0 16px; border: 1px solid var(--nk-hairline); border-radius: 30px; background: var(--nk-canvas); color: var(--nk-ink); font: inherit; font-size: 14px; font-weight: 500; outline: none; transition: border-color .25s ease; appearance: none; cursor: pointer; }
.nk-select:focus { border-color: var(--nk-ink); }

/* Keyframes */
@keyframes nk-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes nk-menu-in { from { opacity: 0; transform: translateY(-8px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes nk-drawer-in { from { transform: translateX(-100%); } to { transform: none; } }
@keyframes nk-ping { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(3); opacity: 0; } }
@keyframes nk-spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (min-width: 1920px) { .nk-container { padding: 0 80px; } }
@media (max-width: 1023px) { .nk-container { padding: 0 32px; } }
@media (max-width: 960px) { .nk-nav-links { display: none; } }
@media (min-width: 961px) { .nk-hamburger { display: none; } }
@media (max-width: 599px) {
  .nk-container { padding: 0 16px; }
  .nk-menu { width: calc(100vw - 32px); right: -8px; }
  .nk-h-xl { font-size: 24px; }
  .nk-score { width: 56px; height: 56px; font-size: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .nk-root *, .nk-root *::before, .nk-root *::after { animation: none !important; transition: none !important; }
  .nk-reveal { opacity: 1 !important; transform: none !important; }
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
  return (
    <Tag ref={ref} className={`nk-reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/* ─── Score fill color helpers ───────────────────────────────────── */
function fillClass(score) {
  if (score >= 80) return "nk-fill-success";
  if (score >= 55) return "nk-fill-warn";
  return "nk-fill-sale";
}
function difficultyLabel(d) {
  const v = d?.toLowerCase();
  if (v === "easy") return { text: "Easy", color: "var(--nk-success)" };
  if (v === "hard") return { text: "Hard", color: "var(--nk-sale)" };
  return { text: "Medium", color: "var(--nk-mute)" };
}

export default function ReviewHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.profile);
  const { token } = useSelector((s) => s.auth);
  const { theme } = useContext(ThemeContext);
  const nkTheme = theme === "dark" ? "dark" : "light";

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = React.useRef(null);

  const subscriptionLabel = user?.subscription?.plan?.toUpperCase() || "FREE";

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
    (async () => {
      try {
        setLoading(true);
        const data = await getAllInterviews(setLoading, token);
        setInterviews(Array.isArray(data) ? data : []);
      } catch {
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    let f = [...interviews];
    if (searchTerm) f = f.filter((i) => i.role?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedFilter !== "all") f = f.filter((i) => i.status === selectedFilter);
    if (selectedDifficulty !== "all") f = f.filter((i) => i.difficulty?.toLowerCase() === selectedDifficulty);
    f.sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.completedAt || a.createdAt) - new Date(b.completedAt || b.createdAt);
      if (sortBy === "score-high") return (b.overallScore || 0) - (a.overallScore || 0);
      if (sortBy === "score-low") return (a.overallScore || 0) - (b.overallScore || 0);
      return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
    });
    setFilteredInterviews(f);
  }, [interviews, searchTerm, selectedFilter, selectedDifficulty, sortBy]);

  const stats = React.useMemo(() => {
    const completed = interviews.filter((i) => i.status === "completed");
    const avg = completed.length ? completed.reduce((s, i) => s + (i.overallScore || 0), 0) / completed.length : 0;
    const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1);
    return {
      total: interviews.length,
      completed: completed.length,
      avgScore: Math.round(avg * 10) / 10,
      thisMonth: completed.filter((i) => new Date(i.completedAt || i.createdAt) >= monthAgo).length,
      highest: Math.max(...completed.map((i) => i.overallScore || 0), 0),
    };
  }, [interviews]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  /* ── Notification panel (empty state for history page) ── */
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

  if (loading) {
    return (
      <div className="nk-root flex items-center justify-center" data-nk-theme={nkTheme} style={{ minHeight: "100vh" }}>
        <style>{NIKE_CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--nk-hairline)", borderTopColor: "var(--nk-ink)", borderRadius: "50%", animation: "nk-spin .8s linear infinite", margin: "0 auto 16px" }} />
          <p className="nk-caption nk-mute">Loading your history…</p>
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
            <Link to="/" aria-label="Intervyo home" className="flex items-center">
              <BrandLogo
                className="hidden sm:inline text-base"
                primaryClassName="text-inherit"
              />
            </Link>
          </div>

          <nav className="nk-nav-links" aria-label="Primary">
            <Link to="/dashboard" className="nk-nav-link">Dashboard</Link>
            <Link to="/interview-setup" className="nk-nav-link">Interview</Link>
            <Link to="/analytics" className="nk-nav-link">Analytics</Link>
            <Link to="/history" className="nk-nav-link" aria-current="page">History</Link>
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
              <BrandLogo
                className="text-base"
                primaryClassName="text-inherit"
              />
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

      {/* ── Main ── */}
      <main>
        {/* Page header */}
        <section className="nk-container nk-section">
          <Reveal>
            <div className="nk-head" style={{ marginBottom: 0 }}>
              <h1 className="nk-h-xl">Interview History</h1>
              <button className="nk-btn nk-btn-primary nk-btn-sm" onClick={() => navigate("/interview-setup")}>
                New Interview <ArrowUpRight size={16} />
              </button>
            </div>
            <p className="nk-mute mt-2">Review, analyse and learn from every past session.</p>
          </Reveal>
        </section>

        {/* Stats strip */}
        <section className="nk-container nk-section">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 8 }}>
            {[
              { label: "Total", value: stats.total },
              { label: "Completed", value: stats.completed },
              { label: "Avg Score", value: `${stats.avgScore}%` },
              { label: "This Month", value: stats.thisMonth },
              { label: "Highest", value: `${stats.highest}%` },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 70} className="nk-stat-card" style={{ borderRadius: 0 }}>
                <span className="nk-caption-sm nk-mute" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
                <span className="nk-h-xl" style={{ marginTop: 12, textTransform: "none", fontSize: 28 }}>{s.value}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="nk-container" style={{ paddingTop: 24 }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              {/* Search */}
              <div className="nk-search-wrap" style={{ flex: "1 1 260px" }}>
                <Search size={16} className="nk-search-icon" />
                <input
                  type="text"
                  placeholder="Search by role…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select className="nk-select" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <select className="nk-select" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                <option value="all">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select className="nk-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="score-high">Highest Score</option>
                <option value="score-low">Lowest Score</option>
              </select>

              {(searchTerm || selectedFilter !== "all" || selectedDifficulty !== "all") && (
                <button className="nk-link nk-caption" onClick={() => { setSearchTerm(""); setSelectedFilter("all"); setSelectedDifficulty("all"); }}>
                  Clear filters
                </button>
              )}
            </div>

            {/* Active filter chips */}
            {(searchTerm || selectedFilter !== "all" || selectedDifficulty !== "all") && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {searchTerm && <span className="nk-chip">"{searchTerm}"</span>}
                {selectedFilter !== "all" && <span className="nk-chip">{selectedFilter}</span>}
                {selectedDifficulty !== "all" && <span className="nk-chip">{selectedDifficulty}</span>}
              </div>
            )}
          </Reveal>
        </section>

        {/* Interview rows */}
        <section className="nk-container nk-section nk-section-last">
          {filteredInterviews.length > 0 ? (
            <>
              <div style={{ borderBottom: "1px solid var(--nk-hairline)" }} />
              {filteredInterviews.map((iv, idx) => {
                const score = iv.overallScore || 0;
                const diff = difficultyLabel(iv.difficulty);
                return (
                  <Reveal
                    key={iv._id}
                    delay={idx * 55}
                    className="nk-row"
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/results/${iv._id}`)}
                    onKeyDown={(e) => { if (e.key === "Enter") navigate(`/results/${iv._id}`); }}
                    aria-label={`View results for ${iv.role || "Interview"}, score ${score}`}
                  >
                    {/* Score box */}
                    <div className="nk-score">{score}</div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <h3 className="nk-body-strong" style={{ margin: 0 }}>{iv.role || "Interview"}</h3>
                        <span className="nk-caption-sm" style={{ color: diff.color, border: `1px solid ${diff.color}`, borderRadius: 30, padding: "2px 10px" }}>{diff.text}</span>
                        <span className="nk-chip" style={{ textTransform: "capitalize" }}>{iv.status || "completed"}</span>
                      </div>
                      <div className="nk-caption nk-mute" style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", marginBottom: 10 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <Calendar size={13} /> {formatDate(iv.completedAt || iv.createdAt)}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <Clock size={13} /> {iv.duration || 30} min
                        </span>
                      </div>
                      <div className="nk-track">
                        <div
                          className={`nk-fill ${fillClass(score)}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={20} className="hidden sm:block nk-mute" aria-hidden="true" />
                  </Reveal>
                );
              })}

              <Reveal>
                <p className="nk-caption nk-mute" style={{ textAlign: "center", marginTop: 32 }}>
                  Showing {filteredInterviews.length} of {interviews.length} interview{interviews.length !== 1 ? "s" : ""}
                </p>
              </Reveal>
            </>
          ) : (
            <Reveal>
              <div className="nk-tile" style={{ alignItems: "center", textAlign: "center", padding: "80px 24px", borderRadius: 0 }}>
                <h3 className="nk-h-xl" style={{ marginBottom: 12 }}>
                  {searchTerm || selectedFilter !== "all" || selectedDifficulty !== "all"
                    ? "No matches found"
                    : "Your history is empty"}
                </h3>
                <p className="nk-mute" style={{ maxWidth: 420, marginBottom: 32 }}>
                  {searchTerm || selectedFilter !== "all" || selectedDifficulty !== "all"
                    ? "Try adjusting your search or filters."
                    : "Complete your first interview and it will appear here."}
                </p>
                <button className="nk-btn nk-btn-primary" onClick={() => navigate("/interview-setup")}>
                  Start an Interview <ArrowUpRight size={18} />
                </button>
              </div>
            </Reveal>
          )}
        </section>
      </main>
    </div>
  );
}