import User from "../models/User.model.js";

export const FREE_MONTHLY_INTERVIEW_LIMIT = 3;
export const PRO_MONTHLY_INTERVIEW_LIMIT = 25;
const QUOTA_UPDATE_RETRIES = 5;

export class InterviewQuotaExceededError extends Error {
  constructor(quota) {
    super(
      `No interviews remaining this month. Your ${quota.limit} interviews renew on the 1st.`,
    );
    this.name = "InterviewQuotaExceededError";
    this.quota = {
      plan: quota.plan,
      limit: quota.limit,
      remaining: quota.remaining,
      resetAt: quota.periodStart,
    };
  }
}

export class InterviewStartConflictError extends Error {
  constructor() {
    super("This interview is already being started or has already started.");
    this.name = "InterviewStartConflictError";
  }
}

export function getQuotaResetDate(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function hasCurrentPeriod(startDate, periodStart) {
  return (
    startDate instanceof Date &&
    startDate.getTime() === periodStart.getTime()
  );
}

function snapshotQuery(query) {
  return query.select("subscription").lean();
}

function updateQuery(query) {
  return query.select("subscription").lean();
}

function buildCompareFilter(userId, subscription) {
  const conditions = [{ _id: userId }];

  for (const [field, value] of [
    ["subscription.plan", subscription.plan],
    ["subscription.endDate", subscription.endDate],
    ["subscription.interviewsRemaining", subscription.interviewsRemaining],
    ["subscription.interviewsLimit", subscription.interviewsLimit],
    ["subscription.quotaResetAt", subscription.quotaResetAt],
  ]) {
    if (value === undefined) {
      conditions.push({ [field]: { $exists: false } });
    } else {
      conditions.push({ [field]: value });
    }
  }

  return { $and: conditions };
}

function getPlanQuota(subscription, now) {
  if (subscription.plan === "enterprise") {
    return { plan: "enterprise", limit: -1, remaining: -1 };
  }

  const hasActivePro =
    subscription.plan === "pro" &&
    subscription.endDate &&
    new Date(subscription.endDate) > now;
  const plan = hasActivePro ? "pro" : "free";
  const limit =
    plan === "pro"
      ? PRO_MONTHLY_INTERVIEW_LIMIT
      : FREE_MONTHLY_INTERVIEW_LIMIT;

  return { plan, limit };
}

async function refreshQuota(userId, now = new Date()) {
  const periodStart = getQuotaResetDate(now);

  for (let attempt = 0; attempt < QUOTA_UPDATE_RETRIES; attempt += 1) {
    const user = await snapshotQuery(User.findById(userId));
    if (!user) return null;

    const subscription = user.subscription || {};
    const planQuota = getPlanQuota(subscription, now);
    const isEnterprise = planQuota.plan === "enterprise";
    const periodIsCurrent = hasCurrentPeriod(
      subscription.quotaResetAt,
      periodStart,
    );
    const quotaIsValid =
      Number.isInteger(subscription.interviewsRemaining) &&
      (isEnterprise
        ? subscription.interviewsRemaining === -1
        : subscription.interviewsRemaining >= 0 &&
          subscription.interviewsRemaining <= planQuota.limit);
    const limitIsCurrent =
      subscription.interviewsLimit === planQuota.limit;
    const planIsCurrent = subscription.plan === planQuota.plan;

    if (
      periodIsCurrent &&
      quotaIsValid &&
      limitIsCurrent &&
      planIsCurrent
    ) {
      return {
        user,
        periodStart,
        ...planQuota,
        remaining: subscription.interviewsRemaining,
      };
    }

    const remaining = isEnterprise ? -1 : planQuota.limit;
    const updatedUser = await updateQuery(
      User.findOneAndUpdate(
        buildCompareFilter(userId, subscription),
        {
          $set: {
            "subscription.plan": planQuota.plan,
            "subscription.interviewsLimit": planQuota.limit,
            "subscription.interviewsRemaining": remaining,
            "subscription.quotaResetAt": periodStart,
          },
        },
        { new: true },
      ),
    );

    if (updatedUser) {
      return {
        user: updatedUser,
        periodStart,
        ...planQuota,
        remaining,
      };
    }
  }

  throw new Error("Could not refresh interview quota. Please retry.");
}

export async function refreshInterviewQuota(userId, now = new Date()) {
  const quota = await refreshQuota(userId, now);
  return quota?.user || null;
}

export async function consumeInterviewCredit(userId, now = new Date()) {
  for (let attempt = 0; attempt < QUOTA_UPDATE_RETRIES; attempt += 1) {
    const quota = await refreshQuota(userId, now);
    if (!quota) {
      throw new Error("The account for this interview no longer exists.");
    }

    if (quota.plan === "enterprise") return quota;
    if (quota.remaining <= 0) throw new InterviewQuotaExceededError(quota);

    const updatedUser = await updateQuery(
      User.findOneAndUpdate(
        {
          _id: userId,
          "subscription.plan": quota.plan,
          "subscription.quotaResetAt": quota.periodStart,
          "subscription.interviewsRemaining": { $gt: 0 },
          ...(quota.plan === "pro"
            ? { "subscription.endDate": { $gt: now } }
            : {}),
        },
        { $inc: { "subscription.interviewsRemaining": -1 } },
        { new: true },
      ),
    );

    if (updatedUser) {
      return {
        user: updatedUser,
        plan: quota.plan,
        limit: quota.limit,
        remaining: updatedUser.subscription.interviewsRemaining,
        periodStart: quota.periodStart,
      };
    }
  }

  const quota = await refreshQuota(userId, now);
  if (!quota) {
    throw new Error("The account for this interview no longer exists.");
  }
  throw new InterviewQuotaExceededError(quota);
}

export async function refundInterviewCredit(userId, quota) {
  if (!quota || quota.plan === "enterprise") return;

  await User.findOneAndUpdate(
    {
      _id: userId,
      "subscription.plan": quota.plan,
      "subscription.quotaResetAt": quota.periodStart,
      "subscription.interviewsRemaining": { $lt: quota.limit },
    },
    { $inc: { "subscription.interviewsRemaining": 1 } },
  );
}

export async function consumeCreditForInterview(
  InterviewModel,
  interviewId,
  userId,
) {
  const claimedInterview = await InterviewModel.findOneAndUpdate(
    {
      _id: interviewId,
      userId,
      status: "pending",
      quotaConsumed: { $ne: true },
    },
    { $set: { quotaConsumed: true } },
    { new: true },
  );

  if (!claimedInterview) throw new InterviewStartConflictError();

  try {
    return await consumeInterviewCredit(userId);
  } catch (error) {
    await InterviewModel.updateOne(
      { _id: interviewId, userId, status: "pending", quotaConsumed: true },
      { $set: { quotaConsumed: false } },
    );
    throw error;
  }
}

export async function releaseInterviewCredit(
  InterviewModel,
  interviewId,
  userId,
  quota,
) {
  await refundInterviewCredit(userId, quota);
  await InterviewModel.updateOne(
    { _id: interviewId, userId, status: "pending", quotaConsumed: true },
    { $set: { quotaConsumed: false } },
  );
}

export async function rollbackStartedInterviewCredit(
  InterviewModel,
  interviewId,
  userId,
  quota,
) {
  const interview = await InterviewModel.findOneAndUpdate(
    {
      _id: interviewId,
      userId,
      status: "in-progress",
      quotaConsumed: true,
    },
    {
      $set: { status: "pending", quotaConsumed: false },
      $unset: { rounds: 1, startTime: 1 },
    },
    { new: true },
  );

  if (interview) await refundInterviewCredit(userId, quota);
}
