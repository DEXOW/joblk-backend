const express = require('express');
const router = express.Router();

const projectControllers = require('../controllers/project');
const middleware = require('../middleware');

router.get('/:user_type', middleware.auth, projectControllers.getMyProjects);
router.get('/milestones/:id', middleware.auth, projectControllers.getProjectMilestones);
router.get('/milestones/client/:id', middleware.auth, projectControllers.getProjectClientMilestones);
router.get('/milestones/freelancer/:id', middleware.auth, projectControllers.getProjectFreelancerMilestones);
router.post('/:id', middleware.auth, projectControllers.createMilestone);
router.put('/project/:id', middleware.auth, projectControllers.updateProjectStatus);
router.put('/project_payment/:id', middleware.auth, projectControllers.updateProjectStatus);
router.put('/:id', middleware.auth, projectControllers.updateMilestoneData);
router.put('/', middleware.auth, projectControllers.completeMilestone);
router.delete('/:id', middleware.auth, projectControllers.deleteMilestone);

module.exports = router;