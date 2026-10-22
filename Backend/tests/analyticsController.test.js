import { jest } from "@jest/globals";

jest.unstable_mockModule("../models/Interview.model.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../models/User.model.js", () => ({
  default: { findById: jest.fn() },
}));

const { default: Interview } = await import("../models/Interview.model.js");
const { default: User } = await import("../models/User.model.js");
const { getSkillRadar, getUserAnalytics } = await import(
  "../controllers/Analytics.controller.js"
);

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

const createInterview = () => ({
  _id: "interview-1",
  userId: "user-1",
  status: "completed",
  config: {
    domain: "Backend",
    difficulty: "hard",
    interviewType: "coding",
  },
  endTime: new Date(),
  createdAt: new Date(),
  totalDuration: 1200,
  performance: {
    overallScore: 0,
    categoryScores: {
      technical: 0,
      communication: 0,
      problemSolving: 0,
      confidence: 0,
    },
  },
  results: {
    summary: { overallScore: 86 },
    categoryBreakdown: {
      technical: { score: 88 },
      communication: { score: 82, confidence: 79 },
      problemSolving: { score: 90 },
    },
  },
});

describe("Analytics controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses completed interview timestamps and result scores when performance scores are unset", async () => {
    const interview = createInterview();
    Interview.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([interview]),
      }),
    });
    User.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        stats: { xpPoints: 120, level: 2, streak: 3 },
      }),
    });

    const response = createResponse();
    await getUserAnalytics(
      { user: { id: "user-1" }, query: { timeRange: "30" } },
      response,
    );

    const query = Interview.find.mock.calls[0][0];
    expect(query.$or[0]).toHaveProperty("endTime.$gte");
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          summary: {
            totalInterviews: 1,
            avgScore: 86,
            bestScore: 86,
            totalTime: 1200,
          },
          categoryScores: {
            technical: 88,
            communication: 82,
            problemSolving: 90,
            confidence: 79,
          },
          performanceTrend: [
            expect.objectContaining({
              date: interview.endTime,
              score: 86,
            }),
          ],
        }),
      }),
    );
  });

  it("uses result scores in the skill radar when performance scores are unset", async () => {
    Interview.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([createInterview()]),
        }),
      }),
    });

    const response = createResponse();
    await getSkillRadar({ user: { id: "user-1" } }, response);

    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: expect.arrayContaining([
        { skill: "Technical Knowledge", score: 88, fullMark: 100 },
        { skill: "Communication", score: 82, fullMark: 100 },
        { skill: "Problem Solving", score: 90, fullMark: 100 },
        { skill: "Code Quality", score: 86, fullMark: 100 },
      ]),
    });
  });
});
