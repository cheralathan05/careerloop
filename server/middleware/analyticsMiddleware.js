/**
 * Analytics Tracking Middleware
 * ------------------------------------------------------
 * Detects and logs events provided by the client for analytics purposes.
 * Uses a non-blocking design so as not to delay primary API responses.
 */

import analyticsService from '../services/analyticsService.js';

/**
 * Middleware entry point
 * Detects special tracking fields (_trackEvent, _trackPayload) in the request body.
 */
export default async function analyticsMiddleware(req, res, next) {
  // 1️⃣ Skip if analytics is not active or uninitialized
  if (!analyticsService || typeof analyticsService.track !== 'function') {
    return next();
  }

  try {
    const { _trackEvent, _trackPayload, ...restBody } = req.body || {};
    const userId = req.user?.id;
    const requestMeta = {
      userId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ua: req.headers['user-agent'],
      ts: new Date().toISOString(),
    };

    // 2️⃣ Detect tracking event
    if (_trackEvent) {
      const eventType = String(_trackEvent).trim();

      // Defensive copy of payload for safety
      const eventPayload = Object.assign({}, _trackPayload || {}, requestMeta);

      // 3️⃣ Non-blocking async log (background fire‑and‑forget)
      queueMicrotask(() => {
        analyticsService
          .track(eventType, eventPayload)
          .catch((err) =>
            console.warn(`⚠️ Analytics tracking failed: ${err.message}`)
          );
      });
    }

    // 4️⃣ Clean up body before passing to controller to prevent misuse
    req.body = restBody;
  } catch (err) {
    console.warn('⚠️ Analytics middleware error:', err.message);
  }

  // 5️⃣ Always continue chain regardless of analytics state
  next();
}
