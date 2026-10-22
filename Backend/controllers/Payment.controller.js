import { createHmac, timingSafeEqual, randomUUID } from "crypto";
import axios from "axios";
import Payment from "../models/Payment.model.js";
import User from "../models/User.model.js";
import {
  PRO_MONTHLY_INTERVIEW_LIMIT,
  getQuotaResetDate,
} from "../utils/interviewQuota.js";

const PAYMENT_OPTIONS = {
  monthly: { amount: 99900, label: "Pro monthly access" },
  yearly: { amount: 958800, label: "Pro yearly access" },
};

const razorpayCredentials = () => ({
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
});

function compareSignatures(expected, received) {
  if (
    typeof received !== "string" ||
    !/^[a-f\d]{64}$/i.test(received) ||
    expected.length !== received.length
  ) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(received, "hex"),
  );
}

function getOrderSignature(orderId, paymentId, keySecret) {
  return createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

function getWebhookSignature(body, secret) {
  return createHmac("sha256", secret).update(body).digest("hex");
}

function addBillingPeriod(date, billingCycle) {
  const result = new Date(date);
  const originalDay = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(
    result.getUTCMonth() + (billingCycle === "monthly" ? 1 : 12),
  );
  const lastDayOfMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(originalDay, lastDayOfMonth));
  return result;
}

function getRazorpayAuth(keyId, keySecret) {
  return { username: keyId, password: keySecret };
}

async function applyPaidEntitlement(payment) {
  let accessStart = payment.accessStart;
  let accessEnd = payment.accessEnd;

  if (!accessStart || !accessEnd) {
    const user = await User.findById(payment.userId).select("subscription");
    if (!user) throw new Error("The account for this payment no longer exists.");

    const now = new Date();
    const currentEnd = user.subscription?.endDate;
    accessStart =
      user.subscription?.plan === "pro" && currentEnd && currentEnd > now
        ? currentEnd
        : now;
    accessEnd = addBillingPeriod(accessStart, payment.billingCycle);

    await Payment.updateOne(
      { _id: payment._id, status: "processing" },
      { $set: { accessStart, accessEnd } },
    );
  }

  const currentUser = await User.findById(payment.userId).select("subscription");
  if (!currentUser) {
    throw new Error("The account for this payment no longer exists.");
  }
  const subscription = currentUser.subscription || {};
  const hasActivePro =
    subscription.plan === "pro" &&
    subscription.endDate &&
    subscription.endDate > new Date();
  const hasCurrentProQuota =
    hasActivePro &&
    subscription.interviewsLimit === PRO_MONTHLY_INTERVIEW_LIMIT &&
    Number.isInteger(subscription.interviewsRemaining) &&
    subscription.interviewsRemaining >= 0 &&
    subscription.interviewsRemaining <= PRO_MONTHLY_INTERVIEW_LIMIT &&
    subscription.quotaResetAt &&
    new Date(subscription.quotaResetAt).getTime() ===
      getQuotaResetDate(new Date()).getTime();

  const subscriptionUpdates = {
    "subscription.plan": "pro",
    "subscription.startDate": accessStart,
  };
  if (!hasCurrentProQuota) {
    subscriptionUpdates["subscription.interviewsLimit"] =
      PRO_MONTHLY_INTERVIEW_LIMIT;
    subscriptionUpdates["subscription.interviewsRemaining"] =
      PRO_MONTHLY_INTERVIEW_LIMIT;
    subscriptionUpdates["subscription.quotaResetAt"] =
      getQuotaResetDate(new Date());
  }

  const updatedUser = await User.findByIdAndUpdate(
    payment.userId,
    {
      $set: subscriptionUpdates,
      $max: { "subscription.endDate": accessEnd },
    },
    { new: true },
  )
    .select("-password -resetPasswordToken -resetPasswordExpire")
    .lean();

  if (!updatedUser) {
    throw new Error("The account for this payment no longer exists.");
  }

  await Payment.updateOne(
    { _id: payment._id, status: "processing" },
    {
      $set: {
        status: "paid",
        paymentId: payment.paymentId,
        paidAt: new Date(),
      },
    },
  );

  return updatedUser;
}

async function claimPayment(payment, paymentId) {
  const staleProcessingCutoff = new Date(Date.now() - 5 * 60 * 1000);
  return Payment.findOneAndUpdate(
    {
      _id: payment._id,
      $or: [
        { status: "created" },
        { status: "processing", processingAt: { $lt: staleProcessingCutoff } },
      ],
    },
    {
      $set: {
        status: "processing",
        processingAt: new Date(),
        paymentId,
      },
    },
    { new: true },
  );
}

