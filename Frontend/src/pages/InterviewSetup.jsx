import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Lightbulb,
  LoaderCircle,
  Plus,
  Rocket,
  Sparkles,
  Target,
  Trash2,
  Upload,
  User,
  WandSparkles,
} from "lucide-react";
import {
  PanelsTopLeft,
  Server,
  Layers3,
  Smartphone,
  BrainCircuit,
} from "lucide-react";
import {
  SiMeta,
  SiNetflix,
  SiTesla
} from "react-icons/si";
import { FaAmazon, FaGoogle, FaMicrosoft, FaApple, FaSalesforce, FaPencilAlt } from "react-icons/fa";
import { BiLogoAdobe } from "react-icons/bi";
import { GrOracle } from "react-icons/gr";
import { createInterview } from "../services/operations/interviewAPI";
import { resetInterview, setInterviewConfig } from "../slices/interviewSlice";
import { ThemeContext } from "../components/shared/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const INTERVIEW_SETUP_CSS = `
.nk-setup {
  --nk-ink: #111111;
  --nk-on-ink: #ffffff;
  --nk-canvas: #ffffff;
  --nk-cloud: #f5f5f5;
  --nk-hairline: #cacacb;
  --nk-hairline-soft: #e5e5e5;
  --nk-charcoal: #39393b;
  --nk-mute: #707072;
  --nk-success: #007d48;
  --nk-sale: #d30005;
  --nk-ease: cubic-bezier(0.22, 1, 0.36, 1);

  min-height: 100vh;
  background:
    radial-gradient(circle at 5% 0%, rgba(124, 58, 237, .10), transparent 28rem),
    radial-gradient(circle at 95% 10%, rgba(236, 72, 153, .08), transparent 28rem),
    var(--nk-canvas);
  color: var(--nk-ink);
  font-family: "Helvetica Now Text", "Helvetica Neue", Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.nk-setup[data-nk-theme="dark"] {
  --nk-ink: #ffffff;
  --nk-on-ink: #111111;
  --nk-canvas: #111111;
  --nk-cloud: #1f1f21;
  --nk-hairline: #39393b;
  --nk-hairline-soft: #2a2a2c;
  --nk-charcoal: #cacacb;
  --nk-mute: #9e9ea0;
  --nk-success: #1eaa52;
}

.nk-setup *,
.nk-setup *::before,
.nk-setup *::after {
  box-sizing: border-box;
}

.nk-setup button,
.nk-setup input {
  font: inherit;
}

.nk-setup button {
  cursor: pointer;
}

.nk-setup button:disabled {
  cursor: not-allowed;
}

.nk-setup :is(button, input):focus-visible {
  outline: 2px solid var(--nk-ink);
  outline-offset: 3px;
}

.nk-setup .setup-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
}

.nk-setup .setup-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 72px;
  display: flex;
  align-items: center;
  background: color-mix(in srgb, var(--nk-canvas) 90%, transparent);
  border-bottom: 1px solid var(--nk-hairline-soft);
  backdrop-filter: blur(18px);
}

.nk-setup .setup-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nk-setup .setup-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nk-setup .setup-brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--nk-ink);
  color: var(--nk-on-ink);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .04em;
}

.nk-setup .setup-user {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: var(--nk-ink);
  color: var(--nk-on-ink);
}

.nk-setup .setup-user img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nk-setup .setup-main {
  padding: 48px 0 80px;
}

.nk-setup .setup-progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 40px;
}

.nk-setup .setup-progress-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.nk-setup .setup-progress-item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 20px;
  left: 44px;
  right: -12px;
  height: 1px;
  background: var(--nk-hairline);
  z-index: 0;
}

.nk-setup .setup-progress-item.is-complete:not(:last-child)::after {
  background: var(--nk-ink);
}

.nk-setup .setup-progress-number {
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  display: grid;
  place-items: center;
  border: 1px solid var(--nk-hairline);
  border-radius: 50%;
  background: var(--nk-canvas);
  color: var(--nk-mute);
  font-size: 14px;
  font-weight: 500;
  transition: all .35s var(--nk-ease);
}

.nk-setup .setup-progress-item.is-active .setup-progress-number,
.nk-setup .setup-progress-item.is-complete .setup-progress-number {
  border-color: var(--nk-ink);
  background: var(--nk-ink);
  color: var(--nk-on-ink);
  transform: scale(1.08);
}

.nk-setup .setup-progress-label strong,
.nk-setup .setup-progress-label span {
  display: block;
}

.nk-setup .setup-progress-label strong {
  font-size: 14px;
  font-weight: 500;
}

.nk-setup .setup-progress-label span {
  margin-top: 2px;
  color: var(--nk-mute);
  font-size: 12px;
}

.nk-setup .setup-card {
  position: relative;
  overflow: hidden;
  padding: 48px;
  background: var(--nk-canvas);
  border: 1px solid var(--nk-hairline-soft);
  box-shadow: 0 24px 80px rgba(17, 17, 17, .08);
}

.nk-setup .setup-card::before {
  content: "";
  position: absolute;
  top: -180px;
  right: -160px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: rgba(124, 58, 237, .10);
  filter: blur(55px);
  pointer-events: none;
}

.nk-setup .setup-content {
  position: relative;
  z-index: 1;
}

.nk-setup .setup-intro {
  max-width: 760px;
  margin-bottom: 40px;
}

.nk-setup .setup-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 14px;
  border: 1px solid var(--nk-hairline);
  border-radius: 999px;
  color: var(--nk-mute);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .05em;
  text-transform: uppercase;
}

.nk-setup .setup-title {
  margin: 18px 0 0;
  font-family: "Helvetica Now Display", "Helvetica Neue", Inter, sans-serif;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -.045em;
  text-transform: uppercase;
}

