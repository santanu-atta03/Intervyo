import { useContext, useState } from "react";
import { Sparkles } from "lucide-react";
import { ThemeContext } from "../shared/ThemeContext";
import { LoadingMark } from "../Loader/Loader";
import BrandLogo from "../shared/BrandLogo";

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
      background-color: #fbfcfa !important;
      color: #17211f !important;
    }
    .vfrc-header {
      background-color: #ffffff !important;
      color: #17211f !important;
      border-bottom: 1px solid #e7e9e7 !important;
    }
    .vfrc-system-response .vfrc-message,
    .vfrc-card {
      background-color: #f2f4f1 !important;
      color: #17211f !important;
      border: 1px solid #e7e9e7 !important;
    }
    .vfrc-user-response .vfrc-message {
      background-color: #6554d9 !important;
      color: #ffffff !important;
    }
    .vf-footer,
    .vfrc-chat-input,
    .vfrc-input {
      background-color: #ffffff !important;
      color: #17211f !important;
      border-color: #e7e9e7 !important;
    }
    .vfrc-launcher, .vfrc-launcher__button {
      background-color: #6554d9 !important;
    }
  `,
  dark: `
    .vfrc-widget, .vfrc-chat {
      font-family: inherit;
    }
    .vfrc-chat {
      background-color: #111512 !important;
      color: #f1f4f1 !important;
    }
    .vfrc-header {
      background-color: #171d19 !important;
      color: #f1f4f1 !important;
      border-bottom: 1px solid #2b352e !important;
    }
    .vfrc-system-response .vfrc-message,
    .vfrc-card {
      background-color: #1d2520 !important;
      color: #f1f4f1 !important;
      border: 1px solid #2b352e !important;
    }
    .vfrc-user-response .vfrc-message {
      background-color: #6554d9 !important;
      color: #ffffff !important;
    }
    .vf-footer,
    .vfrc-chat-input,
    .vfrc-input {
      background-color: #171d19 !important;
      color: #f1f4f1 !important;
      border-color: #2b352e !important;
    }
    .vfrc-input::placeholder {
      color: #a4b0a9 !important;
    }
    .vfrc-launcher, .vfrc-launcher__button {
      background-color: #6554d9 !important;
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
            color: "#6554d9",
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
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2.5 rounded-2xl bg-[#6554d9] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(58,44,153,0.26)] transition hover:-translate-y-0.5 hover:bg-[#4c3dc1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6554d9] disabled:cursor-wait disabled:opacity-80"
    >
      {loading ? (
        <LoadingMark size={10} className="text-white" />
      ) : (
        <Sparkles aria-hidden="true" className="h-5 w-5" />
      )}
      <BrandLogo className="!px-2 !py-1 !text-xs !shadow-none" />
      <span>
        {loading
          ? "Loading chat..."
          : loadError
            ? "Retry chat"
            : "Ask AI"}
      </span>
    </button>
  );
};

export default VoiceflowChatbot;
