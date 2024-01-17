const express = require('express');
const router = express.Router();

const projectControllers = require('../controllers/project');
const middleware = require('../middleware');

router.get('/', middleware.auth, projectControllers.getMyProjects);
router.get('/:id', middleware.auth, projectControllers.getProjectMilestones);
router.post('/:id', middleware.auth, projectControllers.createMilestone);
router.put('/:id', middleware.auth, projectControllers.updateMilestoneData);
router.put('/', middleware.auth, projectControllers.completeMilestone);
router.put('/complete/:id', middleware.auth, projectControllers.completeProject);
router.delete('/:id', middleware.auth, projectControllers.deleteMilestone);

module.exports = router;