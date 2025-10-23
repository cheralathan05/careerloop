// server/routes/aiRoutes.js (FINAL, FULLY ES MODULE COMPLIANT ✅)

import express from 'express';
const router = express.Router(); // Initialize router correctly

// Convert require to import (Note: onboardingController needs to be a namespace import)
import * as aiController from '../controllers/aiController.js'; 
import { protect } from '../middleware/authMiddleware.js';
import aiRateLimit from '../middleware/aiRateLimit.js'; // Assuming this uses export default

router.use(aiRateLimit);
router.post('/chat', protect, aiController.chat);
router.get('/recommendations/:userId?', protect, aiController.getRecommendations);

// ✅ FIX: Use ES Module default export
export default router;