// server/config/db.js (ES Module format)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Connects the server to the MongoDB database.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ FATAL: MongoDB URI not found in environment variables (MONGO_URI).");
    // Use an immediate exit for a critical configuration failure
    process.exit(1); 
  }

  try {
    // 1. Connection Configuration
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s attempt to select a server
      maxPoolSize: 10,                 // Maintain up to 10 sockets
      autoIndex: true,                 // Auto-create indexes (useful for dev/small prod)
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 2. Graceful Shutdown on interruption (Ctrl+C, termination signal)
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("💤 MongoDB connection closed on app termination (SIGINT).");
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // 3. Robust Retry Mechanism (Crucial for microservices/containerized environments)
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000); 
    // NOTE: In a production environment, you might only retry a few times before failing.
  }
};

export default connectDB;