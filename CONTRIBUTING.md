# Contributing to Intervyo

Intervyo is built with one goal:  
**simulate real interviews and give brutally honest feedback.**

If your contribution does not move the project closer to that goal, it will not be merged.

---

## 🚫 Before You Contribute

Do NOT open a PR if:

- You haven’t read the README  
- You are adding features just to look fancy  
- You are dumping AI-generated code without understanding it  
- You are fixing formatting and calling it a contribution  

This is not a playground repo.

---

## ✅ What We Actually Want

Good contributions include:

- Improving interview realism  
- Better evaluation logic  
- Performance optimizations  
- Cleaner UI without bloat  
- Bug fixes with clear reasoning  
- Well-documented backend logic  

---

## 🛠 Tech Stack

- **Frontend:** React + Tailwind  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **AI Layer:** LLM-based evaluation logic  

Stick to the stack.  
Don’t introduce unnecessary frameworks.

---

## 📁 Project Structure (Advanced Features)

### Backend
```
Backend/
├── models/
│   ├── InterviewCalendar.model.js    # Interview scheduling
│   ├── RealQuestion.model.js         # Crowdsourced questions
│   ├── BuddyMatch.model.js           # Buddy matching & study groups
│   └── Company.model.js              # Enhanced with metrics
├── services/
│   ├── companyRecommendation.service.js
│   ├── calendarService.js
│   ├── questionDatabase.service.js
│   └── buddyMatching.service.js
├── controllers/
│   ├── CompanyRecommendation.controller.js
│   ├── Calendar.controller.js
│   ├── QuestionDatabase.controller.js
│   └── BuddyMatch.controller.js
└── routes/
    ├── companyRecommendation.routes.js
    ├── calendar.routes.js
    ├── questionDatabase.routes.js
    └── buddyMatch.routes.js
```

### Frontend
```
Frontend/src/
├── pages/
│   └── AdvancedFeaturesDashboard.jsx
└── services/operations/
    ├── recommendationAPI.js
    ├── calendarAPI.js
    ├── questionAPI.js
    └── buddyAPI.js
```

---

## 🧩 How to Contribute

### 1. Star the repo
### 2. Fork the Repository
```bash
git fork https://github.com/santanu-atta03/intervyo.git

⚠️ ECWoC 2026 RULES

1. Only Pull Requests with the label `ECWoC26` will be considered for scoring.
2. PRs without the label will not be reviewed for ECWoC points.
3. Spam, low-effort, or documentation-only PRs may be closed without review.
4. One meaningful PR per contributor at a time.


Just tell me the tone you want:  
**strict / balanced / very strict** 😈


