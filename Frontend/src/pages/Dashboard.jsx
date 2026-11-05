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

export const NIKE_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

@font-face {
  font-family: "FK Screamer";
  src: url("https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

.nk-root {
  --nk-ink: #f3f4f6;
  --nk-on-ink: #0a0d12;
  --nk-canvas: #0a0d12;
  --nk-cloud: #0e121a;
  --nk-surface: #11161f;
  --nk-surface-soft: #141a24;
  --nk-hairline: rgba(255,255,255,0.12);
  --nk-hairline-soft: rgba(255,255,255,0.08);
  --nk-charcoal: #c3dbff;
  --nk-mute: #9ca3af;
  --nk-stone: #6b7280;
  --nk-success: #d1f48c;
  --nk-sale: #ffb8fc;
  --nk-blue: #c3dbff;
  --nk-yellow: #fffa64;
  --nk-pink: #ffb8fc;
  --nk-ease: cubic-bezier(0.22, 1, 0.36, 1);

  min-height: 100vh;
  overflow-x: hidden;
  color: var(--nk-ink);
  background:
    radial-gradient(
      circle at 12% 0%,
      rgba(195,219,255,0.1),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 30%,
      rgba(209,244,140,0.045),
      transparent 25%
    ),
    #0a0d12;

  font-family: "Inter", Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.nk-root *,
.nk-root *::before,
.nk-root *::after {
  box-sizing: border-box;
}

.nk-root button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.nk-root a {
  color: inherit;
  text-decoration: none;
}

.nk-root::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.55;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 4rem 4rem;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
}

.nk-root > * {
  position: relative;
  z-index: 1;
}

/* Typography */

.nk-display {
  font-family: "FK Screamer", Impact, sans-serif;
  font-size: 96px;
  font-weight: 700;
  line-height: 0.86;
  letter-spacing: -0.025em;
  text-transform: uppercase;
}

.nk-h-xl,
.nk-h-lg,
.nk-h-md,
.nk-body-strong,
.nk-caption,
.nk-caption-sm {
  font-family: "Inter", Helvetica, Arial, sans-serif;
}

.nk-h-xl {
  color: #ffffff;
  font-size: 25px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.035em;
}

.nk-h-lg {
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.nk-h-md {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
}

.nk-body-strong {
  color: #f3f4f6;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.nk-caption {
  color: #d1d5db;
  font-size: 13px;
  line-height: 1.5;
}

.nk-caption-sm {
  color: #9ca3af;
  font-size: 11px;
  line-height: 1.5;
}

.nk-mute {
  color: #9ca3af;
}

/* Layout */

.nk-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-right: 40px;
  padding-left: 40px;
}

.nk-section {
  padding-top: 72px;
}

.nk-section-last {
  padding-bottom: 96px;
}

.nk-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

/* Header */

.nk-utility {
  height: 34px;
  color: #9ca3af;
  background: rgba(14,18,26,0.84);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 11px;
}

.nk-utility .nk-container {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}

.nk-utility a,
.nk-utility button {
  padding: 0;
  color: #9ca3af;
  background: transparent;
  border: 0;
  font-size: 11px;
  transition: color 0.2s ease;
}

.nk-utility a:hover,
.nk-utility button:hover {
  color: #ffffff;
}

.nk-nav {
  position: sticky;
  top: 0;
  z-index: 60;
  height: 68px;
  background: rgba(10,13,18,0.82);
  border-bottom: 1px solid transparent;
  backdrop-filter: blur(18px);
  transition: border-color 0.3s ease, background 0.3s ease;
}

.nk-nav[data-scrolled="true"] {
  background: rgba(10,13,18,0.96);
  border-color: rgba(255,255,255,0.1);
}

.nk-nav .nk-container {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

.nk-nav-links {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 28px;
}

.nk-nav-link {
  position: relative;
  display: inline-flex;
  height: 100%;
  align-items: center;
  color: #9ca3af;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nk-nav-link:hover,
.nk-nav-link[aria-current="page"] {
  color: #ffffff;
}

.nk-nav-link::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 10px;
  left: 0;
  height: 2px;
  background: #d1f48c;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--nk-ease);
}

.nk-nav-link:hover::after,
.nk-nav-link[aria-current="page"]::after {
  transform: scaleX(1);
}

.nk-nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Buttons */

.nk-btn {
  display: inline-flex;
  height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    transform 0.2s var(--nk-ease),
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
}

.nk-btn:hover {
  transform: translateY(-2px);
}

.nk-btn:active {
  transform: scale(0.97);
}

.nk-btn-primary {
  color: #0a0d12 !important;
  background: #ffffff;
}

.nk-btn-primary:hover {
  color: #0a0d12 !important;
  background: #d1f48c;
  box-shadow: 0 12px 30px rgba(209,244,140,0.12);
}

.nk-btn-secondary {
  color: #ffffff;
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.13);
}

.nk-btn-secondary:hover {
  background: rgba(255,255,255,0.11);
  border-color: rgba(255,255,255,0.25);
}

.nk-btn-onimage {
  height: 44px;
  color: #0a0d12 !important;
  background: #ffffff;
}

.nk-btn-onimage:hover {
  background: #d1f48c;
}

.nk-btn-sm {
  height: 36px;
  padding: 0 16px;
  font-size: 12px;
}

.nk-icon-btn {
  position: relative;
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #d1d5db;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}

.nk-icon-btn:hover {
  color: #ffffff;
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.12);
}

.nk-root :is(a, button, [role="button"]):focus-visible {
  outline: 2px solid #c3dbff;
  outline-offset: 3px;
}

.nk-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: #d1d5db;
  background: transparent;
  border: 0;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.2s ease;
}

.nk-link:hover {
  color: #d1f48c;
}

.nk-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  color: #d1d5db;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
}

