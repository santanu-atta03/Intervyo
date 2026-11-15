import { jest } from "@jest/globals";

const aggregate = jest.fn();
const countDocuments = jest.fn();

jest.unstable_mockModule("../models/Chatbot.model.js", () => ({
  default: { aggregate, countDocuments },
}));

const { RATE_LIMITS } = await import("../config/aiconfig.js");
const {
  chatbotConversationRateLimit,
  chatbotRateLimit,
  validateMessage,
} = await import("../middlewares/chatbot.middleware.js");

const userId = "64b000000000000000000001";

function createResponse() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
    set: jest.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.set.mockReturnValue(res);
  return res;
}

describe("chatbot middleware", () => {
  beforeEach(() => {
    aggregate.mockResolvedValue([{ hourlyCount: 0, dailyCount: 0 }]);
    countDocuments.mockResolvedValue(0);
  });

  it("allows valid messages and attaches rolling usage counts", async () => {
    const req = { user: { id: userId }, body: { message: "Help me practice" } };
    const res = createResponse();
    const next = jest.fn();

    await validateMessage(req, res, next);
    await chatbotRateLimit(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(req.chatbotUsage).toEqual({
      hourlyCount: 0,
      dailyCount: 0,
      hourlyLimit: RATE_LIMITS.maxMessagesPerHour,
      dailyLimit: RATE_LIMITS.maxMessagesPerDay,
    });
  });

  it("returns 429 with usage and Retry-After when the hourly limit is reached", async () => {
    aggregate.mockResolvedValue([
      {
        hourlyCount: RATE_LIMITS.maxMessagesPerHour,
        dailyCount: RATE_LIMITS.maxMessagesPerHour,
      },
    ]);
    const req = { user: { id: userId }, body: { message: "One more" } };
    const res = createResponse();
    const next = jest.fn();

    await chatbotRateLimit(req, res, next);

    expect(res.set).toHaveBeenCalledWith("Retry-After", "3600");
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        retryAfter: 3600,
        usage: expect.objectContaining({
          hourlyCount: RATE_LIMITS.maxMessagesPerHour,
        }),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("fails closed when the usage store is unavailable", async () => {
    aggregate.mockRejectedValue(new Error("database unavailable"));
    const req = { user: { id: userId }, body: { message: "Hello" } };
    const res = createResponse();
    const next = jest.fn();

    await chatbotRateLimit(req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(next).not.toHaveBeenCalled();
  });

  it("limits conversation creation per user and day", async () => {
    countDocuments.mockResolvedValue(RATE_LIMITS.maxConversationsPerDay);
    const req = { user: { id: userId } };
    const res = createResponse();
    const next = jest.fn();

    await chatbotConversationRateLimit(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.set).toHaveBeenCalledWith("Retry-After", "86400");
    expect(next).not.toHaveBeenCalled();
  });
});
