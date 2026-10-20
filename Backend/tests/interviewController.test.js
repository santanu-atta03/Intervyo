import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

// Mock DB connection to prevent real connections during tests
jest.unstable_mockModule("../config/db.js", () => ({
  dbConnect: jest.fn(() => {}),
}));

// Mock auth to inject a test user on protected routes
jest.unstable_mockModule("../middlewares/auth.js", () => ({
  authenticate: (req, res, next) => {
    req.user = { id: "user1" };
    next();
  },
  protect: (req, res, next) => {
    req.user = { id: "user1" };
    next();
  },
}));

// Mock Cloudinary upload helper used by createInterview
const uploadMock = jest.fn(() => Promise.resolve({ secure_url: "https://cdn.example.com/resume.pdf" }));
const deleteMock = jest.fn(async () => {});
jest.unstable_mockModule("../config/cloudinary.js", () => ({
  uploadToCloudinary: uploadMock,
  deleteFromCloudinary: deleteMock,
  upload: { single: () => (req, res, next) => next() },
  default: {},
}));

// Mock Passport config to avoid requiring real OAuth credentials
jest.unstable_mockModule("../config/Passport.js", () => ({
  default: {
    initialize: () => (req, res, next) => next(),
  },
}));

// Mock email config to avoid constructing Resend without API key
jest.unstable_mockModule("../config/email.js", () => ({
  mailSender: jest.fn(async () => ({ id: "mock-email" })),
}));

// Control mocks for Interview and InterviewSession models
const interviewCreateMock = jest.fn();
const interviewFindMock = jest.fn();
const interviewFindOneMock = jest.fn();
const interviewFindByIdAndUpdateMock = jest.fn();
const interviewFindOneAndDeleteMock = jest.fn();

const sessionCreateMock = jest.fn();
const sessionFindOneMock = jest.fn();
const sessionFindByIdAndUpdateMock = jest.fn();
const sessionDeleteOneMock = jest.fn();

jest.unstable_mockModule("../models/Interview.model.js", () => ({
  default: {
    create: (...args) => interviewCreateMock(...args),
    find: (...args) => interviewFindMock(...args),
    findOne: (...args) => interviewFindOneMock(...args),
    findByIdAndUpdate: (...args) => interviewFindByIdAndUpdateMock(...args),
    findOneAndDelete: (...args) => interviewFindOneAndDeleteMock(...args),
  },
}));

jest.unstable_mockModule("../models/InterviewSession.js", () => ({
  default: {
    create: (...args) => sessionCreateMock(...args),
    findOne: (...args) => sessionFindOneMock(...args),
    findByIdAndUpdate: (...args) => sessionFindByIdAndUpdateMock(...args),
    deleteOne: (...args) => sessionDeleteOneMock(...args),
  },
}));

// Import app after setting up module mocks
const { app, server } = await import("../index.js");

