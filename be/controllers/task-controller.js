const User = require("../models/user-model");
const Task = require("../models/task-model");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks: tasks, totalCount: tasks.length });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getTasksByUserId = async (req, res) => {
  try {
    const userId = req.query.id;
    const user = await User.findById(userId);
    const tasks = await Task.find();

    if (!user) {
      res.status(400).json({ message: "No Tasks with UserId" });
    }

    const tasksWithUserId = tasks.filter((task) => {
      return task.createdBy.toString() === userId;
    });
    user["tasks"].push(...tasksWithUserId);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const addTask = async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;
    const user = await User.findById(createdBy);
    if (user) {
      const newTask = new Task({ title, description, createdBy });
      await newTask.save();
      user["tasks"].push(newTask);
      res
        .status(200)
        .json({ message: "New Task added successfully", data: user });
    } else {
      return res
        .status(400)
        .json({ error: "UserID required. Create account or Log into your account" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.query.id;
    console.log(taskId);
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const editTask = async (req, res) => {
  try {
    const taskId = req.query.id;
    const { title, description, createdBy, isCompleted } = req.body;
    const editedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        createdBy,
        isCompleted,
      },
      { new: true }
    );

    if (!editedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task edited successfully", editedTask });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { getTasks, getTasksByUserId, addTask, editTask, deleteTask };
