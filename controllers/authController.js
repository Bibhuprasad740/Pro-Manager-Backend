const User = require("../database/models/user");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const bcryptjs = require("bcryptjs");

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Email does not exist!");
    }

    const matched = await bcryptjs.compare(password, user.password);

    if (!matched) {
      return res.status(400).send("Password does not match!");
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "48h",
      }
    );

    console.log(token);

    return res.status(200).send({
      token,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      tasks: user.tasks,
    });
  } catch (error) {
    console.log("Error in authController.signIn", error);
    return res.status(400).send("Login Failed!");
  }
};

exports.signUp = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);
  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send("Please enter all the fields!");
    }
    if (!validator.validate(email)) {
      return res.status(400).send("Please enter a valid email!");
    }
    if (name.length < 3) {
      return res
        .status(400)
        .send("Name should be more than 3 characters long!");
    }
    if (password.length < 6) {
      return res.status(400).send("Password length should be more than 5!");
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send("Password and Confirm Password do not match!");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists!");
    }

    const user = await new User({
      name,
      email,
      password,
    });

    await user.save();

    return res.status(200).send(user);
  } catch (error) {
    console.log("Error in authController.signUp", error);
    return res.status(400).send("Error in creating user!");
  }
};
