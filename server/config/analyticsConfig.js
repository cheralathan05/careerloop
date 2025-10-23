// server/config/analyticsConfig.js
import dotenv from "dotenv";
dotenv.config();

/**
 * Centralized configuration for analytics events.
 * Defines tracking modes, retention, and service API keys.
 */
const retentionDays = parseInt(process.env.ANALYTICS_RETENTION_DAYS || "90");
const flushInterval = parseInt(process.env.ANALYTICS_FLUSH_INTERVAL_MS || "60000");

export const analyticsConfig = {
  // Core Settings
  ENABLED: process.env.ANALYTICS_ENABLED === "true",
  PROVIDER: process.env.ANALYTICS_PROVIDER || "internal", // internal | mixpanel | google

  // Data Management
  // Ensure the parsed values are valid numbers, otherwise default to a safe value.
  RETENTION_DAYS: isNaN(retentionDays) ? 90 : retentionDays,
  FLUSH_INTERVAL_MS: isNaN(flushInterval) ? 60000 : flushInterval, // Default to 1 min

  // API Key for external providers (e.g., Mixpanel, Google Analytics)
  API_KEY: process.env.ANALYTICS_API_KEY || "",
};

// Optional: Log a warning if enabled but the API key is missing for external providers
if (analyticsConfig.ENABLED && 
    analyticsConfig.PROVIDER !== 'internal' && 
    !analyticsConfig.API_KEY) {
    console.warn(`WARNING: Analytics is ENABLED for provider '${analyticsConfig.PROVIDER}', but ANALYTICS_API_KEY is missing.`);
}


export default analyticsConfig;