.nk-setup .setup-title-accent {
  color: var(--nk-mute);
}

.nk-setup .setup-description {
  max-width: 650px;
  margin: 16px 0 0;
  color: var(--nk-mute);
  font-size: 18px;
  line-height: 1.55;
}

.nk-setup .setup-section {
  margin-top: 44px;
}

.nk-setup .setup-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 500;
}

.nk-setup .setup-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.nk-setup .setup-grid-two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.nk-setup .setup-grid-four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.nk-setup .setup-option {
  position: relative;
  min-height: 205px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
  text-align: left;
  border: 1px solid transparent;
  background: var(--nk-cloud);
  color: var(--nk-ink);
  transition:
    transform .35s var(--nk-ease),
    border-color .35s ease,
    background-color .35s ease,
    box-shadow .35s ease;
}

.nk-setup .setup-option:hover {
  transform: translateY(-5px);
  border-color: var(--nk-hairline);
  background: var(--nk-canvas);
  box-shadow: 0 16px 40px rgba(17, 17, 17, .08);
}

.nk-setup .setup-option.is-selected {
  border-color: var(--nk-ink);
  background: var(--nk-ink);
  color: var(--nk-on-ink);
  box-shadow: 0 18px 44px rgba(17, 17, 17, .18);
}

.nk-setup .setup-option-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-bottom: 28px;
  border-radius: 50%;
  background: var(--nk-canvas);
  color: var(--nk-ink);
  font-size: 24px;
}
.setup-option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--nk-muted, #737373);
  transition: color 0.2s ease, transform 0.2s ease;
}

.setup-option-icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}

.setup-option.is-selected .setup-option-icon {
  color: var(--nk-ink, #171717);
}

.setup-option:hover .setup-option-icon {
  color: var(--nk-ink, #171717);
}

.nk-setup .setup-option-title {
  font-size: 20px;
  font-weight: 500;
}

.nk-setup .setup-option-description {
  margin-top: 8px;
  color: var(--nk-mute);
  font-size: 14px;
}

.nk-setup .setup-option.is-selected .setup-option-description {
  color: #cacacb;
}

.nk-setup .setup-option-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 18px;
}

.nk-setup .setup-feature {
  padding: 4px 9px;
  border: 1px solid var(--nk-hairline);
  border-radius: 999px;
  color: var(--nk-mute);
  font-size: 11px;
}

.nk-setup .setup-option.is-selected .setup-feature {
  border-color: #555557;
  color: #cacacb;
}

.nk-setup .setup-check {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--nk-on-ink);
  color: var(--nk-ink);
}

.nk-setup .setup-subdomain,
.nk-setup .setup-panel,
.nk-setup .setup-summary {
  padding: 28px;
  border: 1px solid var(--nk-hairline-soft);
  background: var(--nk-cloud);
}

.nk-setup .setup-subdomain {
  margin-top: 40px;
  animation: nk-setup-rise .5s var(--nk-ease) both;
}

.nk-setup .setup-subdomain-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.nk-setup .setup-chip {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--nk-hairline);
  background: var(--nk-canvas);
  color: var(--nk-ink);
  font-size: 14px;
  font-weight: 500;
  transition: all .25s ease;
}

.nk-setup .setup-chip:hover,
.nk-setup .setup-chip.is-selected {
  border-color: var(--nk-ink);
  background: var(--nk-ink);
  color: var(--nk-on-ink);
}

.nk-setup .setup-duration {
  min-height: 150px;
  text-align: center;
}

.nk-setup .setup-duration .setup-option-icon {
  margin: 0 auto 18px;
}

.nk-setup .setup-duration-label {
  font-size: 18px;
  font-weight: 500;
}

.nk-setup .setup-duration-description {
  margin-top: 5px;
  color: var(--nk-mute);
  font-size: 12px;
}

.nk-setup .setup-recommended {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--nk-ink);
  color: var(--nk-on-ink);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.nk-setup .setup-field {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid var(--nk-hairline);
  outline: none;
  background: var(--nk-canvas);
  color: var(--nk-ink);
  transition: border-color .25s ease, box-shadow .25s ease;
}

.nk-setup .setup-field::placeholder {
  color: var(--nk-mute);
}

.nk-setup .setup-field:focus {
  border-color: var(--nk-ink);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--nk-ink) 12%, transparent);
}

.nk-setup .setup-upload {
  padding: 40px 28px;
  text-align: center;
  border: 1px dashed var(--nk-hairline);
  background: var(--nk-cloud);
}

.nk-setup .setup-upload-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: var(--nk-ink);
  color: var(--nk-on-ink);
}

.nk-setup .setup-upload-title {
  font-size: 24px;
  font-weight: 500;
}

.nk-setup .setup-upload-description {
  max-width: 520px;
  margin: 8px auto 24px;
  color: var(--nk-mute);
}

.nk-setup .setup-file {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border: 1px solid var(--nk-ink);
  background: var(--nk-ink);
  color: var(--nk-on-ink);
  font-size: 14px;
  font-weight: 500;
  transition: transform .25s var(--nk-ease), opacity .25s ease;
}

.nk-setup .setup-file:hover {
  transform: translateY(-2px);
  opacity: .85;
}

.nk-setup .setup-uploaded-file {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border: 1px solid var(--nk-success);
  background: color-mix(in srgb, var(--nk-success) 10%, transparent);
}

.nk-setup .setup-progress-track {
  height: 7px;
  margin-top: 24px;
  overflow: hidden;
  background: var(--nk-hairline-soft);
}

.nk-setup .setup-progress-fill {
  height: 100%;
  background: var(--nk-ink);
  transition: width .35s var(--nk-ease);
}

