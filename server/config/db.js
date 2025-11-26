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


    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('💤 MongoDB connection closed (SIGTERM).');
      process.exit(0);
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // 4️⃣ Resilient retry strategy for containerized/cloud environments
    const retryDelay = 5000;
    console.log(`🔁 Retrying Database Connection in ${retryDelay / 1000}s...`);
    setTimeout(connectDB, retryDelay);
  }
};

export default connectDB;