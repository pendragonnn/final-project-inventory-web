const express = require("express")
const transactiondetailController = require("../controller/transaction.detail.controller")
const route = express.Router()

route.get("/:id", transactiondetailController.transactionDetailById)
route.get("/", transactiondetailController.allTransactionDetail)

module.exports = route
