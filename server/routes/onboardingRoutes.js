// server/routes/onboardingRoutes.js (FINAL ES MODULE FIX ✅)

import express from 'express';
// Note: You must ensure these imported local files use the .js extension.
import onboardingController from '../controllers/onboardingController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 
import cacheMiddleware from '../middleware/cacheMiddleware.js';

const router = express.Router();

router.post('/save', protect, onboardingController.saveDetails);
router.get('/domains/:userId?', protect, cacheMiddleware, onboardingController.getDomains);
router.get('/quiz/:userId?', protect, onboardingController.getQuiz);
router.post('/assessment/submit', protect, onboardingController.submitAssessment);
router.get('/summary/:userId?', protect, onboardingController.getSummary);

// ✅ FIX: Use ES Module default export
export default router;