import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Check,
  Clock3,
  MessageSquare,
  Target,
} from "lucide-react";

const LOADER_STYLES = `
.intervyo-loader {
  --loader-ink: var(--nk-ink, #111111);
  --loader-on-ink: var(--nk-on-ink, #ffffff);
  --loader-canvas: var(--nk-canvas, #ffffff);
  --loader-cloud: var(--nk-cloud, #f5f5f5);
  --loader-line: var(--nk-hairline-soft, #e5e5e5);
  --loader-muted: var(--nk-mute, #707072);
  --loader-ease: cubic-bezier(.22, 1, .36, 1);

  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 50% -15%,
      rgba(17, 17, 17, .08),
      transparent 32rem
    ),
    var(--loader-canvas);
  color: var(--loader-ink);
  font-family:
    "Helvetica Now Text",
    "Helvetica Neue",
    Inter,
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
}

.intervyo-loader *,
.intervyo-loader *::before,
.intervyo-loader *::after {
  box-sizing: border-box;
}

.intervyo-loader-shell {
  width: min(100%, 560px);
  text-align: center;
  animation: intervyo-loader-enter .7s var(--loader-ease) both;
}

.intervyo-loader-visual {
  position: relative;
  width: 190px;
  height: 190px;
  margin: 0 auto 34px;
}

.intervyo-loader-orbit {
  position: absolute;
  inset: 0;
  border: 1px solid var(--loader-line);
  border-radius: 50%;
}

.intervyo-loader-orbit::before {
  content: "";
  position: absolute;
  top: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--loader-ink);
  box-shadow: 0 0 0 7px color-mix(
    in srgb,
    var(--loader-ink) 10%,
    transparent
  );
  transform: translateX(-50%);
  animation: intervyo-orbit 3.2s linear infinite;
}

.intervyo-loader-orbit-two {
  position: absolute;
  inset: 20px;
  border: 1px dashed var(--loader-line);
  border-radius: 50%;
  animation: intervyo-orbit-reverse 8s linear infinite;
}

.intervyo-loader-orbit-two::after {
  content: "";
  position: absolute;
  right: 9px;
  bottom: 18px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--loader-muted);
}

.intervyo-loader-center {
  position: absolute;
  inset: 48px;
  display: grid;
  place-items: center;
  border: 1px solid var(--loader-line);
  border-radius: 50%;
  background: var(--loader-cloud);
  box-shadow:
    0 18px 40px rgba(17, 17, 17, .10),
    inset 0 0 0 8px var(--loader-canvas);
  animation: intervyo-breathe 2.6s ease-in-out infinite;
}

.intervyo-loader-center-mark {
  position: relative;
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--loader-ink);
  color: var(--loader-on-ink);
}

.intervyo-loader-center-mark::before,
.intervyo-loader-center-mark::after {
  content: "";
  position: absolute;
  border: 1px solid var(--loader-ink);
  border-radius: 50%;
  opacity: .2;
}

.intervyo-loader-center-mark::before {
  inset: -10px;
  animation: intervyo-ping 2.4s ease-out infinite;
}

.intervyo-loader-center-mark::after {
  inset: -20px;
  animation: intervyo-ping 2.4s .8s ease-out infinite;
}

.intervyo-loader-center-mark svg {
  position: relative;
  z-index: 1;
}

.intervyo-loader-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid var(--loader-line);
  border-radius: 999px;
  color: var(--loader-muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.intervyo-loader-title {
  margin: 17px 0 0;
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -.045em;
  text-transform: uppercase;
}

.intervyo-loader-description {
  max-width: 390px;
  margin: 13px auto 0;
  color: var(--loader-muted);
  font-size: 14px;
  line-height: 1.55;
}

.intervyo-loader-progress {
  position: relative;
  height: 6px;
  margin: 30px auto 0;
  overflow: hidden;
  background: var(--loader-cloud);
}

.intervyo-loader-progress-fill {
  position: relative;
  height: 100%;
  background: var(--loader-ink);
  transition: width .7s var(--loader-ease);
}

.intervyo-loader-progress-fill::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 80px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, .65),
    transparent
  );
  animation: intervyo-shimmer 1.3s ease-in-out infinite;
}

.intervyo-loader-progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 9px;
  color: var(--loader-muted);
  font-size: 11px;
}

.intervyo-loader-progress-meta strong {
  color: var(--loader-ink);
  font-weight: 500;
}

.intervyo-loader-steps {
  display: grid;
  gap: 6px;
  margin-top: 28px;
  text-align: left;
}

.intervyo-loader-step {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 0 13px;
  background: var(--loader-cloud);
  color: var(--loader-muted);
  font-size: 13px;
  transition:
    background-color .35s ease,
    color .35s ease,
    transform .35s var(--loader-ease);
}

.intervyo-loader-step.is-active {
  background: var(--loader-ink);
  color: var(--loader-on-ink);
  transform: translateX(5px);
}

.intervyo-loader-step.is-complete {
  color: var(--loader-ink);
}

.intervyo-loader-step-icon {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  flex: 0 0 25px;
  border-radius: 50%;
  background: var(--loader-canvas);
  color: var(--loader-ink);
}

.intervyo-loader-step.is-active .intervyo-loader-step-icon {
  background: var(--loader-on-ink);
}

.intervyo-loader-step-icon svg {
  width: 14px;
  height: 14px;
}

.intervyo-loader-step-copy {
  flex: 1;
}

.intervyo-loader-step-copy strong {
  display: block;
  font-weight: 500;
}

.intervyo-loader-step-copy small {
  display: block;
  margin-top: 2px;
  opacity: .65;
  font-size: 11px;
}

.intervyo-loader-step-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: .3;
}

.intervyo-loader-step.is-active .intervyo-loader-step-indicator {
  opacity: 1;
  animation: intervyo-blink 1s ease-in-out infinite;
}

.intervyo-loader-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 23px;
  color: var(--loader-muted);
  font-size: 11px;
  letter-spacing: .05em;
  text-transform: uppercase;
}

@keyframes intervyo-loader-enter {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes intervyo-orbit {
  from {
    transform: translateX(-50%) rotate(0deg) translateX(95px)
      rotate(0deg);
  }

  to {
    transform: translateX(-50%) rotate(360deg) translateX(95px)
      rotate(-360deg);
  }
}

@keyframes intervyo-orbit-reverse {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}

@keyframes intervyo-breathe {
  0%,
  100% {
    transform: scale(.96);
  }

  50% {
    transform: scale(1);
  }
}

@keyframes intervyo-ping {
  0% {
    opacity: .28;
    transform: scale(.7);
  }

  100% {
    opacity: 0;
    transform: scale(1.45);
  }
}

@keyframes intervyo-shimmer {
  from {
    transform: translateX(-100px);
  }

  to {
    transform: translateX(500px);
  }
}

@keyframes intervyo-blink {
  0%,
  100% {
    opacity: .3;
  }

  50% {
    opacity: 1;
  }
}

@media (max-width: 520px) {
  .intervyo-loader {
    padding: 18px;
  }

  .intervyo-loader-visual {
    width: 160px;
    height: 160px;
    margin-bottom: 28px;
  }

  .intervyo-loader-center {
    inset: 40px;
  }

  .intervyo-loader-center-mark {
    width: 54px;
    height: 54px;
  }

  @keyframes intervyo-orbit {
    from {
      transform: translateX(-50%) rotate(0deg) translateX(80px)
        rotate(0deg);
    }

    to {
      transform: translateX(-50%) rotate(360deg) translateX(80px)
        rotate(-360deg);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .intervyo-loader *,
  .intervyo-loader *::before,
  .intervyo-loader *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

const DEFAULT_STAGES = [
  {
    label: "Loading interview activity",
    description: "Collecting your recent sessions",
    icon: Activity,
  },
  {
    label: "Preparing performance data",
    description: "Calculating your progress",
    icon: BarChart3,
  },
  {
    label: "Reviewing your goals",
    description: "Organizing your next steps",
    icon: Target,
  },
  {
    label: "Finalizing your workspace",
    description: "Almost ready to continue",
    icon: MessageSquare,
  },
];

export function IntervyoLoader({
  title = "Preparing your dashboard",
  description = "Your interview progress is being organized into one clear view.",
  stages = DEFAULT_STAGES,
  duration = 3600,
}) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!stages.length) return undefined;

    const interval = window.setInterval(() => {
      setActiveStage((current) =>
        current < stages.length - 1 ? current + 1 : current,
      );
    }, duration / stages.length);

    return () => window.clearInterval(interval);
  }, [duration, stages.length]);

  const progress = useMemo(() => {
    if (stages.length <= 1) return 100;

    return Math.round(
      ((activeStage + 1) / stages.length) * 100,
    );
  }, [activeStage, stages.length]);

  return (
    <div className="intervyo-loader" role="status" aria-live="polite">
      <style>{LOADER_STYLES}</style>

      <div className="intervyo-loader-shell">
        <div className="intervyo-loader-visual" aria-hidden="true">
          <div className="intervyo-loader-orbit" />
          <div className="intervyo-loader-orbit-two" />

          <div className="intervyo-loader-center">
            <div className="intervyo-loader-center-mark">
              <BarChart3 size={25} />
            </div>
          </div>
        </div>

        <div className="intervyo-loader-eyebrow">
          <Clock3 size={13} />
          Intervyo workspace
        </div>

        <h1 className="intervyo-loader-title">{title}</h1>

        <p className="intervyo-loader-description">
          {description}
        </p>

        <div
          className="intervyo-loader-progress"
          aria-label={`Loading progress ${progress}%`}
        >
          <div
            className="intervyo-loader-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="intervyo-loader-progress-meta">
          <span>{stages[activeStage]?.label}</span>
          <strong>{progress}%</strong>
        </div>

        <div className="intervyo-loader-steps">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const complete = index < activeStage;
            const active = index === activeStage;

            return (
              <div
                key={stage.label}
                className={`intervyo-loader-step ${
                  active ? "is-active" : ""
                } ${complete ? "is-complete" : ""}`}
              >
                <span className="intervyo-loader-step-icon">
                  {complete ? <Check /> : <Icon />}
                </span>

                <span className="intervyo-loader-step-copy">
                  <strong>{stage.label}</strong>
                  <small>{stage.description}</small>
                </span>

                <span className="intervyo-loader-step-indicator" />
              </div>
            );
          })}
        </div>

        <div className="intervyo-loader-footer">
          <span>Practice</span>
          <span>·</span>
          <span>Perform</span>
          <span>·</span>
          <span>Progress</span>
        </div>
      </div>
    </div>
  );
}

export function DashboardLoader() {
  return (
    <IntervyoLoader
      title="Preparing your dashboard"
      description="Your interview progress is being organized into one clear view."
    />
  );
}

export function InterviewRoomLoader() {
  return (
    <IntervyoLoader
      title="Preparing your interview room"
      description="Checking your interview session and preparing the live workspace."
      stages={[
        {
          label: "Loading interview session",
          description: "Restoring your interview configuration",
          icon: Activity,
        },
        {
          label: "Preparing live workspace",
          description: "Setting up your interview environment",
          icon: MessageSquare,
        },
        {
          label: "Checking session status",
          description: "Connecting your interview room",
          icon: Target,
        },
        {
          label: "Almost ready",
          description: "Your interview room is waiting",
          icon: BarChart3,
        },
      ]}
    />
  );
}

export function ResultsLoader() {
  return (
    <IntervyoLoader
      title="Analyzing your performance"
      description="Preparing your scores, feedback, and next steps."
      stages={[
        {
          label: "Reviewing your answers",
          description: "Processing your interview responses",
          icon: MessageSquare,
        },
        {
          label: "Calculating performance",
          description: "Comparing scores across key skills",
          icon: BarChart3,
        },
        {
          label: "Building your feedback",
          description: "Finding strengths and focus areas",
          icon: Target,
        },
        {
          label: "Preparing your report",
          description: "Your results are almost ready",
          icon: Activity,
        },
      ]}
    />
  );
}

// Backward-compatible export.
export function LightningLoader() {
  return <DashboardLoader />;
}

export default IntervyoLoader;