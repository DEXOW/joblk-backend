const express = require('express');
const router = express.Router();

const controllers = require('../controllers/user');
const middleware = require('../middleware');

// Routes
router.get('/', middleware.auth, controllers.getUser);
router.put('/', middleware.auth, controllers.updateUser);
router.delete('/', middleware.auth, controllers.deleteUser);

router.put('/password', middleware.auth, controllers.updatePassword);

module.exports = router;