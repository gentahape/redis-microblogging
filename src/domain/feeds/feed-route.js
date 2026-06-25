const express = require('express');
const router = express.Router();
const feedController = require('./feed-controller');

router.get('/trending', feedController.trending);
router.get('/:user_id', feedController.feed);

module.exports = router;