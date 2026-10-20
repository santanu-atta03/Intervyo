import { useContext, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Camera,
  Check,
  CheckCircle,
  Lightbulb,
  Mic,
  Mic2,
  RefreshCw,
  ShieldCheck,
  Volume2,
} from "lucide-react";

import { ThemeContext } from "../shared/ThemeContext";
import ThemeToggle from "../ThemeToggle";

const PERMISSION_CSS = `
.permission-root {
  --pc-ink: #111111;
  --pc-on-ink: #ffffff;
  --pc-canvas: #ffffff;
  --pc-cloud: #f5f5f5;
  --pc-hairline: #cacacb;
  --pc-hairline-soft: #e5e5e5;
  --pc-charcoal: #39393b;
  --pc-mute: #707072;
  --pc-success: #007d48;
  --pc-danger: #d30005;
  --pc-warning: #a16207;
  --pc-ease: cubic-bezier(.22, 1, .36, 1);

  min-height: 100vh;
  background:
    radial-gradient(
      circle at 8% 0%,
      rgba(17, 17, 17, .07),
      transparent 28rem
    ),
    radial-gradient(
      circle at 94% 12%,
      rgba(17, 17, 17, .05),
      transparent 25rem
    ),
    var(--pc-canvas);
  color: var(--pc-ink);
  font-family:
    "Helvetica Now Text",
    "Helvetica Neue",
    Inter,
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
}

.permission-root[data-permission-theme="dark"] {
  --pc-ink: #ffffff;
  --pc-on-ink: #111111;
  --pc-canvas: #111111;
  --pc-cloud: #1f1f21;
  --pc-hairline: #39393b;
  --pc-hairline-soft: #2a2a2c;
  --pc-charcoal: #cacacb;
  --pc-mute: #9e9ea0;
  --pc-success: #1eaa52;
  --pc-danger: #ff5b61;
  --pc-warning: #e5ad36;
}

.permission-root *,
.permission-root *::before,
.permission-root *::after {
  box-sizing: border-box;
}

.permission-root button {
  font: inherit;
  cursor: pointer;
}

.permission-root button:disabled {
  cursor: not-allowed;
}

.permission-root :is(button, a):focus-visible {
  outline: 2px solid var(--pc-ink);
  outline-offset: 3px;
}

.permission-header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 72px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--pc-hairline-soft);
  background: color-mix(in srgb, var(--pc-canvas) 90%, transparent);
  backdrop-filter: blur(18px);
}

.permission-header-inner {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.permission-brand {
  display: flex;
  align-items: center;
  gap: 11px;
}

.permission-brand-mark {
  width: 37px;
  height: 37px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--pc-ink);
  color: var(--pc-on-ink);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .04em;
}

.permission-brand-name {
  font-size: 15px;
  font-weight: 500;
}

.permission-brand-subtitle {
  margin-top: 2px;
  color: var(--pc-mute);
  font-size: 12px;
}

.permission-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.permission-icon-button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--pc-ink);
  transition:
    background-color .25s ease,
    transform .2s var(--pc-ease);
}

.permission-icon-button:hover {
  background: var(--pc-cloud);
  transform: translateY(-2px);
}

.permission-main {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 32px 80px;
}

.permission-intro {
  max-width: 700px;
  margin: 0 auto 38px;
  text-align: center;
  animation: permission-rise .6s var(--pc-ease) both;
}

.permission-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  padding: 0 13px;
  border: 1px solid var(--pc-hairline);
  border-radius: 999px;
  color: var(--pc-mute);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.permission-intro h1 {
  margin: 18px 0 0;
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 500;
  line-height: .98;
  letter-spacing: -.055em;
  text-transform: uppercase;
}

.permission-intro p {
  max-width: 560px;
  margin: 16px auto 0;
  color: var(--pc-mute);
  font-size: 17px;
  line-height: 1.55;
}

.permission-card {
  position: relative;
  overflow: hidden;
  padding: 32px;
  background: var(--pc-canvas);
  border: 1px solid var(--pc-hairline-soft);
  box-shadow: 0 24px 80px rgba(17, 17, 17, .08);
  animation: permission-rise .7s .08s var(--pc-ease) both;
}

.permission-card::before {
  content: "";
  position: absolute;
  top: -160px;
  right: -160px;
  width: 330px;
  height: 330px;
  border-radius: 50%;
  background: rgba(17, 17, 17, .06);
  filter: blur(50px);
  pointer-events: none;
}

.permission-card-content {
  position: relative;
  z-index: 1;
}

.permission-card-heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--pc-hairline-soft);
}

.permission-card-heading-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex: 0 0 46px;
  border-radius: 50%;
  background: var(--pc-ink);
  color: var(--pc-on-ink);
}

.permission-card-heading h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.permission-card-heading p {
  margin: 6px 0 0;
  color: var(--pc-mute);
  font-size: 13px;
  line-height: 1.5;
}

.permission-list {
  display: grid;
  gap: 8px;
  margin-top: 24px;
}

.permission-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 78px;
  padding: 14px 16px;
  border: 1px solid var(--pc-hairline-soft);
  background: var(--pc-cloud);
  transition:
    transform .3s var(--pc-ease),
    background-color .25s ease,
    border-color .25s ease;
}

.permission-item:hover {
  transform: translateY(-2px);
  background: var(--pc-canvas);
  border-color: var(--pc-hairline);
}

.permission-item-left {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.permission-item-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  flex: 0 0 40px;
  border-radius: 50%;
  background: var(--pc-canvas);
  color: var(--pc-ink);
}

.permission-item-copy {
  min-width: 0;
}

.permission-item-label {
  display: block;
  color: var(--pc-ink);
  font-size: 14px;
  font-weight: 500;
}

.permission-item-description {
  display: block;
  margin-top: 3px;
  color: var(--pc-mute);
  font-size: 12px;
}

.permission-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 29px;
  padding: 0 10px;
  border: 1px solid var(--pc-hairline);
  border-radius: 999px;
  color: var(--pc-mute);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.permission-status.is-granted {
  border-color: color-mix(
    in srgb,
    var(--pc-success) 55%,
    transparent
  );
  color: var(--pc-success);
}

.permission-status.is-denied {
  border-color: color-mix(
    in srgb,
    var(--pc-danger) 55%,
    transparent
  );
  color: var(--pc-danger);
}

.permission-action {
  width: 100%;
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 26px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: var(--pc-ink);
  color: var(--pc-on-ink);
  font-size: 15px;
  font-weight: 500;
  transition:
    transform .2s var(--pc-ease),
    background-color .25s ease,
    opacity .25s ease;
}

.permission-action:hover:not(:disabled) {
  background: var(--pc-charcoal);
  transform: translateY(-2px);
}

.permission-action:active:not(:disabled) {
  transform: scale(.98);
}

.permission-action:disabled {
  opacity: .4;
}

.permission-error {
  margin-top: 24px;
  padding: 18px;
  border-left: 3px solid var(--pc-danger);
  background: color-mix(in srgb, var(--pc-danger) 8%, var(--pc-cloud));
}

.permission-error-header {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--pc-danger);
  font-size: 15px;
  font-weight: 500;
}

.permission-error p {
  margin: 10px 0 0;
  color: var(--pc-mute);
  font-size: 13px;
  line-height: 1.55;
}

.permission-retry {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 0 16px;
  border: 1px solid var(--pc-danger);
  border-radius: 999px;
  background: transparent;
  color: var(--pc-danger);
  font-size: 13px;
  font-weight: 500;
  transition:
    background-color .25s ease,
    color .25s ease,
    transform .2s var(--pc-ease);
}

.permission-retry:hover {
  transform: translateY(-2px);
  background: var(--pc-danger);
  color: #ffffff;
}

.permission-tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 24px;
  padding: 16px;
  border-left: 3px solid var(--pc-ink);
  background: var(--pc-cloud);
  color: var(--pc-mute);
  font-size: 13px;
  line-height: 1.55;
}

.permission-tip-icon {
  flex: 0 0 auto;
  color: var(--pc-ink);
}

.permission-tip strong {
  display: block;
  margin-bottom: 3px;
  color: var(--pc-ink);
  font-weight: 500;
}

.permission-loading {
  min-height: 270px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 16px;
  color: var(--pc-mute);
  text-align: center;
}

.permission-loader {
  position: relative;
  width: 62px;
  height: 62px;
  border: 1px solid var(--pc-hairline);
  border-radius: 50%;
}

.permission-loader::before {
  content: "";
  position: absolute;
  inset: -1px;
  border: 3px solid transparent;
  border-top-color: var(--pc-ink);
  border-right-color: var(--pc-ink);
  border-radius: 50%;
  animation: permission-spin 1s linear infinite;
}

.permission-loader::after {
  content: "";
  position: absolute;
  inset: 19px;
  border-radius: 50%;
  background: var(--pc-ink);
  animation: permission-pulse 1.6s ease-in-out infinite;
}

.permission-loading strong {
  color: var(--pc-ink);
  font-size: 15px;
  font-weight: 500;
}

.permission-loading span {
  display: block;
  margin-top: 4px;
  color: var(--pc-mute);
  font-size: 13px;
}

.permission-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 25px;
  color: var(--pc-mute);
  font-size: 11px;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.permission-footer-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--pc-ink);
  animation: permission-blink 1.4s ease-in-out infinite;
}

.permission-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 24px;
}

.permission-feature {
  min-height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px;
  background: var(--pc-cloud);
}

.permission-feature svg {
  color: var(--pc-ink);
}

.permission-feature span {
  color: var(--pc-mute);
  font-size: 11px;
  line-height: 1.4;
}

@keyframes permission-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes permission-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes permission-pulse {
  0%,
  100% {
    transform: scale(.86);
    opacity: .7;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes permission-blink {
  0%,
  100% {
    opacity: .3;
  }

  50% {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .permission-header-inner {
    padding: 0 16px;
  }

  .permission-main {
    padding: 36px 16px 52px;
  }

  .permission-card {
    padding: 22px 16px;
  }

  .permission-card-heading h2 {
    font-size: 18px;
  }

  .permission-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .permission-status {
    margin-left: 53px;
  }

  .permission-features {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .permission-root *,
  .permission-root *::before,
  .permission-root *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

export default function InterviewPermissionCheck({
  onPermissionsGranted,
}) {
  const { theme } = useContext(ThemeContext);

  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    speechRecognition: false,
  });

  const [loading, setLoading] = useState(true);
  const [startingInterview, setStartingInterview] = useState(false);
  const [error, setError] = useState("");

  const streamRef = useRef(null);
  const permissionRequestRef = useRef(0);

  const permissionTheme = theme === "dark" ? "dark" : "light";

  useEffect(() => {
    void checkPermissions();

    return () => {
      permissionRequestRef.current += 1;

      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    };
  }, []);

  const checkPermissions = async () => {
    const requestId = permissionRequestRef.current + 1;

    permissionRequestRef.current = requestId;
    setLoading(true);
    setError("");

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    const speechSupport =
      "webkitSpeechRecognition" in window ||
      "SpeechRecognition" in window;

    if (!speechSupport) {
      setPermissions((previous) => ({
        ...previous,
        speechRecognition: false,
      }));
      setError(
        "Speech recognition is not supported. Please use a supported browser such as Chrome.",
      );
      setLoading(false);
      return;
    }

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setError(
        "Camera and microphone access are not supported on this device.",
      );
      setLoading(false);
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      if (requestId !== permissionRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      setPermissions({
        camera: true,
        microphone: true,
        speechRecognition: true,
      });
    } catch (mediaError) {
      if (requestId !== permissionRequestRef.current) {
        return;
      }

      console.error("Media permission error:", mediaError);

      setPermissions({
        camera: false,
        microphone: false,
        speechRecognition: speechSupport,
      });

      setError(
        mediaError.name === "NotAllowedError"
          ? "Camera and microphone access was denied. Allow access in your browser settings and try again."
          : "Unable to access your camera and microphone. Check your device and browser settings.",
      );
    } finally {
      if (requestId === permissionRequestRef.current) {
        setLoading(false);
      }
    }
  };

  const handleStartInterview = async () => {
    if (
      !permissions.camera ||
      !permissions.microphone ||
      !permissions.speechRecognition
    ) {
      return;
    }

    try {
      setStartingInterview(true);
      setError("");

      const stream = streamRef.current;

      const hasLiveTrack =
        stream &&
        stream
          .getTracks()
          .some((track) => track.readyState === "live");

      if (!hasLiveTrack) {
        throw new Error(
          "Camera and microphone access expired. Please check permissions again.",
        );
      }

      streamRef.current = null;
      onPermissionsGranted(stream);
    } catch (startError) {
      console.error("Interview start failed:", startError);

      setError(
        startError.message ||
          "Failed to continue to the interview room.",
      );
    } finally {
      setStartingInterview(false);
    }
  };

  const permissionsGranted =
    permissions.camera &&
    permissions.microphone &&
    permissions.speechRecognition;

  return (
    <div
      className="permission-root"
      data-permission-theme={permissionTheme}
    >
      <style>{PERMISSION_CSS}</style>

      <header className="permission-header">
        <div className="permission-header-inner">
          <div className="permission-brand">
            <div className="permission-brand-mark">IR</div>

            <div>
              <div className="permission-brand-name">
                Interview room
              </div>
              <div className="permission-brand-subtitle">
                Prepare your environment
              </div>
            </div>
          </div>

          <div className="permission-header-actions">
            <ThemeToggle />

            <button
              type="button"
              className="permission-icon-button"
              onClick={() => window.history.back()}
              aria-label="Go back"
            >
              <ArrowRight
                size={18}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
          </div>
        </div>
      </header>

      <main className="permission-main">
        <section className="permission-intro">
          <span className="permission-kicker">
            <ShieldCheck size={13} />
            Before you begin
          </span>

          <h1>Set up your interview</h1>

          <p>
            Confirm your camera, microphone, and speech recognition so
            your live interview can run smoothly.
          </p>
        </section>

        <section className="permission-card">
          <div className="permission-card-content">
            <div className="permission-card-heading">
              <span className="permission-card-heading-icon">
                <Camera size={21} />
              </span>

              <div>
                <h2>Environment check</h2>
                <p>
                  We only request access needed for the interview
                  experience.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="permission-loading">
                <div
                  className="permission-loader"
                  aria-hidden="true"
                />

                <div>
                  <strong>Checking your permissions</strong>
                  <span>
                    This should only take a moment.
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="permission-error" role="alert">
                <div className="permission-error-header">
                  <AlertCircle size={20} />
                  Permission check needs attention
                </div>

                <p>{error}</p>

                <button
                  type="button"
                  className="permission-retry"
                  onClick={checkPermissions}
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="permission-list">
                  <PermissionItem
                    icon={<Camera size={19} />}
                    label="Camera access"
                    description="Used for video interview and body-language feedback."
                    granted={permissions.camera}
                  />

                  <PermissionItem
                    icon={<Mic size={19} />}
                    label="Microphone access"
                    description="Used to capture your spoken interview answers."
                    granted={permissions.microphone}
                  />

                  <PermissionItem
                    icon={<Mic2 size={19} />}
                    label="Speech recognition"
                    description="Converts your spoken answers into interview responses."
                    granted={permissions.speechRecognition}
                  />
                </div>

                <button
                  type="button"
                  className="permission-action"
                  onClick={handleStartInterview}
                  disabled={!permissionsGranted || startingInterview}
                >
                  {startingInterview ? (
                    <>
                      <span
                        className="permission-loader"
                        style={{
                          width: 20,
                          height: 20,
                          borderWidth: 1,
                        }}
                      />
                      Opening interview room
                    </>
                  ) : (
                    <>
                      Continue to interview room
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div className="permission-tip">
                  <Lightbulb
                    className="permission-tip-icon"
                    size={18}
                  />

                  <div>
                    <strong>For the best experience</strong>
                    Find a quiet place with good lighting, keep your
                    face visible, and use headphones if available.
                  </div>
                </div>
              </>
            )}

            <div className="permission-features">
              <div className="permission-feature">
                <ShieldCheck size={18} />
                <span>Permission stays local to this interview session.</span>
              </div>

              <div className="permission-feature">
                <Volume2 size={18} />
                <span>Audio helps the interviewer understand your answers.</span>
              </div>

              <div className="permission-feature">
                <CheckCircle size={18} />
                <span>You control access before entering the room.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="permission-footer">
          <span className="permission-footer-dot" />
          <span>Practice</span>
          <span>·</span>
          <span>Perform</span>
          <span>·</span>
          <span>Progress</span>
        </div>
      </main>
    </div>
  );
}

function PermissionItem({
  icon,
  label,
  description,
  granted,
}) {
  return (
    <div
      className="permission-item"
      aria-label={`${label}: ${granted ? "Granted" : "Denied"}`}
    >
      <div className="permission-item-left">
        <span className="permission-item-icon">{icon}</span>

        <span className="permission-item-copy">
          <span className="permission-item-label">{label}</span>
          <span className="permission-item-description">
            {description}
          </span>
        </span>
      </div>

      <span
        className={`permission-status ${
          granted ? "is-granted" : "is-denied"
        }`}
      >
        {granted ? <Check size={14} /> : <AlertCircle size={14} />}
        {granted ? "Granted" : "Required"}
      </span>
    </div>
  );
}