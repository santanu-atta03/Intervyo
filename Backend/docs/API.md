# Intervyo API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://intervyo.xyz/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Core Endpoints

### Health Check
**GET** `/health`

Check server and service status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:30:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "services": {
    "database": "connected",
    "server": "ok"
  }
}
```

---

## Authentication Endpoints

### Send OTP
**POST** `/auth/send-otp`

Send OTP to email for registration.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": "10 minutes"
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Verify OTP & Register
**POST** `/auth/verify-otp`

Verify OTP and complete registration.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "profile": { ... }
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Google OAuth
**GET** `/auth/google`

Redirect to Google OAuth login.

**GET** `/auth/google/callback`

Google OAuth callback URL.

---

### GitHub OAuth
**GET** `/auth/github`

Redirect to GitHub OAuth login.

**GET** `/auth/github/callback`

GitHub OAuth callback URL.

---

## AI Interview Endpoints

### Generate Interview Questions
**POST** `/ai/generate-questions`
🔒 **Requires Authentication**

Generate AI-powered interview questions.

**Request Body:**
```json
{
  "topic": "JavaScript",
  "difficulty": "intermediate",
  "type": "technical",
  "count": 5
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "question": "Explain closures in JavaScript",
      "difficulty": "intermediate",
      "type": "technical",
      "expectedTime": 180
    }
  ],
  "sessionId": "session_id"
}
```

**Rate Limit:** 20 requests per hour

---

### Evaluate Answer
**POST** `/ai/evaluate-answer`
🔒 **Requires Authentication**

Evaluate candidate's answer using AI.

**Request Body:**
```json
{
  "sessionId": "session_id",
  "questionId": "q1",
  "answer": "Closures are functions that have access to variables...",
  "timeTaken": 120
}
```

**Response:**
```json
{
  "success": true,
  "evaluation": {
    "score": 85,
    "feedback": "Good explanation with practical examples",
    "strengths": ["Clear understanding", "Practical examples"],
    "improvements": ["Could mention lexical scope"],
    "technicalAccuracy": 90,
    "communicationClarity": 80,
    "confidence": 85
  }
}
```

---

### Complete Interview
**POST** `/ai/complete-interview`
🔒 **Requires Authentication**

Complete interview session and generate final report.

**Request Body:**
```json
{
  "sessionId": "session_id"
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "overallScore": 82,
    "totalQuestions": 5,
    "answered": 5,
    "duration": 900,
    "strengths": ["Technical knowledge", "Problem-solving"],
    "weaknesses": ["Time management"],
    "recommendations": ["Practice more coding problems"],
    "performanceBreakdown": {
      "technical": 85,
      "communication": 80,
      "confidence": 75
    }
  },
  "interviewId": "interview_id"
}
```

---

## Company Recommendation Endpoints

### Get Recommendations
**GET** `/recommendations`
🔒 **Requires Authentication**

Get AI-powered company recommendations based on your profile.

**Query Parameters:**
- `skillLevel` (optional): beginner, intermediate, advanced
- `preferences` (optional): remote, onsite, hybrid

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "company": "Google",
      "matchScore": 85,
      "reasoning": "Strong technical skills match their requirements",
      "successProbability": 75,
      "skillGaps": ["System design"],
      "suggestedPreparation": ["Practice system design problems"]
    }
  ]
}
```

---

### Get Company Details
**GET** `/recommendations/:companyId`
🔒 **Requires Authentication**

Get detailed information about a specific company.

**Response:**
```json
{
  "success": true,
  "company": {
    "id": "company_id",
    "name": "Google",
    "description": "Tech giant...",
    "hiringBar": "high",
    "successRate": 15,
    "avgSalary": "$150,000",
    "interviewProcess": ["Phone screen", "Technical", "System design", "Behavioral"],
    "commonQuestions": [ ... ]
  }
}
```

---

## Interview Calendar Endpoints

