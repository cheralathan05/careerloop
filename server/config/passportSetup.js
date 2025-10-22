// server/config/passportSetup.js (FINAL ES MODULE FIX ✅)

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; 
import generateToken from '../utils/generateToken.js'; 

// This structure EXPORTS the initialization function, which is called *after* dotenv.config()
export const initPassportSetup = () => {

    // ======================================================
    // 🔹 1. Serialize user (store user ID in session)
    // ======================================================
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    // ======================================================
    // 🔹 2. Deserialize user (fetch user from DB by ID)
    // ======================================================
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id).select('-password');
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });

    // ======================================================
    // 🔹 3. Google OAuth Strategy
    // ======================================================
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID, // NOW reads defined value
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            if (!profile.emails || !profile.emails.length) {
              throw new Error('Google account has no public email');
            }
            const email = profile.emails[0].value.toLowerCase().trim();
            let user = await User.findOne({ email });

            if (!user) {
              user = await User.create({
                name: profile.displayName,
                email,
                password: 'GOOGLE_OAUTH_USER',
                isVerified: true,
                authProvider: 'google',
              });
            }

            // Attach token temporarily for callback usage
            user._doc.token = generateToken(user._id);

            return done(null, user);
          } catch (error) {
            console.error('❌ Google OAuth Error:', error.message);
            return done(error, null);
          }
        }
      )
    );
};

// No need for 'module.exports = passport;' since we export the function above.
// The passport instance is available globally after initPassportSetup() is run.