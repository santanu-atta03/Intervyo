import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/Payment.controller.js";

const router = express.Router();

router.post("/orders", authenticate, createPaymentOrder);
router.post("/verify", authenticate, verifyPayment);

export default router;
