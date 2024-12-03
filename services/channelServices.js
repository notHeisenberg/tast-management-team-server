const { getChannelCollection, closeConnection } = require("../models/mongoDb");

const show = async (req, res) => {
    const channelConnection = await getChannelCollection();
    const result = await channelConnection.find().toArray();
    res.send(result);
}

const channelByCode = async (req, res) => {
    try {
        const channelConnection = await getChannelCollection();
        const channelCode = req.params.channelCode;

        const channel = await channelConnection.findOne({
            "channelInfo.channelCode": channelCode
        });
        res.status(200).json(channel);
    }
    catch (error) {
        console.error("Error fetching channel by code:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await closeConnection();
    }
}

const channelByEmail = async (req, res) => {
    try {
        const channelConnection = await getChannelCollection();
        const useremail = req.params.email;

        // Query to find channels where the user is either a teacher or a student
        const channels = await channelConnection.find({
            $or: [
                { "teachers.email": useremail },
                { "students.email": useremail }
            ]
        }).toArray();
        // console.log(channels)

        // Send the response
        res.status(200).json(channels);
    } catch (error) {
        console.error("Error fetching channels by email:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await closeConnection();
    }
};

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

const updateChannel = async (req, res) => {
    try {
        const updatedchannel = req.body; // This contains the incoming data
        const studentdata = updatedchannel.students;

        const channelConnection = await getChannelCollection();
        const ChannelCollection = await channelConnection.find().toArray();

        // Find the specific channel based on the channelCode
        const filteredChannel = ChannelCollection.find(
            channel => channel?.channelInfo?.channelCode === updatedchannel.channelCode
        );

        if (!filteredChannel) {
            return res.status(404).send({ message: "Channel not found" });
        }

        // Check if student already exists in either teachers or students
        const emailExists =
            filteredChannel.teachers.some((teacher) => teacher.email === updatedchannel.students.email) ||
            filteredChannel.students.some((student) => student.email === updatedchannel.students.email);

        if (emailExists) {
            return res.status(400).send({ message: "You are already joined" });
        }



        // Prepare the update query
        const updatedStudent = {
            $push: { // Use $push to add to the students array
                students: {
                    name: studentdata?.name,
                    email: studentdata?.email,
                    image: studentdata?.image
                }
            }
        };

        // Perform the update
        const newStudent = await channelConnection.updateOne(
            { _id: filteredChannel._id }, // Use the _id of the filtered channel
            updatedStudent
        );

        // Handle the update response
        if (newStudent.modifiedCount > 0) {
            return res.status(201).send(newStudent);
        }
    } catch (error) {
        console.error('Error updating channel:', error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
    finally {
        await closeConnection();
    }
}

module.exports = {
    createChannel,
    updateChannel,
    show,
    channelByEmail,
    channelByCode,
}