/**
 * Redis Cache Middleware
 * ------------------------------------------------------
 * Intercepts GET requests to serve cached responses if available.
 * Automatically attaches the cache key for later stage write‑back.
 * Logs cache hits & misses, adds cache status headers.
 */

import { getCached, setCache } from '../utils/redisClient.js';

/**
 * Factory version for configurable expiry times (default: 5 minutes)
 */
const cacheMiddleware =
  (options = {}) =>
  async (req, res, next) => {
    const { ttl = 300 } = options; // TTL in seconds (5 min default)

    // ⛔ Limit cache only to safe methods
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await getCached(key);

      if (cached) {
        // ✅ CACHE HIT
        const data = JSON.parse(cached);
        res.setHeader('X-Cache-Status', 'HIT');
        res.setHeader('Cache-Control', `public, max-age=${ttl}`);
        console.log(`⚡ [CACHE HIT] ${req.originalUrl}`);
        return res.status(200).json(data);
      }

      // ⚙️ CACHE MISS
      res.setHeader('X-Cache-Status', 'MISS');
      req.cacheKey = key;

      // Capture controller output and store in Redis cache
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Cache only successful JSON responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(key, JSON.stringify(body), ttl).catch((err) =>
            console.warn(`Redis cache write failed for ${key}:`, err.message)
          );
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.warn(`⚠️ Cache middleware bypassed: ${err.message}`);
      next();
    }
  };

export default cacheMiddleware;
