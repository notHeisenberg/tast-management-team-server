const { createChannel, updateChannel, channelByEmail, } = require("../services/channelServices");

module.exports = {
    create: createChannel,
    update: updateChannel,
    userChannel: channelByEmail,
}