async function validateCapturedPayment(order, paymentId, credentials) {
  let { data } = await axios.get(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
    { auth: getRazorpayAuth(credentials.keyId, credentials.keySecret) },
  );

  if (data.status === "authorized") {
    ({ data } = await axios.post(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/capture`,
      { amount: order.amount, currency: order.currency },
      { auth: getRazorpayAuth(credentials.keyId, credentials.keySecret) },
    ));
  }

  if (
    data.order_id !== order.orderId ||
    data.amount !== order.amount ||
    data.currency !== order.currency ||
    data.status !== "captured"
  ) {
    throw new Error("Razorpay has not confirmed this payment as captured.");
  }
}

export const createPaymentOrder = async (req, res) => {
  try {
    const credentials = razorpayCredentials();
    if (!credentials.keyId || !credentials.keySecret) {
      return res.status(503).json({
        success: false,
        message: "Payments are not configured yet.",
      });
    }

    const { billingCycle } = req.body;
    const option = PAYMENT_OPTIONS[billingCycle];
    if (!option) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid Pro billing period.",
      });
    }

    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const receipt = randomUUID();
    const { data: razorpayOrder } = await axios.post(
      "https://api.razorpay.com/v1/orders",
      {
        amount: option.amount,
        currency: "INR",
        receipt,
        notes: {
          userId: req.user.id,
          plan: "pro",
          billingCycle,
        },
      },
      { auth: getRazorpayAuth(credentials.keyId, credentials.keySecret) },
    );

    await Payment.create({
      userId: req.user.id,
      orderId: razorpayOrder.id,
      billingCycle,
      amount: option.amount,
      currency: "INR",
    });

    res.status(201).json({
      success: true,
      data: {
        keyId: credentials.keyId,
        orderId: razorpayOrder.id,
        amount: option.amount,
        currency: "INR",
        name: user.name,
        email: user.email,
        description: option.label,
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error.response?.data || error);
    res.status(502).json({
      success: false,
      message: "Could not start checkout. Please try again.",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { keySecret } = razorpayCredentials();
    if (!keySecret) {
      return res.status(503).json({
        success: false,
        message: "Payments are not configured yet.",
      });
    }

    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = req.body;
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required.",
      });
    }

    const payment = await Payment.findOne({
      orderId,
      userId: req.user.id,
    });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found.",
      });
    }

    const expectedSignature = getOrderSignature(orderId, paymentId, keySecret);
    if (!compareSignatures(expectedSignature, signature)) {
      return res.status(400).json({
        success: false,
        message: "Payment signature is invalid.",
      });
    }

    if (payment.status === "paid") {
      const user = await User.findById(req.user.id)
        .select("-password -resetPasswordToken -resetPasswordExpire")
        .lean();
      return res.json({ success: true, message: "Payment already verified.", user });
    }

    const credentials = razorpayCredentials();
    await validateCapturedPayment(payment, paymentId, credentials);
    const claimedPayment = await claimPayment(payment, paymentId);

    if (!claimedPayment) {
      const latestPayment = await Payment.findById(payment._id);
      if (latestPayment?.status === "paid") {
        const user = await User.findById(req.user.id)
          .select("-password -resetPasswordToken -resetPasswordExpire")
          .lean();
        return res.json({ success: true, message: "Payment already verified.", user });
      }
      return res.status(409).json({
        success: false,
        message: "Payment confirmation is still processing. Please retry shortly.",
      });
    }

    const user = await applyPaidEntitlement(claimedPayment);
    res.json({
      success: true,
      message: "Payment verified and Pro access is active.",
      user,
    });
  } catch (error) {
    console.error("Verify payment error:", error.response?.data || error);
    res.status(502).json({
      success: false,
      message: "We could not confirm the payment yet. Please retry or contact support.",
    });
  }
};

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(503).json({ success: false, message: "Webhook is not configured." });
    }

    const signature = req.headers["x-razorpay-signature"];
    const expectedSignature = getWebhookSignature(req.body, webhookSecret);
    if (!compareSignatures(expectedSignature, signature)) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature." });
    }

    const event = JSON.parse(req.body.toString("utf8"));
    if (event.event !== "payment.captured") {
      return res.json({ success: true, message: "Event ignored." });
    }

    const providerPayment = event.payload?.payment?.entity;
    const orderId = providerPayment?.order_id;
    const paymentId = providerPayment?.id;
    if (
      !orderId ||
      !paymentId ||
      providerPayment.status !== "captured"
    ) {
      return res.status(400).json({ success: false, message: "Payment details missing from webhook." });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) return res.json({ success: true, message: "Unknown order ignored." });
    if (payment.status === "paid") return res.json({ success: true });

    if (
      providerPayment.amount !== payment.amount ||
      providerPayment.currency !== payment.currency
    ) {
      return res.status(400).json({ success: false, message: "Webhook payment amount does not match the order." });
    }
    const claimedPayment = await claimPayment(payment, paymentId);
    if (!claimedPayment) {
      return res.status(500).json({
        success: false,
        message: "Payment confirmation is being processed.",
      });
    }
    await applyPaidEntitlement(claimedPayment);

    res.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error.response?.data || error);
    res.status(500).json({ success: false, message: "Webhook processing failed." });
  }
};
