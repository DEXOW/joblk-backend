const express = require('express');
const router = express.Router();

const controller = require('../controllers/milestone');
const middleware = require('../middleware');

// Define your routes here
router.post('/', middleware.auth, controller.createMilestone);
// router.get('/:id/client', middleware.auth, projectControllers.getProjectClientMilestones);
// router.get('/:id/freelancer', middleware.auth, projectControllers.getProjectFreelancerMilestones);
// router.put('/:id', middleware.auth, projectControllers.updateMilestoneData);
// router.put('/:id/upload', middleware.auth, projectControllers.uploadMilestoneContent);
// router.put('/', middleware.auth, projectControllers.completeMilestone);

module.exports = router;
