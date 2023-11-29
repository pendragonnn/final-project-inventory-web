const express = require("express");
const outletsController = require("../controller/outlet.controller");
const route = express.Router();
const { outletValidator } = require("../middleware/data.validator.middleware");

route.get("/", outletsController.allOutlets);
route.get("/:id", outletsController.outletById);
route.post("/", outletValidator, outletsController.postOutlet);
route.put("/:id", outletValidator, outletsController.updateOutlet);
route.delete("/:id", outletsController.removeOutlet);

module.exports = route;
