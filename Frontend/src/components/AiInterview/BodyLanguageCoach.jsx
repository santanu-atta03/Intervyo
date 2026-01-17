import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const BodyLanguageCoach = ({ videoRef, isVideoOn }) => {
  const canvasRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [score, setScore] = useState(100);
  const [alert, setAlert] = useState(null); // { type: 'eye' | 'posture', message: string }
  
  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models'; // Assumes models are in public/models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          // faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL) // Optional
        ]);
        setModelLoaded(true);
        console.log("FaceAPI models loaded");
      } catch (err) {
        console.error("Failed to load FaceAPI models", err);
      }
    };
    loadModels();
  }, []);

  // Detection Loop
  useEffect(() => {
    if (!modelLoaded || !videoRef.current || !isVideoOn) return;

    const video = videoRef.current;
    
    const handlePlay = () => {
        if(!canvasRef.current) return;
        const canvas = canvasRef.current;
        // Use offsetWidth/Height to match the actual displayed size of the video element
        const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
        
        // Match canvas dimensions to video
        faceapi.matchDimensions(canvas, displaySize);

        const intervalId = setInterval(async () => {
            if (video.paused || video.ended) {
                clearInterval(intervalId);
                return;
            }

            // Detect
            const detections = await faceapi.detectAllFaces(
                video, 
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks();

            // Resize
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            // Clear previous draw
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Sci-Fi Overlay
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
             
            if (resizedDetections.length > 0) {
                const landmarks = resizedDetections[0].landmarks;
                const nose = landmarks.getNose()[3]; // Tip of nose
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();
                const jaw = landmarks.getJawOutline();
                
                // Analysis Logic
                analyzePosture(nose, jaw, displaySize);
                analyzeEyeContact(landmarks, displaySize);
                
                // Recovery: If no alerts, slowly recover score
                setScore(prev => Math.min(100, prev + 0.1));
            }

        }, 100); // Check every 100ms

        return intervalId;
    };

    let intervalId;
    // Check if video is already playing
    if (video.readyState >= 4) {
        intervalId = handlePlay();
    } else {
        video.addEventListener('play', () => {
             intervalId = handlePlay();
        });
    }

    return () => {
        if(intervalId) clearInterval(intervalId);
        // video.removeEventListener('play', ...); // tricky with closure, but React handles cleanup of effect
    };
  }, [modelLoaded, videoRef, isVideoOn]);

  const analyzePosture = (nose, jaw, displaySize) => {
      // 1. Vertical Slouching
      // Normalized Y position of nose. 0 is top, 1 is bottom.
      const noseY = nose.y / displaySize.height;
      
      // If nose is too low, user is likely slouching or camera is high
      if (noseY > 0.7) { 
          setAlert({ type: 'posture', message: '⚠️ Sit Up Straight' });
          decrementScore();
      } else {
          // If previous alert was posture, clear it
           setAlert(prev => prev?.type === 'posture' ? null : prev);
      }
      
      // 2. Head Tilt (Roll)
      // Compare jaw points (ears level) or eyes level ???
      // Easier: Slope between eyes
      // logic moved to eye analysis or generic head pose
  };

  const analyzeEyeContact = (landmarks, displaySize) => {
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();
      
      // Calculate slope between eyes
      const leftEyeCenter = { x: (leftEye[0].x + leftEye[3].x)/2, y: (leftEye[0].y + leftEye[3].y)/2 };
      const rightEyeCenter = { x: (rightEye[0].x + rightEye[3].x)/2, y: (rightEye[0].y + rightEye[3].y)/2 };
      
      const dy = rightEyeCenter.y - leftEyeCenter.y;
      const dx = rightEyeCenter.x - leftEyeCenter.x;
      const angle = Math.atan2(dy, dx); // radians
      
      // Tilt threshold (approx 15 degrees = 0.26 rad)
      if (Math.abs(angle) > 0.25) {
          setAlert({ type: 'posture', message: '⚠️ Straighten Head' });
          decrementScore();
          return;
      }

      // Eye Contact / Attention
      // Heuristic: If detecting 68 landmarks, we can see if face is frontal.
      // face-api doesn't give gaze direction directly without more work.
      // But we can check width of face vs width of eyes to simple turn detection?
      // A simple proxy: Dlib alignment.
      // If nose tip is too far left/right relative to eyes center.
      
      const noseTip = landmarks.getNose()[3];
      const eyesCenter = { x: (leftEyeCenter.x + rightEyeCenter.x) / 2, y: (leftEyeCenter.y + rightEyeCenter.y) / 2 };
      const faceWidth = Math.abs(landmarks.getJawOutline()[0].x - landmarks.getJawOutline()[16].x);
      
      // Deviation of nose from center of eyes (horizontal)
      const deviationX = Math.abs(noseTip.x - eyesCenter.x);
      
      // If nose is too far from center relative to face width, head is turned
      // Threshold found experimentally or approximated
      if (deviationX / faceWidth > 0.15) {
           setAlert({ type: 'eye', message: '⚠️ Maintain Eye Contact' });
           decrementScore();
      } else {
           setAlert(prev => prev?.type === 'eye' ? null : prev);
      }
  };

  const decrementScore = () => {
      setScore(prev => Math.max(0, prev - 0.5)); // Drop slowly
  };

  if (!isVideoOn) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" />
      
      {/* HUD Overlay */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-cyan-500/30 text-cyan-400 font-mono text-sm max-w-[200px]">
         <div className="flex justify-between items-center mb-1">
           <span>CONFIDENCE</span>
           <span className={`${score < 70 ? 'text-red-500' : 'text-green-400'} font-bold`}>{Math.round(score)}</span>
         </div>
         <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
                className={`h-full transition-all duration-300 ${score < 70 ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${score}%` }}
            />
         </div>
      </div>

      {alert && (
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-2 rounded-full font-bold animate-pulse shadow-lg border border-red-400">
             {alert.message}
          </div>
      )}
    </div>
  );
};

export default BodyLanguageCoach;
