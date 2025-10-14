export const checkBrowserSupport = () => {
  const checks = {
    speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    speechSynthesis: 'speechSynthesis' in window,
    mediaDevices: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    webRTC: 'RTCPeerConnection' in window
  };

  return checks;
};

export const requestMediaPermissions = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    
    // Stop all tracks after permission granted
    stream.getTracks().forEach(track => track.stop());
    
    return { success: true };
  } catch (error) {
    console.error('Media permission error:', error);
    return { 
      success: false, 
      error: error.name === 'NotAllowedError' 
        ? 'Camera/Microphone access denied' 
        : 'Failed to access media devices'
    };
  }
};