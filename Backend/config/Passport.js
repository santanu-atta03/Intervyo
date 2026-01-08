import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from "../models/User.model.js"
import dotenv from 'dotenv';
dotenv.config();
// ========================================
// 1. LOCAL STRATEGY (Email/Password)
// ========================================
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Check if user signed up with social auth
        if (user.authProvider !== 'local') {
          return done(null, false, { 
            message: `Please login with ${user.authProvider}` 
          });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// ========================================
// 2. GOOGLE STRATEGY
// ========================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://intervyo.onrender.com/api/auth/google/callback',
      // callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          // Update Google ID if user signed up with email first
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          profilePicture: profile.photos[0]?.value,
          authProvider: 'google',
          isVerified: true, // Google emails are verified
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);


// ========================================
// 3. GITHUB STRATEGY
// ========================================
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: '/api/auth/github/callback',
//       scope: ['user:email'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails?.[0]?.value;
        
//         if (!email) {
//           return done(new Error('No email associated with GitHub account'), null);
//         }

//         // Check if user exists
//         let user = await User.findOne({
//           $or: [
//             { githubId: profile.id },
//             { email: email }
//           ]
//         });

//         if (user) {
//           if (user) {
//             if (!user.githubId) {
//               user.githubId = profile.id;
//               user.github = profile.username;
//               await user.save();
//             }
//             return done(null, user);
//           }

//           // Create new user
//           user = await User.create({
//             githubId: profile.id,
//             email: email,
//             name: profile.displayName || profile.username,
//             profilePicture: profile.photos?.[0]?.value,
//             authProvider: 'github',
//             isVerified: true,
//             'profile.github': profile.username,
//           });

//           return done(null, user);
//         } catch (error) {
//           return done(error, null);
//         }
//       }
//     )
// );

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email associated with GitHub account'), null);

        let user = await User.findOne({
          $or: [
            { githubId: profile.id },
            { email }
          ]
        });

        if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            user.github = profile.username;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          githubId: profile.id,
          email,
          name: profile.displayName || profile.username,
          profilePicture: profile.photos?.[0]?.value,
          authProvider: 'github',
          isVerified: true,
          profile: { github: profile.username },
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ========================================
// SERIALIZE/DESERIALIZE USER
// ========================================
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;