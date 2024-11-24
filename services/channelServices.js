const { getChannelCollection, closeConnection } = require("../models/mongoDb");


const createChannel = async (req, res) => {
    const channel = req.body;
    const channelConnection = await getChannelCollection();

    try {
        const result = await channelConnection.findOne({
            courseID: channel.channelInfo.courseID,
        });
        if (result) {
            // If the courseID already exists, return a 400 status with a message
            return res.status(400).send({ message: "Channel already exists" });
        }

        // If the courseID does not exist, insert the new channel
        const newChannel = await channelConnection.insertOne(channel);
        return res.status(201).send(newChannel);
    } catch (error) {
        console.error('Error creating channel:', error);
        return res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await closeConnection();
    }
}

module.exports = {
    createChannel,
}