/**
 * MongoDB Connection — Mongoose (ES Module Version)
 * ------------------------------------------------------
 * Ensures secure, performant, and fault-tolerant connection lifecycle
 * for both local and cloud (Atlas) deployments.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Establishes connection to MongoDB using Mongoose
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  // 1️⃣ Defensive configuration check
  if (!mongoURI) {
    console.error('❌ FATAL: Missing environment variable MONGO_URI.');
    process.exit(1); // Blocks startup until fixed
  }

  try {
    // 2️⃣ Mongoose options for stability and performance
    const conn = await mongoose.connect(mongoURI, {
      // MongoDB Driver Settings (safe defaults)
      serverSelectionTimeoutMS: 5000, // Fail quickly if unreachable
      socketTimeoutMS: 45000, // Socket timeout for long queries
      maxPoolSize: 10, // Maximum concurrent connections per app instance
      minPoolSize: 1, // Maintain minimum idle connections
      autoIndex: true, // Build indexes automatically (only for dev)
      // family: 4, // Force IPv4 to avoid dual-stack DNS latency
      // <-- keepAlive and keepAliveInitialDelay options were removed.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 3️⃣ Graceful shutdown for process kill/interruption
tion in ${retryDelay / 1000}s...`);
    setTimeout(connectDB, retryDelay);
  }
};

export default connectDB;