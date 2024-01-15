const express = require('express');
const router = express.Router();

const controllers = require('../controllers/project');
const middleware = require('../middleware');

router.get('/', middleware.auth, controllers.getMyProjects);
router.get('/:id', middleware.auth, controllers.getProjectMilestones);

module.exports = router;