import { useState, useRef, useCallback } from "react";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  // Play audio from base64 data (ElevenLabs)
  const playAudio = useCallback(async (base64Data) => {
    try {
      if (!base64Data) {
        console.error("No audio data provided");
        return Promise.reject("No audio data");
      }

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      // Create and configure audio element
      const audio = new Audio(url);
      audio.preload = "auto";
      audioRef.current = audio;

      return new Promise((resolve, reject) => {
        setIsPlaying(true);

        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
          resolve();
        };

        audio.onerror = (error) => {
          console.error("Audio playback error:", error);
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
          reject(error);
        };

        audio.oncanplaythrough = () => {
          audio.play().catch((error) => {
            console.error("Play error:", error);
            setIsPlaying(false);
            URL.revokeObjectURL(url);
            reject(error);
          });
        };

        // Load the audio
        audio.load();
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      return Promise.reject(error);
    }
  }, []);

  // Stop current audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Play text using Web Speech API (fallback)
  const speakText = useCallback((text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!("speechSynthesis" in window)) {
        reject("Speech synthesis not supported");
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || "en-US";

      // Try to get a better voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.includes("Google") ||
            voice.name.includes("Female") ||
            voice.name.includes("Samantha")),
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      setIsPlaying(true);

      utterance.onend = () => {
        setIsPlaying(false);
        resolve();
      };

      utterance.onerror = (error) => {
        console.error("Speech synthesis error:", error);
        setIsPlaying(false);
        reject(error);
      };

      // Ensure voices are loaded
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    });
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    stopAudio();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [stopAudio]);

  return {
    isPlaying,
    playAudio,
    stopAudio,
    speakText,
    cleanup,
  };
};
