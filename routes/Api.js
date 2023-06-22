
const express = require("express");
const UsersControllers = require("../controllers/UserController");
const TasksController = require("../controllers/TasksController");
const AuthVerify = require("../middleware/AuthMiddleware");
const router = express.Router();


router.post("/registration", UsersControllers.registration);
router.post("/login", UsersControllers.login);
router.post("/profileUpdate", AuthVerify, UsersControllers.profileUpdate);
router.get("/profileDetails", AuthVerify, UsersControllers.profileDetails);

// Forget Password router
router.get("/verifyEmail/:email", UsersControllers.RecoverVerifyEmail);
router.get("/verifyOtp/:email/:otp", UsersControllers.VerifyOTP);
router.post("/resetPassword", UsersControllers.ResetPassword);

//Task router
router.post("/createTask", AuthVerify, TasksController.createTask);
router.get("/allTask",AuthVerify,TasksController.allTask);
router.post("/deleteTask/:id", AuthVerify, TasksController.deleteTask);
router.post("/updateStatus/:id/:status",AuthVerify,TasksController.updateStatus);
router.get("/listTaskByStatus/:status",AuthVerify,TasksController.listTaskByStatus);
router.get("/taskStatusCount", AuthVerify, TasksController.taskStatusCount);

module.exports = router;