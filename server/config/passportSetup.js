// server/config/passportSetup.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// 🔹 Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 🔹 Deserialize user (fetch user from DB by ID)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// 🔹 Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback', // Must match your backend route
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1️⃣ Check if the user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // 2️⃣ If exists, proceed with login
          return done(null, user);
        }

        // 3️⃣ Create a new user if not exists
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'GOOGLE_OAUTH_USER', // Placeholder
          isVerified: true, // Google guarantees verified email
          avatar: profile.photos?.[0]?.value || null,
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
