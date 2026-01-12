import express from "express";
import {
  sendOTP,
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/Auth.controller.js";

const router = express.Router();

// Email/Password Authentication
router.post("/sendotp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

export default router;
