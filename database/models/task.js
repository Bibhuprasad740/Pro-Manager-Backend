const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["high", "moderate", "low"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    checklists: [
      {
        id: {
          type: String,
          required: true,
        },
        checked: {
          type: Boolean,
          requierd: true,
          default: false,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["backlog", "todo", "ongoing", "done"],
      default: "todo",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