describe("InterviewController routes", () => {
  afterAll(async () => {
    await mongoose.disconnect();
    if (server) server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/interviews/all returns the authenticated user's interviews", async () => {
    const interviews = [
      {
        _id: "interview1",
        config: {
          domain: "backend",
          subDomain: "Node.js",
          difficulty: "hard",
          duration: 45,
        },
        status: "completed",
        performance: { overallScore: 82 },
      },
    ];
    const query = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(interviews),
    };
    interviewFindMock.mockReturnValue(query);

    const res = await request(app).get("/api/interviews/all");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: [
        {
          ...interviews[0],
          role: "Node.js",
          difficulty: "hard",
          duration: 45,
          overallScore: 82,
          completedAt: null,
        },
      ],
    });
    expect(interviewFindMock).toHaveBeenCalledWith({ userId: "user1" });
  });

  test("POST /api/ai/complete-interview uses config-backed interview settings", async () => {
    const session = {
      _id: "session1",
      userId: {},
      interviewId: {
        _id: "interview1",
        config: {
          domain: "backend",
          subDomain: "Node.js",
          interviewType: "technical",
          difficulty: "medium",
          duration: 15,
        },
      },
      questionEvaluations: [],
      conversation: [],
      sessionStatus: "active",
      stats: {},
    };
    sessionFindOneMock.mockReturnValue({
      populate: jest.fn().mockResolvedValue(session),
    });
    sessionFindByIdAndUpdateMock.mockReturnValue({
      populate: jest.fn().mockResolvedValue(session),
    });
    interviewFindByIdAndUpdateMock.mockResolvedValue({});

    const res = await request(app)
      .post("/api/ai/complete-interview")
      .send({ interviewId: "interview1" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate).toMatchObject({
      domain: "Node.js",
      interviewType: "TECHNICAL",
    });
    expect(res.body.data.feedback.overallScore).toBe(0);
    expect(res.body.data.feedback.technicalScore).toBe(0);
    expect(res.body.data.feedback.communicationScore).toBe(0);
    expect(res.body.data.feedback.summary).toMatch(/no answers were submitted/i);
    expect(
      sessionFindByIdAndUpdateMock.mock.calls[0][1].$set[
        "stats.totalQuestions"
      ],
    ).toBe(5);
  });

  test("POST /api/ai/complete-interview scores only questions that were answered", async () => {
    const session = {
      _id: "session2",
      userId: {},
      interviewId: {
        _id: "interview2",
        config: {
          domain: "backend",
          subDomain: "Node.js",
          interviewType: "technical",
          difficulty: "medium",
          duration: 15,
        },
      },
      questionEvaluations: [
        { userAnswer: "I identified the bottleneck and optimized it.", score: 8, category: "technical", question: "How do you optimize a system?" },
        { userAnswer: "  ", score: 10, category: "behavioral", question: "Tell me about a challenge." },
      ],
      conversation: [],
      sessionStatus: "active",
      stats: {},
    };
    sessionFindOneMock.mockReturnValue({
      populate: jest.fn().mockResolvedValue(session),
    });
    sessionFindByIdAndUpdateMock.mockReturnValue({
      populate: jest.fn().mockResolvedValue(session),
    });
    interviewFindByIdAndUpdateMock.mockResolvedValue({});

    const res = await request(app)
      .post("/api/ai/complete-interview")
      .send({ interviewId: "interview2" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.feedback.overallScore).toBe(80);
    expect(res.body.data.feedback.technicalScore).toBe(8);
    expect(res.body.data.feedback.communicationScore).toBe(0);
  });

  test("POST /api/interviews/create should return 400 when resume missing", async () => {
    const res = await request(app)
      .post("/api/interviews/create")
      .field("role", "Software Engineer")
      .field("difficulty", "medium")
      .field("duration", "30")
      .field("scheduledAt", "2026-01-13T00:00:00Z");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toMatch(/resume file is required/i);
  });

  test("POST /api/interviews/:id/start should transition scheduled interview to in-progress", async () => {
    const interviewDoc = {
      _id: "int2",
      userId: "user1",
      role: "Software Engineer",
      status: "scheduled",
      startedAt: undefined,
      save: jest.fn(async () => {}),
    };

    interviewFindOneMock.mockResolvedValue(interviewDoc);
    sessionCreateMock.mockResolvedValue({
      _id: "sess1",
      interviewId: "int2",
      userId: "user1",
      conversation: [
        {
          speaker: "ai",
          type: "greeting",
          message: "Hello! Welcome to your interview.",
        },
      ],
    });

    const res = await request(app).post("/api/interviews/int2/start");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(interviewDoc.status).toBe("in-progress");
    expect(interviewDoc.save).toHaveBeenCalled();
    expect(sessionCreateMock).toHaveBeenCalled();
  });

  describe("GET /api/ai/:interviewId/results", () => {
    test("should return 400 when interview not completed", async () => {
      interviewFindOneMock.mockResolvedValue({
        _id: "int3",
        userId: "user1",
        status: "in-progress",
      });

      const res = await request(app).get("/api/ai/int3/results");
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.message).toMatch(/not yet completed/i);
    });

    test("should return session and feedback when interview completed", async () => {
      interviewFindOneMock.mockResolvedValue({
        _id: "int4",
        userId: "user1",
        status: "completed",
        overallScore: 85,
        feedback: { summary: "Good", strengths: ["X"], improvements: ["Y"] },
        technicalScore: 80,
        communicationScore: 90,
        problemSolvingScore: 85,
      });

      sessionFindOneMock.mockResolvedValue({
        _id: "sess4",
        interviewId: "int4",
        userId: "user1",
        conversation: [],
        questionEvaluations: [],
        sessionStatus: "completed",
        overallScore: 85,
        technicalScore: 80,
        communicationScore: 90,
        problemSolvingScore: 85,
        feedback: { summary: "Good", strengths: ["X"], improvements: ["Y"] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const res = await request(app).get("/api/ai/int4/results");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data.session.interviewId).toBe("int4");
      expect(res.body.data.feedback.overallScore).toBe(85);
    });
  });
});
