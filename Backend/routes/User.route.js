import express from 'express';
import { sendOTP, register, login, getCurrentUser, logout } from '../controllers/Auth.controller.js';
import passport from 'passport';
const router = express.Router();

// Email/Password Authentication
router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);
router.get('/me', getCurrentUser);
router.post('/logout', logout);


router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Google OAuth Callback
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`
  }),
  (req, res) => {
    // Generate JWT token
    const token = req.user.generateAuthToken();
    
    // Set HttpOnly cookie with token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000 // 5 minutes
    });
    
    // Redirect to frontend without token in URL
    res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
  }
);

router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
  })
);

// GitHub OAuth Callback
router.get('/github/callback',
  passport.authenticate('github', { 
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=github_auth_failed`
  }),
  (req, res) => {
    const token = req.user.generateAuthToken();
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000 // 5 minutes
    });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
  }
);

export default router;