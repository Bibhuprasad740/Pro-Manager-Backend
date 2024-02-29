const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

// /api/addTask
router.post("/addTask", taskController.addTask);

// /api/assignTaskToUser
router.patch("/assignTaskToUser", taskController.assignTaskToUser);

// /api/tasks
router.get("/tasks", taskController.getTasks);

// /api/tasks/changeTaskStatus
router.patch("/tasks/changeTaskStatus", taskController.changeTaskStatus);

// /api/deleteTask/abc
router.delete("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;