### Add Interview Date
**POST** `/calendar`
🔒 **Requires Authentication**

Add an upcoming interview to your calendar.

**Request Body:**
```json
{
  "companyName": "Google",
  "interviewDate": "2026-02-15T10:00:00Z",
  "interviewType": "technical",
  "notes": "System design round"
}
```

**Response:**
```json
{
  "success": true,
  "calendar": {
    "id": "calendar_id",
    "companyName": "Google",
    "interviewDate": "2026-02-15T10:00:00Z",
    "daysRemaining": 31,
    "milestones": [
      {
        "date": "2026-01-20",
        "task": "Start system design practice",
        "completed": false
      }
    ],
    "readinessScore": 45
  }
}
```

---

### Get Calendar Events
**GET** `/calendar`
🔒 **Requires Authentication**

Get all your scheduled interviews.

**Query Parameters:**
- `upcoming` (optional): true/false
- `limit` (optional): number of results

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "event_id",
      "companyName": "Google",
      "interviewDate": "2026-02-15T10:00:00Z",
      "daysRemaining": 31,
      "readinessScore": 45,
      "milestones": [ ... ]
    }
  ]
}
```

---

### Update Calendar Event
**PUT** `/calendar/:eventId`
🔒 **Requires Authentication**

Update an interview calendar event.

**Request Body:**
```json
{
  "interviewDate": "2026-02-16T14:00:00Z",
  "notes": "Rescheduled"
}
```

---

### Delete Calendar Event
**DELETE** `/calendar/:eventId`
🔒 **Requires Authentication**

Delete a calendar event.

---

## Question Database Endpoints

### Get Real Interview Questions
**GET** `/questions`
🔒 **Requires Authentication**

Get crowdsourced real interview questions.

**Query Parameters:**
- `company` (optional): Company name filter
- `difficulty` (optional): easy, medium, hard
- `type` (optional): technical, behavioral, system-design
- `sort` (optional): trending, recent, upvotes
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "question_id",
      "question": "Design a URL shortener",
      "company": "Google",
      "difficulty": "hard",
      "type": "system-design",
      "upvotes": 145,
      "downvotes": 12,
      "frequency": "common",
      "askedDate": "2026-01-10",
      "verified": true,
      "tags": ["distributed-systems", "scalability"]
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "pages": 125
  }
}
```

---

### Submit Interview Question
**POST** `/questions`
🔒 **Requires Authentication**

Submit a question you were asked in an interview.

**Request Body:**
```json
{
  "question": "Design a URL shortener",
  "company": "Google",
  "difficulty": "hard",
  "type": "system-design",
  "interviewDate": "2026-01-10",
  "additionalContext": "Asked in system design round"
}
```

**Response:**
```json
{
  "success": true,
  "question": {
    "id": "question_id",
    "status": "pending_verification",
    "message": "Question submitted for review"
  }
}
```

---

### Vote on Question
**POST** `/questions/:questionId/vote`
🔒 **Requires Authentication**

Upvote or downvote a question.

**Request Body:**
```json
{
  "vote": "up" // or "down"
}
```

---

## Buddy Matching Endpoints

### Find Study Buddies
**GET** `/buddy/matches`
🔒 **Requires Authentication**

Find compatible study partners.

**Query Parameters:**
- `targetCompany` (optional): Filter by target company
- `skillLevel` (optional): Filter by skill level

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "userId": "user_id",
      "name": "Jane Doe",
      "targetCompanies": ["Google", "Meta"],
      "skillLevel": "intermediate",
      "compatibilityScore": 85,
      "commonInterests": ["System design", "Algorithms"],
      "availability": ["weekends", "evenings"]
    }
  ]
}
```

---

### Request Buddy Connection
**POST** `/buddy/connect`
🔒 **Requires Authentication**

Send connection request to a study buddy.

**Request Body:**
```json
{
  "buddyUserId": "user_id",
  "message": "Hi! Would you like to practice mock interviews together?"
}
```

---

### Accept/Reject Buddy Request
**PUT** `/buddy/requests/:requestId`
🔒 **Requires Authentication**

Accept or reject a buddy request.

**Request Body:**
```json
{
  "action": "accept" // or "reject"
}
```

---

## Profile Endpoints

### Get Profile
**GET** `/profile`
🔒 **Requires Authentication**

Get your profile information.

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "skills": ["JavaScript", "React", "Node.js"],
    "targetCompanies": ["Google", "Meta"],
    "interviewsCompleted": 15,
    "avgScore": 78,
    "streak": 5,
    "achievements": [ ... ]
  }
}
```

