const express = require("express");
const transactiondetailController = require("../controller/transactiondetail.controller");
const route = express.Router();

route.get("/", transactiondetailController.allTransactionDetail);

route.get("/:id", transactiondetailController.transactionDetailById);

module.exports = route;
