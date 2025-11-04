/**
 * Google OAuth 2.0 Strategy Configuration — Passport.js
 * -----------------------------------------------------
 * Handles Google authentication flow using OAuth 2.0
 * and links users with MongoDB via the User model.
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * Initializes and configures Passport.js strategies.
 * Call this function after environment variables have been loaded.
 */
export const initPassportSetup = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } = process.env;

  // --- Credential check ---
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      '⚠️ WARNING: Google OAuth credentials missing. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before initializing Passport.'
    );
    return;
  }

  // ------------------------------------------------------------------
  // 🔹 1. Serialize user (stores user ID in session for short-lived state)
  // ------------------------------------------------------------------
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // ------------------------------------------------------------------
  // 🔹 2. Deserialize user (retrieves full user from DB by stored ID)
  // ------------------------------------------------------------------
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // ------------------------------------------------------------------
  // 🔹 3. Register Google OAuth Strategy
  // ------------------------------------------------------------------
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        scope: ['profile', 'email'], // Enforce explicit scopes for email + user info
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract verified primary email
          const email = profile.emails?.[0]?.value?.toLowerCase()?.trim();
          if (!email) {
            return done(new Error('Google profile missing verified email.'), null);
          }

          // Find existing user
          let user = await User.findOne({ email });

          // Create new user if not found
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              password: `GOOGLE_OAUTH_USER_${crypto.randomUUID()}`,
              isVerified: true,
              authProvider: 'google',
              avatar: profile.photos?.[0]?.value || null,
            });
          }

          // Attach temporary JWT for front-end processing
          user._doc.token = generateToken(user._id);

          return done(null, user);
        } catch (error) {
          console.error('❌ Google OAuth Strategy Error:', error.message);
          done(error, null);
        }
      }
    )
  );

  console.log('✅ Passport Google OAuth Strategy configured successfully.');
};

export default initPassportSetup;
