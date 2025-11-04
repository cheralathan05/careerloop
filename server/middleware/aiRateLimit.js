/**
 * Simple IP-based rate limiting for AI endpoints
 * ---------------------------------------------------------
 * Limits repeated requests per IP using a rolling window counter.
 * Lightweight but effective for single-instance applications.
 */

const rateMap = new Map();

/**
 * Rate limiter middleware
 * Restricts each IP to a max of 30 requests per 60 seconds.
 */
export default function aiRateLimit(req, res, next) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 30;
  const ip = req.ip || req.connection.remoteAddress;

  const entry = rateMap.get(ip) || { start: now, count: 0 };

  // Reset counter after window expires
  if (now - entry.start > windowMs) {
    entry.start = now;
    entry.count = 1;
  } else {
    entry.count += 1;
  }

  rateMap.set(ip, entry);

  if (entry.count > limit) {
    const retryAfter = Math.ceil((windowMs - (now - entry.start)) / 1000);
    return res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Please retry after ${retryAfter}s.`,
      retryAfter,
    });
  }

  next();
}
