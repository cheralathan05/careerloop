// server/routes/mentorRoutes.js (FINAL, FULLY ES MODULE COMPLIANT ✅)

import express from 'express';


// Convert require to import 
import * as mentorController from '../controllers/mentorController.js'; // Namespace import for controller functions
import { protect } from '../middleware/authMiddleware.js'; // Named import for protect

router.get('/', protect, mentorController.list);

// ✅ FIX: Use ES Module default export
export default router;