.nk-setup .setup-question-form {
  display: flex;
  gap: 8px;
}

.nk-setup .setup-question-form .setup-field {
  flex: 1;
}

.nk-setup .setup-question {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid var(--nk-hairline);
}

.nk-setup .setup-question-number {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--nk-ink);
  color: var(--nk-on-ink);
  font-size: 12px;
}

.nk-setup .setup-question-text {
  flex: 1;
  margin: 3px 0 0;
  line-height: 1.5;
}

.nk-setup .setup-question-remove {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--nk-mute);
}

.nk-setup .setup-question-remove:hover {
  color: var(--nk-sale);
}

.nk-setup .setup-tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 24px;
  padding: 16px;
  border-left: 3px solid var(--nk-ink);
  background: var(--nk-canvas);
  color: var(--nk-mute);
  font-size: 13px;
}

.nk-setup .setup-summary {
  margin-top: 40px;
}

.nk-setup .setup-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 22px;
}

.nk-setup .setup-summary-item {
  min-height: 100px;
  padding: 18px;
  background: var(--nk-canvas);
}

.nk-setup .setup-summary-label {
  color: var(--nk-mute);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.nk-setup .setup-summary-value {
  margin-top: 10px;
  font-size: 17px;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.nk-setup .setup-summary-subvalue {
  margin-top: 3px;
  color: var(--nk-mute);
  font-size: 13px;
}

.nk-setup .setup-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
}

.nk-setup .nk-btn {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 500;
  transition:
    transform .2s var(--nk-ease),
    background-color .25s ease,
    opacity .25s ease;
}

.nk-setup .nk-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.nk-setup .nk-btn:active:not(:disabled) {
  transform: scale(.97);
}

.nk-setup .nk-btn-primary {
  background: var(--nk-ink);
  color: var(--nk-on-ink);
}

.nk-setup .nk-btn-primary:hover:not(:disabled) {
  background: var(--nk-charcoal);
}

.nk-setup .nk-btn-secondary {
  background: var(--nk-cloud);
  color: var(--nk-ink);
}

.nk-setup .nk-btn-secondary:hover:not(:disabled) {
  background: var(--nk-hairline-soft);
}

.nk-setup .nk-btn:disabled {
  opacity: .42;
}

.nk-setup .setup-step-indicator {
  margin-top: 28px;
  text-align: center;
  color: var(--nk-mute);
  font-size: 13px;
}

.nk-setup .setup-dots {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.nk-setup .setup-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--nk-hairline);
  transition: all .3s var(--nk-ease);
}

.nk-setup .setup-dot.is-active {
  width: 28px;
  background: var(--nk-ink);
}

.nk-setup .setup-preparing {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}

.nk-setup .setup-preparing-card {
  width: min(100%, 520px);
  padding: 44px;
  background: var(--nk-canvas);
  border: 1px solid var(--nk-hairline-soft);
  box-shadow: 0 24px 80px rgba(17, 17, 17, .12);
  animation: nk-setup-rise .6s var(--nk-ease) both;
}

.nk-setup .setup-loader {
  width: 68px;
  height: 68px;
  margin: 0 auto 24px;
  border: 3px solid var(--nk-hairline-soft);
  border-top-color: var(--nk-ink);
  border-radius: 50%;
  animation: nk-setup-spin 1s linear infinite;
}

.nk-setup .setup-preparation-bar {
  height: 8px;
  margin-top: 26px;
  overflow: hidden;
  background: var(--nk-hairline-soft);
}

.nk-setup .setup-preparation-fill {
  height: 100%;
  background: var(--nk-ink);
  transition: width .6s var(--nk-ease);
}

.nk-setup .setup-status-list {
  display: grid;
  gap: 8px;
  margin-top: 24px;
}

.nk-setup .setup-status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--nk-cloud);
  color: var(--nk-mute);
  font-size: 13px;
}

.nk-setup .setup-status-item.is-complete {
  color: var(--nk-ink);
}

.nk-setup .setup-fade-up {
  animation: nk-setup-rise .55s var(--nk-ease) both;
}

.nk-setup .setup-stagger-1 {
  animation-delay: 80ms;
}

.nk-setup .setup-stagger-2 {
  animation-delay: 160ms;
}

.nk-setup .setup-stagger-3 {
  animation-delay: 240ms;
}

