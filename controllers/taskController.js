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
