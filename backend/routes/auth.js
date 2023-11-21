const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

// Routes
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

router.get('/verify', controller.emailVerification);
router.post('/verify', controller.verifyEmail);

module.exports = router;