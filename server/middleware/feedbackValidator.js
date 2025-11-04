/**
 * Rating Validation Middleware
 * ------------------------------------------------------
 * Ensures a valid numeric 'rating' between 0 and 5 is present in the request body.
 * Helps enforce consistent data standards before controller logic executes.
 */

export default function ratingValidation(req, res, next) {
  try {
    // 1️⃣ Parse rating value (handles both numeric & string inputs)
    const rawRating = req.body?.rating;
    const rating = parseFloat(rawRating);

    // 2️⃣ Validate range, NaN, or missing values
    if (rawRating === undefined || rawRating === null || isNaN(rating)) {
      res.status(400);
      throw new Error('Rating field is required and must be a number between 0 and 5.');
    }

    if (rating < 0 || rating > 5) {
      res.status(400);
      throw new Error('Invalid rating. The value must be between 0 and 5.');
    }

    // 3️⃣ Attach normalized, type‑safe rating to request object
    req.body.rating = rating;

    next(); // All good — move to controller
  } catch (err) {
    // 4️⃣ Forward clean error to the global error handler
    next(err);
  }
}
