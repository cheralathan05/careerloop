// server/services/cacheService.js (ES Module Format)
import { setCache, getCached } from '../utils/redisClient.js';

/**
 * Caching Service: Provides a high-level interface for setting and getting data from Redis.
 * This abstraction shields the rest of the application from direct Redis client implementation details.
 */

// Export the functions with the same names (or rename them if the service is meant to enforce a different interface)
export const set = setCache;
export const get = getCached;

// You can also export them under different, more descriptive names if desired:
// export const setTemporaryData = setCache;
// export const getTemporaryData = getCached;