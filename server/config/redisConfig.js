module.exports = {
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  ttlSeconds: 60 * 60 // 1 hour default
};
