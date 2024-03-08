const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  getTasksByUserId,
  deleteTask,
  editTask,
} = require("../controllers/task-controller");

router.route("/tasks").get(getTasks);
router.route("/addTask").post(addTask);
router
  .route("/task?:id")
  .get(getTasksByUserId)
  .put(editTask)
  .delete(deleteTask); //query params

module.exports = router;
