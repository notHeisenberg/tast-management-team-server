const express = require("express");
require("dotenv").config();
const cors = require("cors");
const homeRouter = require("./routers/home");
const userRouter = require("./routers/user");
const channelRouter = require("./routers/channel");
const { closeConnection } = require("./models/mongoDb");


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", 'https://task-management-22c11.web.app'],
    credentials: true,
  })
);

app.use("/", homeRouter);
app.use("/", userRouter);
app.use("/", channelRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("SIGINT received: closing server and database...");
  server.close(async () => {
    await closeConnection();
    console.log("Server and database connections closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received: closing server and database...");
  server.close(async () => {
    await closeConnection();
    console.log("Server and database connections closed.");
    process.exit(0);
  });
});