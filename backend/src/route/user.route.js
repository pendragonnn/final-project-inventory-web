const express = require("express");
const route = express.Router();
const userController = require("../controller/user.controller");
const {
	upload,
	uploadDir,
	multerErrorHandler,
} = require("../../config/multer.user.config");
const { userValidator } = require("../middleware/data.validator.middleware");

route.get("/", userController.allUsers);
route.get("/:id", userController.userById);
route.post("/", userValidator, userController.postUser);
route.put("/:id", userValidator, userController.updateUser);
route.delete("/:id", userController.removeUser);
route.post(
	"/upload/:id",
	upload.single("image_url"),
	multerErrorHandler,
	userController.uploadUserPhoto
);
route.post("/:id", userController.updatePassword);
route.use("/upload", express.static(uploadDir));

module.exports = route;
