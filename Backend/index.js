// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import passport from "./config/Passport.js";
import authRoutes from "./routes/User.route.js";

import interviewRoutes from "./routes/InterviewRoutes.js";
import learningHubRoutes from "./routes/learningHub.routes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/Dashboard.route.js";
import leaderboardRoutes from "./routes/Leaderboard.routes.js";
import companyRecommendationRoutes from './routes/companyRecommendation.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import questionDatabaseRoutes from './routes/questionDatabase.routes.js';
import buddyMatchRoutes from './routes/buddyMatch.routes.js';
import interviewSocket from "./sockets/InterviewSocket.js";
import achievementRoutes from "./routes/achievement.routes.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import notificationRoutes from "./routes/notification.route.js";
import blogRoutes from "./routes/blog.routes.js";
import profileRoutes from "./routes/Profile.route.js";
import emotionRoutes from "./routes/emotion.routes.js";
import analyticsRoutes from "./routes/analytics.route.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import contactRoutes from './routes/contact.routes.js';
import { dbConnect } from "./config/db.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const server = http.createServer(app);
const socketOrigins = [
  "https://intervyo.xyz",
  "https://www.intervyo.xyz",
  "https://intervyo-sage.vercel.app",
];

const io = new Server(server, {
  cors: {
    origin: socketOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(helmet());
// ========================================
// MIDDLEWARE
// ========================================
const allowedOrigins = [
  "https://intervyo.xyz",
  "https://www.intervyo.xyz",
  "https://intervyo-sage.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

// Initialize Passport
app.use(passport.initialize());

// ========================================
// DATABASE CONNECTION
// ========================================
interviewSocket(io);
dbConnect();

app.use('/api/contact', contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/learning-hub", learningHubRoutes);
app.use("/api", blogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use('/api/recommendations', companyRecommendationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/questions', questionDatabaseRoutes);
app.use('/api/buddy', buddyMatchRoutes);

// Emotion metrics routes
app.use("/api/interviews", emotionRoutes);

// Health check with service status
app.get("/api/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {
      database: "unknown",
      server: "ok"
    }
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    health.services.database = dbState === 1 ? "connected" : "disconnected";
    
    if (dbState !== 1) {
      health.status = "degraded";
      return res.status(503).json(health);
    }
    
    res.json(health);
  } catch (error) {
    health.status = "error";
    health.error = error.message;
    res.status(503).json(health);
  }
});

// ========================================
// ERROR HANDLER
// ========================================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use(errorHandler);
// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    // Close server to stop accepting new connections
    server.close(() => {
      console.log('HTTP server closed');
    });

    // Close database connection
    await mongoose.connection.close(false);
    console.log('MongoDB connection closed');

    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export { app, server };
