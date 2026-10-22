import { jest } from "@jest/globals";

const userFindById = jest.fn();
const userFindOneAndUpdate = jest.fn();

jest.unstable_mockModule("../models/User.model.js", () => ({
  default: {
    findById: (...args) => userFindById(...args),
    findOneAndUpdate: (...args) => userFindOneAndUpdate(...args),
  },
}));

const {
  consumeInterviewCredit,
  consumeCreditForInterview,
  InterviewQuotaExceededError,
  InterviewStartConflictError,
  getQuotaResetDate,
} = await import("../utils/interviewQuota.js");

let user;

function cloneUser() {
  return {
    _id: user._id,
    subscription: { ...user.subscription },
  };
}

function makeQuery(resolveValue) {
  return {
    select() {
      return this;
    },
    lean: resolveValue,
  };
}

function getPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function matchesCondition(actual, condition) {
  if (
    condition &&
    typeof condition === "object" &&
    !(condition instanceof Date)
  ) {
    return Object.entries(condition).every(([operator, expected]) => {
      if (operator === "$exists") return (actual !== undefined) === expected;
      if (operator === "$gt") return actual > expected;
      if (operator === "$lt") return actual < expected;
      return false;
    });
  }
  if (actual instanceof Date && condition instanceof Date) {
    return actual.getTime() === condition.getTime();
  }
  return actual === condition;
}

function matchesFilter(filter) {
  if (filter.$and) return filter.$and.every(matchesFilter);
  return Object.entries(filter).every(([path, condition]) => {
    if (path === "_id") return user._id === condition;
    return matchesCondition(getPath(user, path), condition);
  });
}

function applyUpdate(update) {
  for (const [path, value] of Object.entries(update.$set || {})) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((object, key) => object[key], user);
    target[lastKey] = value;
  }
  for (const [path, value] of Object.entries(update.$inc || {})) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((object, key) => object[key], user);
    target[lastKey] = (target[lastKey] || 0) + value;
  }
}

describe("monthly interview quotas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    user = {
      _id: "user-1",
      subscription: {
        plan: "free",
        interviewsRemaining: 3,
        interviewsLimit: 3,
        quotaResetAt: getQuotaResetDate(new Date("2026-10-22T12:00:00.000Z")),
      },
    };
    userFindById.mockImplementation(() =>
      makeQuery(async () => cloneUser()),
    );
    userFindOneAndUpdate.mockImplementation((filter, update) =>
      makeQuery(async () => {
        if (!matchesFilter(filter)) return null;
        applyUpdate(update);
        return cloneUser();
      }),
    );
  });

  it("decreases the Free quota by one for each interview started", async () => {
    const first = await consumeInterviewCredit("user-1");
    const second = await consumeInterviewCredit("user-1");

    expect(first).toMatchObject({ plan: "free", limit: 3, remaining: 2 });
    expect(second.remaining).toBe(1);
    expect(user.subscription.interviewsRemaining).toBe(1);
  });

  it("blocks starts at zero without allowing a negative balance", async () => {
    user.subscription.interviewsRemaining = 0;

    await expect(consumeInterviewCredit("user-1")).rejects.toBeInstanceOf(
      InterviewQuotaExceededError,
    );
    expect(user.subscription.interviewsRemaining).toBe(0);
  });

  it("renews Free credits on the first day of a new calendar month", async () => {
    user.subscription.quotaResetAt = new Date("2026-09-01T00:00:00.000Z");
    user.subscription.interviewsRemaining = 0;

    const quota = await consumeInterviewCredit(
      "user-1",
      new Date("2026-10-22T12:00:00.000Z"),
    );

    expect(quota).toMatchObject({ limit: 3, remaining: 2 });
    expect(user.subscription.quotaResetAt).toEqual(
      new Date("2026-10-01T00:00:00.000Z"),
    );
  });

  it("gives active Pro users 25 starts per month", async () => {
    user.subscription = {
      plan: "pro",
      endDate: new Date("2026-11-22T00:00:00.000Z"),
      interviewsRemaining: 25,
      interviewsLimit: 25,
      quotaResetAt: getQuotaResetDate(new Date("2026-10-22T12:00:00.000Z")),
    };

    const quota = await consumeInterviewCredit(
      "user-1",
      new Date("2026-10-22T12:00:00.000Z"),
    );

    expect(quota).toMatchObject({ plan: "pro", limit: 25, remaining: 24 });
  });

  it("falls back to the Free quota after Pro access expires", async () => {
    user.subscription = {
      plan: "pro",
      endDate: new Date("2026-10-01T00:00:00.000Z"),
      interviewsRemaining: 20,
      interviewsLimit: 25,
      quotaResetAt: getQuotaResetDate(new Date("2026-10-22T12:00:00.000Z")),
    };

    const quota = await consumeInterviewCredit(
      "user-1",
      new Date("2026-10-22T12:00:00.000Z"),
    );

    expect(quota).toMatchObject({ plan: "free", limit: 3, remaining: 2 });
    expect(user.subscription.plan).toBe("free");
  });

  it("serializes concurrent starts and never overspends the monthly quota", async () => {
    const results = await Promise.allSettled(
      Array.from({ length: 4 }, () =>
        consumeInterviewCredit("user-1"),
      ),
    );

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(3);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect(user.subscription.interviewsRemaining).toBe(0);
  });

  it("unclaims a pending interview when quota reservation is denied", async () => {
    user.subscription.interviewsRemaining = 0;
    const interviewModel = {
      findOneAndUpdate: jest.fn().mockResolvedValue({ _id: "interview-1" }),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    };

    await expect(
      consumeCreditForInterview(interviewModel, "interview-1", "user-1"),
    ).rejects.toBeInstanceOf(InterviewQuotaExceededError);

    expect(interviewModel.updateOne).toHaveBeenCalledWith(
      {
        _id: "interview-1",
        userId: "user-1",
        status: "pending",
        quotaConsumed: true,
      },
      { $set: { quotaConsumed: false } },
    );
  });

  it("does not charge an interview that another start request has claimed", async () => {
    const interviewModel = {
      findOneAndUpdate: jest.fn().mockResolvedValue(null),
      updateOne: jest.fn(),
    };

    await expect(
      consumeCreditForInterview(interviewModel, "interview-1", "user-1"),
    ).rejects.toBeInstanceOf(InterviewStartConflictError);

    expect(userFindById).not.toHaveBeenCalled();
  });
});
