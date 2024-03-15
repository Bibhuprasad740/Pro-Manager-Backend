const Task = require("../database/models/task");
const User = require("../database/models/user");

exports.addTask = async (req, res) => {
  let task = req.body;
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

    task.userId = req.userId;
    const newTask = await new Task(task);
    await newTask.save();

    return res.status(200).send(newTask);
  } catch (error) {
    console.log("Error in taskController.addTask", error);
    return res.status(400).send("Can not add task!");
  }
};

exports.assignTaskToUser = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { tasks: taskId } },
      { new: true }
    )
      .then((response) => {
        console.log(response);
        return res.status(200).send("Task added to user successfully!");
      })
      .catch((error) => {
        return res.status(400).send("Can not add task to user");
      });
  } catch (error) {
    console.log("Error in taskController.assignTaskToUser", error);
    return res.status(400).send("Can not assign task to user!");
  }
};

exports.getTasks = async (req, res) => {
  try {
    let { status, filter } = req.query;
    const userId = req.userId;
    let today = new Date();

    let query = {};
    if (!status) {
      return res.status(400).send("Invalid request!");
    }

    query.status = status;
    query.userId = userId;

    if (!filter) {
      return res.status(400).send("Invalid request!");
    }

    filter = decodeURIComponent(filter || "");

    switch (filter) {
      case "This Week": {
        const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
        console.log(sevenDaysAgo);

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

    res.status(200).send(tasks);
  } catch (error) {
    console.log("Error in taskController.getTasks", error);
    return res.status(400).send("Can not get tasks!");
  }
};

exports.getTasksBasedOnPriority = async (req, res) => {
  try {
    const { priority } = req.query;
    const userId = req.userId;
    if (!userId || !priority) {
      return res.status(400).send("Invalid user id or priority is invalid!");
    }
    const query = {
      userId,
      priority,
    };
    const tasks = await Task.find(query);

    res.status(200).send(tasks);
  } catch (error) {
    console.log("Error in taskController.getTasksBasedOnPriority", error);
    return res.status(400).send("Can not get tasks!");
  }
};

exports.getDueTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const query = {
      userId,
      status: { $ne: "done" },
      dueDate: { $ne: null, $lt: new Date() },
    };
    const dueTasks = await Task.find(query);

    return res.status(200).send(dueTasks);
  } catch (error) {
    console.log("Error in taskController.getDueTasks", error);
    return res.status(400).send("Can not get tasks!");
  }
};

exports.getTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(400).send("Can not get the task!");
    }
    res.status(200).send(task);
  } catch (error) {
    console.log("Error in taskController.getTask", error);
    return res.status(400).send("Can not get task!");
  }
};

exports.changeTaskStatus = async (req, res) => {
  try {
    const { taskId, newStatus } = req.body;

    if (!newStatus || !taskId) {
      console.log(
        "Error in taskController.changeTaskStatus. status or taskid is missing.."
      );
      return res.status(400).send("Invalid request!");
    }

    const validStatuses = ["backlog", "todo", "ongoing", "done"];
    if (!validStatuses.includes(newStatus)) {
      console.log(
        "Error in taskController.changeTaskStatus. Invalid status received!"
      );
      return res.status(400).send("Invalid status received!");
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { $set: { status: newStatus } },
      { new: true }
    );

    if (updatedTask) {
      res.status(200).send(updatedTask);
    } else {
      res.status(400).send("Task not found or status not updated!");
    }
  } catch (error) {
    console.log("Error in taskController.changeTaskStatus", error);
    return res.status(400).send("Can not change task status");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const result = await Task.deleteOne({ _id: taskId });

    if (result.deletedCount === 1) {
      res.status(200).send(taskId);
    } else {
      res.status(400).send("Task not found!");
    }
  } catch (error) {
    console.log("Error in taskController.changeTaskStatus", error);
    return res.status(400).send("Can not delete task!");
  }
};

exports.toggleCheck = async (req, res) => {
  try {
    const { taskId, checklistId, checked } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, "checklists._id": checklistId },
      { $set: { "checklists.$.checked": checked } },
      { new: true }
    );

    if (updatedTask) {
      res.status(200).send(updatedTask);
    } else {
      res.status(400).send("Task or checklist item not found or not updated.");
    }
  } catch (error) {
    console.log("Error in taskController.changeTaskStatus", error);
    return res.status(400).send("Can not delete task!");
  }
};

exports.editTask = async (req, res) => {
  try {
    const updatedTask = req.body;
    if (!updatedTask) {
      console.log("Please send a task.");
      return res.status(400).send("No task was found!");
    }

    const taskId = updatedTask._id;
    const oldTask = await Task.findById(taskId);

    if (!oldTask) {
      console.log("Invalid task id!");
      return res.status(400).send("Invalid task id");
    }

    oldTask.priority = updatedTask.priority;
    oldTask.title = updatedTask.title;
    oldTask.checklists = updatedTask.checklists;
    oldTask.dueDate = updatedTask.dueDate;
    oldTask.status = updatedTask.status;

    const task = await oldTask.save();

    return res.status(200).send(task);
  } catch (error) {
    console.log("Error in taskController.editTask", error);
    return res.status(400).send("Can not edit task!");
  }
};
