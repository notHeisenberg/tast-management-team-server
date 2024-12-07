const { createChannel, updateChannel, channelByEmail, channelByCode, createPost, addCommentToPost, } = require("../services/channelServices");

module.exports = {
    create: createChannel,
    update: updateChannel,
    userChannel: channelByEmail,
    getChannel: channelByCode,
    createPost: createPost,
    addComment: addCommentToPost,
}