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
    interviewFindById.mockResolvedValue(interview);
    sessionFindById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(session),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("sends the first question when the candidate is ready", async () => {
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

    expect(emittedMessages.map(({ type }) => type)).toEqual([
      "greeting",
      "question",
    ]);
    expect(emittedMessages[1]).toMatchObject({
      questionType: "technical",
      questionIndex: 0,
    });
    expect(session.save).toHaveBeenCalled();
  });

  test("sends the next question after an answer is submitted and evaluated", async () => {
    evaluateAnswer.mockResolvedValue({
      score: 8,
      review: "Clear answer",
      strength: "Communication",
      improvement: "Add examples",
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
        question: firstQuestion.message,
        answer: "I solved this by measuring the issue and improving the system.",
        questionIndex: firstQuestion.questionIndex,
        category: firstQuestion.questionType,
      },
      jest.fn(),
    );
    await jest.advanceTimersByTimeAsync(800);

    const questions = emittedMessages.filter(({ type }) => type === "question");
    expect(questions).toHaveLength(2);
    expect(questions[1].questionIndex).toBe(1);
    expect(evaluateAnswer).toHaveBeenCalledTimes(1);
  });
});
