// dependencies
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// database connect
const mongoConnect = require("./database/db");

// routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const checkAuthorization = require("./routes/authorization");

dotenv.config();

const app = express();

// server configuration
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.use(checkAuthorization);

app.use("/api", taskRoutes);

mongoConnect()
  .then((result) => {
    console.log("Connected Successfully!");
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.log(error);
  });
