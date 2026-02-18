# Intervyo – System Architecture

This document explains the high-level architecture of the Intervyo platform.

## High-Level Architecture

User (Browser)
→ Frontend (React)
→ Backend API (Node.js + Express)
→ AI Evaluation Engine
→ MongoDB Database
→ Analytics & Feedback Layer

## Frontend
- React with Tailwind CSS
- Handles interview UI, timers, dashboards
- Communicates with backend via REST APIs
- Uses browser APIs for speech and media input

## Backend
- Node.js with Express
- Handles authentication, interviews, evaluation, analytics
- Orchestrates AI interactions
- Stores and retrieves data from MongoDB

## AI Evaluation Engine
- Uses structured prompts
- Scores responses using fixed rubrics
- Generates follow-up questions
- Identifies strengths and weaknesses
- Predicts future failure points

## Database (MongoDB)
Core collections:
- Users
- Interviews
- Evaluations
- Questions
- Analytics
- AttackPlans
- CalendarEvents

## Security
- JWT-based authentication
- Role-based access control
- Private interview data by default

## Data Flow (Interview Session)
1. User starts interview
2. Backend initializes session
3. AI generates question
4. User responds
5. AI evaluates response
6. Scores and feedback stored
7. Next question triggered

## Design Principles
- Simplicity over overengineering
- Deterministic evaluation over randomness
- Extensibility without breaking core logic

Architecture exists to support learning, not complexity.
