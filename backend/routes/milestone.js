const express = require('express');
const router = express.Router();

const controller = require('../controllers/milestone');
const middleware = require('../middleware');

// Define your routes here
router.post('/', middleware.auth, controller.createMilestone);
router.get('/:id', middleware.auth, controller.getJobMilestones);
router.get('/:id/bid', middleware.auth, controller.getJobMilestonesBudgetBid);
router.get('/:id/content', middleware.auth, controller.getMilestoneContent);
router.put('/:id', middleware.auth, controller.updateMilestone);
router.put('/:id/complete', middleware.auth, controller.completeMilestone);
router.put('/:id/upload', middleware.auth, controller.uploadMilestoneContent);
router.delete('/:id', middleware.auth, controller.deleteMilestone);

module.exports = router;