const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUsers,
  getUserByUserId,
  resetPwd,
} = require("../controllers/user-controller");

router.route("/register").post(register);
router.route("/users").get(getUsers);
router.route("/login").post(login);
router.route("/user").get(getUserByUserId); //Query params
router.route("/resetPwd").post(resetPwd);

module.exports = router;
