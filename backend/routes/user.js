const express = require('express');
const router = express.Router();

const controllers = require('../controllers/user');
const middleware = require('../middleware');

// Routes
router.get('/', middleware.auth, controllers.getUser);
router.get('/:id', middleware.auth, controllers.getUserDetails);
router.get('/all', middleware.auth, controllers.getAllUsers);
router.put('/', middleware.auth, controllers.updateUser);
router.delete('/', middleware.auth, controllers.deleteUser);
router.post('/avatar', middleware.auth, controllers.updateAvatar);
router.get('/socials', middleware.auth, controllers.getSocials);
router.put('/socials', middleware.auth, controllers.updateSocials);

router.put('/password', middleware.auth, controllers.updatePassword);

module.exports = router;