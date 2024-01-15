const express = require('express');
const router = express.Router();

const controller = require('../controllers/message');
const middleware = require('../middleware');

// Routes
router.post('/:id', middleware.auth, controller.createMessage);
router.get('/:id', middleware.auth, controller.getMessages);

module.exports = router;