<h1 align="center">Intervyo – AI-Powered Interview Simulation Platform</h1>

Intervyo is an AI-driven interview preparation and evaluation platform designed to simulate real-world technical and HR interviews.  
It helps candidates practice interviews, receive structured, criteria-based feedback, and improve performance through AI analysis instead of vague human opinions.

This is not a generic “chat with AI” project.  
Intervyo is built for realism, accountability, and measurable improvement.

---

## 🎯 Why Intervyo Exists

Most interview preparation platforms fail because they:

- Ask generic questions  
- Give fluffy, non-actionable feedback  
- Do not simulate real interview pressure  

Intervyo fixes this by:

- Running structured interviews  
- Evaluating responses against defined criteria  
- Giving actionable feedback, not motivational nonsense  

If it doesn’t help you perform better in a real interview, it doesn’t belong here.

---

## 🧠 Core Features

### 🎤 AI Interview Simulation
- Technical, behavioral, and mixed interview modes  
- Timed questions to simulate real interview pressure  
- Adaptive follow-up questions based on candidate responses  

### 📊 Smart Evaluation & Feedback
- Communication clarity analysis  
- Technical correctness scoring  
- Confidence & structure assessment  
- Strengths, weaknesses, and improvement suggestions  

### 📁 Interview History & Progress Tracking
- Store past interviews  
- Compare performance over time  
- Identify recurring weaknesses  

### 🔐 Secure User System
- Authentication & authorization  
- Private interview data  
- Secure API handling  

---

## 🛠 Tech Stack

### 🎨 Frontend
- React  
- Tailwind CSS  
- Responsive UI (desktop + mobile)

### ⚙️ Backend
- Node.js  
- Express.js  
- MongoDB  
- REST APIs  

### 🤖 AI Layer
- LLM-based interview logic  
- Prompt-engineered evaluation criteria  
- Structured scoring system (not random text output)

---

## 🧩 System Architecture (High Level)

User  
→ Frontend (React)  
→ Backend (Express API)  
→ AI Evaluation Engine  
→ Database (MongoDB)  
→ Feedback & Analytics  

Simple, scalable, and not overengineered.

---

## ⚙️ Installation & Setup

### 📦 Prerequisites
- Node.js (v18+ recommended)
- MongoDB
- Git

---

### 📥 Clone the Repository
git clone https://github.com/santanu-atta03/Intervyo  
cd intervyo

---

### 🔧 Backend Setup
cd backend  
npm install  
npm run dev  

---

### 💻 Frontend Setup
cd frontend  
npm install  
npm start  

---

### 🔑 Environment Variables

Create a `.env` file in the backend directory:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
AI_API_KEY=your_ai_api_key  

---

## 🚦 Current Status

- Core interview flow implemented  
- AI-based evaluation logic working  
- User authentication  
- Advanced analytics (in progress)  
- Multi-role interview templates (planned)

---

## 🎯 Use Cases

- Students preparing for placements  
- Developers preparing for technical interviews  
- Self-assessment before real interviews  
- Mock interview practice without human bias  

---

## 🧠 Design Philosophy

- Realism over gimmicks  
- Feedback over praise  
- Skill improvement over vanity metrics  

This platform is built to expose weaknesses, not hide them.

---

## 🤝 Contributing

Please read CONTRIBUTING.md before opening a pull request.  
Low-effort, spam, or cosmetic-only contributions will be closed.

---

## 📜 Code of Conduct

This project follows the Contributor Covenant Code of Conduct.  
Please read CODE_OF_CONDUCT.md before contributing.
