const express = require("express");
const suppliersController = require("../controller/supplier.controller");
const route = express.Router();

route.get("/suppliers", suppliersController.allSuppliers);
route.get("/suppliers/:id", suppliersController.supplierById);
route.post("/suppliers", suppliersController.postSupplier);
route.put("/suppliers/:id", suppliersController.updateSupplier);
route.delete("/suppliers/:id", suppliersController.removeSupplier);

module.exports = route;
