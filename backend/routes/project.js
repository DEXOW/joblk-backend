const express = require('express');
const router = express.Router();

const projectControllers = require('../controllers/project');
const middleware = require('../middleware');

router.get('/:user_type', middleware.auth, projectControllers.getMyProjects);
router.get('/milestones/client/:id', middleware.auth, projectControllers.getProjectClientMilestones);
router.get('/milestones/freelancer/:id', middleware.auth, projectControllers.getProjectFreelancerMilestones);
router.put('/:id/complete', middleware.auth, projectControllers.completeProject);

module.exports = router;