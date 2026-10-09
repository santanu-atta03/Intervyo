// frontend/src/components/Chatbot/VoiceflowChatbot.jsx
import { useContext, useEffect } from "react";
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

const loadChatbot = (theme) => {
  window.voiceflow.chat.load({
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
};

const VoiceflowChatbot = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    let cancelled = false;
    const script = document.querySelector(
      `script[src="${VOICEFLOW_SCRIPT_SRC}"]`
    );

    const initializeChatbot = () => {
      if (cancelled || !window.voiceflow?.chat) return;
      window.voiceflow.chat.destroy?.();
      loadChatbot(theme);
    };

    if (window.voiceflow?.chat) {
      initializeChatbot();
      return () => {
        cancelled = true;
      };
    }

    if (!script) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = VOICEFLOW_SCRIPT_SRC;
      script.dataset.voiceflowWidget = "true";
      script.addEventListener("load", initializeChatbot);
      document.body.appendChild(script);

      return () => {
        cancelled = true;
        script.removeEventListener("load", initializeChatbot);
      };
    }

    script.addEventListener("load", initializeChatbot);

    return () => {
      cancelled = true;
      script.removeEventListener("load", initializeChatbot);
    };
  }, [theme]);

  return null;
};


export default VoiceflowChatbot;
