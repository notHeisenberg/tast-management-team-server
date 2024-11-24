const { create } = require('../controllers/channelController');

const router = require('express').Router();

router.post('/channel', create);

module.exports = router;