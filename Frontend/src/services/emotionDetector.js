import * as faceapi from 'face-api.js';

class EmotionDetector {
  constructor() {
    this.modelsLoaded = false;
    this.emotionHistory = [];
    this.detectionInterval = null;
    this.isDetecting = false;
  }

  async loadModels() {
    if (this.modelsLoaded) return;
    const localUrl = '/models';
    const cdnUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

    const tryLoad = async (url) => {
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(url),
        faceapi.nets.faceLandmark68Net.loadFromUri(url),
        faceapi.nets.faceExpressionNet.loadFromUri(url),
      ]);
    };

    try {
      // Prefer local models if available
      await tryLoad(localUrl);
      this.modelsLoaded = true;
      this.modelUrl = localUrl;
      console.log('✅ Emotion detection models loaded from local /models');
      return;
    } catch (localErr) {
      console.warn('Local models not found or failed to load, falling back to CDN:', localErr.message);
    }

    try {
      await tryLoad(cdnUrl);
      this.modelsLoaded = true;
      this.modelUrl = cdnUrl;
      console.log('✅ Emotion detection models loaded from CDN');
    } catch (cdnErr) {
      console.error('Failed to load emotion models from CDN:', cdnErr);
      throw cdnErr;
    }
  }

  async detectEmotions(videoElement) {
    if (!this.modelsLoaded) await this.loadModels();
    if (!videoElement || videoElement.readyState !== 4) return null;

    try {
      const detections = await faceapi
        .detectAllFaces(videoElement)
        .withFaceExpressions();

      if (detections.length === 0) return null;

      const expressions = detections[0].expressions;
      const dominantEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      const data = {
        emotions: {
          neutral: Number(expressions.neutral.toFixed(3)),
          happy: Number(expressions.happy.toFixed(3)),
          sad: Number(expressions.sad.toFixed(3)),
          angry: Number(expressions.angry.toFixed(3)),
          fearful: Number(expressions.fearful.toFixed(3)),
          disgusted: Number(expressions.disgusted.toFixed(3)),
          surprised: Number(expressions.surprised.toFixed(3)),
        },
        dominantEmotion,
        confidence: Number(expressions[dominantEmotion].toFixed(3)),
        timestamp: Date.now(),
      };

      this.emotionHistory.push(data);
      if (this.emotionHistory.length > 200) this.emotionHistory.shift();

      return data;
    } catch (error) {
      console.error('Detection error:', error);
      return null;
    }
  }

  startDetection(videoElement, callback, interval = 1000) {
    if (this.detectionInterval) clearInterval(this.detectionInterval);
    this.isDetecting = true;

    this.detectionInterval = setInterval(async () => {
      const emotion = await this.detectEmotions(videoElement);
      if (emotion && callback) callback(emotion);
    }, interval);
  }

  stopDetection() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
      this.isDetecting = false;
    }
  }

  getStats() {
    if (this.emotionHistory.length === 0) return null;

    const stats = {
      totalSamples: this.emotionHistory.length,
      emotions: {},
      timeline: this.emotionHistory.map(e => ({
        timestamp: e.timestamp,
        emotion: e.dominantEmotion,
        confidence: e.confidence,
      })),
    };

    const emotionCounts = {};
    this.emotionHistory.forEach(entry => {
      const emotion = entry.dominantEmotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    Object.keys(emotionCounts).forEach(emotion => {
      stats.emotions[emotion] = {
        count: emotionCounts[emotion],
        percentage: ((emotionCounts[emotion] / stats.totalSamples) * 100).toFixed(1),
      };
    });

    return stats;
  }

  reset() {
    this.emotionHistory = [];
  }
}

export default new EmotionDetector();
