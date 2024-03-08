const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    //required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdBy: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
