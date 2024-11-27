const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgsiu4c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client;
let userCollection;
let channelCollection;

async function connectToDatabase() {
  if (client && client.topology && client.topology.isConnected()) {
    return { userCollection, channelCollection };
  }

  try {
    // Initialize MongoClient if not already created
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        maxPoolSize: 10,
      });
    }

    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("task-manager");
    userCollection = database.collection("users");
    channelCollection = database.collection("channels");

    return { userCollection, channelCollection };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

async function getUserCollection() {
  const { userCollection } = await connectToDatabase();
  if (!userCollection) {
    throw new Error("User collection is not initialized");
  }
  return userCollection;
}

async function getChannelCollection() {
  const { channelCollection } = await connectToDatabase();
  if (!channelCollection) {
    throw new Error("Channel collection is not initialized");
  }
  return channelCollection;
}

// This function can be used to explicitly close the connection if needed
async function closeConnection() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
    client = null;
  }
}

module.exports = {
  getUserCollection,
  closeConnection,
  ObjectId,
  getChannelCollection,
};