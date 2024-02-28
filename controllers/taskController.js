const Task = require("../database/models/task");

exports.addTask = async (req, res) => {
  const task = req.body;
  try {
    if (!task) {
      return res.status(400).send("No task found!");
    }
    if (!task.priority) {
      return res.status(400).send("Priority is required!");
    }
    if (!task.title || task.title.trim().length === 0) {
      return res.status(400).send("Title is required!");
    }
    for (let checklist of task.checklists) {
      if (checklist.content.trim().length === 0) {
        return res.status(400).send("Invalid cheklist found!");
      }
    }

    const newTask = await new Task(task);
    await newTask.save();

    return res.status(200).send(newTask);
  } catch (error) {
    console.log("Error in taskController.addTask", error);
    return res.status(400).send("Something went wrong!");
  }
};

exports.getTasks = async (req, res) => {
  try {
    let { status, filter } = req.query;
    let today = new Date();

    let query = {};
    if (!status) {
      return res.status(400).send("Invalid request!");
    }

    query.status = status;

    if (!filter) {
      return res.status(400).send("Invalid request!");
    }

    filter = decodeURIComponent(filter || "");

    switch (filter) {
      case "This Week": {
        const sevenDaysAgo = new Date(today.getDate() - 7);

        query.createdAt = {
          $gte: sevenDaysAgo,
          $lte: today,
        };
        break;
      }
      case "Today": {
        today.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        query.createdAt = {
          $gte: today,
          $lte: endOfDay,
        };
        break;
      }
      case "This Month": {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        query.createdAt = {
          $gte: thirtyDaysAgo,
          $lte: today,
        };
        break;
      }
    }

    const tasks = await Task.find(query);
    console.log(tasks);

    res.status(200).send(tasks);
  } catch (error) {
    console.log("Error in taskController.getTasks", error);
    return res.status(400).send("Something went wrong!");
  }
};
