import { useState, useRef, useCallback, useEffect } from "react";

export const useVoiceRecognition = (onResult, onError) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();

      // Configure recognition
      recognition.continuous = false; // Stop after getting result
      recognition.interimResults = true; // Show interim results
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("Voice recognition started");
        setIsListening(true);

        // Auto-stop after 30 seconds of listening
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognition.stop();
          }
        }, 30000);
      };

      recognition.onresult = (event) => {
        let interimText = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalText += transcriptText;
          } else {
            interimText += transcriptText;
          }
        }

        setInterimTranscript(interimText);

        if (finalText) {
          const fullTranscript = transcript + finalText;
          setTranscript(fullTranscript);

          // Call the callback with final result
          if (onResult) {
            onResult(finalText.trim());
          }

          // Auto-stop after getting final result
          setTimeout(() => {
            if (recognitionRef.current) {
              recognition.stop();
            }
          }, 100);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (event.error === "no-speech") {
          console.log("No speech detected");
        } else if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          if (onError) {
            onError(
              "Microphone access denied. Please allow microphone access.",
            );
          }
        } else if (event.error === "network") {
          if (onError) {
            onError("Network error. Please check your connection.");
          }
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Voice recognition ended");

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech recognition not supported in this browser");
      setIsSupported(false);
      if (onError) {
        onError("Speech recognition is not supported in your browser.");
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping recognition:", error);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onResult, onError]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.error("Speech recognition not supported");
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        setTranscript("");
        setInterimTranscript("");
        recognitionRef.current.start();
        console.log("Starting speech recognition");
      } catch (error) {
        console.error("Error starting recognition:", error);

        // If already started, stop and restart
        if (error.message?.includes("already started")) {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.error("Retry error:", err);
            }
          }, 100);
        }
      }
    }
  }, [isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        console.log("Stopping speech recognition");

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
