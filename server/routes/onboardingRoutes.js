import express from 'express';
import {
  saveDetails,
  getDomains,
  getQuiz,
  submitAssessment,
  getSummary,
} from '../controllers/onboardingController.js';
import { protect } from '../middleware/authMiddleware.js'; // Example middleware

const router = express.Router();

// ✅ All routes require auth
router.post('/save', protect, saveDetails);
router.get('/domains/:userId?', protect, getDomains);
router.get('/quiz/:userId?', protect, getQuiz);
router.post('/assessment', protect, submitAssessment);
router.get('/summary/:userId?', protect, getSummary);

export default router;