.nk-avatar {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #0a0d12;
  background: #d1f48c;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.nk-badge-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  background: #ffb8fc;
  border: 2px solid #0a0d12;
  border-radius: 999px;
}

/* Hero */

.nk-campaign {
  position: relative;
  display: flex;
  min-height: 430px;
  flex-direction: column;
  justify-content: flex-end;
  padding: 56px;
  overflow: hidden;
  color: #ffffff;
  background:
    linear-gradient(120deg, rgba(14,18,26,0.82), rgba(10,13,18,0.98)),
    radial-gradient(circle at 80% 10%, rgba(195,219,255,0.15), transparent 35%),
    #0e121a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.28);
}

.nk-campaign::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
  background:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 4rem 4rem;
  mask-image: linear-gradient(to bottom, black, transparent);
}

.nk-campaign > * {
  position: relative;
  z-index: 1;
}

.nk-campaign-title {
  max-width: 760px;
  min-height: 1.6em;
  padding-top: 38px;
}

.nk-campaign-sub {
  max-width: 580px;
  margin-top: 20px;
  color: #c7cbd3;
  font-size: 17px;
  line-height: 1.55;
}

.nk-campaign-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

.nk-campaign-streak {
  position: absolute;
  top: 42px;
  right: 42px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #d1f48c;
}

.nk-campaign-streak .nk-h-lg {
  color: #ffffff;
}

.nk-flame {
  animation: nk-flicker 1.6s ease-in-out infinite;
}

/* Tiles */

.nk-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.nk-tile {
  color: #f3f4f6;
  background: rgba(14,18,26,0.82);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
  box-shadow: 0 16px 45px rgba(0,0,0,0.16);
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    transform 0.35s var(--nk-ease);
}

.nk-tile:hover {
  background: #11161f;
  border-color: rgba(255,255,255,0.17);
}

.nk-stat {
  min-height: 190px;
  justify-content: space-between;
  padding: 22px;
}

.nk-circle {
  display: inline-flex;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: #0a0d12;
  background: #c3dbff;
  border-radius: 12px;
}

.nk-stat:nth-child(2) .nk-circle {
  background: #d1f48c;
}

.nk-stat:nth-child(3) .nk-circle {
  background: #ffb8fc;
}

.nk-stat:nth-child(4) .nk-circle {
  background: #fffa64;
}

.nk-action {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 280px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  overflow: hidden;
  text-align: left;
}

.nk-action-primary {
  color: #0a0d12;
  background: #d1f48c;
  border-color: #d1f48c;
}

.nk-action-primary:hover {
  color: #0a0d12;
  background: #e0ffad;
}

.nk-action-primary .nk-circle {
  color: #0a0d12;
  background: #ffffff;
}

.nk-action .nk-action-icon {
  transition: transform 0.5s var(--nk-ease);
}

.nk-action:hover .nk-action-icon {
  transform: translate(5px, -5px) rotate(5deg) scale(1.05);
}

/* Progress */

.nk-track {
  height: 4px;
  overflow: hidden;
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
}

.nk-track-lg {
  height: 8px;
}

.nk-fill {
  height: 100%;
  background: #c3dbff;
  border-radius: inherit;
  transition: width 1.2s var(--nk-ease);
}

.nk-fill-success {
  background: #d1f48c;
}

