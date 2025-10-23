// server/routes/feedbackRoutes.js (FINAL, FULLY ES MODULE COMPLIANT ✅)

import express from 'express';
const router = express.Router();

// Convert require to import 
import * as feedbackController from '../controllers/feedbackController.js'; // Namespace import for controller functions
import { protect } from '../middleware/authMiddleware.js'; // Named import for protect
import feedbackValidator from '../middleware/feedbackValidator.js'; // Assuming this uses export default

router.post('/', protect, feedbackValidator, feedbackController.submit);

// ✅ FIX: Use ES Module default export
export default router;