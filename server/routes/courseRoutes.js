const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/:domain', courseController.getByDomain);

module.exports = router;
