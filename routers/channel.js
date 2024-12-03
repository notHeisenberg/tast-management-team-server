const { create, update, userChannel, getChannel } = require('../controllers/channelController');
const { show } = require('../services/channelServices');

const router = require('express').Router();

router.post('/channel', create);
router.patch('/channel', update);
router.get('/channel', show);
router.get('/channel/:email', userChannel);
router.get('/channels/:channelCode', getChannel);

module.exports = router;