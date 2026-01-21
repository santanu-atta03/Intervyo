export const quizCategories = [
  {
    id: 'hr',
    title: 'HR / Behavioral',
    description: 'Master common behavioral questions and refine your soft skills.',
    icon: 'Users', // Lucide icon name
    questions: [
      {
        id: 'h1',
        text: "When asked 'Tell me about yourself', what is the best approach?",
        options: [
          "Recite your entire resume line by line.",
          "Talk about your hobbies and personal life in detail.",
          "Summarize your professional journey, key achievements, and why you're a fit.",
          "Ask the interviewer what they want to know."
        ],
        correctAnswer: "Summarize your professional journey, key achievements, and why you're a fit.",
        explanation: "This question is an elevator pitch. Focus on your career highlights and relevance to the role."
      },
      {
        id: 'h2',
        text: "How should you handle the question 'What is your greatest weakness'?",
        options: [
          "Say you have no weaknesses.",
          "Mention a real weakness and how you are working to improve it.",
          "Say you work too hard.",
          "Refuse to answer as it's personal."
        ],
        correctAnswer: "Mention a real weakness and how you are working to improve it.",
        explanation: "Authenticity matters. Show self-awareness and a growth mindset."
      },
       {
        id: 'h3',
        text: "What is the STAR method used for?",
        options: [
            "Setting goals (Specific, Time-bound, Achievable, Realistic)",
            "Structuring answers to behavioral questions (Situation, Task, Action, Result)",
            "Analyzing stock market trends",
            "A coding algorithm"
        ],
        correctAnswer: "Structuring answers to behavioral questions (Situation, Task, Action, Result)",
        explanation: "The STAR method ensures your stories are structured, complete, and impactful."
      }
    ]
  },
  {
    id: 'tech',
    title: 'Technical Fundamentals',
    description: 'Brush up on core CS concepts, algorithms, and system design.',
    icon: 'Code',
    questions: [
      {
        id: 't1',
        text: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
        options: [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n log n)"
        ],
        correctAnswer: "O(log n)",
        explanation: "In a balanced BST, each step cuts the search space in half, leading to logarithmic time complexity."
      },
      {
        id: 't2',
        text: "Which of the following is NOT a characteristic of RESTful APIs?",
        options: [
          "Statelessness",
          "Client-Server architecture",
          "Stateful sessions stored on server",
          "Cacheability"
        ],
        correctAnswer: "Stateful sessions stored on server",
        explanation: "REST APIs are stateless; each request must contain all necessary information."
      },
      {
        id: 't3',
         text: "In React, what is the purpose of the useEffect hook?",
         options: [
             "To manage local state",
             "To handle side effects like data fetching or subscriptions",
             "To create context",
             "To optimize rendering performance directly"
         ],
         correctAnswer: "To handle side effects like data fetching or subscriptions",
         explanation: "useEffect is designed to synchronize a component with an external system (side effects)."
      }
    ]
  },
  {
    id: 'situational',
    title: 'Situational / Scenario',
    description: 'Practice navigating complex workplace scenarios and ethical dilemmas.',
    icon: 'BrainCircuit',
    questions: [
      {
        id: 's1',
        text: "You notice a critical bug in production just before leaving for the weekend. What do you do?",
        options: [
          "Ignore it and hope nobody notices until Monday.",
          "Fix it immediately without telling anyone.",
          "Assess the severity, notify the team/lead, and stay to fix or mitigation if critical.",
          "Post about it on social media."
        ],
        correctAnswer: "Assess the severity, notify the team/lead, and stay to fix or mitigation if critical.",
        explanation: "Responsibility and communication are key. escalating critical issues shows ownership."
      },
      {
        id: 's2',
        text: "A team member is constantly missing deadlines, affecting your work. How do you handle it?",
        options: [
          "Complain to the manager immediately.",
          "Do their work for them to avoid delays.",
          "Talk to them privately to understand if they need help, then escalate if needed.",
          "Publicly call them out in a meeting."
        ],
        correctAnswer: "Talk to them privately to understand if they need help, then escalate if needed.",
        explanation: "Direct, empathetic communication resolves many issues before they need management intervention."
      }
    ]
  }
];
