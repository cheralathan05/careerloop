const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/track', protect, analyticsController.track);
router.get('/events', protect, analyticsController.getEvents);

module.exports = router;
