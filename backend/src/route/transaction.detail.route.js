const express = require("express");
const transactiondetailController = require("../controller/transaction.detail.controller");
const { transactionDetailValidator } = require("../middleware/data.validator.middleware");
const route = express.Router();


route.get("/", transactiondetailController.allTransactionDetail)
route.get("/:id", transactiondetailController.transactionDetailById)
route.post("/", transactionDetailValidator, transactiondetailController.postTransactionDetail)
route.put("/:id", transactionDetailValidator,transactiondetailController.updateTransactionDetail)
route.delete("/:id", transactiondetailController.removeTransactionDetail)

module.exports = route;
