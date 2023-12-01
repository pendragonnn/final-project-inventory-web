const express = require("express");
const router = express.Router();
const authControllers = require("../controller/auth.controller");
const errorHandler = require("../middleware/error.handler.middleware");

router.post("/register", authControllers.userRegister);
router.post("/login", authControllers.userLogin);
router.delete("/logout", authControllers.userLogout);
router.post("/verify", authControllers.userEmail);
router.post("/reset", authControllers.userResetPassword);

router.use(errorHandler);

module.exports = router;
