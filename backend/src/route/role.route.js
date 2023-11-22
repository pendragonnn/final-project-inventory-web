const express = require("express");
const roleController = require("../controller/role.controller");
const route = express.Router();

route.get("/", roleController.allRoles);
route.get("/:id", roleController.roleById);

module.exports = route;
