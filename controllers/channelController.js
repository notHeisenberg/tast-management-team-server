const { createChannel, updateChannel, channelByEmail, channelByCode, createPost, addCommentToPost, getPostByCode, } = require("../services/channelServices");

module.exports = {
    create: createChannel,
    update: updateChannel,
    userChannel: channelByEmail,
    getChannel: channelByCode,
    createPost: createPost,
    addComment: addCommentToPost,
    getPostDetails: getPostByCode,
}