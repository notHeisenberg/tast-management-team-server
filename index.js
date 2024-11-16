const express = require("express");
require("dotenv").config();
const cors = require("cors");
const homeRouter = require("./routers/home");
const userRouter = require("./routers/user");


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/", homeRouter);
app.use("/", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });