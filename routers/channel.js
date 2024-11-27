const { create, update, userChannel } = require('../controllers/channelController');
const { show } = require('../services/channelServices');

const router = require('express').Router();

router.post('/channel', create);
router.patch('/channel', update);
router.get('/channel', show);
router.get('/channel/:email', userChannel);

module.exports = router;