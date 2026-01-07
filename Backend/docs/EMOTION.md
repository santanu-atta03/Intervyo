# Emotion Metrics API

This document describes the emotion analysis endpoints.

Base path: `/api/interviews/:interviewId`

## Store emotion metrics (POST)
POST /:interviewId/emotion-metrics
Headers: `Authorization: Bearer <token>`
Body (JSON):
{
  "emotions": { "neutral": 0.8, "happy": 0.1, ... },
  "confidenceScore": 0.82, // 0-1 float (or 0-100)
  "timestamp": 167...,
  "speechMetrics": { "fillerWords": 3, "hesitations": 2 }
}

Response: { success: true, message: 'Emotion metrics stored', data: { emotionCount, confidenceCount } }

## Get emotion summary (GET)
GET /:interviewId/emotion-summary
Headers: `Authorization: Bearer <token>`

Response: Stats for emotion averages, dominantEmotion, confidenceStats, speechMetrics

## Generate emotion feedback (POST)
POST /:interviewId/emotion-feedback
Headers: `Authorization: Bearer <token>`

Response: Structured feedback and recommendations

---

cURL example:

curl -X POST "${REACT_APP_BASE_URL}/api/interviews/<interviewId>/emotion-metrics" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"emotions":{"neutral":0.8,"happy":0.1},"confidenceScore":0.8}'
