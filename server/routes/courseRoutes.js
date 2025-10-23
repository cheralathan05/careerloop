// server/routes/courseRoutes.js (FINAL, FULLY ES MODULE COMPLIANT ✅)

import express from 'express';
const router = express.Router();

// Convert require to import
// NOTE: We assume courseController.js uses named exports that we can access via namespace import
import * as courseController from '../controllers/courseController.js'; 

router.get('/:domain', courseController.getByDomain);

// ✅ FIX: Use ES Module default export
export default router;
