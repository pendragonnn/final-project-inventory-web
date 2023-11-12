const express = require("express");
const route = express.Router();
const userCont = require("../controller/userCont");
const upload = require('../../config/multerConfig');

route.get("/users", userCont.getAllUser);
route.get("/users/:id", userCont.getUserById);
route.post("/users", userCont.createNewUser);
route.put("/users/:id", userCont.updateUserById);
route.delete("/users/:id", userCont.deleteUserById);
route.post("/users/upload/:id",upload.single('photo') ,userCont.uploadUserPhoto)

module.exports = route;
