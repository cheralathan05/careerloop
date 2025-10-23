// server/routes/analyticsRoutes.js (ES Module Compliant)

import express from 'express';
const router = express.Router(); 

// Convert require to import
import * as analyticsController from '../controllers/analyticsController.js'; 
import { protect } from '../middleware/authMiddleware.js'; // Assuming named export from middleware

// 1. POST /api/analytics/track
// NOTE: You might consider making this route PUBLIC if you want to track 
// unauthenticated user activity, or if the tracking is handled by another, 
// less-secure token. Keeping it protected ensures you always have a userId.
router.post('/track', protect, analyticsController.track);

// 2. GET /api/analytics/events
// This endpoint is critical, as it retrieves raw event data.
// It MUST be protected, and often requires an additional 'admin' or 'role' middleware.
router.get('/events', protect, analyticsController.getEvents); 

// Use ES Module default export
export default router;