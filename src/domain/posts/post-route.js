const express = require('express');
const router = express.Router();
const postController = require('./post-controller');

router.post('/', postController.create);
router.get('/:user_id', postController.get);

module.exports = router;