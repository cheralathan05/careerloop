const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, mentorController.list);

module.exports = router;
