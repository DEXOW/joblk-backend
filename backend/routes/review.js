const express = require('express');
const router = express.Router();

const controller = require('../controllers/review');
const middleware = require('../middleware');

// Routes
router.post('/', middleware.auth, controller.createReview);
router.get('/:id', middleware.auth, controller.getReviewsForUser);
router.put('/:id', middleware.auth, controller.updateReview);
router.delete('/:id', middleware.auth, controller.deleteReview);

module.exports = router;
