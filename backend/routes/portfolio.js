const express = require('express');
const router = express.Router();

const controllers = require('../controllers/portfolio');
const middleware = require('../middleware');

// Routes
router.get('/', middleware.auth, controllers.getProjects);
router.post('/', middleware.auth, controllers.addProject);
// router.delete('/', middleware.auth, controllers.deleteUser);

module.exports = router;