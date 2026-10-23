// export { default } from "./DashboardApple";

import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Calendar,
  Clock,
  BarChart3,
  Brain,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Flame,
  Crown,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../services/operations/authAPI";
import { getAllInterviews } from "../services/operations/aiInterviewApi";
import { getUserProfile } from "../services/operations/profileAPI";
import { LightningLoader } from "../components/Loader/Loader";
import ContributionGraph from "../components/Dashboard/ContributionGraph";
import TextType from "../components/shared/TextType";
import ThemeToggle from "../components/ThemeToggle";
import { ThemeContext } from "../components/shared/ThemeContext";
import AchievementModal from "../components/Dashboard/AchievementModal";
import { achievementService } from "../services/operations/achievementsAPI";
import { getLearningProgress } from "../services/operations/learningHubAPI";
import { useNotifications } from "../components/shared/NotificationContext";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
} from "../services/operations/notificationAPI";
import BrandLogo from "../components/shared/BrandLogo";

/* ------------------------------------------------------------------ */
/*  Nike design system – tokens, components and motion                 */
/*  Light is the documented palette. When the app theme is "dark" the  */
/*  neutral tokens invert (ink <-> canvas); the pill grammar is kept.  */
/* ------------------------------------------------------------------ */
export const NIKE_CSS = `
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
  --nk-bg: #4f1a1bff;
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

/* Typography (weights 400 / 500 only) */
.nk-display { font-family: "Nike Futura ND", "Bebas Neue", Anton, Impact, "Helvetica Neue", sans-serif; font-size: 96px; font-weight: 500; line-height: 0.9; text-transform: uppercase; letter-spacing: -0.005em; }
.nk-h-xl { font-family: "Helvetica Now Display", "Helvetica Neue", "Inter", sans-serif; font-size: 32px; font-weight: 500; line-height: 1.2; text-transform: uppercase; }
.nk-h-lg { font-size: 24px; font-weight: 500; line-height: 1.2; }
.nk-h-md { font-size: 16px; font-weight: 500; line-height: 1.75; }
.nk-body-strong { font-size: 16px; font-weight: 500; line-height: 1.5; }
.nk-caption { font-size: 14px; font-weight: 500; line-height: 1.5; }
.nk-caption-sm { font-size: 12px; font-weight: 500; line-height: 1.5; }
.nk-mute { color: var(--nk-mute); }

/* Layout */
.nk-container { width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 48px; }
.nk-section { padding-top: 48px;}
.nk-section-last { padding-bottom: 80px; }
.nk-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 24px; }

/* Utility bar + primary nav */
.nk-utility { background: var(--nk-cloud); height: 36px; font-size: 12px; font-weight: 500; }
.nk-utility .nk-container { height: 100%; display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
.nk-utility a, .nk-utility button { background: none; border: 0; padding: 0; font-size: 12px; font-weight: 500; }
.nk-utility a:hover, .nk-utility button:hover { color: var(--nk-mute); }
.nk-nav { position: sticky; top: 0; z-index: 60; height: 60px; background: var(--nk-canvas); transition: box-shadow .3s ease; }
.nk-nav[data-scrolled="true"] { box-shadow: inset 0 -1px 0 var(--nk-hairline-soft); }
.nk-nav .nk-container { height: 100%; display: flex; align-items: center; justify-content: space-between; }
.nk-nav-links { display: flex; align-items: center; gap: 28px; height: 100%; }
.nk-nav-link { position: relative; height: 100%; display: inline-flex; align-items: center; font-size: 16px; font-weight: 500; }
.nk-nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: 8px; height: 2px; background: var(--nk-ink); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--nk-ease); }
.nk-nav-link:hover::after, .nk-nav-link[aria-current="page"]::after { transform: scaleX(1); }
.nk-nav-right { display: flex; align-items: center; gap: 8px; }

/* Buttons: pill only */
.nk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 32px; border-radius: 30px; border: 0; font-size: 16px; font-weight: 500; line-height: 1.5; white-space: nowrap; transition: transform .18s var(--nk-ease), opacity .18s ease, background-color .25s ease; }
.nk-btn-primary { background: var(--nk-ink); color: var(--nk-on-ink) !important; }
.nk-btn-secondary { background: var(--nk-cloud); color: var(--nk-ink); }
.nk-btn-onimage { background: #ffffff; color: #111111 !important; height: 44px; padding: 0 24px; }
.nk-btn-sm { height: 40px; padding: 0 20px; font-size: 14px; }
.nk-btn:active { transform: scale(0.5); opacity: 0.5; }
.nk-btn .nk-arrow { transition: transform .3s var(--nk-ease); }
.nk-btn:hover .nk-arrow { transform: translateX(4px); }
.nk-btn-primary:hover { background: var(--nk-charcoal); }
.nk-btn-secondary:hover { background: var(--nk-hairline-soft); }
.nk-icon-btn { position: relative; width: 40px; height: 40px; border-radius: 9999px; border: 0; background: transparent; display: inline-flex; align-items: center; justify-content: center; transition: background-color .25s ease, transform .18s var(--nk-ease); }
.nk-icon-btn:hover { background: var(--nk-cloud); }
.nk-icon-btn:active { transform: scale(0.85); }
.nk-root :is(a, button, [role="button"]):focus-visible { outline: 2px solid var(--nk-ink); outline-offset: 2px; }
.nk-link { background: none; border: 0; padding: 0; font-size: 16px; font-weight: 500; text-decoration: underline; text-underline-offset: 3px; display: inline-flex; align-items: center; gap: 4px; }
.nk-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); border-radius: 30px; padding: 4px 12px; font-size: 12px; font-weight: 500; line-height: 1.5; color: var(--nk-ink); }
.nk-badge-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 9999px; background: var(--nk-sale); }
.nk-badge-dot::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: var(--nk-sale); animation: nk-ping 1.8s ease-out infinite; }
.nk-avatar { width: 32px; height: 32px; border-radius: 9999px; background: var(--nk-ink); color: var(--nk-on-ink); display: inline-flex; align-items: center; justify-content: center; overflow: hidden; font-size: 14px; font-weight: 500; }
.nk-pro-avatar-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; padding: 2px; border-radius: 9999px; background: linear-gradient(135deg, #fff2bd, #c08b35 48%, #fff2bd); box-shadow: 0 0 0 1px rgba(192,139,53,.35); animation: nk-pro-glow  infinite; }
.nk-pro-avatar-crown { position: absolute; top: -4px; right: -4px; width: 15px; height: 15px; padding: 2px; border: 1px solid var(--nk-canvas); border-radius: 9999px; background: #d7ad58; color: #21190a; }
@keyframes nk-pro-glow { 0%, 100% { box-shadow: 0 0 0 1px rgba(192,139,53,.35), 0 0 6px rgba(192,139,53,.25); } 50% { box-shadow: 0 0 0 2px rgba(255,224,150,.75), 0 0 14px rgba(192,139,53,.62); } }

/* Campaign hero (flat ink block; photography slot) */
.nk-campaign { position: relative; background: #111111; color: #ffffff;  display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
.nk-campaign-title { min-height: 1.6em; max-width: 15ch; padding-top:40px; overflow-wrap: anywhere; }
.nk-campaign-sub { font-size: 24px; font-weight: 500; line-height: 1.2;  max-width: 640px; }
.nk-campaign-actions { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.nk-campaign-streak { position: absolute; top: 48px; right: 48px; display: flex; align-items: center; gap: 12px; }
.nk-flame { animation: nk-flicker 1.6s ease-in-out infinite; transform-origin: 50% 90%; }

/* Flat tiles */
.nk-grid-4 { display: grid; gap: 8px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.nk-tile { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; transition: background-color .3s ease; }
.nk-stat { min-height: 180px; justify-content: space-between; }
.nk-stat:hover { background: var(--nk-hairline-soft); }
.nk-action { min-height: 320px; text-align: left; border: 0; justify-content: space-between; width: 100%; position: relative; overflow: hidden; }
.nk-action .nk-action-icon { transition: transform .5s var(--nk-ease); }
.nk-action:hover .nk-action-icon { transform: translate(6px, -6px) rotate(8deg) scale(1.08); }
.nk-action-primary { background: #111111; color: #ffffff; }
.nk-action-primary:hover { background: #2a2a2c; }
.nk-action:active { transform: scale(0.98); }
.nk-circle { width: 48px; height: 48px; border-radius: 9999px; background: var(--nk-canvas); color: var(--nk-ink); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nk-action-primary .nk-circle { background: #ffffff; color: #111111; }

/* Progress */
.nk-track { height: 4px; background: var(--nk-hairline-soft); overflow: hidden; }
.nk-track-lg { height: 8px; }
.nk-fill { height: 100%; width: 0; background: var(--nk-ink); transition: width 1.2s var(--nk-ease); }
.nk-fill-success { background: var(--nk-success); }
.nk-tile-ink .nk-track { background: #39393b; }
.nk-tile-ink .nk-fill { background: #ffffff; }

/* Rows */
.nk-row { display: flex; align-items: center; gap: 16px; padding: 24px 0; border-top: 1px solid var(--nk-hairline); cursor: pointer; transition: background-color .3s ease, padding .4s var(--nk-ease); }
.nk-row:hover { background: var(--nk-cloud); padding-left: 16px; padding-right: 16px; }
.nk-score { width: 80px; height: 80px; background: var(--nk-cloud); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 32px; font-weight: 500; transition: background-color .3s ease, color .3s ease; }
.nk-row:hover .nk-score { background: var(--nk-ink); color: var(--nk-on-ink); }
.nk-disclosure { padding: 24px 0; border-top: 1px solid var(--nk-hairline); }

/* Menus */
.nk-menu { position: absolute; right: 0; top: calc(100% + 8px); width: 340px; max-height: 440px; overflow-y: auto; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); z-index: 80; animation: nk-menu-in .28s var(--nk-ease) both; transform-origin: top right; }
.nk-menu-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; font-size: 14px; font-weight: 500; background: none; border: 0; text-align: left; transition: background-color .2s ease; }
.nk-menu-item:hover { background: var(--nk-cloud); }
.nk-drawer-scrim { position: fixed; inset: 0; background: rgba(17,17,17,0.5); z-index: 90; animation: nk-fade .3s ease both; }
.nk-drawer { position: fixed; top: 0; bottom: 0; left: 0; width: min(88vw, 360px); background: var(--nk-canvas); z-index: 95; overflow-y: auto; padding: 16px 24px 48px; animation: nk-drawer-in .4s var(--nk-ease) both; }
.nk-drawer a, .nk-drawer .nk-drawer-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 24px 0 0; background: none; border: 0; text-align: left; font-size: 24px; font-weight: 500; line-height: 1.2; }
.nk-drawer .nk-menu { position: static; width: 100%; max-height: none; margin: 16px 0 0; animation: none; }

/* Motion */
.nk-reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s var(--nk-ease), transform .8s var(--nk-ease); will-change: opacity, transform; }
.nk-reveal.is-in { opacity: 1; transform: none; }
.nk-rise { opacity: 0; animation: nk-rise .9s var(--nk-ease) both; }
.nk-d1 { animation-delay: .15s; } .nk-d2 { animation-delay: .3s; } .nk-d3 { animation-delay: .45s; }
@keyframes nk-rise { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
@keyframes nk-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes nk-menu-in { from { opacity: 0; transform: translateY(-8px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes nk-drawer-in { from { transform: translateX(-100%); } to { transform: none; } }
@keyframes nk-ping { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(3); opacity: 0; } }
@keyframes nk-flicker { 0%, 100% { transform: scale(1) rotate(0); } 25% { transform: scale(1.08) rotate(-4deg); } 60% { transform: scale(0.96) rotate(3deg); } }
@keyframes nk-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* Responsive */
@media (min-width: 1920px) { .nk-container { padding: 0 80px; } }
@media (max-width: 1023px) {
  .nk-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .nk-display { font-size: 64px; }
  .nk-section { padding-top: 32px; }
  .nk-container { padding: 0 32px; }
}
@media (max-width: 960px) { .nk-nav-links { display: none; } }
@media (min-width: 961px) { .nk-hamburger { display: none; } }
@media (max-width: 599px) {
  .nk-grid-4 { grid-template-columns: minmax(0, 1fr); }
  .nk-display { font-size: 48px; }
  .nk-section { padding-top: 24px; }
  .nk-container { padding: 0 16px; }
  .nk-campaign { padding: 24px 16px; min-height: 480px; }
  .nk-campaign-streak { top: 24px; right: 16px; }
  .nk-campaign-sub { font-size: 18px; }
  .nk-action { min-height: 220px; }
  .nk-h-xl { font-size: 24px; }
  .nk-score { width: 64px; height: 64px; font-size: 24px; }
  .nk-menu { width: calc(100vw - 32px); right: -8px; }
}
@media (prefers-reduced-motion: reduce) {
  .nk-root *, .nk-root *::before, .nk-root *::after { animation: none !important; transition: none !important; }
  .nk-reveal, .nk-rise { opacity: 1 !important; transform: none !important; }
}
`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has scrolled into view (fires once). */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/** Scroll-reveal wrapper (fade + rise, optional stagger delay in ms). */
function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const [ref, inView] = useInView(0.1);
  return (
    <Tag
      ref={ref}
      className={`nk-reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...(style || {}) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Animated number that counts up when scrolled into view. */
function CountUp({ end = 0, decimals = 0, suffix = "", duration = 1100 }) {
  const [ref, inView] = useInView(0.3);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setVal(end);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);
  const text =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString();
  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}

function ProgressBar({ value, label, large = false, success = false }) {
  const [ref, inView] = useInView(0.3);
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      ref={ref}
      className={`nk-track ${large ? "nk-track-lg" : ""}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
    >
      <div
        className={`nk-fill ${success ? "nk-fill-success" : ""}`}
        style={{ width: inView ? `${pct}%` : "0%" }}
      />
    </div>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: profileUser } = useSelector((state) => state.profile);
  const { token, user: authUser } = useSelector((state) => state.auth);
  const user = profileUser || authUser;
  const {
    notifications,
    unreadCount,
    refreshNotifications,
    setNotifications,
    setUnreadCount,
  } = useNotifications();
  const profileMenuRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [learningProgress, setLearningProgress] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    recentInterviews: [],
    stats: null,
  });

  const [newAchievements, setNewAchievements] = useState([]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for new achievements
  useEffect(() => {
    const checkForNewAchievements = async () => {
      if (!token) return;

      try {
        const result = await achievementService.checkAchievements(token);

        if (result.success && result.data.newAchievements.length > 0) {
          setNewAchievements(result.data.newAchievements);
          setCurrentAchievementIndex(0);
          setShowAchievementModal(true);
        }
      } catch (error) {
        console.error("Error checking achievements:", error);
      }
    };

    if (!loading && token) {
      setTimeout(() => {
        checkForNewAchievements();
      }, 1000);
    }
  }, [loading, token]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id, token);

        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (notification.link) {
        setShowNotifications(false);
        setIsMobileMenuOpen(false);
        navigate(notification.link);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();

    try {
      await deleteNotification(notificationId, token);

      const deletedNotification = notifications.find(
        (n) => n._id === notificationId,
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClearRead = async () => {
    try {
      await clearReadNotifications(token);

      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Error clearing read notifications:", error);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleAchievementModalClose = async () => {
    if (
      newAchievements.length > 0 &&
      currentAchievementIndex < newAchievements.length
    ) {
      const currentAchievement = newAchievements[currentAchievementIndex];

      await achievementService.markAsNotified(currentAchievement._id, token);

      if (currentAchievementIndex + 1 < newAchievements.length) {
        setCurrentAchievementIndex(currentAchievementIndex + 1);
      } else {
        setShowAchievementModal(false);
        setNewAchievements([]);
        setCurrentAchievementIndex(0);

        dispatch(getUserProfile(token));
      }
    } else {
      setShowAchievementModal(false);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchAllDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [profileResult, interviewsResult] = await Promise.all([
          dispatch(getUserProfile(token)),
          getAllInterviews(setLoading, token),
        ]);

        const interviewsArray = Array.isArray(interviewsResult)
          ? interviewsResult
          : [];

        setDashboardData({
          recentInterviews: interviewsArray,
          stats: user?.stats || null,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData({
          recentInterviews: [],
          stats: user?.stats || null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, [token]);

  // Fetch learning progress
  useEffect(() => {
    const fetchLearningProgress = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getLearningProgress(token);
        setLearningProgress(response || []);
      } catch (error) {
        console.error("Error fetching learning progress data:", error);
        setLearningProgress([]);
      }
    };

    fetchLearningProgress();
  }, [token]);

  // Update dashboard data when user stats change
  useEffect(() => {
    if (user?.stats && dashboardData.recentInterviews.length > 0) {
      setDashboardData((prev) => ({
        ...prev,
        stats: user.stats,
      }));
    }
  }, [user?.stats]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate level progress
  const levelProgress = user?.stats
    ? ((user.stats.xpPoints % 500) / 500) * 100
    : 0;
  const xpToNextLevel = user?.stats ? 500 - (user.stats.xpPoints % 500) : 500;

  // Calculate average score
  const calculateAverageScore = () => {
    if (
      !dashboardData.recentInterviews ||
      dashboardData.recentInterviews.length === 0
    ) {
      return 0;
    }

    const validScores = dashboardData.recentInterviews.filter(
      (i) => i.overallScore !== undefined && i.overallScore !== null,
    );

    if (validScores.length === 0) return 0;

    const sum = validScores.reduce(
      (acc, interview) => acc + interview.overallScore,
      0,
    );
    return Math.round((sum / validScores.length) * 10) / 10;
  };

  // Calculate trend
  const calculateTrend = () => {
    if (
      !dashboardData.recentInterviews ||
      dashboardData.recentInterviews.length < 2
    ) {
      return "+0%";
    }

    const validInterviews = dashboardData.recentInterviews.filter(
      (i) => i.overallScore !== undefined && i.overallScore !== null,
    );

    if (validInterviews.length < 2) return "+0%";

    const recent = validInterviews.slice(
      0,
      Math.min(3, validInterviews.length),
    );
    const older = validInterviews.slice(3, Math.min(6, validInterviews.length));

    if (older.length === 0) return "+0%";

    const recentAvg =
      recent.reduce((acc, i) => acc + i.overallScore, 0) / recent.length;
    const olderAvg =
      older.reduce((acc, i) => acc + i.overallScore, 0) / older.length;

    if (olderAvg === 0) return "+0%";

    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    return trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;
  };

  const avgScore = calculateAverageScore();
  const stats = [
    {
      label: "Total Interviews",
      end:
        user?.stats?.totalInterviews ||
        dashboardData.recentInterviews.length ||
        0,
      icon: BarChart3,
      trend:
        dashboardData.recentInterviews.length > 0
          ? `+${dashboardData.recentInterviews.length}`
          : "0",
    },
    {
      label: "Average Score",
      end: avgScore,
      decimals: Number.isInteger(avgScore) ? 0 : 1,
      suffix: "%",
      icon: TrendingUp,
      trend: calculateTrend(),
    },
    {
      label: "Current Streak",
      end: user?.stats?.streak || 0,
      suffix: " days",
      icon: Flame,
      trend: user?.stats?.streak > 0 ? "Active" : "Start now",
    },
    {
      label: "XP Points",
      end: user?.stats?.xpPoints || 0,
      icon: Sparkles,
      trend: null,
    },
  ];

  const quickActions = [
    {
      title: "Start Interview",
      icon: Target,
      description: "Begin practice session",
      action: () => navigate("/interview-setup"),
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      description: "View your stats",
      action: () => navigate("/analytics"),
    },
    {
      title: "Review History",
      icon: BarChart3,
      description: "Analyze performance",
      action: () => navigate("/history"),
    },
    {
      title: "Leaderboard",
      icon: Trophy,
      description: "View rankings",
      action: () => navigate("/leaderboard"),
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!showProfileMenu) return;

    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Escape closes any open menu
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowProfileMenu(false);
        setShowNotifications(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nkTheme = theme === "dark" ? "dark" : "light";
  const isEnterprise = user?.subscription?.plan === "enterprise";
  const isProUser =
    user?.subscription?.plan === "pro" &&
    new Date(user?.subscription?.endDate) > new Date();
  const planLimit = isEnterprise
    ? Infinity
    : user?.subscription?.plan === "pro"
      ? 25
      : 3;
  const planLimitLabel = isEnterprise ? "∞" : String(planLimit);
  const interviewsRemaining = isEnterprise
    ? -1
    : Math.max(
        0,
        Number(user?.subscription?.interviewsRemaining ?? planLimit) || 0,
      );
  const planProgress = isEnterprise
    ? 100
    : (interviewsRemaining / planLimit) * 100;

  if (loading) {
    return (
      <div
        className="nk-root flex items-center justify-center"
        data-nk-theme={nkTheme}
      >
        <style>{NIKE_CSS}</style>
        <LightningLoader />
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";
  const subscriptionLabel = user?.subscription?.plan?.toUpperCase() || "FREE";

  // Shared notification list (desktop dropdown + mobile drawer)
  const renderNotifications = () => (
    <div className="nk-menu" role="region" aria-label="Notifications">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--nk-hairline)" }}
      >
        <h3 className="nk-body-strong">Notifications</h3>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="nk-link nk-caption-sm">
              Mark all read
            </button>
          )}
          {notifications.some((n) => n.isRead) && (
            <button onClick={handleClearRead} className="nk-link nk-caption-sm">
              Clear read
            </button>
          )}
        </div>
      </div>
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <div
            key={notif._id}
            role="button"
            tabIndex={0}
            onClick={() => handleNotificationClick(notif)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNotificationClick(notif);
              }
            }}
            className="nk-menu-item"
            style={{
              alignItems: "flex-start",
              cursor: "pointer",
              borderLeft: !notif.isRead
                ? "2px solid var(--nk-ink)"
                : "2px solid transparent",
            }}
          >
            <div className="flex-1">
              <p className="nk-caption" style={{ fontWeight: notif.isRead ? 400 : 500 }}>
                {notif.message}
              </p>
              <p className="nk-caption-sm nk-mute">{formatTimeAgo(notif.createdAt)}</p>
            </div>
            <button
              onClick={(e) => handleDeleteNotification(e, notif._id)}
              aria-label="Delete notification"
              className="nk-link nk-mute"
              style={{ fontSize: 20, lineHeight: 1, textDecoration: "none" }}
            >
              ×
            </button>
          </div>
        ))
      ) : (
        <div className="px-4 py-10 text-center">
          <Bell className="mx-auto mb-2 nk-mute" size={28} />
          <p className="nk-caption nk-mute">No notifications yet</p>
        </div>
      )}
    </div>
  );

  const heroSubcopy =
    user?.stats?.totalInterviews > 0
      ? `You've completed ${user.stats.totalInterviews} interview${user.stats.totalInterviews > 1 ? "s" : ""} so far. Keep up the momentum.`
      : "Your journey to interview mastery starts here.";

  return (
    <div className="nk-root" data-nk-theme={nkTheme}>
      <style>{NIKE_CSS}</style>

      {/* Utility bar */}
      <div className="nk-utility">
        <div className="nk-container">
          <Link to="/blog">Blog</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/pricing">Pricing</Link>
          <button onClick={() => dispatch(logout(navigate))}>Logout</button>
        </div>
      </div>

      {/* Primary nav */}
      <header className="nk-nav" data-scrolled={isScrolled}>
        <div className="nk-container">
          <div className="flex items-center gap-2">
            <button
              className="nk-icon-btn nk-hamburger"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={22} />
            </button>
            <Link to="/" aria-label="Intervyo home" className="flex items-center">
              <BrandLogo
                className="hidden sm:inline text-2xl"
                primaryClassName="text-inherit"
              />
            </Link>
          </div>

          <nav className="nk-nav-links" aria-label="Primary">
            <Link to="/dashboard" className="nk-nav-link" aria-current="page">Dashboard</Link>
            <Link to="/interview-setup" className="nk-nav-link">Interview</Link>
            <Link to="/analytics" className="nk-nav-link">Analytics</Link>
            <Link to="/history" className="nk-nav-link">History</Link>
            <Link to="/leaderboard" className="nk-nav-link">Leaderboard</Link>
          </nav>

          <div className="nk-nav-right">
            <ThemeToggle />
            <div className="relative">
              <button
                className="nk-icon-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                aria-expanded={showNotifications}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="nk-badge-dot" />}
              </button>
              {showNotifications && renderNotifications()}
            </div>

            <div ref={profileMenuRef} className="relative hidden sm:block">
              <button
                className="nk-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu((prev) => !prev);
                  setShowNotifications(false);
                }}
                aria-haspopup="menu"
                aria-expanded={showProfileMenu}
                aria-label={`Account menu${isProUser ? ", Pro member" : ""}`}
                style={{ width: "auto", padding: "0 8px 0 4px", gap: 6 }}
              >
                {isProUser ? (
                  <span className="nk-pro-avatar-wrap" title="Pro member">
                    <span className="nk-avatar">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} className="h-full w-full object-cover" alt="Profile" />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                    </span>
                    <Crown className="nk-pro-avatar-crown" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="nk-avatar">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} className="h-full w-full object-cover" alt="Profile" />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  style={{ transition: "transform .3s var(--nk-ease)", transform: showProfileMenu ? "rotate(180deg)" : "none" }}
                />
              </button>
              {showProfileMenu && (
                <div className="nk-menu" role="menu" style={{ width: 260 }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--nk-hairline)" }}>
                    <div className="nk-body-strong">{user?.name || "User"}</div>
                    <div className="nk-caption-sm nk-mute truncate">{user?.email || "Email not available"}</div>
                    <span className="nk-chip mt-2"><Crown size={12} /> {subscriptionLabel}</span>
                  </div>
                  <button
                    role="menuitem"
                    className="nk-menu-item"
                    onClick={() => {
                      navigate("/settings");
                      setShowProfileMenu(false);
                    }}
                  >
                    <Settings size={16} /> Profile Settings
                  </button>
                  <button
                    role="menuitem"
                    className="nk-menu-item"
                    onClick={() => {
                      navigate("/subscription");
                      setShowProfileMenu(false);
                    }}
                  >
                    <Crown size={16} /> Subscription
                  </button>
                  <button
                    role="menuitem"
                    className="nk-menu-item"
                    style={{ borderTop: "1px solid var(--nk-hairline)" }}
                    onClick={() => dispatch(logout(navigate))}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="nk-drawer-scrim" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="nk-drawer" aria-label="Menu">
            <div className="flex items-center justify-between">
              <BrandLogo
                className="text-base"
                primaryClassName="text-inherit"
              />
              <button className="nk-icon-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/interview-setup" onClick={() => setIsMobileMenuOpen(false)}>Interview</Link>
            <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)}>Analytics</Link>
            <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>History</Link>
            <Link to="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>Profile Settings</Link>
            <Link to="/subscription" onClick={() => setIsMobileMenuOpen(false)}>Subscription</Link>
            <button className="nk-drawer-item" onClick={() => setShowNotifications(!showNotifications)}>
              Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </button>
            {showNotifications && renderNotifications()}
            <button className="nk-drawer-item" onClick={() => dispatch(logout(navigate))}>
              Logout
            </button>
          </aside>
        </>
      )}

      <main>
        {/* Campaign hero */}
        <section className="nk-container" style={{ paddingTop: 0 }} aria-label="Welcome">
          <div className="nk-campaign">
            {/* <div className="nk-marquee" aria-hidden="true">
              <div>
                {"Practice · Perform · Progress · Practice · Perform · Progress · ".repeat(2)}
              </div>
            </div> */}

            {user?.stats?.streak > 0 && (
              <div className="nk-campaign-streak nk-rise nk-d3">
                <Flame className="nk-flame" size={32} aria-hidden="true" />
                <div>
                  <div className="nk-h-lg">{user.stats.streak}</div>
                  <div className="nk-caption-sm" style={{ color: "#9e9ea0" }}>day streak</div>
                </div>
              </div>
            )}

            <h1 className="nk-display nk-campaign-title nk-rise">
              <TextType
                text={[`Hey ${firstName}.`, "Ready to shine?", "Let's ace this."]}
                typingSpeed={11}
                pauseDuration={3500}
                showCursor={true}
                cursorCharacter="|"
              />
            </h1>
            <p className="nk-campaign-sub nk-rise nk-d1">{heroSubcopy}</p>
            <div className="nk-campaign-actions nk-rise nk-d2">
              <button className="nk-btn nk-btn-onimage text-black" onClick={() => navigate("/interview-setup")}>
                Start Interview <ArrowUpRight className="nk-arrow" size={18} aria-hidden="true" />
              </button>
              <button
                className="nk-btn nk-btn-onimage"
                onClick={() => navigate("/history")}
              >
                Review history
              </button>
            </div>
          </div>
        </section>

        {/* Level & XP */}
        <section className="nk-section nk-container " aria-labelledby="level-h">
          <Reveal>
            <div className="nk-head">
              <h2 id="level-h" className="nk-h-xl">Your level</h2>
              <span className="nk-caption nk-mute">{(user?.stats?.xpPoints || 0).toLocaleString()} XP total</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="nk-tile nk-tile-ink" style={{ background: "#111111", color: "#fff", padding: 32 }}>
              <div className="grid items-end gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="nk-caption" style={{ color: "#9e9ea0" }}>Current level</div>
                  <div className="nk-display" style={{ fontSize: 72 }}>
                    <CountUp end={user?.stats?.level || 1} duration={900} />
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="nk-body-strong">Progress to Level {(user?.stats?.level || 1) + 1}</span>
                    <span className="nk-h-lg"><CountUp end={Math.round(levelProgress)} suffix="%" /></span>
                  </div>
                  <ProgressBar value={levelProgress} label="Progress to next level" large />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="nk-caption" style={{ color: "#9e9ea0" }}>{xpToNextLevel} XP to go</span>
                    {levelProgress >= 75 && <span className="nk-caption">Almost there</span>}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Stats */}
        <section className="nk-section nk-container" aria-labelledby="stats-h">
          <Reveal>
            <div className="nk-head">
              <h2 id="stats-h" className="nk-h-xl">Stats at a glance</h2>
            </div>
          </Reveal>
          <div className="nk-grid-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={stat.label} delay={i * 90} className="nk-tile nk-stat">
                  <div className="flex items-start justify-between">
                    <span className="nk-circle"><Icon size={20} aria-hidden="true" /></span>
                    {stat.trend && <span className="nk-chip">{stat.trend}</span>}
                  </div>
                  <div className="mt-8">
                    <div className="nk-h-xl" style={{ textTransform: "none" }}>
                      <CountUp end={stat.end} decimals={stat.decimals || 0} suffix={stat.suffix || ""} />
                    </div>
                    <div className="nk-caption nk-mute">{stat.label}</div>
                    {stat.label === "Total Interviews" && (
                      <div className="nk-caption-sm nk-mute mt-1">
                        {user?.stats?.totalInterviews > 0
                          ? "You're building great momentum."
                          : "Start your first interview to begin tracking."}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section className="nk-section nk-container" aria-labelledby="actions-h">
          <Reveal>
            <div className="nk-head">
              <h2 id="actions-h" className="nk-h-xl">What would you like to do?</h2>
            </div>
          </Reveal>
          <div className="nk-grid-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Reveal key={action.title} delay={index * 90}>
                  <button
                    onClick={action.action}
                    className={`nk-tile nk-action ${index === 0 ? "nk-action-primary" : ""}`}
                  >
                    <span className="nk-circle nk-action-icon"><Icon size={22} aria-hidden="true" /></span>
                    <span>
                      <span className="nk-h-lg block">{action.title}</span>
                      <span className="nk-caption block mb-5" style={{ color: index === 0 ? "#9e9ea0" : "var(--nk-mute)" }}>
                        {action.description}
                      </span>
                      <span className={`nk-btn nk-btn-sm ${index === 0 ? "nk-btn-onimage" : "nk-btn-primary"}`} style={{ pointerEvents: "none" }}>
                        {index === 0 ? "Let's go" : "Explore"}
                        <ChevronRight className="nk-arrow" size={16} aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Journey + sidebar */}
        <section className="nk-section nk-section-last nk-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              <div>
                <Reveal>
                  <div className="nk-head">
                    <h2 className="nk-h-xl">Your interview journey</h2>
                    <button onClick={() => navigate("/history")} className="nk-link">
                      View all
                    </button>
                  </div>
                </Reveal>

                {dashboardData.recentInterviews.length > 0 ? (
                  dashboardData.recentInterviews.slice(0, 3).map((interview, idx) => (
                    <Reveal
                      key={interview._id}
                      delay={idx * 90}
                      role="link"
                      tabIndex={0}
                      className="nk-row"
                      onClick={() => navigate(`/results/${interview._id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") navigate(`/results/${interview._id}`);
                      }}
                    >
                      <div className="nk-score" aria-label={`Score ${interview.overallScore || 0}`}>
                        {interview.overallScore || 0}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="nk-body-strong truncate">{interview.role || "Interview"}</h3>
                          <span className="nk-chip">{interview.difficulty || "Medium"}</span>
                        </div>
                        <div className="nk-caption nk-mute mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="capitalize">{interview.status || "completed"}</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={14} aria-hidden="true" />
                            {formatDate(interview.completedAt || interview.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={14} aria-hidden="true" />
                            {interview.duration || 30}min
                          </span>
                        </div>
                        <div className="mt-3">
                          <ProgressBar value={interview.overallScore || 0} label="Overall score" />
                        </div>
                      </div>
                      <ChevronRight size={20} className="hidden sm:block" aria-hidden="true" />
                    </Reveal>
                  ))
                ) : (
                  <Reveal className="nk-tile" style={{ padding: "64px 24px", alignItems: "center", textAlign: "center" }}>
                    <h3 className="nk-h-xl mb-3">Ready to begin?</h3>
                    <p className="nk-mute mb-6" style={{ maxWidth: 420 }}>
                      Take your first step towards interview mastery. Every expert was once a beginner.
                    </p>
                    <button className="nk-btn nk-btn-primary text-black" onClick={() => navigate("/interview-setup")}>
                      Start your first interview
                    </button>
                  </Reveal>
                )}
              </div>

              <Reveal>
                <ContributionGraph interviews={dashboardData.recentInterviews} />
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-12">
              <div>
                <Reveal>
                  <h2 className="nk-h-lg mb-4 flex items-center gap-2">
                    <Brain size={22} aria-hidden="true" /> Learning path
                  </h2>
                </Reveal>
                {learningProgress?.length > 0 ? (
                  learningProgress.map((topic, index) => (
                    <Reveal key={index} delay={index * 60} className="nk-disclosure">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span style={{ fontSize: 20 }} aria-hidden="true">{topic.topic?.icon || "📚"}</span>
                          <span className="nk-body-strong truncate">{topic.topic?.title || "Untitled"}</span>
                        </div>
                        <span className="nk-body-strong">{topic.progress || 0}%</span>
                      </div>
                      <ProgressBar
                        value={topic.progress || 0}
                        label={topic.topic?.title || "Topic progress"}
                        success={topic.progress === 100}
                      />
                      <div className="nk-caption-sm nk-mute mt-2 flex items-center justify-between">
                        <span>{topic.totalTimeSpent || "0"} invested</span>
                        {topic.progress === 100 && (
                          <span style={{ color: "var(--nk-success)" }}>Complete</span>
                        )}
                      </div>
                    </Reveal>
                  ))
                ) : (
                  <p className="nk-disclosure nk-caption nk-mute">
                    Your learning journey starts with your first interview.
                  </p>
                )}
              </div>

              <div>
                <Reveal>
                  <h2 className="nk-h-lg mb-4 flex items-center gap-2">
                    <Trophy size={22} aria-hidden="true" /> Hall of fame
                  </h2>
                </Reveal>
                {user?.stats?.badges && user.stats.badges.length > 0 ? (
                  <>
                    {user.stats.badges.slice(0, 3).map((badge, index) => (
                      <Reveal key={index} delay={index * 60} className="nk-disclosure flex items-center gap-4">
                        <span className="nk-circle" style={{ background: "var(--nk-cloud)", fontSize: 22 }} aria-hidden="true">
                          {badge.icon || <Star size={20} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="nk-body-strong truncate">{badge.name || "Achievement"}</div>
                          <div className="nk-caption-sm nk-mute">Earned {formatDate(badge.earnedAt)}</div>
                        </div>
                      </Reveal>
                    ))}
                    <div className="nk-disclosure">
                      <button onClick={() => navigate("/achievements")} className="nk-btn nk-btn-secondary w-full">
                        View all {user.stats.badges.length} badge{user.stats.badges.length > 1 ? "s" : ""}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="nk-disclosure">
                    <p className="nk-body-strong">Your trophy case is ready.</p>
                    <p className="nk-caption nk-mute">Complete interviews to unlock badges.</p>
                  </div>
                )}
              </div>

              <Reveal className="nk-tile nk-tile-ink" style={{ background: "#111111", color: "#fff", padding: 32 }}>
                <h3 className="nk-h-lg mb-6 flex items-center gap-2">
                  <Crown size={22} aria-hidden="true" /> {subscriptionLabel}
                </h3>
                <div className="nk-caption mb-1" style={{ color: "#9e9ea0" }}>Interviews this month</div>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="nk-display" style={{ fontSize: 64 }}>
                    {isEnterprise ? "∞" : <CountUp end={interviewsRemaining} duration={900} />}
                  </span>
                  <span className="nk-caption" style={{ color: "#9e9ea0" }}>
                    {isEnterprise
                      ? "Unlimited interviews"
                      : interviewsRemaining === 0
                        ? "No interviews remaining this month"
                        : `of ${planLimitLabel} left this month`}
                  </span>
                </div>
                {!isEnterprise && interviewsRemaining === 0 && (
                  <p className="nk-caption-sm mb-4" style={{ color: "#d7ad58" }}>
                    Your interviews renew on the 1st.
                  </p>
                )}
                <div className="mb-6">
                  <ProgressBar value={planProgress} label="Interviews remaining this month" />
                </div>
                <button onClick={() => navigate("/pricing")} className="nk-btn nk-btn-onimage w-full">
                  Manage plan
                </button>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* Achievement Modal */}
      {showAchievementModal && newAchievements.length > 0 && (
        <AchievementModal
          achievement={newAchievements[currentAchievementIndex]}
          onClose={handleAchievementModalClose}
        />
      )}
    </div>
  );
}

export default Dashboard;