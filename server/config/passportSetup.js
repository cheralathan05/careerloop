// server/config/passportSetup.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Your User model
const generateToken = require('../utils/generateToken');

// Configure Passport to serialize (store) the user ID in the session/cookie
passport.serializeUser((user, done) => {
    // Stores only the MongoDB ID
    done(null, user.id);
});

// Configure Passport to deserialize (retrieve) the user from the ID in the session/cookie
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback', // Must match the route
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if user already exists
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // 2. User exists, proceed with login
                    return done(null, user);
                } 
                
                // 3. User does not exist, create new user
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'OAuth_Password_No_Login', // Placeholder/random password
                    isVerified: true, // Google login verifies the email
                    // Add profile photo if needed: avatar: profile.photos[0].value
                });

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    )
);