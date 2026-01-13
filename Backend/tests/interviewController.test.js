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
const interviewFindOneMock = jest.fn();
const interviewFindOneAndDeleteMock = jest.fn();

const sessionCreateMock = jest.fn();
const sessionFindOneMock = jest.fn();
const sessionDeleteOneMock = jest.fn();

jest.unstable_mockModule("../models/Interview.js", () => ({
  default: {
    create: (...args) => interviewCreateMock(...args),
    findOne: (...args) => interviewFindOneMock(...args),
    findOneAndDelete: (...args) => interviewFindOneAndDeleteMock(...args),
  },
}));

jest.unstable_mockModule("../models/InterviewSession.js", () => ({
  default: {
    create: (...args) => sessionCreateMock(...args),
    findOne: (...args) => sessionFindOneMock(...args),
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
