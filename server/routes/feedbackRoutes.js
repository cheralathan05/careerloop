const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const feedbackValidator = require('../middleware/feedbackValidator');

router.post('/', protect, feedbackValidator, feedbackController.submit);

module.exports = router;

