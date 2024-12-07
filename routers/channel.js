const { create, update, userChannel, getChannel, createPost, addComment, getPostDetails } = require('../controllers/channelController');
const { show } = require('../services/channelServices');

const router = require('express').Router();

router.post('/channel', create);
router.patch('/channel', update);
router.get('/channel', show);
router.get('/channel/:email', userChannel);
router.get('/channels/:channelCode', getChannel);
router.post('/channels/:channelCode/posts', createPost);
router.get("/channels/:channelCode/posts/:postCode", getPostDetails);
router.post("/channels/:channelCode/posts/:postCode/comments", addComment);

module.exports = router;