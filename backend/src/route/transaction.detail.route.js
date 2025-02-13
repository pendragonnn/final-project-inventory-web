const express = require("express");
const transactiondetailController = require("../controller/transaction.detail.controller");
const transactionHeaderController = require("../controller/transaction.header.controller");
const route = express.Router();

route.get("/:id", transactiondetailController.transactionDetailById);
route.get("/", transactiondetailController.allTransactionDetail);
route.get("/Forecast/:itemId", transactionHeaderController.stockForecast);

module.exports = route;
