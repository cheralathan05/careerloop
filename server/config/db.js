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
  }atically (only for dev)
      // family: 4, // Force IPv4 to avoid dual-stack DNS latency
      // <-- keepAlive and keepAliveInitialDelay options were removed.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 3️⃣ Graceful shutdown for process kill/interruption


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