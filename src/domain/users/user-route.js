const express = require('express');
const router = express.Router();
const userController = require('./user-controller');

router.post('/register', userController.register);
router.get('/:user_id', userController.profile);

router.post('/:user_id/follow', userController.follow);
router.post('/:user_id/unfollow', userController.unfollow);
router.get('/:user_id/mutual/:target_id', userController.mutual);

module.exports = router;