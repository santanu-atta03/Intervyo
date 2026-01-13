import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

// Mock DB connection to avoid process.exit(1) on connection failure
// We still need this because we don't want to actually connect to Mongo
jest.unstable_mockModule("../config/db.js", () => ({
  dbConnect: jest.fn(() => console.log("Mock DB connected")),
}));

// Mock auth to avoid importing the real middleware with syntax issues
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

// Mock Passport config to avoid real OAuth strategy setup
jest.unstable_mockModule("../config/Passport.js", () => ({
  default: {
    initialize: () => (req, res, next) => next(),
  },
}));

// Mock email config to bypass Resend
jest.unstable_mockModule("../config/email.js", () => ({
  mailSender: jest.fn(async () => ({ id: "mock-email" })),
}));

// Mock cloudinary upload middleware (used in various routes)
jest.unstable_mockModule("../config/cloudinary.js", () => ({
  uploadToCloudinary: jest.fn(async () => ({ secure_url: "https://cdn.example.com/x.png" })),
  deleteFromCloudinary: jest.fn(async () => {}),
  upload: { single: () => (req, res, next) => next() },
  default: {},
}));

// Import app after mocking
const { app, server } = await import("../index.js");

describe("Health Check Endpoint", () => {
  afterAll(async () => {
    await mongoose.disconnect();
    if (server) server.close();
  });

  it("should return 200 and success message", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "Server is running!");
  });
});
