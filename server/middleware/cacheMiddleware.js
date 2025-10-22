const { getCached } = require('../utils/redisClient');

module.exports = async (req, res, next) => {
  try {
    const key = `cache:${req.originalUrl}`;
    const cached = await getCached(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // attach cacheKey so controller can store later
    req.cacheKey = key;
    next();
  } catch (err) {
    next();
  }
};
