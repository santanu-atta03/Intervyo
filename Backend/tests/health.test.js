import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

// Mock DB connection to avoid process.exit(1) on connection failure
// We still need this because we don't want to actually connect to Mongo
jest.unstable_mockModule("../config/db.js", () => ({
  dbConnect: jest.fn(() => console.log("Mock DB connected")),
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
