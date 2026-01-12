import express from 'express';
import { sendOTP, register, login, getCurrentUser, logout } from '../controllers/Auth.controller.js';
import passport from 'passport';
import { authenticate, protect } from '../middlewares/auth.js';
const router = express.Router();
const isProd = process.env.NODE_ENV === 'production';

// Email/Password Authentication
router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);
router.get('/me',protect, getCurrentUser);
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
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
    // failureRedirect: `http://localhost:5173/login?error=google_auth_failed`,
  }),
  (req, res) => {
    const token = req.user.generateAuthToken();

  //   res.cookie('token', token, {
  //     httpOnly: true,
  //     secure: true,          // REQUIRED on HTTPS (Render + Vercel)
  //     sameSite: 'none',      // REQUIRED for cross-domain cookies
  //     maxAge: 7 * 24 * 60 * 60 * 1000

  // //     secure: false,
  // // sameSite: 'lax',
  //   });

    // CLEAN redirect (NO token)
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    // res.redirect(`http://localhost:5173/auth/callback`);
  }
);


router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
  })
);

// GitHub OAuth Callback
// router.get('/github/callback',
//   passport.authenticate('github', { 
//     session: false,
//     failureRedirect: `${process.env.CLIENT_URL}/login?error=github_auth_failed`
//   }),
//   (req, res) => {
//     const token = req.user.generateAuthToken();
//     res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
//   }
// );
router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=github_auth_failed`,
  }),
  (req, res) => {
    const token = req.user.generateAuthToken();

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: true,      // REQUIRED on HTTPS
    //   sameSite: 'none',  // REQUIRED for Vercel ↔ Render
    //   maxAge: 7 * 24 * 60 * 60 * 1000
    // });

    // CLEAN redirect (NO token)
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);


export default router;
