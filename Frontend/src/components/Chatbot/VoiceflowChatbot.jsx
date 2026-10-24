import { useContext, useState } from "react";
import { ThemeContext } from "../shared/ThemeContext";

const VOICEFLOW_PROJECT_ID = "695f3fcb847e07b5c98aefe7";
const VOICEFLOW_SCRIPT_SRC = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
const VOICEFLOW_RUNTIME_URL = "https://general-runtime.voiceflow.com";
const VOICEFLOW_VOICE_URL = "https://runtime-api.voiceflow.com";

const CHATBOT_THEME_STYLES = {
  light: `
    .vfrc-widget, .vfrc-chat {
      font-family: inherit;
    }
    .vfrc-chat {
      background-color: #ffffff !important;
      color: #111827 !important;
    }
    .vfrc-header {
      background-color: #ffffff !important;
      color: #111827 !important;
      border-bottom: 1px solid #e5e7eb !important;
    }
    .vfrc-system-response .vfrc-message,
    .vfrc-card {
      background-color: #f9fafb !important;
      color: #111827 !important;
      border: 1px solid #e5e7eb !important;
    }
    .vfrc-user-response .vfrc-message {
      background-color: #10b981 !important;
      color: #ffffff !important;
    }
    .vf-footer,
    .vfrc-chat-input,
    .vfrc-input {
      background-color: #ffffff !important;
      color: #111827 !important;
      border-color: #e5e7eb !important;
    }
  `,
  dark: `
    .vfrc-widget, .vfrc-chat {
      font-family: inherit;
    }
    .vfrc-chat {
      background-color: #0f172a !important;
      color: #f8fafc !important;
    }
    .vfrc-header {
      background-color: #111827 !important;
      color: #f8fafc !important;
      border-bottom: 1px solid #334155 !important;
    }
    .vfrc-system-response .vfrc-message,
    .vfrc-card {
      background-color: #1e293b !important;
      color: #f8fafc !important;
      border: 1px solid #334155 !important;
    }
    .vfrc-user-response .vfrc-message {
      background-color: #10b981 !important;
      color: #ffffff !important;
    }
    .vf-footer,
    .vfrc-chat-input,
    .vfrc-input {
      background-color: #111827 !important;
      color: #f8fafc !important;
      border-color: #334155 !important;
    }
    .vfrc-input::placeholder {
      color: #94a3b8 !important;
    }
  `,
};

const getStylesheetDataUrl = (theme) =>
  `data:text/css;charset=utf-8,${encodeURIComponent(
    CHATBOT_THEME_STYLES[theme] || CHATBOT_THEME_STYLES.light
  )}`;

let voiceflowScriptPromise;

const loadVoiceflowScript = () => {
  if (window.voiceflow?.chat) {
    return Promise.resolve();
  }

  if (!voiceflowScriptPromise) {
    voiceflowScriptPromise = new Promise((resolve, reject) => {
      let script = document.querySelector(
        `script[src="${VOICEFLOW_SCRIPT_SRC}"]`
      );

      const handleLoad = () => {
        script.dataset.loaded = "true";
        if (window.voiceflow?.chat) {
          resolve();
        } else {
          reject(new Error("Voiceflow loaded without its chat API."));
        }
      };

      const handleError = () => {
        script.remove();
        reject(new Error("Unable to download the Voiceflow chat widget."));
      };

      if (script?.dataset.loaded === "true") {
        handleLoad();
        return;
      }

      if (!script) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = VOICEFLOW_SCRIPT_SRC;
        script.dataset.voiceflowWidget = "true";
      }

      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", handleError, { once: true });

      if (!script.isConnected) {
        document.body.appendChild(script);
      }
    }).catch((error) => {
      voiceflowScriptPromise = undefined;
      throw error;
    });
  }

  return voiceflowScriptPromise;
};

const VoiceflowChatbot = () => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [initialized, setInitialized] = useState(
    () => Boolean(window.voiceflow?.chat && window.__intervyoVoiceflowInitialized)
  );

  const openChat = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setLoadError(false);

    try {
      await loadVoiceflowScript();

      if (!window.__intervyoVoiceflowInitialized) {
        await window.voiceflow.chat.load({
          verify: { projectID: VOICEFLOW_PROJECT_ID },
          url: VOICEFLOW_RUNTIME_URL,
          versionID: "production",
          assistant: {
            color: "#10b981",
            stylesheet: getStylesheetDataUrl(theme),
          },
          voice: {
            url: VOICEFLOW_VOICE_URL,
          },
        });
        window.__intervyoVoiceflowInitialized = true;
      }

      window.voiceflow.chat.open();
      setInitialized(true);
    } catch (error) {
      console.error("Failed to initialize Voiceflow chatbot:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  if (initialized) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openChat}
      disabled={loading}
      aria-label={loading ? "Loading chat" : "Open Intervyo chat"}
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-wait disabled:opacity-80"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
        />
      </svg>
      <span>
        {loading
          ? "Loading chat..."
          : loadError
            ? "Retry chat"
            : "Chat with us"}
      </span>
    </button>
  );
};

export default VoiceflowChatbot;
