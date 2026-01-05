🎯 Intervyo – AI-Powered Interview Platform

Intervyo is an AI-driven interview preparation and evaluation platform designed to simulate real-world technical and HR interviews. It helps candidates practice interviews, receive structured feedback, and improve their performance using AI analysis instead of vague human opinions.
This is not another “chat with AI” toy. The goal is realism, accountability, and measurable improvement.

🚀 Why Intervyo Exists

  Most interview prep platforms fail for three reasons:
    They ask generic questions
    They give fluffy feedback
    They don’t simulate actual interview pressure
  Intervyo fixes that by:
    Running structured interviews
    Evaluating responses against defined criteria
    Giving actionable feedback (not motivational nonsense)

🧠 Core Features
🎤 AI Interview Simulation

  Technical, behavioral, and mixed interview modes
  Timed questions to simulate real interview pressure
  Adaptive follow-up questions based on candidate responses

📊 Smart Evaluation & Feedback
  
  Communication clarity analysis
  Technical correctness scoring
  Confidence & structure assessment
  Strengths, weaknesses, and improvement suggestions

📁 Interview History & Progress Tracking

  Store past interviews
  Compare performance over time
  Identify recurring weaknesses

🔐 Secure User System

  Authentication & authorization
  Private interview data
  Secure API handling

🛠 Tech Stack

  Frontend
  React
  Tailwind CSS
  Responsive UI (desktop + mobile)
  
  Backend
  Node.js
  Express.js
  MongoDB
  REST APIs
  AI Layer
  LLM-based interview logic
  Prompt-engineered evaluation criteria

Structured scoring system (not random text output)

🧩 System Architecture (High Level)
User → Frontend (React)
     → Backend (Express API)
     → AI Evaluation Engine
     → Database (MongoDB)
     → Feedback & Analytics


Simple, scalable, and not overengineered.

⚙️ Installation & Setup
Prerequisites

Node.js (v18+ recommended)

MongoDB

Git

Clone the Repository
git clone https://github.com/your-username/intervyo.git
cd intervyo

Backend Setup
cd backend
npm install
npm run dev

Frontend Setup
cd frontend
npm install
npm run dev


Create a .env file in the backend directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key

📌 Current Status

✅ Core interview flow implemented

✅ AI-based evaluation logic working

✅ User authentication

🚧 Advanced analytics (in progress)

🚧 Multi-role interview templates (planned)

🧪 Use Cases

Students preparing for placements

Developers preparing for technical interviews

Self-assessment before real interviews

Mock interview practice without human bias

🧠 Design Philosophy

Realism over gimmicks

Feedback over praise

Skill improvement over vanity metrics

If it doesn’t help you perform better in an actual interview, it doesn’t belong here.

🤝 Contributing

Contributions are welcome if they:

Improve realism

Improve evaluation accuracy

Improve UX without bloating the system

Open a PR with a clear explanation. Low-effort changes will be rejected.
