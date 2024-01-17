const express = require('express');
const router = express.Router();

const controller = require('../controllers/job');
const middleware = require('../middleware');

// Routes
router.post('/', middleware.auth, controller.createJob);
router.get('/', middleware.auth, controller.getJobs);
router.get('/userJobs/:id', middleware.auth, controller.getClientJobs);
router.get('/:id', middleware.auth, controller.getJob);
router.put('/:id', middleware.auth, controller.updateJob);
router.delete('/:id', middleware.auth, controller.deleteJob);

module.exports = router;