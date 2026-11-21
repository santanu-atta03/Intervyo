import express from "express";
import {
  sendOTP,
  resendOtp,
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/Auth.controller.js";

const router = express.Router();
router.use((req, res, next) => {
  req.user.loading = false;
  router.post('/logout', logout);

// Email/Password Authentication
router.post("/sendotp", sendOTP);
router.post("/sendotp/resend", resendOtp);
router.post("/register", register);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

export default router;
