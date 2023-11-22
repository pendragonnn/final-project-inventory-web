const express = require("express");
const suppliersController = require("../controller/supplier.controller");
const route = express.Router();
const {supplierValidator} = require('../middleware/data.validator.middleware')

route.get("/", suppliersController.allSuppliers);
route.get("/:id", suppliersController.supplierById);
route.post("/", supplierValidator, suppliersController.postSupplier);
route.put("/:id", supplierValidator, suppliersController.updateSupplier);
route.delete("/:id", suppliersController.removeSupplier);

module.exports = route;
