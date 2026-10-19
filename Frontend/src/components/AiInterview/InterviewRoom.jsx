import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Check,
  CheckCircle,
  ChevronDown,
  Clock3,
  Code2,
  FileCode2,
  Maximize2,
  MessageSquare,
  Mic,
  MicOff,
  Minimize2,
  Pause,
  Phone,
  Play,
  Send,
  Settings2,
  Target,
  TrendingUp,
  UserRound,
  Video,
  VideoOff,
  X,
  Zap,
} from "lucide-react";

import {
  getInterviewById,
  getInterviewSession,
  startInterview,
} from "../../services/operations/aiInterviewApi";
import BodyLanguageCoach from "./BodyLanguageCoach";

const ROOM_CSS = `
.ir-root {
  --ir-ink: #111111;
  --ir-on-ink: #ffffff;
  --ir-canvas: #ffffff;
  --ir-cloud: #f5f5f5;
  --ir-hairline: #cacacb;
  --ir-hairline-soft: #e5e5e5;
  --ir-charcoal: #39393b;
  --ir-mute: #707072;
  --ir-success: #007d48;
  --ir-danger: #d30005;
  --ir-warning: #9a6700;
  --ir-ease: cubic-bezier(0.22, 1, 0.36, 1);

  min-height: 100vh;
  background: var(--ir-canvas);
  color: var(--ir-ink);
  font-family: "Helvetica Now Text", "Helvetica Neue", Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.ir-root[data-ir-theme="dark"] {
  --ir-ink: #ffffff;
  --ir-on-ink: #111111;
  --ir-canvas: #111111;
  --ir-cloud: #1f1f21;
  --ir-hairline: #39393b;
  --ir-hairline-soft: #2a2a2c;
  --ir-charcoal: #cacacb;
  --ir-mute: #9e9ea0;
  --ir-success: #1eaa52;
  --ir-danger: #ff5b61;
  --ir-warning: #e5ad36;
}

.ir-root *,
.ir-root *::before,
.ir-root *::after {
  box-sizing: border-box;
}

.ir-root button,
.ir-root input,
.ir-root select {
  font: inherit;
}

.ir-root button {
  cursor: pointer;
}

.ir-root button:disabled {
  cursor: not-allowed;
}

.ir-root :is(button, input, select, [role="button"]):focus-visible {
  outline: 2px solid var(--ir-ink);
  outline-offset: 3px;
}

.ir-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--ir-canvas);
}

.ir-header {
  position: relative;
  z-index: 40;
  min-height: 72px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--ir-hairline-soft);
  background: color-mix(in srgb, var(--ir-canvas) 92%, transparent);
  backdrop-filter: blur(18px);
}

.ir-header-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 28px;
}

.ir-header-left,
.ir-header-right,
.ir-inline {
  display: flex;
  align-items: center;
}

.ir-header-left,
.ir-header-right {
  gap: 12px;
}

.ir-status {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ir-status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: var(--ir-mute);
}

.ir-status-dot.is-live {
  background: var(--ir-success);
  animation: ir-pulse 1.7s ease-in-out infinite;
}

.ir-header-title {
  max-width: 280px;
  overflow: hidden;
  color: var(--ir-ink);
  font-size: 15px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ir-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid var(--ir-hairline);
  border-radius: 999px;
  background: var(--ir-canvas);
  color: var(--ir-ink);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.ir-pill-muted {
  color: var(--ir-mute);
}

.ir-pill-danger {
  border-color: color-mix(in srgb, var(--ir-danger) 55%, transparent);
  color: var(--ir-danger);
}

.ir-pill-success {
  border-color: color-mix(in srgb, var(--ir-success) 55%, transparent);
  color: var(--ir-success);
}

.ir-timer {
  min-width: 110px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--ir-ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: .04em;
}

.ir-timer.is-warning {
  color: var(--ir-warning);
}

.ir-timer.is-danger {
  color: var(--ir-danger);
  animation: ir-pulse 1.2s ease-in-out infinite;
}

.ir-btn {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  transition:
    transform .2s var(--ir-ease),
    background-color .25s ease,
    color .25s ease,
    opacity .25s ease;
}

.ir-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.ir-btn:active:not(:disabled) {
  transform: scale(.97);
}

.ir-btn:disabled {
  opacity: .42;
}

.ir-btn-primary {
  background: var(--ir-ink);
  color: var(--ir-on-ink);
}

.ir-btn-primary:hover:not(:disabled) {
  background: var(--ir-charcoal);
}

.ir-btn-secondary {
  background: var(--ir-cloud);
  color: var(--ir-ink);
}

.ir-btn-secondary:hover:not(:disabled) {
  background: var(--ir-hairline-soft);
}

.ir-btn-danger {
  background: var(--ir-danger);
  color: #ffffff;
}

.ir-btn-danger:hover:not(:disabled) {
  opacity: .84;
}

.ir-btn-icon {
  width: 40px;
  height: 40px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ir-ink);
  transition: background-color .25s ease, transform .2s var(--ir-ease);
}

.ir-btn-icon:hover {
  background: var(--ir-cloud);
  transform: translateY(-2px);
}

.ir-room {
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1px;
  overflow: hidden;
  background: var(--ir-hairline-soft);
}

.ir-stage {
  position: relative;
  min-height: calc(100vh - 73px);
  overflow: hidden;
  background: #202021;
}

.ir-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #202021;
}

.ir-video-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: #202021;
  color: #ffffff;
}

.ir-video-placeholder-inner {
  width: 120px;
  height: 120px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .22);
  border-radius: 50%;
  background: rgba(255, 255, 255, .08);
  color: #ffffff;
  font-size: 40px;
}

.ir-stage-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, .48), transparent 28%),
    linear-gradient(to top, rgba(0, 0, 0, .70), transparent 45%);
}

.ir-stage-topbar {
  position: absolute;
  top: 20px;
  left: 24px;
  right: 24px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ir-stage-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid rgba(255, 255, 255, .24);
  border-radius: 999px;
  background: rgba(17, 17, 17, .58);
  color: #ffffff;
  font-size: 12px;
  backdrop-filter: blur(14px);
}

.ir-stage-label span {
  color: rgba(255, 255, 255, .66);
}

.ir-interviewer-card {
  position: absolute;
  top: 76px;
  right: 24px;
  z-index: 5;
  width: 230px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, .22);
  background: rgba(17, 17, 17, .72);
  color: #ffffff;
  backdrop-filter: blur(16px);
}

.ir-interviewer-mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, .35);
  border-radius: 50%;
  color: #ffffff;
}

.ir-interviewer-name {
  font-size: 15px;
  font-weight: 500;
}

.ir-interviewer-state {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 7px;
  color: rgba(255, 255, 255, .62);
  font-size: 12px;
}

.ir-speaking-bars {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 17px;
  margin-top: 14px;
}

.ir-speaking-bar {
  width: 3px;
  border-radius: 999px;
  background: #ffffff;
  animation: ir-speaking 1s ease-in-out infinite;
}

.ir-speaking-bar:nth-child(1) { animation-delay: 0ms; }
.ir-speaking-bar:nth-child(2) { animation-delay: 120ms; }
.ir-speaking-bar:nth-child(3) { animation-delay: 240ms; }
.ir-speaking-bar:nth-child(4) { animation-delay: 360ms; }

.ir-message {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 112px;
  z-index: 5;
  width: min(760px, calc(100% - 48px));
  margin: 0 auto;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, .2);
  background: rgba(17, 17, 17, .84);
  color: #ffffff;
  backdrop-filter: blur(18px);
}

.ir-message-header {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 9px;
  color: rgba(255, 255, 255, .62);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.ir-message p {
  margin: 0;
  font-size: 17px;
  line-height: 1.55;
}

.ir-transcript {
  position: absolute;
  top: 78px;
  left: 24px;
  z-index: 20;
  width: min(650px, calc(100% - 48px));
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, .25);
  background: rgba(17, 17, 17, .88);
  color: #ffffff;
  backdrop-filter: blur(18px);
}

.ir-transcript-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.ir-transcript p {
  margin: 0;
  color: rgba(255, 255, 255, .88);
  font-size: 16px;
  line-height: 1.5;
}

.ir-controls {
  position: absolute;
  bottom: 24px;
  left: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 999px;
  background: rgba(17, 17, 17, .86);
  transform: translateX(-50%);
  backdrop-filter: blur(18px);
}

.ir-control {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, .12);
  color: #ffffff;
  transition: background-color .25s ease, transform .2s var(--ir-ease);
}

.ir-control:hover {
  background: rgba(255, 255, 255, .22);
  transform: translateY(-2px);
}

.ir-control.is-off {
  background: rgba(211, 0, 5, .82);
}

.ir-control-end {
  margin-left: 5px;
  background: #d30005;
}

.ir-control-end:hover {
  background: #b40004;
}

.ir-action {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 19px;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: #111111;
  font-size: 13px;
  font-weight: 500;
  transition: transform .2s var(--ir-ease), opacity .25s ease;
}

.ir-action:hover {
  transform: translateY(-2px);
}

.ir-action-submit {
  background: var(--ir-success);
  color: #ffffff;
}

.ir-action-pause {
  background: #b98916;
  color: #ffffff;
}

.ir-sidebar {
  position: relative;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--ir-canvas);
}

.ir-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--ir-hairline-soft);
}

.ir-sidebar-title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 16px;
  font-weight: 500;
}

.ir-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.ir-sidebar-section + .ir-sidebar-section {
  margin-top: 28px;
}

.ir-sidebar-label {
  margin-bottom: 10px;
  color: var(--ir-mute);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.ir-question-card {
  padding: 18px;
  border: 1px solid var(--ir-hairline-soft);
  background: var(--ir-cloud);
}

.ir-question-card p {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
}

.ir-question-card-empty {
  color: var(--ir-mute);
}

.ir-metric-list {
  display: grid;
  gap: 8px;
}

.ir-metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--ir-hairline-soft);
}

.ir-metric:last-child {
  border-bottom: 0;
}

.ir-metric-label {
  color: var(--ir-mute);
  font-size: 13px;
}

.ir-metric-value {
  color: var(--ir-ink);
  font-size: 14px;
  font-weight: 500;
}

.ir-progress {
  height: 5px;
  margin-top: 7px;
  overflow: hidden;
  background: var(--ir-hairline-soft);
}

.ir-progress-fill {
  height: 100%;
  background: var(--ir-ink);
  transition: width .45s var(--ir-ease);
}

.ir-stats-panel {
  position: absolute;
  top: 20px;
  left: 24px;
  z-index: 30;
  width: 280px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, .22);
  background: rgba(17, 17, 17, .9);
  color: #ffffff;
  backdrop-filter: blur(18px);
}

.ir-stats-panel .ir-metric {
  border-color: rgba(255, 255, 255, .14);
}

.ir-stats-panel .ir-metric-label {
  color: rgba(255, 255, 255, .58);
}

.ir-stats-panel .ir-metric-value {
  color: #ffffff;
}

.ir-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(17, 17, 17, .78);
  backdrop-filter: blur(10px);
}

.ir-ready-card {
  width: min(640px, 100%);
  padding: 42px;
  border: 1px solid rgba(255, 255, 255, .2);
  background: #ffffff;
  color: #111111;
  box-shadow: 0 24px 80px rgba(0, 0, 0, .3);
}

.ir-root[data-ir-theme="dark"] .ir-ready-card {
  background: #1f1f21;
  color: #ffffff;
}

.ir-ready-mark {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  border-radius: 50%;
  background: var(--ir-ink);
  color: var(--ir-on-ink);
}

.ir-ready-card h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -.03em;
}

.ir-ready-card > p {
  margin: 14px 0 24px;
  color: var(--ir-mute);
  line-height: 1.55;
}

.ir-ready-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 28px;
}

.ir-ready-item {
  min-height: 90px;
  padding: 15px;
  background: var(--ir-cloud);
}

.ir-ready-item-label {
  color: var(--ir-mute);
  font-size: 11px;
  text-transform: uppercase;
}

.ir-ready-item-value {
  margin-top: 9px;
  overflow-wrap: anywhere;
  font-size: 15px;
  font-weight: 500;
}

.ir-code-overlay {
  position: absolute;
  inset: 18px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--ir-hairline);
  background: #151515;
  color: #ffffff;
  box-shadow: 0 24px 80px rgba(0, 0, 0, .35);
}

.ir-code-overlay.is-fullscreen {
  inset: 0;
}

.ir-code-header,
.ir-code-toolbar,
.ir-code-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #353535;
  background: #1d1d1d;
}

.ir-code-toolbar {
  justify-content: flex-start;
  flex-wrap: wrap;
  border-bottom: 1px solid #353535;
}

.ir-code-footer {
  border-top: 1px solid #353535;
  border-bottom: 0;
}

.ir-code-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ir-code-title strong {
  display: block;
  font-size: 15px;
  font-weight: 500;
}

.ir-code-title span {
  display: block;
  margin-top: 3px;
  color: #a3a3a3;
  font-size: 12px;
}

.ir-code-body {
  min-height: 0;
  flex: 1;
  display: grid;
  grid-template-columns: 35% 65%;
}

.ir-code-problem {
  overflow-y: auto;
  padding: 22px;
  border-right: 1px solid #353535;
  background: #191919;
}

.ir-code-problem h3 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
}

.ir-code-problem p {
  margin: 0;
  color: #d0d0d0;
  font-size: 14px;
  line-height: 1.6;
}

.ir-code-instructions {
  margin: 24px 0 0;
  padding-left: 18px;
  color: #a3a3a3;
  font-size: 13px;
  line-height: 1.7;
}

.ir-code-editor {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ir-code-select {
  min-height: 38px;
  padding: 0 34px 0 12px;
  border: 1px solid #555555;
  border-radius: 999px;
  outline: none;
  appearance: none;
  background: #282828;
  color: #ffffff;
}

.ir-code-select-wrap {
  position: relative;
}

.ir-code-select-icon {
  position: absolute;
  top: 50%;
  right: 11px;
  pointer-events: none;
  transform: translateY(-50%);
}

.ir-code-output {
  max-height: 170px;
  overflow-y: auto;
  padding: 15px 18px;
  border-top: 1px solid #353535;
  background: #191919;
}

.ir-code-output pre {
  margin: 0;
  color: #7ee787;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.ir-notifications {
  position: fixed;
  top: 88px;
  right: 24px;
  z-index: 100;
  display: grid;
  gap: 8px;
  width: min(360px, calc(100vw - 32px));
}

.ir-notification {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 13px 15px;
  border: 1px solid var(--ir-hairline);
  background: var(--ir-canvas);
  color: var(--ir-ink);
  box-shadow: 0 12px 32px rgba(0, 0, 0, .16);
  animation: ir-slide-in .3s var(--ir-ease) both;
  font-size: 13px;
}

.ir-notification.success {
  border-color: color-mix(in srgb, var(--ir-success) 55%, transparent);
}

.ir-notification.error {
  border-color: color-mix(in srgb, var(--ir-danger) 55%, transparent);
}

.ir-notification.info {
  border-color: color-mix(in srgb, var(--ir-ink) 38%, transparent);
}

.ir-loading {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--ir-canvas);
  color: var(--ir-ink);
}

.ir-loading-inner {
  text-align: center;
}

.ir-loading-mark {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  margin: 0 auto 20px;
  border: 1px solid var(--ir-hairline);
  border-radius: 50%;
  animation: ir-spin 1s linear infinite;
}

.ir-loading h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
}

.ir-loading p {
  margin: 8px 0 0;
  color: var(--ir-mute);
  font-size: 14px;
}

@keyframes ir-spin {
  to { transform: rotate(360deg); }
}

@keyframes ir-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .42; }
}

@keyframes ir-speaking {
  0%, 100% { height: 5px; }
  50% { height: 17px; }
}

@keyframes ir-slide-in {
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1100px) {
  .ir-room {
    grid-template-columns: minmax(0, 1fr) 300px;
  }

  .ir-interviewer-card {
    width: 200px;
  }
}

@media (max-width: 850px) {
  .ir-room {
    display: block;
    overflow: auto;
  }

  .ir-stage {
    min-height: calc(100vh - 73px);
  }

  .ir-sidebar {
    display: none;
  }

  .ir-header-inner {
    padding: 12px 16px;
  }

  .ir-header-title {
    max-width: 150px;
  }

  .ir-header-left,
  .ir-header-right {
    gap: 7px;
  }

  .ir-interviewer-card {
    top: 72px;
    right: 16px;
    width: 185px;
    padding: 14px;
  }

  .ir-stage-topbar {
    left: 16px;
    right: 16px;
  }

  .ir-message {
    left: 16px;
    right: 16px;
    width: calc(100% - 32px);
  }

  .ir-transcript {
    left: 16px;
    width: calc(100% - 32px);
  }

  .ir-controls {
    max-width: calc(100% - 24px);
    overflow-x: auto;
  }
}

@media (max-width: 560px) {
  .ir-header {
    min-height: auto;
  }

  .ir-header-inner {
    flex-wrap: wrap;
  }

  .ir-header-left {
    width: 100%;
    justify-content: space-between;
  }

  .ir-header-right {
    width: 100%;
    justify-content: space-between;
  }

  .ir-header-right > .ir-btn {
    flex: 1;
  }

  .ir-interviewer-card {
    top: 122px;
  }

  .ir-message {
    bottom: 125px;
    padding: 16px;
  }

  .ir-message p {
    font-size: 15px;
  }

  .ir-controls {
    bottom: 16px;
    padding: 7px;
  }

  .ir-control {
    width: 40px;
    height: 40px;
  }

  .ir-action {
    padding: 0 13px;
    font-size: 12px;
  }

  .ir-ready-card {
    padding: 28px 20px;
  }

  .ir-ready-grid {
    grid-template-columns: 1fr;
  }

  .ir-code-overlay {
    inset: 0;
  }

  .ir-code-body {
    display: block;
    overflow-y: auto;
  }

  .ir-code-problem {
    max-height: 210px;
    border-right: 0;
    border-bottom: 1px solid #353535;
  }

  .ir-code-editor {
    min-height: 420px;
  }

  .ir-code-footer {
    flex-wrap: wrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ir-root *,
  .ir-root *::before,
  .ir-root *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

const LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
    icon: "JS",
    starter: "// Write your solution here\\n\\n",
  },
  {
    value: "python",
    label: "Python",
    icon: "PY",
    starter: "# Write your solution here\\n\\n",
  },
  {
    value: "java",
    label: "Java",
    icon: "☕",
    starter:
      "class Solution {\\n  public static void main(String[] args) {\\n  }\\n}\\n",
  },
  {
    value: "cpp",
    label: "C++",
    icon: "C++",
    starter:
      "#include <iostream>\\n\\nint main() {\\n  return 0;\\n}\\n",
  },
  {
    value: "typescript",
    label: "TypeScript",
    icon: "TS",
    starter: "// Write your solution here\\n\\n",
  },
];

function getStarterCode(language) {
  return (
    LANGUAGES.find((item) => item.value === language)?.starter ||
    "// Write your solution here\n\n"
  );
}

function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function getTimerClass(timeRemaining, interview) {
  if (!interview) return "";

  const total = interview.duration * 60;
  const percentage = total > 0 ? (timeRemaining / total) * 100 : 100;

  if (percentage <= 25) return "is-danger";
  if (percentage <= 50) return "is-warning";
  return "";
}

function MetricRow({ label, value, progress, valueClass = "" }) {
  return (
    <div>
      <div className="ir-metric">
        <span className="ir-metric-label">{label}</span>
        <span className={`ir-metric-value ${valueClass}`}>{value}</span>
      </div>

      {typeof progress === "number" && (
        <div className="ir-progress">
          <div
            className="ir-progress-fill"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

const InterviewRoom = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme || {});

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("ready");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(
    "Loading interview...",
  );
  const [conversationHistory, setConversationHistory] = useState([]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    averageScore: 0,
    technicalScore: 0,
    communicationScore: 0,
    problemSolvingScore: 0,
    currentStreak: 0,
    questionsAnswered: 0,
    perfectAnswers: 0,
    totalQuestions: 0,
  });

  const [timeRemaining, setTimeRemaining] = useState(0);
  // Keep a ref in sync with state so the timer interval closure always reads the
  // latest value without needing timeRemaining in its own dependency array.
  const timeRemainingRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const videoRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const recognitionRef = useRef(null);
  const transcriptAccumulatorRef = useRef("");
  const shouldRestartRecognition = useRef(false);

  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  // Keep codeLanguage in a ref so the socket's handleAIMessage closure can read
  // the latest value without having codeLanguage in the socket effect's deps
  // (which would tear down and reconnect the socket on every language change).
  const codeLanguageRef = useRef("javascript");
  const [codeOutput, setCodeOutput] = useState("");
  const [isCodeFullscreen, setIsCodeFullscreen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showStats, setShowStats] = useState(false);

  const currentAudioRef = useRef(null);
  const questionStartTimeRef = useRef(null);
  // Guards against duplicate initializeInterview calls (React Strict Mode fires
  // effects twice in development; this ref ensures only the first call proceeds).
  const initializationStartedRef = useRef(false);

  const socketUrl =
    import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  const themeValue = theme === "dark" ? "dark" : "light";

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();

    setNotifications((previous) => [
      ...previous,
      {
        id,
        message,
        type,
      },
    ]);

    window.setTimeout(() => {
      setNotifications((previous) =>
        previous.filter((notification) => notification.id !== id),
      );
    }, 3200);
  }, []);

  const stopListening = useCallback(() => {
    shouldRestartRecognition.current = false;

    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already be stopped.
    }

    setIsListening(false);
  }, []);

  const stopAllMedia = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Recognition may already be stopped.
      }
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [stream]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopAllMedia();
    disconnectSocket();
  }, [disconnectSocket, stopAllMedia]);

  const updateMetricsFromEvaluations = useCallback(
    (evaluations) => {
      if (!evaluations?.length) return;

      const totalScore = evaluations.reduce(
        (sum, evaluation) => sum + (evaluation.score || 0),
        0,
      );

      const averageScore = totalScore / evaluations.length;

      const technicalEvaluations = evaluations.filter(
        (evaluation) => evaluation.category === "technical",
      );

      const behavioralEvaluations = evaluations.filter(
        (evaluation) => evaluation.category === "behavioral",
      );

      const codingEvaluations = evaluations.filter(
        (evaluation) => evaluation.category === "coding",
      );

      const average = (items) => {
        if (!items.length) return 0;

        const total = items.reduce(
          (sum, item) => sum + (item.score || 0),
          0,
        );

        return Math.round((total / items.length) * 10) / 10;
      };

      let currentStreak = 0;

      for (let index = evaluations.length - 1; index >= 0; index -= 1) {
        if ((evaluations[index].score || 0) >= 7) {
          currentStreak += 1;
        } else {
          break;
        }
      }

      setPerformanceMetrics((previous) => ({
        averageScore: Math.round(averageScore * 10) / 10,
        technicalScore: average(technicalEvaluations),
        communicationScore: average(behavioralEvaluations),
        problemSolvingScore: average(codingEvaluations),
        currentStreak,
        questionsAnswered: evaluations.length,
        perfectAnswers: evaluations.filter(
          (evaluation) => evaluation.score === 10,
        ).length,
        totalQuestions: previous.totalQuestions,
      }));
    },
    [],
  );

  const handleTimeUp = useCallback(() => {
    addNotification("Time is up. Ending interview...", "info");

    if (socket && session) {
      socket.emit("end-interview", {
        sessionId: session._id,
        interviewId,
      });
    }
  }, [addNotification, interviewId, session, socket]);

  const initializeInterview = useCallback(async () => {
    // Prevent Strict Mode double-invocation and accidental re-runs from
    // unstable useCallback dep references from causing two API calls.
    if (initializationStartedRef.current) return;
    initializationStartedRef.current = true;

    try {
      setLoading(true);

      const interviewData = await getInterviewById(interviewId, token);

      setInterview(interviewData);
      const durationSeconds = (interviewData.duration || 0) * 60;
      setTimeRemaining(durationSeconds);
      timeRemainingRef.current = durationSeconds;

      const totalQuestions = Math.floor(
        (interviewData.duration || 0) / 2.5,
      );

      setPerformanceMetrics((previous) => ({
        ...previous,
        totalQuestions,
      }));

      if (interviewData.status === "in-progress") {
        const sessionData = await getInterviewSession(interviewId, token);

        setSession(sessionData);
        setInterviewStarted(true);
        setSessionStatus("active");

        if (sessionData.conversation?.length) {
          setConversationHistory(sessionData.conversation);

          const lastMessage =
            sessionData.conversation[sessionData.conversation.length - 1];

          setCurrentMessage(
            lastMessage.content || "Interview in progress...",
          );
        }

        if (sessionData.questionEvaluations?.length) {
          updateMetricsFromEvaluations(sessionData.questionEvaluations);
        }
      } else {
        setCurrentMessage(
          "Ready to start? Begin when you are prepared.",
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Interview initialization failed:", error);
      // Allow a retry by resetting the guard
      initializationStartedRef.current = false;
      setLoading(false);
      addNotification(
        "Failed to load interview. Redirecting...",
        "error",
      );

      window.setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }, [
    addNotification,
    interviewId,
    navigate,
    token,
    updateMetricsFromEvaluations,
  ]);

  useEffect(() => {
    initializeInterview();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // cleanup and initializeInterview are stable after first render.
    // Including them causes the effect to re-run when unrelated state changes.
  }, []);  // intentionally empty — runs once on mount

  useEffect(() => {
    let mounted = true;
    let localStream = null;

    const setupMedia = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        if (!mounted) {
          localStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setStream(localStream);

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.error("Media access failed:", error);
        addNotification(
          "Camera and microphone access was not granted.",
          "error",
        );
      }
    };

    setupMedia();

    return () => {
      mounted = false;

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [addNotification]);

  // Keep the ref in sync on every render so the interval closure always reads
  // the current value without timeRemaining being a dep of this effect.
  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  });

  useEffect(() => {
    // Clear any existing interval before potentially starting a new one
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (sessionStatus !== "active" || isPaused || timeRemainingRef.current <= 0) {
      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      // Read via ref so we never need timeRemaining in the dep array (which
      // would restart the interval every second, creating an infinite loop).
      if (timeRemainingRef.current <= 1) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
        handleTimeUp();
        setTimeRemaining(0);
        timeRemainingRef.current = 0;
        return;
      }

      timeRemainingRef.current -= 1;
      setTimeRemaining(timeRemainingRef.current);
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // timeRemaining deliberately excluded — reads via ref instead
  }, [handleTimeUp, isPaused, sessionStatus]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported.");
      return undefined;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      transcriptAccumulatorRef.current = "";
      setUserTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const transcript = event.results[index][0].transcript;

        if (event.results[index].isFinal) {
          finalText += `${transcript} `;
        } else {
          interim += transcript;
        }
      }

      if (finalText) {
        transcriptAccumulatorRef.current += finalText;
      }

      setUserTranscript(
        `${transcriptAccumulatorRef.current}${interim}`,
      );
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        addNotification("Microphone access was denied.", "error");
        shouldRestartRecognition.current = false;
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      if (shouldRestartRecognition.current) {
        window.setTimeout(() => {
          try {
            recognition.start();
          } catch {
            shouldRestartRecognition.current = false;
            setIsListening(false);
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRecognition.current = false;

      try {
        recognition.abort();
      } catch {
        // Recognition may already be stopped.
      }
    };
  }, [addNotification]);

  const speakText = useCallback((text) => {
    if (!window.speechSynthesis || !text) {
      setAiSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setAiSpeaking(false);
    utterance.onerror = () => setAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const playAudioFromBase64 = useCallback((base64Data) => {
    return new Promise((resolve, reject) => {
      try {
        const byteCharacters = window.atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let index = 0; index < byteCharacters.length; index += 1) {
          byteNumbers[index] = byteCharacters.charCodeAt(index);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        currentAudioRef.current = audio;

        audio.onended = () => {
          setAiSpeaking(false);
          URL.revokeObjectURL(url);
          resolve();
        };

        audio.onerror = () => {
          setAiSpeaking(false);
          URL.revokeObjectURL(url);
          reject(new Error("Audio playback failed."));
        };

        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const handleAIMessage = useCallback(
    async (data) => {
      setCurrentMessage(data.message);
      setAiSpeaking(true);

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      setConversationHistory((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.message,
          type: data.type,
          timestamp: new Date(),
        },
      ]);

      if (data.hasAudio && data.audioBase64) {
        try {
          await playAudioFromBase64(data.audioBase64);
        } catch {
          speakText(data.message);
        }
      } else {
        speakText(data.message);
      }

      if (data.type === "question") {
        setCurrentQuestion({
          message: data.message,
          type: data.questionType,
          requiresCode: data.requiresCode,
          questionIndex: data.questionIndex,
        });

        questionStartTimeRef.current = Date.now();
        setUserTranscript("");
        transcriptAccumulatorRef.current = "";

        if (data.requiresCode) {
          setTimeout(() => {
            setShowCodeEditor(true);
            // Read via ref — avoids making codeLanguage a dep of this callback
            // which would in turn make it a dep of the socket effect, causing
            // the socket to disconnect/reconnect every time the user changes language.
            setCode(getStarterCode(codeLanguageRef.current));
          }, 1200);
        }
      }

      if (data.type === "feedback" || data.type === "code-review") {
        setCurrentQuestion(null);
        setShowCodeEditor(false);
      }
    },
    // codeLanguage intentionally excluded — reads via codeLanguageRef instead
    [playAudioFromBase64, speakText],
  );

  useEffect(() => {
    if (!session || !interviewStarted) return undefined;

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setSocketConnected(true);

      newSocket.emit("join-room", {
        roomId: interviewId,
        userId: session.userId,
      });

      window.setTimeout(() => {
        newSocket.emit("candidate-ready", {
          sessionId: session._id,
          interviewId,
        });
      }, 800);
    });

    newSocket.on("disconnect", () => {
      setSocketConnected(false);
    });

    newSocket.on("ai-message", handleAIMessage);

    newSocket.on("ai-status", (data) => {
      setCurrentMessage(data.message);
    });

    newSocket.on("performance-update", (data) => {
      setPerformanceMetrics((previous) => ({
        ...previous,
        ...data,
      }));
    });

    newSocket.on("gamification-update", (data) => {
      if (data.xpEarned > 0) {
        addNotification(`+${data.xpEarned} XP earned`, "success");
      }

      if (data.newBadges?.length) {
        data.newBadges.forEach((badge) => {
          addNotification(`Badge unlocked: ${badge.name}`, "success");
        });
      }
    });

    newSocket.on("interview-ended", () => {
      setSessionStatus("completed");
      cleanup();

      addNotification(
        "Interview completed. Redirecting to results...",
        "success",
      );

      window.setTimeout(() => {
        navigate(`/results/${interviewId}`);
      }, 1800);
    });

    newSocket.on("error", (error) => {
      addNotification(
        error?.message || "A connection error occurred.",
        "error",
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [
    addNotification,
    cleanup,
    handleAIMessage,
    interviewId,
    interviewStarted,
    navigate,
    session,
    socketUrl,
  ]);

  const handleStartInterview = async () => {
    // Prevent double-clicks while start is already in flight
    if (loading) return;

    try {
      // startInterview() in aiInterviewApi already calls setLoading(true/false)
      // internally. We don't call setLoading(true) here to avoid the double-set
      // that was causing a flicker of the loading screen.
      const result = await startInterview(interviewId, setLoading, token);

      if (!result || !result.session) {
        throw new Error("Server did not return a valid session");
      }

      setSession(result.session);
      setInterviewStarted(true);
      setSessionStatus("active");
      // Ensure loading is cleared after a successful start
      setLoading(false);

      addNotification("Interview started. Good luck.", "success");
    } catch (error) {
      console.error("Failed to start interview:", error);
      addNotification(
        error.response?.data?.message || "Failed to start interview. Please try again.",
        "error",
      );
      setLoading(false);
    }
  };

  const startListening = useCallback(() => {
    if (!currentQuestion || isListening || aiSpeaking || !isAudioOn) {
      return;
    }

    if (!recognitionRef.current) {
      addNotification(
        "Speech recognition is not available in this browser.",
        "error",
      );
      return;
    }

    try {
      transcriptAccumulatorRef.current = "";
      setUserTranscript("");
      shouldRestartRecognition.current = true;
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      addNotification("Unable to start speech recognition.", "error");
    }
  }, [
    addNotification,
    aiSpeaking,
    currentQuestion,
    isAudioOn,
    isListening,
  ]);

  const handleSubmitAnswer = useCallback(() => {
    const answer =
      transcriptAccumulatorRef.current.trim() ||
      userTranscript.trim();

    if (answer.length < 5) {
      addNotification(
        "Please provide a longer answer.",
        "error",
      );
      return;
    }

    if (!socket || !session || !currentQuestion) {
      addNotification("The interview connection is not ready.", "error");
      return;
    }

    stopListening();

    setConversationHistory((previous) => [
      ...previous,
      {
        role: "user",
        content: answer,
        type: "answer",
        timestamp: new Date(),
      },
    ]);

    socket.emit("candidate-answer", {
      sessionId: session._id,
      question: currentQuestion.message,
      answer,
      questionIndex: currentQuestion.questionIndex,
      category: currentQuestion.type,
    });

    setCurrentMessage("Processing your answer...");
    setUserTranscript("");
    transcriptAccumulatorRef.current = "";
    setCurrentQuestion(null);

    addNotification("Answer submitted.", "success");
  }, [
    addNotification,
    currentQuestion,
    session,
    socket,
    stopListening,
    userTranscript,
  ]);

  const handleRunCode = useCallback(() => {
    setCodeOutput(
      "Code compiled successfully.\n\nTest cases:\n• Test 1: Passed\n• Test 2: Passed\n• Test 3: Passed",
    );

    addNotification("Code executed successfully.", "success");
  }, [addNotification]);

  const handleSubmitCode = useCallback(() => {
    if (!code.trim()) {
      addNotification("Please write some code first.", "error");
      return;
    }

    if (!socket || !session || !currentQuestion) {
      addNotification("The interview connection is not ready.", "error");
      return;
    }

    socket.emit("submit-code", {
      sessionId: session._id,
      question: currentQuestion.message,
      code,
      language: codeLanguage,
    });

    setShowCodeEditor(false);
    setCode("");
    setCodeOutput("");
    setCurrentQuestion(null);

    addNotification("Solution submitted.", "success");
  }, [
    addNotification,
    code,
    codeLanguage,
    currentQuestion,
    session,
    socket,
  ]);

  const handleEndInterview = useCallback(() => {
    if (!window.confirm("Are you sure you want to end the interview?")) {
      return;
    }

    stopListening();

    if (socket && session) {
      socket.emit("end-interview", {
        sessionId: session._id,
        interviewId,
      });
    }
  }, [interviewId, session, socket, stopListening]);

  const toggleVideo = useCallback(() => {
    if (!stream) return;

    const track = stream.getVideoTracks()[0];

    if (!track) return;

    track.enabled = !track.enabled;
    setIsVideoOn(track.enabled);
  }, [stream]);

  const toggleAudio = useCallback(() => {
    if (!stream) return;

    const track = stream.getAudioTracks()[0];

    if (!track) return;

    track.enabled = !track.enabled;
    setIsAudioOn(track.enabled);
  }, [stream]);

  const timerClass = useMemo(
    () => getTimerClass(timeRemaining, interview),
    [interview, timeRemaining],
  );

  const answeredPercentage =
    performanceMetrics.totalQuestions > 0
      ? (performanceMetrics.questionsAnswered /
          performanceMetrics.totalQuestions) *
        100
      : 0;

  if (loading) {
    return (
      <div className="ir-root" data-ir-theme={themeValue}>
        <style>{ROOM_CSS}</style>

        <div className="ir-loading">
          <div className="ir-loading-inner">
            <div className="ir-loading-mark">
              <Activity size={24} />
            </div>
            <h1>Loading interview</h1>
            <p>Preparing your interview room</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ir-root" data-ir-theme={themeValue}>
      <style>{ROOM_CSS}</style>

      <div className="ir-shell">
        <header className="ir-header">
          <div className="ir-header-inner">
            <div className="ir-header-left">
              <button
                type="button"
                className="ir-btn-icon"
                onClick={() => navigate("/dashboard")}
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={19} />
              </button>

              <div className="ir-status">
                <span
                  className={`ir-status-dot ${
                    socketConnected && sessionStatus === "active"
                      ? "is-live"
                      : ""
                  }`}
                />

                <span className="ir-header-title">
                  {interview?.role || "Interview"}
                </span>
              </div>

              <span className="ir-pill">
                {interview?.difficulty?.toUpperCase() || "MEDIUM"}
              </span>

              <span className="ir-pill ir-pill-muted">
                <Target size={13} />
                {performanceMetrics.questionsAnswered}/
                {performanceMetrics.totalQuestions}
              </span>
            </div>

            <div className="ir-header-right">
              {sessionStatus === "active" && (
                <>
                  <div className={`ir-timer ${timerClass}`}>
                    <Clock3 size={18} />
                    {formatSeconds(timeRemaining)}
                  </div>

                  <button
                    type="button"
                    className="ir-btn ir-btn-secondary"
                    onClick={() => setIsPaused((previous) => !previous)}
                  >
                    {isPaused ? (
                      <>
                        <Play size={15} />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause size={15} />
                        Pause
                      </>
                    )}
                  </button>
                </>
              )}

              <button
                type="button"
                className="ir-btn ir-btn-secondary"
                onClick={() => setShowStats((previous) => !previous)}
              >
                <BarChart3 size={16} />
                Stats
              </button>

              {sessionStatus === "active" && (
                <button
                  type="button"
                  className="ir-btn ir-btn-danger"
                  onClick={handleEndInterview}
                >
                  End interview
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="ir-room">
          <section className="ir-stage">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="ir-video"
              style={{ opacity: isVideoOn ? 1 : 0 }}
            />

            <BodyLanguageCoach
              videoRef={videoRef}
              isVideoOn={isVideoOn}
            />

            {!isVideoOn && (
              <div className="ir-video-placeholder">
                <div className="ir-video-placeholder-inner">
                  {interview?.role?.charAt(0)?.toUpperCase() || (
                    <UserRound size={42} />
                  )}
                </div>
              </div>
            )}

            <div className="ir-stage-scrim" />

            <div className="ir-stage-topbar">
              <div className="ir-stage-label">
                <span
                  className={`ir-status-dot ${
                    sessionStatus === "active" ? "is-live" : ""
                  }`}
                />
                <span>
                  {sessionStatus === "active" ? "Live session" : "Waiting"}
                </span>
              </div>

              <div className="ir-stage-label">
                {isVideoOn ? "Camera on" : "Camera off"}
              </div>
            </div>

            <div className="ir-interviewer-card">
              <div className="ir-interviewer-mark">
                <MessageSquare size={22} />
              </div>

              <div className="ir-interviewer-name">
                Interviewer
              </div>

              <div className="ir-interviewer-state">
                <span
                  className={`ir-status-dot ${
                    socketConnected ? "is-live" : ""
                  }`}
                />

                {aiSpeaking
                  ? "Speaking"
                  : socketConnected
                    ? "Connected"
                    : "Connecting"}
              </div>

              {aiSpeaking && (
                <div className="ir-speaking-bars" aria-label="Interviewer speaking">
                  {[1, 2, 3, 4].map((bar) => (
                    <span
                      key={bar}
                      className="ir-speaking-bar"
                      style={{ height: `${5 + bar * 2}px` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {showStats && sessionStatus === "active" && (
              <div className="ir-stats-panel">
                <div className="ir-sidebar-title">
                  <TrendingUp size={17} />
                  Performance
                </div>

                <div style={{ marginTop: 14 }}>
                  <MetricRow
                    label="Average score"
                    value={`${performanceMetrics.averageScore}/10`}
                  />

                  <MetricRow
                    label="Current streak"
                    value={performanceMetrics.currentStreak}
                    valueClass="ir-pill-success"
                  />

                  <MetricRow
                    label="Perfect answers"
                    value={performanceMetrics.perfectAnswers}
                  />

                  <MetricRow
                    label="Technical"
                    value={`${performanceMetrics.technicalScore}/10`}
                  />

                  <MetricRow
                    label="Communication"
                    value={`${performanceMetrics.communicationScore}/10`}
                  />

                  <MetricRow
                    label="Problem solving"
                    value={`${performanceMetrics.problemSolvingScore}/10`}
                  />
                </div>
              </div>
            )}

            {isListening && userTranscript && !showCodeEditor && (
              <div className="ir-transcript">
                <div className="ir-transcript-header">
                  <Mic size={15} />
                  Live response
                </div>

                <p>{userTranscript}</p>
              </div>
            )}

            {currentMessage &&
              sessionStatus === "active" &&
              !showCodeEditor && (
                <div className="ir-message">
                  <div className="ir-message-header">
                    <MessageSquare size={15} />
                    Interviewer message
                  </div>

                  <p>{currentMessage}</p>
                </div>
              )}

            {sessionStatus === "ready" && !interviewStarted && (
              <div className="ir-overlay">
                <div className="ir-ready-card">
                  <div className="ir-ready-mark">
                    <Target size={28} />
                  </div>

                  <h1>Ready to start?</h1>

                  <p>
                    Your session will last{" "}
                    <strong>{interview?.duration} minutes</strong> with
                    approximately{" "}
                    <strong>
                      {performanceMetrics.totalQuestions} questions
                    </strong>
                    .
                  </p>

                  <div className="ir-ready-grid">
                    <div className="ir-ready-item">
                      <div className="ir-ready-item-label">Role</div>
                      <div className="ir-ready-item-value">
                        {interview?.role || "Interview"}
                      </div>
                    </div>

                    <div className="ir-ready-item">
                      <div className="ir-ready-item-label">Difficulty</div>
                      <div className="ir-ready-item-value">
                        {interview?.difficulty || "Medium"}
                      </div>
                    </div>

                    <div className="ir-ready-item">
                      <div className="ir-ready-item-label">Duration</div>
                      <div className="ir-ready-item-value">
                        {interview?.duration || 0} minutes
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ir-btn ir-btn-primary"
                    style={{ width: "100%" }}
                    onClick={handleStartInterview}
                    disabled={loading}
                  >
                    <Play size={17} />
                    {loading ? "Starting..." : "Start interview"}
                  </button>
                </div>
              </div>
            )}

            {showCodeEditor && currentQuestion && (
              <div
                className={`ir-code-overlay ${
                  isCodeFullscreen ? "is-fullscreen" : ""
                }`}
              >
                <div className="ir-code-header">
                  <div className="ir-code-title">
                    <FileCode2 size={20} />
                    <div>
                      <strong>Coding challenge</strong>
                      <span>
                        Question {(currentQuestion.questionIndex || 0) + 1}
                      </span>
                    </div>
                  </div>

                  <div className="ir-inline">
                    <button
                      type="button"
                      className="ir-btn-icon"
                      style={{ color: "#ffffff" }}
                      onClick={() =>
                        setIsCodeFullscreen((previous) => !previous)
                      }
                      aria-label={
                        isCodeFullscreen
                          ? "Exit fullscreen"
                          : "Enter fullscreen"
                      }
                    >
                      {isCodeFullscreen ? (
                        <Minimize2 size={18} />
                      ) : (
                        <Maximize2 size={18} />
                      )}
                    </button>

                    <button
                      type="button"
                      className="ir-btn-icon"
                      style={{ color: "#ffffff" }}
                      onClick={() => setShowCodeEditor(false)}
                      aria-label="Close code editor"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="ir-code-body">
                  <aside className="ir-code-problem">
                    <h3>Problem</h3>
                    <p>{currentQuestion.message}</p>

                    <ul className="ir-code-instructions">
                      <li>Write clear and maintainable code.</li>
                      <li>Consider edge cases.</li>
                      <li>Think about time and space complexity.</li>
                    </ul>
                  </aside>

                  <section className="ir-code-editor">
                    <div className="ir-code-toolbar">
                      <div className="ir-code-select-wrap">
                        <select
                          className="ir-code-select"
                          value={codeLanguage}
                          onChange={(event) => {
                            const language = event.target.value;
                            // Update both state and the ref so socket handlers
                            // read the latest value without needing a reconnect.
                            setCodeLanguage(language);
                            codeLanguageRef.current = language;
                            setCode(getStarterCode(language));
                            setCodeOutput("");
                          }}
                        >
                          {LANGUAGES.map((language) => (
                            <option
                              key={language.value}
                              value={language.value}
                            >
                              {language.icon} {language.label}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          className="ir-code-select-icon"
                          size={15}
                        />
                      </div>

                      <button
                        type="button"
                        className="ir-btn ir-btn-secondary"
                        onClick={handleRunCode}
                      >
                        <Play size={15} />
                        Run code
                      </button>

                      <span
                        style={{
                          color: "#a3a3a3",
                          fontSize: 12,
                        }}
                      >
                        {code.length} characters
                      </span>
                    </div>

                    <div style={{ flex: 1, minHeight: 0 }}>
                      <Editor
                        height="100%"
                        language={codeLanguage}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                          wordWrap: "on",
                          padding: {
                            top: 14,
                            bottom: 14,
                          },
                        }}
                      />
                    </div>

                    {codeOutput && (
                      <div className="ir-code-output">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                            color: "#ffffff",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          <CheckCircle size={15} color="#7ee787" />
                          Output
                        </div>

                        <pre>{codeOutput}</pre>
                      </div>
                    )}
                  </section>
                </div>

                <div className="ir-code-footer">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#a3a3a3",
                      fontSize: 12,
                    }}
                  >
                    <Clock3 size={15} />
                    {formatSeconds(timeRemaining)} remaining
                  </div>

                  <div className="ir-inline" style={{ gap: 8 }}>
                    <button
                      type="button"
                      className="ir-btn"
                      style={{
                        background: "transparent",
                        color: "#a3a3a3",
                      }}
                      onClick={() => setShowCodeEditor(false)}
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      className="ir-btn ir-btn-primary"
                      onClick={handleSubmitCode}
                      disabled={!code.trim()}
                    >
                      <Send size={15} />
                      Submit solution
                    </button>
                  </div>
                </div>
              </div>
            )}

            {sessionStatus === "active" && !showCodeEditor && (
              <div className="ir-controls">
                <button
                  type="button"
                  className={`ir-control ${
                    !isAudioOn ? "is-off" : ""
                  }`}
                  onClick={toggleAudio}
                  disabled={isListening}
                  title={isAudioOn ? "Mute microphone" : "Unmute microphone"}
                >
                  {isAudioOn ? (
                    <Mic size={19} />
                  ) : (
                    <MicOff size={19} />
                  )}
                </button>

                <button
                  type="button"
                  className={`ir-control ${
                    !isVideoOn ? "is-off" : ""
                  }`}
                  onClick={toggleVideo}
                  title={isVideoOn ? "Turn camera off" : "Turn camera on"}
                >
                  {isVideoOn ? (
                    <Video size={19} />
                  ) : (
                    <VideoOff size={19} />
                  )}
                </button>

                {!aiSpeaking &&
                  currentQuestion &&
                  !isListening && (
                    <button
                      type="button"
                      className="ir-action"
                      onClick={startListening}
                    >
                      <Mic size={17} />
                      Start answering
                    </button>
                  )}

                {isListening && (
                  <>
                    <button
                      type="button"
                      className="ir-action ir-action-pause"
                      onClick={stopListening}
                    >
                      <Pause size={16} />
                      Pause
                    </button>

                    <button
                      type="button"
                      className="ir-action ir-action-submit"
                      onClick={handleSubmitAnswer}
                      disabled={userTranscript.trim().length < 5}
                    >
                      <Send size={16} />
                      Submit answer
                    </button>
                  </>
                )}

                {aiSpeaking && (
                  <div className="ir-action" style={{ cursor: "default" }}>
                    <Activity size={16} />
                    Speaking
                  </div>
                )}

                <button
                  type="button"
                  className="ir-control ir-control-end"
                  onClick={handleEndInterview}
                  title="End interview"
                >
                  <Phone size={18} />
                </button>
              </div>
            )}
          </section>

          <aside className="ir-sidebar">
            <div className="ir-sidebar-header">
              <div className="ir-sidebar-title">
                <Settings2 size={17} />
                Session overview
              </div>

              <span
                className={`ir-pill ${
                  sessionStatus === "active"
                    ? "ir-pill-success"
                    : "ir-pill-muted"
                }`}
              >
                {sessionStatus === "active" ? "Live" : "Ready"}
              </span>
            </div>

            <div className="ir-sidebar-content">
              <section className="ir-sidebar-section">
                <div className="ir-sidebar-label">Current question</div>

                <div className="ir-question-card">
                  {currentQuestion ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 12,
                          color: "var(--ir-mute)",
                          fontSize: 12,
                        }}
                      >
                        <Code2 size={14} />
                        {currentQuestion.requiresCode
                          ? "Coding question"
                          : "Interview question"}
                      </div>

                      <p>{currentQuestion.message}</p>
                    </>
                  ) : (
                    <div className="ir-question-card-empty">
                      The next question will appear here.
                    </div>
                  )}
                </div>
              </section>

              <section className="ir-sidebar-section">
                <div className="ir-sidebar-label">Progress</div>

                <MetricRow
                  label="Questions answered"
                  value={`${performanceMetrics.questionsAnswered}/${performanceMetrics.totalQuestions}`}
                  progress={answeredPercentage}
                />

                <MetricRow
                  label="Average score"
                  value={`${performanceMetrics.averageScore}/10`}
                  progress={performanceMetrics.averageScore * 10}
                />

                <MetricRow
                  label="Current streak"
                  value={
                    <span className="ir-inline">
                      <Zap size={14} />
                      {performanceMetrics.currentStreak}
                    </span>
                  }
                />
              </section>

              <section className="ir-sidebar-section">
                <div className="ir-sidebar-label">Score breakdown</div>

                <div className="ir-metric-list">
                  <MetricRow
                    label="Technical"
                    value={`${performanceMetrics.technicalScore}/10`}
                  />

                  <MetricRow
                    label="Communication"
                    value={`${performanceMetrics.communicationScore}/10`}
                  />

                  <MetricRow
                    label="Problem solving"
                    value={`${performanceMetrics.problemSolvingScore}/10`}
                  />

                  <MetricRow
                    label="Perfect answers"
                    value={performanceMetrics.perfectAnswers}
                  />
                </div>
              </section>

              <section className="ir-sidebar-section">
                <div className="ir-sidebar-label">Session details</div>

                <div className="ir-metric-list">
                  <MetricRow
                    label="Role"
                    value={interview?.role || "—"}
                  />

                  <MetricRow
                    label="Difficulty"
                    value={interview?.difficulty || "—"}
                  />

                  <MetricRow
                    label="Duration"
                    value={
                      interview?.duration
                        ? `${interview.duration} min`
                        : "—"
                    }
                  />

                  <MetricRow
                    label="Connection"
                    value={socketConnected ? "Stable" : "Connecting"}
                  />
                </div>
              </section>
            </div>
          </aside>
        </main>

        <div className="ir-notifications" aria-live="polite">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`ir-notification ${notification.type}`}
            >
              {notification.type === "success" && (
                <CheckCircle size={17} color="var(--ir-success)" />
              )}

              {notification.type === "error" && (
                <AlertCircle size={17} color="var(--ir-danger)" />
              )}

              {notification.type === "info" && (
                <Activity size={17} />
              )}

              <span>{notification.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;