@keyframes nk-setup-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes nk-setup-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1023px) {
  .nk-setup .setup-container {
    padding-left: 32px;
    padding-right: 32px;
  }

  .nk-setup .setup-card {
    padding: 36px 28px;
  }

  .nk-setup .setup-grid-four {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .nk-setup .setup-subdomain-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .nk-setup .setup-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .nk-setup .setup-container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .nk-setup .setup-main {
    padding-top: 24px;
    padding-bottom: 48px;
  }

  .nk-setup .setup-card {
    padding: 24px 16px;
  }

  .nk-setup .setup-progress {
    gap: 4px;
  }

  .nk-setup .setup-progress-item {
    justify-content: center;
  }

  .nk-setup .setup-progress-label {
    display: none;
  }

  .nk-setup .setup-progress-item:not(:last-child)::after {
    left: 50%;
    right: -4px;
  }

  .nk-setup .setup-grid,
  .nk-setup .setup-grid-two,
  .nk-setup .setup-grid-four,
  .nk-setup .setup-subdomain-grid,
  .nk-setup .setup-summary-grid {
    grid-template-columns: 1fr;
  }

  .nk-setup .setup-option {
    min-height: 170px;
  }

  .nk-setup .setup-question-form {
    flex-direction: column;
  }

  .nk-setup .setup-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .nk-setup .setup-actions .nk-btn {
    width: 100%;
  }

  .nk-setup .setup-preparing-card {
    padding: 28px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nk-setup *,
  .nk-setup *::before,
  .nk-setup *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

const DOMAINS = [
  {
    value: "frontend",
    label: "Frontend Development",
    icon: PanelsTopLeft,
    color: "#3B82F6",
    subDomains: [
      "React",
      "Vue",
      "Angular",
      "JavaScript",
      "TypeScript",
      "Next.js",
      "CSS/HTML",
      "Redux",
    ],
  },
  {
    value: "backend",
    label: "Backend Development",
    icon: Server,
    subDomains: [
      "Node.js",
      "Python",
      "Java",
      "Go",
      "C#",
      "Ruby",
      "PHP",
      "Spring Boot",
    ],
  },
  {
    value: "fullstack",
    label: "Full Stack",
    icon: Layers3,
    subDomains: [
      "MERN",
      "MEAN",
      "Django",
      "Spring Boot",
      ".NET",
      "Ruby on Rails",
    ],
  },
  {
    value: "mobile",
    label: "Mobile Development",
    icon: Smartphone,
    subDomains: [
      "React Native",
      "Flutter",
      "iOS (Swift)",
      "Android (Kotlin)",
      "Xamarin",
    ],
  },
  {
    value: "devops",
    label: "DevOps & Cloud",
    icon: Rocket,
    subDomains: [
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Terraform",
    ],
  },
  {
    value: "data",
    label: "Data Science & AI",
    icon: BrainCircuit,
    subDomains: [
      "Machine Learning",
      "Data Analysis",
      "Deep Learning",
      "NLP",
      "Computer Vision",
    ],
  },
];

const INTERVIEW_TYPES = [
  {
    value: "technical",
    label: "Technical",
    icon: "💡",
    description: "Coding, algorithms and data structures",
    features: ["Live coding", "Problem solving", "Code review"],
  },
  {
    value: "behavioral",
    label: "Behavioral",
    icon: "💬",
    description: "Communication and soft skills",
    features: ["STAR method", "Team scenarios", "Leadership"],
  },
  {
    value: "system-design",
    label: "System Design",
    icon: "🏗️",
    description: "Architecture and scalability",
    features: ["Microservices", "Database design", "Load balancing"],
  },
  {
    value: "mixed",
    label: "Mixed Interview",
    icon: "🎯",
    description: "A complete interview assessment",
    features: ["All-in-one", "Realistic", "Complete evaluation"],
  },
];

const DIFFICULTIES = [
  {
    value: "easy",
    label: "Easy",
    icon: "🟢",
    description: "Perfect for beginners",
    experience: "0–2 years",
  },
  {
    value: "medium",
    label: "Medium",
    icon: "🟡",
    description: "Intermediate challenges",
    experience: "2–4 years",
    recommended: true,
  },
  {
    value: "hard",
    label: "Hard",
    icon: "🔴",
    description: "Advanced concepts",
    experience: "4–7 years",
  },
  {
    value: "expert",
    label: "Expert",
    icon: "⚫",
    description: "Senior-level mastery",
    experience: "7+ years",
  },
];

const DURATIONS = [
  { value: 15, label: "15 min", icon: "⚡", description: "Quick practice" },
  {
    value: 30,
    label: "30 min",
    icon: "🎯",
    description: "Standard session",
    recommended: true,
  },
  { value: 45, label: "45 min", icon: "⏱️", description: "Extended practice" },
  { value: 60, label: "1 hour", icon: "🕐", description: "Deep dive" },
  { value: 90, label: "1.5 hours", icon: "⏰", description: "Full interview" },
];

const COMPANIES = [
  { name: "Google", icon: FaGoogle },
  { name: "Meta", icon: SiMeta },
  { name: "Amazon", icon: FaAmazon },
  { name: "Microsoft", icon: FaMicrosoft },
  { name: "Apple", icon: FaApple },
  { name: "Netflix", icon: SiNetflix },
  { name: "Tesla", icon: SiTesla },
  { name: "Adobe", icon: BiLogoAdobe },
  { name: "Salesforce", icon: FaSalesforce },
  { name: "Oracle", icon: GrOracle },
  { name: "Startup", icon: Rocket },
  { name: "Custom", icon: FaPencilAlt },
];

const STEPS = [
  { number: 1, label: "Domain", description: "Choose field" },
  { number: 2, label: "Format", description: "Select type" },
  { number: 3, label: "Details", description: "Configure" },
  { number: 4, label: "Extras", description: "Personalize" },
];

function SetupOption({
  selected,
  icon,
  iconColor,
  title,
  onClick,
  className = "",
  description,
  children,
}) {
  const isImage = typeof icon === "string";
  const isComponent = typeof icon === "function";
  const Icon = isComponent ? icon : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`setup-option ${selected ? "is-selected" : ""} ${className}`}
      aria-pressed={selected}
    >
      <span className="setup-option-icon" style={{ color: iconColor }}>
        {typeof icon === "function" ? (
          React.createElement(icon, {
            size: 24,
            strokeWidth: 1.8,
            "aria-hidden": true,
          })
        ) : typeof icon === "string" ? (
          <span>{icon}</span>
        ) : React.isValidElement(icon) ? (
          icon
        ) : null}
      </span>

      <span className="setup-option-title">{title}</span>

      {description && (
        <span className="setup-option-description">{description}</span>
      )}

      {children}

      {selected && (
        <span className="setup-check" aria-hidden="true">
          <Check size={16} />
        </span>
      )}
    </button>
  );
}

function StepHeader({ step, title, accent, description }) {
  return (
    <div className="setup-intro setup-fade-up">
      <span className="setup-kicker">Step {step} of 4</span>
      <h1 className="setup-title">
        {title} <span className="setup-title-accent">{accent}</span>
      </h1>
      <p className="setup-description">{description}</p>
    </div>
  );
}

function InterviewSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const { token } = useSelector((state) => state.auth);
  const { interviewConfig } = useSelector((state) => state.interview);
  const { user } = useSelector((state) => state.profile);

  const [step, setStep] = useState(1);
  const [customQuestion, setCustomQuestion] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [customCompany, setCustomCompany] = useState("");
  const [isPreparingInterview, setIsPreparingInterview] = useState(false);
  const [preparationProgress, setPreparationProgress] = useState(0);
  // Prevent duplicate submissions when the button is clicked multiple times
  const isSubmittingRef = React.useRef(false);

  const [config, setConfig] = useState({
    domain: "",
    subDomain: "",
    interviewType: "",
    difficulty: "",
    duration: 30,
    targetCompany: "",
    questions: [],
    resume: null,
    ...interviewConfig,
  });

  const nkTheme = theme === "dark" ? "dark" : "light";

  const selectedDomain = useMemo(
    () => DOMAINS.find((domain) => domain.value === config.domain),
    [config.domain],
  );

  // NOTE: resetInterview() was here before but it wiped interviewConfig on every
  // mount, destroying selections made on a previous visit. Removed intentionally.

  useEffect(() => {
    if (!interviewConfig) return;

    setConfig((previous) => ({
      ...previous,
      ...interviewConfig,
    }));
  }, [interviewConfig]);

  const updateConfig = (updates) => {
    setConfig((previous) => ({
      ...previous,
      ...updates,
    }));

    dispatch(setInterviewConfig(updates));
  };

  const handleDomainSelect = (domain) => {
    updateConfig({
      domain,
      subDomain: "",
    });
  };

  const handleCompanySelect = (companyName) => {
    if (companyName === "Custom") {
      setShowCustomCompany(true);
      updateConfig({
        targetCompany: customCompany,
      });
      return;
    }

    setShowCustomCompany(false);
    setCustomCompany("");
    updateConfig({
      targetCompany: companyName,
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume must be smaller than 5MB.");
      return;
    }

    setUploadProgress(0);

    const interval = window.setInterval(() => {
      setUploadProgress((previous) => {
        const next = previous + 10;

        if (next >= 100) {
          window.clearInterval(interval);
          updateConfig({ resume: file });
          return 100;
        }

        return next;
      });
    }, 80);
  };

  const addCustomQuestion = () => {
    const question = customQuestion.trim();

    if (!question) return;

    updateConfig({
      questions: [...(config.questions || []), question],
    });

    setCustomQuestion("");
    toast.success("Custom question added.");
  };

  const removeQuestion = (index) => {
    updateConfig({
      questions: (config.questions || []).filter(
        (_, questionIndex) => questionIndex !== index,
      ),
    });

    toast.success("Question removed.");
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return Boolean(config.domain && config.subDomain);
      case 2:
        return Boolean(config.interviewType && config.difficulty);
      case 3:
        return Boolean(config.duration && config.targetCompany);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleStartInterview = async () => {
    // Guard: prevent duplicate submissions while one is already in flight
    if (isSubmittingRef.current) return;

    if (!token) {
      toast.error("Please log in to continue.");
      navigate("/login");
      return;
    }

    const requiredFields = [
      config.domain,
      config.subDomain,
      config.interviewType,
      config.difficulty,
      config.duration,
      config.targetCompany,
    ];

    if (requiredFields.some((field) => !field)) {
      toast.error("Please complete all required fields.");
      return;
    }

    isSubmittingRef.current = true;
    setIsPreparingInterview(true);
    setPreparationProgress(0);

    // Build the payload first (synchronously) so we know what to send
    let interviewData = { ...config };

    if (config.resume) {
      const formData = new FormData();
      formData.append("resume", config.resume);
      formData.append("domain", config.domain);
      formData.append("subDomain", config.subDomain);
      formData.append("interviewType", config.interviewType);
      formData.append("difficulty", config.difficulty);
      formData.append("duration", String(config.duration));
      formData.append("targetCompany", config.targetCompany);

      if (config.questions?.length > 0) {
        formData.append("customQuestions", JSON.stringify(config.questions));
      }

      interviewData = formData;
    }

    // Run the visual progress animation and the real API call in parallel.
    // The animation takes ~3.5 s; the API call usually takes 2–5 s.
    // Neither blocks the other – we wait for both before navigating.
    const animateProgress = async () => {
      const steps = [20, 40, 60, 80, 100];
      const messages = [
        "Analyzing your resume...",
        "Generating personalized questions...",
        "Setting up the interview environment...",
        "Configuring your AI interviewer...",
        "Your interview is ready.",
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        setPreparationProgress(steps[i]);
        toast.loading(messages[i], { id: "interview-preparation" });
      }
    };

    try {
      // Fire both concurrently; apiResult resolves with the created interview id
      const [, createdInterview] = await Promise.all([
        animateProgress(),
        new Promise((resolve, reject) => {
          // createInterview is a Redux thunk; we wrap it so we can get the result
          import("../services/operations/interviewAPI").then(({ createInterview: create }) => {
            let headers = { Authorization: `Bearer ${token}` };
            let dataToSend = interviewData;

            if (!(interviewData instanceof FormData)) {
              if (!interviewData.domain || !interviewData.subDomain || !interviewData.interviewType) {
                reject(new Error("Please complete all required fields"));
                return;
              }
              dataToSend = {
                domain: interviewData.domain,
                subDomain: interviewData.subDomain,
                interviewType: interviewData.interviewType,
                difficulty: interviewData.difficulty,
                duration: interviewData.duration,
                targetCompany: interviewData.targetCompany,
                customQuestions: interviewData.questions,
              };
            } else {
              headers["Content-Type"] = "multipart/form-data";
            }

            import("../services/apiConnector").then(({ apiConnector }) => {
              import("../services/apis").then(({ interviewEndpoints }) => {
                apiConnector("POST", interviewEndpoints.CREATE_INTERVIEW_API, dataToSend, headers)
                  .then((response) => {
                    if (!response.data.success) {
                      reject(new Error(response.data.message || "Failed to create interview"));
                    } else {
                      resolve(response.data.data);
                    }
                  })
                  .catch(reject);
              });
            });
          });
        }),
      ]);

      toast.dismiss("interview-preparation");

      if (createdInterview) {
        const interviewId = createdInterview.id || createdInterview._id || createdInterview.interviewId;
        toast.success("Interview created successfully!");
        // Navigate to interview room with the real ID from the backend
        navigate(`/interview-room/${interviewId}`);
      } else {
        throw new Error("No interview ID returned from server");
      }
    } catch (error) {
      console.error("CREATE_INTERVIEW_API ERROR:", error);
      toast.dismiss("interview-preparation");
      toast.error(
        error.response?.data?.message || error.message || "Failed to create interview"
      );
      // Reset so the user can retry from the setup form
      setIsPreparingInterview(false);
      setPreparationProgress(0);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const renderPreparingScreen = () => (
    <div className="nk-setup" data-nk-theme={nkTheme}>
      <style>{INTERVIEW_SETUP_CSS}</style>

      <div className="setup-preparing">
        <div className="setup-preparing-card">
          <div className="setup-loader" aria-hidden="true" />

          <div style={{ textAlign: "center" }}>
            <span className="setup-kicker">
              <WandSparkles size={13} />
              Preparing session
            </span>

            <h1 className="setup-title" style={{ fontSize: 36 }}>
              Your interview is almost ready
            </h1>

            <p className="setup-description" style={{ fontSize: 15 }}>
              We are configuring the experience around your selected goals.
            </p>
          </div>

          <div className="setup-preparation-bar">
            <div
              className="setup-preparation-fill"
              style={{ width: `${preparationProgress}%` }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <span className="setup-progress-label">
              <span>Preparing interview</span>
            </span>
            <strong>{preparationProgress}%</strong>
          </div>

          <div className="setup-status-list">
            {[
              ["Resume analysis", 20],
              ["Question generation", 40],
              ["Environment setup", 60],
              ["AI configuration", 80],
            ].map(([label, requiredProgress]) => {
              const complete = preparationProgress >= requiredProgress;

              return (
                <div
                  key={label}
                  className={`setup-status-item ${complete ? "is-complete" : ""
                    }`}
                >
                  {complete ? (
                    <Check size={16} />
                  ) : (
                    <LoaderCircle size={16} />
                  )}
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (isPreparingInterview) {
    return renderPreparingScreen();
  }

  return (
    <div className="nk-setup" data-nk-theme={nkTheme}>
      <style>{INTERVIEW_SETUP_CSS}</style>

      <header className="setup-header">
        <div className="setup-container setup-header-inner">
          <button
            type="button"
            className="nk-btn nk-btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>

          <div className="setup-brand">

            <div className="hidden sm:block">
              <div style={{ fontWeight: 500 }}>Interview setup</div>
              <div style={{ color: "var(--nk-mute)", fontSize: 12 }}>
                Build your personalized session
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />

            <span className="setup-user">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User size={18} />
              )}
            </span>
          </div>
        </div>
      </header>

      <main className="setup-main">
        <div className="setup-container">
          <div className="setup-progress" aria-label="Interview setup progress">
            {STEPS.map((setupStep) => {
              const completed = step > setupStep.number;
              const active = step === setupStep.number;

              return (
                <div
                  key={setupStep.number}
                  className={`setup-progress-item ${completed ? "is-complete" : ""
                    } ${active ? "is-active" : ""}`}
                >
                  <div className="setup-progress-number">
                    {completed ? <Check size={16} /> : setupStep.number}
                  </div>

                  <div className="setup-progress-label">
                    <strong>{setupStep.label}</strong>
                    <span>{setupStep.description}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <section className="setup-card">
            <div className="setup-content">
              {step === 1 && (
                <div>
                  <StepHeader
                    step={1}
                    title="Choose your"
                    accent="domain"
                    description="Select the technical area where you want to showcase your expertise."
                  />

                  <div className="setup-grid">
                    {DOMAINS.map((domain, index) => (
                      <SetupOption
                        key={domain.value}
                        selected={config.domain === domain.value}
                        icon={domain.icon}
                        iconColor={domain.color}
                        title={domain.label}
                        description={`${domain.subDomains.length} specializations`}
                        onClick={() => handleDomainSelect(domain.value)}
                        className={`setup-fade-up setup-stagger-${Math.min(
                          index % 4,
                          3,
                        )}`}
                      />
                    ))}
                  </div>

                  {selectedDomain && (
                    <div className="setup-subdomain">
                      <h2 className="setup-section-title">
                        <Target size={20} />
                        Select your specialization
                      </h2>

                      <div className="setup-subdomain-grid">
                        {selectedDomain.subDomains.map((subDomain) => (
                          <button
                            key={subDomain}
                            type="button"
                            className={`setup-chip ${config.subDomain === subDomain
                              ? "is-selected"
                              : ""
                              }`}
                            onClick={() =>
                              updateConfig({ subDomain })
                            }
                            aria-pressed={config.subDomain === subDomain}
                          >
                            {subDomain}
                            {config.subDomain === subDomain && (
                              <Check
                                size={14}
                                style={{ marginLeft: 6, verticalAlign: "middle" }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <StepHeader
                    step={2}
                    title="Choose interview"
                    accent="format"
                    description="Select the interview type and difficulty that match your preparation goals."
                  />

                  <section className="setup-section" style={{ marginTop: 0 }}>
                    <h2 className="setup-section-title">
                      <Lightbulb size={20} />
                      Interview type
                    </h2>

                    <div className="setup-grid setup-grid-two">
                      {INTERVIEW_TYPES.map((type, index) => (
                        <SetupOption
                          key={type.value}
                          selected={config.interviewType === type.value}
                          icon={type.icon}
                          title={type.label}
                          description={type.description}
                          onClick={() =>
                            updateConfig({
                              interviewType: type.value,
                            })
                          }
                          className={`setup-fade-up setup-stagger-${Math.min(
                            index,
                            3,
                          )}`}
                        >
                          <span className="setup-option-features">
                            {type.features.map((feature) => (
                              <span className="setup-feature" key={feature}>
                                {feature}
                              </span>
                            ))}
                          </span>
                        </SetupOption>
                      ))}
                    </div>
                  </section>

                  <section className="setup-section">
                    <h2 className="setup-section-title">
                      <Target size={20} />
                      Difficulty level
                    </h2>

                    <div className="setup-grid setup-grid-four">
                      {DIFFICULTIES.map((difficulty, index) => (
                        <SetupOption
                          key={difficulty.value}
                          selected={config.difficulty === difficulty.value}
                          icon={difficulty.icon}
                          title={difficulty.label}
                          description={difficulty.description}
                          onClick={() =>
                            updateConfig({
                              difficulty: difficulty.value,
                            })
                          }
                          className={`setup-fade-up setup-stagger-${Math.min(
                            index,
                            3,
                          )}`}
                        >
                          <span className="setup-option-features">
                            <span className="setup-feature">
                              {difficulty.experience}
                            </span>
                          </span>

                          {difficulty.recommended && (
                            <span className="setup-recommended">
                              Recommended
                            </span>
                          )}
                        </SetupOption>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {step === 3 && (
                <div>
                  <StepHeader
                    step={3}
                    title="Configure"
                    accent="details"
                    description="Set the length of your interview and choose the company context you want to practice for."
                  />

                  <section className="setup-section" style={{ marginTop: 0 }}>
                    <h2 className="setup-section-title">
                      <Clock3 size={20} />
                      Interview duration
                    </h2>

                    <div className="setup-grid setup-grid-four">
                      {DURATIONS.map((duration, index) => (
                        <SetupOption
                          key={duration.value}
                          selected={config.duration === duration.value}
                          icon={duration.icon}
                          title={duration.label}
                          description={duration.description}
                          onClick={() =>
                            updateConfig({
                              duration: duration.value,
                            })
                          }
                          className={`setup-duration setup-fade-up setup-stagger-${Math.min(
                            index,
                            3,
                          )}`}
                        >
                          {duration.recommended && (
                            <span className="setup-recommended">
                              Recommended
                            </span>
                          )}
                        </SetupOption>
                      ))}
                    </div>
                  </section>

                  <section className="setup-section">
                    <h2 className="setup-section-title">
                      <Target size={20} />
                      Target company
                    </h2>

                    <div className="setup-grid setup-grid-four">
                      {COMPANIES.map((company, index) => (
                        <SetupOption
                          key={company.name}
                          selected={
                            company.name === "Custom"
                              ? showCustomCompany
                              : config.targetCompany === company.name
                          }
                          icon={company.icon}
                          title={company.name}
                          onClick={() => handleCompanySelect(company.name)}
                          className={`setup-duration setup-fade-up setup-stagger-${Math.min(
                            index % 4,
                            3,
                          )}`}
                        />
                      ))}
                    </div>

                    {showCustomCompany && (
                      <div
                        className="setup-panel setup-fade-up"
                        style={{ marginTop: 16 }}
                      >
                        <label
                          htmlFor="custom-company"
                          className="setup-summary-label"
                        >
                          Company name
                        </label>

                        <input
                          id="custom-company"
                          type="text"
                          className="setup-field"
                          style={{ marginTop: 8 }}
                          value={customCompany}
                          onChange={(event) => {
                            const value = event.target.value;
                            setCustomCompany(value);
                            updateConfig({ targetCompany: value });
                          }}
                          placeholder="Enter company name"
                        />
                      </div>
                    )}
                  </section>
                </div>
              )}

              {step === 4 && (
                <div>
                  <StepHeader
                    step={4}
                    title="Enhance your"
                    accent="experience"
                    description="Upload your resume and add custom questions for a more personalized interview."
                  />

                  <section className="setup-upload" style={{ marginTop: 0 }}>
                    <div className="setup-upload-icon">
                      <FileText size={28} />
                    </div>

                    <h2 className="setup-upload-title">
                      Upload your resume
                    </h2>

                    <p className="setup-upload-description">
                      The AI interviewer can use your experience to generate
                      more relevant questions.
                    </p>

                    {!config.resume ? (
                      <>
                        <label className="setup-file">
                          <Upload size={17} />
                          Choose PDF file
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileUpload}
                            hidden
                          />
                        </label>

                        <p
                          style={{
                            marginTop: 12,
                            color: "var(--nk-mute)",
                            fontSize: 12,
                          }}
                        >
                          PDF only · Maximum file size 5MB
                        </p>
                      </>
                    ) : (
                      <div>
                        <div className="setup-uploaded-file">
                          <Check size={20} />
                          <div style={{ textAlign: "left" }}>
                            <strong>{config.resume.name}</strong>
                            <div
                              style={{
                                color: "var(--nk-success)",
                                fontSize: 12,
                                marginTop: 3,
                              }}
                            >
                              Successfully uploaded
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="nk-btn nk-btn-secondary"
                          style={{ marginTop: 16 }}
                          onClick={() => {
                            updateConfig({ resume: null });
                            setUploadProgress(0);
                          }}
                        >
                          Remove file
                        </button>
                      </div>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div style={{ marginTop: 18 }}>
                        <div className="setup-progress-track">
                          <div
                            className="setup-progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>

                        <div
                          style={{
                            marginTop: 8,
                            color: "var(--nk-mute)",
                            fontSize: 12,
                          }}
                        >
                          Uploading… {uploadProgress}%
                        </div>
                      </div>
                    )}
                  </section>

                  <section className="setup-panel setup-section">
                    <h2 className="setup-section-title">
                      <Sparkles size={20} />
                      Add custom questions
                      <span
                        style={{
                          color: "var(--nk-mute)",
                          fontSize: 12,
                          fontWeight: 400,
                        }}
                      >
                        Optional
                      </span>
                    </h2>

                    <div className="setup-question-form">
                      <input
                        type="text"
                        className="setup-field"
                        value={customQuestion}
                        onChange={(event) =>
                          setCustomQuestion(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addCustomQuestion();
                          }
                        }}
                        placeholder="What would you like the interviewer to ask?"
                      />

                      <button
                        type="button"
                        className="nk-btn nk-btn-primary"
                        onClick={addCustomQuestion}
                        disabled={!customQuestion.trim()}
                      >
                        <Plus size={17} />
                        Add
                      </button>
                    </div>

                    {config.questions?.length > 0 ? (
                      <div style={{ marginTop: 24 }}>
                        <div
                          style={{
                            marginBottom: 10,
                            color: "var(--nk-mute)",
                            fontSize: 13,
                          }}
                        >
                          {config.questions.length} custom question
                          {config.questions.length === 1 ? "" : "s"} added
                        </div>

                        {config.questions.map((question, index) => (
                          <div className="setup-question" key={`${question}-${index}`}>
                            <span className="setup-question-number">
                              {index + 1}
                            </span>

                            <p className="setup-question-text">{question}</p>

                            <button
                              type="button"
                              className="setup-question-remove"
                              onClick={() => removeQuestion(index)}
                              aria-label={`Remove question ${index + 1}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "32px 0 8px",
                          textAlign: "center",
                          color: "var(--nk-mute)",
                        }}
                      >
                        <FileText
                          size={32}
                          style={{ margin: "0 auto 10px", opacity: 0.6 }}
                        />
                        <div>No custom questions added yet.</div>
                      </div>
                    )}

                    <div className="setup-tip">
                      <Lightbulb size={18} />
                      <span>
                        Custom questions will be integrated with AI-generated
                        questions for a more comprehensive interview.
                      </span>
                    </div>
                  </section>

                  <section className="setup-summary">
                    <h2 className="setup-section-title" style={{ marginBottom: 0 }}>
                      <Rocket size={20} />
                      Interview summary
                    </h2>

                    <div className="setup-summary-grid">
                      <div className="setup-summary-item">
                        <div className="setup-summary-label">Domain</div>
                        <div className="setup-summary-value">
                          {config.domain || "—"}
                        </div>
                        <div className="setup-summary-subvalue">
                          {config.subDomain || "—"}
                        </div>
                      </div>

                      <div className="setup-summary-item">
                        <div className="setup-summary-label">Interview type</div>
                        <div className="setup-summary-value">
                          {config.interviewType || "—"}
                        </div>
                      </div>

                      <div className="setup-summary-item">
                        <div className="setup-summary-label">Difficulty</div>
                        <div className="setup-summary-value">
                          {config.difficulty || "—"}
                        </div>
                      </div>

                      <div className="setup-summary-item">
                        <div className="setup-summary-label">Duration</div>
                        <div className="setup-summary-value">
                          {config.duration ? `${config.duration} minutes` : "—"}
                        </div>
                      </div>

                      <div className="setup-summary-item">
                        <div className="setup-summary-label">
                          Target company
                        </div>
                        <div className="setup-summary-value">
                          {config.targetCompany || "—"}
                        </div>
                      </div>

                      <div className="setup-summary-item">
                        <div className="setup-summary-label">
                          Custom questions
                        </div>
                        <div className="setup-summary-value">
                          {config.questions?.length || 0} added
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </section>

          <div className="setup-actions">
            <button
              type="button"
              className="nk-btn nk-btn-secondary"
              onClick={() => setStep((previous) => Math.max(1, previous - 1))}
              disabled={step === 1}
            >
              <ArrowLeft size={17} />
              Previous
            </button>

            {step < 4 ? (
              <button
                type="button"
                className="nk-btn nk-btn-primary"
                onClick={() => setStep((previous) => previous + 1)}
                disabled={!isStepComplete()}
              >
                Continue
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                className="nk-btn nk-btn-primary"
                onClick={handleStartInterview}
                disabled={!token}
              >
                <Rocket size={17} />
                Launch interview
                <ChevronRight size={17} />
              </button>
            )}
          </div>

          <div className="setup-step-indicator">
            <div className="setup-dots" aria-hidden="true">
              {[1, 2, 3, 4].map((item) => (
                <span
                  key={item}
                  className={`setup-dot ${step >= item ? "is-active" : ""
                    }`}
                />
              ))}
            </div>

            <div>
              Step {step} of 4 · {Math.round((step / 4) * 100)}% complete
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InterviewSetup;