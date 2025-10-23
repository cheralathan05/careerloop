// server/config/passportSetup.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; 
import generateToken from '../utils/generateToken.js'; 

/**
 * Initializes and configures Passport.js strategies (Google OAuth).
 * This function should be called after environment variables are loaded.
 */
export const initPassportSetup = () => {

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    
    // --- CRITICAL CHECK ---
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        console.warn('⚠️ WARNING: Google OAuth is not configured. GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Skipping Google Strategy setup.');
        return; // Exit setup if credentials aren't available
    }

    // ======================================================
    // 🔹 1. Serialize user (store user ID in session)
    // ======================================================
    passport.serializeUser((user, done) => {
      // Use user.id (Mongoose document id)
      done(null, user.id); 
    });

    // ======================================================
    // 🔹 2. Deserialize user (fetch user from DB by ID)
    // ======================================================
    passport.deserializeUser(async (id, done) => {
      try {
        // Exclude the password field for security
        const user = await User.findById(id).select('-password'); 
        done(null, user);
      } catch (error) {
        // Pass error to Express/middleware
        done(error, null); 
      }
    });

    // ======================================================
    // 🔹 3. Google OAuth Strategy
    // ======================================================
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          // Construct callback URL dynamically
          callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value?.toLowerCase().trim();
            if (!email) {
              return done(new Error('Google account provided no primary email.'), null);
            }
            
            let user = await User.findOne({ email });

            // User doesn't exist, create a new one
            if (!user) {
              // Ensure 'password' field meets Mongoose schema requirements
              user = await User.create({
                name: profile.displayName,
                email,
                // Best practice: use a random string or a fixed non-null identifier
                password: 'GOOGLE_OAUTH_USER_' + Math.random().toString(36).substring(2, 15), 
                isVerified: true,
                authProvider: 'google',
              });
            }

            // --- TOKEN HANDLING ---
            // The token should ideally be generated in the final route handler, 
            // but attaching it here temporarily is a common shortcut for convenience.
            // We use user._doc to modify the POJO before it's passed to the session/route.
            user._doc.token = generateToken(user._id);

            return done(null, user); // Pass the user (with temp token) to the next step
          } catch (error) {
            console.error('❌ Google OAuth Strategy Failure:', error.message);
            return done(error, null);
          }
        }
      )
    );
    
    console.log('✅ Passport Google Strategy configured.');
};