import React from 'react';
import { Brain, Zap, Volume2 } from 'lucide-react';

export default function EmotionDisplay({ emotionData, confidenceData }) {
  if (!emotionData && !confidenceData) {
    return (
      <div className="text-gray-400 text-xs text-center py-2">
        Analyzing...
      </div>
    );
  }

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      neutral: '😐',
      sad: '😢',
      angry: '😠',
      fearful: '😨',
      disgusted: '🤢',
      surprised: '😮',
    };
    return emojis[emotion] || '😐';
  };

  const getConfidenceColor = (level) => {
    const colors = {
      'very-confident': 'from-green-500 to-green-600',
      'confident': 'from-blue-500 to-blue-600',
      'neutral': 'from-gray-500 to-gray-600',
      'nervous': 'from-yellow-500 to-yellow-600',
      'very-nervous': 'from-red-500 to-red-600',
    };
    return colors[level] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-2 text-xs">
      {/* Emotion */}
      {emotionData && (
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <Brain className="w-3 h-3 text-purple-400" />
            <span className="font-semibold">Emotion</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg">{getEmotionEmoji(emotionData.dominantEmotion)}</span>
            <div>
              <span className="font-bold capitalize">{emotionData.dominantEmotion}</span>
              <span className="text-gray-400 ml-1">({(emotionData.confidence * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Confidence */}
      {confidenceData && (
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="font-semibold">Confidence</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="capitalize font-bold">{confidenceData.level.replace('-', ' ')}</span>
            <span>{confidenceData.confidenceScore}/100</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getConfidenceColor(confidenceData.level)}`}
              style={{ width: `${confidenceData.confidenceScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      {confidenceData && (
        <div className="bg-white/5 rounded p-1.5 space-y-0.5 text-gray-400">
          <div className="flex justify-between">
            <span>Fillers:</span>
            <span className="font-semibold">{confidenceData.fillerWords}</span>
          </div>
          <div className="flex justify-between">
            <span>Hesitations:</span>
            <span className="font-semibold">{confidenceData.hesitations}</span>
          </div>
          <div className="flex justify-between">
            <span>Words:</span>
            <span className="font-semibold">{confidenceData.wordCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}
