import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { getLeaderboard } from "../services/gamification.service.js";
import User from "../models/User.model.js";

const router = express.Router();

// GET /api/leaderboard?period=all-time|weekly|monthly
router.get("/", authenticate, async (req, res) => {
  try {
    const { period = "all-time" } = req.query;
    const userId = req.user.id;

    // Get leaderboard
    const leaderboard = await getLeaderboard(period, 50);

    // Find user's rank
    const userIndex = leaderboard.findIndex(
      (entry) => entry.userId.toString() === userId.toString(),
    );

    const userRank = userIndex !== -1 ? leaderboard[userIndex] : null;

    res.json({
      success: true,
      leaderboard: leaderboard.slice(0, 10), // Top 10
      userRank,
      period,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
});

export default router;
