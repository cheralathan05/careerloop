const { setCache, getCached } = require('../utils/redisClient');
exports.set = setCache;
exports.get = getCached;
