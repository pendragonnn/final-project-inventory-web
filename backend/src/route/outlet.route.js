const express = require("express");
const outletsController = require("../controller/outlet.controller");
const route = express.Router();

route.get("/outlets", outletsController.allOutlets);
route.get("/outlets/:id", outletsController.outletById);
route.post("/outlets", outletsController.postOutlet);
route.put("/outlets/:id", outletsController.updateOutlet);
route.delete("/outlets/:id", outletsController.removeOutlet);

module.exports = route;
