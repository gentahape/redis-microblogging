const express = require('express');
const router = express.Router();
const postController = require('./post-controller');

router.post('/:user_id', postController.create);
router.get('/:user_id', postController.get);
router.delete('/:user_id/:post_id', postController.remove);

module.exports = router;