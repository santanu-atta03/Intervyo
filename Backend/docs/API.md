# Intervyo API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://intervyo.xyz/api
```

## Authentication

All authenticated endpoints require a [REDACTED_SECRET] in the Authorization header:
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
    "milestones": [ ... ]
  }
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

