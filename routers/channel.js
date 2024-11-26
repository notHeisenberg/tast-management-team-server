const { create,update } = require('../controllers/channelController');
const { show } = require('../services/channelServices');

const router = require('express').Router();

router.post('/channel', create);
router.patch('/channel', update);
router.get('/channel', show);

module.exports = router;