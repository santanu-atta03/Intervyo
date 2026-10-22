import { createHmac } from "crypto";
import { jest } from "@jest/globals";

jest.unstable_mockModule("axios", () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));
jest.unstable_mockModule("../models/Payment.model.js", () => ({
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
  },
}));
jest.unstable_mockModule("../models/User.model.js", () => ({
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const { default: axios } = await import("axios");
const { default: Payment } = await import("../models/Payment.model.js");
const { default: User } = await import("../models/User.model.js");
const { createPaymentOrder, verifyPayment } = await import(
  "../controllers/Payment.controller.js"
);

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("Payment controller", () => {
  const originalEnv = {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RAZORPAY_KEY_ID = "rzp_test_key";
    process.env.RAZORPAY_KEY_SECRET = "test-secret";
  });

  afterAll(() => {
    if (originalEnv.keyId === undefined) delete process.env.RAZORPAY_KEY_ID;
    else process.env.RAZORPAY_KEY_ID = originalEnv.keyId;
    if (originalEnv.keySecret === undefined) delete process.env.RAZORPAY_KEY_SECRET;
    else process.env.RAZORPAY_KEY_SECRET = originalEnv.keySecret;
  });

  it("creates an order using server-controlled yearly pricing", async () => {
    axios.post.mockResolvedValue({
      data: { id: "order_yearly", amount: 958800, currency: "INR" },
    });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
      }),
    });
    Payment.create.mockResolvedValue({});

    const response = createResponse();
    await createPaymentOrder(
      { user: { id: "user-1" }, body: { billingCycle: "yearly" } },
      response,
    );

    expect(axios.post.mock.calls[0][1]).toEqual(
      expect.objectContaining({ amount: 958800, currency: "INR" }),
    );
    expect(Payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        orderId: "order_yearly",
        billingCycle: "yearly",
        amount: 958800,
      }),
    );
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it("rejects client-supplied billing options outside the supported cycles", async () => {
    const response = createResponse();
    await createPaymentOrder(
      { user: { id: "user-1" }, body: { billingCycle: "free" } },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("verifies captured payment before granting Pro access", async () => {
    const accessStart = new Date();
    const payment = {
      _id: "payment-1",
      userId: "user-1",
      orderId: "order_123",
      paymentId: "pay_123",
      billingCycle: "monthly",
      amount: 99900,
      currency: "INR",
      status: "created",
    };
    const signature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${payment.orderId}|${payment.paymentId}`)
      .digest("hex");
    const updatedUser = {
      _id: "user-1",
      subscription: {
        plan: "pro",
        interviewsRemaining: 25,
        interviewsLimit: 25,
      },
    };

    Payment.findOne.mockResolvedValue(payment);
    axios.get.mockResolvedValue({
      data: {
        id: payment.paymentId,
        order_id: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: "authorized",
      },
    });
    axios.post.mockResolvedValue({
      data: {
        id: payment.paymentId,
        order_id: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: "captured",
      },
    });
    Payment.findOneAndUpdate.mockResolvedValue({
      ...payment,
      status: "processing",
      accessStart,
    });
    Payment.updateOne.mockResolvedValue({});
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        subscription: { plan: "free", interviewsRemaining: 1 },
      }),
    });
    User.findByIdAndUpdate.mockReturnValue({
      select: () => ({ lean: jest.fn().mockResolvedValue(updatedUser) }),
    });

    const response = createResponse();
    await verifyPayment(
      {
        user: { id: "user-1" },
        body: {
          razorpay_order_id: payment.orderId,
          razorpay_payment_id: payment.paymentId,
          razorpay_signature: signature,
        },
      },
      response,
    );

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({
        $set: expect.objectContaining({
          "subscription.plan": "pro",
          "subscription.interviewsRemaining": 25,
          "subscription.interviewsLimit": 25,
          "subscription.quotaResetAt": expect.any(Date),
        }),
        $max: expect.objectContaining({
          "subscription.endDate": expect.any(Date),
        }),
      }),
      { new: true },
    );
    expect(axios.post).toHaveBeenCalledWith(
      `https://api.razorpay.com/v1/payments/${payment.paymentId}/capture`,
      { amount: payment.amount, currency: payment.currency },
      { auth: { username: "rzp_test_key", password: "test-secret" } },
    );
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, user: updatedUser }),
    );
  });

  it("rejects invalid signatures without contacting Razorpay or granting access", async () => {
    Payment.findOne.mockResolvedValue({
      _id: "payment-1",
      userId: "user-1",
      orderId: "order_123",
      amount: 99900,
      currency: "INR",
    });

    const response = createResponse();
    await verifyPayment(
      {
        user: { id: "user-1" },
        body: {
          razorpay_order_id: "order_123",
          razorpay_payment_id: "pay_forged",
          razorpay_signature: "invalid",
        },
      },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(axios.get).not.toHaveBeenCalled();
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});
