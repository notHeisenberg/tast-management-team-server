const { create, update, userChannel, getChannel, createPost, addComment, getPostDetails, submit, cancel } = require('../controllers/channelController');
const { show, upload } = require('../services/channelServices');

const router = require('express').Router();

router.post('/channel', create);
router.patch('/channel', update);
router.get('/channel', show);
router.get('/channel/:email', userChannel);
router.get('/channels/:channelCode', getChannel);
router.post('/channels/:channelCode/posts', createPost);
router.get("/channels/:channelCode/posts/:postCode", getPostDetails);
router.post("/channels/:channelCode/posts/:postCode/comments", addComment);
router.post("/channels/:channelCode/posts/:postCode/submit", upload.single('file'), submit);
router.post("/channels/:channelCode/posts/:postCode/cancel", cancel);

module.exports = router;