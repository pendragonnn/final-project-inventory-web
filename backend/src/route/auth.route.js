const express = require("express");
const router = express.Router();
const authControllers = require("../controller/auth.controller");
const errorHandler = require("../middleware/error.handler.middleware");

router.post("/api/v1/register", authControllers.userRegister);
router.post("/api/v1/login", authControllers.userLogin);
router.delete("/api/v1/logout", authControllers.userLogout);
router.get("/api/v1/details", authControllers.userDetails);

router.use(errorHandler);

module.exports = router;
