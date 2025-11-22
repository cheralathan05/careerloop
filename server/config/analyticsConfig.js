/**
 * Analytics Configuration
 * ------------------------------------------------------
 * Centralized config for analytics and metrics operations.
 * Supports multiple providers (e.g. internal, Mixpanel, GA4).
 */

import dotenv from 'dotenv';
dotenv.config();

// Parse numeric environment variables safely
const retentionDays = Number(process.env.ANALYTICS_RETENTION_DAYS || 80);
const flushIntervalMs = Number(process.env.ANALYTICS_FLUSH_INTERVAL_MS || 80000);

// Main configuration object
export const analyticsConfig = {
  ENABLED: process.env.ANALYTICS_ENABLED === 'true',
  PROVIDER: process.env.ANALYTICS_PROVIDER || 'internal', // internal | mixpanel | google

  // Use validated values or safe fallbacks
  RETENTION_DAYS: Number.isFinite(retentionDays) ? retentionDays : 90,
  FLUSH_INTERVAL_MS: Number.isFinite(flushIntervalMs) ? flushIntervalMs : 60000,

  // External provider API keys (kept blank for internal analytics)
  API_KEY: process.env.ANALYTICS_API_KEY?.trim() || '',

  // Optional Google Analytics project ID
  PROJECT_ID: process.env.ANALYTICS_PROJECT_ID || null,
};

// Warn if analytics enabled but misconfigured
if (
  analyticsConfig.ENABLED &&
  analyticsConfig.PROVIDER !== 'internal' &&
  !analyticsConfig.API_KEY
) {
  console.warn(
    `⚠️  Analytics is ENABLED for provider '${analyticsConfig.PROVIDER}', but ANALYTICS_API_KEY is missing.`,
  );
}


export default analyticsConfig;
