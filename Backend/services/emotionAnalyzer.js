// // services/emotionAnalyzer.js
// import tf from '@tensorflow/tfjs-node';
// import faceapi from 'face-api.js';
// import canvas from 'canvas';

// // Setup face-api.js with node-canvas
// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// class EmotionAnalyzer {
//   constructor() {
//     this.initialized = false;
//     this.modelPath = './models'; // Download models to this folder
//   }

//   async initialize() {
//     if (this.initialized) return;

//     try {
//       // Load models (download from: https://github.com/justadudewhohacks/face-api.js-models)
//       await faceapi.nets.tinyFaceDetector.loadFromDisk(this.modelPath);
//       await faceapi.nets.faceExpressionNet.loadFromDisk(this.modelPath);

//       this.initialized = true;
//       console.log('Emotion analyzer initialized');
//     } catch (error) {
//       console.error('Failed to load emotion models:', error);
//     }
//   }

//   async analyzeFrame(imageBase64) {
//     if (!this.initialized) {
//       await this.initialize();
//     }

//     try {
//       // Convert base64 to buffer
//       const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
//       const image = await canvas.loadImage(imageBuffer);

//       // Detect face and expressions
//       const detection = await faceapi
//         .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
//         .withFaceExpressions();

//       if (!detection) {
//         return {
//           detected: false,
//           emotions: null,
//           confidence: 0
//         };
//       }

//       const expressions = detection.expressions;

//       // Calculate overall confidence
//       const maxEmotion = Object.keys(expressions).reduce((a, b) =>
//         expressions[a] > expressions[b] ? a : b
//       );

//       return {
//         detected: true,
//         emotions: {
//           neutral: Math.round(expressions.neutral * 100),
//           happy: Math.round(expressions.happy * 100),
//           confident: Math.round((expressions.happy + expressions.neutral) * 50),
//           nervous: Math.round((expressions.fearful + expressions.sad) * 50),
//           confused: Math.round((expressions.surprised + expressions.disgusted) * 50)
//         },
//         confidence: Math.round(expressions[maxEmotion] * 100),
//         dominantEmotion: maxEmotion
//       };

//     } catch (error) {
//       console.error('Emotion analysis error:', error);
//       return {
//         detected: false,
//         emotions: null,
//         confidence: 0,
//         error: error.message
//       };
//     }
//   }

//   // Simple mock for testing (if models not downloaded)
//   async analyzeMock() {
//     return {
//       detected: true,
//       emotions: {
//         neutral: 60,
//         happy: 20,
//         confident: 70,
//         nervous: 10,
//         confused: 5
//       },
//       confidence: 75,
//       dominantEmotion: 'confident'
//     };
//   }
// }

// module.exports = new EmotionAnalyzer();

// services/emotionAnalyzer.js
class EmotionAnalyzer {
  constructor() {
    this.baseline = {
      neutral: 60,
      confident: 20,
      happy: 10,
      nervous: 5,
      confused: 5,
    };
  }

  async analyzeFrame(frameData) {
    // For now, return simulated data
    // TODO: Integrate real emotion detection API later

    try {
      // Simulate emotion detection with slight variations
      const emotions = this._generateRealisticEmotions();

      return {
        detected: true,
        emotions,
        confidence: emotions.confident + emotions.neutral / 2,
        dominantEmotion: this._getDominantEmotion(emotions),
        timestamp: Date.now(),
        metrics: {
          eyeContact: Math.random() > 0.2, // 80% eye contact
          facingCamera: Math.random() > 0.1, // 90% facing camera
          lighting: "good",
        },
      };
    } catch (error) {
      console.error("Emotion analysis error:", error);
      return {
        detected: false,
        emotions: null,
        confidence: 0,
        error: error.message,
      };
    }
  }

  _generateRealisticEmotions() {
    // Generate realistic emotion distributions with natural variation
    const variation = () => (Math.random() - 0.5) * 20;

    const confident = Math.max(
      0,
      Math.min(100, this.baseline.confident + variation()),
    );
    const neutral = Math.max(
      0,
      Math.min(100, this.baseline.neutral + variation()),
    );
    const nervous = Math.max(
      0,
      Math.min(100, this.baseline.nervous + variation() / 2),
    );
    const confused = Math.max(
      0,
      Math.min(100, this.baseline.confused + variation() / 2),
    );
    const happy = Math.max(0, Math.min(100, this.baseline.happy + variation()));

    const total = confident + neutral + nervous + confused + happy;

    return {
      confident: Math.round((confident / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      nervous: Math.round((nervous / total) * 100),
      confused: Math.round((confused / total) * 100),
      happy: Math.round((happy / total) * 100),
    };
  }

  _getDominantEmotion(emotions) {
    return Object.entries(emotions).reduce((a, b) =>
      emotions[a[0]] > emotions[b[0]] ? a : b,
    )[0];
  }

  analyzeSpeech(transcript, duration) {
    if (!transcript || !duration) {
      return this._getDefaultSpeechMetrics();
    }

    const words = transcript.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;
    const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

    const fillerWords = [
      "um",
      "uh",
      "like",
      "you know",
      "actually",
      "basically",
      "literally",
      "so",
      "well",
    ];
    const fillerCount = words.filter((word) =>
      fillerWords.includes(word.toLowerCase()),
    ).length;

    const pausePattern = /\.{2,}|…|\s{3,}/g;
    const pauseCount = (transcript.match(pausePattern) || []).length;

    return {
      wordsPerMinute: wpm,
      totalWords: wordCount,
      fillerWords: fillerCount,
      fillerPercentage:
        wordCount > 0 ? Math.round((fillerCount / wordCount) * 100) : 0,
      pauseCount,
      pace: wpm < 120 ? "slow" : wpm > 160 ? "fast" : "optimal",
      clarity: this._calculateClarity(fillerCount, wordCount, pauseCount),
    };
  }

  _calculateClarity(fillers, words, pauses) {
    if (words === 0) return 50;

    const fillerPenalty = (fillers / words) * 50;
    const pausePenalty = (pauses / words) * 30;
    const clarity = 100 - fillerPenalty - pausePenalty;
    return Math.max(0, Math.min(100, Math.round(clarity)));
  }

  _getDefaultSpeechMetrics() {
    return {
      wordsPerMinute: 0,
      totalWords: 0,
      fillerWords: 0,
      fillerPercentage: 0,
      pauseCount: 0,
      pace: "unknown",
      clarity: 50,
    };
  }
}

export default new EmotionAnalyzer();
