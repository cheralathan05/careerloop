/**
 * Error Handling Middleware Suite
 * ------------------------------------------------------
 * 1️⃣ notFound — handles requests to unknown routes
 * 2️⃣ errorHandler — central processor for all thrown or forwarded errors
 * Compatible with Express 5’s native async error capturing.
 */

/**
 * Handle 404 - Not Found errors (for unregistered routes)
 */
export const notFound = (req, res, next) => {
  const message = `Not Found - ${req.originalUrl}`;
  const error = new Error(message);
  res.status(404);
  next(error);
};

/**
 * General error handler
 * Signature: (err, req, res, next)
 * Captures thrown errors and ensures uniform JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  // 1️⃣ Normalize the status code
  const code = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // 2️⃣ Create structured error payload
  const payload = {
    status: 'error',
    code,
    message: err.message || 'Internal Server Error',
  };

  // 3️⃣ Add stack trace in development mode
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  // 4️⃣ Log critical errors (production‑safe)
  if (code >= 500) {
    console.error(`❌ [${req.method}] ${req.originalUrl} → ${err.message}`);
  }

  res.status(code).json(payload);
};
