// Simple per-IP rate limit middleware for AI endpoints (naive)
const rateMap = new Map();

module.exports = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 30; // 30 calls per minute

  const entry = rateMap.get(key) || { ts: now, count: 0 };
  if (now - entry.ts > windowMs) {
    entry.ts = now;
    entry.count = 1;
  } else {
    entry.count++;
  }
  rateMap.set(key, entry);
  if (entry.count > limit) {
    res.status(429).json({ message: 'Too many requests to AI endpoints. Please slow down.' });
    return;
  }
  next();
};
