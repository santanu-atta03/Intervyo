import { jest } from "@jest/globals";

const interview = {
  _id: "interview-1",
  config: {
    subDomain: "Node.js",
    difficulty: "easy",
    duration: 15,
    interviewType: "technical",
  },
  customQuestionsList: [],
  rounds: [
    {
      questions: [
        {
          questionId: "question-1",
          question: "Explain closures.",
          type: "technical",
          difficulty: "easy",
          expectedAnswer: "Closures retain access to lexical scope.",
          evaluationCriteria: ["Accuracy", "Clarity"],
        },
        {
          questionId: "question-2",
          question: "Describe a project challenge.",
          type: "behavioral",
          difficulty: "easy",
          expectedAnswer: "Use the STAR method.",
          evaluationCriteria: ["Relevance", "Structure"],
        },
      ],
      answers: [],
    },
  ],
  performance: {
    overallScore: 0,
    questionsAnswered: 0,
    categoryScores: { technical: 0, communication: 0 },
  },
  save: jest.fn(async () => {}),
};
const session = {
  _id: "session-1",
  interviewId: interview,
  conversation: [],
  questionEvaluations: [],
  save: jest.fn(async () => {}),
};
const interviewFindById = jest.fn();
const sessionFindById = jest.fn();
const evaluateAnswer = jest.fn();
const evaluateReferenceAnswer = jest.fn();

jest.unstable_mockModule("../models/Interview.model.js", () => ({
  default: { findById: interviewFindById },
}));

jest.unstable_mockModule("../models/InterviewSession.js", () => ({
  default: { findById: sessionFindById },
}));

jest.unstable_mockModule("../config/openai.js", () => ({
  evaluateAnswer,
  generateNextQuestion: jest.fn(async () => {
    throw new Error("AI service unavailable");
  }),
}));

jest.unstable_mockModule("../services/answerEvaluator.js", () => ({
  default: {
    evaluateAnswer: (...args) => evaluateReferenceAnswer(...args),
  },
}));

jest.unstable_mockModule("../config/elevenlabs.js", () => ({
  textToSpeech: jest.fn(async () => null),
}));

jest.unstable_mockModule("../services/gamification.service.js", () => ({
  calculateXP: jest.fn(),
  checkAndAwardBadges: jest.fn(),
  updateUserStreak: jest.fn(),
}));

const { default: attachInterviewSocket } = await import(
  "../sockets/InterviewSocket.js"
);

describe("interview socket startup", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    session.conversation = [];
    session.questionEvaluations = [];
    interview.rounds[0].answers = [];
    interview.performance = {
      overallScore: 0,
      questionsAnswered: 0,
      categoryScores: { technical: 0, communication: 0 },
    };
    interviewFindById.mockResolvedValue(interview);
    sessionFindById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(session),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("speaks only the first question selected for the interview", async () => {
    const socketHandlers = new Map();
    const emittedMessages = [];
    const socket = {
      id: "socket-1",
      on: jest.fn((event, handler) => socketHandlers.set(event, handler)),
      emit: jest.fn((event, payload) => {
        if (event === "ai-message") emittedMessages.push(payload);
      }),
      join: jest.fn(),
    };
    const io = {
      on: jest.fn((event, handler) => {
        if (event === "connection") handler(socket);
      }),
      to: jest.fn(),
    };

    attachInterviewSocket(io);
    await socketHandlers.get("candidate-ready")({
      sessionId: session._id,
      interviewId: interview._id,
      paused: false,
    });
    await jest.advanceTimersByTimeAsync(3000);

    expect(emittedMessages.map(({ type }) => type)).toEqual(["question"]);
    expect(emittedMessages[0]).toMatchObject({
      message: "Explain closures.",
      questionType: "technical",
      questionIndex: 0,
      requiresCode: false,
    });
    expect(session.save).toHaveBeenCalled();
  });

  test("evaluates the transcript against the stored reference answer", async () => {
    evaluateReferenceAnswer.mockResolvedValue({
      overallScore: 80,
      feedback: "Clear answer",
      strengths: ["Communication"],
      improvements: ["Add examples"],
      categoryScores: { accuracy: 80, clarity: 80, completeness: 80, depth: 80 },
    });

    const socketHandlers = new Map();
    const emittedMessages = [];
    const socket = {
      id: "socket-1",
      on: jest.fn((event, handler) => socketHandlers.set(event, handler)),
      emit: jest.fn((event, payload) => {
        if (event === "ai-message") emittedMessages.push(payload);
      }),
      join: jest.fn(),
    };
    const io = {
      on: jest.fn((event, handler) => {
        if (event === "connection") handler(socket);
      }),
      to: jest.fn(),
    };

    attachInterviewSocket(io);
    await socketHandlers.get("candidate-ready")({
      sessionId: session._id,
      interviewId: interview._id,
      paused: false,
    });
    await jest.advanceTimersByTimeAsync(3000);

    const firstQuestion = emittedMessages.find(
      ({ type }) => type === "question",
    );
    expect(firstQuestion).toBeDefined();

    await socketHandlers.get("candidate-answer")(
      {
        sessionId: session._id,
        answer: "I solved this by measuring the issue and improving the system.",
        questionIndex: firstQuestion.questionIndex,
      },
      jest.fn(),
    );

    const questions = emittedMessages.filter(({ type }) => type === "question");
    expect(questions).toHaveLength(2);
    expect(questions[1].questionIndex).toBe(1);
    expect(questions[1].message).toBe("Describe a project challenge.");
    expect(evaluateReferenceAnswer).toHaveBeenCalledTimes(1);
    expect(evaluateReferenceAnswer.mock.calls[0][0].expectedAnswer).toBe(
      "Closures retain access to lexical scope.",
    );
    expect(interview.rounds[0].answers[0].answer).toBe(
      "I solved this by measuring the issue and improving the system.",
    );
  });
});
