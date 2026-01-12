import Interview from '../models/Interview.model.js';

class EmotionAnalysisController {
  // Store emotion metrics in real-time
  async storeEmotionMetrics(req, res) {
    try {
      const { interviewId } = req.params;
      const { emotions, confidenceScore, timestamp, speechMetrics } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res.status(404).json({ success: false, message: 'Interview not found' });
      }

      if (!interview.metrics) interview.metrics = {};
      if (!interview.metrics.emotionTimeline) interview.metrics.emotionTimeline = [];
      if (!interview.metrics.confidence) interview.metrics.confidence = [];

      // Store emotion data
      interview.metrics.emotionTimeline.push({
        timestamp: timestamp || Date.now(),
        emotions: {
          neutral: emotions?.neutral || 0,
          happy: emotions?.happy || 0,
          sad: emotions?.sad || 0,
          angry: emotions?.angry || 0,
          fearful: emotions?.fearful || 0,
          disgusted: emotions?.disgusted || 0,
          surprised: emotions?.surprised || 0,
        },
      });

      // Store confidence score
      interview.metrics.confidence.push({
        timestamp: timestamp || Date.now(),
        value: typeof confidenceScore === 'number' ? confidenceScore : 0,
      });

      // Store speech metrics if provided
      if (speechMetrics) {
        if (!interview.metrics.speechMetrics) {
          interview.metrics.speechMetrics = speechMetrics;
        } else {
          // merge basic fields
          interview.metrics.speechMetrics = {
            ...interview.metrics.speechMetrics,
            ...speechMetrics,
          };
        }
      }

      // Keep only recent data (last 1000 entries)
      if (interview.metrics.emotionTimeline.length > 1000) {
        interview.metrics.emotionTimeline = interview.metrics.emotionTimeline.slice(-1000);
      }
      if (interview.metrics.confidence.length > 1000) {
        interview.metrics.confidence = interview.metrics.confidence.slice(-1000);
      }

      await interview.save();

      res.json({ 
        success: true, 
        message: 'Emotion metrics stored',
        data: { 
          emotionCount: interview.metrics.emotionTimeline.length,
          confidenceCount: interview.metrics.confidence.length 
        }
      });
    } catch (error) {
      console.error('Store emotion error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get emotion summary for current interview
  async getEmotionSummary(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res.status(404).json({ success: false, message: 'Interview not found' });
      }

      if (!interview.metrics || !interview.metrics.emotionTimeline) {
        return res.json({ 
          success: true, 
          data: { 
            hasData: false, 
            message: 'No emotion data collected yet' 
          } 
        });
      }

      // Calculate emotion statistics
      const emotionTimeline = interview.metrics.emotionTimeline;
      const emotionCounts = {};

      emotionTimeline.forEach(entry => {
        Object.keys(entry.emotions || {}).forEach(emotion => {
          const score = entry.emotions[emotion] || 0;
          if (!emotionCounts[emotion]) emotionCounts[emotion] = { count: 0, sum: 0 };
          emotionCounts[emotion].count += 1;
          emotionCounts[emotion].sum += score;
        });
      });

      // Calculate averages and percentages
      const emotionStats = {};
      let maxEmotionScore = 0;
      let dominantEmotion = 'neutral';

      Object.keys(emotionCounts).forEach(emotion => {
        const avg = emotionCounts[emotion].sum / emotionCounts[emotion].count;
        emotionStats[emotion] = {
          average: Number(avg.toFixed(3)),
          percentage: Number(((avg / emotionTimeline.length) * 100).toFixed(1)),
        };
        if (avg > maxEmotionScore) {
          maxEmotionScore = avg;
          dominantEmotion = emotion;
        }
      });

      // Calculate confidence statistics
      const confidenceData = interview.metrics.confidence || [];
      const confidenceValues = confidenceData.map(c => c.value || 0);
      const avgConfidenceRaw = confidenceValues.length > 0 ? (confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length) : 0;
      // Normalize if values are on 0-100 scale
      const avgConfidence = avgConfidenceRaw > 1 ? avgConfidenceRaw / 100 : avgConfidenceRaw;
      const maxConfidence = confidenceValues.length > 0 ? Math.max(...confidenceValues) : 0;
      const minConfidence = confidenceValues.length > 0 ? Math.min(...confidenceValues) : 0;

      // Determine overall emotion and confidence level
      const getConfidenceLevel = (avg) => {
        if (avg >= 0.8) return 'very-confident';
        if (avg >= 0.6) return 'confident';
        if (avg >= 0.4) return 'neutral';
        if (avg >= 0.2) return 'nervous';
        return 'very-nervous';
      };

      res.json({
        success: true,
        data: {
          hasData: true,
          emotionStats,
          dominantEmotion,
          confidenceStats: {
            average: parseFloat(avgConfidence.toFixed(2)),
            max: parseFloat(maxConfidence),
            min: parseFloat(minConfidence),
            level: getConfidenceLevel(parseFloat(avgConfidence.toFixed(2))),
          },
          totalSamples: emotionTimeline.length,
          speechMetrics: interview.metrics.speechMetrics || null,
        }
      });
    } catch (error) {
      console.error('Get emotion summary error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Generate emotion-based feedback after interview
  async generateEmotionFeedback(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return res.status(404).json({ success: false, message: 'Interview not found' });
      }

      if (!interview.metrics || !interview.metrics.emotionTimeline) {
        return res.json({ 
          success: true, 
          data: { 
            feedback: 'Insufficient emotion data for analysis' 
          } 
        });
      }

      // Get emotion summary
      const emotionTimeline = interview.metrics.emotionTimeline;
      const emotionCounts = {};

      emotionTimeline.forEach(entry => {
        Object.keys(entry.emotions || {}).forEach(emotion => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + (entry.emotions[emotion] || 0);
        });
      });

      // Find dominant emotions
      const dominantEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emotion]) => emotion);

      // Generate feedback based on emotions
      const feedbackMap = {
        happy: 'You appeared confident and engaged during the interview.',
        neutral: 'You maintained a professional and composed demeanor.',
        nervous: 'You showed some nervousness, which is completely normal. Practice will help you feel more comfortable.',
        fearful: 'Consider practicing more to build confidence in answering questions.',
        sad: 'Try to maintain more positive energy during interviews.',
        angry: 'Remember to stay calm and composed throughout the interview.',
        disgusted: 'Maintain a professional attitude and positive engagement.',
        surprised: 'You were responsive to unexpected questions - that\'s good!',
      };

      const emotionalFeedback = dominantEmotions
        .map(emotion => feedbackMap[emotion])
        .filter(Boolean)
        .join(' ');

      // Calculate confidence level from data
      const confidenceValues = (interview.metrics.confidence || []).map(c => c.value || 0);
      const avgConfidenceRaw = confidenceValues.length > 0 ? (confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length) : 0;
      const avgConfidence = avgConfidenceRaw > 1 ? avgConfidenceRaw / 100 : avgConfidenceRaw;

      const confidenceLevel = avgConfidence >= 0.8 ? 'very-confident' :
                              avgConfidence >= 0.6 ? 'confident' :
                              avgConfidence >= 0.4 ? 'neutral' :
                              avgConfidence >= 0.2 ? 'nervous' : 'very-nervous';

      const confidenceFeedback = {
        'very-confident': 'Your speech patterns showed high confidence and clarity.',
        'confident': 'Your speech demonstrated good confidence with minimal hesitations.',
        'neutral': 'Your confidence was average. Working on reducing filler words will help.',
        'nervous': 'You used several filler words and hesitations. Practice speaking clearly and confidently.',
        'very-nervous': 'Focus on breathing exercises and practicing aloud to improve your confidence.',
      }[confidenceLevel];

      // Store feedback in results
      if (!interview.results) interview.results = {};
      if (!interview.results.detailedFeedback) interview.results.detailedFeedback = {};

      interview.results.detailedFeedback.behavioralAnalysis = {
        emotionalResponse: emotionalFeedback,
        confidenceLevel: confidenceLevel,
        confidenceFeedback: confidenceFeedback,
        dominantEmotions: dominantEmotions,
        emotionAccuracy: Number(avgConfidence.toFixed(2)),
      };

      await interview.save();

      res.json({
        success: true,
        data: {
          emotionalFeedback,
          confidenceLevel,
          confidenceFeedback,
          dominantEmotions,
          recommendations: [
            'Practice speaking without filler words',
            'Work on maintaining consistent confidence',
            'Record yourself and review your speech patterns',
            'Consider mock interviews with feedback',
          ]
        }
      });
    } catch (error) {
      console.error('Generate emotion feedback error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new EmotionAnalysisController();
