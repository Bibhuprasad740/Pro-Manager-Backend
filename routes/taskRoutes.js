const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.post("/addTask", taskController.addTask);

module.exports = router;
