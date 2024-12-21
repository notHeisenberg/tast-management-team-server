const { createChannel, updateChannel, channelByEmail, channelByCode, createPost, addCommentToPost, getPostByCode, submitAssignment, cancelSubmission, } = require("../services/channelServices");

module.exports = {
    create: createChannel,
    update: updateChannel,
    userChannel: channelByEmail,
    getChannel: channelByCode,
    createPost: createPost,
    addComment: addCommentToPost,
    getPostDetails: getPostByCode,
    submit:submitAssignment,
    cancel:cancelSubmission,
}