const express = require('express');
const router = express.Router();

const controller = require('../controllers/job');
const middleware = require('../middleware');

// Routes
router.post('/', middleware.auth_request, controller.createJob);
router.get('/', middleware.auth_request, controller.getJobs);
router.get('/:id', middleware.auth_request, controller.getJob);
router.put('/:id', middleware.auth_request, controller.updateJob);
router.delete('/:id', middleware.auth_request, controller.deleteJob);

module.exports = router;