const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

// /api/addTask
router.post("/addTask", taskController.addTask);

// /api/assignTaskToUser
router.patch("/assignTaskToUser", taskController.assignTaskToUser);

// /api/tasks ==> requires status and filter in query parameter
router.get("/tasks", taskController.getTasks);

router.get("/getTasksBasedOnPriority", taskController.getTasksBasedOnPriority);

// /api/tasks/dueTasks
router.get("/tasks/dueTasks", taskController.getDueTasks);

// /api/tasks/toggleCheck
router.put("/tasks/toggleCheck", taskController.toggleCheck);

// /api/tasks/changeTaskStatus => requires priority in query parameter
router.patch("/tasks/changeTaskStatus", taskController.changeTaskStatus);

// /api/tasks/abc
router.get("/tasks/:taskId", taskController.getTask);

// /api/deleteTask/abc
router.delete("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;
