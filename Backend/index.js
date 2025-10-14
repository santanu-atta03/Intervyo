// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from './config/Passport.js';
import authRoutes from './routes/User.route.js';
import interviewRoutes from './routes/interview.route.js'
import profileRoutes from './routes/Profile.route.js'
import { dbConnect } from './config/db.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/error.middleware.js';
dotenv.config();

const app = express();
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

// Initialize Passport
app.use(passport.initialize());

// ========================================
// DATABASE CONNECTION
// ========================================

dbConnect();

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/profile', profileRoutes);

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});