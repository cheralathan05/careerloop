const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const aiRateLimit = require('../middleware/aiRateLimit');

router.use(aiRateLimit);
router.post('/chat', protect, aiController.chat);
router.get('/recommendations/:userId?', protect, aiController.getRecommendations);

module.exports = router;
