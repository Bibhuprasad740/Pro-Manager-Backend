const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const checkAuthorization = require("./authorization");

// /api/addTask
router.post("/addTask", checkAuthorization, taskController.addTask);

// /api/assignTaskToUser
router.patch(
  "/assignTaskToUser",
  checkAuthorization,
  taskController.assignTaskToUser
);

// /api/tasks ==> requires status and filter in query parameter
router.get("/tasks", checkAuthorization, taskController.getTasks);

router.get(
  "/getTasksBasedOnPriority",
  checkAuthorization,
  taskController.getTasksBasedOnPriority
);

// /api/tasks/dueTasks
router.get("/tasks/dueTasks", checkAuthorization, taskController.getDueTasks);

// /api/tasks/toggleCheck
router.put(
  "/tasks/toggleCheck",
  checkAuthorization,
  taskController.toggleCheck
);

// /api/tasks/changeTaskStatus => requires priority in query parameter
router.patch(
  "/tasks/changeTaskStatus",
  checkAuthorization,
  taskController.changeTaskStatus
);

// /api/deleteTask/abc
router.delete(
  "/deleteTask/:taskId",
  checkAuthorization,
  taskController.deleteTask
);

// /api/tasks/abc
router.get("/tasks/:taskId", taskController.getTask);

module.exports = router;
