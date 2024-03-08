const User = require("../models/user-model");
const Task = require("../models/task-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "my kitty says meow";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res
      .status(200)
      .json({ message: "New User added successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User Doesn't exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login Successful",
      payload: { userId: user._id, token: token },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPwd = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User Doesn't exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const tasks = await Task.find();

    res.status(200).json(
      users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          tasks: tasks.filter((task) => {
            return task.createdBy.toString() === user.id;
          }),
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getUserByUserId = async (req, res) => {
//   console.log("jkjaslkdj");

//   try {
//     const userId = req.params.id;
//     // if(!userId){
//     //   res.status(400).json({ message: "User not found" });
//     // }
//     const user = await User.findById(userId);
//     const tasks = await Task.find();

//     if (!user) {
//       res.status(400).json({ message: "User not found" });
//     }

//     const tasksWithUserId = tasks.filter((task) => {
//       return task.createdBy.toString() === userId;
//     });
//     if (!tasksWithUserId) {
//       res.status(400).json({ message: "No Tasks with this userId" });
//     }

//     user["tasks"].push(...tasksWithUserId);
//     res.status(200).json({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       tasks: user.tasks,
//       totalTasks: user.tasks.length,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

const getUserByUserId = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      res.status(400).json({ message: "UserID required" });
    }
    const user = await User.findById(userId);
    const tasks = await Task.find();
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    const tasksWithUserId = tasks.filter((task) => {
      return task.createdBy.toString() === userId;
    });
    if (!tasksWithUserId) {
      res.status(400).json({ message: "No Tasks with this userId" });
    }
    user["tasks"].push(...tasksWithUserId);
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      tasks: user.tasks,
      totalTasks: user.tasks.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, login, resetPwd, getUsers, getUserByUserId };
