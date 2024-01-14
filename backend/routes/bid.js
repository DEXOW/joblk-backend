const express = require('express');
const router = express.Router();

const controllers = require('../controllers/bid');
const middleware = require('../middleware');

router.post('/:id', middleware.auth, controllers.submitBid);
router.get('/', middleware.auth, controllers.getMyBids);
router.get('/:id', middleware.auth, controllers.getJobBidsSortedByScores);

module.exports = router;