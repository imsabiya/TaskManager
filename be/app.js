console.log("do it");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const usersRoute = require("./routes/user-route");
const tasksRoute = require("./routes/task-route");

const app = express();

//Connect to DB

mongoose.connect("mongodb://localhost:27017/TaskManager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//routes

app.use(usersRoute);
app.use(tasksRoute);

//Listen to server
const port = 5001;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
