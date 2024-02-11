const express = require('express');
const router = express.Router();

const controllers = require('../controllers/portfolio');
const middleware = require('../middleware');

// Routes
router.get('/', middleware.auth, controllers.getProjects);
router.post('/', middleware.auth, controllers.addProject);
router.put('/', middleware.auth, controllers.updateProject);
router.delete('/', middleware.auth, controllers.deleteProject);

module.exports = router;