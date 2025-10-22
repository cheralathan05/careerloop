module.exports = (req, res, next) => {
  const { rating } = req.body;
  if (rating == null || rating < 0 || rating > 5) {
    res.status(400);
    return next(new Error('Invalid rating (0-5 required)'));
  }
  next();
};
