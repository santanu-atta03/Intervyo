// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from './config/Passport.js';
import authRoutes from './routes/User.route.js';
// import interviewRoutes from './routes/interview.route.js'
import interviewRoutes from './routes/InterviewRoutes.js';
import learningHubRoutes from './routes/learningHub.routes.js';
import aiRoutes from './routes/aiRoutes.js';
import dashboardRoutes from './routes/Dashboard.route.js';
import leaderboardRoutes from './routes/Leaderboard.routes.js';
import interviewSocket from './sockets/InterviewSocket.js';
import profileRoutes from './routes/Profile.route.js'
import { dbConnect } from './config/db.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/error.middleware.js';
import fileUpload from 'express-fileupload'
import http from 'http'
import { Server } from 'socket.io';
dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.use(helmet());
// ========================================
// MIDDLEWARE
// ========================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Initialize Passport
app.use(passport.initialize());

// ========================================
// DATABASE CONNECTION
// ========================================
interviewSocket(io);
dbConnect();

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai',aiRoutes)
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/learning-hub', learningHubRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// ========================================
// ERROR HANDLER
// ========================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.use(errorHandler);
// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});