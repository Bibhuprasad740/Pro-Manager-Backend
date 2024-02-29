const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

// /api/addTask
router.post("/addTask", taskController.addTask);

// /api/assignTaskToUser
router.post("/assignTaskToUser", taskController.assignTaskToUser);

// /api/tasks
router.get("/tasks", taskController.getTasks);

// // /api/getBacklog
// router.get("/getBacklog", taskController.getBacklog);

// // /api/getTodo
// router.get("/getTodo", taskController.getTodo);

// // /api/getOnGoing
// router.get("/getOnGoing", taskController.getOnGoing);

// // /api/getDone
// router.get("/getDone", taskController.getDone);

module.exports = router;
