// server/utils/redisClient.js (FINAL ES MODULE FIX ✅)

// 1. Convert require to import
import Redis from 'ioredis';
import { url } from '../config/redisCache.js'; // Added .js extension

let client = null;

/**
 * Initializes the single Redis client instance (Singleton Pattern).
 * Also sets up connection logging.
 */
const initRedis = () => {
  if (client) return client;
  
  // The Redis constructor can take the URL directly
  client = new Redis(url); 

  client.on('connect', () => console.log('✅ Redis connected'));
  client.on('error', (err) => console.warn('⚠️ Redis error:', err.message));
  
  return client;
};

/**
 * Ensures the client is initialized before returning it.
 */
const getClient = () => {
  if (!client) initRedis();
  return client;
};

/**
 * Stores a key-value pair, automatically serializing the value to JSON.
 * @param {string} key - The cache key.
 * @param {any} value - The data to store.
 * @param {number} ttl - Time to live in seconds (default 1 hour).
 */
const setCache = async (key, value, ttl = 3600) => {
  const c = getClient();
  await c.set(key, JSON.stringify(value), 'EX', ttl);
};

/**
 * Retrieves a cached value.
 * @param {string} key - The cache key.
 * @returns {string | null} The cached value as a raw string.
 */
const getCached = async (key) => {
  const c = getClient();
  const val = await c.get(key);
  return val; // Caller (middleware/controller) is responsible for JSON.parse
};

// 2. Convert module.exports to ES Module named exports
export { initRedis, getClient, setCache, getCached };
