// server/config/passportSetup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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
    const user = await User.findById(id);
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
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // ⚠️ MUST match your Google Cloud redirect URI
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase().trim();

        // 🔍 Check if user already exists
        let user = await User.findOne({ email });

        if (user) return done(null, user);

        // 🆕 Create user if not exists
        user = await User.create({
          name: profile.displayName,
          email,
          password: 'GOOGLE_OAUTH_USER', // Placeholder password (not used)
          isVerified: true, // Google guarantees verified emails
          avatar: profile.photos?.[0]?.value || null,
        });

        done(null, user);
      } catch (error) {
        console.error('❌ Google OAuth Error:', error);
        done(error, null);
      }
    }
  )
);

// ======================================================
// ✅ Export — ensures the strategy is registered globally
// ======================================================
module.exports = passport;
