// server/middleware/cacheMiddleware.js (ES Module format)
import { getCached } from '../utils/redisClient.js';
import asyncHandler from 'express-async-handler';

/**
 * Middleware for checking and serving a cached response for GET requests.
 * Uses the request URL as the cache key.
 */
const cacheMiddleware = asyncHandler(async (req, res, next) => {
    
    // 1. Only cache idempotent (safe) methods, typically GET
    if (req.method !== 'GET') {
        return next();
    }

    // 2. Construct the unique cache key
    // Using req.originalUrl ensures query parameters are part of the key
    const key = `cache:${req.originalUrl}`; 
    
    try {
        const cached = await getCached(key);
        
        if (cached) {
            // ✅ Cache Hit: Serve the response immediately
            console.log(`[CACHE HIT] Serving response from Redis for ${req.originalUrl}`);
            // Note: Set a header to indicate the response was cached
            res.set('X-Cache-Status', 'HIT'); 
            return res.json(JSON.parse(cached));
        }
        
        // ✅ Cache Miss: Attach the key to the request
        req.cacheKey = key;
        res.set('X-Cache-Status', 'MISS');
        
        next();
        
    } catch (err) {
        // Non-critical: If Redis is down or has an error, just bypass caching.
        console.warn('Cache middleware failed to access Redis:', err.message);
        next();
    }
});

export default cacheMiddleware;