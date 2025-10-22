// server/config/db.js

import mongoose from "mongoose";

/**
 * Establish a connection to MongoDB using Mongoose.
 * Includes retry logic, clean shutdown handling, and structured logging.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ MongoDB URI not found in environment variables (MONGO_URI).");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // fail fast if DB not reachable
      maxPoolSize: 10,                // limit concurrent connections
      autoIndex: true,                // helpful during development
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle graceful shutdowns
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("💤 MongoDB connection closed on app termination.");
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
