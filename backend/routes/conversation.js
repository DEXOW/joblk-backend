// routes/conversation.js
const express = require('express');
const router = express.Router();

const controller = require('../controllers/conversation');
const middleware = require('../middleware');

// Routes
router.get('/:id', middleware.auth, controller.getConversation);
router.get('/', middleware.auth, controller.getConversations);
router.post('/', middleware.auth, controller.createConversation);

module.exports = router;
