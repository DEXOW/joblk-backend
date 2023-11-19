const express = require('express');
const router = express.Router();

const controller = require('../controllers/default');

// Routes
router.all('/', controller.index);

module.exports = router;