const express = require("express");
require("dotenv").config();
const cors = require("cors");
const homeRouter = require("./routers/home");
const userRouter = require("./routers/user");
const channelRouter = require("./routers/channel");


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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});