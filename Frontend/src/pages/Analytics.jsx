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
  Calendar,
  Clock,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Zap,
  Brain,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getUserAnalytics,
  getSkillRadar,
} from "../services/operations/analyticsAPI";
import { logout } from "../services/operations/authAPI";
import ThemeToggle from "../components/ThemeToggle";
import { ThemeContext } from "../components/shared/ThemeContext";
import logo from "../assets/intervyologo.png";

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
.nk-tile { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; transition: background-color .3s ease; }
.nk-stat-card { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; transition: background-color .25s ease; }
.nk-stat-card:hover { background: var(--nk-hairline-soft); }

/* Select */
.nk-select { height: 48px; padding: 0 16px; border: 1px solid var(--nk-hairline); border-radius: 30px; background: var(--nk-canvas); color: var(--nk-ink); font: inherit; font-size: 14px; font-weight: 500; outline: none; transition: border-color .25s ease; appearance: none; cursor: pointer; }
.nk-select:focus { border-color: var(--nk-ink); }

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

const COLORS = ["#111111", "#707072", "#007d48", "#d30005", "#9e9ea0"];

export default function Analytics() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.profile);
  const { token } = useSelector((state) => state.auth);
  const { theme } = useContext(ThemeContext);
  const nkTheme = theme === "dark" ? "dark" : "light";

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [skillData, setSkillData] = useState([]);

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
    fetchAnalytics();
  }, [token, timeRange]);

  const fetchAnalytics = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [analyticsRes, skillsRes] = await Promise.all([
        getUserAnalytics(token, timeRange),
        getSkillRadar(token),
      ]);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (skillsRes.success) setSkillData(skillsRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="nk-root flex items-center justify-center" data-nk-theme={nkTheme} style={{ minHeight: "100vh" }}>
        <style>{NIKE_CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--nk-hairline)", borderTopColor: "var(--nk-ink)", borderRadius: "50%", animation: "nk-spin .8s linear infinite", margin: "0 auto 16px" }} />
          <p className="nk-caption nk-mute">Loading analytics…</p>
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
            <Link to="/analytics" className="nk-nav-link" aria-current="page">Analytics</Link>
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
        {/* Header */}
        <Reveal>
          <div className="nk-head">
            <div>
              <h1 className="nk-h-xl">Performance Analytics</h1>
              <p className="nk-mute mt-1">Track your interview progress and skill metrics</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="nk-select"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </Reveal>

        {/* Summary Cards */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 12 }}>
          {[
            { label: "Total Interviews", value: analytics?.summary?.totalInterviews || 0 },
            { label: "Avg Score", value: `${analytics?.summary?.avgScore || 0}%` },
            { label: "Best Score", value: `${analytics?.summary?.bestScore || 0}%` },
            { label: "Total Time", value: `${Math.round((analytics?.summary?.totalTime || 0) / 60)}m` },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 60} className="nk-stat-card" style={{ borderRadius: 0 }}>
              <span className="nk-caption-sm nk-mute" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              <span className="nk-h-xl" style={{ marginTop: 12, textTransform: "none", fontSize: 28 }}>{s.value}</span>
            </Reveal>
          ))}
        </section>

        {/* Gamification Metrics */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Current Level", value: `Lvl ${analytics?.gamification?.level || 1}` },
            { label: "Current Streak", value: `${analytics?.gamification?.streak || 0} Days` },
            { label: "Total XP", value: analytics?.gamification?.xpPoints || 0 },
          ].map((g, i) => (
            <Reveal key={g.label} delay={i * 80} className="nk-stat-card" style={{ borderRadius: 0 }}>
              <span className="nk-caption-sm nk-mute" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{g.label}</span>
              <span className="nk-h-xl" style={{ marginTop: 12, textTransform: "none", fontSize: 28 }}>{g.value}</span>
            </Reveal>
          ))}
        </section>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 24, marginBottom: 32 }}>
          {/* Performance Trend */}
          <Reveal className="nk-tile" style={{ borderRadius: 0 }}>
            <h3 className="nk-h-lg mb-6">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics?.performanceTrend || []}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--nk-ink)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--nk-ink)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--nk-hairline-soft)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  stroke="var(--nk-mute)"
                />
                <YAxis domain={[0, 100]} stroke="var(--nk-mute)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--nk-canvas)", border: "1px solid var(--nk-hairline)", borderRadius: 0, color: "var(--nk-ink)" }} />
                <Area type="monotone" dataKey="score" stroke="var(--nk-ink)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </Reveal>

          {/* Skill Radar */}
          <Reveal className="nk-tile" style={{ borderRadius: 0 }}>
            <h3 className="nk-h-lg mb-6">Skill Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="var(--nk-hairline-soft)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--nk-mute)", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--nk-mute)" }} />
                <Radar name="Score" dataKey="score" stroke="var(--nk-ink)" fill="var(--nk-ink)" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </Reveal>
        </div>

        {/* Second Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 32 }}>
          {/* Category Scores */}
          <Reveal className="nk-tile" style={{ borderRadius: 0 }}>
            <h3 className="nk-h-lg mb-6">Category Scores</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.entries(analytics?.categoryScores || {}).map(([cat, score]) => (
                <div key={cat}>
                  <div className="flex justify-between mb-2">
                    <span className="nk-caption nk-mute" style={{ textTransform: "capitalize" }}>{cat}</span>
                    <span className="nk-body-strong">{score}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--nk-hairline-soft)", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "var(--nk-ink)", width: `${score}%`, transition: "width 1s var(--nk-ease)" }} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Difficulty Distribution */}
          <Reveal className="nk-tile" style={{ borderRadius: 0 }}>
            <h3 className="nk-h-lg mb-6">Difficulty Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Easy", value: analytics?.difficultyDistribution?.easy || 0 },
                    { name: "Medium", value: analytics?.difficultyDistribution?.medium || 0 },
                    { name: "Hard", value: analytics?.difficultyDistribution?.hard || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {COLORS.slice(0, 3).map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--nk-canvas)", border: "1px solid var(--nk-hairline)", borderRadius: 0, color: "var(--nk-ink)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {["Easy", "Medium", "Hard"].map((d, i) => (
                <div key={d} className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: COLORS[i] }} />
                  <span className="nk-caption nk-mute">{d}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Weekly Activity */}
          <Reveal className="nk-tile" style={{ borderRadius: 0 }}>
            <h3 className="nk-h-lg mb-6">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics?.weeklyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--nk-hairline-soft)" />
                <XAxis dataKey="day" stroke="var(--nk-mute)" />
                <YAxis stroke="var(--nk-mute)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--nk-canvas)", border: "1px solid var(--nk-hairline)", borderRadius: 0, color: "var(--nk-ink)" }} />
                <Bar dataKey="count" fill="var(--nk-ink)" />
              </BarChart>
            </ResponsiveContainer>
          </Reveal>
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          <Reveal className="nk-tile" style={{ borderRadius: 0 }}>
            <h3 className="nk-h-lg mb-4 flex items-center gap-2">
              Strengths
            </h3>
            {analytics?.strengths?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {analytics.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "var(--nk-canvas)", border: "1px solid var(--nk-hairline)" }}>
                    <span className="nk-body-strong" style={{ textTransform: "capitalize" }}>{s.category}</span>
                    <span className="nk-body-strong" style={{ color: "var(--nk-success)" }}>{s.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="nk-mute nk-caption">Complete more interviews to see strengths</p>
            )}
          </Reveal>

          <Reveal className="nk-tile" style={{ borderRadius: 0 }}>
            <h3 className="nk-h-lg mb-4 flex items-center gap-2">
              Areas to Improve
            </h3>
            {analytics?.weaknesses?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {analytics.weaknesses.map((w, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "var(--nk-canvas)", border: "1px solid var(--nk-hairline)" }}>
                    <span className="nk-body-strong" style={{ textTransform: "capitalize" }}>{w.category}</span>
                    <span className="nk-body-strong" style={{ color: "var(--nk-sale)" }}>{w.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="nk-mute nk-caption">No weak areas identified yet</p>
            )}
          </Reveal>
        </div>
      </main>
    </div>
  );
}