import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import User from '../models/User.model.js';
import Interview from '../models/Interview.model.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const BASE = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 5000}`; // not used
const API_BASE = process.env.API_BASE || `http://localhost:${process.env.PORT || 5000}/api/interviews`;

async function main() {
  if (!process.env.MONGODB_URL) {
    console.error('MONGODB_URL not set in env');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not set in env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connected to DB');

  // Create/find test profile + user
  let user = await User.findOne({ email: 'test-emotion@example.com' });
  if (!user) {
    // Create minimal profile object reference by creating a dummy Profile doc if Profile model exists
    try {
      const Profile = (await import('../models/Profile.model.js')).default;
      const profile = await Profile.create({ fullName: 'Test Emotion' });
      user = await User.create({ email: 'test-emotion@example.com', name: 'Test Emotion', password: 'password123', profile: profile._id });
    } catch (e) {
      // Profile model may require more fields; fall back to creating user with null profile (might fail)
      user = await User.create({ email: 'test-emotion@example.com', name: 'Test Emotion', password: 'password123', profile: null });
    }
    console.log('Created test user:', user._id.toString());
  } else {
    console.log('Found test user:', user._id.toString());
  }

  // Create interview
  const interview = await Interview.create({ userId: user._id, config: { domain: 'test', subDomain: 'test', interviewType: 'behavioral' } });
  console.log('Created interview:', interview._id.toString());

  // Sign token
  const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  console.log('Token:', token);

  // Post a sample metric
  const sample = {
    emotions: {
      neutral: 0.6,
      happy: 0.2,
      sad: 0.0,
      angry: 0.0,
      fearful: 0.0,
      disgusted: 0.0,
      surprised: 0.2
    },
    confidenceScore: 0.72,
    timestamp: Date.now()
  };

  try {
    const res = await axios.post(`${API_BASE}/${interview._id}/emotion-metrics`, sample, { headers: { Authorization: `Bearer ${token}` } });
    console.log('/emotion-metrics response:', res.data);

    const summary = await axios.get(`${API_BASE}/${interview._id}/emotion-summary`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('/emotion-summary response:', summary.data);

    const fb = await axios.post(`${API_BASE}/${interview._id}/emotion-feedback`, {}, { headers: { Authorization: `Bearer ${token}` } });
    console.log('/emotion-feedback response:', fb.data);
  } catch (err) {
    console.error('API request failed:', err.response?.data || err.message);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Test script failed', err);
  process.exit(1);
});
