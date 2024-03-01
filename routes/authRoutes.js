const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const checkAuthorization = require("../middlewares/authorization");

router.post("/signin", authController.signIn);

router.post("/signup", authController.signUp);

// /auth/abc/updaate
router.put("/update", checkAuthorization, authController.updateUserCredentials);

module.exports = router;
