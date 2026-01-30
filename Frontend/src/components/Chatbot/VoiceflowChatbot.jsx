// frontend/src/components/Chatbot/VoiceflowChatbot.jsx
import { useEffect, useRef } from "react";

const VoiceflowChatbot = () => {
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate loading in React StrictMode
    if (scriptLoadedRef.current) return;
    
    // Check if the Voiceflow script is already loaded
    if (!window.voiceflow) {
      scriptLoadedRef.current = true;
      const script = document.createElement("script");
      script.type = "text/javascript";

      script.innerHTML = `
        (function(d, t) {
          var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
          v.onload = function() {
            window.voiceflow.chat.load({
              verify: { projectID: '695f3fcb847e07b5c98aefe7' },
              url: 'https://general-runtime.voiceflow.com',
              versionID: 'production',
              voice: {
                url: "https://runtime-api.voiceflow.com"
              }
            });
          }
          v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
          v.type = "text/javascript"; 
          s.parentNode.insertBefore(v, s);
        })(document, 'script');
      `;

      document.body.appendChild(script);

      // Clean up the script when component unmounts
      return () => {
        try {
          document.body.removeChild(script);
        } catch (e) {
          // Script may already be removed
        }
      };
    } else {
      scriptLoadedRef.current = true;
      // If already loaded, initialize the chat
      if (window.voiceflow?.chat) {
        window.voiceflow.chat.load({
          verify: { projectID: "695f3fcb847e07b5c98aefe7" },
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
          
          voice: {
            url: "https://runtime-api.voiceflow.com",
          },
        });
      }
    }
  }, []);

  return null; // Voiceflow handles its own UI
};


export default VoiceflowChatbot;
