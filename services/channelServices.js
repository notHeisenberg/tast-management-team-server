const { getChannelCollection, closeConnection } = require("../models/mongoDb");

const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });


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
    }
};

const createChannel = async (req, res) => {
    const channel = req.body;
    console.log(channel)
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


const createPost = async (req, res) => {
    try {
        const { channelCode } = req.params; // Extract channelCode from route params
        const post = req.body; // Post data from the request body

        const channelConnection = await getChannelCollection();

        const channel = await channelConnection.findOne({
            "channelInfo.channelCode": channelCode,
        });

        if (!channel) {
            return res.status(404).send({ message: "Channel not found" });
        }

        const newPost = {
            ...post, // Include all post data
            timestamp: new Date().toISOString(), // Ensure timestamp is set
            postCode: Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate postCode
        };

        // Push the new post to the posts array of the channel
        const updateResult = await channelConnection.updateOne(
            { _id: channel._id },
            { $push: { posts: newPost } }
        );

        if (updateResult.modifiedCount > 0) {
            res.status(201).send({ message: "Post created successfully" });
        } else {
            res.status(500).send({ message: "Failed to create post" });
        }
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send({ message: "Internal Server Error" });
    } finally {
        await closeConnection();
    }
};

const getPostByCode = async (req, res) => {
    try {
        const { channelCode, postCode } = req.params;

        const channelCollection = await getChannelCollection();
        const channel = await channelCollection.findOne({
            "channelInfo.channelCode": channelCode,
            "posts.postCode": postCode,
        });

        if (!channel) {
            return res.status(404).json({ message: "Post or channel not found" });
        }

        const post = channel.posts.find((post) => post.postCode === postCode);
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post by code:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const addCommentToPost = async (req, res) => {
    try {
        const { channelCode, postCode } = req.params;
        const { author, image, content, isPrivate = false } = req.body;

        if (!content.trim()) {
            return res.status(400).json({ message: "Comment content cannot be empty." });
        }

        const channelCollection = await getChannelCollection();

        // Retrieve the post to get the creator
        const channel = await channelCollection.findOne({
            "channelInfo.channelCode": channelCode,
            "posts.postCode": postCode,
        });

        if (!channel) {
            return res.status(404).json({ message: "Post or channel not found." });
        }

        const post = channel.posts.find((post) => post.postCode === postCode);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Add the visibility array
        const visibility = [author];
        if (post.author.name) {
            visibility.push(post.author.name);
        }

        const result = await channelCollection.updateOne(
            {
                "channelInfo.channelCode": channelCode,
                "posts.postCode": postCode,
            },
            {
                $push: {
                    "posts.$.comments": {
                        author,
                        image: image || "https://robohash.org/default-user?set=set1&size=400x400",
                        content,
                        timestamp: new Date().toISOString(),
                        isPrivate, // Add the privacy flag
                        visibility, // Add visibility array
                    },
                },
            }
        );

        if (result.modifiedCount > 0) {
            res.status(201).json({ message: `Comment added successfully${isPrivate ? " (Private)" : ""}.` });
        } else {
            res.status(404).json({ message: "Post or channel not found." });
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Function to handle file upload and save to MongoDB
const submitAssignment = async (req, res) => {
    try {
        const { channelCode, postCode } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const channelCollection = await getChannelCollection();

        // Upload file to Cloudinary
        const cloudinaryResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "assignments" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(file.buffer);
        });

        // Create the submission object
        const submission = {
            student: req.body.student || "Unknown Student",
            fileName: file.originalname,
            fileUrl: cloudinaryResult.secure_url,
            uploadedAt: new Date().toISOString(),
        };

        // Save submission to MongoDB
        const result = await channelCollection.updateOne(
            { "channelInfo.channelCode": channelCode, "posts.postCode": postCode },
            { $push: { "posts.$.submissions": submission } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: "Assignment submitted successfully",
                submission,
            });
        } else {
            res.status(404).json({ message: "Failed to save submission in database" });
        }
    } catch (error) {
        console.error("Error uploading assignment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        await closeConnection();
    }
};

const cancelSubmission = async (req, res) => {
    try {
        const { channelCode, postCode } = req.params;
        const { student } = req.body; // Student's name or unique identifier

        const channelCollection = await getChannelCollection();

        // Remove the submission for the specific student
        const result = await channelCollection.updateOne(
            { "channelInfo.channelCode": channelCode, "posts.postCode": postCode },
            { $pull: { "posts.$.submissions": { student: student } } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Submission canceled successfully" });
        } else {
            res.status(404).json({ message: "No submission found to cancel" });
        }
    } catch (error) {
        console.error("Error canceling submission:", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        await closeConnection();
    }
};

module.exports = {
    createChannel,
    updateChannel,
    show,
    channelByEmail,
    channelByCode,
    createPost,
    getPostByCode,
    addCommentToPost,
    upload,
    submitAssignment,
    cancelSubmission,
}