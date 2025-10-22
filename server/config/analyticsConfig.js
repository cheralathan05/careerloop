// server/config/analyticsConfig.js
import dotenv from "dotenv";
dotenv.config();

/**
 * Centralized configuration for analytics events.
 * Defines tracking modes, retention, and service API keys.
 */
export const analyticsConfig = {
  ENABLED: process.env.ANALYTICS_ENABLED === "true",
  PROVIDER: process.env.ANALYTICS_PROVIDER || "internal", // internal | mixpanel | google
  RETENTION_DAYS: parseInt(process.env.ANALYTICS_RETENTION_DAYS || "90"),
  FLUSH_INTERVAL_MS: parseInt(process.env.ANALYTICS_FLUSH_INTERVAL_MS || "60000"), // 1 min
  API_KEY: process.env.ANALYTICS_API_KEY || "",
};

export default analyticsConfig;
