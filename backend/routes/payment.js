const express = require('express');
const router = express.Router();

const controller = require('../controllers/payment');
const middleware = require('../middleware');

// Routes
router.post('/', middleware.auth, controller.createPaymentIntent);

module.exports = router;