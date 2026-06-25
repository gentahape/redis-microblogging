const express = require('express');
const router = express.Router();
const notifController = require('./notif-controller');

router.get('/stream', notifController.stream);

module.exports = router;