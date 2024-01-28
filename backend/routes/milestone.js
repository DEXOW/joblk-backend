const express = require('express');
const router = express.Router();

const controller = require('../controllers/milestone');
const middleware = require('../middleware');

// Define your routes here
router.post('/', middleware.auth, controller.createMilestone);
router.get('/:id', middleware.auth, controller.getJobMilestones);
router.get('/:id/bid', middleware.auth, controller.getJobMilestonesBudgetBid);
router.put('/:id', middleware.auth, controller.updateMilestone);
// router.put('/:id/upload', middleware.auth, projectControllers.uploadMilestoneContent);
// router.put('/', middleware.auth, projectControllers.completeMilestone);

module.exports = router;