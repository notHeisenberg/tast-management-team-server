const { createChannel, updateChannel, channelByEmail, channelByCode, } = require("../services/channelServices");

module.exports = {
    create: createChannel,
    update: updateChannel,
    userChannel: channelByEmail,
    getChannel: channelByCode,
}