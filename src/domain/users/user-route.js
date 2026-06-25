const express = require('express');
const router = express.Router();
const userController = require('./user-controller');

router.post('/register', userController.register);
router.get('/:user_id', userController.profile);
router.post('/follow', userController.follow);
router.post('/unfollow', userController.unfollow);
router.get('/:user_id/mutual/:target_id', userController.mutual);

module.exports = router;