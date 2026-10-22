import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      sparse: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ["pro"],
      default: "pro",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "processing", "paid"],
      default: "created",
      index: true,
    },
    processingAt: Date,
    accessStart: Date,
    accessEnd: Date,
    paidAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