.nk-tile-ink {
  color: #ffffff !important;
  background:
    linear-gradient(135deg, rgba(17,22,31,0.96), rgba(14,18,26,0.88)),
    #11161f !important;
  border-color: rgba(255,255,255,0.12);
}

.nk-tile-ink .nk-track {
  background: rgba(255,255,255,0.12);
}

.nk-tile-ink .nk-fill {
  background: #d1f48c;
}

/* Rows */

.nk-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition:
    background 0.3s ease,
    padding 0.35s var(--nk-ease);
}

.nk-row:hover {
  padding-right: 14px;
  padding-left: 14px;
  background: rgba(255,255,255,0.04);
}

.nk-score {
  display: flex;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: #0a0d12;
  background: #c3dbff;
  border-radius: 12px;
  font-size: 25px;
  font-weight: 700;
  transition: background 0.3s ease, transform 0.3s ease;
}

.nk-row:hover .nk-score {
  background: #d1f48c;
  transform: rotate(-3deg);
}

.nk-disclosure {
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
}

/* Menus */

.nk-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 80;
  width: 340px;
  max-height: 440px;
  overflow-y: auto;
  color: #f3f4f6;
  background: #11161f;
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 12px;
  box-shadow: 0 24px 70px rgba(0,0,0,0.38);
  animation: nk-menu-in 0.28s var(--nk-ease) both;
  transform-origin: top right;
}

.nk-menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #d1d5db;
  text-align: left;
  background: transparent;
  border: 0;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.nk-menu-item:hover {
  color: #ffffff;
  background: rgba(255,255,255,0.06);
}

.nk-drawer-scrim {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0,0,0,0.62);
  backdrop-filter: blur(4px);
  animation: nk-fade 0.3s ease both;
}

.nk-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 95;
  width: min(88vw, 360px);
  overflow-y: auto;
  padding: 20px 24px 48px;
  color: #ffffff;
  background: #0e121a;
  border-right: 1px solid rgba(255,255,255,0.1);
  animation: nk-drawer-in 0.4s var(--nk-ease) both;
}

.nk-drawer a,
.nk-drawer .nk-drawer-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 20px 0 0;
  color: #f3f4f6;
  text-align: left;
  background: transparent;
  border: 0;
  font-size: 22px;
  font-weight: 600;
}

/* Motion */

.nk-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.8s var(--nk-ease),
    transform 0.8s var(--nk-ease);
  will-change: opacity, transform;
}

.nk-reveal.is-in {
  opacity: 1;
  transform: none;
}

.nk-rise {
  opacity: 0;
  animation: nk-rise 0.9s var(--nk-ease) both;
}

.nk-d1 {
  animation-delay: 0.15s;
}

.nk-d2 {
  animation-delay: 0.3s;
}

.nk-d3 {
  animation-delay: 0.45s;
}

@keyframes nk-rise {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes nk-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes nk-menu-in {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes nk-drawer-in {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: none;
  }
}

@keyframes nk-flicker {
  0%, 100% {
    transform: scale(1) rotate(0);
  }

  25% {
    transform: scale(1.08) rotate(-4deg);
  }

  60% {
    transform: scale(0.96) rotate(3deg);
  }
}

/* Responsive */

@media (max-width: 1023px) {
  .nk-container {
    padding-right: 28px;
    padding-left: 28px;
  }

  .nk-section {
    padding-top: 52px;
  }

  .nk-grid-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .nk-display {
    font-size: 68px;
  }
}

@media (max-width: 960px) {
  .nk-nav-links {
    display: none;
  }
}

@media (min-width: 961px) {
  .nk-hamburger {
    display: none;
  }
}

@media (max-width: 599px) {
  .nk-container {
    padding-right: 16px;
    padding-left: 16px;
  }

  .nk-section {
    padding-top: 40px;
  }

  .nk-grid-4 {
    grid-template-columns: minmax(0, 1fr);
  }

  .nk-display {
    font-size: 50px;
  }

  .nk-campaign {
    min-height: 470px;
    padding: 28px 20px;
    border-radius: 12px;
  }

  .nk-campaign-streak {
    top: 24px;
    right: 20px;
  }

  .nk-campaign-sub {
    font-size: 15px;
  }

  .nk-action {
    min-height: 220px;
  }

  .nk-h-xl {
    font-size: 22px;
  }

  .nk-score {
    width: 60px;
    height: 60px;
    font-size: 21px;
  }

  .nk-menu {
    right: -8px;
    width: calc(100vw - 32px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nk-root *,
  .nk-root *::before,
  .nk-root *::after {
    animation: none !important;
    transition: none !important;
  }

  .nk-reveal,
  .nk-rise {
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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