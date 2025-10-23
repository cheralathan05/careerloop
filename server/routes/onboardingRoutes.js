// server/routes/onboardingRoutes.js (FINAL, FULLY ES MODULE COMPLIANT ✅)

import express from 'express';
const router = express.Router();

// ✅ Import controller as a namespace (ES Module-safe)
import * as onboardingController from '../controllers/onboardingController.js'; 

// ✅ Middleware imports
import { protect } from '../middleware/authMiddleware.js';
import cacheMiddleware from '../middleware/cacheMiddleware.js';

// --- ROUTE DEFINITIONS ---

// Save onboarding details
router.post('/save', protect, onboardingController.saveDetails);

// Get recommended domains for a user
router.get('/domains/:userId?', protect, cacheMiddleware, onboardingController.getDomains);

// Generate quiz dynamically for a user
router.get('/quiz/:userId?', protect, onboardingController.getQuiz);

// Submit skill assessment results
router.post('/assessment/submit', protect, onboardingController.submitAssessment);

// Get onboarding summary for user
router.get('/summary/:userId?', protect, onboardingController.getSummary);

// ✅ Use ES Module default export
export default router;
