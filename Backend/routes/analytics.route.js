import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getUserAnalytics,
  getSkillRadar,
} from "../controllers/Analytics.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getUserAnalytics);
router.get("/skills", getSkillRadar);

export default router;
