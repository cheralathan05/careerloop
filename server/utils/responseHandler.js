module.exports = {
  success: (res, status = 200, data = {}) => res.status(status).json(data),
  error: (res, status = 500, msg = 'An error occurred') => res.status(status).json({ message: msg })
};
