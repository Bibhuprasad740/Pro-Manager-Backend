const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const Task = require("./task");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    return bcryptjs.hash(user.password, 12, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, next) {
  bcryptjs.compare(password, this.password, (error, matched) => {
    if (error) {
      return next(error, false);
    }

    return next(null, matched);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
