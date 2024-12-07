const { create, update, userChannel, getChannel, createPost, addComment } = require('../controllers/channelController');
const { show } = require('../services/channelServices');

const router = require('express').Router();

router.post('/channel', create);
router.patch('/channel', update);
router.get('/channel', show);
router.get('/channel/:email', userChannel);
router.get('/channels/:channelCode', getChannel);
router.post('/channels/:channelCode/posts', createPost);
router.post("/channels/:channelCode/posts/:postCode/comments", addComment);

module.exports = router;