---

### Update Profile
**PUT** `/profile`
🔒 **Requires Authentication**

Update your profile information.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "bio": "Full-stack developer preparing for FAANG interviews"
}
```

---

## Dashboard & Analytics Endpoints

### Get Dashboard Stats
**GET** `/dashboard/stats`
🔒 **Requires Authentication**

Get personalized dashboard statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "interviewsCompleted": 15,
    "averageScore": 78,
    "currentStreak": 5,
    "longestStreak": 12,
    "upcomingInterviews": 2,
    "practiceTime": 4800,
    "skillBreakdown": {
      "technical": 80,
      "behavioral": 75,
      "communication": 82
    },
    "recentActivity": [ ... ]
  }
}
```

---

### Get Analytics
**GET** `/analytics`
🔒 **Requires Authentication**

Get detailed performance analytics.

**Query Parameters:**
- `period` (optional): week, month, year, all
- `metric` (optional): score, time, count

**Response:**
```json
{
  "success": true,
  "analytics": {
    "performanceTrend": [
      { "date": "2026-01-08", "score": 75 },
      { "date": "2026-01-15", "score": 82 }
    ],
    "topSkills": ["JavaScript", "System Design"],
    "improvementAreas": ["Time management", "Behavioral questions"],
    "comparisonWithAverage": {
      "yourScore": 82,
      "averageScore": 70,
      "percentile": 75
    }
  }
}
```

---

## Leaderboard Endpoints

### Get Leaderboard
**GET** `/leaderboard`

Get global or filtered leaderboard.

**Query Parameters:**
- `timeframe` (optional): daily, weekly, monthly, all-time
- `category` (optional): overall, technical, behavioral
- `limit` (optional): Number of results (default: 100)

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_id",
      "name": "Jane Doe",
      "score": 950,
      "interviewsCompleted": 50,
      "streak": 30,
      "badges": ["Top Performer", "100 Interviews"]
    }
  ],
  "yourRank": 45,
  "totalParticipants": 10000
}
```

---

## Chatbot Endpoints

### Chat with AI Assistant
**POST** `/chatbot/message`
🔒 **Requires Authentication**

Get help from the AI interview assistant.

**Request Body:**
```json
{
  "message": "How do I prepare for system design interviews?",
  "context": {
    "currentTopic": "system-design",
    "conversationId": "conv_id"
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "To prepare for system design interviews, focus on...",
  "suggestions": [
    "Show me common system design patterns",
    "Practice problems for beginners"
  ],
  "conversationId": "conv_id"
}
```

---

## Error Responses

All endpoints may return the following error format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### Common Error Codes

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Rate Limits

| Endpoint Type | Rate Limit |
|--------------|------------|
| Authentication | 5 requests / 15 minutes |
| AI Interviews | 20 requests / hour |
| File Uploads | 10 requests / hour |
| General API | 100 requests / 15 minutes |
| Password Reset | 3 requests / hour |

---

## Webhooks (Coming Soon)

Subscribe to events:
- Interview completed
- New buddy match
- Upcoming interview reminder
- Achievement unlocked

---

## Support

For API support, contact:
- Email: support@intervyo.xyz
- Documentation: https://intervyo.xyz/docs
- GitHub Issues: https://github.com/santanu-atta03/Intervyo/issues
